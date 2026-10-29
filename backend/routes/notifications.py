"""
User notifications routes.
Manages alerts for roadmap deadlines, assessment results, and application milestones.
"""
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import query_db, execute_db

notifications_bp = Blueprint('notifications', __name__)


@notifications_bp.route('', methods=['GET'])
@jwt_required()
def get_notifications():
    user_id = int(get_jwt_identity())
    db_path = current_app.config['DATABASE_PATH']
    rows = query_db(
        db_path,
        'SELECT id, title, message, type, is_read, created_at FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
        (user_id,)
    )
    return jsonify([dict(r) for r in rows]), 200


@notifications_bp.route('', methods=['POST'])
@jwt_required()
def create_notification():
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}
    title = (data.get('title') or '').strip()
    message = (data.get('message') or '').strip()
    notif_type = data.get('type', 'info')

    if not title or not message:
        return jsonify({'message': 'Title and message are required'}), 400

    db_path = current_app.config['DATABASE_PATH']
    notif_id = execute_db(
        db_path,
        'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
        (user_id, title, message, notif_type)
    )
    return jsonify({'id': notif_id, 'message': 'Notification created'}), 201


@notifications_bp.route('/<int:notif_id>/read', methods=['PUT'])
@jwt_required()
def mark_read(notif_id):
    user_id = int(get_jwt_identity())
    db_path = current_app.config['DATABASE_PATH']
    execute_db(
        db_path,
        'UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?',
        (notif_id, user_id)
    )
    return jsonify({'message': 'Notification marked as read'}), 200


@notifications_bp.route('/read-all', methods=['PUT'])
@jwt_required()
def mark_all_read():
    user_id = int(get_jwt_identity())
    db_path = current_app.config['DATABASE_PATH']
    execute_db(
        db_path,
        'UPDATE notifications SET is_read = 1 WHERE user_id = ?',
        (user_id,)
    )
    return jsonify({'message': 'All notifications marked as read'}), 200


@notifications_bp.route('/<int:notif_id>', methods=['DELETE'])
@jwt_required()
def delete_notification(notif_id):
    user_id = int(get_jwt_identity())
    db_path = current_app.config['DATABASE_PATH']
    execute_db(
        db_path,
        'DELETE FROM notifications WHERE id = ? AND user_id = ?',
        (notif_id, user_id)
    )
    return jsonify({'message': 'Notification deleted'}), 200
