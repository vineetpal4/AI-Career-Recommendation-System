import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { HiOutlineArrowRight, HiOutlineChartBar, HiOutlineInformationCircle } from 'react-icons/hi2'

const CAREERS = ['Software Developer', 'Data Scientist', 'UX Designer', 'Product Manager', 'DevOps Engineer']

const SKILL_DATA = {
  'Software Developer': [
    { skill: 'JavaScript / TypeScript', current: 0, required: 85, priority: 'High' },
    { skill: 'React.js', current: 0, required: 80, priority: 'High' },
    { skill: 'Node.js / Backend', current: 0, required: 75, priority: 'Medium' },
    { skill: 'SQL & Databases', current: 0, required: 70, priority: 'Medium' },
    { skill: 'Git & Version Control', current: 0, required: 80, priority: 'High' },
    { skill: 'System Design', current: 0, required: 65, priority: 'Low' },
  ],
  'Data Scientist': [
    { skill: 'Python', current: 0, required: 90, priority: 'High' },
    { skill: 'Statistics & Probability', current: 0, required: 85, priority: 'High' },
    { skill: 'Machine Learning', current: 0, required: 80, priority: 'High' },
    { skill: 'SQL & Data Analysis', current: 0, required: 75, priority: 'Medium' },
    { skill: 'Data Visualisation', current: 0, required: 70, priority: 'Medium' },
    { skill: 'Deep Learning', current: 0, required: 60, priority: 'Low' },
  ],
  'UX Designer': [
    { skill: 'Figma / Prototyping', current: 0, required: 90, priority: 'High' },
    { skill: 'User Research', current: 0, required: 80, priority: 'High' },
    { skill: 'Information Architecture', current: 0, required: 70, priority: 'Medium' },
    { skill: 'Design Systems', current: 0, required: 75, priority: 'Medium' },
    { skill: 'Usability Testing', current: 0, required: 65, priority: 'Low' },
  ],
  'Product Manager': [
    { skill: 'Product Strategy', current: 0, required: 85, priority: 'High' },
    { skill: 'Agile / Scrum', current: 0, required: 80, priority: 'High' },
    { skill: 'Data Analysis', current: 0, required: 70, priority: 'Medium' },
    { skill: 'Stakeholder Management', current: 0, required: 75, priority: 'Medium' },
    { skill: 'Technical Understanding', current: 0, required: 60, priority: 'Low' },
  ],
  'DevOps Engineer': [
    { skill: 'Linux & Shell Scripting', current: 0, required: 85, priority: 'High' },
    { skill: 'Docker & Kubernetes', current: 0, required: 80, priority: 'High' },
    { skill: 'CI/CD Pipelines', current: 0, required: 80, priority: 'High' },
    { skill: 'Cloud (AWS/GCP/Azure)', current: 0, required: 85, priority: 'High' },
    { skill: 'Monitoring & Logging', current: 0, required: 65, priority: 'Medium' },
  ],
}

const priorityColor = { High: 'text-red-500 bg-red-50', Medium: 'text-yellow-600 bg-yellow-50', Low: 'text-green-600 bg-green-50' }

export default function SkillGap() {
  const [selectedCareer, setSelectedCareer] = useState('Software Developer')
  const [currentSkills, setCurrentSkills] = useState({})

  const skills = SKILL_DATA[selectedCareer] || []

  const handleSlider = (skill, value) => {
    setCurrentSkills(s => ({ ...s, [`${selectedCareer}:${skill}`]: Number(value) }))
  }

  const getCurrentLevel = (skill) => currentSkills[`${selectedCareer}:${skill}`] ?? 0

  const overallGap = skills.length > 0
    ? Math.max(0, Math.round(skills.reduce((acc, s) => acc + (s.required - getCurrentLevel(s.skill)), 0) / skills.length))
    : 0

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-100 text-primary-700 text-sm font-medium mb-4">
          <HiOutlineChartBar className="w-4 h-4" />
          Skill Gap Analysis
        </div>
        <h1 className="font-display text-3xl font-bold text-text mb-2">
          Know Exactly What to Learn
        </h1>
        <p className="text-text-muted">
          Select your target career and rate your current skill levels. We'll show you the gaps.
        </p>
      </div>

      {/* Career selector */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CAREERS.map(c => (
          <button
            key={c}
            onClick={() => setSelectedCareer(c)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              selectedCareer === c
                ? 'bg-primary-600 text-white shadow-glow'
                : 'bg-white border border-primary-100 text-text-muted hover:border-primary-300'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="card text-center">
          <p className="text-2xl font-bold text-gradient mb-1">{skills.length}</p>
          <p className="text-xs text-text-muted">Skills Required</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-red-500 mb-1">{skills.filter(s => getCurrentLevel(s.skill) < s.required).length}</p>
          <p className="text-xs text-text-muted">Gaps Identified</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-green-500 mb-1">{overallGap}%</p>
          <p className="text-xs text-text-muted">Avg. Gap to Close</p>
        </div>
      </div>

      {/* Skill bars */}
      <div className="card p-8 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="font-display text-xl font-bold text-text">Your Skill Levels vs Required</h2>
        </div>
        <p className="text-xs text-text-muted mb-6 flex items-center gap-1.5">
          <HiOutlineInformationCircle className="w-4 h-4" />
          Drag the sliders to set your current skill level for each area.
        </p>
        <div className="space-y-7">
          {skills.map(({ skill, required, priority }) => {
            const current = getCurrentLevel(skill)
            const gap = Math.max(0, required - current)
            return (
              <div key={skill}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-text">{skill}</span>
                  <div className="flex items-center gap-2">
                    <span className={`badge text-xs ${priorityColor[priority]}`}>{priority} Priority</span>
                    <span className="text-xs text-text-muted">{current}% / {required}% needed</span>
                  </div>
                </div>
                <div className="relative h-3 bg-primary-50 rounded-full mb-2">
                  <div
                    className={`absolute top-0 left-0 h-3 rounded-full transition-all duration-300 ${
                      current >= required ? 'bg-green-400' : 'bg-gradient-to-r from-primary-400 to-primary-600'
                    }`}
                    style={{ width: `${current}%` }}
                  />
                  {/* Required marker */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-0.5 h-5 bg-peach-400 rounded-full"
                    style={{ left: `${required}%` }}
                    title={`Required: ${required}%`}
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={current}
                  onChange={e => handleSlider(skill, e.target.value)}
                  className="w-full accent-primary-600 cursor-pointer"
                />
                {gap > 0 && (
                  <p className="text-xs text-peach-500 mt-1">Gap: {gap}% to close</p>
                )}
                {gap === 0 && current > 0 && (
                  <p className="text-xs text-green-500 mt-1">✓ At or above required level!</p>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mb-8 text-xs text-text-muted">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary-500" />
          Your Current Level
        </div>
        <div className="flex items-center gap-2">
          <div className="w-0.5 h-4 bg-peach-400 rounded-full" />
          Required Level
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-400" />
          Skill Achieved
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link to="/roadmap" className="btn-primary">
          Create Learning Roadmap
          <HiOutlineArrowRight className="w-4 h-4" />
        </Link>
        <Link to="/career-assistant" className="btn-secondary">
          Ask AI for Advice
        </Link>
      </div>
    </div>
  )
}
