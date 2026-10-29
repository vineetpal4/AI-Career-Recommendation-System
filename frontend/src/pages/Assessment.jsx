import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HiOutlineArrowRight, HiOutlineArrowLeft, HiOutlineSparkles } from 'react-icons/hi2'
import api from '../services/api'

const questions = [
  {
    id: 1,
    question: 'Which area of work excites you the most?',
    options: ['Building software & apps', 'Analysing data & finding patterns', 'Designing user experiences', 'Managing people & projects', 'Creative writing & content'],
    field: 'interest',
  },
  {
    id: 2,
    question: 'What is your current education level?',
    options: ["Still in school / 12th grade", 'Pursuing a degree (B.Tech, BCA, etc.)', 'Graduate (B.Tech, BCA, B.Sc.)', 'Post-graduate (MBA, M.Tech)', 'Self-taught / bootcamp'],
    field: 'education',
  },
  {
    id: 3,
    question: 'Which technical skills do you already have?',
    type: 'multi',
    options: ['Python', 'JavaScript', 'Java', 'C/C++', 'SQL', 'HTML/CSS', 'Data Analysis', 'Machine Learning', 'None yet'],
    field: 'skills',
  },
  {
    id: 4,
    question: 'What type of work environment do you prefer?',
    options: ['🏠 Remote work', '🏢 In-office', '🔀 Hybrid', '🌍 Travel-friendly'],
    field: 'workStyle',
  },
  {
    id: 5,
    question: 'What is your experience level?',
    options: ['Complete beginner', '< 1 year of learning', '1–2 years experience', '3+ years experience'],
    field: 'experience',
  },
  {
    id: 6,
    question: 'What is your primary career goal?',
    options: ['Get a job ASAP', 'Build skills first, then find work', 'Start a startup / freelance', 'Switch career fields', 'Advance in current field'],
    field: 'goal',
  },
  {
    id: 7,
    question: 'How many hours per week can you dedicate to learning?',
    options: ['< 5 hours', '5–10 hours', '10–20 hours', '20+ hours'],
    field: 'hoursPerWeek',
  },
  {
    id: 8,
    question: 'Which sector appeals to you most?',
    options: ['Technology / IT', 'Finance & Fintech', 'Healthcare & Biotech', 'E-commerce / Retail', 'Education & EdTech', 'Creative & Media'],
    field: 'sector',
  },
  {
    id: 9,
    question: 'What type of problems do you enjoy solving?',
    options: ['Technical / engineering problems', 'Business / strategy problems', 'Creative / design problems', 'Human / social problems', 'Data / analytical problems'],
    field: 'problemType',
  },
  {
    id: 10,
    question: 'Where would you like to work?',
    options: ['Major metro city (Mumbai, Bangalore, Delhi)', 'Tier-2 city (Pune, Hyderabad)', 'My home city / state', 'Fully remote anywhere', 'Open to relocation'],
    field: 'location',
  },
]

export default function Assessment() {
  const navigate = useNavigate()
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const question = questions[currentQ]
  const progress = ((currentQ) / questions.length) * 100

  const selectOption = (option) => {
    if (question.type === 'multi') {
      const current = answers[question.field] || []
      if (option === 'None yet') {
        setAnswers(a => ({ ...a, [question.field]: ['None yet'] }))
        return
      }
      if (current.includes(option)) {
        setAnswers(a => ({ ...a, [question.field]: current.filter(o => o !== option && o !== 'None yet') }))
      } else {
        setAnswers(a => ({ ...a, [question.field]: [...current.filter(o => o !== 'None yet'), option] }))
      }
    } else {
      setAnswers(a => ({ ...a, [question.field]: option }))
    }
  }

  const isSelected = (option) => {
    const val = answers[question.field]
    if (question.type === 'multi') return Array.isArray(val) && val.includes(option)
    return val === option
  }

  const canProceed = () => {
    const val = answers[question.field]
    if (!val) return false
    if (question.type === 'multi') return Array.isArray(val) && val.length > 0
    return Boolean(val)
  }

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(c => c + 1)
    } else {
      handleSubmit()
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setError('')
    try {
      const res = await api.post('/assessment/submit', { answers })
      navigate('/career-match', { state: { results: res.data } })
    } catch (err) {
      setError('Failed to process your assessment. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-100 text-primary-700 text-sm font-medium mb-4">
            <HiOutlineSparkles className="w-4 h-4" />
            AI Career Assessment
          </div>
          <h1 className="font-display text-2xl font-bold text-text">Tell us about yourself</h1>
          <p className="text-text-muted text-sm mt-1">
            Question {currentQ + 1} of {questions.length}
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="progress-bar">
            <div className="progress-fill transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Question card */}
        <div className="card p-8 mb-6">
          <h2 className="font-display text-xl font-bold text-text mb-6">{question.question}</h2>
          {question.type === 'multi' && (
            <p className="text-xs text-text-muted mb-4 -mt-2">Select all that apply</p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {question.options.map(option => (
              <button
                key={option}
                onClick={() => selectOption(option)}
                className={`p-4 rounded-xl border-2 text-left text-sm font-medium transition-all duration-200 ${
                  isSelected(option)
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-primary-100 text-text-muted hover:border-primary-300 hover:bg-primary-50'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => setCurrentQ(c => c - 1)}
            disabled={currentQ === 0}
            className="btn-secondary disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <HiOutlineArrowLeft className="w-4 h-4" />
            Back
          </button>
          <span className="text-sm text-text-muted">{currentQ + 1} / {questions.length}</span>
          <button
            onClick={handleNext}
            disabled={!canProceed() || submitting}
            className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : currentQ === questions.length - 1 ? (
              <>
                <HiOutlineSparkles className="w-4 h-4" />
                Get My Results
              </>
            ) : (
              <>
                Next
                <HiOutlineArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
