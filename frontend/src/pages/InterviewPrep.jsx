import React, { useState } from 'react'
import { HiOutlineTrophy, HiOutlineChevronDown, HiOutlineChevronUp, HiOutlineCheckCircle, HiOutlineLightBulb } from 'react-icons/hi2'

const CATEGORIES = ['All', 'Java', 'Python', 'SQL', 'DSA', 'System Design', 'HR / Behavioural']
const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced']

const QUESTIONS = [
  { id: 1, category: 'Java', difficulty: 'Beginner', question: 'What is the difference between == and .equals() in Java?', hint: 'Think about reference comparison vs value comparison.', answer: '`==` compares object references (memory addresses), while `.equals()` compares the actual content/value of objects. For String comparison, always use `.equals()`. Example: `"hello" == "hello"` may be true due to string pooling, but `new String("hello") == new String("hello")` is false.' },
  { id: 2, category: 'Java', difficulty: 'Intermediate', question: 'Explain the concept of Java Generics and why they are useful.', hint: 'Consider type safety and code reusability.', answer: 'Generics allow classes and methods to operate on typed parameters, providing type safety at compile time. They eliminate the need for casting, enable code reuse for different types, and catch type errors at compile time rather than runtime. Example: `List<String>` ensures only strings are added.' },
  { id: 3, category: 'Python', difficulty: 'Beginner', question: 'What is the difference between a list and a tuple in Python?', hint: 'Think about mutability.', answer: 'Lists are mutable (can be changed after creation) and use square brackets `[]`. Tuples are immutable (cannot be changed) and use parentheses `()`. Tuples are faster and can be used as dictionary keys. Use lists for dynamic data, tuples for fixed collections.' },
  { id: 4, category: 'SQL', difficulty: 'Beginner', question: 'What is the difference between WHERE and HAVING clauses in SQL?', hint: 'Think about when filtering happens relative to aggregation.', answer: '`WHERE` filters rows BEFORE aggregation (GROUP BY). `HAVING` filters groups AFTER aggregation. Example: `WHERE salary > 50000` filters individual rows. `HAVING COUNT(*) > 5` filters groups that have more than 5 members.' },
  { id: 5, category: 'DSA', difficulty: 'Intermediate', question: 'Explain the time complexity of common sorting algorithms.', hint: 'Think about average and worst cases.', answer: 'Bubble Sort: O(n²) | Selection Sort: O(n²) | Insertion Sort: O(n²) avg, O(n) best | Merge Sort: O(n log n) always | Quick Sort: O(n log n) avg, O(n²) worst | Heap Sort: O(n log n). For most cases, use Merge Sort or Quick Sort for efficiency.' },
  { id: 6, category: 'System Design', difficulty: 'Advanced', question: 'How would you design a URL shortener like bit.ly?', hint: 'Think about the components: encoding, storage, redirection.', answer: 'Key components: 1) Generate unique short code (Base62 encoding of ID), 2) Store mapping in DB (shortCode → longURL), 3) Handle redirects (301/302), 4) Cache popular URLs in Redis, 5) Use load balancer for scale, 6) Analytics tracking. Schema: id, short_code, long_url, created_at, user_id.' },
  { id: 7, category: 'HR / Behavioural', difficulty: 'Beginner', question: 'Tell me about yourself.', hint: 'Use the Present-Past-Future structure.', answer: 'Structure: Present (current status/role) → Past (relevant experience/education) → Future (goals and why this role). Example: "I\'m a final year CS student at [University] passionate about web development. Over the past year, I\'ve built 3 full-stack projects using React and Node.js. I\'m looking for a role where I can contribute to impactful products while growing as an engineer."' },
  { id: 8, category: 'DSA', difficulty: 'Beginner', question: 'What is a Binary Search and when should you use it?', hint: 'It works on sorted data.', answer: 'Binary Search works on sorted arrays by repeatedly dividing the search interval in half. Time complexity: O(log n). Use it when: the data is sorted, you need to find an element efficiently, or you\'re looking for a boundary condition. Pseudocode: check mid, if target < mid search left half, else search right half.' },
]

function QuestionCard({ q }) {
  const [expanded, setExpanded] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [userAnswer, setUserAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const diffColor = { Beginner: 'badge-primary', Intermediate: 'bg-yellow-100 text-yellow-700', Advanced: 'bg-red-100 text-red-700' }

  return (
    <div className="card">
      <div className="flex items-start justify-between gap-4 cursor-pointer" onClick={() => setExpanded(e => !e)}>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`badge text-xs ${diffColor[q.difficulty]}`}>{q.difficulty}</span>
            <span className="badge badge-lavender text-xs">{q.category}</span>
          </div>
          <h3 className="font-medium text-text text-sm leading-relaxed">{q.question}</h3>
        </div>
        {expanded ? <HiOutlineChevronUp className="w-5 h-5 text-text-muted flex-shrink-0 mt-1" /> : <HiOutlineChevronDown className="w-5 h-5 text-text-muted flex-shrink-0 mt-1" />}
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-primary-50 space-y-4">
          {/* Hint */}
          <div className="flex items-start gap-2 p-3 rounded-xl bg-lavender-100">
            <HiOutlineLightBulb className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-primary-700"><strong>Hint:</strong> {q.hint}</p>
          </div>

          {/* User answer box */}
          {!submitted ? (
            <>
              <textarea
                className="input min-h-[80px] resize-none text-sm"
                placeholder="Type your answer here to practice..."
                value={userAnswer}
                onChange={e => setUserAnswer(e.target.value)}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setSubmitted(true)}
                  disabled={!userAnswer.trim()}
                  className="btn-primary text-sm py-2 disabled:opacity-40"
                >
                  <HiOutlineCheckCircle className="w-4 h-4" />
                  Submit Answer
                </button>
                <button onClick={() => setShowAnswer(true)} className="btn-secondary text-sm py-2">
                  Show Answer
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-primary-50 border border-primary-100">
                <p className="text-xs font-semibold text-primary-700 mb-1">Your Answer:</p>
                <p className="text-xs text-text-muted">{userAnswer}</p>
              </div>
              <button onClick={() => setShowAnswer(true)} className="text-sm text-primary-600 font-medium hover:underline">
                Compare with model answer →
              </button>
            </div>
          )}

          {/* Model answer */}
          {showAnswer && (
            <div className="p-4 rounded-xl bg-green-50 border border-green-200">
              <p className="text-xs font-semibold text-green-700 mb-2">✅ Model Answer:</p>
              <p className="text-xs text-text-muted leading-relaxed whitespace-pre-line">{q.answer}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function InterviewPrep() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeDiff, setActiveDiff] = useState('All')

  const filtered = QUESTIONS.filter(q =>
    (activeCategory === 'All' || q.category === activeCategory) &&
    (activeDiff === 'All' || q.difficulty === activeDiff)
  )

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-100 text-primary-700 text-sm font-medium mb-4">
          <HiOutlineTrophy className="w-4 h-4" />
          Interview Preparation
        </div>
        <h1 className="font-display text-3xl font-bold text-text mb-2">Practice Interview Questions</h1>
        <p className="text-text-muted">Practice with categorised questions, submit answers, and compare with model answers.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="card text-center"><p className="text-2xl font-bold text-gradient">{QUESTIONS.length}</p><p className="text-xs text-text-muted">Questions</p></div>
        <div className="card text-center"><p className="text-2xl font-bold text-gradient">{CATEGORIES.length - 1}</p><p className="text-xs text-text-muted">Categories</p></div>
        <div className="card text-center"><p className="text-2xl font-bold text-gradient">3</p><p className="text-xs text-text-muted">Difficulty Levels</p></div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setActiveCategory(c)}
            className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${activeCategory === c ? 'bg-primary-600 text-white' : 'bg-white border border-primary-100 text-text-muted hover:border-primary-300'}`}
          >{c}</button>
        ))}
      </div>
      <div className="flex gap-2 mb-8">
        {DIFFICULTIES.map(d => (
          <button key={d} onClick={() => setActiveDiff(d)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${activeDiff === d ? 'bg-primary-100 text-primary-700 border border-primary-300' : 'bg-white border border-primary-100 text-text-muted hover:border-primary-200'}`}
          >{d}</button>
        ))}
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {filtered.map(q => <QuestionCard key={q.id} q={q} />)}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-text-muted">No questions match the selected filters.</div>
        )}
      </div>
    </div>
  )
}
