import { useState } from 'react'
import {
  ArrowRight,
  Check,
  Plus,
  Sparkles,
  Target,
  X,
  Zap,
} from 'lucide-react'

const TONES = [
  { value: 'Bold & Edgy', label: 'Bold & Edgy' },
  { value: 'Luxury & Refined', label: 'Luxury & Refined' },
  { value: 'Playful & Fun', label: 'Playful & Fun' },
  { value: 'Educational', label: 'Educational' },
  { value: 'Sustainable & Conscious', label: 'Sustainable' },
  { value: 'Empowering', label: 'Empowering' },
  { value: 'Minimalist & Clean', label: 'Minimalist' },
  { value: 'Youthful & Gen-Z', label: 'Youthful / Gen-Z' },
]

const INDUSTRIES = [
  'Beauty & Skincare',
  'Fashion & Apparel',
  'Food & Beverage',
  'Fitness & Wellness',
  'Tech & Gadgets',
  'Home & Lifestyle',
  'Travel & Hospitality',
  'Education',
  'Other',
]

const INDUSTRY_PRESETS = {
  'Beauty & Skincare': {
    hashtags: ['#CleanBeauty', '#SkincareRoutine', '#NaturalGlow'],
    competitors: ['Mamaearth', 'Plum'],
  },
  'Fashion & Apparel': {
    hashtags: ['#OOTD', '#StreetStyle', '#FashionReels'],
    competitors: ['H&M', 'Zara'],
  },
  'Food & Beverage': {
    hashtags: ['#Foodie', '#FoodReels', '#FoodLovers'],
    competitors: ['Swiggy', 'Zomato'],
  },
  'Fitness & Wellness': {
    hashtags: ['#FitnessMotivation', '#Workout', '#Wellness'],
    competitors: ['Cult.fit', 'HealthifyMe'],
  },
  'Tech & Gadgets': {
    hashtags: ['#TechTok', '#TechNews', '#Gadgets'],
    competitors: ['Nothing', 'OnePlus'],
  },
  'Home & Lifestyle': {
    hashtags: ['#HomeDecor', '#InteriorDesign', '#HomeInspo'],
    competitors: ['IKEA', 'Home Centre'],
  },
  'Travel & Hospitality': {
    hashtags: ['#TravelReels', '#TravelIndia', '#Wanderlust'],
    competitors: ['MakeMyTrip', 'Airbnb'],
  },
  Education: {
    hashtags: ['#StudyTips', '#StudentLife', '#Education'],
    competitors: ['Unacademy', 'Physics Wallah'],
  },
}

function TagInput({
  label,
  tags,
  setTags,
  placeholder,
}) {
  const [value, setValue] = useState('')

  function addTag() {
    const clean = value.trim()

    if (!clean) return

    if (!tags.includes(clean)) {
      setTags([...tags, clean])
    }

    setValue('')
  }

  function removeTag(tag) {
    setTags(tags.filter((item) => item !== tag))
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <div>
      <label className="field-label">
        {label}
      </label>

      <div className="input-base min-h-[50px] flex flex-wrap items-center gap-2 px-3 py-2">

        {tags.map((tag) => (
          <span
            key={tag}
            className="pill pill-accent flex items-center gap-1.5"
          >
            {tag}

            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="opacity-60 hover:opacity-100"
            >
              <X size={11} />
            </button>
          </span>
        ))}

        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={tags.length ? 'Add another...' : placeholder}
          className="flex-1 min-w-[120px] bg-transparent outline-none border-none"
          style={{
            color: 'var(--text)',
            fontSize: '13px',
          }}
        />

        <button
          type="button"
          onClick={addTag}
          className="flex items-center justify-center w-7 h-7 rounded-full transition"
          style={{
            background: 'rgba(99,230,190,0.08)',
            color: 'var(--accent)',
          }}
        >
          <Plus size={14} />
        </button>

      </div>
    </div>
  )
}

function PreviewPanel({ form }) {
  return (
    <div className="relative hidden lg:block min-h-[650px]">

      <div
        className="absolute inset-0 rounded-[32px] overflow-hidden"
        style={{
          background: `
            radial-gradient(
              circle at 70% 25%,
              rgba(99,230,190,0.13),
              transparent 35%
            ),
            radial-gradient(
              circle at 20% 80%,
              rgba(155,140,255,0.08),
              transparent 35%
            ),
            var(--surface)
          `,
          border: '1px solid var(--border)',
        }}
      >

        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className="absolute top-7 left-7 right-7 flex items-center justify-between">
          <span className="eyebrow">
            <span className="live-dot" />
            BRAND INTELLIGENCE
          </span>

          <span className="font-mono text-[10px] text-muted">
            01 / 04
          </span>
        </div>

        <div className="absolute left-10 right-10 top-28">

          <div className="font-mono text-[10px] tracking-[0.2em] text-muted mb-5">
            LIVE BRAND PROFILE
          </div>

          <div
            className="font-display text-5xl font-bold leading-[0.95] break-words"
            style={{
              color: form.name
                ? 'var(--text)'
                : 'rgba(244,245,242,0.18)',
            }}
          >
            {form.name || 'YOUR BRAND'}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">

            <span className="pill pill-accent">
              {form.industry || 'INDUSTRY'}
            </span>

            {form.tone && (
              <span className="pill pill-muted">
                {form.tone}
              </span>
            )}

          </div>

        </div>

        <div
          className="absolute left-10 right-10 bottom-36"
        >

          <div className="font-mono text-[10px] text-muted mb-3 tracking-[0.15em]">
            AUDIENCE SIGNAL
          </div>

          <div
            className="p-5 rounded-2xl"
            style={{
              background: 'rgba(255,255,255,0.035)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <div className="flex items-start gap-3">

              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: 'rgba(99,230,190,0.1)',
                  color: 'var(--accent)',
                }}
              >
                <Target size={16} />
              </div>

              <div className="min-w-0">
                <div className="text-xs font-semibold text-white mb-1">
                  Who are you trying to reach?
                </div>

                <div className="text-sm text-muted leading-relaxed">
                  {form.audience ||
                    'Your audience profile will appear here as you build your brand intelligence.'}
                </div>
              </div>

            </div>
          </div>

        </div>

        <div className="absolute bottom-7 left-10 right-10 flex items-center justify-between">

          <div className="flex items-center gap-2">
            <Sparkles
              size={13}
              style={{ color: 'var(--accent)' }}
            />

            <span className="font-mono text-[10px] text-muted">
              AI READY
            </span>
          </div>

          <div className="font-mono text-[10px] text-dim">
            APIFY + GROQ + VEO
          </div>

        </div>

      </div>

      <div
        className="absolute -right-5 top-36 w-28 h-28 rounded-full"
        style={{
          border: '1px solid rgba(99,230,190,0.16)',
          background: 'rgba(99,230,190,0.025)',
        }}
      />

      <div
        className="absolute -left-4 bottom-24 w-16 h-16 rounded-full"
        style={{
          background: 'rgba(99,230,190,0.06)',
          border: '1px solid rgba(99,230,190,0.1)',
        }}
      />

    </div>
  )
}

export default function BrandSetup({ onComplete }) {
  const [form, setForm] = useState({
    name: '',
    industry: 'Beauty & Skincare',
    tone: '',
    audience: '',
    competitors: ['Mamaearth', 'Plum'],
    hashtags: [
      '#CleanBeauty',
      '#SkincareRoutine',
      '#NaturalGlow',
    ],
  })

  const [error, setError] = useState('')

  function updateField(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }))

    setError('')
  }

  function handleIndustryChange(industry) {
    const preset = INDUSTRY_PRESETS[industry]

    setForm((prev) => ({
      ...prev,
      industry,
      ...(preset
        ? {
          hashtags: preset.hashtags,
          competitors: preset.competitors,
        }
        : {}),
    }))
  }

  function handleSubmit(e) {
    e.preventDefault()

    if (!form.name.trim()) {
      setError('Give your brand a name first.')
      return
    }

    if (!form.tone) {
      setError('Choose the tone that fits your brand.')
      return
    }

    if (!form.audience.trim()) {
      setError('Tell us who you are creating for.')
      return
    }

    if (!form.hashtags.length) {
      setError('Add at least one hashtag.')
      return
    }

    setError('')
    onComplete(form)
  }

  return (
    <div className="min-h-screen">

      <div className="page-container py-8 md:py-12">

        <div className="flex items-center justify-between mb-12">

          <div className="bp-logo">
            <div className="bp-logo-mark">
              <Zap size={14} strokeWidth={2.5} />
            </div>

            <div className="bp-logo-text">
              Brand<span>Pulse</span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 font-mono text-[10px] text-muted">
            <span className="live-dot" />
            AI CREATIVE WORKSPACE
          </div>

        </div>

        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 xl:gap-16 items-start">

          <div>

            <div className="eyebrow mb-5">
              <span className="text-accent">01</span>
              BRAND FOUNDATION
            </div>

            <h1 className="display-title max-w-2xl">
              Build the intelligence
              <br />
              behind your <span className="text-accent">brand.</span>
            </h1>

            <p className="text-muted text-base md:text-lg max-w-xl mt-6 leading-relaxed">
              Tell BrandPulse who you are. We'll turn your brand,
              audience and market signals into content opportunities.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-10 space-y-8"
            >

              <div>
                <label className="field-label">
                  Brand name
                </label>

                <input
                  className="input-base text-base"
                  placeholder="e.g. Aether Skin"
                  value={form.name}
                  onChange={(e) =>
                    updateField('name', e.target.value)
                  }
                  autoFocus
                />
              </div>

              <div>

                <label className="field-label">
                  What space are you in?
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">

                  {INDUSTRIES.map((industry) => {
                    const active =
                      form.industry === industry

                    return (
                      <button
                        key={industry}
                        type="button"
                        onClick={() =>
                          handleIndustryChange(industry)
                        }
                        className="text-left px-3 py-3 rounded-xl transition-all"
                        style={{
                          background: active
                            ? 'rgba(99,230,190,0.09)'
                            : 'rgba(255,255,255,0.025)',
                          border: active
                            ? '1px solid rgba(99,230,190,0.3)'
                            : '1px solid rgba(255,255,255,0.07)',
                          color: active
                            ? 'var(--accent)'
                            : 'var(--text-soft)',
                          fontSize: '12px',
                        }}
                      >
                        <span className="flex items-center gap-2">
                          {active && (
                            <Check size={12} />
                          )}

                          {industry}
                        </span>
                      </button>
                    )
                  })}

                </div>

              </div>

              <div>

                <label className="field-label">
                  Brand personality
                </label>

                <div className="grid grid-cols-2 gap-2">

                  {TONES.map((tone) => {
                    const active =
                      form.tone === tone.value

                    return (
                      <button
                        key={tone.value}
                        type="button"
                        onClick={() =>
                          updateField(
                            'tone',
                            tone.value
                          )
                        }
                        className="px-3 py-3 rounded-xl text-left transition-all"
                        style={{
                          background: active
                            ? 'rgba(99,230,190,0.09)'
                            : 'rgba(255,255,255,0.025)',
                          border: active
                            ? '1px solid rgba(99,230,190,0.3)'
                            : '1px solid rgba(255,255,255,0.07)',
                          color: active
                            ? 'var(--accent)'
                            : 'var(--text-soft)',
                          fontSize: '12px',
                        }}
                      >
                        <span className="flex items-center justify-between gap-2">

                          {tone.label}

                          {active && (
                            <Check size={13} />
                          )}

                        </span>
                      </button>
                    )
                  })}

                </div>

              </div>

              <div>

                <label className="field-label">
                  Who are you trying to reach?
                </label>

                <textarea
                  className="input-base resize-none"
                  rows={4}
                  placeholder="Describe your ideal customer, their interests, age group, lifestyle, problems..."
                  value={form.audience}
                  onChange={(e) =>
                    updateField(
                      'audience',
                      e.target.value
                    )
                  }
                />

              </div>

              <div className="grid md:grid-cols-2 gap-5">

                <TagInput
                  label="Target hashtags"
                  tags={form.hashtags}
                  setTags={(tags) =>
                    setForm((prev) => ({
                      ...prev,
                      hashtags: tags,
                    }))
                  }
                  placeholder="#yourbrand"
                />

                <TagInput
                  label="Competitors"
                  tags={form.competitors}
                  setTags={(competitors) =>
                    setForm((prev) => ({
                      ...prev,
                      competitors,
                    }))
                  }
                  placeholder="Competitor name"
                />

              </div>

              {error && (
                <div
                  className="flex items-center gap-3 px-4 py-3 rounded-xl"
                  style={{
                    color: 'var(--danger)',
                    background: 'rgba(240,100,100,0.06)',
                    border:
                      '1px solid rgba(240,100,100,0.15)',
                    fontSize: '12px',
                  }}
                >
                  <X size={14} />
                  {error}
                </div>
              )}

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-4">

                <button
                  type="submit"
                  className="btn btn-approve group"
                  style={{
                    padding: '15px 22px',
                    fontSize: '14px',
                  }}
                >
                  <span>Start brand analysis</span>

                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>

                <div className="flex items-center gap-2 text-muted">
                  <Sparkles size={13} />

                  <span className="font-mono text-[10px]">
                    LIVE TRENDS + AI CREATIVE
                  </span>
                </div>

              </div>

            </form>

          </div>

          <PreviewPanel form={form} />

        </div>

      </div>

    </div>
  )
}