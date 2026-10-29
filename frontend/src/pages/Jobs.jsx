import React, { useState } from 'react'
import { HiOutlineBriefcase, HiOutlineMapPin, HiOutlineBookmark, HiOutlineMagnifyingGlass, HiOutlineFunnel, HiOutlineInformationCircle } from 'react-icons/hi2'

const SAMPLE_JOBS = [
  { id: 1, role: 'Frontend Developer', company: 'TechCorp Solutions', location: 'Bangalore', type: 'Full-time', exp: '0–2 years', tags: ['React', 'JavaScript', 'CSS'], description: 'Build responsive UIs for our SaaS product. Great for freshers with React knowledge.' },
  { id: 2, role: 'Data Analyst Intern', company: 'Analytics Pro', location: 'Remote', type: 'Internship', exp: 'Fresher', tags: ['Python', 'SQL', 'Excel'], description: 'Help analyse user data and generate business insights. Python and SQL required.' },
  { id: 3, role: 'Backend Engineer', company: 'StartupHub', location: 'Pune', type: 'Full-time', exp: '1–3 years', tags: ['Node.js', 'MongoDB', 'REST API'], description: 'Design and build scalable APIs. Looking for someone with Node.js experience.' },
  { id: 4, role: 'Machine Learning Engineer', company: 'AI Ventures', location: 'Hyderabad', type: 'Full-time', exp: '1–2 years', tags: ['Python', 'TensorFlow', 'ML'], description: 'Build and deploy ML models for our recommendation engine.' },
  { id: 5, role: 'UI/UX Designer', company: 'DesignStudio', location: 'Mumbai', type: 'Contract', exp: 'Fresher OK', tags: ['Figma', 'Prototyping', 'User Research'], description: 'Design beautiful, user-centred interfaces for mobile and web apps.' },
  { id: 6, role: 'DevOps Engineer', company: 'CloudTech', location: 'Remote', type: 'Full-time', exp: '2+ years', tags: ['Docker', 'Kubernetes', 'AWS'], description: 'Manage CI/CD pipelines and cloud infrastructure on AWS.' },
]

const STATUS_OPTIONS = ['Saved', 'Applied', 'Interview', 'Rejected', 'Selected']
const statusColor = { Saved: 'bg-primary-100 text-primary-700', Applied: 'bg-blue-100 text-blue-700', Interview: 'bg-yellow-100 text-yellow-700', Rejected: 'bg-red-100 text-red-700', Selected: 'bg-green-100 text-green-700' }

export default function Jobs() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState({ type: '', exp: '' })
  const [saved, setSaved] = useState({})
  const [statuses, setStatuses] = useState({})

  const filtered = SAMPLE_JOBS.filter(j => {
    const matchSearch = !search || j.role.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase()) || j.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
    const matchType = !filter.type || j.type === filter.type
    const matchExp = !filter.exp || j.exp.includes(filter.exp)
    return matchSearch && matchType && matchExp
  })

  const toggleSave = (id) => {
    setSaved(s => ({ ...s, [id]: !s[id] }))
    if (!statuses[id]) setStatuses(s => ({ ...s, [id]: 'Saved' }))
  }

  const setStatus = (id, status) => {
    setStatuses(s => ({ ...s, [id]: status }))
    setSaved(s => ({ ...s, [id]: true }))
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-100 text-primary-700 text-sm font-medium mb-4">
          <HiOutlineBriefcase className="w-4 h-4" />
          Jobs & Internships
        </div>
        <h1 className="font-display text-3xl font-bold text-text mb-2">Explore Opportunities</h1>
        <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs">
          <HiOutlineInformationCircle className="w-4 h-4 flex-shrink-0" />
          These are <strong>sample listings</strong> for demonstration purposes. They are not real live job postings.
        </div>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light" />
          <input
            className="input pl-11"
            placeholder="Search role, company, or skill..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className="input max-w-xs" value={filter.type} onChange={e => setFilter(f => ({ ...f, type: e.target.value }))}>
          <option value="">All Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Internship">Internship</option>
          <option value="Contract">Contract</option>
        </select>
        <select className="input max-w-xs" value={filter.exp} onChange={e => setFilter(f => ({ ...f, exp: e.target.value }))}>
          <option value="">All Experience</option>
          <option value="Fresher">Fresher</option>
          <option value="0–2">0–2 years</option>
          <option value="1–3">1–3 years</option>
          <option value="2+">2+ years</option>
        </select>
      </div>

      {/* Job grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(job => (
          <div key={job.id} className="card group flex flex-col">
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <h3 className="font-display font-bold text-text group-hover:text-primary-600 transition-colors">{job.role}</h3>
                <p className="text-sm text-text-muted">{job.company}</p>
              </div>
              <button
                onClick={() => toggleSave(job.id)}
                className={`p-2 rounded-xl flex-shrink-0 transition-all duration-200 ${saved[job.id] ? 'bg-primary-100 text-primary-600' : 'bg-primary-50 text-text-muted hover:text-primary-600'}`}
              >
                <HiOutlineBookmark className={`w-4 h-4 ${saved[job.id] ? 'fill-primary-400' : ''}`} />
              </button>
            </div>

            <div className="flex items-center gap-3 mb-3 text-xs text-text-muted">
              <div className="flex items-center gap-1">
                <HiOutlineMapPin className="w-3.5 h-3.5" />
                {job.location}
              </div>
              <span className="badge badge-peach text-xs">{job.type}</span>
              <span className="text-text-light">{job.exp}</span>
            </div>

            <p className="text-xs text-text-muted leading-relaxed mb-3 flex-1">{job.description}</p>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {job.tags.map(t => <span key={t} className="badge badge-lavender text-xs">{t}</span>)}
            </div>

            {/* Status tracker */}
            {saved[job.id] && (
              <div className="mb-3">
                <p className="text-xs text-text-muted mb-1.5">Application Status:</p>
                <div className="flex flex-wrap gap-1.5">
                  {STATUS_OPTIONS.map(s => (
                    <button
                      key={s}
                      onClick={() => setStatus(job.id, s)}
                      className={`text-xs px-2 py-1 rounded-lg font-medium transition-all ${statuses[job.id] === s ? statusColor[s] : 'bg-primary-50 text-text-muted hover:bg-primary-100'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => toggleSave(job.id)}
              className={`w-full text-sm py-2.5 rounded-xl font-medium transition-all duration-200 ${
                saved[job.id]
                  ? 'bg-primary-50 text-primary-600 border border-primary-200'
                  : 'btn-primary'
              }`}
            >
              {saved[job.id] ? '✓ Saved' : 'Save Job'}
            </button>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <HiOutlineBriefcase className="w-12 h-12 text-primary-200 mx-auto mb-3" />
          <p className="text-text-muted">No jobs matching your search. Try different keywords.</p>
        </div>
      )}
    </div>
  )
}
