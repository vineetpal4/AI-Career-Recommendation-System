"""
Career assessment routes and rule-based recommendation engine.
Match scores are clearly labelled as rule-based estimates.
"""
import json
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import query_db, execute_db

assessment_bp = Blueprint('assessment', __name__)

# ─── Rule-based career matching data ──────────────────────────────────────────

CAREER_PROFILES = [
    {
        'career_title': 'Software Developer',
        'field': 'Technology',
        'keywords': ['building software', 'apps', 'coding', 'technology', 'python', 'javascript', 'java'],
        'sectors': ['technology / it'],
        'problem_types': ['technical / engineering problems'],
        'matching_skills': ['JavaScript', 'Python', 'Java', 'Problem Solving'],
        'skills_to_develop': ['System Design', 'Cloud Services', 'Testing', 'Agile'],
        'next_steps': [
            'Build 2–3 portfolio projects and host them on GitHub',
            'Practice DSA problems on LeetCode',
            'Contribute to an open-source project',
            'Apply for junior developer or internship roles',
        ],
        'explanation': 'Your profile shows strong alignment with software development. Your interest in building technical solutions and existing coding skills are a great foundation.',
    },
    {
        'career_title': 'Data Scientist',
        'field': 'Analytics & AI',
        'keywords': ['data', 'analytics', 'patterns', 'machine learning', 'python', 'sql', 'statistics'],
        'sectors': ['technology / it', 'finance & fintech'],
        'problem_types': ['data / analytical problems'],
        'matching_skills': ['Python', 'Statistics', 'SQL', 'Data Analysis'],
        'skills_to_develop': ['Machine Learning', 'TensorFlow', 'Data Visualisation', 'Big Data'],
        'next_steps': [
            'Complete a data science fundamentals course (Kaggle Learn is free)',
            'Work on public datasets from Kaggle',
            'Build a data analysis portfolio with 2–3 projects',
            'Learn scikit-learn for ML models',
        ],
        'explanation': 'Your analytical mindset and interest in finding patterns in data align strongly with data science. This is a high-demand field with excellent career growth.',
    },
    {
        'career_title': 'UX/UI Designer',
        'field': 'Design',
        'keywords': ['design', 'user experience', 'creative', 'visual', 'figma'],
        'sectors': ['creative & media', 'technology / it'],
        'problem_types': ['creative / design problems', 'human / social problems'],
        'matching_skills': ['Creative Thinking', 'Visual Communication', 'User Empathy'],
        'skills_to_develop': ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
        'next_steps': [
            'Learn Figma through official tutorials (free)',
            'Redesign 2 existing apps as case studies',
            'Build a Behance or portfolio website',
            'Study the basics of user research and usability testing',
        ],
        'explanation': 'Your creative interests and focus on human-centred solutions point towards UX/UI design. This role bridges creativity with technology.',
    },
    {
        'career_title': 'Product Manager',
        'field': 'Strategy & Management',
        'keywords': ['managing', 'strategy', 'leadership', 'business', 'products'],
        'sectors': ['technology / it', 'e-commerce / retail', 'finance & fintech'],
        'problem_types': ['business / strategy problems'],
        'matching_skills': ['Communication', 'Analytical Thinking', 'Leadership'],
        'skills_to_develop': ['Agile / Scrum', 'Product Roadmapping', 'Data Analysis', 'Stakeholder Management'],
        'next_steps': [
            'Read "Inspired" by Marty Cagan',
            'Take a free product management course (Coursera, Product School)',
            'Practice writing PRDs (Product Requirement Documents)',
            'Look for associate PM or business analyst internships',
        ],
        'explanation': 'Your interest in strategy and working with people makes product management an excellent fit. PMs bridge business and technology teams.',
    },
    {
        'career_title': 'DevOps Engineer',
        'field': 'Infrastructure & Operations',
        'keywords': ['automation', 'infrastructure', 'cloud', 'docker', 'linux', 'devops'],
        'sectors': ['technology / it'],
        'problem_types': ['technical / engineering problems'],
        'matching_skills': ['Linux Basics', 'Scripting', 'Problem Solving'],
        'skills_to_develop': ['Docker', 'Kubernetes', 'AWS/GCP', 'CI/CD', 'Monitoring'],
        'next_steps': [
            'Learn Linux command line basics',
            'Set up Docker and containerise a simple app',
            'Get the AWS Cloud Practitioner certification (entry level)',
            'Build a CI/CD pipeline with GitHub Actions',
        ],
        'explanation': 'Your technical aptitude and interest in systems aligns with DevOps. This high-demand field focuses on automating and scaling software delivery.',
    },
]


def calculate_match_score(answers, career):
    """
    Rule-based scoring system.
    Returns a score between 50 and 97.
    Clearly NOT a scientifically validated measure.
    """
    score = 50  # baseline

    interest = (answers.get('interest') or '').lower()
    skills = [s.lower() for s in (answers.get('skills') or [])]
    sector = (answers.get('sector') or '').lower()
    problem_type = (answers.get('problemType') or '').lower()

    # Keyword match in interest
    for kw in career['keywords']:
        if kw.lower() in interest:
            score += 8

    # Sector match
    for s in career['sectors']:
        if s.lower() in sector:
            score += 10

    # Problem type match
    for pt in career['problem_types']:
        if pt.lower() in problem_type:
            score += 12

    # Skill overlap
    career_skill_keywords = ' '.join(career['matching_skills']).lower()
    for skill in skills:
        if skill in career_skill_keywords or skill in career_skill_keywords:
            score += 5

    # Cap at 97 to be honest about uncertainty
    return min(97, score)


@assessment_bp.route('/submit', methods=['POST'])
@jwt_required()
def submit_assessment():
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}
    answers = data.get('answers', {})

    if not answers:
        return jsonify({'message': 'No answers provided'}), 400

    db_path = current_app.config['DATABASE_PATH']

    # Save assessment
    assessment_id = execute_db(db_path,
        'INSERT INTO assessments (user_id, answers) VALUES (?,?)',
        (user_id, json.dumps(answers))
    )

    # Generate recommendations
    scored = []
    for career in CAREER_PROFILES:
        score = calculate_match_score(answers, career)
        scored.append({**career, 'match_score': score, 'assessment_id': assessment_id})

    scored.sort(key=lambda c: c['match_score'], reverse=True)
    top_careers = scored[:5]

    # Save recommendations to DB
    for career in top_careers:
        execute_db(db_path, """
            INSERT INTO career_recommendations
                (user_id, assessment_id, career_title, match_score, field, explanation,
                 matching_skills, skills_to_develop, next_steps)
            VALUES (?,?,?,?,?,?,?,?,?)
        """, (
            user_id,
            assessment_id,
            career['career_title'],
            career['match_score'],
            career['field'],
            career['explanation'],
            json.dumps(career['matching_skills']),
            json.dumps(career['skills_to_develop']),
            json.dumps(career['next_steps']),
        ))

    # Profile notification
    execute_db(db_path, 'INSERT INTO notifications (user_id, title, message) VALUES (?,?,?)',
        (user_id, 'Assessment Complete! 🎯', f'Your top career match is {top_careers[0]["career_title"]} with a {top_careers[0]["match_score"]}% match score.'))

    return jsonify({
        'message': 'Assessment completed',
        'assessment_id': assessment_id,
        'careers': [
            {
                'career_title': c['career_title'],
                'field': c['field'],
                'match_score': c['match_score'],
                'explanation': c['explanation'],
                'matching_skills': c['matching_skills'],
                'skills_to_develop': c['skills_to_develop'],
                'next_steps': c['next_steps'],
            } for c in top_careers
        ],
        'is_rule_based': True,
        'note': 'These are rule-based recommendations and are not scientifically validated.',
    }), 200


@assessment_bp.route('/results', methods=['GET'])
@jwt_required()
def get_results():
    user_id = int(get_jwt_identity())
    db_path = current_app.config['DATABASE_PATH']

    recommendations = query_db(db_path, """
        SELECT * FROM career_recommendations
        WHERE user_id = ?
        ORDER BY match_score DESC
        LIMIT 5
    """, (user_id,))

    if not recommendations:
        # Return fallback data so frontend always has something to show
        return jsonify({
            'careers': [
                {
                    'career_title': 'Software Developer',
                    'field': 'Technology',
                    'match_score': 85,
                    'explanation': 'Complete the career assessment to get personalised recommendations.',
                    'matching_skills': ['Problem Solving', 'Logical Thinking'],
                    'skills_to_develop': ['JavaScript', 'Python', 'React'],
                    'next_steps': ['Take the career assessment', 'Build your profile', 'Start the roadmap'],
                }
            ],
            'has_assessment': False,
        }), 200

    careers = []
    for r in recommendations:
        careers.append({
            'career_title': r['career_title'],
            'field': r['field'],
            'match_score': r['match_score'],
            'explanation': r['explanation'],
            'matching_skills': json.loads(r['matching_skills']) if r['matching_skills'] else [],
            'skills_to_develop': json.loads(r['skills_to_develop']) if r['skills_to_develop'] else [],
            'next_steps': json.loads(r['next_steps']) if r['next_steps'] else [],
        })

    return jsonify({'careers': careers, 'has_assessment': True}), 200
