import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Logo from '../components/Logo'
import {
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineSparkles,
  HiOutlineExclamationCircle,
} from 'react-icons/hi2'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('Please fill in all fields.')
      return
    }
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 flex-col justify-between p-12 relative overflow-hidden">
        {/* Decorative */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-5 w-48 h-48 bg-peach-300/10 rounded-full blur-3xl" />

        <Logo size="lg" linkTo="/" showText />

        <div className="relative z-10">
          <h2 className="font-display text-4xl font-black text-white leading-tight mb-4">
            Your Career Journey
            <br />
            Starts Here.
          </h2>
          <p className="text-primary-200 text-lg leading-relaxed mb-8 max-w-md">
            Sign in to access your personalised career recommendations,
            learning roadmap, and AI career assistant.
          </p>

          {/* Feature bullets */}
          <div className="space-y-4">
            {[
              '🎯 Personalised career path recommendations',
              '📊 Skill gap analysis & tracking',
              '🗺️ Step-by-step learning roadmap',
              '💼 Job & internship opportunities',
            ].map(item => (
              <div key={item} className="flex items-center gap-3 text-primary-100 text-sm">
                <div className="w-2 h-2 rounded-full bg-peach-300 flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <p className="text-primary-400 text-sm">
          © {new Date().getFullYear()} CareerAI · Turn Your Potential Into Possibility.
        </p>
      </div>

      {/* Right panel: form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-warm">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 text-center">
            <Logo size="lg" linkTo="/" />
          </div>

          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-text mb-2">Welcome back</h1>
            <p className="text-text-muted">Sign in to continue your career journey</p>
          </div>

          {error && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm mb-6">
              <HiOutlineExclamationCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-text mb-2" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <HiOutlineEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  className="input pl-11"
                  placeholder="you@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-text" htmlFor="password">
                  Password
                </label>
                <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light" />
                <input
                  id="password"
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                  className="input pl-11 pr-11"
                  placeholder="Your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-light hover:text-text transition-colors"
                >
                  {showPass ? <HiOutlineEyeSlash className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center text-base py-3.5 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <HiOutlineSparkles className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-primary-100" />
            <span className="text-sm text-text-light">or</span>
            <div className="flex-1 h-px bg-primary-100" />
          </div>

          {/* Google login note */}
          <div className="p-4 rounded-xl bg-primary-50 border border-primary-100 text-sm text-text-muted text-center mb-6">
            <span className="font-medium text-text">Google Sign-In</span> is available after setting up OAuth credentials.
            See the README for setup instructions.
          </div>

          <p className="text-center text-sm text-text-muted">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary-600 font-semibold hover:text-primary-700">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
