import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import {
  HiOutlineSparkles,
  HiOutlineArrowRight,
  HiOutlineBriefcase,
  HiOutlineAcademicCap,
  HiOutlineChartBar,
  HiOutlineLightBulb,
  HiOutlineDocumentText,
  HiOutlineChatBubbleLeftRight,
  HiOutlineCheckCircle,
  HiOutlineRocketLaunch,
  HiOutlineShieldCheck,
  HiOutlineStar,
  HiOutlineUsers,
  HiOutlineTrophy,
  HiOutlineArrowTrendingUp,
  HiOutlineMapPin,
  HiOutlineClock,
  HiOutlineCommandLine,
  HiOutlineFolderArrowDown,
  HiOutlineCheck,
} from 'react-icons/hi2'

// ─── Floating Card Components ────────────────────────────────────────────────

function FloatingCareerCard({ title, field, match, skills, color, className }) {
  return (
    <div
      className={`backdrop-blur-xl bg-white/90 rounded-2xl p-4 shadow-[0_12px_32px_rgba(112,71,235,0.12)] border border-white/80 transition-all duration-300 hover:scale-105 select-none ${className}`}
    >
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">{field}</span>
          <h4 className="font-display font-bold text-text text-sm sm:text-base leading-snug">{title}</h4>
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${color}`}>
          {match}% Match
        </span>
      </div>
      <div className="progress-bar mb-2.5 h-1.5 bg-primary-100/60">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary-500 to-peach-400"
          style={{ width: `${match}%` }}
        />
      </div>
      <div className="flex flex-wrap gap-1">
        {skills.map(s => (
          <span key={s} className="px-2 py-0.5 rounded-md bg-primary-50/80 text-[11px] font-medium text-primary-700">
            {s}
          </span>
        ))}
      </div>
    </div>
  )
}

function FloatingIconBadge({ icon: Icon, text, className }) {
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md bg-white/90 shadow-[0_8px_24px_rgba(112,71,235,0.10)] border border-white/90 text-xs font-bold text-text select-none ${className}`}
    >
      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary-500 to-peach-400 flex items-center justify-center text-white">
        <Icon className="w-3 h-3" />
      </div>
      <span>{text}</span>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function Home() {
  const { user } = useAuth()
  const heroRef = useRef(null)

  // Gentle 3D perspective mouse tracking on desktop
  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return
    const handleMouseMove = (e) => {
      const rect = hero.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      const visualArea = hero.querySelector('.hero-3d-visual')
      if (visualArea) {
        visualArea.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`
      }
    }
    hero.addEventListener('mousemove', handleMouseMove)
    return () => hero.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="overflow-x-hidden bg-[#FFFCF8]">

      {/* ── 1. HERO SECTION ──────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-[90vh] flex flex-col justify-center pt-8 pb-16 lg:py-20 overflow-hidden"
        style={{
          background: `
            radial-gradient(circle at 85% 20%, rgba(255, 179, 138, 0.32) 0%, rgba(255, 240, 231, 0.18) 40%, transparent 70%),
            radial-gradient(circle at 75% 55%, rgba(200, 184, 255, 0.30) 0%, rgba(243, 239, 253, 0.15) 45%, transparent 70%),
            radial-gradient(circle at 15% 30%, rgba(255, 182, 193, 0.22) 0%, rgba(255, 252, 248, 0.10) 50%, transparent 70%),
            radial-gradient(circle at 50% 90%, rgba(255, 225, 207, 0.25) 0%, transparent 60%),
            #FFFCF8
          `,
        }}
      >
        {/* Subtle decorative grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage: 'radial-gradient(#7047EB 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">

            {/* ── LEFT COLUMN: Headline & CTAs ─────────────────────────────── */}
            <div className="lg:col-span-7 text-left animate-slide-up">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-primary-100 shadow-[0_4px_20px_rgba(112,71,235,0.08)] text-primary-700 text-xs sm:text-sm font-semibold mb-6">
                <span className="flex h-2 w-2 rounded-full bg-primary-500 animate-ping" />
                <HiOutlineSparkles className="w-4 h-4 text-primary-500" />
                <span>AI-Powered Career Guidance</span>
              </div>

              {/* Headline */}
              <h1 className="font-display text-4xl sm:text-6xl lg:text-[4.25rem] font-black leading-[1.08] tracking-tight text-text mb-6">
                Turn Your{' '}
                <span className="bg-gradient-to-r from-primary-600 via-purple-600 to-peach-400 bg-clip-text text-transparent">
                  Potential
                </span>{' '}
                <br className="hidden sm:inline" />
                Into{' '}
                <span className="bg-gradient-to-r from-peach-400 via-pink-500 to-primary-600 bg-clip-text text-transparent">
                  Possibility.
                </span>
              </h1>

              {/* Supporting Text */}
              <p className="text-base sm:text-lg lg:text-xl text-text-muted leading-relaxed mb-8 max-w-xl">
                Discover the right career path tailored to your authentic strengths. CareerAI analyzes your skills, provides step-by-step learning roadmaps, builds ATS resumes, and prepares you for high-impact job opportunities.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
                <Link
                  to={user ? '/assessment' : '/assessment'}
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-primary-600 via-primary-500 to-peach-400 hover:from-primary-700 hover:via-purple-600 hover:to-peach-500 shadow-[0_8px_30px_rgba(112,71,235,0.30)] hover:shadow-[0_12px_40px_rgba(255,129,66,0.40)] transition-all duration-300 hover:scale-[1.03] active:scale-95"
                >
                  <HiOutlineSparkles className="w-5 h-5 text-peach-200" />
                  <span>Start Your Assessment</span>
                </Link>

                <Link
                  to="/explore-careers"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-text bg-white/90 backdrop-blur-md border-2 border-primary-100 hover:border-primary-300 hover:bg-primary-50/50 shadow-sm transition-all duration-300 hover:scale-[1.02] active:scale-95"
                >
                  <span>Explore Career Paths</span>
                  <HiOutlineArrowRight className="w-4 h-4 text-primary-500" />
                </Link>
              </div>

              {/* Small Feature Labels */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 border-t border-primary-100/60">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-text-muted">
                  <div className="w-4 h-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                    <HiOutlineCheck className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>Personalized Insights</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-text-muted">
                  <div className="w-4 h-4 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                    <HiOutlineCheck className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>AI-Powered</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-text-muted">
                  <div className="w-4 h-4 rounded-full bg-peach-100 text-orange-600 flex items-center justify-center">
                    <HiOutlineCheck className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>100% Free</span>
                </div>
              </div>

            </div>

            {/* ── RIGHT COLUMN: Futuristic 3D AI Orb & Floating Cards ─────────── */}
            <div className="lg:col-span-5 flex justify-center relative select-none">
              <div className="hero-3d-visual relative w-[320px] h-[360px] sm:w-[460px] sm:h-[460px] transition-transform duration-300 ease-out flex items-center justify-center">
                
                {/* Ambient Soft Glow Behind Orb */}
                <div className="absolute inset-0 m-auto w-72 h-72 sm:w-80 sm:h-80 bg-gradient-to-tr from-primary-500/25 via-pink-400/20 to-peach-400/30 rounded-full blur-3xl pointer-events-none" />

                {/* Central 3D Futuristic AI Orb */}
                <div className="orb-container">
                  <div className="orb-3d flex items-center justify-center relative cursor-pointer">
                    
                    {/* Concentric Rotating Orbital Rings */}
                    <div className="orb-ring-1 pointer-events-none" />
                    <div className="orb-ring-2 pointer-events-none" />
                    
                    {/* Glass Specular Highlight */}
                    <div className="orb-specular" />

                    {/* Central Luminous Core & Hologram Spark */}
                    <div className="relative z-10 text-center flex flex-col items-center">
                      <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center shadow-lg mb-1.5 animate-pulse">
                        <HiOutlineSparkles className="w-8 h-8 text-white" />
                      </div>
                      <span className="font-display font-extrabold text-base tracking-widest uppercase text-white drop-shadow-md">
                        CareerAI
                      </span>
                      <span className="text-[10px] tracking-wider text-purple-200 font-medium">
                        NEURAL ENGINE
                      </span>
                    </div>
                  </div>
                </div>

                {/* ── Floating 3D Career Elements ── */}
                {/* Laptop Badge */}
                <div className="float-badge-1 absolute top-2 left-0 sm:left-4 z-20">
                  <FloatingIconBadge icon={HiOutlineCommandLine} text="💻 Full Stack Code" />
                </div>

                {/* Graduation Cap Badge */}
                <div className="float-badge-2 absolute top-10 right-0 sm:right-2 z-20">
                  <FloatingIconBadge icon={HiOutlineAcademicCap} text="🎓 Degree & Skills" />
                </div>

                {/* Briefcase Badge */}
                <div className="float-badge-1 absolute bottom-6 right-2 sm:right-6 z-20">
                  <FloatingIconBadge icon={HiOutlineBriefcase} text="💼 Top Roles" />
                </div>

                {/* Rocket Badge */}
                <div className="float-badge-2 absolute bottom-12 left-0 sm:left-2 z-20">
                  <FloatingIconBadge icon={HiOutlineRocketLaunch} text="🚀 Fast-Track" />
                </div>

                {/* ── Floating Recommendation Cards ── */}
                {/* 1. Software Developer Card */}
                <div className="float-card absolute -left-4 sm:-left-8 top-16 sm:top-20 z-20 w-52 sm:w-60">
                  <FloatingCareerCard
                    title="Software Developer"
                    field="Technology"
                    match={96}
                    skills={['React', 'Python', 'Cloud']}
                    color="bg-primary-100 text-primary-800"
                  />
                </div>

                {/* 2. Data Scientist Card */}
                <div className="float-card-2 absolute -right-4 sm:-right-8 top-32 sm:top-36 z-20 w-52 sm:w-60">
                  <FloatingCareerCard
                    title="Data Scientist"
                    field="Analytics & AI"
                    match={92}
                    skills={['Python', 'SQL', 'ML']}
                    color="bg-peach-100 text-orange-700"
                  />
                </div>

                {/* 3. Glass-Style Career Profile Card (Bottom Left) */}
                <div className="float-card-3 absolute -bottom-4 sm:-bottom-6 left-6 sm:left-14 z-30 w-64 sm:w-72">
                  <div className="backdrop-blur-xl bg-white/95 rounded-2xl p-4 shadow-[0_16px_40px_rgba(112,71,235,0.15)] border border-white/90">
                    <div className="flex items-center gap-3 mb-2.5">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 via-purple-600 to-peach-400 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                        AI
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-display font-bold text-text text-sm">UI/UX Designer</h4>
                          <span className="px-2 py-0.2 rounded-full bg-green-100 text-green-700 font-bold text-[10px]">
                            89%
                          </span>
                        </div>
                        <p className="text-[11px] text-text-muted">Target: Product Design</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {['Figma', 'User Research', 'Design Systems'].map(skill => (
                        <span key={skill} className="px-2 py-0.5 rounded bg-lavender-100/70 text-[10px] font-semibold text-primary-800">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 2. BOTTOM FEATURE PANEL (Below Hero) ──────────────────────────────── */}
      <section className="relative z-20 -mt-6 sm:-mt-8 mb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl backdrop-blur-xl bg-white/80 p-6 sm:p-8 lg:p-10 shadow-[0_20px_60px_rgba(112,71,235,0.08)] border border-white/90">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            
            {/* Feature 1: Know Yourself */}
            <div className="group flex flex-col justify-between p-5 rounded-2xl bg-white/60 hover:bg-white border border-primary-50 hover:border-primary-200 transition-all duration-300 hover:shadow-card hover:-translate-y-1">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <HiOutlineLightBulb className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-lg text-text mb-2">Know Yourself</h3>
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed mb-4">
                  Take our interactive assessment to uncover your natural strengths, preferred work styles, and career affinities.
                </p>
              </div>
              <Link
                to="/assessment"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 group-hover:text-primary-700 group-hover:translate-x-1 transition-all duration-200"
              >
                <span>Start Quiz</span>
                <HiOutlineArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Feature 2: Explore Career Paths */}
            <div className="group flex flex-col justify-between p-5 rounded-2xl bg-white/60 hover:bg-white border border-primary-50 hover:border-primary-200 transition-all duration-300 hover:shadow-card hover:-translate-y-1">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-peach-100 text-orange-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <HiOutlineBriefcase className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-lg text-text mb-2">Explore Career Paths</h3>
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed mb-4">
                  Browse 50+ curated high-growth roles in software, data, product, and design with real salary benchmarks.
                </p>
              </div>
              <Link
                to="/explore-careers"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 group-hover:text-orange-700 group-hover:translate-x-1 transition-all duration-200"
              >
                <span>Browse Roles</span>
                <HiOutlineArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Feature 3: Build Key Skills */}
            <div className="group flex flex-col justify-between p-5 rounded-2xl bg-white/60 hover:bg-white border border-primary-50 hover:border-primary-200 transition-all duration-300 hover:shadow-card hover:-translate-y-1">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-lavender-200/70 text-primary-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <HiOutlineAcademicCap className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-lg text-text mb-2">Build Key Skills</h3>
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed mb-4">
                  Follow structured 24-week interactive learning roadmaps with free curated tutorials and milestone checklists.
                </p>
              </div>
              <Link
                to="/roadmap"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 group-hover:text-primary-700 group-hover:translate-x-1 transition-all duration-200"
              >
                <span>View Roadmaps</span>
                <HiOutlineArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Feature 4: Track Your Progress */}
            <div className="group flex flex-col justify-between p-5 rounded-2xl bg-white/60 hover:bg-white border border-primary-50 hover:border-primary-200 transition-all duration-300 hover:shadow-card hover:-translate-y-1">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <HiOutlineArrowTrendingUp className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-lg text-text mb-2">Track Your Progress</h3>
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed mb-4">
                  Monitor your skill mastery, ATS resume health score, roadmap tasks, and job application stages all in one place.
                </p>
              </div>
              <Link
                to={user ? '/dashboard' : '/login'}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-green-600 group-hover:text-green-700 group-hover:translate-x-1 transition-all duration-200"
              >
                <span>Open Dashboard</span>
                <HiOutlineArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ── 3. ABOUT SECTION (Anchor for Navbar) ──────────────────────────────── */}
      <section id="about" className="py-16 sm:py-24 bg-white/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-peach-50 border border-peach-200 text-orange-600 text-xs font-semibold mb-4">
                <HiOutlineSparkles className="w-3.5 h-3.5" />
                About CareerAI
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-text mb-6 leading-tight">
                Empowering Students & Freshers with{' '}
                <span className="bg-gradient-to-r from-primary-600 via-primary-500 to-peach-400 bg-clip-text text-transparent">
                  Intelligent Guidance
                </span>
              </h2>
              <p className="text-base text-text-muted leading-relaxed mb-6">
                Most students and career switchers struggle with uncertainty: which field to pursue, what skills are actually in demand, and how to bridge the gap between college education and industry requirements.
              </p>
              <p className="text-base text-text-muted leading-relaxed mb-8">
                CareerAI was built to remove that guesswork. By combining transparent recommendation logic, curated 24-week roadmaps, ATS resume generation, and AI-powered mentoring, we provide every aspiring engineer and designer with a clear blueprint to success.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { title: 'Zero Cost', desc: '100% free learning resources & guidance' },
                  { title: 'Practical Focus', desc: 'Real skills aligned with current industry needs' },
                  { title: 'ATS Resumes', desc: 'Instantly generate employer-ready PDFs' },
                  { title: 'Always Available', desc: '24/7 AI mentor ready for your questions' },
                ].map(item => (
                  <div key={item.title} className="p-4 rounded-xl bg-primary-50/50 border border-primary-100/60">
                    <h4 className="font-bold text-text text-sm mb-1">{item.title}</h4>
                    <p className="text-xs text-text-muted">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative flex justify-center">
              <div className="card-glass p-8 sm:p-10 w-full max-w-lg relative z-10 shadow-premium">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-primary-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold">
                      C
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-text">CareerAI Engine</h4>
                      <p className="text-xs text-text-muted">Student Success Framework</p>
                    </div>
                  </div>
                  <span className="badge badge-primary text-xs">Active</span>
                </div>

                <div className="space-y-4">
                  {[
                    { label: 'Step 1: Discover Affinity', score: '100% Complete', color: 'bg-primary-500' },
                    { label: 'Step 2: Skill Gap Audit', score: '4 Key Areas Identified', color: 'bg-orange-400' },
                    { label: 'Step 3: Roadmap Execution', score: 'Phase 2 in progress', color: 'bg-primary-600' },
                    { label: 'Step 4: Interview Ready', score: '6 Categories Practiced', color: 'bg-green-500' },
                  ].map(step => (
                    <div key={step.label} className="p-3.5 rounded-xl bg-white border border-primary-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${step.color}`} />
                        <span className="text-sm font-semibold text-text">{step.label}</span>
                      </div>
                      <span className="text-xs text-text-muted font-medium">{step.score}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-4 border-t border-primary-50 text-center">
                  <Link to="/assessment" className="btn-primary w-full justify-center text-sm py-3">
                    Take the 5-Minute Assessment
                  </Link>
                </div>
              </div>
              <div className="absolute inset-0 -z-10 blur-3xl opacity-20 bg-gradient-to-br from-primary-400 to-peach-300 rounded-3xl scale-95" />
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. STATS BAND ────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-primary-700 via-primary-600 to-purple-800 py-12 text-white shadow-inner">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <HiOutlineBriefcase className="w-5 h-5 text-peach-300" />
                <span className="font-display text-3xl font-bold text-white">50+</span>
              </div>
              <p className="text-sm text-primary-200">Career Paths</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <HiOutlineAcademicCap className="w-5 h-5 text-peach-300" />
                <span className="font-display text-3xl font-bold text-white">200+</span>
              </div>
              <p className="text-sm text-primary-200">Curated Resources</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <HiOutlineUsers className="w-5 h-5 text-peach-300" />
                <span className="font-display text-3xl font-bold text-white">1,000+</span>
              </div>
              <p className="text-sm text-primary-200">Students Guided</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <HiOutlineStar className="w-5 h-5 text-peach-300" />
                <span className="font-display text-3xl font-bold text-white">96%</span>
              </div>
              <p className="text-sm text-primary-200">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. AI CAREER MATCHES SPOTLIGHT ───────────────────────────────────── */}
      <section className="section bg-mesh">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="badge badge-peach mb-3">Intelligent Matching Engine</span>
            <h2 className="section-title mb-3">
              Explore Your <span className="text-gradient">Career Matches</span>
            </h2>
            <p className="section-subtitle mx-auto text-center">
              CareerAI compares your affinities and skillsets against industry profiles, scoring each path with concrete next steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Software Developer',
                field: 'Technology',
                match: 96,
                skills: ['Python', 'JavaScript', 'React', 'Problem Solving'],
                missing: ['System Design', 'Cloud Deployments', 'Docker'],
                color: 'border-primary-500',
                highlight: true,
              },
              {
                title: 'Data Scientist',
                field: 'Analytics & AI',
                match: 92,
                skills: ['Python', 'SQL', 'Statistics', 'Data Wrangling'],
                missing: ['Machine Learning', 'TensorFlow', 'Tableau'],
                color: 'border-peach-400',
              },
              {
                title: 'UI/UX Designer',
                field: 'Design & Product',
                match: 89,
                skills: ['User Empathy', 'Visual Communication', 'Figma'],
                missing: ['Design Systems', 'Usability Testing', 'Prototyping'],
                color: 'border-lavender-400',
              },
            ].map((career) => (
              <div
                key={career.title}
                className={`card relative overflow-hidden flex flex-col justify-between ${
                  career.highlight ? 'ring-2 ring-primary-500 shadow-premium' : ''
                }`}
              >
                {career.highlight && (
                  <div className="absolute top-4 right-4">
                    <span className="badge bg-primary-600 text-white text-xs font-bold">Top Match</span>
                  </div>
                )}
                <div>
                  <div className={`border-l-4 ${career.color} pl-4 mb-4`}>
                    <p className="text-xs text-text-muted font-medium">{career.field}</p>
                    <h3 className="font-display font-bold text-text text-xl">{career.title}</h3>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-3xl font-black text-gradient">{career.match}%</div>
                    <div className="flex-1">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${career.match}%` }} />
                      </div>
                      <p className="text-xs text-text-muted mt-1">confidence score</p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs font-semibold text-text-muted mb-2">Matching Strengths</p>
                    <div className="flex flex-wrap gap-1.5">
                      {career.skills.map(s => (
                        <span key={s} className="badge badge-primary text-xs">{s}</span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs font-semibold text-text-muted mb-2">Skills to Develop</p>
                    <div className="flex flex-wrap gap-1.5">
                      {career.missing.map(s => (
                        <span key={s} className="badge badge-peach text-xs">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-primary-50 mt-4">
                  <Link to="/assessment" className="btn-primary w-full justify-center text-sm py-2.5">
                    View Full Track Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. FINAL CTA BANNER ──────────────────────────────────────────────── */}
      <section className="section bg-[#FFFCF8] pt-8 pb-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <div className="card-glass p-10 sm:p-14 relative overflow-hidden shadow-premium">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100/50 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-peach-100/60 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
            
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-peach-400 flex items-center justify-center text-white mx-auto mb-4 shadow-glow">
                <HiOutlineRocketLaunch className="w-8 h-8" />
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-text mb-4">
                Ready to Launch Your{' '}
                <span className="text-gradient">Dream Career?</span>
              </h2>
              <p className="text-text-muted text-base sm:text-lg mb-8 max-w-xl mx-auto">
                Join thousands of students and freshers discovering their true potential with CareerAI. Start today — 100% free.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/assessment"
                  className="btn-primary text-base px-9 py-3.5 shadow-glow hover:scale-105"
                >
                  <HiOutlineSparkles className="w-5 h-5 text-peach-200" />
                  <span>Start Career Assessment</span>
                </Link>
                <Link
                  to="/explore-careers"
                  className="btn-secondary text-base px-8 py-3.5 hover:scale-105"
                >
                  <span>Explore 50+ Roles</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
