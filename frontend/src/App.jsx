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
  ArrowUpRight,
  Plus,
  Play,
  BarChart3,
  WandSparkles,
} from 'lucide-react'

// ============================================================
// NAVIGATION
// ============================================================

const NAV_ITEMS = [
  { id: 0, label: 'Overview', icon: LayoutDashboard },
  { id: 1, label: 'Brand', icon: BriefcaseBusiness },
  { id: 2, label: 'Trends', icon: TrendingUp },
  { id: 3, label: 'Ideas', icon: Lightbulb },
  { id: 4, label: 'Video Studio', icon: Clapperboard },
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

            const active = item.id === step

            const available =
              item.id === 0 ||
              item.id === 1 ||
              (item.id === 2 && brand) ||
              (item.id === 3 && brand) ||
              (item.id === 4 && brand)

            return (
              <button
                key={item.id}
                type="button"
                className={`sidebar-nav-item ${active ? 'active' : ''
                  }`}
                disabled={!available}
                onClick={() => {
                  if (available) {
                    onNavigate(item.id)
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
    'Overview',
    'Brand workspace',
    'Market intelligence',
    'Creative lab',
    'Video studio',
  ]

  return (
    <header className="dashboard-topbar">

      <div className="topbar-page-title">

        <span className="topbar-eyebrow">
          {titles[step] || 'Overview'}
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
  action,
}) {

  return (
    <div className="dashboard-page-header">

      <div className="dashboard-page-header-main">

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

      {action && (
        <div className="dashboard-page-action">
          {action}
        </div>
      )}

    </div>
  )
}

// ============================================================
// WORKFLOW PROGRESS
// ============================================================

function WorkflowProgress({ step }) {

  const stages = [
    'Overview',
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
              className={`workflow-progress-circle ${done ? 'done' : ''
                } ${active ? 'active' : ''}`}
            >

              {done ? (
                <Check
                  size={11}
                  strokeWidth={3}
                />
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
// OVERVIEW METRIC
// ============================================================

function OverviewMetric({
  icon,
  label,
  value,
  description,
  tone = 'cyan',
}) {

  return (
    <div className={`overview-metric overview-metric-${tone}`}>

      <div className="overview-metric-top">

        <div className="overview-metric-icon">
          {icon}
        </div>

        <ArrowUpRight size={15} />

      </div>

      <div className="overview-metric-value">
        {value}
      </div>

      <div className="overview-metric-label">
        {label}
      </div>

      <div className="overview-metric-description">
        {description}
      </div>

    </div>
  )
}

// ============================================================
// OVERVIEW
// ============================================================

function Overview({
  brand,
  trends,
  ideas,
  onNavigate,
}) {

  const brandName =
    brand?.name || 'your brand'

  return (
    <div className="overview-page">

      {/* HERO */}

      <div className="overview-hero">

        <div>

          <div className="overview-kicker">
            <span className="live-dot" />
            BRANDPULSE WORKSPACE
          </div>

          <h1>
            {brand
              ? `Good to see you, ${brandName}.`
              : 'Build your next campaign.'}
          </h1>

          <p>
            {brand
              ? 'Your marketing intelligence, creative ideas and video workflow in one place.'
              : 'Set up your brand and let BrandPulse turn market signals into content opportunities.'}
          </p>

        </div>

        <button
          type="button"
          className="overview-primary-action"
          onClick={() =>
            onNavigate(brand ? 2 : 1)
          }
        >

          <Plus size={16} />

          {brand
            ? 'Explore trends'
            : 'Set up brand'}

        </button>

      </div>

      {/* METRICS */}

      <div className="overview-metrics">

        <OverviewMetric
          icon={<BarChart3 size={17} />}
          label="Posts analyzed"
          value={trends ? '20+' : '—'}
          description={
            trends
              ? 'Live Instagram signals'
              : 'Waiting for brand setup'
          }
          tone="cyan"
        />

        <OverviewMetric
          icon={<TrendingUp size={17} />}
          label="Market signals"
          value={trends ? 'Live' : '—'}
          description={
            trends
              ? 'Current audience activity'
              : 'No signals yet'
          }
          tone="purple"
        />

        <OverviewMetric
          icon={<WandSparkles size={17} />}
          label="Creative ideas"
          value={ideas.length || '—'}
          description={
            ideas.length
              ? 'AI concepts ready'
              : 'Generate from trends'
          }
          tone="green"
        />

        <OverviewMetric
          icon={<Play size={17} />}
          label="Video studio"
          value={ideas.length ? 'Ready' : '—'}
          description={
            ideas.length
              ? 'Choose a concept to continue'
              : 'Create an idea first'
          }
          tone="coral"
        />

      </div>

      {/* MAIN GRID */}

      <div className="overview-grid">

        {/* WORKSPACE CARD */}

        <section className="overview-workspace-card">

          <div className="overview-card-header">

            <div>
              <span className="overview-card-eyebrow">
                WORKSPACE
              </span>

              <h2>
                {brand
                  ? 'Continue your workflow'
                  : 'Start with your brand'}
              </h2>
            </div>

            <Activity size={18} />

          </div>

          {brand ? (

            <div className="overview-workflow-list">

              <button
                type="button"
                onClick={() => onNavigate(1)}
              >
                <div className="overview-workflow-number">
                  01
                </div>

                <div>
                  <strong>
                    Brand profile
                  </strong>

                  <span>
                    Your brand context is ready
                  </span>
                </div>

                <ArrowUpRight size={17} />
              </button>

              <button
                type="button"
                onClick={() => onNavigate(2)}
              >
                <div className="overview-workflow-number">
                  02
                </div>

                <div>
                  <strong>
                    Market signals
                  </strong>

                  <span>
                    Explore what your audience is watching
                  </span>
                </div>

                <ArrowUpRight size={17} />
              </button>

              <button
                type="button"
                disabled={!ideas.length}
                onClick={() => onNavigate(3)}
              >
                <div className="overview-workflow-number">
                  03
                </div>

                <div>
                  <strong>
                    Creative ideas
                  </strong>

                  <span>
                    {ideas.length
                      ? `${ideas.length} concepts generated`
                      : 'Generate ideas from trends'}
                  </span>
                </div>

                <ArrowUpRight size={17} />
              </button>

              <button
                type="button"
                disabled={!ideas.length}
                onClick={() => onNavigate(4)}
              >
                <div className="overview-workflow-number">
                  04
                </div>

                <div>
                  <strong>
                    Video studio
                  </strong>

                  <span>
                    Turn a concept into a Reel
                  </span>
                </div>

                <ArrowUpRight size={17} />
              </button>

            </div>

          ) : (

            <div className="overview-empty-state">

              <div className="overview-empty-icon">
                <BriefcaseBusiness size={22} />
              </div>

              <div>
                <strong>
                  Your workspace is empty
                </strong>

                <p>
                  Tell BrandPulse about your brand to unlock
                  live trends, AI concepts and video creation.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigate(1)}
              >
                Set up brand
                <ArrowUpRight size={15} />
              </button>

            </div>

          )}

        </section>

        {/* AI INSIGHT */}

        <section className="overview-insight-card">

          <div className="overview-insight-orb">
            <Sparkles size={20} />
          </div>

          <span className="overview-card-eyebrow">
            AI INSIGHT
          </span>

          <h2>
            Your creative intelligence layer.
          </h2>

          <p>
            BrandPulse connects live market signals with
            your brand context to help you discover content
            opportunities before you create.
          </p>

          <div className="overview-insight-points">

            <div>
              <span>01</span>
              <p>Discover audience signals</p>
            </div>

            <div>
              <span>02</span>
              <p>Generate relevant concepts</p>
            </div>

            <div>
              <span>03</span>
              <p>Turn concepts into Reels</p>
            </div>

          </div>

        </section>

      </div>

      {/* QUICK ACTIONS */}

      <section className="overview-actions-section">

        <div className="overview-section-heading">

          <div>
            <span className="overview-card-eyebrow">
              QUICK ACTIONS
            </span>

            <h2>
              What do you want to do?
            </h2>
          </div>

        </div>

        <div className="overview-action-grid">

          <button
            type="button"
            onClick={() => onNavigate(1)}
          >
            <BriefcaseBusiness size={18} />

            <div>
              <strong>
                Manage brand
              </strong>

              <span>
                Update your brand context
              </span>
            </div>

            <ArrowUpRight size={16} />
          </button>

          <button
            type="button"
            disabled={!brand}
            onClick={() => onNavigate(2)}
          >
            <TrendingUp size={18} />

            <div>
              <strong>
                Explore trends
              </strong>

              <span>
                See live market signals
              </span>
            </div>

            <ArrowUpRight size={16} />
          </button>

          <button
            type="button"
            disabled={!brand}
            onClick={() => onNavigate(3)}
          >
            <Lightbulb size={18} />

            <div>
              <strong>
                Generate ideas
              </strong>

              <span>
                Turn signals into concepts
              </span>
            </div>

            <ArrowUpRight size={16} />
          </button>

          <button
            type="button"
            disabled={!ideas.length}
            onClick={() => onNavigate(4)}
          >
            <Clapperboard size={18} />

            <div>
              <strong>
                Open studio
              </strong>

              <span>
                Build your next Reel
              </span>
            </div>

            <ArrowUpRight size={16} />
          </button>

        </div>

      </section>

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
      className={`dashboard-toast ${type === 'error'
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

  // 0 = Overview
  // 1 = Brand
  // 2 = Trends
  // 3 = Ideas
  // 4 = Video

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

      setStep(2)

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

      setStep(3)

      showToast(
        'Creative concepts generated'
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

      setStep(4)

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

    // Overview
    if (target === 0) {
      setStep(0)
      return
    }

    // Brand
    if (target === 1) {
      setStep(1)
      return
    }

    // Trends
    if (target === 2 && brand) {
      setStep(2)
      return
    }

    // Ideas
    if (target === 3 && ideas.length > 0) {
      setStep(3)
      return
    }

    // Video
    if (target === 4 && selectedIdea) {
      setStep(4)
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
    // OVERVIEW
    // --------------------------------------------------------

    if (step === 0) {

      return (
        <Overview
          brand={brand}
          trends={trends}
          ideas={ideas}
          onNavigate={handleNavigate}
        />
      )
    }

    // --------------------------------------------------------
    // BRAND
    // --------------------------------------------------------

    if (step === 1) {

      return (
        <BrandSetup
          brand={brand}
          onComplete={handleBrandComplete}
        />
      )
    }

    // --------------------------------------------------------
    // TRENDS
    // --------------------------------------------------------

    if (step === 2 && brand) {

      return (
        <>
          <PageHeader
            number="02"
            eyebrow="LIVE MARKET INTELLIGENCE"
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

    if (step === 3) {

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
            description="Creative directions generated from the market signals your audience is already responding to."
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

    if (step === 4) {

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
            description="Build, shoot and edit your Reel using the creative framework generated by BrandPulse."
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