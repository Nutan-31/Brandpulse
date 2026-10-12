
import {
  TrendingUp,
  Users,
  Target,
  ArrowRight,
  Heart,
  MessageCircle,
  BarChart2,
  Sparkles,
  Activity,
  ExternalLink,
} from 'lucide-react'

function formatNumber(value) {
  const num = Number(value ?? 0)

  if (!Number.isFinite(num)) return '0'

  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  }

  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }

  return num.toLocaleString()
}

function MetricCard({
  icon: Icon,
  label,
  value,
  description,
  accent,
}) {
  return (
    <div className="trends-overview-metric">
      <div
        className="trends-overview-metric-icon"
        style={{
          color: accent,
          background: `${accent}14`,
        }}
      >
        <Icon size={17} />
      </div>

      <div className="trends-overview-metric-label">
        {label}
      </div>

      <div
        className="trends-overview-metric-value"
        style={{ color: accent }}
      >
        {value == null ? '—' : formatNumber(value)}
      </div>

      <div className="trends-overview-metric-description">
        {description}
      </div>
    </div>
  )
}

function TrendCard({
  tag,
  engagement,
  count,
  index,
  maxEngagement,
}) {
  const value = Number(engagement ?? 0)
  const safeValue = Number.isFinite(value) ? value : 0
  const maximum = Math.max(Number(maxEngagement ?? 0), 1)
  const width = Math.min((safeValue / maximum) * 100, 100)

  return (
    <div className="trends-topic-card">
      <div className="trends-topic-number">
        {String(index + 1).padStart(2, '0')}
      </div>

      <div className="trends-topic-main">
        <div className="trends-topic-top">
          <span className="trends-topic-name">
            {tag || 'Unnamed topic'}
          </span>

          <span className="trends-topic-value">
            {formatNumber(safeValue)}
          </span>
        </div>

        <div className="trends-topic-track">
          <div
            className="trends-topic-fill"
            style={{ width: `${width}%` }}
          />
        </div>

        <div className="trends-topic-meta">
          <span>Avg. engagement</span>
          <span>
            {count == null ? '—' : formatNumber(count)} posts
          </span>
        </div>
      </div>
    </div>
  )
}

/*
 * A post is clickable only when it has a real Instagram URL
 * and is not marked as demo content.
 *
 * Posts without URLs can still be displayed, but they
 * will not pretend to be clickable Instagram posts.
 */
function isRealInstagramPost(post) {
  return Boolean(
    post &&
    typeof post.post_url === 'string' &&
    post.post_url.startsWith('https://www.instagram.com/') &&
    !post.is_demo
  )
}

function PostCard({ post }) {
  const isRealPost = isRealInstagramPost(post)

  const openInstagramPost = () => {
    if (!isRealPost) return

    window.open(
      post.post_url,
      '_blank',
      'noopener,noreferrer'
    )
  }

  const handleKeyDown = (event) => {
    if (!isRealPost) return

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openInstagramPost()
    }
  }

  return (
    <div
      className={`trends-content-card ${isRealPost
        ? 'trends-content-card-clickable'
        : 'trends-content-card-unlinked'
        }`}
      onClick={isRealPost ? openInstagramPost : undefined}
      onKeyDown={isRealPost ? handleKeyDown : undefined}
      role={isRealPost ? 'link' : undefined}
      tabIndex={isRealPost ? 0 : undefined}
      title={
        isRealPost
          ? 'Open this post on Instagram'
          : 'Instagram post data'
      }
    >
      {/* POST IMAGE */}
      <div className="trends-content-image">
        {post.thumbnail ? (
          <img
            src={post.thumbnail}
            alt={
              post.username
                ? `Instagram post by @${post.username}`
                : 'Instagram post'
            }
            loading="lazy"
            onError={(event) => {
              event.currentTarget.style.display = 'none'
            }}
          />
        ) : (
          <div className="trends-content-placeholder">
            <Sparkles size={24} />
          </div>
        )}

        <div className="trends-content-badge">
          {isRealPost ? 'LIVE DATA' : 'POST DATA'}
        </div>
      </div>

      {/* POST DETAILS */}
      <div className="trends-content-body">
        {post.username && (
          <div
            style={{
              fontSize: '12px',
              fontWeight: 600,
              marginBottom: '8px',
              opacity: 0.7,
            }}
          >
            @{post.username}
          </div>
        )}

        <p>
          {post.caption || 'No caption available'}
        </p>

        {/* HASHTAGS */}
        <div className="trends-content-tags">
          {(Array.isArray(post.hashtags) ? post.hashtags : [])
            .slice(0, 3)
            .map((tag, index) => (
              <span key={`${tag}-${index}`}>
                {tag.startsWith('#') ? tag : `#${tag}`}
              </span>
            ))}
        </div>

        {/* ENGAGEMENT METRICS */}
        <div className="trends-content-footer">
          <span>
            <Heart size={12} />
            {formatNumber(post.likes)}
          </span>

          <span>
            <MessageCircle size={12} />
            {formatNumber(post.comments)}
          </span>

          {isRealPost && (
            <a
              href={post.post_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => {
                event.stopPropagation()
              }}
            >
              View on Instagram
              <ExternalLink size={11} />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default function TrendFeed({
  brand,
  trends,
  onGenerate,
  generating,
}) {
  if (!trends) return null

  const topTags = Array.isArray(trends.top_hashtags)
    ? trends.top_hashtags
    : []

  const visibleTopTags = topTags.slice(0, 6)

  const maxEngagement = Math.max(
    ...visibleTopTags.map((item) =>
      Number(item.avg_engagement ?? 0)
    ),
    0
  )

  const posts = (
    Array.isArray(trends.posts) ? trends.posts : []
  ).filter(
    (post) =>
      post &&
      !post.is_demo &&
      (
        post.caption ||
        post.post_url ||
        post.username ||
        post.thumbnail
      )
  )

  const hasOpportunity =
    trends.opportunity_status === 'evidence_found' &&
    Boolean(trends.gap_hashtag)

  return (
    <div className="trends-page">
      {/* HERO */}
      <section className="trends-hero">
        <div>
          <div className="trends-kicker">
            <span />
            TREND DISCOVERY
          </div>

          <h1>
            What's happening
            <span> around your brand.</span>
          </h1>

          <p>
            Discover the conversations, content and
            audience signals shaping your market right now.
          </p>
        </div>

        <div className="trends-live-card">
          <div className="trends-live-icon">
            <Activity size={17} />
          </div>

          <div>
            <small>DATA SOURCE</small>
            <strong>Instagram signals</strong>
          </div>

          <div className="trends-live-dot" />
        </div>
      </section>

      {/* METRICS */}
      <section className="trends-metrics">
        <MetricCard
          icon={BarChart2}
          label="Posts analysed"
          value={trends.total_posts}
          description="Relevant market activity"
          accent="var(--accent)"
        />

        <MetricCard
          icon={Target}
          label="Competitor posts"
          value={trends.competitor_count}
          description="Detected competitive activity"
          accent="var(--coral)"
        />

        <MetricCard
          icon={Users}
          label="Your posts"
          value={trends.brand_post_count}
          description="Your own posts identified"
          accent="var(--purple)"
        />

        <MetricCard
          icon={TrendingUp}
          label="Trend signals"
          value={topTags.length}
          description="Detected hashtag signals"
          accent="var(--green)"
        />
      </section>

      {/* MAIN DASHBOARD */}
      <section className="trends-dashboard-grid">
        {/* TRENDING TOPICS */}
        <div className="trends-dashboard-card">
          <div className="trends-dashboard-header">
            <div>
              <div className="trends-card-kicker">
                <TrendingUp size={12} />
                TRENDING TOPICS
              </div>

              <h2>
                Where attention is going.
              </h2>

              <p>
                The strongest hashtag signals found in
                the relevant posts analysed for your brand.
              </p>
            </div>

            <div className="trends-count-pill">
              {topTags.length} signals
            </div>
          </div>

          <div className="trends-topic-list">
            {visibleTopTags.map((item, index) => (
              <TrendCard
                key={item.tag || item.hashtag || index}
                tag={item.tag || item.hashtag}
                engagement={item.avg_engagement}
                count={item.count}
                index={index}
                maxEngagement={maxEngagement}
              />
            ))}

            {topTags.length === 0 && (
              <div className="trends-empty">
                <Sparkles size={22} />

                <p>
                  {trends.apify_error
                    ? 'Trend topics could not be calculated from the available data.'
                    : 'No trend data available yet. Try analysing your brand again.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* CONTENT OPPORTUNITY */}
        <div className="trends-dashboard-card trends-opportunity-card">
          <div className="trends-dashboard-header">
            <div>
              <div className="trends-card-kicker">
                <Target size={12} />
                OPPORTUNITY
              </div>

              <h2>
                A gap worth noticing.
              </h2>

              <p>
                Potential content opportunities supported
                by the available Instagram signals.
              </p>
            </div>
          </div>

          {hasOpportunity ? (
            <div className="trends-opportunity-inner">
              <div className="trends-opportunity-icon">
                <Target size={19} />
              </div>

              <div>
                <span>
                  CONTENT OPPORTUNITY
                </span>

                <h3>
                  {trends.gap_hashtag}
                </h3>

                <p>
                  Observed average engagement:{' '}
                  <strong>
                    {formatNumber(trends.gap_engagement)}
                  </strong>
                  . This signal appeared in multiple relevant
                  posts. It may be worth exploring in your
                  next content campaign.
                </p>
              </div>
            </div>
          ) : (
            <div className="trends-opportunity-empty">
              <Sparkles size={20} />

              <p>
                {trends.opportunity_message ||
                  'Not enough relevant post data to establish a content opportunity yet.'}
              </p>
            </div>
          )}

          <div className="trends-opportunity-footer">
            <span>
              BRANDPULSE INSIGHT
            </span>

            <ArrowRight size={15} />
          </div>
        </div>
      </section>

      {/* RECENT CONTENT */}
      <section className="trends-content-section">
        <div className="trends-section-heading">
          <div>
            <div className="trends-card-kicker">
              <MessageCircle size={12} />
              RECENT CONTENT
            </div>

            <h2>
              Content your market is engaging with.
            </h2>
          </div>

          <span>
            INSTAGRAM FEED
          </span>
        </div>

        <div className="trends-content-grid">
          {posts.slice(0, 4).map((post, index) => (
            <PostCard
              key={
                post.id ||
                post.post_id ||
                post.post_url ||
                `${post.username || 'post'}-${index}`
              }
              post={post}
            />
          ))}

          {posts.length === 0 && (
            <div className="trends-content-empty">
              <Sparkles size={22} />

              <p>
                {trends.apify_error ||
                  'No relevant Instagram posts are available to display. Check your target hashtags and brand description, then try again.'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* AI ACTION */}
      <section className="trends-action-card">
        <div className="trends-action-left">
          <div className="trends-action-icon">
            <Sparkles size={19} />
          </div>

          <div>
            <div className="trends-card-kicker">
              AI CREATIVE ENGINE
            </div>

            <h2>
              Turn these signals into
              <span> content ideas.</span>
            </h2>

            <p>
              Use the available trend signals and brand context
              to generate targeted Reel concepts for{' '}
              <strong>{brand?.name || 'your brand'}</strong>.
            </p>
          </div>
        </div>

        <button
          onClick={onGenerate}
          disabled={generating}
          className="trends-action-button"
        >
          {generating ? (
            <>
              <Sparkles
                size={15}
                className="animate-pulse"
              />
              Reading signals...
            </>
          ) : (
            <>
              Generate concepts
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </section>
    </div>
  )
}
