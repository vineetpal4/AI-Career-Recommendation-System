"""
AI Career Assistant route.
Uses Gemini API if configured, falls back to rule-based responses.
API key is NEVER exposed to the frontend.
"""
import os
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import execute_db

assistant_bp = Blueprint('assistant', __name__)

RULE_BASED = {
    'career': "Great question! To find your ideal career, consider your interests, skills, and work preferences. CareerAI recommends taking the career assessment. Common tech paths include: Software Developer, Data Scientist, UX Designer, Product Manager, and DevOps Engineer. Would you like details on any of these?",
    'skill': "Building the right skills is key! For software development: start with Python or JavaScript, then learn data structures, SQL, and Git. For data science: Python, statistics, and SQL are essential. For design: Figma and user research are the starting points. Which career are you targeting?",
    'resume': "For a strong resume as a fresher: (1) Keep it to 1 page, (2) Lead with a strong summary, (3) Include 2–3 projects with GitHub links, (4) Quantify achievements where possible, (5) Use action verbs like 'Built', 'Designed', 'Led'. Try our Resume Studio to build one!",
    'interview': "Interview preparation tips: (1) Practice DSA on LeetCode (start Easy), (2) Study system design basics, (3) Prepare STAR-format answers for HR questions, (4) Research the company thoroughly, (5) Practice explaining your projects clearly. Use our Interview Prep section for practice questions!",
    'roadmap': "A typical roadmap: Month 1-2: Programming fundamentals → Month 3-4: Data structures and algorithms → Month 5-6: Specialisation (web dev, data science, etc.) → Month 7-8: Projects and portfolio → Month 9+: Job applications. Check your personalised roadmap in the Roadmap section!",
    'job': "Job search tips: (1) Build a strong LinkedIn profile, (2) Apply on LinkedIn, Naukri, AngelList, and company career pages, (3) Network at events and online communities, (4) Tailor your resume for each application, (5) Follow up within a week. Browse our Jobs section for curated listings!",
    'python': "Python learning path: (1) Basics: variables, loops, functions, (2) OOP concepts, (3) Standard libraries and file handling, (4) APIs and web scraping, (5) Specialise: Flask/Django for web, pandas/NumPy for data. Free resources: Python.org, Real Python, CS50P by Harvard.",
    'javascript': "JavaScript learning path: (1) Core JS: variables, arrays, functions, DOM, (2) ES6+ features: arrow functions, promises, async/await, (3) React for frontend, (4) Node.js for backend. Great free resources: javascript.info, freeCodeCamp, The Odin Project.",
    'default': "I'm your CareerAI Assistant! I can help with: career path guidance, skills to learn, resume tips, interview preparation, learning roadmaps, and job search strategies. What would you like to explore? You can also use the quick prompts below!",
}

def get_rule_based_response(message: str) -> str:
    lower = message.lower()
    if any(w in lower for w in ['career', 'path', 'job role', 'what should', 'suitable']):
        return RULE_BASED['career']
    if any(w in lower for w in ['skill', 'learn', 'technology', 'what to learn', 'study']):
        return RULE_BASED['skill']
    if any(w in lower for w in ['resume', 'cv', 'portfolio', 'application']):
        return RULE_BASED['resume']
    if any(w in lower for w in ['interview', 'dsa', 'leetcode', 'technical round', 'hr round']):
        return RULE_BASED['interview']
    if any(w in lower for w in ['roadmap', 'plan', 'schedule', 'how long', 'timeline']):
        return RULE_BASED['roadmap']
    if any(w in lower for w in ['job', 'internship', 'apply', 'hiring', 'placement']):
        return RULE_BASED['job']
    if 'python' in lower:
        return RULE_BASED['python']
    if 'javascript' in lower or 'js' in lower:
        return RULE_BASED['javascript']
    return RULE_BASED['default']


def call_gemini(message: str, history: list) -> str | None:
    api_key = os.environ.get('GEMINI_API_KEY', '')
    if not api_key:
        return None
    try:
        import google.generativeai as genai
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel(
            'gemini-1.5-flash',
            system_instruction=(
                "You are CareerAI Assistant, a friendly and helpful career guidance AI for students and freshers in India. "
                "You help with career path exploration, skill development, learning roadmaps, resume advice, interview preparation, "
                "and job search strategies. Keep responses concise, practical, and encouraging. "
                "If asked about topics unrelated to career guidance, politely redirect to career topics."
            )
        )
        chat = model.start_chat(history=[
            {'role': m['role'], 'parts': [m['content']]} for m in history[-10:]
        ])
        response = chat.send_message(message)
        return response.text
    except Exception as e:
        print(f'[Gemini] Error: {e}')
        return None


@assistant_bp.route('/chat', methods=['POST'])
@jwt_required()
def chat():
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}
    message = (data.get('message') or '').strip()

    if not message:
        return jsonify({'message': 'Message is required'}), 400
    if len(message) > 2000:
        return jsonify({'message': 'Message too long (max 2000 characters)'}), 400

    db_path = current_app.config['DATABASE_PATH']

    # Try Gemini first
    gemini_response = call_gemini(message, [])
    is_rule_based = gemini_response is None
    response_text = gemini_response or get_rule_based_response(message)

    # Save to chat history
    try:
        execute_db(db_path, 'INSERT INTO chat_history (user_id, role, content, is_rule_based) VALUES (?,?,?,?)',
            (user_id, 'user', message, 0))
        execute_db(db_path, 'INSERT INTO chat_history (user_id, role, content, is_rule_based) VALUES (?,?,?,?)',
            (user_id, 'assistant', response_text, 1 if is_rule_based else 0))
    except Exception:
        pass  # Don't fail the request if saving history fails

    return jsonify({
        'response': response_text,
        'reply': response_text,
        'is_rule_based': is_rule_based,
        'note': 'Rule-based response. Configure GEMINI_API_KEY for AI-powered answers.' if is_rule_based else '',
    }), 200


@assistant_bp.route('/history', methods=['GET'])
@jwt_required()
def get_history():
    user_id = int(get_jwt_identity())
    db_path = current_app.config['DATABASE_PATH']
    history = query_db(db_path, """
        SELECT role, content, is_rule_based, created_at
        FROM chat_history
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT 50
    """, (user_id,))
    return jsonify([dict(h) for h in reversed(history)]), 200


# Import missing query_db
from database import query_db
