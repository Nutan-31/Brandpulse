import { useState } from 'react'
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
} from 'lucide-react'


// ============================================================
// STEPS
// ============================================================

const STEPS = [
  { number: '01', label: 'Brand' },
  { number: '02', label: 'Signals' },
  { number: '03', label: 'Concepts' },
  { number: '04', label: 'Studio' },
]


// ============================================================
// BRANDPULSE LOGO
// ============================================================

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


// ============================================================
// TOP NAVIGATION / STEP BAR
// ============================================================

function StepBar({ current }) {

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
                    } ${done ? 'done' : ''
                    }`}
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


        <div className="hidden md:flex items-center gap-2 ml-auto">

          <span className="live-dot" />

          <span className="font-mono text-[10px] text-muted tracking-wider">
            AI WORKSPACE
          </span>

        </div>

      </div>

    </header>
  )
}


// ============================================================
// PAGE INTRO
// ============================================================

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


// ============================================================
// TOAST
// ============================================================

function Toast({ msg, type }) {

  if (!msg) return null


  return (

    <div
      className="toast"
      style={{
        borderColor:
          type === 'error'
            ? 'rgba(240,100,100,0.35)'
            : 'rgba(99,230,190,0.25)',
      }}
    >

      <div
        className="flex items-center justify-center w-7 h-7 rounded-full"
        style={{
          background:
            type === 'error'
              ? 'rgba(240,100,100,0.12)'
              : 'rgba(99,230,190,0.12)',

          color:
            type === 'error'
              ? 'var(--danger)'
              : 'var(--accent)',
        }}
      >

        {type === 'error' ? (

          <Circle size={13} />

        ) : (

          <Check size={14} />

        )}

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

    <div
      className="loading-overlay"
    >

      <div className="generation-orbit">

        <div className="generation-orbit-ring ring-one" />

        <div className="generation-orbit-ring ring-two" />

        <div className="generation-core">

          <Sparkles size={25} />

        </div>

      </div>


      <div className="loading-message">

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

    setLoadingTrends(true)


    try {

      await api.saveBrand(config)


      showToast(
        'Brand saved. Fetching live Instagram signals...'
      )


      const t =
        await api.getTrends(config)


      setTrends(t)

      setStep(1)

    }

    catch (e) {

      showToast(
        e.message ||
        'Failed to fetch trends',
        'error'
      )

    }

    finally {

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

    }

    catch (e) {

      showToast(
        e.message ||
        'Idea generation failed',
        'error'
      )

    }

    finally {

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

    }

    catch (e) {

      showToast(
        e.message ||
        'Failed to regenerate ideas',
        'error'
      )

    }

    finally {

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
        'Video generation started on Veo 3'
      )

    }

    catch (e) {

      showToast(
        e.message ||
        'Failed to start video',
        'error'
      )

    }

    finally {

      setLoadingVideo(false)

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
  // UI
  // ==========================================================

  return (

    <div className="brandpulse-app">


      {/* ====================================================
          NAVIGATION
      ==================================================== */}

      {step > 0 && (

        <StepBar
          current={step}
        />

      )}


      {/* ====================================================
          MAIN
      ==================================================== */}

      <main>


        {/* ================================================
            STEP 1 — BRAND SETUP
        ================================================= */}

        {step === 0 && (

          <BrandSetup
            onComplete={
              handleBrandComplete
            }
          />

        )}


        {/* ================================================
            STEP 2 — TREND ANALYSIS
        ================================================= */}

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

        )}


        {/* ================================================
            STEP 3 — CONTENT IDEAS
        ================================================= */}

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

              description={
                'Three AI-generated Reel concepts built from the live signals your audience is already responding to.'
              }
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

        )}


        {/* ================================================
            STEP 4 — VIDEO STUDIO
        ================================================= */}

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

              description={
                'Your selected concept is being transformed into a production-ready vertical video.'
              }
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

        )}

      </main>


      {/* ====================================================
          LOADING
      ==================================================== */}

      {loadingTrends && (
        <LoadingOverlay />
      )}


      {/* ====================================================
          TOAST
      ==================================================== */}

      {toast && (

        <Toast
          msg={toast.msg}
          type={toast.type}
        />

      )}

    </div>

  )
}