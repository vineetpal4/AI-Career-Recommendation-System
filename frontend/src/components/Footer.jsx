import React from 'react'
import { Link } from 'react-router-dom'
import Logo from './Logo'
import {
  HiOutlineEnvelope,
  HiOutlineMapPin,
  HiOutlineSparkles,
} from 'react-icons/hi2'
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa'

const footerLinks = {
  Platform: [
    { label: 'Career Assessment', to: '/assessment' },
    { label: 'Explore Careers', to: '/explore-careers' },
    { label: 'Skill Gap Analysis', to: '/skill-gap' },
    { label: 'Learning Roadmap', to: '/roadmap' },
  ],
  Tools: [
    { label: 'Jobs & Internships', to: '/jobs' },
    { label: 'Resume Studio', to: '/resume-studio' },
    { label: 'Interview Prep', to: '/interview-prep' },
    { label: 'AI Career Assistant', to: '/career-assistant' },
  ],
  Account: [
    { label: 'Dashboard', to: '/dashboard' },
    { label: 'My Profile', to: '/profile' },
    { label: 'Sign Up', to: '/signup' },
    { label: 'Login', to: '/login' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-[#1A1630] text-white pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Logo size="md" linkTo="/" showText />
            <p className="mt-4 text-gray-400 text-sm leading-relaxed max-w-xs">
              CareerAI helps students, freshers, and job switchers discover their ideal career paths
              with AI-powered guidance, skill analysis, and personalised learning roadmaps.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a
                href="#"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-primary-600 flex items-center justify-center transition-all duration-200"
                aria-label="GitHub"
              >
                <FaGithub className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-primary-600 flex items-center justify-center transition-all duration-200"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-primary-600 flex items-center justify-center transition-all duration-200"
                aria-label="Twitter"
              >
                <FaTwitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-sm font-semibold text-white mb-4 tracking-wide">{section}</h3>
              <ul className="space-y-3">
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-sm text-gray-400 hover:text-primary-400 transition-colors duration-200"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <HiOutlineSparkles className="w-4 h-4 text-primary-400" />
            <span>Built for college students · A CareerAI Project</span>
          </div>
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} CareerAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
