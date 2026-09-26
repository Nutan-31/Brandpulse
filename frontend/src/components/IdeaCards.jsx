import { useState } from 'react'
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Hash,
  Lightbulb,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react'

function ViralRing({ score }) {
  const numericScore = Number(score || 0)

  const radius = 31
  const circumference = 2 * Math.PI * radius

  const progress =
    Math.min(Math.max(numericScore, 0), 100) / 100

  const offset =
    circumference -
    progress * circumference

  const color =
    numericScore >= 90
      ? 'var(--accent)'
      : numericScore >= 80
        ? 'var(--amber)'
        : 'var(--purple)'

  return (
    <div
      className="relative w-[76px] h-[76px] shrink-0"
    >

      <svg
        width="76"
        height="76"
        viewBox="0 0 76 76"
        className="-rotate-90"
      >

        <circle
          cx="38"
          cy="38"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="3"
        />

        <circle
          cx="38"
          cy="38"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition:
              'stroke-dashoffset 1s ease',
          }}
        />

      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">

        <span
          className="font-display text-lg font-bold"
          style={{
            color,
          }}
        >
          {numericScore}
        </span>

        <span className="font-mono text-[7px] text-dim">
          SCORE
        </span>

      </div>

    </div>
  )
}

function IdeaCard({
  idea,
  index,
  onSelect,
  selected,
  loading,
}) {
  const [showPrompt, setShowPrompt] =
    useState(false)

  const colors = [
    'var(--accent)',
    'var(--amber)',
    'var(--purple)',
  ]

  const accent = colors[index % colors.length]

  const score =
    idea.viral_score ??
    idea.score ??
    idea.viralScore ??
    0

  const title =
    idea.title ||
    idea.concept ||
    idea.hook ||
    `Creative Concept ${index + 1}`

  const caption =
    idea.caption ||
    idea.description ||
    idea.concept ||
    ''

  const rationale =
    idea.rationale ||
    idea.why_it_works ||
    idea.reason ||
    ''

  const prompt =
    idea.video_prompt ||
    idea.prompt ||
    idea.videoPrompt ||
    ''

  const hashtags =
    idea.hashtags || []

  return (
    <article
      className="group relative overflow-hidden rounded-[26px] transition-all duration-500"
      style={{
        background: 'var(--surface)',
        border: selected
          ? `1px solid ${accent}`
          : '1px solid var(--border)',
        boxShadow: selected
          ? `0 0 40px rgba(99,230,190,0.08)`
          : 'none',
      }}
    >

      {/* Accent line */}

      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background: accent,
          opacity: selected ? 1 : 0.5,
        }}
      />

      <div className="p-6 md:p-7">

        {/* Header */}

        <div className="flex items-start justify-between gap-4">

          <div>

            <div
              className="font-mono text-[9px] tracking-[0.16em]"
              style={{
                color: accent,
              }}
            >
              CONCEPT /{' '}
              {String(index + 1).padStart(2, '0')}
            </div>

            <div className="font-mono text-[9px] text-dim mt-2">
              AI CREATIVE SIGNAL
            </div>

          </div>

          <ViralRing score={score} />

        </div>

        {/* Title */}

        <div className="mt-8">

          <h3
            className="font-display text-2xl md:text-[27px] font-bold leading-tight"
            style={{
              color: 'var(--text)',
            }}
          >
            {title}
          </h3>

          {caption && (
            <p
              className="text-sm leading-relaxed mt-4"
              style={{
                color: 'var(--text-soft)',
              }}
            >
              {caption}
            </p>
          )}

        </div>

        {/* Rationale */}

        {rationale && (
          <div
            className="mt-6 p-4 rounded-xl"
            style={{
              background:
                'rgba(255,255,255,0.025)',
              border:
                '1px solid rgba(255,255,255,0.05)',
            }}
          >

            <div className="flex gap-3">

              <Lightbulb
                size={14}
                className="shrink-0 mt-0.5"
                style={{
                  color: accent,
                }}
              />

              <div>

                <div className="font-mono text-[9px] text-dim uppercase tracking-[0.12em] mb-1">
                  WHY IT WORKS
                </div>

                <p className="text-xs text-muted leading-relaxed">
                  {rationale}
                </p>

              </div>

            </div>

          </div>
        )}

        {/* Hashtags */}

        {hashtags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-5">

            {hashtags.slice(0, 5).map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 font-mono text-[9px]"
                style={{
                  color: accent,
                }}
              >
                <Hash size={9} />
                {String(tag).replace('#', '')}
              </span>
            ))}

          </div>
        )}

        {/* Prompt toggle */}

        {prompt && (
          <div className="mt-6">

            <button
              type="button"
              onClick={() =>
                setShowPrompt(!showPrompt)
              }
              className="flex items-center gap-2 font-mono text-[9px] tracking-[0.08em]"
              style={{
                color: 'var(--text-muted)',
              }}
            >

              {showPrompt ? (
                <ChevronUp size={13} />
              ) : (
                <ChevronDown size={13} />
              )}

              {showPrompt
                ? 'HIDE VIDEO PROMPT'
                : 'VIEW VIDEO PROMPT'}

            </button>

            {showPrompt && (
              <div
                className="mt-3 p-4 rounded-xl text-xs leading-relaxed"
                style={{
                  background:
                    'rgba(0,0,0,0.22)',
                  border:
                    '1px solid rgba(255,255,255,0.05)',
                  color: 'var(--text-muted)',
                }}
              >
                {prompt}
              </div>
            )}

          </div>
        )}

        {/* Action */}

        <button
          type="button"
          onClick={() => onSelect(idea)}
          disabled={loading || selected}
          className="w-full mt-7 flex items-center justify-between px-4 py-3.5 rounded-xl transition-all group/button"
          style={{
            background: selected
              ? 'rgba(99,230,190,0.08)'
              : 'rgba(255,255,255,0.04)',
            border: selected
              ? '1px solid rgba(99,230,190,0.2)'
              : '1px solid rgba(255,255,255,0.08)',
            color: selected
              ? 'var(--accent)'
              : 'var(--text)',
            cursor:
              loading || selected
                ? 'default'
                : 'pointer',
          }}
        >

          <span className="flex items-center gap-2 text-xs font-semibold">

            {selected ? (
              <>
                <Sparkles size={14} />
                GENERATING REEL
              </>
            ) : loading ? (
              <>
                <Sparkles
                  size={14}
                  className="animate-pulse"
                />
                STARTING...
              </>
            ) : (
              <>
                <Play size={13} />
                CREATE THIS REEL
              </>
            )}

          </span>

          {!selected && !loading && (
            <ArrowRight
              size={15}
              className="transition-transform group-hover/button:translate-x-1"
            />
          )}

        </button>

      </div>

    </article>
  )
}

export default function IdeaCards({
  brand,
  ideas,
  onSelectIdea,
  loading,
  onRegenerate,
  regenerating,
}) {
  return (
    <div className="page-container pb-16">

      {/* Top bar */}

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-10">

        <div>

          <div className="eyebrow">
            <Sparkles size={11} />
            GROQ CREATIVE ENGINE
          </div>

          <div className="font-mono text-[9px] text-dim mt-3">
            Llama 3.3 70B / BRAND:{' '}
            {brand?.name || 'UNKNOWN'}
          </div>

        </div>

        <button
          type="button"
          onClick={onRegenerate}
          disabled={regenerating || loading}
          className="btn btn-ghost"
          style={{
            padding: '10px 15px',
            fontSize: '11px',
          }}
        >

          <RotateCcw
            size={13}
            className={
              regenerating
                ? 'animate-spin'
                : ''
            }
          />

          {regenerating
            ? 'GENERATING...'
            : 'NEW CONCEPTS'}

        </button>

      </div>

      {/* Cards */}

      {ideas.length > 0 ? (
        <div className="grid lg:grid-cols-3 gap-5">

          {ideas.map((idea, index) => (
            <IdeaCard
              key={idea.id || index}
              idea={idea}
              index={index}
              onSelect={onSelectIdea}
              selected={false}
              loading={loading}
            />
          ))}

        </div>
      ) : (
        <div
          className="rounded-3xl p-16 text-center"
          style={{
            background: 'var(--surface)',
            border:
              '1px solid var(--border-soft)',
          }}
        >

          <Sparkles
            size={28}
            className="mx-auto mb-4"
            style={{
              color: 'var(--accent)',
            }}
          />

          <h3 className="font-display text-xl font-bold">
            Building your concepts...
          </h3>

          <p className="text-muted text-sm mt-2">
            The creative engine is analysing your
            market signals.
          </p>

        </div>
      )}

      {/* Bottom */}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mt-10">

        <div className="flex items-center gap-3">

          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{
              background:
                'rgba(99,230,190,0.08)',
              color: 'var(--accent)',
            }}
          >
            <Sparkles size={14} />
          </div>

          <div>

            <div className="font-mono text-[9px] text-muted">
              AI GENERATED CONCEPTS
            </div>

            <div className="text-[11px] text-dim mt-1">
              Select a concept to start video
              production.
            </div>

          </div>

        </div>

        <div className="font-mono text-[9px] text-dim">
          {ideas.length} CONCEPTS / READY
        </div>

      </div>

    </div>
  )
}