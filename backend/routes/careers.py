"""Saved careers routes."""
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import query_db, execute_db

careers_bp = Blueprint('careers', __name__)


@careers_bp.route('/save', methods=['POST'])
@jwt_required()
def save_career():
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}
    career_title = (data.get('career_title') or '').strip()
    if not career_title:
        return jsonify({'message': 'career_title is required'}), 400
    db_path = current_app.config['DATABASE_PATH']
    try:
        execute_db(db_path, 'INSERT OR IGNORE INTO saved_careers (user_id, career_title) VALUES (?,?)', (user_id, career_title))
    except Exception:
        return jsonify({'message': 'Failed to save career'}), 500
    return jsonify({'message': f'{career_title} saved'}), 200


@careers_bp.route('/saved', methods=['GET'])
@jwt_required()
def get_saved():
    user_id = int(get_jwt_identity())
    db_path = current_app.config['DATABASE_PATH']
    saved = query_db(db_path, 'SELECT career_title, saved_at FROM saved_careers WHERE user_id = ? ORDER BY saved_at DESC', (user_id,))
    return jsonify([dict(s) for s in saved]), 200


@careers_bp.route('/save/<career_title>', methods=['DELETE'])
@jwt_required()
def remove_saved(career_title):
    user_id = int(get_jwt_identity())
    db_path = current_app.config['DATABASE_PATH']
    execute_db(db_path, 'DELETE FROM saved_careers WHERE user_id = ? AND career_title = ?', (user_id, career_title))
    return jsonify({'message': 'Removed from saved careers'}), 200
