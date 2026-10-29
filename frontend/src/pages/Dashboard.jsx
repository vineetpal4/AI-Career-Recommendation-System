import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import api from '../services/api'
import {
  HiOutlineSparkles, HiOutlineBriefcase, HiOutlineAcademicCap,
  HiOutlineChartBar, HiOutlineDocumentText, HiOutlineChatBubbleLeftRight,
  HiOutlineTrophy, HiOutlineArrowRight, HiOutlineCheckCircle,
  HiOutlineRocketLaunch, HiOutlineStar, HiOutlineBell,
} from 'react-icons/hi2'

function DashCard({ title, value, sub, icon: Icon, color, to }) {
  return (
    <Link to={to} className="card group cursor-pointer hover:border-primary-200">
      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-xs text-text-muted mb-1">{title}</p>
      <p className="font-display text-2xl font-bold text-text">{value}</p>
      <p className="text-xs text-text-muted mt-1">{sub}</p>
    </Link>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    topMatch: null,
    skillsCount: 0,
    hasAssessment: false,
    hasProfile: false,
    savedJobsCount: 0,
  })

  useEffect(() => {
    // Load assessment results
    api.get('/assessment/results')
      .then(res => {
        if (res.data?.has_assessment && res.data.careers?.length > 0) {
          const top = res.data.careers[0]
          setStats(s => ({
            ...s,
            topMatch: top,
            hasAssessment: true,
          }))
        }
      })
      .catch(() => {})

    // Load user profile
    api.get('/user/profile')
      .then(res => {
        const skills = res.data?.skills || []
        const hasProf = Boolean(res.data?.education || res.data?.skills?.length)
        setStats(s => ({
          ...s,
          skillsCount: skills.length,
          hasProfile: hasProf,
        }))
      })
      .catch(() => {})

    // Load saved jobs
    api.get('/jobs/saved')
      .then(res => {
        if (Array.isArray(res.data)) {
          setStats(s => ({ ...s, savedJobsCount: res.data.length }))
        }
      })
      .catch(() => {})

    // Load persisted roadmap progress
    api.get('/roadmap/progress')
      .then(res => {
        if (res.data?.overall) {
          setStats(s => ({
            ...s,
            roadmapPct: res.data.overall.percentage,
            roadmapDone: res.data.overall.total_completed,
          }))
        }
      })
      .catch(() => {})
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">👋</span>
            <h1 className="font-display text-3xl font-bold text-text">
              Welcome back, {user?.name?.split(' ')[0] || 'there'}!
            </h1>
          </div>
          <p className="text-text-muted">Here's your career journey at a glance.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/assessment" className="btn-primary">
            <HiOutlineSparkles className="w-4 h-4" />
            {stats.hasAssessment ? 'Retake Assessment' : 'Take Assessment'}
          </Link>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <DashCard
          title="Career Match"
          value={stats.topMatch ? `${stats.topMatch.match_score}%` : '—'}
          sub={stats.topMatch ? stats.topMatch.career_title : 'Take assessment to see'}
          icon={HiOutlineStar}
          color="bg-primary-50 text-primary-600"
          to={stats.hasAssessment ? '/career-match' : '/assessment'}
        />
        <DashCard
          title="Skills Tracked"
          value={stats.skillsCount > 0 ? `${stats.skillsCount}` : '0'}
          sub={stats.skillsCount > 0 ? 'Skills configured' : 'Add skills in profile'}
          icon={HiOutlineChartBar}
          color="bg-peach-50 text-orange-500"
          to="/profile"
        />
        <DashCard
          title="Roadmap"
          value={stats.roadmapDone > 0 ? `${stats.roadmapPct}%` : '0%'}
          sub={stats.roadmapDone > 0 ? `${stats.roadmapDone} tasks completed` : 'Start your roadmap'}
          icon={HiOutlineAcademicCap}
          color="bg-lavender-100 text-primary-700"
          to="/roadmap"
        />
        <DashCard
          title="Applications"
          value={`${stats.savedJobsCount}`}
          sub="Saved & applied jobs"
          icon={HiOutlineBriefcase}
          color="bg-green-50 text-green-600"
          to="/jobs"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {[
          {
            icon: HiOutlineSparkles,
            title: 'Career Assessment',
            desc: 'Discover your best-fit career paths with our AI-powered assessment.',
            to: '/assessment',
            cta: 'Start Assessment',
            color: 'from-primary-500 to-primary-700',
          },
          {
            icon: HiOutlineDocumentText,
            title: 'Resume Studio',
            desc: 'Build a professional resume with multiple templates and download as PDF.',
            to: '/resume-studio',
            cta: 'Build Resume',
            color: 'from-peach-300 to-peach-500',
          },
          {
            icon: HiOutlineChatBubbleLeftRight,
            title: 'AI Career Assistant',
            desc: 'Ask your AI mentor anything about careers, skills, and interviews.',
            to: '/career-assistant',
            cta: 'Chat Now',
            color: 'from-primary-400 to-primary-600',
          },
        ].map(({ icon: Icon, title, desc, to, cta, color }) => (
          <div key={title} className="card group">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-glow`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-display font-bold text-text mb-2">{title}</h3>
            <p className="text-sm text-text-muted mb-4 leading-relaxed">{desc}</p>
            <Link to={to} className="btn-primary text-sm py-2.5 w-full justify-center">
              {cta}
              <HiOutlineArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </div>

      {/* Getting Started Checklist */}
      <div className="card mb-10">
        <div className="flex items-center gap-3 mb-6">
          <HiOutlineRocketLaunch className="w-6 h-6 text-primary-500" />
          <h2 className="font-display text-xl font-bold text-text">Getting Started Checklist</h2>
        </div>
        <div className="space-y-3">
          {[
            { label: 'Create your account', done: true, to: null },
            { label: 'Complete your profile', done: stats.hasProfile, to: '/profile' },
            { label: 'Take the career assessment', done: stats.hasAssessment, to: '/assessment' },
            { label: 'Review career recommendations', done: stats.hasAssessment, to: '/career-match' },
            { label: 'Start your learning roadmap', done: (stats.roadmapDone || 0) > 0, to: '/roadmap' },
            { label: 'Build your resume', done: false, to: '/resume-studio' },
          ].map(({ label, done, to }) => (
            <div key={label} className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${done ? 'bg-green-50' : 'hover:bg-primary-50'}`}>
              <HiOutlineCheckCircle className={`w-5 h-5 flex-shrink-0 ${done ? 'text-green-500 fill-green-100' : 'text-primary-200'}`} />
              <span className={`text-sm flex-1 ${done ? 'line-through text-text-light' : 'text-text-muted'}`}>{label}</span>
              {!done && to && (
                <Link to={to} className="text-xs text-primary-600 font-medium hover:underline">
                  Do it →
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Explore section links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Skill Gap', to: '/skill-gap', icon: HiOutlineChartBar },
          { label: 'Jobs', to: '/jobs', icon: HiOutlineBriefcase },
          { label: 'Interview Prep', to: '/interview-prep', icon: HiOutlineTrophy },
          { label: 'Explore Careers', to: '/explore-careers', icon: HiOutlineAcademicCap },
        ].map(({ label, to, icon: Icon }) => (
          <Link
            key={label}
            to={to}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-primary-100 bg-white hover:bg-primary-50 hover:border-primary-300 transition-all duration-200 text-center group"
          >
            <Icon className="w-6 h-6 text-primary-500 group-hover:scale-110 transition-transform duration-200" />
            <span className="text-sm font-medium text-text-muted group-hover:text-primary-600">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
