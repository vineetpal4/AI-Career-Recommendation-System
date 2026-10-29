import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { HiOutlineUser, HiOutlinePencil, HiOutlineCheckCircle } from 'react-icons/hi2'
import api from '../services/api'

const SKILL_OPTIONS = ['Python', 'JavaScript', 'Java', 'C++', 'SQL', 'React', 'Node.js', 'Machine Learning', 'Data Analysis', 'Figma', 'AWS', 'Docker', 'Git']
const EXPERIENCE_LEVELS = ['Beginner (< 1 year)', 'Fresher (1–2 years)', 'Mid-level (2–4 years)', 'Senior (4+ years)']
const CAREER_GOALS = ['Get my first job', 'Switch career fields', 'Advance in current role', 'Start a business / freelance', 'Pursue higher education']

export default function Profile() {
  const { user, updateUser } = useAuth()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    name: user?.name || '',
    education: user?.education || '',
    college: user?.college || '',
    experience: user?.experience || '',
    career_goal: user?.career_goal || '',
    location: user?.location || '',
    skills: user?.skills || [],
    interests: user?.interests || '',
  })

  const toggleSkill = (skill) => {
    setForm(f => ({
      ...f,
      skills: f.skills.includes(skill) ? f.skills.filter(s => s !== skill) : [...f.skills, skill],
    }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.put('/user/profile', form)
      updateUser(form)
      setEditing(false)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save profile.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-bold text-text">My Profile</h1>
        {!editing && (
          <button onClick={() => setEditing(true)} className="btn-secondary text-sm">
            <HiOutlinePencil className="w-4 h-4" />
            Edit Profile
          </button>
        )}
      </div>

      {success && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm mb-6">
          <HiOutlineCheckCircle className="w-5 h-5" />
          Profile saved successfully!
        </div>
      )}

      <div className="card p-8">
        {/* Avatar */}
        <div className="flex items-center gap-5 mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-3xl font-bold shadow-glow">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-text">{user?.name}</h2>
            <p className="text-text-muted text-sm">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Basic Info */}
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-text mb-2">Full Name</label>
              <input
                className="input"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                disabled={!editing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-2">Education</label>
              <input
                className="input"
                placeholder="e.g. B.Tech Computer Science"
                value={form.education}
                onChange={e => setForm(f => ({ ...f, education: e.target.value }))}
                disabled={!editing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-2">College / Institution</label>
              <input
                className="input"
                placeholder="e.g. IIT Bombay"
                value={form.college}
                onChange={e => setForm(f => ({ ...f, college: e.target.value }))}
                disabled={!editing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-2">Preferred Location</label>
              <input
                className="input"
                placeholder="e.g. Bangalore, Remote"
                value={form.location}
                onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                disabled={!editing}
              />
            </div>
          </div>

          {/* Experience & Goal */}
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-text mb-2">Experience Level</label>
              <select
                className="input"
                value={form.experience}
                onChange={e => setForm(f => ({ ...f, experience: e.target.value }))}
                disabled={!editing}
              >
                <option value="">Select level</option>
                {EXPERIENCE_LEVELS.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-2">Career Goal</label>
              <select
                className="input"
                value={form.career_goal}
                onChange={e => setForm(f => ({ ...f, career_goal: e.target.value }))}
                disabled={!editing}
              >
                <option value="">Select goal</option>
                {CAREER_GOALS.map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
          </div>

          {/* Interests */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">Interests / Bio</label>
            <textarea
              className="input min-h-[80px] resize-none"
              placeholder="Tell us about your interests, hobbies, and what motivates you..."
              value={form.interests}
              onChange={e => setForm(f => ({ ...f, interests: e.target.value }))}
              disabled={!editing}
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-text mb-3">Technical Skills</label>
            <div className="flex flex-wrap gap-2">
              {SKILL_OPTIONS.map(skill => (
                <button
                  key={skill}
                  type="button"
                  disabled={!editing}
                  onClick={() => editing && toggleSkill(skill)}
                  className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 border ${
                    form.skills.includes(skill)
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-primary-100 text-text-muted'
                  } ${editing ? 'hover:border-primary-400 cursor-pointer' : 'cursor-default'}`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          {editing && (
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button type="button" onClick={() => setEditing(false)} className="btn-secondary">
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
