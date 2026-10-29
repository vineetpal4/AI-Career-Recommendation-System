import React from 'react'
import { Link } from 'react-router-dom'
import { HiOutlineBriefcase, HiOutlineArrowRight, HiOutlineAcademicCap, HiOutlineChartBar } from 'react-icons/hi2'

const CAREERS = [
  { title: 'Software Developer', field: 'Technology', demand: 'Very High', skills: ['JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL'], description: 'Build applications, websites, and software systems. One of the most in-demand careers globally.' },
  { title: 'Data Scientist', field: 'Analytics & AI', demand: 'High', skills: ['Python', 'Statistics', 'ML', 'SQL', 'TensorFlow'], description: 'Analyse large datasets and build machine learning models to derive business insights.' },
  { title: 'UX/UI Designer', field: 'Design', demand: 'High', skills: ['Figma', 'User Research', 'Prototyping', 'CSS'], description: 'Design intuitive, beautiful user interfaces and experiences for digital products.' },
  { title: 'Product Manager', field: 'Strategy', demand: 'High', skills: ['Agile', 'Analytics', 'Communication', 'Strategy'], description: 'Lead product development by bridging business goals with user needs and engineering capabilities.' },
  { title: 'DevOps Engineer', field: 'Infrastructure', demand: 'Very High', skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux'], description: 'Automate and streamline software deployment, infrastructure, and operations.' },
  { title: 'Cybersecurity Analyst', field: 'Security', demand: 'High', skills: ['Networking', 'Ethical Hacking', 'SIEM', 'Linux'], description: 'Protect organizations from digital threats, vulnerabilities, and cyber attacks.' },
  { title: 'Machine Learning Engineer', field: 'AI/ML', demand: 'Very High', skills: ['Python', 'TensorFlow', 'PyTorch', 'Math', 'MLOps'], description: 'Build and deploy ML models that power AI features in products and services.' },
  { title: 'Full Stack Developer', field: 'Technology', demand: 'Very High', skills: ['React', 'Node.js', 'SQL', 'REST APIs', 'Git'], description: 'Build both frontend and backend components of web applications end-to-end.' },
  { title: 'Business Analyst', field: 'Business', demand: 'Medium', skills: ['Excel', 'SQL', 'Tableau', 'Requirements Analysis'], description: 'Bridge gap between business stakeholders and technical teams through data-driven analysis.' },
]

const demandColor = { 'Very High': 'bg-green-100 text-green-700', 'High': 'bg-blue-100 text-blue-700', 'Medium': 'bg-yellow-100 text-yellow-700' }

export default function ExploreCareers() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-100 text-primary-700 text-sm font-medium mb-4">
          <HiOutlineBriefcase className="w-4 h-4" />
          Explore Careers
        </div>
        <h1 className="font-display text-4xl font-bold text-text mb-3">
          Discover Your <span className="text-gradient">Career Path</span>
        </h1>
        <p className="text-text-muted text-lg max-w-2xl mx-auto">
          Browse popular career paths, understand what skills they need, and take our assessment to find your best fit.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {CAREERS.map(career => (
          <div key={career.title} className="card group flex flex-col">
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="border-l-4 border-primary-400 pl-3">
                <p className="text-xs text-text-muted">{career.field}</p>
                <h3 className="font-display font-bold text-text group-hover:text-primary-600 transition-colors">{career.title}</h3>
              </div>
              <span className={`badge text-xs ${demandColor[career.demand]}`}>
                {career.demand} Demand
              </span>
            </div>
            <p className="text-sm text-text-muted mb-4 leading-relaxed flex-1">{career.description}</p>
            <div className="mb-4">
              <p className="text-xs font-semibold text-text mb-2">Key Skills Needed</p>
              <div className="flex flex-wrap gap-1.5">
                {career.skills.map(s => <span key={s} className="badge badge-lavender text-xs">{s}</span>)}
              </div>
            </div>
            <div className="flex gap-2 mt-auto">
              <Link to="/assessment" className="btn-primary flex-1 justify-center text-sm py-2.5">
                Check My Fit
                <HiOutlineArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/roadmap" className="btn-secondary flex-1 justify-center text-sm py-2.5">
                Roadmap
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12 p-10 card-glass">
        <HiOutlineChartBar className="w-10 h-10 text-primary-500 mx-auto mb-4" />
        <h2 className="font-display text-2xl font-bold text-text mb-3">Not sure which career fits you?</h2>
        <p className="text-text-muted mb-6 max-w-md mx-auto">
          Take our 10-minute AI career assessment and get personalised recommendations based on your skills and interests.
        </p>
        <Link to="/assessment" className="btn-primary text-base px-8 py-3.5">
          <HiOutlineAcademicCap className="w-5 h-5" />
          Start Free Assessment
        </Link>
      </div>
    </div>
  )
}
