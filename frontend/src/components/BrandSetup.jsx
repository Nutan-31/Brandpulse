import { useState } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BriefcaseBusiness,
  Check,
  Hash,
  Pencil,
  Plus,
  Sparkles,
  Target,
  Users,
  X,
  Zap,
} from 'lucide-react'

const TONES = [
  'Bold & Edgy',
  'Luxury & Refined',
  'Playful & Fun',
  'Educational',
  'Sustainable & Conscious',
  'Empowering',
  'Minimalist & Clean',
  'Youthful & Gen-Z',
]

const INDUSTRIES = [
  'Beauty & Skincare',
  'Fashion & Apparel',
  'Food & Beverage',
  'Fitness & Wellness',
  'Tech & Gadgets',
  'Home & Lifestyle',
  'Travel & Hospitality',
  'Education',
  'Other',
]

const INDUSTRY_PRESETS = {
  'Beauty & Skincare': {
    hashtags: ['#CleanBeauty', '#SkincareRoutine', '#NaturalGlow'],
    competitors: ['Mamaearth', 'Plum'],
  },
  'Fashion & Apparel': {
    hashtags: ['#OOTD', '#StreetStyle', '#FashionReels'],
    competitors: ['H&M', 'Zara'],
  },
  'Food & Beverage': {
    hashtags: ['#Foodie', '#FoodReels', '#FoodLovers'],
    competitors: ['Swiggy', 'Zomato'],
  },
  'Fitness & Wellness': {
    hashtags: ['#FitnessMotivation', '#Workout', '#Wellness'],
    competitors: ['Cult.fit', 'HealthifyMe'],
  },
  'Tech & Gadgets': {
    hashtags: ['#TechTok', '#TechNews', '#Gadgets'],
    competitors: ['Nothing', 'OnePlus'],
  },
  'Home & Lifestyle': {
    hashtags: ['#HomeDecor', '#InteriorDesign', '#HomeInspo'],
    competitors: ['IKEA', 'Home Centre'],
  },
  'Travel & Hospitality': {
    hashtags: ['#TravelReels', '#TravelIndia', '#Wanderlust'],
    competitors: ['MakeMyTrip', 'Airbnb'],
  },
  Education: {
    hashtags: ['#StudyTips', '#StudentLife', '#Education'],
    competitors: ['Unacademy', 'Physics Wallah'],
  },
}

function MetricCard({
  icon,
  label,
  value,
  description,
  tone,
}) {
  return (
    <div className={`brand-overview-metric brand-overview-${tone}`}>

      <div className="brand-overview-metric-top">
        <div className="brand-overview-metric-icon">
          {icon}
        </div>

        <ArrowUpRight size={14} />
      </div>

      <div className="brand-overview-metric-value">
        {value}
      </div>

      <div className="brand-overview-metric-label">
        {label}
      </div>

      <div className="brand-overview-metric-description">
        {description}
      </div>

    </div>
  )
}

function DashboardCard({
  eyebrow,
  title,
  icon,
  children,
}) {
  return (
    <section className="brand-overview-card">

      <div className="brand-overview-card-header">

        <div>
          <span>{eyebrow}</span>
          <h2>{title}</h2>
        </div>

        {icon}

      </div>

      <div className="brand-overview-card-body">
        {children}
      </div>

    </section>
  )
}

function Tags({
  items,
  type = 'normal',
}) {
  return (
    <div className={`brand-overview-tags ${type}`}>

      {items.map((item) => (
        <span key={item}>
          {item}
        </span>
      ))}

    </div>
  )
}

function EditField({
  label,
  children,
}) {
  return (
    <div className="brand-edit-field">

      <label>
        {label}
      </label>

      {children}

    </div>
  )
}

function EditModal({
  form,
  setForm,
  error,
  setError,
  onClose,
  onComplete,
}) {

  const [tagValue, setTagValue] = useState('')
  const [competitorValue, setCompetitorValue] =
    useState('')

  function update(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }))

    setError('')
  }

  function changeIndustry(industry) {

    const preset =
      INDUSTRY_PRESETS[industry]

    setForm((prev) => ({
      ...prev,
      industry,

      ...(preset
        ? {
          hashtags: preset.hashtags,
          competitors: preset.competitors,
        }
        : {}),
    }))
  }

  function addHashtag() {

    const value =
      tagValue.trim()

    if (!value) return

    if (!form.hashtags.includes(value)) {
      setForm((prev) => ({
        ...prev,
        hashtags: [
          ...prev.hashtags,
          value,
        ],
      }))
    }

    setTagValue('')
  }

  function addCompetitor() {

    const value =
      competitorValue.trim()

    if (!value) return

    if (!form.competitors.includes(value)) {
      setForm((prev) => ({
        ...prev,
        competitors: [
          ...prev.competitors,
          value,
        ],
      }))
    }

    setCompetitorValue('')
  }

  function submit(e) {

    e.preventDefault()

    if (!form.name.trim()) {
      setError('Give your brand a name first.')
      return
    }

    if (!form.tone) {
      setError('Choose your brand personality.')
      return
    }

    if (!form.audience.trim()) {
      setError('Tell us who you are creating for.')
      return
    }

    if (!form.hashtags.length) {
      setError('Add at least one hashtag.')
      return
    }

    onComplete(form)
    onClose()
  }

  return (
    <div className="brand-edit-backdrop">

      <div className="brand-edit-window">

        <div className="brand-edit-top">

          <div>

            <div className="brand-edit-kicker">
              <Sparkles size={11} />
              BRAND SETTINGS
            </div>

            <h2>
              Edit brand profile
            </h2>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="brand-edit-close"
          >
            <X size={16} />
          </button>

        </div>

        <form onSubmit={submit}>

          <div className="brand-edit-content">

            <div className="brand-edit-row">

              <EditField label="Brand name">

                <input
                  className="brand-edit-input"
                  value={form.name}
                  onChange={(e) =>
                    update(
                      'name',
                      e.target.value
                    )
                  }
                  placeholder="e.g. Aether Skin"
                />

              </EditField>

              <EditField label="Industry">

                <select
                  className="brand-edit-input"
                  value={form.industry}
                  onChange={(e) =>
                    changeIndustry(
                      e.target.value
                    )
                  }
                >

                  {INDUSTRIES.map(
                    (industry) => (
                      <option
                        key={industry}
                        value={industry}
                      >
                        {industry}
                      </option>
                    )
                  )}

                </select>

              </EditField>

            </div>

            <EditField label="Brand personality">

              <div className="brand-edit-options">

                {TONES.map((tone) => {

                  const active =
                    form.tone === tone

                  return (
                    <button
                      type="button"
                      key={tone}
                      className={
                        active
                          ? 'active'
                          : ''
                      }
                      onClick={() =>
                        update(
                          'tone',
                          tone
                        )
                      }
                    >

                      {tone}

                      {active && (
                        <Check size={11} />
                      )}

                    </button>
                  )
                })}

              </div>

            </EditField>

            <EditField label="Target audience">

              <textarea
                className="brand-edit-input brand-edit-textarea"
                rows={4}
                value={form.audience}
                onChange={(e) =>
                  update(
                    'audience',
                    e.target.value
                  )
                }
                placeholder="Describe your ideal customer, their interests, age group, lifestyle and problems..."
              />

            </EditField>

            <div className="brand-edit-row">

              <EditField label="Target hashtags">

                <div className="brand-edit-tags">

                  {form.hashtags.map(
                    (tag) => (
                      <span key={tag}>
                        {tag}

                        <button
                          type="button"
                          onClick={() =>
                            setForm(
                              (prev) => ({
                                ...prev,
                                hashtags:
                                  prev.hashtags.filter(
                                    (x) =>
                                      x !== tag
                                  ),
                              })
                            )
                          }
                        >
                          <X size={9} />
                        </button>
                      </span>
                    )
                  )}

                  <input
                    value={tagValue}
                    onChange={(e) =>
                      setTagValue(
                        e.target.value
                      )
                    }
                    onKeyDown={(e) => {
                      if (
                        e.key === 'Enter' ||
                        e.key === ','
                      ) {
                        e.preventDefault()
                        addHashtag()
                      }
                    }}
                    placeholder="Add hashtag"
                  />

                  <button
                    type="button"
                    onClick={addHashtag}
                    className="brand-edit-add"
                  >
                    <Plus size={12} />
                  </button>

                </div>

              </EditField>

              <EditField label="Competitors">

                <div className="brand-edit-tags">

                  {form.competitors.map(
                    (item) => (
                      <span key={item}>
                        {item}

                        <button
                          type="button"
                          onClick={() =>
                            setForm(
                              (prev) => ({
                                ...prev,
                                competitors:
                                  prev.competitors.filter(
                                    (x) =>
                                      x !== item
                                  ),
                              })
                            )
                          }
                        >
                          <X size={9} />
                        </button>
                      </span>
                    )
                  )}

                  <input
                    value={competitorValue}
                    onChange={(e) =>
                      setCompetitorValue(
                        e.target.value
                      )
                    }
                    onKeyDown={(e) => {
                      if (
                        e.key === 'Enter' ||
                        e.key === ','
                      ) {
                        e.preventDefault()
                        addCompetitor()
                      }
                    }}
                    placeholder="Add competitor"
                  />

                  <button
                    type="button"
                    onClick={addCompetitor}
                    className="brand-edit-add"
                  >
                    <Plus size={12} />
                  </button>

                </div>

              </EditField>

            </div>

            {error && (
              <div className="brand-edit-error">
                <X size={13} />
                {error}
              </div>
            )}

          </div>

          <div className="brand-edit-footer">

            <span>
              <Sparkles size={12} />
              Used by BrandPulse AI
            </span>

            <button
              type="submit"
              className="brand-edit-save"
            >
              Save changes
              <ArrowRight size={14} />
            </button>

          </div>

        </form>

      </div>

    </div>
  )
}

export default function BrandSetup({
  brand,
  onComplete,
}) {

  const [editing, setEditing] =
    useState(!brand)

  const [error, setError] =
    useState('')

  const [form, setForm] = useState({
    name: brand?.name || '',
    industry:
      brand?.industry ||
      'Beauty & Skincare',
    tone: brand?.tone || '',
    audience: brand?.audience || '',
    competitors:
      brand?.competitors ||
      ['Mamaearth', 'Plum'],
    hashtags:
      brand?.hashtags ||
      [
        '#CleanBeauty',
        '#SkincareRoutine',
        '#NaturalGlow',
      ],
  })

  function openEdit() {
    setError('')

    setForm({
      name: brand?.name || form.name,
      industry:
        brand?.industry ||
        form.industry ||
        'Beauty & Skincare',
      tone: brand?.tone || form.tone || '',
      audience:
        brand?.audience ||
        form.audience ||
        '',
      competitors:
        brand?.competitors ||
        form.competitors,
      hashtags:
        brand?.hashtags ||
        form.hashtags,
    })

    setEditing(true)
  }

  function handleComplete(updatedForm) {

    setForm(updatedForm)

    onComplete(updatedForm)
  }

  /* ========================================================
     FIRST TIME
     ======================================================== */

  if (!brand) {

    return (
      <div className="brand-overview-page">

        <div className="brand-empty-dashboard">

          <div className="brand-empty-hero">

            <div>

              <div className="brand-overview-kicker">
                <span className="live-dot" />
                BRAND WORKSPACE
              </div>

              <h1>
                Build the intelligence
                <br />
                behind your <span>brand.</span>
              </h1>

              <p>
                Give BrandPulse a little context about
                your brand. Everything else happens inside
                your workspace.
              </p>

            </div>

            <button
              type="button"
              className="brand-primary-action"
              onClick={openEdit}
            >
              <Plus size={15} />
              Configure brand
            </button>

          </div>

          <div className="brand-empty-grid">

            <div>
              <Sparkles size={18} />
              <strong>
                AI creative intelligence
              </strong>
              <span>
                Generate ideas that understand your brand.
              </span>
            </div>

            <div>
              <TrendingIcon />
              <strong>
                Live market signals
              </strong>
              <span>
                Track the content your audience responds to.
              </span>
            </div>

            <div>
              <ClapperIcon />
              <strong>
                Video-ready concepts
              </strong>
              <span>
                Turn winning ideas into production guides.
              </span>
            </div>

          </div>

        </div>

        {editing && (
          <EditModal
            form={form}
            setForm={setForm}
            error={error}
            setError={setError}
            onClose={() => setEditing(false)}
            onComplete={handleComplete}
          />
        )}

      </div>
    )
  }

  /* ========================================================
     BRAND DASHBOARD
     ======================================================== */

  return (
    <div className="brand-overview-page">

      {/* HERO */}

      <div className="brand-overview-hero">

        <div className="brand-overview-hero-left">

          <div className="brand-overview-avatar">
            {brand.name?.charAt(0)?.toUpperCase()}
          </div>

          <div>

            <div className="brand-overview-kicker">
              <span className="live-dot" />
              BRAND INTELLIGENCE
            </div>

            <h1>
              {brand.name}
            </h1>

            <p>
              {brand.industry}
              <span>·</span>
              {brand.tone}
            </p>

          </div>

        </div>

        <button
          type="button"
          className="brand-overview-edit"
          onClick={openEdit}
        >
          <Pencil size={13} />
          Edit brand
        </button>

      </div>

      {/* METRICS */}

      <div className="brand-overview-metrics">

        <MetricCard
          icon={<BriefcaseBusiness size={16} />}
          label="Industry"
          value={brand.industry}
          description="Primary market"
          tone="cyan"
        />

        <MetricCard
          icon={<Users size={16} />}
          label="Audience"
          value="Defined"
          description="Target profile available"
          tone="purple"
        />

        <MetricCard
          icon={<Sparkles size={16} />}
          label="Brand voice"
          value="Active"
          description={brand.tone}
          tone="green"
        />

        <MetricCard
          icon={<Hash size={16} />}
          label="Market signals"
          value={brand.hashtags?.length || 0}
          description="Tracked hashtags"
          tone="coral"
        />

      </div>

      {/* MAIN */}

      <div className="brand-overview-main-grid">

        <DashboardCard
          eyebrow="BRAND PROFILE"
          title="Your creative foundation"
          icon={<BriefcaseBusiness size={16} />}
        >

          <div className="brand-profile-intro">

            <div className="brand-profile-big-name">
              {brand.name}
            </div>

            <p>
              {brand.audience}
            </p>

          </div>

          <div className="brand-profile-details">

            <div>
              <span>INDUSTRY</span>
              <strong>
                {brand.industry}
              </strong>
            </div>

            <div>
              <span>PERSONALITY</span>
              <strong>
                {brand.tone}
              </strong>
            </div>

          </div>

        </DashboardCard>

        <DashboardCard
          eyebrow="AUDIENCE"
          title="Who you're creating for"
          icon={<Users size={16} />}
        >

          <div className="brand-audience-content">

            <div className="brand-audience-icon">
              <Target size={20} />
            </div>

            <p>
              {brand.audience}
            </p>

          </div>

          <div className="brand-card-bottom">

            <span>
              TARGET PROFILE
            </span>

            <strong>
              READY
            </strong>

          </div>

        </DashboardCard>

      </div>

      {/* LOWER */}

      <div className="brand-overview-main-grid">

        <DashboardCard
          eyebrow="CONTENT DIRECTION"
          title="How your brand communicates"
          icon={<Sparkles size={16} />}
        >

          <div className="brand-direction">

            <div>
              <span>01</span>
              <div>
                <strong>
                  {brand.tone}
                </strong>
                <small>
                  Primary brand personality
                </small>
              </div>
              <Check size={14} />
            </div>

            <div>
              <span>02</span>
              <div>
                <strong>
                  Audience-first
                </strong>
                <small>
                  Content built around your audience
                </small>
              </div>
              <Check size={14} />
            </div>

            <div>
              <span>03</span>
              <div>
                <strong>
                  Trend-aware
                </strong>
                <small>
                  Creative informed by live signals
                </small>
              </div>
              <Check size={14} />
            </div>

          </div>

        </DashboardCard>

        <DashboardCard
          eyebrow="MARKET SET"
          title="Hashtags & competitors"
          icon={<BarChart3 size={16} />}
        >

          <div className="brand-market-section">

            <span>
              TARGET HASHTAGS
            </span>

            <Tags
              items={
                brand.hashtags || []
              }
            />

          </div>

          <div className="brand-market-section">

            <span>
              COMPETITORS
            </span>

            <div className="brand-competitors">

              {(brand.competitors || []).map(
                (competitor) => (
                  <div key={competitor}>

                    <div className="brand-competitor-avatar">
                      {competitor
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <strong>
                      {competitor}
                    </strong>

                    <ArrowUpRight size={12} />

                  </div>
                )
              )}

            </div>

          </div>

        </DashboardCard>

      </div>

      {/* BOTTOM CTA */}

      <div className="brand-overview-ready">

        <div>

          <div className="brand-ready-icon">
            <Zap size={15} />
          </div>

          <div>

            <strong>
              Your brand intelligence is ready.
            </strong>

            <span>
              Explore live market signals to start creating.
            </span>

          </div>

        </div>

        <div className="brand-ready-status">
          <span className="live-dot" />
          AI READY
        </div>

      </div>

      {editing && (
        <EditModal
          form={form}
          setForm={setForm}
          error={error}
          setError={setError}
          onClose={() => {
            setEditing(false)
            setError('')
          }}
          onComplete={handleComplete}
        />
      )}

    </div>
  )
}

/* Small visual icons */

function TrendingIcon() {
  return <BarChart3 size={18} />
}

function ClapperIcon() {
  return <Zap size={18} />
}