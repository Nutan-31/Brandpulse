
import { useState } from 'react'
import { api } from './api.js'

import BrandSetup from './components/BrandSetup.jsx'
import TrendFeed from './components/TrendFeed.jsx'
import IdeaCards from './components/IdeaCards.jsx'
import VideoStudio from './components/VideoStudio.jsx'

import {
  LayoutDashboard,
  BriefcaseBusiness,
  TrendingUp,
  Lightbulb,
  Clapperboard,
  Settings,
  HelpCircle,
  Bell,
  Search,
  Check,
  Circle,
  Sparkles,
  Zap,
  Activity,
  ChevronRight,
} from 'lucide-react'


// ============================================================
// NAVIGATION
// ============================================================

const NAV_ITEMS = [
  {
    id: 0,
    label: 'Overview',
    icon: LayoutDashboard,
  },
  {
    id: 1,
    label: 'Brand',
    icon: BriefcaseBusiness,
  },
  {
    id: 2,
    label: 'Trends',
    icon: TrendingUp,
  },
  {
    id: 3,
    label: 'Ideas',
    icon: Lightbulb,
  },
  {
    id: 4,
    label: 'Video Studio',
    icon: Clapperboard,
  },
]


// ============================================================
// BRAND MARK
// ============================================================

function BrandMark() {
  return (
    <div className="dashboard-brand">
      <div className="dashboard-brand-mark">
        <Zap size={15} strokeWidth={2.7} />
      </div>

      <div>
        <div className="dashboard-brand-name">
          Brand<span>Pulse</span>
        </div>

        <div className="dashboard-brand-subtitle">
          AI MARKETING INTELLIGENCE
        </div>
      </div>
    </div>
  )
}


// ============================================================
// SIDEBAR
// ============================================================

function Sidebar({ step, onNavigate, brand }) {
  return (
    <aside className="dashboard-sidebar">

      <div className="sidebar-top">

        <BrandMark />

        <div className="sidebar-section-label">
          WORKSPACE
        </div>

        <nav className="sidebar-nav">

          {NAV_ITEMS.map((item) => {

            const Icon = item.icon

            // Overview is available visually,
            // but the actual workflow starts at Brand.
            const targetStep =
              item.id === 0
                ? 0
                : item.id - 1

            const active =
              item.id === step + 1 ||
              (step === 0 && item.id === 1)

            return (
              <button
                key={item.id}
                type="button"
                className={`sidebar-nav-item ${
                  active ? 'active' : ''
                }`}
                onClick={() => {

                  if (item.id === 1) {
                    onNavigate(0)
                  }

                  if (item.id === 2 && brand) {
                    onNavigate(1)
                  }

                  if (item.id === 3 && brand) {
                    onNavigate(2)
                  }

                  if (item.id === 4 && brand) {
                    onNavigate(3)
                  }

                }}
              >

                <Icon size={17} strokeWidth={1.9} />

                <span>
                  {item.label}
                </span>

                {active && (
                  <span className="sidebar-active-indicator" />
                )}

              </button>
            )
          })}

        </nav>

      </div>


      <div className="sidebar-bottom">

        <div className="sidebar-divider" />

        <button
          type="button"
          className="sidebar-nav-item"
        >
          <Settings size={17} strokeWidth={1.9} />
          <span>Settings</span>
        </button>

        <button
          type="button"
          className="sidebar-nav-item"
        >
          <HelpCircle size={17} strokeWidth={1.9} />
          <span>Help & Support</span>
        </button>


        {brand && (

          <div className="sidebar-brand-card">

            <div className="sidebar-brand-avatar">
              {brand.name?.charAt(0)?.toUpperCase() || 'B'}
            </div>

            <div className="sidebar-brand-info">

              <span className="sidebar-brand-label">
                ACTIVE BRAND
              </span>

              <strong>
                {brand.name}
              </strong>

            </div>

          </div>

        )}

      </div>

    </aside>
  )
}


// ============================================================
// TOPBAR
// ============================================================

function Topbar({ step, brand }) {

  const titles = [
    'Brand workspace',
    'Market signals',
    'Creative concepts',
    'Video studio',
  ]

  return (
    <header className="dashboard-topbar">

      <div className="topbar-page-title">

        <span className="topbar-eyebrow">
          {titles[step] || 'Brand workspace'}
        </span>

        {brand && (
          <span className="topbar-brand">
            {brand.name}
          </span>
        )}

      </div>


      <div className="topbar-actions">

        <button
          type="button"
          className="topbar-icon-button"
          aria-label="Search"
        >
          <Search size={18} />
        </button>

        <button
          type="button"
          className="topbar-icon-button"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span className="notification-dot" />
        </button>

        <div className="topbar-divider" />

        <div className="topbar-profile">

          <div className="topbar-avatar">
            {brand?.name?.charAt(0)?.toUpperCase() || 'B'}
          </div>

          <div className="topbar-profile-copy">

            <strong>
              Brand workspace
            </strong>

            <span>
              AI marketing
            </span>

          </div>

        </div>

      </div>

    </header>
  )
}


// ============================================================
// PAGE HEADER
// ============================================================

function PageHeader({
  eyebrow,
  title,
  description,
  number,
}) {

  return (
    <div className="dashboard-page-header">

      <div className="dashboard-page-number">
        {number}
      </div>

      <div className="dashboard-page-copy">

        <div className="dashboard-eyebrow">

          <Activity size={12} />

          <span>
            {eyebrow}
          </span>

        </div>

        <h1>
          {title}
        </h1>

        {description && (
          <p>
            {description}
          </p>
        )}

      </div>

    </div>
  )
}


// ============================================================
// PROGRESS
// ============================================================

function WorkflowProgress({ step }) {

  const stages = [
    'Brand',
    'Signals',
    'Concepts',
    'Studio',
  ]

  return (
    <div className="workflow-progress">

      {stages.map((stage, index) => {

        const done = index < step
        const active = index === step

        return (
          <div
            key={stage}
            className="workflow-progress-item"
          >

            <div
              className={`workflow-progress-circle ${
                done ? 'done' : ''
              } ${active ? 'active' : ''}`}
            >

              {done ? (
                <Check size={11} strokeWidth={3} />
              ) : (
                index + 1
              )}

            </div>

            <span
              className={
                active
                  ? 'active'
                  : ''
              }
            >
              {stage}
            </span>

            {index < stages.length - 1 && (
              <div className="workflow-progress-line" />
            )}

          </div>
        )
      })}

    </div>
  )
}


// ============================================================
// TOAST
// ============================================================

function Toast({ msg, type }) {

  if (!msg) return null

  return (

    <div
      className={`dashboard-toast ${
        type === 'error'
          ? 'error'
          : ''
      }`}
    >

      <div className="dashboard-toast-icon">

        {type === 'error'
          ? <Circle size={14} />
          : <Check size={14} />
        }

      </div>

      <span>
        {msg}
      </span>

    </div>
  )
}


// ============================================================
// LOADING OVERLAY
// ============================================================

function LoadingOverlay() {

  return (

    <div className="dashboard-loading">

      <div className="dashboard-loading-card">

        <div className="dashboard-loading-icon">

          <div className="loading-ring ring-one" />
          <div className="loading-ring ring-two" />

          <div className="loading-core">
            <Sparkles size={23} />
          </div>

        </div>


        <div className="dashboard-loading-copy">

          <div className="dashboard-eyebrow">
            <span className="live-dot" />
            LIVE DATA
          </div>

          <h2>
            Reading the market
          </h2>

          <p>
            Scanning Instagram signals via Apify...
          </p>

        </div>

      </div>

    </div>
  )
}


// ============================================================
// MAIN APP
// ============================================================

export default function App() {

  const [step, setStep] = useState(0)

  const [brand, setBrand] = useState(null)

  const [trends, setTrends] = useState(null)

  const [ideas, setIdeas] = useState([])

  const [jobId, setJobId] = useState(null)

  const [selectedIdea, setSelectedIdea] = useState(null)

  const [loadingTrends, setLoadingTrends] =
    useState(false)

  const [loadingIdeas, setLoadingIdeas] =
    useState(false)

  const [loadingVideo, setLoadingVideo] =
    useState(false)

  const [regenerating, setRegenerating] =
    useState(false)

  const [toast, setToast] =
    useState(null)


  // ==========================================================
  // TOAST
  // ==========================================================

  function showToast(
    msg,
    type = 'success'
  ) {

    setToast({
      msg,
      type,
    })

    setTimeout(() => {
      setToast(null)
    }, 3500)
  }


  // ==========================================================
  // BRAND → TRENDS
  // ==========================================================

  async function handleBrandComplete(config) {

    setBrand(config)

    setIdeas([])

    setSelectedIdea(null)

    setJobId(null)

    setLoadingTrends(true)

    try {

      await api.saveBrand(config)

      const liveTrends =
        await api.getTrends(config)

      setTrends(liveTrends)

      showToast(
        'Brand saved. Pulling live market signals...'
      )

      setStep(1)

    } catch (e) {

      showToast(
        e.message ||
        'Failed to fetch trends',
        'error'
      )

      setTrends(null)

    } finally {

      setLoadingTrends(false)

    }
  }


  // ==========================================================
  // TRENDS → IDEAS
  // ==========================================================

  async function handleGenerateIdeas() {

    setLoadingIdeas(true)

    try {

      const result =
        await api.generateIdeas(
          brand,
          trends
        )

      setIdeas(
        result.ideas || []
      )

      setStep(2)

      showToast(
        '3 reel concepts generated by Groq Llama 3.3 70B'
      )

    } catch (e) {

      showToast(
        e.message ||
        'Idea generation failed',
        'error'
      )

    } finally {

      setLoadingIdeas(false)

    }
  }


  // ==========================================================
  // REGENERATE IDEAS
  // ==========================================================

  async function handleRegenerate() {

    setRegenerating(true)

    try {

      const result =
        await api.generateIdeas(
          brand,
          trends
        )

      setIdeas(
        result.ideas || []
      )

      showToast(
        'Fresh concepts generated'
      )

    } catch (e) {

      showToast(
        e.message ||
        'Failed to regenerate ideas',
        'error'
      )

    } finally {

      setRegenerating(false)

    }
  }


  // ==========================================================
  // IDEA → VIDEO
  // ==========================================================

  async function handleSelectIdea(idea) {

    setSelectedIdea(idea)

    setLoadingVideo(true)

    try {

      const result =
        await api.startVideo(
          idea,
          brand
        )

      setJobId(
        result.job_id
      )

      setStep(3)

      showToast(
        'Your video guide is being prepared.'
      )

    } catch (e) {

      showToast(
        e.message ||
        'Failed to start video',
        'error'
      )

    } finally {

      setLoadingVideo(false)

    }
  }


  // ==========================================================
  // NAVIGATION
  // ==========================================================

  function handleNavigate(target) {

    // Brand is always accessible.
    if (target === 0) {
      setStep(0)
      return
    }

    // Don't allow skipping into stages
    // where the required data doesn't exist.
    if (target === 1 && brand) {
      setStep(1)
      return
    }

    if (target === 2 && ideas.length > 0) {
      setStep(2)
      return
    }

    if (target === 3 && selectedIdea) {
      setStep(3)
    }
  }


  // ==========================================================
  // START OVER
  // ==========================================================

  function handleStartOver() {

    setStep(0)

    setBrand(null)

    setTrends(null)

    setIdeas([])

    setJobId(null)

    setSelectedIdea(null)
  }


  // ==========================================================
  // CURRENT PAGE
  // ==========================================================

  function renderPage() {

    // --------------------------------------------------------
    // BRAND
    // --------------------------------------------------------

    if (step === 0) {

      return (

        <>

          <PageHeader
            number="01"
            eyebrow="BRAND WORKSPACE"
            title="Set up your brand."
            description="Define your brand context so BrandPulse can understand your market, audience and creative direction."
          />

          <BrandSetup
            onComplete={
              handleBrandComplete
            }
          />

        </>
      )
    }


    // --------------------------------------------------------
    // TRENDS
    // --------------------------------------------------------

    if (step === 1 && brand) {

      return (

        <>

          <PageHeader
            number="02"
            eyebrow="LIVE MARKET SIGNALS"
            title={
              <>
                Understand what
                <br />
                <span>people are watching.</span>
              </>
            }
            description={
              `Real-time Instagram intelligence mapped around ${brand.name}.`
            }
          />

          <TrendFeed
            brand={brand}
            trends={trends}
            onGenerate={
              handleGenerateIdeas
            }
            generating={
              loadingIdeas
            }
          />

        </>
      )
    }


    // --------------------------------------------------------
    // IDEAS
    // --------------------------------------------------------

    if (step === 2) {

      return (

        <>

          <PageHeader
            number="03"
            eyebrow="AI CREATIVE LAB"
            title={
              <>
                Turn signals into
                <br />
                <span>content people watch.</span>
              </>
            }
            description="Three concept directions built from the market signals your audience is already responding to."
          />

          <IdeaCards
            brand={brand}
            ideas={ideas}
            onSelectIdea={
              handleSelectIdea
            }
            loading={
              loadingVideo
            }
            onRegenerate={
              handleRegenerate
            }
            regenerating={
              regenerating
            }
          />

        </>
      )
    }


    // --------------------------------------------------------
    // VIDEO
    // --------------------------------------------------------

    if (step === 3) {

      return (

        <>

          <PageHeader
            number="04"
            eyebrow="VIDEO GUIDE / CREATIVE STUDIO"
            title={
              <>
                Turn the concept
                <br />
                <span>into a real Reel.</span>
              </>
            }
            description="BrandPulse gives you the framework to shoot, edit and publish the Reel yourself."
          />

          <VideoStudio
            jobId={jobId}
            brand={brand}
            idea={selectedIdea}
            onStartOver={
              handleStartOver
            }
          />

        </>
      )
    }

    return null
  }


  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <div className="brandpulse-dashboard">

      <Sidebar
        step={step}
        onNavigate={
          handleNavigate
        }
        brand={brand}
      />


      <div className="dashboard-main">

        <Topbar
          step={step}
          brand={brand}
        />


        <main className="dashboard-content">

          {step > 0 && (
            <WorkflowProgress
              step={step}
            />
          )}

          {renderPage()}

        </main>

      </div>


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
