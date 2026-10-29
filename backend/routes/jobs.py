"""
Job listings and application tracking routes.
Provides sample curated jobs, filters, and user job status tracking.
"""
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import query_db, execute_db

jobs_bp = Blueprint('jobs', __name__)

SAMPLE_JOBS = [
    {
        'id': 'job-1',
        'role': 'Frontend Developer',
        'company': 'TechCorp Solutions',
        'location': 'Bangalore',
        'job_type': 'Full-time',
        'exp': '0–2 years',
        'tags': ['React', 'JavaScript', 'CSS', 'Tailwind'],
        'description': 'Build responsive, fast web interfaces for our enterprise SaaS product. Ideal for freshers and early engineers with strong React fundamentals.',
        'salary': '₹5.5 – 8.5 LPA'
    },
    {
        'id': 'job-2',
        'role': 'Data Analyst Intern',
        'company': 'Analytics Pro',
        'location': 'Remote',
        'job_type': 'Internship',
        'exp': 'Fresher',
        'tags': ['Python', 'SQL', 'Excel', 'Tableau'],
        'description': 'Analyse large user cohorts, build automated reports, and generate actionable business insights. Mentorship provided.',
        'salary': '₹25,000 / month'
    },
    {
        'id': 'job-3',
        'role': 'Backend Engineer',
        'company': 'StartupHub',
        'location': 'Pune',
        'job_type': 'Full-time',
        'exp': '1–3 years',
        'tags': ['Python', 'Flask', 'PostgreSQL', 'REST API'],
        'description': 'Architect robust microservices, optimize database queries, and scale API throughput.',
        'salary': '₹7.0 – 12.0 LPA'
    },
    {
        'id': 'job-4',
        'role': 'Machine Learning Engineer',
        'company': 'AI Ventures',
        'location': 'Hyderabad',
        'job_type': 'Full-time',
        'exp': '1–2 years',
        'tags': ['Python', 'PyTorch', 'Scikit-Learn', 'MLOps'],
        'description': 'Develop and deploy predictive and recommendation models into production pipelines.',
        'salary': '₹9.0 – 15.0 LPA'
    },
    {
        'id': 'job-5',
        'role': 'UI/UX Designer',
        'company': 'DesignStudio',
        'location': 'Mumbai',
        'job_type': 'Contract',
        'exp': 'Fresher OK',
        'tags': ['Figma', 'Prototyping', 'User Research', 'Design Systems'],
        'description': 'Design modern, accessible interfaces for mobile and web platforms. Build high-fidelity wireframes.',
        'salary': '₹5.0 – 8.0 LPA'
    },
    {
        'id': 'job-6',
        'role': 'DevOps Engineer',
        'company': 'CloudTech',
        'location': 'Remote',
        'job_type': 'Full-time',
        'exp': '2+ years',
        'tags': ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
        'description': 'Maintain cloud infrastructure, automate deployment workflows, and improve system observability.',
        'salary': '₹10.0 – 18.0 LPA'
    },
    {
        'id': 'job-7',
        'role': 'Cybersecurity Analyst',
        'company': 'SecureNet Systems',
        'location': 'Noida',
        'job_type': 'Full-time',
        'exp': '0–2 years',
        'tags': ['Network Security', 'Linux', 'VAPT', 'Wireshark'],
        'description': 'Monitor network vulnerabilities, conduct security audits, and implement threat mitigation measures.',
        'salary': '₹6.0 – 9.0 LPA'
    },
    {
        'id': 'job-8',
        'role': 'Product Management Intern',
        'company': 'GrowthWorks',
        'location': 'Bangalore',
        'job_type': 'Internship',
        'exp': 'Fresher',
        'tags': ['Product Strategy', 'Wireframing', 'Agile', 'User Analytics'],
        'description': 'Work alongside senior PMs to write PRDs, interview customers, and guide sprint planning.',
        'salary': '₹30,000 / month'
    }
]


@jobs_bp.route('', methods=['GET'])
def get_jobs():
    search = request.args.get('search', '').lower().strip()
    job_type = request.args.get('type', '').strip()
    exp = request.args.get('exp', '').strip()

    filtered = SAMPLE_JOBS
    if search:
        filtered = [
            j for j in filtered
            if search in j['role'].lower()
            or search in j['company'].lower()
            or any(search in t.lower() for t in j['tags'])
        ]
    if job_type and job_type != 'All':
        filtered = [j for j in filtered if j['job_type'].lower() == job_type.lower()]
    if exp and exp != 'All':
        filtered = [j for j in filtered if exp.lower() in j['exp'].lower()]

    return jsonify({
        'jobs': filtered,
        'disclaimer': 'Sample curated job listings for academic demonstration.'
    }), 200


@jobs_bp.route('/saved', methods=['GET'])
@jwt_required()
def get_saved_jobs():
    user_id = int(get_jwt_identity())
    db_path = current_app.config['DATABASE_PATH']
    rows = query_db(db_path, 'SELECT job_id, role, company, location, job_type, status, saved_at FROM saved_jobs WHERE user_id = ? ORDER BY saved_at DESC', (user_id,))
    return jsonify([dict(r) for r in rows]), 200


@jobs_bp.route('/save', methods=['POST'])
@jwt_required()
def save_job():
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}
    job_id = str(data.get('job_id') or '').strip()
    role = data.get('role', '')
    company = data.get('company', '')
    location = data.get('location', '')
    job_type = data.get('job_type', '')
    status = data.get('status', 'Saved')

    if not job_id:
        return jsonify({'message': 'job_id is required'}), 400

    db_path = current_app.config['DATABASE_PATH']
    execute_db(
        db_path,
        '''INSERT INTO saved_jobs (user_id, job_id, role, company, location, job_type, status)
           VALUES (?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT(user_id, job_id) DO UPDATE SET status = excluded.status''',
        (user_id, job_id, role, company, location, job_type, status)
    )
    return jsonify({'message': f'Job status updated to {status}'}), 200


@jobs_bp.route('/status', methods=['PUT'])
@jwt_required()
def update_status():
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}
    job_id = str(data.get('job_id') or '').strip()
    status = data.get('status', 'Saved')

    if not job_id:
        return jsonify({'message': 'job_id is required'}), 400

    db_path = current_app.config['DATABASE_PATH']
    execute_db(
        db_path,
        'UPDATE saved_jobs SET status = ? WHERE user_id = ? AND job_id = ?',
        (status, user_id, job_id)
    )
    return jsonify({'message': 'Status updated'}), 200


@jobs_bp.route('/save/<job_id>', methods=['DELETE'])
@jwt_required()
def remove_saved_job(job_id):
    user_id = int(get_jwt_identity())
    db_path = current_app.config['DATABASE_PATH']
    execute_db(db_path, 'DELETE FROM saved_jobs WHERE user_id = ? AND job_id = ?', (user_id, job_id))
    return jsonify({'message': 'Job removed from saved list'}), 200
