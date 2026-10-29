import React, { useEffect, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { HiOutlineSparkles, HiOutlineBookmark, HiOutlineArrowRight, HiOutlineInformationCircle } from 'react-icons/hi2'
import api from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

// Fallback rule-based careers when backend not available
const FALLBACK_CAREERS = [
  {
    career_title: 'Software Developer',
    match_score: 88,
    field: 'Technology',
    explanation: 'Your interest in building software and technical skills align strongly with software development.',
    matching_skills: ['JavaScript', 'Python', 'Problem Solving'],
    skills_to_develop: ['System Design', 'Cloud (AWS/GCP)', 'Testing'],
    next_steps: ['Build 2–3 portfolio projects', 'Contribute to open source', 'Apply for junior roles'],
  },
  {
    career_title: 'Data Analyst',
    match_score: 79,
    field: 'Analytics',
    explanation: 'Your analytical mindset and interest in data patterns make this a strong fit.',
    matching_skills: ['SQL', 'Python', 'Excel'],
    skills_to_develop: ['Power BI / Tableau', 'Statistics', 'Machine Learning basics'],
    next_steps: ['Complete a data analysis course', 'Work on public datasets', 'Build a portfolio dashboard'],
  },
  {
    career_title: 'UX/UI Designer',
    match_score: 71,
    field: 'Design',
    explanation: 'Your interest in user experiences and creativity make UX/UI an appealing direction.',
    matching_skills: ['Figma basics', 'Creative thinking', 'User empathy'],
    skills_to_develop: ['Figma (advanced)', 'User Research', 'Prototyping'],
    next_steps: ['Take a UX fundamentals course', 'Redesign 2 existing apps as case studies', 'Build a Behance portfolio'],
  },
]

function CareerCard({ career, onSave, saved }) {
  return (
    <div className="card relative overflow-hidden">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="border-l-4 border-primary-400 pl-4">
          <p className="text-xs text-text-muted">{career.field}</p>
          <h3 className="font-display text-lg font-bold text-text">{career.career_title}</h3>
        </div>
        <button
          onClick={() => onSave(career)}
          className={`p-2 rounded-xl transition-all duration-200 flex-shrink-0 ${saved ? 'bg-primary-100 text-primary-600' : 'bg-primary-50 text-text-muted hover:text-primary-600'}`}
          title={saved ? 'Saved' : 'Save career'}
        >
          <HiOutlineBookmark className={`w-5 h-5 ${saved ? 'fill-primary-400' : ''}`} />
        </button>
      </div>

      {/* Match score */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-text-muted font-medium">Match Score</span>
            <span className="text-lg font-bold text-gradient">{career.match_score}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${career.match_score}%` }} />
          </div>
        </div>
      </div>

      <p className="text-sm text-text-muted mb-4 leading-relaxed">{career.explanation}</p>

      <div className="mb-3">
        <p className="text-xs font-semibold text-text mb-2">✅ Your Matching Skills</p>
        <div className="flex flex-wrap gap-1.5">
          {career.matching_skills.map(s => <span key={s} className="badge badge-primary text-xs">{s}</span>)}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs font-semibold text-text mb-2">🎯 Skills to Develop</p>
        <div className="flex flex-wrap gap-1.5">
          {career.skills_to_develop.map(s => <span key={s} className="badge badge-peach text-xs">{s}</span>)}
        </div>
      </div>

      <div className="mb-5">
        <p className="text-xs font-semibold text-text mb-2">🚀 Recommended Next Steps</p>
        <ul className="space-y-1">
          {career.next_steps.map((step, i) => (
            <li key={i} className="text-xs text-text-muted flex items-start gap-2">
              <span className="text-primary-400 font-bold mt-0.5">{i + 1}.</span>
              {step}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-2">
        <Link to="/roadmap" className="btn-primary flex-1 justify-center text-sm py-2.5">
          View Roadmap
          <HiOutlineArrowRight className="w-4 h-4" />
        </Link>
        <Link to="/skill-gap" className="btn-secondary flex-1 justify-center text-sm py-2.5">
          Skill Gap
        </Link>
      </div>

      <div className="flex items-start gap-1.5 mt-4 p-3 rounded-xl bg-primary-50">
        <HiOutlineInformationCircle className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-text-muted">
          Rule-based recommendation. Match scores reflect your profile data, not a scientifically validated assessment.
        </p>
      </div>
    </div>
  )
}

export default function CareerMatch() {
  const location = useLocation()
  const [careers, setCareers] = useState([])
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState([])

  useEffect(() => {
    // If results passed from assessment
    if (location.state?.results?.careers) {
      setCareers(location.state.results.careers)
      setLoading(false)
      return
    }
    // Fetch from API
    api.get('/assessment/results')
      .then(r => setCareers(r.data.careers || FALLBACK_CAREERS))
      .catch(() => setCareers(FALLBACK_CAREERS))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async (career) => {
    setSaved(s => s.includes(career.career_title) ? s.filter(c => c !== career.career_title) : [...s, career.career_title])
    try {
      await api.post('/careers/save', { career_title: career.career_title })
    } catch { /* offline */ }
  }

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" text="Loading your career matches..." /></div>

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-100 text-primary-700 text-sm font-medium mb-4">
          <HiOutlineSparkles className="w-4 h-4" />
          AI Career Match
        </div>
        <h1 className="font-display text-4xl font-bold text-text mb-3">
          Your <span className="text-gradient">Career Matches</span>
        </h1>
        <p className="text-text-muted max-w-xl mx-auto">
          Based on your assessment, here are your top career path recommendations.
          Save the ones you like and explore your personalised roadmap.
        </p>
      </div>

      {careers.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-text-muted mb-4">No assessment results found.</p>
          <Link to="/assessment" className="btn-primary">Take the Assessment</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {careers.map(career => (
            <CareerCard
              key={career.career_title}
              career={career}
              onSave={handleSave}
              saved={saved.includes(career.career_title)}
            />
          ))}
        </div>
      )}

      <div className="text-center mt-10">
        <Link to="/assessment" className="btn-secondary mr-3">Retake Assessment</Link>
        <Link to="/roadmap" className="btn-primary">Start Learning Roadmap</Link>
      </div>
    </div>
  )
}
