import React, { useState, useEffect } from 'react'
import {
  HiOutlineCheckCircle,
  HiOutlineAcademicCap,
  HiOutlineTrophy,
  HiOutlineClock,
  HiOutlineExclamationCircle,
  HiOutlineArrowPath,
} from 'react-icons/hi2'
import api from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

const ROADMAPS = {
  'Software Developer': {
    totalWeeks: 24,
    description: 'A structured 24-week plan from programming fundamentals to full stack applications and job readiness.',
    phases: [
      {
        phase: 'Phase 1: Fundamentals',
        weeks: '1–4',
        color: 'border-primary-400',
        tasks: [
          { id: 'sd-1', title: 'Java / Python Fundamentals', desc: 'Variables, data types, conditionals, loops' },
          { id: 'sd-2', title: 'OOP Principles', desc: 'Classes, objects, inheritance, polymorphism' },
          { id: 'sd-3', title: 'Collections & Generics', desc: 'ArrayList, HashMap, iterators and sets' },
          { id: 'sd-4', title: 'Exception Handling & File I/O', desc: 'Try/catch blocks and clean resource handling' },
        ],
      },
      {
        phase: 'Phase 2: Core CS Concepts',
        weeks: '5–10',
        color: 'border-peach-300',
        tasks: [
          { id: 'sd-5', title: 'Data Structures', desc: 'Arrays, linked lists, stacks, queues, trees' },
          { id: 'sd-6', title: 'Algorithms & Complexity', desc: 'Sorting, searching, Big O notation analysis' },
          { id: 'sd-7', title: 'SQL & Relational Databases', desc: 'Schema design, normalisation, queries, joins' },
          { id: 'sd-8', title: 'Git & GitHub Collaboration', desc: 'Version control, branching, PR review workflows' },
        ],
      },
      {
        phase: 'Phase 3: Web Development',
        weeks: '11–18',
        color: 'border-lavender-300',
        tasks: [
          { id: 'sd-9', title: 'HTML, CSS & JavaScript', desc: 'DOM manipulation, responsive layouts, ES6+' },
          { id: 'sd-10', title: 'React.js', desc: 'Component architecture, state, hooks, routing' },
          { id: 'sd-11', title: 'REST APIs & Backend', desc: 'Endpoints, authentication, middleware, CORS' },
          { id: 'sd-12', title: 'Full Stack Capstone Project', desc: 'Build and deploy a complete web application' },
        ],
      },
      {
        phase: 'Phase 4: Career Launch',
        weeks: '19–24',
        color: 'border-green-400',
        tasks: [
          { id: 'sd-13', title: 'Portfolio & GitHub Polish', desc: 'Clean READMEs, live demo links, architecture docs' },
          { id: 'sd-14', title: 'Resume & LinkedIn', desc: 'ATS-tailored resume and strong LinkedIn presence' },
          { id: 'sd-15', title: 'Interview Preparation', desc: 'DSA practice, mock interviews, behavioural prep' },
          { id: 'sd-16', title: 'Job Applications', desc: 'Tailor resumes, track applications, and network' },
        ],
      },
    ],
  },
  'Data Scientist': {
    totalWeeks: 20,
    description: 'Comprehensive pathway to master Python, statistical analysis, machine learning algorithms, and real-world data pipelines.',
    phases: [
      {
        phase: 'Phase 1: Foundations',
        weeks: '1–4',
        color: 'border-primary-400',
        tasks: [
          { id: 'ds-1', title: 'Python for Data Science', desc: 'NumPy, Pandas, vectorized operations' },
          { id: 'ds-2', title: 'Applied Statistics & Probability', desc: 'Distributions, hypothesis testing, p-values' },
          { id: 'ds-3', title: 'Data Cleaning & Wrangling', desc: 'Handling missing data, outliers, transformations' },
          { id: 'ds-4', title: 'Exploratory Data Analysis (EDA)', desc: 'Matplotlib, Seaborn, insight generation' },
        ],
      },
      {
        phase: 'Phase 2: Databases & SQL',
        weeks: '5–8',
        color: 'border-peach-300',
        tasks: [
          { id: 'ds-5', title: 'Advanced SQL Queries', desc: 'Window functions, CTEs, aggregations' },
          { id: 'ds-6', title: 'Database Connectivity', desc: 'Connecting Python to PostgreSQL and SQLite' },
          { id: 'ds-7', title: 'Business Intelligence Dashboards', desc: 'Tableau or Power BI dashboard creation' },
        ],
      },
      {
        phase: 'Phase 3: Machine Learning',
        weeks: '9–15',
        color: 'border-lavender-300',
        tasks: [
          { id: 'ds-8', title: 'Supervised Learning', desc: 'Regression, Classification, Decision Trees, Random Forests' },
          { id: 'ds-9', title: 'Unsupervised Learning', desc: 'K-Means clustering, PCA dimensionality reduction' },
          { id: 'ds-10', title: 'Model Evaluation & Tuning', desc: 'Cross-validation, ROC-AUC, Hyperparameter search' },
          { id: 'ds-11', title: 'Introduction to Deep Learning', desc: 'Neural network basics with PyTorch or TensorFlow' },
        ],
      },
      {
        phase: 'Phase 4: Capstones & Portfolio',
        weeks: '16–20',
        color: 'border-green-400',
        tasks: [
          { id: 'ds-12', title: 'End-to-End ML Pipeline', desc: 'Build, train, and deploy an ML API' },
          { id: 'ds-13', title: 'Kaggle Competition Participation', desc: 'Submit a notebook to an active dataset challenge' },
          { id: 'ds-14', title: 'Interview & Case Study Prep', desc: 'Data structures, SQL drills, business cases' },
        ],
      },
    ],
  },
  'UX/UI Designer': {
    totalWeeks: 16,
    description: 'Master user-centered design, user research, wireframing, design systems, and Figma prototyping.',
    phases: [
      {
        phase: 'Phase 1: Design Fundamentals',
        weeks: '1–4',
        color: 'border-primary-400',
        tasks: [
          { id: 'ux-1', title: 'Design Principles', desc: 'Hierarchy, contrast, typography, spacing, color theory' },
          { id: 'ux-2', title: 'Figma Mastery', desc: 'Auto layout, components, variants, interactive prototypes' },
          { id: 'ux-3', title: 'Design Systems', desc: 'Tokens, UI kits, accessible component libraries' },
        ],
      },
      {
        phase: 'Phase 2: UX Research & Strategy',
        weeks: '5–8',
        color: 'border-peach-300',
        tasks: [
          { id: 'ux-4', title: 'User Research & Interviews', desc: 'Conduct interviews and synthesize findings' },
          { id: 'ux-5', title: 'User Personas & Journey Maps', desc: 'Empathy mapping and identifying friction points' },
          { id: 'ux-6', title: 'Information Architecture', desc: 'Card sorting, sitemaps, user flow diagrams' },
        ],
      },
      {
        phase: 'Phase 3: Case Studies & Prototyping',
        weeks: '9–13',
        color: 'border-lavender-300',
        tasks: [
          { id: 'ux-7', title: 'Case Study 1: Mobile App Redesign', desc: 'End-to-end design from problem statement to prototype' },
          { id: 'ux-8', title: 'Case Study 2: Web Platform / SaaS', desc: 'Complex dashboard and workflow interaction design' },
          { id: 'ux-9', title: 'Usability Testing', desc: 'Run user testing sessions and iterate on feedback' },
        ],
      },
      {
        phase: 'Phase 4: Portfolio & Presentation',
        weeks: '14–16',
        color: 'border-green-400',
        tasks: [
          { id: 'ux-10', title: 'Portfolio Website', desc: 'Publish clean case studies on personal portfolio/Behance' },
          { id: 'ux-11', title: 'Design Challenge Prep', desc: 'Practice whiteboard challenges and design critiques' },
        ],
      },
    ],
  },
}

export default function Roadmap() {
  const [selectedCareer, setSelectedCareer] = useState('Software Developer')
  const currentRoadmap = ROADMAPS[selectedCareer] || ROADMAPS['Software Developer']

  // Persistent task state fetched from database
  const [taskState, setTaskState] = useState({})
  const [loading, setLoading] = useState(true)
  const [syncingTaskId, setSyncingTaskId] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  // Fetch persisted roadmap progress on mount
  useEffect(() => {
    let isMounted = true
    setLoading(true)

    api.get('/roadmap/progress')
      .then(res => {
        if (!isMounted) return
        const completedMap = {}
        
        // Initialize all known tasks to false
        Object.entries(ROADMAPS).forEach(([cName, rmap]) => {
          rmap.phases.forEach(p => p.tasks.forEach(t => {
            completedMap[`${cName}_${t.id}`] = false
          }))
        })

        // Populate persisted completed tasks
        if (res.data?.completed_by_career) {
          Object.entries(res.data.completed_by_career).forEach(([cName, taskIds]) => {
            taskIds.forEach(tId => {
              completedMap[`${cName}_${tId}`] = true
            })
          })
        }

        setTaskState(completedMap)
      })
      .catch(err => {
        if (!isMounted) return
        console.warn('Could not fetch remote roadmap progress, using local storage/fallback:', err)
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  // Toggle task completion with backend persistence & optimistic revert on error
  const toggleTask = async (task, phaseName) => {
    const key = `${selectedCareer}_${task.id}`
    const previousState = Boolean(taskState[key])
    const nextState = !previousState

    // 1. Optimistic UI update
    setTaskState(prev => ({ ...prev, [key]: nextState }))
    setSyncingTaskId(task.id)
    setErrorMessage(null)

    try {
      // 2. Persist to SQLite backend
      const res = await api.post('/roadmap/toggle', {
        career_title: selectedCareer,
        task_id: task.id,
        is_completed: nextState,
        title: task.title,
        phase: phaseName,
        description: task.desc,
      })

      // Ensure state matches server response
      if (res.data && typeof res.data.is_completed === 'boolean') {
        setTaskState(prev => ({ ...prev, [key]: res.data.is_completed }))
      }
    } catch (err) {
      console.error('Failed to persist roadmap task:', err)
      // Revert optimistic update to prevent false completion state
      setTaskState(prev => ({ ...prev, [key]: previousState }))
      setErrorMessage('Failed to save progress. Please ensure you are logged in and backend is running.')
    } finally {
      setSyncingTaskId(null)
    }
  }

  // Consistent calculations directly from persisted task records
  const allTasks = currentRoadmap.phases.flatMap(p => p.tasks)
  const totalTasks = allTasks.length
  const doneTasks = allTasks.filter(t => taskState[`${selectedCareer}_${t.id}`]).length
  const remainingTasks = Math.max(0, totalTasks - doneTasks)
  const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex justify-center">
        <LoadingSpinner size="lg" text="Loading your roadmap progress..." />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-100 text-primary-700 text-sm font-medium mb-3">
            <HiOutlineAcademicCap className="w-4 h-4" />
            Learning Roadmap
          </div>
          <h1 className="font-display text-3xl font-bold text-text mb-2">{selectedCareer} Roadmap</h1>
          <p className="text-text-muted text-sm">{currentRoadmap.description}</p>
        </div>

        {/* Career Selector */}
        <div className="sm:self-start">
          <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wide">
            Select Track
          </label>
          <select
            className="input py-2 px-4 bg-white shadow-sm font-medium text-sm"
            value={selectedCareer}
            onChange={e => setSelectedCareer(e.target.value)}
          >
            {Object.keys(ROADMAPS).map(career => (
              <option key={career} value={career}>{career}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Error alert if sync fails */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3 animate-fade-in">
          <HiOutlineExclamationCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Progress overview */}
      <div className="card p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-text-muted mb-0.5">Track Progress</p>
            <p className="font-display text-3xl font-bold text-gradient">{progress}%</p>
          </div>
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="font-bold text-text text-lg">{doneTasks}</p>
              <p className="text-xs text-text-muted">Completed</p>
            </div>
            <div>
              <p className="font-bold text-text text-lg">{remainingTasks}</p>
              <p className="text-xs text-text-muted">Remaining</p>
            </div>
            <div>
              <p className="font-bold text-text text-lg">{currentRoadmap.totalWeeks}w</p>
              <p className="text-xs text-text-muted">Duration</p>
            </div>
          </div>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Phases */}
      <div className="space-y-6">
        {currentRoadmap.phases.map((phase) => {
          const phaseTasksDone = phase.tasks.filter(t => taskState[`${selectedCareer}_${t.id}`]).length
          const phaseTotal = phase.tasks.length
          const phaseDone = phaseTasksDone === phaseTotal && phaseTotal > 0

          return (
            <div key={phase.phase} className={`card p-6 border-l-4 ${phase.color}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                      phaseDone ? 'bg-green-100 text-green-700' : 'bg-primary-100 text-primary-700'
                    }`}
                  >
                    {phaseDone ? '✓' : `${phaseTasksDone}/${phaseTotal}`}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-text">{phase.phase}</h3>
                    <div className="flex items-center gap-2 text-xs text-text-muted">
                      <HiOutlineClock className="w-3.5 h-3.5" />
                      Weeks {phase.weeks}
                    </div>
                  </div>
                </div>
                {phaseDone && (
                  <span className="badge badge-green flex items-center gap-1">
                    <HiOutlineTrophy className="w-3.5 h-3.5" />
                    Completed
                  </span>
                )}
              </div>

              <div className="space-y-2.5">
                {phase.tasks.map((task) => {
                  const isDone = Boolean(taskState[`${selectedCareer}_${task.id}`])
                  const isSyncing = syncingTaskId === task.id

                  return (
                    <div
                      key={task.id}
                      onClick={() => toggleTask(task, phase.phase)}
                      className={`flex items-start gap-3 p-3.5 rounded-xl cursor-pointer transition-all duration-200 select-none ${
                        isDone
                          ? 'bg-green-50/70 border border-green-200 shadow-sm'
                          : 'bg-primary-50/40 border border-transparent hover:bg-primary-50 hover:border-primary-100'
                      }`}
                    >
                      <button
                        type="button"
                        aria-label={`Mark ${task.title} as ${isDone ? 'incomplete' : 'completed'}`}
                        className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-colors flex-shrink-0 ${
                          isDone
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-primary-300 bg-white hover:border-primary-500'
                        }`}
                      >
                        {isSyncing ? (
                          <HiOutlineArrowPath className="w-3 h-3 animate-spin text-primary-500" />
                        ) : isDone ? (
                          <HiOutlineCheckCircle className="w-4 h-4 fill-white text-green-500" />
                        ) : null}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-semibold transition-colors ${
                            isDone ? 'line-through text-text-light' : 'text-text'
                          }`}
                        >
                          {task.title}
                        </p>
                        <p className="text-xs text-text-muted mt-0.5">{task.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
