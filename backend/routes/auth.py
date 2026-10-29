"""
Authentication routes: signup, login.
Passwords are hashed with Werkzeug (PBKDF2-SHA256).
JWTs are issued via flask-jwt-extended.
"""
import os, re
from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from database import get_db, execute_db, query_db

auth_bp = Blueprint('auth', __name__)


def is_valid_email(email):
    return re.match(r'^[^@\s]+@[^@\s]+\.[^@\s]+$', email) is not None


@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    if not data:
        return jsonify({'message': 'No data provided'}), 400

    name = (data.get('name') or '').strip()
    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''

    # Validation
    if not name or not email or not password:
        return jsonify({'message': 'Name, email, and password are required'}), 400
    if not is_valid_email(email):
        return jsonify({'message': 'Invalid email address'}), 400
    if len(password) < 8:
        return jsonify({'message': 'Password must be at least 8 characters'}), 400

    db_path = current_app.config['DATABASE_PATH']

    # Check if email already in use
    existing = query_db(db_path, 'SELECT id FROM users WHERE email = ?', (email,), one=True)
    if existing:
        return jsonify({'message': 'An account with this email already exists'}), 409

    password_hash = generate_password_hash(password)

    try:
        user_id = execute_db(db_path, 'INSERT INTO users (name, email, password_hash) VALUES (?,?,?)', (name, email, password_hash))
        # Create empty profile
        execute_db(db_path, 'INSERT INTO user_profiles (user_id) VALUES (?)', (user_id,))
        # Welcome notification
        execute_db(db_path,
            'INSERT INTO notifications (user_id, title, message, type) VALUES (?,?,?,?)',
            (user_id, 'Welcome to CareerAI! 🎉', 'Your account is set up. Take the career assessment to get started.', 'success')
        )
    except Exception as e:
        return jsonify({'message': 'Failed to create account. Please try again.'}), 500

    token = create_access_token(identity=str(user_id))
    return jsonify({
        'token': token,
        'user': {'id': user_id, 'name': name, 'email': email},
    }), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        return jsonify({'message': 'No data provided'}), 400

    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''

    if not email or not password:
        return jsonify({'message': 'Email and password are required'}), 400

    db_path = current_app.config['DATABASE_PATH']
    user = query_db(db_path, 'SELECT * FROM users WHERE email = ?', (email,), one=True)

    if not user or not check_password_hash(user['password_hash'], password):
        return jsonify({'message': 'Invalid email or password'}), 401

    token = create_access_token(identity=str(user['id']))
    return jsonify({
        'token': token,
        'user': {'id': user['id'], 'name': user['name'], 'email': user['email']},
    }), 200
