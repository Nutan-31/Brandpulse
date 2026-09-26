import { useEffect, useState } from 'react'
import { api } from './api.js'
import BrandSetup from './components/BrandSetup.jsx'
import TrendFeed from './components/TrendFeed.jsx'
import IdeaCards from './components/IdeaCards.jsx'
import VideoStudio from './components/VideoStudio.jsx'
import {
  Check,
  Circle,
  Sparkles,
  Zap,
  Activity,
  Sun,
  Moon,
} from 'lucide-react'

const STEPS = [
  { number: '01', label: 'Brand' },
  { number: '02', label: 'Signals' },
  { number: '03', label: 'Concepts' },
  { number: '04', label: 'Studio' },
]

function BrandMark() {
  return (
    <div className="bp-logo">
      <div className="bp-logo-mark">
        <Zap size={14} strokeWidth={2.5} />
      </div>

      <div className="bp-logo-text">
        Brand<span>Pulse</span>
      </div>
    </div>
  )
}

function ThemeToggle({ theme, toggleTheme }) {
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'
        } mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'
        } mode`}
    >
      <span className="theme-toggle-icon">
        {theme === 'dark' ? (
          <Sun size={15} strokeWidth={2.2} />
        ) : (
          <Moon size={15} strokeWidth={2.2} />
        )}
      </span>

      <span className="theme-toggle-label">
        {theme === 'dark' ? 'LIGHT' : 'DARK'}
      </span>
    </button>
  )
}

function StepBar({ current, theme, toggleTheme }) {
  return (
    <header className="bp-nav">
      <div className="bp-nav-inner">

        <BrandMark />

        <div className="bp-steps">
          {STEPS.map((item, index) => {
            const done = index < current
            const active = index === current

            return (
              <div
                key={item.number}
                className="flex items-center"
              >
                <div
                  className={`bp-step ${active ? 'active' : ''
                    } ${done ? 'done' : ''}`}
                >
                  <span className="bp-step-number">
                    {done ? (
                      <Check
                        size={11}
                        strokeWidth={3}
                      />
                    ) : (
                      item.number
                    )}
                  </span>

                  <span className="hidden sm:inline">
                    {item.label}
                  </span>
                </div>

                {index < STEPS.length - 1 && (
                  <div className="section-line hidden sm:block" />
                )}
              </div>
            )
          })}
        </div>

        <div className="bp-nav-right">

          <div className="hidden md:flex items-center gap-2">
            <span className="live-dot" />

            <span className="font-mono text-[10px] text-muted tracking-wider">
              AI WORKSPACE
            </span>
          </div>

          <ThemeToggle
            theme={theme}
            toggleTheme={toggleTheme}
          />

        </div>

      </div>
    </header>
  )
}

function PageIntro({
  number,
  eyebrow,
  title,
  description,
}) {
  return (
    <div className="page-container pt-12 pb-8">

      <div className="flex items-start gap-5">

        <div className="section-number">
          {number}
        </div>

        <div className="max-w-3xl">

          <div className="eyebrow mb-4">
            <Activity size={11} />
            {eyebrow}
          </div>

          <h1 className="display-title">
            {title}
          </h1>

          {description && (
            <p className="text-muted text-base md:text-lg mt-5 max-w-2xl leading-relaxed">
              {description}
            </p>
          )}

        </div>

      </div>

    </div>
  )
}

function Toast({ msg, type }) {
  if (!msg) return null

  return (
    <div
      className={`toast ${type === 'error'
        ? 'toast-error'
        : 'toast-success'
        }`}
    >
      <div className="toast-icon">
        {type === 'error' ? (
          <Circle size={13} />
        ) : (
          <Check size={14} />
        )}
      </div>

      <span>{msg}</span>
    </div>
  )
}

function LoadingOverlay() {
  return (
    <div className="loading-overlay">

      <div className="generation-orbit">

        <div className="generation-orbit-ring ring-one" />
        <div className="generation-orbit-ring ring-two" />

        <div className="generation-core">
          <Sparkles size={25} />
        </div>

      </div>

      <div className="loading-copy">

        <div className="eyebrow justify-center mb-3">
          <span className="live-dot" />
          LIVE DATA
        </div>

        <h2 className="font-display text-2xl font-bold">
          Reading the market
        </h2>

        <p className="text-muted text-sm mt-2">
          Scanning Instagram signals via Apify...
        </p>

      </div>

    </div>
  )
}

export default function App() {

  /* =====================================================
     THEME
     ===================================================== */

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem(
      'brandpulse-theme'
    )

    if (
      savedTheme === 'dark' ||
      savedTheme === 'light'
    ) {
      return savedTheme
    }

    return 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      theme
    )

    localStorage.setItem(
      'brandpulse-theme',
      theme
    )
  }, [theme])

  function toggleTheme() {
    setTheme((current) =>
      current === 'dark'
        ? 'light'
        : 'dark'
    )
  }

  /* =====================================================
     APP STATE
     ===================================================== */

  const [step, setStep] = useState(0)
  const [brand, setBrand] = useState(null)
  const [trends, setTrends] = useState(null)
  const [ideas, setIdeas] = useState([])
  const [jobId, setJobId] = useState(null)
  const [selectedIdea, setSelectedIdea] = useState(null)

  const [loadingTrends, setLoadingTrends] = useState(false)
  const [loadingIdeas, setLoadingIdeas] = useState(false)
  const [loadingVideo, setLoadingVideo] = useState(false)
  const [regenerating, setRegenerating] = useState(false)

  const [toast, setToast] = useState(null)

  function showToast(msg, type = 'success') {
    setToast({
      msg,
      type,
    })

    setTimeout(() => {
      setToast(null)
    }, 3500)
  }

  async function handleBrandComplete(config) {
    setBrand(config)
    setLoadingTrends(true)

    try {
      await api.saveBrand(config)

      showToast(
        'Brand saved. Fetching live Instagram signals...'
      )

      const t = await api.getTrends(config)

      setTrends(t)
      setStep(1)

    } catch (e) {
      showToast(
        e.message || 'Failed to fetch trends',
        'error'
      )
    } finally {
      setLoadingTrends(false)
    }
  }

  async function handleGenerateIdeas() {
    setLoadingIdeas(true)

    try {
      const result = await api.generateIdeas(
        brand,
        trends
      )

      setIdeas(result.ideas || [])
      setStep(2)

      showToast(
        '3 reel concepts generated by Groq Llama 3.3 70B'
      )

    } catch (e) {
      showToast(
        e.message || 'Idea generation failed',
        'error'
      )
    } finally {
      setLoadingIdeas(false)
    }
  }

  async function handleRegenerate() {
    setRegenerating(true)

    try {
      const result = await api.generateIdeas(
        brand,
        trends
      )

      setIdeas(result.ideas || [])

      showToast('Fresh concepts generated')

    } catch (e) {
      showToast(
        e.message || 'Failed to regenerate ideas',
        'error'
      )
    } finally {
      setRegenerating(false)
    }
  }

  async function handleSelectIdea(idea) {
    setSelectedIdea(idea)
    setLoadingVideo(true)

    try {
      const result = await api.startVideo(
        idea,
        brand
      )

      setJobId(result.job_id)
      setStep(3)

      showToast(
        'Video generation started on Veo 3'
      )

    } catch (e) {
      showToast(
        e.message || 'Failed to start video',
        'error'
      )
    } finally {
      setLoadingVideo(false)
    }
  }

  function handleStartOver() {
    setStep(0)
    setBrand(null)
    setTrends(null)
    setIdeas([])
    setJobId(null)
    setSelectedIdea(null)
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">

      {step > 0 && (
        <StepBar
          current={step}
          theme={theme}
          toggleTheme={toggleTheme}
        />
      )}

      {step === 0 && (
        <div className="theme-toggle-home">
          <ThemeToggle
            theme={theme}
            toggleTheme={toggleTheme}
          />
        </div>
      )}

      <main>

        {step === 0 && (
          <BrandSetup
            onComplete={handleBrandComplete}
          />
        )}

        {step === 1 && brand && (
          <>
            <PageIntro
              number="02"
              eyebrow="LIVE SIGNALS / INSTAGRAM"
              title={
                <>
                  Read the market.
                  <br />

                  <span className="text-accent">
                    Find the opening.
                  </span>
                </>
              }
              description={`Real-time Instagram intelligence mapped around ${brand.name}.`}
            />

            <TrendFeed
              brand={brand}
              trends={trends}
              onGenerate={handleGenerateIdeas}
              generating={loadingIdeas}
            />
          </>
        )}

        {step === 2 && (
          <>
            <PageIntro
              number="03"
              eyebrow="AI CREATIVE LAB"
              title={
                <>
                  Turn signals into
                  <br />

                  <span className="text-accent">
                    something people watch.
                  </span>
                </>
              }
              description="Three AI-generated Reel concepts built from the live signals your audience is already responding to."
            />

            <IdeaCards
              brand={brand}
              ideas={ideas}
              onSelectIdea={handleSelectIdea}
              loading={loadingVideo}
              onRegenerate={handleRegenerate}
              regenerating={regenerating}
            />
          </>
        )}

        {step === 3 && (
          <>
            <PageIntro
              number="04"
              eyebrow="VIDEO PRODUCTION / AI STUDIO"
              title={
                <>
                  From concept
                  <br />

                  <span className="text-accent">
                    to finished Reel.
                  </span>
                </>
              }
              description="Your selected concept is being transformed into a production-ready vertical video."
            />

            <VideoStudio
              jobId={jobId}
              brand={brand}
              idea={selectedIdea}
              onStartOver={handleStartOver}
            />
          </>
        )}

      </main>

      {loadingTrends && (
        <LoadingOverlay />
      )}

      {toast && (
        <Toast
          msg={toast.msg}
          type={toast.type}
        />
      )}

    </div>
  )
}