import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Check,
  Copy,
  Download,
  ExternalLink,
  Hash,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { api } from '../api.js'

function GeneratingAnimation({ elapsed }) {
  const stages = [
    { time: 0, label: 'Preparing creative direction' },
    { time: 5, label: 'Building cinematic composition' },
    { time: 15, label: 'Generating video frames' },
    { time: 30, label: 'Refining motion and detail' },
    { time: 45, label: 'Finalising your Reel' },
  ]

  const currentStage =
    [...stages].reverse().find((stage) => elapsed >= stage.time) || stages[0]

  const progress = Math.min((elapsed / 60) * 100, 96)

  return (
    <div
      className="relative overflow-hidden rounded-[30px] min-h-[620px] flex items-center justify-center"
      style={{
        background:
          'radial-gradient(circle at center, rgba(99,230,190,0.09), transparent 38%), var(--surface)',
        border: '1px solid var(--border)',
      }}
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative text-center px-8 max-w-md">
        <div className="generation-orbit mx-auto">
          <div className="generation-orbit-ring ring-one" />
          <div className="generation-orbit-ring ring-two" />
          <div className="generation-core">
            <Sparkles size={26} />
          </div>
        </div>

        <div className="eyebrow justify-center mt-10">
          <span className="live-dot" />
          AI VIDEO ENGINE
        </div>

        <h2 className="font-display text-3xl md:text-4xl font-bold mt-4">
          Your Reel is
          <br />
          <span className="text-accent">being created.</span>
        </h2>

        <p className="text-muted text-sm leading-relaxed mt-4">
          Veo is transforming your creative concept into a vertical social
          video. This usually takes a little while.
        </p>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[9px] text-muted">
              {currentStage.label.toUpperCase()}
            </span>
            <span className="font-mono text-[9px] text-accent">
              {elapsed}s
            </span>
          </div>

          <div
            className="h-1 rounded-full overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.07)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${progress}%`,
                background: 'var(--accent)',
                boxShadow: '0 0 14px rgba(99,230,190,0.35)',
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-8">
          {stages.slice(0, 3).map((stage, index) => {
            const complete = elapsed >= stage.time + 10

            return (
              <div
                key={stage.label}
                className="rounded-xl p-3 text-left"
                style={{
                  background: complete
                    ? 'rgba(99,230,190,0.06)'
                    : 'rgba(255,255,255,0.025)',
                  border: complete
                    ? '1px solid rgba(99,230,190,0.12)'
                    : '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <div
                  className="font-mono text-[8px]"
                  style={{
                    color: complete
                      ? 'var(--accent)'
                      : 'var(--text-dim)',
                  }}
                >
                  {complete ? 'DONE' : `0${index + 1}`}
                </div>

                <div className="text-[9px] text-muted mt-2 leading-tight">
                  {stage.label}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function VideoPlayer({ url }) {
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)

  async function togglePlay() {
    if (!videoRef.current) return

    if (videoRef.current.paused) {
      await videoRef.current.play()
      setPlaying(true)
    } else {
      videoRef.current.pause()
      setPlaying(false)
    }
  }

  function toggleMute() {
    if (!videoRef.current) return

    videoRef.current.muted = !videoRef.current.muted
    setMuted(videoRef.current.muted)
  }

  return (
    <div
      className="relative rounded-[28px] overflow-hidden"
      style={{
        background: '#000',
        border: '1px solid var(--border)',
        boxShadow: '0 25px 80px rgba(0,0,0,0.35)',
      }}
    >
      <video
        ref={videoRef}
        src={url}
        playsInline
        muted
        className="w-full object-cover"
        style={{
          aspectRatio: '9 / 16',
          maxHeight: '720px',
          background: '#000',
        }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      <div
        className="absolute inset-x-0 bottom-0 p-5"
        style={{
          background:
            'linear-gradient(transparent, rgba(0,0,0,0.85))',
        }}
      >
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={togglePlay}
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(8px)',
            }}
          >
            {playing ? <Pause size={16} /> : <Play size={16} />}
          </button>

          <button
            type="button"
            onClick={toggleMute}
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(8px)',
            }}
          >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>
      </div>

      <div
        className="absolute top-4 left-4 px-3 py-1.5 rounded-full font-mono text-[8px]"
        style={{
          background: 'rgba(8,10,9,0.65)',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(8px)',
        }}
      >
        VEO 3 / 9:16
      </div>
    </div>
  )
}

function CopyButton({ text, label = 'COPY' }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text || '')
      setCopied(true)

      setTimeout(() => {
        setCopied(false)
      }, 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex items-center gap-2 font-mono text-[9px] transition"
      style={{
        color: copied ? 'var(--accent)' : 'var(--text-muted)',
      }}
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? 'COPIED' : label}
    </button>
  )
}

function FailedState({ error, idea }) {
  return (
    <div className="page-container pb-16">
      <div
        className="rounded-[28px] p-8 md:p-12"
        style={{
          background:
            'linear-gradient(120deg, rgba(240,100,100,0.07), rgba(255,255,255,0.02))',
          border: '1px solid rgba(240,100,100,0.18)',
        }}
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mb-6"
          style={{
            background: 'rgba(240,100,100,0.1)',
            color: 'var(--danger)',
          }}
        >
          <RotateCcw size={19} />
        </div>

        <div
          className="font-mono text-[10px] tracking-[0.14em]"
          style={{ color: 'var(--danger)' }}
        >
          VIDEO GENERATION INTERRUPTED
        </div>

        <h2 className="font-display text-3xl font-bold mt-3">
          The studio couldn't
          <br />
          <span style={{ color: 'var(--danger)' }}>finish the render.</span>
        </h2>

        <p className="text-muted text-sm mt-5 max-w-2xl leading-relaxed">
          {error ||
            'The video provider returned an error while generating this Reel.'}
        </p>

        {idea?.video_prompt && (
          <div className="mt-8">
            <div className="font-mono text-[9px] text-muted mb-3">
              GENERATED VIDEO PROMPT
            </div>

            <div
              className="rounded-xl p-4 text-xs leading-relaxed"
              style={{
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,255,255,0.06)',
                color: 'var(--text-muted)',
              }}
            >
              {idea.video_prompt}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4 mt-8">
          <a
            href="https://fal.ai/dashboard"
            target="_blank"
            rel="noreferrer"
            className="rounded-xl p-5 transition-all"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] text-muted">
                VIDEO PROVIDER
              </span>
              <ExternalLink size={13} className="text-muted" />
            </div>

            <div className="font-display text-lg font-bold mt-3">
              Check fal.ai
            </div>

            <p className="text-xs text-muted mt-2">
              Verify credits, model availability and account status.
            </p>
          </a>

          <a
            href="https://replicate.com/account/api-tokens"
            target="_blank"
            rel="noreferrer"
            className="rounded-xl p-5 transition-all"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] text-muted">
                FALLBACK PROVIDER
              </span>
              <ExternalLink size={13} className="text-muted" />
            </div>

            <div className="font-display text-lg font-bold mt-3">
              Check Replicate
            </div>

            <p className="text-xs text-muted mt-2">
              Verify that the fallback API token is configured.
            </p>
          </a>
        </div>
      </div>
    </div>
  )
}

export default function VideoStudio({
  jobId,
  brand,
  idea,
  onStartOver,
}) {
  const [status, setStatus] = useState('starting')
  const [videoUrl, setVideoUrl] = useState(null)
  const [error, setError] = useState(null)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!jobId) return

    let cancelled = false
    let interval

    async function checkStatus() {
      try {
        const result = await api.getVideoStatus(jobId)

        if (cancelled) return

        if (result.status === 'ready') {
          setStatus('ready')
          setVideoUrl(result.video_url)
          return
        }

        if (
          result.status === 'failed' ||
          result.status === 'error' ||
          result.status === 'no_key'
        ) {
          setStatus('failed')
          setError(
            result.error ||
            result.message ||
            'The video generation service could not complete the request.'
          )
          return
        }

        setStatus('generating')
      } catch (e) {
        if (!cancelled) {
          setStatus('failed')
          setError(e.message || 'Unable to check video generation status.')
        }
      }
    }

    checkStatus()

    interval = setInterval(() => {
      checkStatus()
    }, 4000)

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [jobId])

  useEffect(() => {
    if (status !== 'starting' && status !== 'generating') return

    const timer = setInterval(() => {
      setElapsed((value) => value + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [status])

  const hashtags = useMemo(() => {
    const source =
      idea?.hashtags ||
      idea?.tags ||
      brand?.hashtags ||
      []

    return Array.isArray(source) ? source : []
  }, [idea, brand])

  const caption =
    idea?.caption ||
    idea?.description ||
    idea?.concept ||
    ''

  const title =
    idea?.title ||
    idea?.concept ||
    'AI Generated Reel'

  const filename = `${(brand?.name || 'brandpulse')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')}-reel.mp4`

  if (status === 'failed') {
    return <FailedState error={error} idea={idea} />
  }

  if (!videoUrl || status === 'starting' || status === 'generating') {
    return (
      <div className="page-container pb-16">
        <GeneratingAnimation elapsed={elapsed} />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
          <div>
            <div className="font-mono text-[9px] text-muted">
              CURRENT CONCEPT
            </div>
            <div className="font-display text-lg font-bold mt-1">
              {title}
            </div>
          </div>

          <div className="font-mono text-[9px] text-dim">
            JOB / {jobId || 'INITIALISING'}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container pb-16">
      <section
        className="rounded-[26px] p-6 md:p-8 mb-8"
        style={{
          background:
            'linear-gradient(120deg, rgba(99,230,190,0.07), rgba(255,255,255,0.02))',
          border: '1px solid rgba(99,230,190,0.15)',
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
              style={{
                background: 'rgba(99,230,190,0.1)',
                color: 'var(--accent)',
              }}
            >
              <Check size={19} />
            </div>

            <div>
              <div className="eyebrow text-accent">
                <span className="live-dot" />
                RENDER COMPLETE
              </div>

              <h2 className="font-display text-2xl font-bold mt-2">
                Your Reel is ready.
              </h2>

              <p className="text-muted text-sm mt-1">
                Generated for {brand?.name || 'your brand'}.
              </p>
            </div>
          </div>

          <a
            href={api.downloadUrl(jobId)}
            download={filename}
            className="btn btn-approve group"
            style={{
              padding: '13px 18px',
              fontSize: '12px',
            }}
          >
            <Download size={15} />
            Download Reel
          </a>
        </div>
      </section>

      <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 items-start">
        <div>
          <VideoPlayer url={videoUrl} />
        </div>

        <div className="space-y-5">
          <section
            className="rounded-[24px] p-6 md:p-7"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
            }}
          >
            <div className="flex items-center justify-between">
              <div className="eyebrow">
                <Sparkles size={11} />
                CREATIVE OUTPUT
              </div>

              <span className="pill pill-accent">READY</span>
            </div>

            <h3 className="font-display text-2xl font-bold mt-5">
              {title}
            </h3>

            {caption && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-mono text-[9px] text-muted">
                    CAPTION
                  </div>
                  <CopyButton text={caption} />
                </div>

                <div
                  className="rounded-xl p-4 text-sm leading-relaxed"
                  style={{
                    background: 'rgba(255,255,255,0.025)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    color: 'var(--text-soft)',
                  }}
                >
                  {caption}
                </div>
              </div>
            )}

            {hashtags.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 font-mono text-[9px] text-muted">
                    <Hash size={11} />
                    HASHTAGS
                  </div>

                  <CopyButton
                    text={hashtags.join(' ')}
                    label="COPY ALL"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {hashtags.map((tag) => (
                    <span
                      key={tag}
                      className="pill pill-muted"
                      style={{
                        color: 'var(--accent)',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>

          <section
            className="rounded-[24px] p-6"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
            }}
          >
            <div className="eyebrow">
              <Download size={11} />
              PUBLISHING CHECKLIST
            </div>

            <div className="mt-5 space-y-3">
              {[
                'Download the 9:16 Reel',
                'Review the generated caption',
                'Add the suggested hashtags',
                'Upload to Instagram Reels',
              ].map((item, index) => (
                <div
                  key={item}
                  className="flex items-center gap-3 py-3"
                  style={{
                    borderBottom:
                      index < 3
                        ? '1px solid rgba(255,255,255,0.05)'
                        : 'none',
                  }}
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{
                      background: 'rgba(99,230,190,0.08)',
                      color: 'var(--accent)',
                    }}
                  >
                    <Check size={12} />
                  </div>

                  <span className="text-xs text-muted">{item}</span>
                </div>
              ))}
            </div>
          </section>

          <button
            type="button"
            onClick={onStartOver}
            className="btn btn-ghost w-full justify-center"
            style={{
              padding: '13px 18px',
              fontSize: '11px',
            }}
          >
            <RotateCcw size={13} />
            START ANOTHER BRAND ANALYSIS
          </button>
        </div>
      </div>
    </div>
  )
}