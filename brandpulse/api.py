# BrandPulse API — complete flow:
# Brand Setup → Live Trends → Groq Ideas → fal.ai Video → Download

import json
import os
import re
import sys
import time
import uuid
import threading
import httpx
from typing import Optional

import requests
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

sys.path.insert(0, os.path.dirname(__file__))
from config import (
    APIFY_API_TOKEN, APIFY_ACTOR_ID, APIFY_RESULTS_PER_HASHTAG, APIFY_MEMORY_MBYTES,
    FAL_API_KEY, FAL_VIDEO_MODEL, FAL_POLL_INTERVAL, FAL_POLL_TIMEOUT,
    REPLICATE_API_TOKEN, REPLICATE_VIDEO_MODEL,
    GROQ_API_KEY, GROQ_MODEL, GROQ_API_BASE, GROQ_MAX_TOKENS,
)

app = FastAPI(title="BrandPulse API", version="2.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

# ── In-memory stores (persist to JSON for restarts) ───────────────────────────
BRAND_FILE  = os.path.join(os.path.dirname(__file__), "brand_config.json")
video_jobs  = {}   # job_id → {request_id, status, video_url, prompt, idea}

# ── Models ─────────────────────────────────────────────────────────────────────
class BrandConfig(BaseModel):
    name:        str
    tone:        str
    audience:    str
    competitors: list[str]
    hashtags:    list[str]
    industry:    Optional[str] = "Beauty & Skincare"

class GenerateRequest(BaseModel):
    brand:  BrandConfig
    trends: dict   # full trends summary object {posts, top_hashtags, gap_hashtag, …}

class VideoRequest(BaseModel):
    idea:  dict
    brand: BrandConfig

# ── Brand config persistence ───────────────────────────────────────────────────
@app.post("/api/brand")
def save_brand(config: BrandConfig):
    with open(BRAND_FILE, "w") as f:
        json.dump(config.model_dump(), f, indent=2)
    return {"status": "saved", "brand": config.model_dump()}

@app.get("/api/brand")
def get_brand():
    if os.path.exists(BRAND_FILE):
        with open(BRAND_FILE) as f:
            return json.load(f)
    return None

# ── Trend fetching ─────────────────────────────────────────────────────────────
def _fetch_apify(hashtags: list[str]) -> list[dict]:
    try:
        import requests
        import time

        if not APIFY_API_TOKEN or APIFY_API_TOKEN == "YOUR_APIFY_API_TOKEN":
            raise ValueError("No Apify token")

        actor_id = APIFY_ACTOR_ID.replace("/", "~")

        # Convert our hashtags into Instagram hashtag URLs.
        direct_urls = [
            f"https://www.instagram.com/explore/tags/{h.lstrip('#')}/"
            for h in hashtags
        ]

        run_url = (
            f"https://api.apify.com/v2/acts/"
            f"{actor_id}/runs"
        )

        run_input = {
            "directUrls": direct_urls,
            "resultsType": "posts",
            "resultsLimit": APIFY_RESULTS_PER_HASHTAG,
            "addParentData": False,
        }

        response = requests.post(
            run_url,
            params={"token": APIFY_API_TOKEN},
            json=run_input,
            timeout=60,
        )

        response.raise_for_status()

        run_data = response.json()["data"]

        run_id = run_data["id"]
        dataset_id = run_data["defaultDatasetId"]

        print(f"[Apify] started run: {run_id}")

        # Wait for the Actor to finish.
        status_url = (
            f"https://api.apify.com/v2/actor-runs/"
            f"{run_id}"
        )

        while True:
            status_response = requests.get(
                status_url,
                params={"token": APIFY_API_TOKEN},
                timeout=30,
            )

            status_response.raise_for_status()

            status_data = status_response.json()["data"]
            status = status_data.get("status")

            if status in {
                "SUCCEEDED",
                "FAILED",
                "ABORTED",
                "TIMED-OUT",
            }:
                break

            time.sleep(2)

        print(f"[Apify] run finished: {status}")

        if status != "SUCCEEDED":
            raise RuntimeError(
                f"Apify run ended with status: {status}"
            )

        # Retrieve the dataset.
        dataset_url = (
            f"https://api.apify.com/v2/datasets/"
            f"{dataset_id}/items"
        )

        dataset_response = requests.get(
            dataset_url,
            params={
                "token": APIFY_API_TOKEN,
                "format": "json",
            },
            timeout=60,
        )

        dataset_response.raise_for_status()

        raw_posts = dataset_response.json()

        posts = []

        for raw in raw_posts:
            caption = (raw.get("caption") or "").strip()

            if not caption or len(caption) < 10:
                continue

            raw_tags = raw.get("hashtags") or []

            tags = [
                f"#{str(t).lstrip('#')}"
                for t in raw_tags
                if t
            ][:8]

            if not tags:
                tags = [
                    f"#{m}"
                    for m in re.findall(
                        r"#(\w+)",
                        caption
                    )
                ][:8]

            likes = int(
                raw.get("likesCount") or 0
            )

            comments = int(
                raw.get("commentsCount") or 0
            )

            post_url = raw.get("url") or ""

            if not post_url and raw.get("shortCode"):
                post_url = (
                    f"https://instagram.com/p/"
                    f"{raw['shortCode']}"
                )

            posts.append({
                "post_id": str(
                    raw.get("id") or uuid.uuid4()
                ),
                "platform": "Instagram",
                "username": (
                    raw.get("ownerUsername")
                    or "unknown"
                ),
                "caption": caption[:300],
                "hashtags": tags,
                "likes": likes,
                "comments": comments,
                "shares": max(
                    int(likes * 0.05),
                    0
                ),
                "timestamp": (
                    raw.get("timestamp")
                    or raw.get("takenAtIso")
                    or ""
                ),
                "thumbnail": (
                    raw.get("displayUrl")
                    or raw.get("previewUrl")
                    or ""
                ),
                "post_url": post_url,
            })

        print(
            f"[Apify] fetched {len(posts)} real posts"
        )

        return posts

    except Exception as e:
        print(f"[Apify] failed: {e}")
        return []

INDUSTRY_DATA = {
    "Beauty & Skincare": {
        "captions": [
            "Your skin deserves only the best 🌿 Natural ingredients that actually work. No compromises.",
            "Glass skin is achievable. Our Vitamin C range makes it real ✨ Shop now.",
            "Ayurvedic wisdom meets modern science. Feel the difference 🌸 Toxin-free formula.",
            "We said NO to parabens before it was cool 💪 Clean beauty that delivers results.",
            "Real ingredients. Real results. Zero toxins 🌱 Your skin will thank you.",
            "Glow from within ☀️ Our new serum is packed with Niacinamide for that glass skin moment.",
        ],
        "usernames": ["glowwithme.in", "skincarebypriya", "beautyobsessed.ig", "cleanbeautychapter", "radiantindian"],
        "ideas": lambda brand, hashtags: [
            {
                "caption": f"Your skin is the planet's skin too 🌿 {brand.name}'s clean range — no toxins, no compromises.",
                "hashtags": hashtags[:2] + ["#NaturalGlow"],
                "image_prompt": f"Young Indian woman, radiant glowing skin, rooftop garden, golden hour, holding a minimalist serum bottle, 9:16 vertical frame, editorial beauty campaign, earthy tones — terracotta sage ivory.",
                "viral_score": 94,
                "rationale": "Sustainability + authenticity is the dominant value signal right now.",
            },
            {
                "caption": f"Glow is not a filter. It's a ritual 🌸 {brand.name} — science meets nature in every drop.",
                "hashtags": hashtags[:2] + ["#GlassSkin"],
                "image_prompt": f"Close-up of glowing Indian skin, single drop of amber serum falling from dropper, marble surface, saffron strands, warm candlelight, macro lens, 9:16 vertical, luxury editorial.",
                "viral_score": 87,
                "rationale": "Ritual-based skincare content consistently outperforms product-push posts by 3x.",
            },
            {
                "caption": f"Real ingredients. Real results 💪 {brand.name} Clean — because your skin deserves honesty.",
                "hashtags": hashtags[:2] + ["#SkincareRoutine"],
                "image_prompt": f"Overhead flat lay of {brand.name} products on white marble, eucalyptus leaves, white flowers, bright natural daylight, geometric arrangement, top-down shot, 9:16 vertical, studio photography.",
                "viral_score": 79,
                "rationale": "Ingredient transparency builds long-term brand trust and repeat purchaser loyalty.",
            },
        ]
    },
    "Fashion & Apparel": {
        "captions": [
            "Elevate your daily OOTD 👗 Sustainable fabrics meet street style aesthetics.",
            "Minimalist wardrobe staples that turn heads ✨ Wear your confidence.",
            "From runway inspiration to everyday drip 🔥 New collection drop live now.",
            "Crafted with eco-certified cotton. Comfort meets high fashion 🌿",
            "Step up your style game 👟 Handcrafted luxury tailored for your aesthetic.",
        ],
        "usernames": ["stylefile.in", "streetwearhub", "fashionforward", "ootd_diaries", "sustainablefit"],
        "ideas": lambda brand, hashtags: [
            {
                "caption": f"Streetwear meets sustainability 🧵 {brand.name}'s eco-cotton edit is here.",
                "hashtags": hashtags[:2] + ["#StreetwearStyle"],
                "image_prompt": f"Fashion model walking down a sunlit urban street, wearing oversized minimalist streetwear by {brand.name}, slow-motion stride, cinematic lighting, 9:16 vertical, high-fashion aesthetic.",
                "viral_score": 95,
                "rationale": "Eco-streetwear aesthetic is trending heavily with high engagement across Gen-Z.",
            },
            {
                "caption": f"Capsule wardrobe perfection 👗 5 pieces, 15 outfits with {brand.name}.",
                "hashtags": hashtags[:2] + ["#CapsuleWardrobe"],
                "image_prompt": f"Model seamlessly styling neutral clothing items against a concrete textured backdrop, soft studio lighting, smooth camera pan, 9:16 vertical, editorial lookbook.",
                "viral_score": 88,
                "rationale": "Versatile styling guides drive 4x higher save rates on Instagram Reels.",
            },
            {
                "caption": f"Bold statements only 🔥 Redefine your personal style with {brand.name}.",
                "hashtags": hashtags[:2] + ["#OOTDInspiration"],
                "image_prompt": f"Close-up shot of hand-stitched denim detail and luxury accessory by {brand.name}, vibrant urban neon rim light, moody contrast, 9:16 vertical, dynamic camera zoom.",
                "viral_score": 82,
                "rationale": "High-contrast macro detail shots build premium brand perception.",
            },
        ]
    },
    "Food & Beverage": {
        "captions": [
            "Start your morning with artisanal perfection ☕ Single-origin notes in every sip.",
            "Savor the flavor 🍕 Fresh organic ingredients packed into every bite.",
            "Plant-based indulgence that actually tastes heavenly 🌱 Order online.",
            "Fuel your hustle with raw cold-pressed juice 🍊 100% natural, 0 added sugar.",
            "Crafted for foodies, brewed with passion 🍵 Experience taste elevated.",
        ],
        "usernames": ["foodie_finds", "artisanalbrews", "gourmet_journal", "plantbasedeats", "taste_tracker"],
        "ideas": lambda brand, hashtags: [
            {
                "caption": f"Brewed for the movers & shakers ☕ Taste the {brand.name} artisanal difference.",
                "hashtags": hashtags[:2] + ["#ArtisanalCoffee"],
                "image_prompt": f"Barista pouring velvety steamed milk into dark espresso creating latte art for {brand.name}, warm ambient coffee shop lighting, macro lens, steam rising, 9:16 vertical reel.",
                "viral_score": 93,
                "rationale": "Sensory beverage pouring reels have one of the highest completion rates.",
            },
            {
                "caption": f"Clean ingredients, bold flavor 🥗 Fuel your day with {brand.name}.",
                "hashtags": hashtags[:2] + ["#GourmetEats"],
                "image_prompt": f"Vibrant fresh organic bowl by {brand.name} being assembled in slow-motion, colorful ingredients dropping, bright natural daylight, 9:16 vertical, appetizing gourmet camera shot.",
                "viral_score": 89,
                "rationale": "Action-based food prep footage generates strong intent and local discovery.",
            },
            {
                "caption": f"Sip into serenity 🍹 Refreshing, natural, zero added sugar by {brand.name}.",
                "hashtags": hashtags[:2] + ["#CleanSnacking"],
                "image_prompt": f"Iced sparkling botanical drink with mint garnish on marble surface, condensation dripping off glass, summer sun flare, 9:16 vertical, cinematic slow-mo.",
                "viral_score": 81,
                "rationale": "Zero-sugar health positioning captures wellness-conscious foodies.",
            },
        ]
    },
    "Fitness & Wellness": {
        "captions": [
            "Crush your personal record today 💪 High-intensity workouts built for results.",
            "Fuel your transformation 🔥 Clean plant protein that tastes amazing.",
            "Find your inner peace and core strength 🧘‍♀️ Daily mindfulness and movement.",
            "Performance activewear engineered for maximum mobility 🏋️‍♂️ Feel the power.",
            "Hydrate, restore, conquer 💦 Science-backed recovery for peak performance.",
        ],
        "usernames": ["fitlife_daily", "iron_mindset", "wellness_guru", "activepulse", "shredded_journal"],
        "ideas": lambda brand, hashtags: [
            {
                "caption": f"Break boundaries, set new standards 💪 {brand.name} performance gear.",
                "hashtags": hashtags[:2] + ["#WorkoutMotivation"],
                "image_prompt": f"Athlete tying {brand.name} performance shoe and sprinting out of starting blocks, dramatic high-contrast gym lighting, sweat glistening, 9:16 vertical, high-energy cinematic workout reel.",
                "viral_score": 96,
                "rationale": "High-intensity athletic motivation drives massive engagement and shares.",
            },
            {
                "caption": f"Mindful movement for a strong core 🧘‍♀️ Find your balance with {brand.name}.",
                "hashtags": hashtags[:2] + ["#MindfulMovement"],
                "image_prompt": f"Woman performing a fluid yoga transition on a sunlit wooden deck overlooking nature, serene atmosphere, soft morning sunbeams, 9:16 vertical, peaceful aesthetic.",
                "viral_score": 87,
                "rationale": "Mindfulness reels trigger emotional resonance and high bookmarking rates.",
            },
            {
                "caption": f"Clean fuel for maximum recovery ⚡ {brand.name} nutrition.",
                "hashtags": hashtags[:2] + ["#CleanNutrition"],
                "image_prompt": f"Nutritional smoothie bowl being sprinkled with chia seeds and berries, crisp kitchen counter setting, energetic camera movement, 9:16 vertical.",
                "viral_score": 80,
                "rationale": "Post-workout nutrition recipes appeal directly to active lifestyle consumers.",
            },
        ]
    },
    "Tech & Gadgets": {
        "captions": [
            "Unboxing the future of smart audio 🎧 Active noise cancellation at its finest.",
            "Level up your desk setup 💻 Ergonomic design meets sleek minimalism.",
            "Next-gen battery life for non-stop productivity 🔋 Built for creators.",
            "Control your environment with one touch 🤖 The ultimate smart home ecosystem.",
            "Lightweight. Ultra-fast. Unstoppable ⚡ High-performance tech reimagined.",
        ],
        "usernames": ["tech_radar", "desk_setup_goals", "gadget_geek", "future_tech_in", "digital_nomad_gear"],
        "ideas": lambda brand, hashtags: [
            {
                "caption": f"Silence the noise, unleash your focus 🎧 {brand.name} audio excellence.",
                "hashtags": hashtags[:2] + ["#TechSetup"],
                "image_prompt": f"Cinematic close-up of sleek matte-black wireless headphones by {brand.name} being placed on, LED glow accents, dark minimalist setup, 9:16 vertical, tech commercial look.",
                "viral_score": 94,
                "rationale": "Sleek hardware lighting and ASMR product reveals excel in tech trends.",
            },
            {
                "caption": f"The ultimate workspace aesthetic 💻 Work smarter with {brand.name}.",
                "hashtags": hashtags[:2] + ["#DeskSetup"],
                "image_prompt": f"Clean minimalist desk setup with ambient warm light bar, mechanical keyboard typing, smooth camera slide across {brand.name} workspace accessories, 9:16 vertical reel.",
                "viral_score": 90,
                "rationale": "Desk setup inspiration reels have high viral reach among professionals and students.",
            },
            {
                "caption": f"Future tech in your palm ⚡ Unmatched power by {brand.name}.",
                "hashtags": hashtags[:2] + ["#GadgetUnboxing"],
                "image_prompt": f"Futuristic slim gadget by {brand.name} rotating in mid-air with subtle holographic reflections, studio black background, 9:16 vertical.",
                "viral_score": 83,
                "rationale": "Holographic/studio lighting aesthetics convey innovation and cutting-edge engineering.",
            },
        ]
    },
    "Home & Lifestyle": {
        "captions": [
            "Transform your living space into a serene sanctuary 🌿 Aesthetic decor essentials.",
            "Minimalist design, maximum cozy vibes 🛋️ Crafted for modern living.",
            "Plant parenthood made simple 🌱 Bring nature inside with self-watering planters.",
            "Sustainable bamboo kitchenware for eco-conscious homes ☕ Upgrade your space.",
            "Organized clutter-free bliss 📦 Smart storage solutions that look stunning.",
        ],
        "usernames": ["cozy_corner_in", "minimalist_home", "decor_inspiration", "nesting_vibes", "plant_parent_life"],
        "ideas": lambda brand, hashtags: [
            {
                "caption": f"Turn your home into a sanctuary 🌿 {brand.name} interior accents.",
                "hashtags": hashtags[:2] + ["#HomeDecor"],
                "image_prompt": f"Sun-drenched living room with lush green indoor plants, warm beige linen sofa with {brand.name} cushions, gentle breeze moving curtains, 9:16 vertical, architectural digest feel.",
                "viral_score": 92,
                "rationale": "Sanctuary-focused interior transformations consistently top home & lifestyle trends.",
            },
            {
                "caption": f"Minimalism that feels like warmth 🛋️ Crafted by {brand.name}.",
                "hashtags": hashtags[:2] + ["#CozyVibes"],
                "image_prompt": f"Hand pouring tea into a ceramic cup on a natural oak table from {brand.name}, cozy knit throw blanket in background, soft evening light, 9:16 vertical.",
                "viral_score": 86,
                "rationale": "Cozy aesthetic visuals drive high moodboard bookmarking.",
            },
            {
                "caption": f"Organized living made beautiful ✨ {brand.name} lifestyle.",
                "hashtags": hashtags[:2] + ["#OrganizationHacks"],
                "image_prompt": f"Satisfying organization of a wooden shelf pantry with {brand.name} containers, sleek glass jars being arranged, high-definition aesthetic, 9:16 vertical.",
                "viral_score": 84,
                "rationale": "Restock and organization satisfying reels attract high replay loops.",
            },
        ]
    },
    "Travel & Hospitality": {
        "captions": [
            "Escape to paradise 🏝️ Uncover hidden coastal gems off the beaten path.",
            "Luxury boutique living in the heart of the mountains ⛰️ Book your weekend getaway.",
            "Wanderlust calling ✈️ Pack light, travel far, and capture every memory.",
            "Authentic local flavors and unforgettable sunset views 🌅 Pure bliss.",
            "Experience hospitality redefined 🥂 Unmatched comfort meets local heritage.",
        ],
        "usernames": ["wanderlust_diaries", "hidden_escapes", "luxury_traveler", "roam_free_in", "passport_stories"],
        "ideas": lambda brand, hashtags: [
            {
                "caption": f"Uncover hidden paradises ✈️ Let {brand.name} take you there.",
                "hashtags": hashtags[:2] + ["#Wanderlust"],
                "image_prompt": f"Breathtaking drone view flying over turquoise ocean waters towards a tropical cliffside villa hosted by {brand.name}, golden hour sunlight, 9:16 vertical travel reel.",
                "viral_score": 97,
                "rationale": "Aerial landscape perspectives trigger immediate travel wanderlust and sharing.",
            },
            {
                "caption": f"Wanderlust in every step 🌄 Escape the ordinary with {brand.name}.",
                "hashtags": hashtags[:2] + ["#HiddenGems"],
                "image_prompt": f"Traveler standing at a mountain summit viewpoint with mist floating below, sunrise casting a warm orange glow, cinematic 9:16 vertical.",
                "viral_score": 89,
                "rationale": "Hidden gem discovery reels generate massive comments asking for coordinates.",
            },
            {
                "caption": f"Boutique luxury redefined 🥂 Experience {brand.name}.",
                "hashtags": hashtags[:2] + ["#LuxuryTravel"],
                "image_prompt": f"Private infinity pool overlooking a starry night skyline with soft lantern glow, champagne glass in hand, 9:16 vertical reel.",
                "viral_score": 85,
                "rationale": "Luxury hospitality visual storytelling attracts high-intent travel buyers.",
            },
        ]
    },
    "Education": {
        "captions": [
            "Master coding in 30 days 💻 Interactive learning modules built for fast growth.",
            "Study hacks to boost your productivity by 10x 📚 Work smarter, not harder.",
            "Unlock your career potential 🚀 Learn high-demand skills from industry experts.",
            "Speak fluently with daily 5-minute bite-sized lessons 🗣️ Practical learning.",
            "Transform how you manage time ⏳ Simple systems for effortless focus.",
        ],
        "usernames": ["skillup_daily", "study_hacks_in", "career_growth_lab", "future_learners", "code_with_ease"],
        "ideas": lambda brand, hashtags: [
            {
                "caption": f"Learn skills that unlock your future 💡 Study smarter with {brand.name}.",
                "hashtags": hashtags[:2] + ["#StudyHacks"],
                "image_prompt": f"Student focused at an illuminated study desk with {brand.name} courseware, taking digital notes on a tablet, clear visual charts floating, 9:16 vertical, inspiring educational reel.",
                "viral_score": 93,
                "rationale": "Actionable study hacks consistently garner high save rates from students and professionals.",
            },
            {
                "caption": f"Code your way to the top 💻 {brand.name} masterclasses.",
                "hashtags": hashtags[:2] + ["#LearnCoding"],
                "image_prompt": f"Fast-paced macro shot of glowing lines of code on a monitor running {brand.name} projects, sleek dark room with purple ambient lighting, 9:16 vertical.",
                "viral_score": 88,
                "rationale": "Tech skill tutorials attract highly motivated learners with strong conversion.",
            },
            {
                "caption": f"5-minute daily productivity hacks 📚 Powered by {brand.name}.",
                "hashtags": hashtags[:2] + ["#ProductivityTips"],
                "image_prompt": f"Hands organizing a bullet journal with aesthetic stationery, quick time-lapse of task completion, 9:16 vertical.",
                "viral_score": 82,
                "rationale": "Time-saving routines generate rapid shares among ambitious creators.",
            },
        ]
    },
}

def _get_industry_data(industry: Optional[str]):
    ind = industry or "Beauty & Skincare"
    if ind in INDUSTRY_DATA:
        return INDUSTRY_DATA[ind]
    return INDUSTRY_DATA["Beauty & Skincare"]

def _mock_trends(hashtags: list[str], brand: Optional[BrandConfig] = None) -> list[dict]:
    import random
    industry = brand.industry if brand and brand.industry else "Beauty & Skincare"
    data = _get_industry_data(industry)
    captions = data["captions"]
    usernames = data["usernames"]

    posts = []
    for i in range(20):
        ht = random.choice(hashtags) if hashtags else "#Trending"
        likes = random.randint(500, 45000)
        posts.append({
            "post_id":   str(uuid.uuid4()),
            "platform":  "Instagram",
            "username":  random.choice(usernames),
            "caption":   random.choice(captions),
            "hashtags":  random.sample(hashtags, min(3, len(hashtags))) if len(hashtags)>=3 else hashtags,
            "likes":     likes,
            "comments":  random.randint(20, int(likes * 0.08)),
            "shares":    random.randint(5, int(likes * 0.05)),
            "timestamp": "",
            "thumbnail": "",
            "post_url":  "",
        })
    return posts

def _build_trend_summary(posts: list[dict], brand: BrandConfig) -> dict:
    """Aggregate posts into trend signals for the prompt and UI."""
    from collections import Counter
    all_tags = [t for p in posts for t in p["hashtags"]]
    tag_counts = Counter(all_tags)

    # Engagement per hashtag
    tag_engagement = {}
    for p in posts:
        eng = p["likes"] + p["comments"]
        for t in p["hashtags"]:
            tag_engagement.setdefault(t, []).append(eng)
    tag_avg_eng = {t: int(sum(v)/len(v)) for t, v in tag_engagement.items()}

    # Competitor mentions
    comp_lower = [c.lower() for c in (brand.competitors or [])]
    competitor_posts = [p for p in posts if any(c in p["caption"].lower() or c in p["username"].lower() for c in comp_lower)]

    top_tags = sorted(tag_avg_eng.items(), key=lambda x: x[1], reverse=True)

    # Gap: hashtags with no brand mentions but high competitor activity
    brand_lower  = brand.name.lower()
    brand_posts  = [p for p in posts if brand_lower in p["caption"].lower() or brand_lower in p["username"].lower()]
    brand_tags   = {t for p in brand_posts for t in p["hashtags"]}
    gap_tags     = [(t, e) for t, e in top_tags if t not in brand_tags]

    return {
        "posts":          posts[:12],
        "top_hashtags":   [{"tag": t, "avg_engagement": e, "count": tag_counts.get(t, 0)} for t, e in top_tags[:8]],
        "competitor_count": len(competitor_posts),
        "brand_post_count": len(brand_posts),
        "gap_hashtag":    gap_tags[0][0] if gap_tags else (brand.hashtags[0] if brand.hashtags else "#Trending"),
        "gap_engagement": gap_tags[0][1] if gap_tags else 0,
        "total_posts":    len(posts),
    }

@app.post("/api/trends")
def get_trends(brand: BrandConfig):
    hashtags = brand.hashtags or ["#Trending"]
    posts    = _fetch_apify(hashtags)
    if not posts:
        posts = _mock_trends(hashtags, brand)
    summary  = _build_trend_summary(posts, brand)
    return summary

# ── Groq content generation ────────────────────────────────────────────────────
def _call_groq(system_prompt: str) -> list[dict]:
    if not GROQ_API_KEY or GROQ_API_KEY == "YOUR_GROQ_API_KEY":
        raise ValueError("GROQ_API_KEY not set")

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": GROQ_MODEL,
        "messages": [
            {
                "role": "system",
                "content": system_prompt,
            },
            {
                "role": "user",
                "content": (
                    "Generate the 3 ideas now. "
                    "Return ONLY one complete valid JSON array. "
                    "Do not use markdown. "
                    "Do not add any text before or after the JSON."
                ),
            },
        ],
        "max_completion_tokens": GROQ_MAX_TOKENS,
        "temperature": 0.7,
    }

    resp = requests.post(
        GROQ_API_BASE,
        headers=headers,
        json=payload,
        timeout=60,
    )

    resp.raise_for_status()

    data = resp.json()

    content = (
        data["choices"][0]["message"]["content"]
        .strip()
    )

    # Remove accidental markdown fences.
    if content.startswith("```"):
        content = content.split("```", 2)[1]

        if content.lstrip().startswith("json"):
            content = content.lstrip()[4:]

        content = content.strip()

    # Find the JSON array if the model accidentally
    # included a small amount of extra text.
    start = content.find("[")
    end = content.rfind("]")

    if start == -1 or end == -1 or end <= start:
        raise ValueError(
            "Groq did not return a JSON array"
        )

    content = content[start:end + 1]

    ideas = json.loads(content)

    if not isinstance(ideas, list):
        raise ValueError("Groq response is not a list")

    return ideas

def _mock_ideas(brand: BrandConfig) -> list[dict]:
    industry = brand.industry if brand and brand.industry else "Beauty & Skincare"
    data = _get_industry_data(industry)
    hashtags = brand.hashtags or ["#Trending"]
    return data["ideas"](brand, hashtags)

@app.post("/api/generate")
def generate_ideas(req: GenerateRequest):
    brand = req.brand
    trends = req.trends

    top_tags = trends.get("top_hashtags", [])

    top_tag = (
        top_tags[0]["tag"]
        if top_tags
        else (
            brand.hashtags[0]
            if brand.hashtags
            else "#Trending"
        )
    )

    top_eng = (
        top_tags[0]["avg_engagement"]
        if top_tags
        else 0
    )

    rise_tag = (
        top_tags[1]["tag"]
        if len(top_tags) > 1
        else (
            brand.hashtags[1]
            if len(brand.hashtags) > 1
            else top_tag
        )
    )

    gap_tag = trends.get(
        "gap_hashtag",
        top_tag
    )

    comp_str = (
        ", ".join(brand.competitors)
        if brand.competitors
        else "Competitors"
    )

    prompt = f"""
You are the Creative Director for {brand.name}.

Industry: {brand.industry}
Brand tone: {brand.tone}
Target audience: {brand.audience}

LIVE INSTAGRAM TREND DATA:
Top hashtag: {top_tag}
Average engagement: {top_eng}
Rising hashtag: {rise_tag}
Competitor gap: {comp_str} are dominating {gap_tag}
Total posts analysed: {trends.get("total_posts", 0)}

Create exactly 3 DIFFERENT Instagram Reel concepts.

Every idea must be specifically relevant to:
- {brand.name}
- {brand.industry}
- {brand.tone}
- {brand.audience}
- the current trend data above

IMPORTANT:
Return exactly 3 objects.
Keep every field concise so the JSON is guaranteed to finish.

Each object MUST contain:

caption:
Maximum 150 characters.
Punchy.
Include 1-2 emojis.

hashtags:
Exactly 3 hashtags.
The first hashtag MUST be {top_tag}.

image_prompt:
Maximum 350 characters.
Describe the Reel visually:
lighting, talent, colours, props, camera angle,
9:16 vertical format and motion.

viral_score:
Integer from 1 to 100 based ONLY on trend alignment.

rationale:
One short sentence explaining why the idea matches the current trends.

Return ONLY valid JSON.
No markdown.
No code fences.
No explanation.

Example structure:

[
  {{
    "caption": "short caption",
    "hashtags": ["{top_tag}", "#example", "#example2"],
    "image_prompt": "vertical 9:16 ...",
    "viral_score": 85,
    "rationale": "Matches the rising trend because ..."
  }},
  {{
    "caption": "short caption",
    "hashtags": ["{top_tag}", "#example", "#example2"],
    "image_prompt": "vertical 9:16 ...",
    "viral_score": 82,
    "rationale": "Connects with ..."
  }},
  {{
    "caption": "short caption",
    "hashtags": ["{top_tag}", "#example", "#example2"],
    "image_prompt": "vertical 9:16 ...",
    "viral_score": 79,
    "rationale": "Uses ..."
  }}
]
"""

    try:
        ideas = _call_groq(prompt)

        if not isinstance(ideas, list):
            raise ValueError("Groq response is not a list")

        if len(ideas) < 3:
            raise ValueError(
                f"Groq returned only {len(ideas)} ideas"
            )

        clean_ideas = []

        for idea in ideas[:3]:

            if not isinstance(idea, dict):
                continue

            idea["caption"] = str(
                idea.get("caption") or ""
            )[:150]

            idea["image_prompt"] = str(
                idea.get("image_prompt") or ""
            )[:500]

            idea["rationale"] = str(
                idea.get("rationale") or ""
            )

            hashtags = idea.get("hashtags")

            if not isinstance(hashtags, list):
                hashtags = []

            hashtags = [
                str(tag)
                for tag in hashtags
                if tag
            ][:3]

            if top_tag not in hashtags:
                hashtags.insert(0, top_tag)

            idea["hashtags"] = hashtags[:3]

            try:
                idea["viral_score"] = max(
                    1,
                    min(
                        100,
                        int(
                            idea.get(
                                "viral_score",
                                80
                            )
                        ),
                    ),
                )
            except (TypeError, ValueError):
                idea["viral_score"] = 80

            clean_ideas.append(idea)

        if len(clean_ideas) < 3:
            raise ValueError(
                "Could not validate 3 complete ideas"
            )

        print(
            "[Groq] generated 3 AI ideas successfully"
        )

        return {
            "ideas": clean_ideas,
            "source": "groq",
        }

    except Exception as e:
        print(
            f"[Groq] failed: {e} — using mock ideas"
        )

        return {
            "ideas": _mock_ideas(brand),
            "source": "mock",
        }
# ── fal.ai video generation ────────────────────────────────────────────────────
def _fal_headers():
    return {"Authorization": f"Key {FAL_API_KEY}", "Content-Type": "application/json"}

def _poll_fal(job_id: str, request_id: str):
    """Poll fal.ai queue until COMPLETED or FAILED."""
    poll_url = f"https://queue.fal.run/{FAL_VIDEO_MODEL}/requests/{request_id}/status"
    elapsed  = 0
    while elapsed < FAL_POLL_TIMEOUT:
        time.sleep(FAL_POLL_INTERVAL)
        elapsed += FAL_POLL_INTERVAL
        try:
            r      = requests.get(poll_url, headers=_fal_headers(), timeout=15)
            status = r.json().get("status", "UNKNOWN")
            video_jobs[job_id]["fal_status"] = status
            print(f"[fal.ai] {elapsed}s — {status}")
            if status == "COMPLETED":
                res_url   = f"https://queue.fal.run/{FAL_VIDEO_MODEL}/requests/{request_id}"
                res       = requests.get(res_url, headers=_fal_headers(), timeout=15)
                video_url = res.json()["video"]["url"]
                video_jobs[job_id].update({"status": "ready", "video_url": video_url})
                print(f"[fal.ai] ✓ video ready: {video_url[:80]}")
                return
            if status == "FAILED":
                raise RuntimeError("fal.ai returned FAILED status")
        except Exception as e:
            print(f"[fal.ai poll error] {e}")
            break
    video_jobs[job_id].update({"status": "failed", "error": "fal.ai timeout/failed", "is_mock": True})


def _poll_replicate(job_id: str, prediction_id: str):
    """Poll Replicate prediction until succeeded or failed."""
    url     = f"https://api.replicate.com/v1/predictions/{prediction_id}"
    headers = {"Authorization": f"Bearer {REPLICATE_API_TOKEN}", "Content-Type": "application/json"}
    elapsed = 0
    while elapsed < FAL_POLL_TIMEOUT:
        time.sleep(FAL_POLL_INTERVAL)
        elapsed += FAL_POLL_INTERVAL
        try:
            r    = requests.get(url, headers=headers, timeout=15)
            data = r.json()
            st   = data.get("status", "")
            print(f"[Replicate] {elapsed}s — {st}")
            if st == "succeeded":
                output    = data.get("output")
                video_url = output[0] if isinstance(output, list) else output
                video_jobs[job_id].update({"status": "ready", "video_url": video_url})
                print(f"[Replicate] ✓ video ready: {str(video_url)[:80]}")
                return
            if st in ("failed", "canceled"):
                err = data.get("error", "Replicate generation failed")
                raise RuntimeError(err)
        except Exception as e:
            print(f"[Replicate poll error] {e}")
            break
    video_jobs[job_id].update({"status": "failed", "error": "Replicate timeout/failed", "is_mock": True})

@app.post("/api/video")
def start_video(req: VideoRequest, background_tasks: BackgroundTasks):
    idea  = req.idea
    brand = req.brand

    job_id = str(uuid.uuid4())
    enhanced_prompt = (
        f"{idea.get('image_prompt', '')}. "
        f"Brand: {brand.name}. Tone: {brand.tone}. "
        "Vertical 9:16 format for Instagram Reels. Cinematic quality. "
        "Smooth motion. No text overlay. 6 seconds."
    )

    video_jobs[job_id] = {
        "status":    "generating",
        "video_url": None,
        "idea":      idea,
        "brand":     brand.name,
        "prompt":    enhanced_prompt,
        "is_mock":   False,
    }

    # ── Try fal.ai first ──────────────────────────────────────────────────────
    fal_ok = FAL_API_KEY and FAL_API_KEY != "YOUR_FAL_API_KEY"
    rep_ok = REPLICATE_API_TOKEN and REPLICATE_API_TOKEN != "YOUR_REPLICATE_API_TOKEN"

    if fal_ok:
        try:
            print(f"[fal.ai] submitting to {FAL_VIDEO_MODEL} …")
            submit = requests.post(
                f"https://queue.fal.run/{FAL_VIDEO_MODEL}",
                headers=_fal_headers(),
                json={"prompt": enhanced_prompt, "aspect_ratio": "9:16", "duration": "8s"},
                timeout=30,
            )
            print(f"[fal.ai] {submit.status_code} — {submit.text[:200]}")
            if submit.status_code == 403 and "Exhausted balance" in submit.text:
                raise RuntimeError("fal.ai balance exhausted — trying Replicate fallback")
            submit.raise_for_status()
            request_id = submit.json()["request_id"]
            video_jobs[job_id]["request_id"] = request_id
            video_jobs[job_id]["provider"]   = "fal.ai"
            threading.Thread(target=_poll_fal, args=(job_id, request_id), daemon=True).start()
            return {"job_id": job_id, "status": "generating", "provider": "fal.ai"}
        except Exception as e:
            print(f"[fal.ai] failed: {e}")
            video_jobs[job_id]["fal_error"] = str(e)
            # Fall through to Replicate

    # ── Fallback: Replicate ───────────────────────────────────────────────────
    if rep_ok:
        try:
            print(f"[Replicate] submitting {REPLICATE_VIDEO_MODEL} …")
            r = requests.post(
                f"https://api.replicate.com/v1/models/{REPLICATE_VIDEO_MODEL}/predictions",
                headers={"Authorization": f"Bearer {REPLICATE_API_TOKEN}", "Content-Type": "application/json"},
                json={"input": {"prompt": enhanced_prompt, "aspect_ratio": "9:16"}},
                timeout=30,
            )
            print(f"[Replicate] {r.status_code} — {r.text[:200]}")
            r.raise_for_status()
            pred_id = r.json()["id"]
            video_jobs[job_id]["provider"] = "replicate"
            threading.Thread(target=_poll_replicate, args=(job_id, pred_id), daemon=True).start()
            return {"job_id": job_id, "status": "generating", "provider": "replicate"}
        except Exception as e:
            print(f"[Replicate] failed: {e}")
            video_jobs[job_id].update({"status": "failed", "error": str(e), "is_mock": True})
            return {"job_id": job_id, "status": "failed"}

    # ── No keys configured ────────────────────────────────────────────────────
    video_jobs[job_id].update({"status": "no_key", "is_mock": True})

    return {"job_id": job_id, "status": "generating"}

@app.get("/api/video/{job_id}")
def get_video_status(job_id: str):
    job = video_jobs.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return {
        "job_id":    job_id,
        "status":    job["status"],
        "video_url": job.get("video_url"),
        "is_mock":   job.get("is_mock", False),
        "error":     job.get("error"),
        "fal_status":job.get("fal_status"),
        "idea":      job.get("idea"),
        "brand":     job.get("brand"),
    }

@app.get("/api/download/{job_id}")
def download_video(job_id: str):
    """Proxy the video through our server so the browser download works cross-origin."""
    job = video_jobs.get(job_id)
    if not job or not job.get("video_url"):
        raise HTTPException(status_code=404, detail="Video not ready")
    video_url = job["video_url"]
    brand     = (job.get("brand") or "brandpulse").replace(" ", "_").lower()
    filename  = f"{brand}_reel.mp4"

    def stream():
        with httpx.stream("GET", video_url) as r:
            for chunk in r.iter_bytes(chunk_size=8192):
                yield chunk

    return StreamingResponse(
        stream(),
        media_type="video/mp4",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=False)
