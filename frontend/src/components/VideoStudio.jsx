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


/* =========================================================
   GENERATING STATE
   ========================================================= */

function GeneratingAnimation({ elapsed }) {
  const stages = [
    {
      time: 0,
      label: 'Preparing creative direction',
    },
    {
      time: 5,
      label: 'Building cinematic composition',
    },
    {
      time: 15,
      label: 'Generating video frames',
    },
    {
      time: 30,
      label: 'Refining motion and detail',
    },
    {
      time: 45,
      label: 'Finalising your Reel',
    },
  ]

  const currentStage =
    [...stages]
      .reverse()
      .find((stage) => elapsed >= stage.time) || stages[0]

  const progress = Math.min((elapsed / 60) * 100, 96)

  return (
    <div className="video-generating">
      <div className="video-generating-orbit">
        <div className="video-orbit-ring video-orbit-one" />
        <div className="video-orbit-ring video-orbit-two" />

        <div className="video-generating-core">
          <Sparkles size={24} />
        </div>
      </div>

      <div className="eyebrow justify-center mt-8">
        <span className="live-dot" />
        AI VIDEO ENGINE
      </div>

      <h2 className="video-generating-title">
        Your Reel is
        <br />
        <span>being created.</span>
      </h2>

      <p className="video-generating-description">
        Your creative concept is being transformed into
        a vertical social video.
      </p>

      <div className="video-progress-wrap">
        <div className="video-progress-meta">
          <span>
            {currentStage.label.toUpperCase()}
          </span>

          <span>
            {elapsed}s
          </span>
        </div>

        <div className="video-progress-track">
          <div
            className="video-progress-fill"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>

      <div className="video-generation-stages">
        {stages.slice(0, 3).map((stage, index) => {
          const complete =
            elapsed >= stage.time + 10

          return (
            <div
              key={stage.label}
              className={`video-generation-stage ${complete ? 'complete' : ''
                }`}
            >
              <div className="video-stage-number">
                {complete
                  ? <Check size={10} />
                  : `0${index + 1}`}
              </div>

              <span>
                {stage.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}


/* =========================================================
   VIDEO PLAYER
   ========================================================= */

function VideoPlayer({ url }) {
  const videoRef = useRef(null)

  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)

  async function togglePlay() {
    if (!videoRef.current) return

    try {
      if (videoRef.current.paused) {
        await videoRef.current.play()
        setPlaying(true)
      } else {
        videoRef.current.pause()
        setPlaying(false)
      }
    } catch {
      setPlaying(false)
    }
  }

  function toggleMute() {
    if (!videoRef.current) return

    videoRef.current.muted =
      !videoRef.current.muted

    setMuted(videoRef.current.muted)
  }

  return (
    <div className="video-player-shell">
      <div className="video-player-label">
        <span>REEL PREVIEW</span>

        <span className="video-format-badge">
          9:16
        </span>
      </div>

      <div className="video-player">
        <video
          ref={videoRef}
          src={url}
          playsInline
          muted
          className="video-element"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />

        <div className="video-player-gradient" />

        <div className="video-player-controls">
          <button
            type="button"
            onClick={togglePlay}
            className="video-control-button"
            aria-label={
              playing ? 'Pause video' : 'Play video'
            }
          >
            {playing
              ? <Pause size={16} />
              : <Play size={16} />}
          </button>

          <button
            type="button"
            onClick={toggleMute}
            className="video-control-button"
            aria-label={
              muted ? 'Unmute video' : 'Mute video'
            }
          >
            {muted
              ? <VolumeX size={16} />
              : <Volume2 size={16} />}
          </button>
        </div>
      </div>
    </div>
  )
}


/* =========================================================
   COPY BUTTON
   ========================================================= */

function CopyButton({
  text,
  label = 'COPY',
}) {
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
      className="video-copy-button"
    >
      {copied
        ? <Check size={12} />
        : <Copy size={12} />}

      {copied ? 'COPIED' : label}
    </button>
  )
}


/* =========================================================
   FAILED STATE
   ========================================================= */

function FailedState({
  error,
  idea,
}) {
  return (
    <div className="page-container pb-16">
      <section className="video-failed">
        <div className="video-failed-icon">
          <RotateCcw size={19} />
        </div>

        <div className="video-failed-kicker">
          VIDEO GENERATION INTERRUPTED
        </div>

        <h2 className="video-failed-title">
          The studio couldn't
          <br />
          <span>finish the render.</span>
        </h2>

        <p className="video-failed-description">
          {error ||
            'The video provider returned an error while generating this Reel.'}
        </p>

        {idea?.video_prompt && (
          <div className="video-failed-prompt">
            <div className="video-section-label">
              GENERATED VIDEO PROMPT
            </div>

            <div className="video-prompt-box">
              {idea.video_prompt}
            </div>
          </div>
        )}

        <div className="video-provider-grid">
          <a
            href="https://fal.ai/dashboard"
            target="_blank"
            rel="noreferrer"
            className="video-provider-card"
          >
            <div className="video-provider-top">
              <span>
                VIDEO PROVIDER
              </span>

              <ExternalLink size={13} />
            </div>

            <h3>
              Check fal.ai
            </h3>

            <p>
              Verify credits, model availability
              and account status.
            </p>
          </a>

          <a
            href="https://replicate.com/account/api-tokens"
            target="_blank"
            rel="noreferrer"
            className="video-provider-card"
          >
            <div className="video-provider-top">
              <span>
                FALLBACK PROVIDER
              </span>

              <ExternalLink size={13} />
            </div>

            <h3>
              Check Replicate
            </h3>

            <p>
              Verify that the fallback API
              token is configured.
            </p>
          </a>
        </div>
      </section>
    </div>
  )
}


/* =========================================================
   MAIN VIDEO STUDIO
   ========================================================= */

export default function VideoStudio({
  jobId,
  brand,
  idea,
  onStartOver,
}) {
  const [status, setStatus] =
    useState('starting')

  const [videoUrl, setVideoUrl] =
    useState(null)

  const [error, setError] =
    useState(null)

  const [elapsed, setElapsed] =
    useState(0)


  /* -------------------------------------------------------
     VIDEO STATUS POLLING
     ------------------------------------------------------- */

  useEffect(() => {
    if (!jobId) return

    let cancelled = false
    let interval

    async function checkStatus() {
      try {
        const result =
          await api.getVideoStatus(jobId)

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

          setError(
            e.message ||
            'Unable to check video generation status.'
          )
        }
      }
    }

    checkStatus()

    interval = setInterval(
      checkStatus,
      4000
    )

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [jobId])


  /* -------------------------------------------------------
     GENERATION TIMER
     ------------------------------------------------------- */

  useEffect(() => {
    if (
      status !== 'starting' &&
      status !== 'generating'
    ) {
      return
    }

    const timer = setInterval(() => {
      setElapsed((value) => value + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [status])


  /* -------------------------------------------------------
     CREATIVE DATA
     ------------------------------------------------------- */

  const hashtags = useMemo(() => {
    const source =
      idea?.hashtags ||
      idea?.tags ||
      brand?.hashtags ||
      []

    return Array.isArray(source)
      ? source
      : []
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


  const filename =
    `${(brand?.name || 'brandpulse')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')}-reel.mp4`


  /* =======================================================
     FAILED
     ======================================================= */

  if (status === 'failed') {
    return (
      <FailedState
        error={error}
        idea={idea}
      />
    )
  }


  /* =======================================================
     GENERATING
     ======================================================= */

  if (
    !videoUrl ||
    status === 'starting' ||
    status === 'generating'
  ) {
    return (
      <div className="page-container pb-16">

        <section className="video-hero">
          <div>
            <div className="ideas-kicker">
              <Sparkles size={11} />
              VIDEO STUDIO
            </div>

            <h1>
              Your idea,
              <br />
              <span>now in motion.</span>
            </h1>

            <p>
              We're turning your selected concept
              into a ready-to-publish Reel.
            </p>
          </div>

          <div className="video-generating-meta">
            <span className="live-dot" />
            GENERATING
          </div>
        </section>


        <GeneratingAnimation
          elapsed={elapsed}
        />


        <div className="video-current-concept">
          <div>
            <div className="video-section-label">
              CURRENT CONCEPT
            </div>

            <div className="video-current-title">
              {title}
            </div>
          </div>

          <div className="video-job">
            JOB / {jobId || 'INITIALISING'}
          </div>
        </div>

      </div>
    )
  }


  /* =======================================================
     READY
     ======================================================= */

  return (
    <div className="page-container pb-16">

      {/* HERO */}

      <section className="video-hero video-hero-ready">
        <div>
          <div className="ideas-kicker">
            <Check size={11} />
            VIDEO STUDIO
          </div>

          <h1>
            Your Reel
            <br />
            <span>is ready.</span>
          </h1>

          <p>
            Your creative concept has been
            turned into a finished vertical video.
          </p>
        </div>

        <div className="video-ready-actions">
          <div className="video-ready-status">
            <span className="video-ready-dot" />
            RENDER COMPLETE
          </div>

          <a
            href={api.downloadUrl(jobId)}
            download={filename}
            className="video-download-button"
          >
            <Download size={15} />
            Download Reel
          </a>
        </div>
      </section>


      {/* MAIN WORKSPACE */}

      <div className="video-workspace">

        {/* LEFT — VIDEO */}

        <div className="video-preview-column">

          <VideoPlayer
            url={videoUrl}
          />

          <div className="video-preview-meta">
            <div>
              <span>FORMAT</span>
              <strong>Vertical 9:16</strong>
            </div>

            <div>
              <span>OUTPUT</span>
              <strong>AI Generated Reel</strong>
            </div>
          </div>

        </div>


        {/* RIGHT — CREATIVE OUTPUT */}

        <div className="video-output-column">

          <section className="video-output-card">

            <div className="video-card-top">
              <div className="video-section-label">
                <Sparkles size={11} />
                CREATIVE OUTPUT
              </div>

              <span className="video-ready-pill">
                READY
              </span>
            </div>


            <h2 className="video-output-title">
              {title}
            </h2>


            {caption && (
              <div className="video-content-block">

                <div className="video-content-heading">
                  <span>
                    CAPTION
                  </span>

                  <CopyButton
                    text={caption}
                  />
                </div>

                <div className="video-caption">
                  {caption}
                </div>

              </div>
            )}


            {hashtags.length > 0 && (
              <div className="video-content-block">

                <div className="video-content-heading">
                  <span className="video-heading-with-icon">
                    <Hash size={11} />
                    HASHTAGS
                  </span>

                  <CopyButton
                    text={hashtags.join(' ')}
                    label="COPY ALL"
                  />
                </div>

                <div className="video-hashtags">
                  {hashtags.map(
                    (tag, index) => (
                      <span
                        key={`${tag}-${index}`}
                      >
                        {tag}
                      </span>
                    )
                  )}
                </div>

              </div>
            )}

          </section>


          {/* QUICK PUBLISH */}

          <section className="video-publish-card">

            <div className="video-card-top">
              <div className="video-section-label">
                READY TO PUBLISH
              </div>
            </div>

            <div className="video-publish-list">

              <div>
                <span className="video-check">
                  <Check size={11} />
                </span>

                <span>
                  Download your 9:16 Reel
                </span>
              </div>

              <div>
                <span className="video-check">
                  <Check size={11} />
                </span>

                <span>
                  Use the generated caption
                </span>
              </div>

              <div>
                <span className="video-check">
                  <Check size={11} />
                </span>

                <span>
                  Add your suggested hashtags
                </span>
              </div>

            </div>

          </section>


          {/* START AGAIN */}

          <button
            type="button"
            onClick={onStartOver}
            className="video-start-over"
          >
            <RotateCcw size={13} />
            CREATE ANOTHER REEL
          </button>

        </div>

      </div>

    </div>
  )
}