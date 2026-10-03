import {
  TrendingUp,
  Users,
  Target,
  AlertTriangle,
  ArrowRight,
  Heart,
  MessageCircle,
  BarChart2,
  Sparkles,
  Activity,
  ExternalLink,
} from 'lucide-react'

function formatNumber(value) {
  const num = Number(value || 0)

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
        {formatNumber(value)}
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
}) {
  return (
    <div className="trends-topic-card">

      <div className="trends-topic-number">
        {String(index + 1).padStart(2, '0')}
      </div>

      <div className="trends-topic-main">

        <div className="trends-topic-top">
          <span className="trends-topic-name">
            {tag}
          </span>

          <span className="trends-topic-value">
            {formatNumber(engagement)}
          </span>
        </div>

        <div className="trends-topic-track">
          <div
            className="trends-topic-fill"
            style={{
              width: `${Math.min(
                Number(engagement || 0) /
                Math.max(Number(engagement || 1), 1) *
                100,
                100
              )}%`,
            }}
          />
        </div>

        <div className="trends-topic-meta">
          <span>Avg. engagement</span>
          <span>{count} posts</span>
        </div>

      </div>

    </div>
  )
}

function PostCard({ post }) {
  return (
    <div className="trends-content-card">

      <div className="trends-content-image">

        {post.thumbnail ? (
          <img
            src={post.thumbnail}
            alt=""
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        ) : (
          <div className="trends-content-placeholder">
            <Sparkles size={24} />
          </div>
        )}

        <div className="trends-content-badge">
          LIVE POST
        </div>

      </div>

      <div className="trends-content-body">

        <p>
          {post.caption || 'No caption available'}
        </p>

        <div className="trends-content-tags">
          {(post.hashtags || [])
            .slice(0, 3)
            .map((tag) => (
              <span key={tag}>
                {tag}
              </span>
            ))}
        </div>

        <div className="trends-content-footer">

          <span>
            <Heart size={12} />
            {formatNumber(post.likes)}
          </span>

          <span>
            <MessageCircle size={12} />
            {formatNumber(post.comments)}
          </span>

          {post.post_url && (
            <a
              href={post.post_url}
              target="_blank"
              rel="noreferrer"
            >
              View
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

  const topTags = trends.top_hashtags || []

  const posts = (trends.posts || []).filter(
    (post) => post.caption
  )

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
          description="Market activity"
          accent="var(--accent)"
        />

        <MetricCard
          icon={Target}
          label="Competitor posts"
          value={trends.competitor_count}
          description="Competitive activity"
          accent="var(--coral)"
        />

        <MetricCard
          icon={Users}
          label="Your posts"
          value={trends.brand_post_count}
          description="Current presence"
          accent="var(--purple)"
        />

        <MetricCard
          icon={TrendingUp}
          label="Trend signals"
          value={topTags.length}
          description="Active conversations"
          accent="var(--green)"
        />

      </section>


      {/* MAIN DASHBOARD */}

      <section className="trends-dashboard-grid">

        {/* TREND TOPICS */}

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
                The strongest conversations detected
                in your market.
              </p>

            </div>

            <div className="trends-count-pill">
              {topTags.length} signals
            </div>

          </div>

          <div className="trends-topic-list">

            {topTags
              .slice(0, 6)
              .map(
                (
                  {
                    tag,
                    avg_engagement,
                    count,
                  },
                  index
                ) => (
                  <TrendCard
                    key={tag}
                    tag={tag}
                    engagement={avg_engagement}
                    count={count}
                    index={index}
                  />
                )
              )}

            {topTags.length === 0 && (
              <div className="trends-empty">
                <Sparkles size={22} />
                No trend data available yet.
              </div>
            )}

          </div>

        </div>


        {/* OPPORTUNITY */}

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
                A signal where competitor activity
                is currently stronger.
              </p>

            </div>

          </div>

          {trends.gap_hashtag ? (
            <div className="trends-opportunity-inner">

              <div className="trends-opportunity-icon">
                <AlertTriangle size={19} />
              </div>

              <div>

                <span>
                  COMPETITOR GAP
                </span>

                <h3>
                  {trends.gap_hashtag}
                </h3>

                <p>
                  Around{' '}
                  <strong>
                    {formatNumber(
                      trends.gap_engagement
                    )}
                  </strong>{' '}
                  average engagement is being generated
                  around this signal.
                </p>

              </div>

            </div>
          ) : (
            <div className="trends-opportunity-empty">
              <Sparkles size={20} />
              <p>
                No major content gap detected.
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
            LIVE FEED
          </span>

        </div>

        <div className="trends-content-grid">

          {posts
            .slice(0, 4)
            .map((post) => (
              <PostCard
                key={post.post_id}
                post={post}
              />
            ))}

          {posts.length === 0 && (
            <div className="trends-content-empty">
              <Sparkles size={22} />
              Fetching real posts...
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
              Use everything BrandPulse discovered to
              generate targeted Reel concepts for{' '}
              <strong>{brand.name}</strong>.
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