import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../components/Logo'
import { HiOutlineEnvelope, HiOutlineArrowLeft, HiOutlineCheckCircle } from 'react-icons/hi2'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    // Simulate API call
    await new Promise(r => setTimeout(r, 1000))
    setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-mesh p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo size="lg" linkTo="/" />
        </div>

        <div className="card p-8">
          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiOutlineCheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="font-display text-2xl font-bold text-text mb-3">Check Your Email</h2>
              <p className="text-text-muted mb-6">
                If an account with <strong>{email}</strong> exists, you'll receive a password reset link shortly.
              </p>
              <Link to="/login" className="btn-primary w-full justify-center">
                Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              <h1 className="font-display text-2xl font-bold text-text mb-2">Forgot Password?</h1>
              <p className="text-text-muted text-sm mb-6">
                Enter your email address and we'll send you a link to reset your password.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">Email Address</label>
                  <div className="relative">
                    <HiOutlineEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="input pl-11"
                      placeholder="you@email.com"
                      required
                    />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
              <Link to="/login" className="flex items-center gap-2 text-sm text-text-muted hover:text-primary-600 mt-4 justify-center transition-colors">
                <HiOutlineArrowLeft className="w-4 h-4" />
                Back to Sign In
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
