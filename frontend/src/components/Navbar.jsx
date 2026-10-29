import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Logo from './Logo'
import {
  HiOutlineHome,
  HiOutlineBriefcase,
  HiOutlineAcademicCap,
  HiOutlineMagnifyingGlass,
  HiOutlineChatBubbleLeftRight,
  HiOutlineUser,
  HiOutlineBell,
  HiOutlineChevronDown,
  HiOutlineArrowRightOnRectangle,
  HiOutlineViewColumns,
  HiOutlineDocumentText,
  HiOutlineStar,
  HiOutlineSparkles,
  HiOutlineLightBulb,
  HiOutlineInformationCircle,
  HiBars3,
  HiXMark,
} from 'react-icons/hi2'

export default function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const userMenuRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setUserMenuOpen(false)
  }, [location.pathname])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    if (path.startsWith('/#')) return false
    return location.pathname.startsWith(path)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setSearchModalOpen(false)
      navigate(`/jobs?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/assessment', label: 'Career Assessment' },
    { to: '/explore-careers', label: 'Explore Careers' },
    { to: '/roadmap', label: 'Learning Roadmap' },
    { to: '/#about', label: 'About', isHash: true },
  ]

  const userMenuLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: HiOutlineViewColumns },
    { to: '/profile', label: 'My Profile', icon: HiOutlineUser },
    { to: '/career-match', label: 'Career Match', icon: HiOutlineStar },
    { to: '/skill-gap', label: 'Skill Gap', icon: HiOutlineLightBulb },
    { to: '/resume-studio', label: 'Resume Studio', icon: HiOutlineDocumentText },
    { to: '/interview-prep', label: 'Interview Prep', icon: HiOutlineBriefcase },
    { to: '/career-assistant', label: 'AI Assistant', icon: HiOutlineChatBubbleLeftRight },
  ]

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/85 backdrop-blur-xl shadow-[0_8px_30px_rgba(112,71,235,0.06)] border-b border-primary-100/50 py-2.5'
            : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            
            {/* Left: Brand Logo */}
            <div className="flex-shrink-0">
              <Logo size="md" />
            </div>

            {/* Center: Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2 px-3 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-white/80 shadow-[0_2px_12px_rgba(112,71,235,0.04)]">
              {navLinks.map(({ to, label, isHash }) => {
                if (isHash) {
                  return (
                    <a
                      key={label}
                      href={to}
                      className="px-4 py-2 rounded-full text-sm font-medium text-text-muted hover:text-primary-600 hover:bg-white/80 transition-all duration-200"
                    >
                      {label}
                    </a>
                  )
                }
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      isActive(to)
                        ? 'text-primary-700 bg-primary-100/70 font-semibold shadow-sm'
                        : 'text-text-muted hover:text-primary-600 hover:bg-white/80'
                    }`}
                  >
                    {label}
                  </Link>
                )
              })}
            </nav>

            {/* Right: Search Icon + Auth Buttons */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* Search Trigger Icon */}
              <button
                onClick={() => setSearchModalOpen(true)}
                title="Search careers & jobs"
                className="p-2.5 rounded-full bg-white/80 hover:bg-primary-50 border border-primary-100/80 text-text-muted hover:text-primary-600 shadow-sm transition-all duration-200 hover:scale-105"
              >
                <HiOutlineMagnifyingGlass className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {user ? (
                <>
                  <Link
                    to="/assessment"
                    className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-primary-700 bg-primary-50 border border-primary-200/60 hover:bg-primary-100 transition-all duration-200"
                  >
                    <HiOutlineSparkles className="w-3.5 h-3.5" />
                    Assessment
                  </Link>

                  {/* User Profile Menu */}
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-primary-100 bg-white/90 hover:bg-primary-50 hover:border-primary-300 shadow-sm transition-all duration-200"
                    >
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 via-primary-600 to-peach-400 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className="text-sm font-medium text-text hidden sm:block max-w-[110px] truncate">
                        {user.name?.split(' ')[0]}
                      </span>
                      <HiOutlineChevronDown className={`w-3.5 h-3.5 text-text-muted transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown */}
                    {userMenuOpen && (
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-premium border border-primary-100 py-2 animate-fade-in overflow-hidden z-50">
                        <div className="px-4 py-2.5 border-b border-primary-50 bg-primary-50/40">
                          <p className="text-sm font-semibold text-text truncate">{user.name}</p>
                          <p className="text-xs text-text-muted truncate">{user.email}</p>
                        </div>
                        <div className="py-1">
                          {userMenuLinks.map(({ to, label, icon: Icon }) => (
                            <Link
                              key={to}
                              to={to}
                              className="flex items-center gap-3 px-4 py-2 text-sm text-text-muted hover:text-primary-600 hover:bg-primary-50 transition-all duration-150"
                            >
                              <Icon className="w-4 h-4 text-primary-500" />
                              {label}
                            </Link>
                          ))}
                        </div>
                        <div className="border-t border-primary-50 pt-1">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-all duration-150"
                          >
                            <HiOutlineArrowRightOnRectangle className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="hidden sm:inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-text-muted hover:text-primary-600 hover:bg-white/80 transition-all duration-200"
                  >
                    Login
                  </Link>
                  {/* Premium Gradient Get Started Button */}
                  <Link
                    to="/signup"
                    className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-primary-600 via-primary-500 to-peach-400 hover:from-primary-700 hover:via-purple-600 hover:to-peach-500 shadow-[0_4px_20px_rgba(112,71,235,0.25)] hover:shadow-[0_6px_25px_rgba(255,129,66,0.35)] transition-all duration-300 hover:scale-[1.03]"
                  >
                    <span>Get Started</span>
                  </Link>
                </>
              )}

              {/* Mobile menu toggle button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-xl text-text-muted hover:text-primary-600 hover:bg-white/80 transition-all duration-200"
              >
                {mobileOpen ? <HiXMark className="w-6 h-6" /> : <HiBars3 className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-primary-100 shadow-premium animate-slide-up">
            <div className="max-w-7xl mx-auto px-4 py-5 space-y-1">
              {navLinks.map(({ to, label, isHash }) => {
                if (isHash) {
                  return (
                    <a
                      key={label}
                      href={to}
                      onClick={() => setMobileOpen(false)}
                      className="block px-4 py-2.5 rounded-xl text-sm font-medium text-text-muted hover:text-primary-600 hover:bg-primary-50"
                    >
                      {label}
                    </a>
                  )
                }
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`block px-4 py-2.5 rounded-xl text-sm font-medium ${
                      isActive(to)
                        ? 'text-primary-700 bg-primary-50 font-semibold'
                        : 'text-text-muted hover:text-primary-600 hover:bg-primary-50'
                    }`}
                  >
                    {label}
                  </Link>
                )
              })}

              {user ? (
                <div className="border-t border-primary-100 pt-3 mt-3 space-y-1">
                  <div className="px-4 py-2">
                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">My Account</p>
                    <p className="text-sm font-bold text-text truncate">{user.name}</p>
                  </div>
                  {userMenuLinks.map(({ to, label, icon: Icon }) => (
                    <Link
                      key={to}
                      to={to}
                      className="flex items-center gap-3 px-4 py-2 rounded-xl text-sm text-text-muted hover:text-primary-600 hover:bg-primary-50"
                    >
                      <Icon className="w-4 h-4 text-primary-500" />
                      {label}
                    </Link>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 text-left"
                  >
                    <HiOutlineArrowRightOnRectangle className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="border-t border-primary-100 pt-4 mt-3 flex flex-col gap-2">
                  <Link to="/login" className="btn-secondary text-center justify-center py-2.5">Login</Link>
                  <Link to="/signup" className="btn-primary text-center justify-center py-2.5">Get Started</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Quick Search Modal */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-text/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-premium border border-primary-100 w-full max-w-lg p-6 relative">
            <button
              onClick={() => setSearchModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-text-muted hover:bg-primary-50"
            >
              <HiXMark className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
                <HiOutlineMagnifyingGlass className="w-4 h-4" />
              </div>
              <h3 className="font-display font-bold text-lg text-text">Quick Search</h3>
            </div>
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                autoFocus
                placeholder="Search careers, skills (e.g. Python, UI/UX, React)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="input mb-4"
              />
              <div className="flex justify-between items-center text-xs text-text-muted">
                <span>Press Enter to explore matching jobs & tracks</span>
                <button type="submit" className="btn-primary text-xs px-4 py-2">
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Spacer for fixed nav */}
      <div className="h-16 sm:h-20" />
    </>
  )
}
