"""User profile routes."""
import json
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import query_db, execute_db

user_bp = Blueprint('user', __name__)


@user_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = int(get_jwt_identity())
    db_path = current_app.config['DATABASE_PATH']
    user = query_db(db_path, 'SELECT id, name, email, created_at FROM users WHERE id = ?', (user_id,), one=True)
    profile = query_db(db_path, 'SELECT * FROM user_profiles WHERE user_id = ?', (user_id,), one=True)
    if not user:
        return jsonify({'message': 'User not found'}), 404
    data = dict(user)
    if profile:
        data.update({
            'education': profile['education'],
            'college': profile['college'],
            'experience': profile['experience'],
            'career_goal': profile['career_goal'],
            'location': profile['location'],
            'interests': profile['interests'],
            'skills': json.loads(profile['skills']) if profile['skills'] else [],
        })
    return jsonify(data), 200


@user_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}
    db_path = current_app.config['DATABASE_PATH']

    name = (data.get('name') or '').strip()
    if name:
        execute_db(db_path, 'UPDATE users SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', (name, user_id))

    skills = data.get('skills', [])
    skills_json = json.dumps(skills) if isinstance(skills, list) else '[]'

    execute_db(db_path, """
        INSERT INTO user_profiles (user_id, education, college, experience, career_goal, location, skills, interests, updated_at)
        VALUES (?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP)
        ON CONFLICT(user_id) DO UPDATE SET
            education = excluded.education,
            college = excluded.college,
            experience = excluded.experience,
            career_goal = excluded.career_goal,
            location = excluded.location,
            skills = excluded.skills,
            interests = excluded.interests,
            updated_at = CURRENT_TIMESTAMP
    """, (user_id, data.get('education'), data.get('college'), data.get('experience'),
          data.get('career_goal'), data.get('location'), skills_json, data.get('interests')))

    return jsonify({'message': 'Profile updated successfully'}), 200
