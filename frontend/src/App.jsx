import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LoadingSpinner from './components/LoadingSpinner'

// Lazy-loaded pages
const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Assessment = lazy(() => import('./pages/Assessment'))
const CareerMatch = lazy(() => import('./pages/CareerMatch'))
const SkillGap = lazy(() => import('./pages/SkillGap'))
const Roadmap = lazy(() => import('./pages/Roadmap'))
const Jobs = lazy(() => import('./pages/Jobs'))
const ResumeStudio = lazy(() => import('./pages/ResumeStudio'))
const InterviewPrep = lazy(() => import('./pages/InterviewPrep'))
const CareerAssistant = lazy(() => import('./pages/CareerAssistant'))
const ExploreCareers = lazy(() => import('./pages/ExploreCareers'))
const Profile = lazy(() => import('./pages/Profile'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))

// Protected route wrapper
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <LoadingSpinner fullScreen />
  if (!user) return <Navigate to="/login" replace />
  return children
}

// Layout wrapper
function Layout({ children, hideFooter = false }) {
  return (
    <div className="min-h-screen flex flex-col bg-warm">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/explore-careers" element={<Layout><ExploreCareers /></Layout>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout><Dashboard /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/assessment" element={
            <ProtectedRoute>
              <Layout hideFooter><Assessment /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/career-match" element={
            <ProtectedRoute>
              <Layout><CareerMatch /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/skill-gap" element={
            <ProtectedRoute>
              <Layout><SkillGap /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/roadmap" element={
            <ProtectedRoute>
              <Layout><Roadmap /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/jobs" element={
            <ProtectedRoute>
              <Layout><Jobs /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/resume-studio" element={
            <ProtectedRoute>
              <Layout><ResumeStudio /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/interview-prep" element={
            <ProtectedRoute>
              <Layout><InterviewPrep /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/career-assistant" element={
            <ProtectedRoute>
              <Layout hideFooter><CareerAssistant /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Layout><Profile /></Layout>
            </ProtectedRoute>
          } />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  )
}
