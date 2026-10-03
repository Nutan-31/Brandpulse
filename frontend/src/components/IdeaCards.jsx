import { useState } from 'react'
import {
  ArrowRight,
  ChevronDown,
  Hash,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react'

function IdeaCard({
  idea,
  index,
  onSelect,
  loading,
}) {
  const [showPrompt, setShowPrompt] = useState(false)

  const score =
    idea.viral_score ??
    idea.score ??
    idea.viralScore ??
    0

  const title =
    idea.title ||
    idea.concept ||
    idea.hook ||
    `Creative Idea ${index + 1}`

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

  const hashtags = idea.hashtags || []

  const accent =
    index === 0
      ? 'var(--accent)'
      : index === 1
        ? 'var(--purple)'
        : 'var(--coral)'

  return (
    <article
      className={`idea-workspace-card ${index === 0 ? 'idea-featured' : ''
        }`}
    >
      {/* Image / visual area */}

      <div
        className="idea-visual"
        style={{
          background: `linear-gradient(135deg, ${accent}18, var(--surface-soft))`,
        }}
      >
        <div className="idea-number">
          {String(index + 1).padStart(2, '0')}
        </div>

        <div
          className="idea-visual-icon"
          style={{
            color: accent,
            background: `${accent}18`,
          }}
        >
          <Sparkles size={index === 0 ? 26 : 20} />
        </div>

        <div className="idea-score">
          <span>{Number(score)}</span>
          <small>viral</small>
        </div>
      </div>

      {/* Content */}

      <div className="idea-content">

        <h2 className="idea-title">
          {title}
        </h2>

        {caption && (
          <p className="idea-description">
            {caption}
          </p>
        )}

        {/* Why it works — compact */}

        {rationale && (
          <p className="idea-rationale">
            {rationale}
          </p>
        )}

        {/* Hashtags */}

        {hashtags.length > 0 && (
          <div className="idea-tags">
            {hashtags.slice(0, 4).map((tag, tagIndex) => (
              <span key={`${tag}-${tagIndex}`}>
                <Hash size={10} />
                {String(tag).replace('#', '')}
              </span>
            ))}
          </div>
        )}

        {/* Prompt */}

        {prompt && (
          <div className="idea-prompt">

            <button
              type="button"
              onClick={() =>
                setShowPrompt(!showPrompt)
              }
            >
              <span>
                <Sparkles size={11} />
                Video direction
              </span>

              <ChevronDown
                size={14}
                style={{
                  transform: showPrompt
                    ? 'rotate(180deg)'
                    : 'rotate(0deg)',
                }}
              />
            </button>

            {showPrompt && (
              <div className="idea-prompt-text">
                {prompt}
              </div>
            )}

          </div>
        )}

        {/* Action */}

        <button
          type="button"
          onClick={() => onSelect(idea)}
          disabled={loading}
          className="idea-create-button"
        >
          <span>
            <Play size={14} />
            {loading
              ? 'Starting...'
              : 'Create this reel'}
          </span>

          <ArrowRight size={16} />
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
    <div className="page-container ideas-page">

      {/* Hero */}

      <div className="ideas-hero">

        <div>

          <div className="ideas-kicker">
            <Sparkles size={13} />
            IDEAS
          </div>

          <h1>
            Your next post
            <br />
            starts here.
          </h1>

          <p>
            A few creative directions built around{' '}
            <strong>
              {brand?.name || 'your brand'}
            </strong>
            .
          </p>

        </div>

        <button
          type="button"
          onClick={onRegenerate}
          disabled={regenerating || loading}
          className="ideas-refresh"
        >
          <RotateCcw
            size={14}
            className={
              regenerating
                ? 'animate-spin'
                : ''
            }
          />

          {regenerating
            ? 'Creating...'
            : 'Try new ideas'}
        </button>

      </div>

      {/* Ideas */}

      {ideas?.length > 0 ? (
        <div className="ideas-grid">

          {ideas.map((idea, index) => (
            <IdeaCard
              key={idea.id || index}
              idea={idea}
              index={index}
              onSelect={onSelectIdea}
              loading={loading}
            />
          ))}

        </div>
      ) : (
        <div className="ideas-empty">

          <div className="ideas-empty-icon">
            <Sparkles size={24} />
          </div>

          <h2>
            Creating something interesting...
          </h2>

          <p>
            Your ideas are being shaped from
            the latest brand and trend signals.
          </p>

        </div>
      )}

    </div>
  )
}