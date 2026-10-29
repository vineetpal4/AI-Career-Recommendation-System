import React, { useState, useRef, useEffect } from 'react'
import { HiOutlineSparkles, HiOutlinePaperAirplane, HiOutlineTrash, HiOutlineInformationCircle } from 'react-icons/hi2'
import api from '../services/api'

const RULE_BASED_RESPONSES = {
  career: "Great question! To explore career options, I'd recommend taking our Career Assessment first. Based on your skills and interests, I can suggest paths like Software Development, Data Science, UX Design, Product Management, or DevOps. Would you like to know more about any of these?",
  skill: "Building the right skills is crucial. For most tech careers, focus on: 1) A programming language (Python for data/AI, JavaScript for web), 2) Databases (SQL is essential), 3) Version control (Git), 4) Communication and problem-solving. What career are you targeting?",
  resume: "For a strong resume: 1) Keep it to 1 page for freshers, 2) Use action verbs ('Built', 'Designed', 'Led'), 3) Quantify achievements where possible, 4) Include 2–3 strong projects with GitHub links, 5) Match keywords from job descriptions. Use our Resume Studio to build one!",
  interview: "Interview prep tips: 1) Practice DSA problems on LeetCode (Easy→Medium), 2) Understand system design basics, 3) Prepare your STAR-format stories for HR questions, 4) Research the company before the interview, 5) Practice mock interviews. Check our Interview Prep section!",
  roadmap: "A typical roadmap for a developer: Month 1–2: Programming fundamentals → Month 3–4: Data structures & algorithms → Month 5–6: Web development or specialisation → Month 7–8: Projects & portfolio → Month 9+: Job applications. Use our Roadmap feature for a personalised plan!",
  job: "For job searching: 1) Build a strong LinkedIn profile, 2) Apply on LinkedIn, Naukri, AngelList, and company career pages, 3) Network actively, 4) Tailor your resume for each role, 5) Follow up after applying. Check our Jobs section for curated listings!",
  python: "Python learning path: 1) Basics (variables, loops, functions), 2) OOP concepts, 3) File handling and APIs, 4) Libraries (NumPy, Pandas for data; Flask/Django for web), 5) Projects. Great resources: Python.org docs, Real Python, freeCodeCamp, CS50P.",
  default: "I'm here to help with your career journey! I can answer questions about career options, skills to learn, interview preparation, resume tips, and learning roadmaps. What would you like to know?",
}

function getRuleBasedResponse(message) {
  const lower = message.toLowerCase()
  if (lower.includes('career') || lower.includes('path') || lower.includes('job role')) return RULE_BASED_RESPONSES.career
  if (lower.includes('skill') || lower.includes('learn') || lower.includes('technology')) return RULE_BASED_RESPONSES.skill
  if (lower.includes('resume') || lower.includes('cv') || lower.includes('portfolio')) return RULE_BASED_RESPONSES.resume
  if (lower.includes('interview') || lower.includes('dsa') || lower.includes('leetcode')) return RULE_BASED_RESPONSES.interview
  if (lower.includes('roadmap') || lower.includes('plan') || lower.includes('schedule')) return RULE_BASED_RESPONSES.roadmap
  if (lower.includes('job') || lower.includes('internship') || lower.includes('apply')) return RULE_BASED_RESPONSES.job
  if (lower.includes('python')) return RULE_BASED_RESPONSES.python
  return RULE_BASED_RESPONSES.default
}

function ChatBubble({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center flex-shrink-0 mt-1">
          <HiOutlineSparkles className="w-4 h-4 text-white" />
        </div>
      )}
      <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
        isUser
          ? 'bg-primary-600 text-white rounded-tr-sm'
          : 'bg-white border border-primary-100 text-text rounded-tl-sm shadow-card'
      }`}>
        {msg.content}
        {msg.isRuleBased && (
          <p className="text-xs text-text-light mt-2 border-t border-primary-100 pt-1.5">
            Rule-based response · Configure AI API for smarter answers
          </p>
        )}
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-peach-200 flex items-center justify-center flex-shrink-0 mt-1 text-orange-700 text-xs font-bold">
          You
        </div>
      )}
    </div>
  )
}

const QUICK_PROMPTS = [
  'What career suits me?',
  'Skills for Data Science?',
  'How to write a resume?',
  'Interview tips for freshers',
  'Python learning roadmap',
  'How to find internships?',
]

export default function CareerAssistant() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "👋 Hi! I'm your CareerAI Assistant. I can help you with career guidance, skill recommendations, roadmap planning, resume tips, and interview preparation.\n\nWhat would you like to explore today?",
      isRuleBased: false,
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [aiAvailable, setAiAvailable] = useState(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text) => {
    const content = text || input.trim()
    if (!content) return
    setInput('')

    const userMsg = { role: 'user', content }
    setMessages(m => [...m, userMsg])
    setLoading(true)

    try {
      const res = await api.post('/assistant/chat', { message: content })
      setMessages(m => [...m, { role: 'assistant', content: res.data.response, isRuleBased: res.data.is_rule_based }])
      setAiAvailable(!res.data.is_rule_based)
    } catch {
      // Fallback to local rule-based
      const response = getRuleBasedResponse(content)
      setMessages(m => [...m, { role: 'assistant', content: response, isRuleBased: true }])
    } finally {
      setLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: "Chat cleared! How can I help you with your career journey today?",
      isRuleBased: false,
    }])
  }

  return (
    <div className="max-w-3xl mx-auto px-4 h-[calc(100vh-8rem)] flex flex-col py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
            <HiOutlineSparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-text">CareerAI Assistant</h1>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <p className="text-xs text-text-muted">{aiAvailable === false ? 'Rule-based mode' : 'Online'}</p>
            </div>
          </div>
        </div>
        <button onClick={clearChat} className="btn-ghost text-sm" title="Clear chat">
          <HiOutlineTrash className="w-4 h-4" />
          Clear
        </button>
      </div>

      {/* AI mode notice */}
      {aiAvailable === false && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs mb-3 flex-shrink-0">
          <HiOutlineInformationCircle className="w-4 h-4 flex-shrink-0" />
          Using rule-based responses. Configure a Gemini API key in backend/.env for AI-powered answers.
        </div>
      )}

      {/* Quick prompts */}
      <div className="flex gap-2 flex-wrap mb-3 flex-shrink-0">
        {QUICK_PROMPTS.map(prompt => (
          <button
            key={prompt}
            onClick={() => sendMessage(prompt)}
            className="text-xs px-3 py-1.5 rounded-full bg-white border border-primary-100 text-text-muted hover:border-primary-400 hover:text-primary-600 transition-all duration-200"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-4">
        {messages.map((msg, i) => (
          <ChatBubble key={i} msg={msg} />
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center flex-shrink-0 mt-1">
              <HiOutlineSparkles className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white border border-primary-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-card">
              <div className="flex gap-1.5 items-center">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-3 mt-3 flex-shrink-0">
        <input
          className="input flex-1"
          placeholder="Ask anything about your career..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
          disabled={loading}
        />
        <button
          onClick={() => sendMessage()}
          disabled={!input.trim() || loading}
          className="btn-primary px-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <HiOutlinePaperAirplane className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
