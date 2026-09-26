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

function TrendBar({
  tag,
  engagement,
  count,
  max,
  index,
}) {
  const pct =
    max > 0
      ? Math.min((engagement / max) * 100, 100)
      : 0

  return (
    <div
      className="group py-4"
      style={{
        borderBottom:
          '1px solid rgba(255,255,255,0.05)',
      }}
    >

      <div className="flex items-center gap-4">

        <span
          className="font-mono text-[10px] text-dim w-5"
        >
          {String(index + 1).padStart(2, '0')}
        </span>

        <span
          className="font-mono text-xs w-28 sm:w-36 truncate"
          style={{
            color: 'var(--text-soft)',
          }}
        >
          {tag}
        </span>

        <div className="flex-1 trend-bar-track">
          <div
            className="trend-bar-fill"
            style={{
              width: `${pct}%`,
            }}
          />
        </div>

        <span
          className="font-mono text-[10px] w-14 text-right"
          style={{
            color: 'var(--text-muted)',
          }}
        >
          {formatNumber(engagement)}
        </span>

        <span
          className="hidden sm:block font-mono text-[9px] w-10 text-right text-dim"
        >
          {count}p
        </span>

      </div>

    </div>
  )
}

function PostCard({ post }) {
  return (
    <div
      className="card-hover rounded-2xl overflow-hidden"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border-soft)',
      }}
    >

      {post.thumbnail ? (
        <div
          className="relative w-full overflow-hidden"
          style={{
            aspectRatio: '1 / 1',
            background: 'var(--surface-2)',
          }}
        >

          <img
            src={post.thumbnail}
            alt=""
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />

          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(to top, rgba(8,10,9,0.7), transparent 50%)',
            }}
          />

        </div>
      ) : (
        <div
          className="w-full flex items-center justify-center"
          style={{
            aspectRatio: '1 / 1',
            background:
              'linear-gradient(135deg, var(--surface-2), var(--surface-3))',
          }}
        >
          <Sparkles
            size={24}
            style={{
              color: 'var(--text-dim)',
            }}
          />
        </div>
      )}

      <div className="p-4">

        <p
          className="text-xs leading-relaxed line-clamp-3"
          style={{
            color: 'var(--text-soft)',
          }}
        >
          {post.caption || 'No caption available'}
        </p>

        <div className="flex flex-wrap gap-1.5 mt-3">

          {(post.hashtags || [])
            .slice(0, 3)
            .map((tag) => (
              <span
                key={tag}
                className="font-mono text-[9px]"
                style={{
                  color: 'var(--accent)',
                }}
              >
                {tag}
              </span>
            ))}

        </div>

        <div
          className="flex items-center gap-4 mt-4 pt-3"
          style={{
            borderTop:
              '1px solid rgba(255,255,255,0.05)',
            color: 'var(--text-muted)',
          }}
        >

          <span className="flex items-center gap-1 text-[10px]">
            <Heart size={11} />
            {formatNumber(post.likes)}
          </span>

          <span className="flex items-center gap-1 text-[10px]">
            <MessageCircle size={11} />
            {formatNumber(post.comments)}
          </span>

          {post.post_url && (
            <a
              href={post.post_url}
              target="_blank"
              rel="noreferrer"
              className="ml-auto font-mono text-[9px]"
              style={{
                color: 'var(--accent)',
              }}
            >
              VIEW ↗
            </a>
          )}

        </div>

      </div>

    </div>
  )
}

function Metric({
  number,
  label,
  icon: Icon,
  accent,
}) {
  return (
    <div
      className="p-5 md:p-6"
      style={{
        borderRight:
          '1px solid rgba(255,255,255,0.06)',
      }}
    >

      <Icon
        size={16}
        style={{
          color: accent,
          marginBottom: '18px',
        }}
      />

      <div
        className="metric-number"
        style={{
          color: accent,
        }}
      >
        {formatNumber(number)}
      </div>

      <div className="font-mono text-[9px] text-muted uppercase tracking-[0.14em] mt-2">
        {label}
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

  const maxEngagement =
    topTags[0]?.avg_engagement || 1

  const posts = (trends.posts || []).filter(
    (post) => post.caption
  )

  return (
    <div className="page-container pb-16">

      {/* MARKET PULSE */}

      <section className="mb-12">

        <div className="flex items-end justify-between mb-4">

          <div>
            <div className="eyebrow">
              <span className="live-dot" />
              MARKET PULSE
            </div>

            <p className="text-muted text-xs mt-2">
              Live intelligence surrounding{' '}
              <span className="text-accent">
                {brand.name}
              </span>
            </p>
          </div>

          <div className="hidden sm:block font-mono text-[9px] text-dim">
            INSTAGRAM / LIVE
          </div>

        </div>

        <div
          className="grid grid-cols-2 md:grid-cols-4 rounded-2xl overflow-hidden"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
          }}
        >

          <Metric
            number={trends.total_posts}
            label="Posts analysed"
            icon={BarChart2}
            accent="var(--accent)"
          />

          <Metric
            number={trends.competitor_count}
            label="Competitor posts"
            icon={Target}
            accent="var(--amber)"
          />

          <Metric
            number={trends.brand_post_count}
            label="Your brand posts"
            icon={Users}
            accent="var(--purple)"
          />

          <Metric
            number={topTags.length}
            label="Trending signals"
            icon={TrendingUp}
            accent="var(--danger)"
          />

        </div>

      </section>

      {/* GAP */}

      {trends.gap_hashtag && (
        <section
          className="relative overflow-hidden rounded-[24px] p-6 md:p-8 mb-12"
          style={{
            background:
              'linear-gradient(110deg, rgba(232,169,74,0.08), rgba(232,169,74,0.025))',
            border:
              '1px solid rgba(232,169,74,0.18)',
          }}
        >

          <div
            className="absolute right-[-50px] top-[-70px] w-48 h-48 rounded-full"
            style={{
              border:
                '1px solid rgba(232,169,74,0.12)',
            }}
          />

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">

            <div className="flex gap-4">

              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background:
                    'rgba(232,169,74,0.1)',
                  color: 'var(--amber)',
                }}
              >
                <AlertTriangle size={17} />
              </div>

              <div>

                <div
                  className="font-mono text-[10px] tracking-[0.14em]"
                  style={{
                    color: 'var(--amber)',
                  }}
                >
                  COMPETITOR GAP DETECTED
                </div>

                <h3 className="font-display text-xl font-bold mt-2 text-white">
                  {trends.gap_hashtag}
                </h3>

                <p className="text-sm text-muted mt-1 max-w-xl">
                  This signal is generating{' '}
                  <strong
                    style={{
                      color: 'var(--cream)',
                    }}
                  >
                    {formatNumber(
                      trends.gap_engagement
                    )}
                  </strong>{' '}
                  average engagement, while your
                  brand has no posts targeting it.
                </p>

              </div>

            </div>

            <div className="hidden md:block font-mono text-[9px] text-dim whitespace-nowrap">
              OPPORTUNITY / 01
            </div>

          </div>

        </section>
      )}

      {/* MAIN INTELLIGENCE */}

      <section className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8">

        {/* TRENDING */}

        <div>

          <div className="flex items-end justify-between mb-5">

            <div>
              <div className="eyebrow">
                <TrendingUp size={11} />
                TRENDING NOW
              </div>

              <h2 className="font-display text-xl font-bold mt-2">
                Where attention is moving.
              </h2>
            </div>

            <span className="font-mono text-[9px] text-dim">
              ENGAGEMENT
            </span>

          </div>

          <div
            className="rounded-2xl px-4"
            style={{
              background: 'var(--surface)',
              border:
                '1px solid var(--border-soft)',
            }}
          >

            {topTags.slice(0, 8).map(
              ({ tag, avg_engagement, count }, index) => (
                <TrendBar
                  key={tag}
                  tag={tag}
                  engagement={avg_engagement}
                  count={count}
                  max={maxEngagement}
                  index={index}
                />
              )
            )}

            {topTags.length === 0 && (
              <div className="py-12 text-center text-muted text-xs">
                No trend data available yet.
              </div>
            )}

          </div>

        </div>

        {/* POSTS */}

        <div>

          <div className="flex items-end justify-between mb-5">

            <div>
              <div className="eyebrow">
                <MessageCircle size={11} />
                RECENT CONTENT
              </div>

              <h2 className="font-display text-xl font-bold mt-2">
                What's already working.
              </h2>
            </div>

            <span className="font-mono text-[9px] text-dim">
              LIVE FEED
            </span>

          </div>

          <div className="grid grid-cols-2 gap-3">

            {posts.slice(0, 6).map((post) => (
              <PostCard
                key={post.post_id}
                post={post}
              />
            ))}

            {posts.length === 0 && (
              <div
                className="col-span-2 rounded-2xl p-10 text-center"
                style={{
                  background: 'var(--surface)',
                  border:
                    '1px solid var(--border-soft)',
                }}
              >
                <Sparkles
                  size={20}
                  className="mx-auto mb-3"
                  style={{
                    color: 'var(--text-dim)',
                  }}
                />

                <p className="text-xs text-muted">
                  Fetching real posts...
                </p>

              </div>
            )}

          </div>

        </div>

      </section>

      {/* CTA */}

      <section
        className="relative overflow-hidden mt-12 rounded-[28px] p-8 md:p-12"
        style={{
          background:
            'linear-gradient(120deg, rgba(99,230,190,0.08), rgba(99,230,190,0.025))',
          border:
            '1px solid rgba(99,230,190,0.15)',
        }}
      >

        <div
          className="absolute right-[-100px] bottom-[-120px] w-72 h-72 rounded-full"
          style={{
            border:
              '1px solid rgba(99,230,190,0.08)',
          }}
        />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8">

          <div className="max-w-2xl">

            <div className="eyebrow text-accent">
              <Sparkles size={11} />
              AI CREATIVE ENGINE
            </div>

            <h2 className="font-display text-2xl md:text-3xl font-bold mt-3">
              The data has spoken.
              <br />
              <span className="text-accent">
                Now make something.
              </span>
            </h2>

            <p className="text-muted text-sm mt-4 max-w-xl leading-relaxed">
              Groq will transform these live market signals
              into three targeted Reel concepts for{' '}
              <span className="text-white">
                {brand.name}
              </span>.
            </p>

          </div>

          <button
            className="btn btn-approve group shrink-0"
            onClick={onGenerate}
            disabled={generating}
            style={{
              padding: '15px 22px',
              fontSize: '13px',
            }}
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
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </>
            )}

          </button>

        </div>

      </section>

    </div>
  )
}