"""
CareerAI Flask Backend — Main Application
"""
import os
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv

from database import init_db
from routes.auth import auth_bp
from routes.user import user_bp
from routes.assessment import assessment_bp
from routes.careers import careers_bp
from routes.assistant import assistant_bp
from routes.resume import resume_bp
from routes.jobs import jobs_bp
from routes.notifications import notifications_bp
from routes.roadmap import roadmap_bp

load_dotenv()

def create_app():
    app = Flask(__name__)

    # Configuration
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key')
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'dev-jwt-secret')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = False  # Tokens don't expire in dev
    app.config['DATABASE_PATH'] = os.environ.get('DATABASE_PATH', 'careerai.db')
    app.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024  # 5MB max upload

    # CORS — allow requests from the React dev server
    frontend_url = os.environ.get('FRONTEND_URL', 'http://localhost:5173')
    CORS(app, origins=[frontend_url, 'http://localhost:5173', 'http://127.0.0.1:5173'],
         supports_credentials=True)

    # JWT
    jwt = JWTManager(app)

    # Blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(user_bp, url_prefix='/api/user')
    app.register_blueprint(assessment_bp, url_prefix='/api/assessment')
    app.register_blueprint(careers_bp, url_prefix='/api/careers')
    app.register_blueprint(assistant_bp, url_prefix='/api/assistant')
    app.register_blueprint(resume_bp, url_prefix='/api/resume')
    app.register_blueprint(jobs_bp, url_prefix='/api/jobs')
    app.register_blueprint(notifications_bp, url_prefix='/api/notifications')
    app.register_blueprint(roadmap_bp, url_prefix='/api/roadmap')

    # Ensure upload directory exists
    os.makedirs('uploads', exist_ok=True)

    # Initialize DB
    with app.app_context():
        init_db(app.config['DATABASE_PATH'])

    @app.route('/api/health')
    def health():
        return {'status': 'ok', 'message': 'CareerAI backend is running'}, 200

    return app


if __name__ == '__main__':
    app = create_app()
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=os.environ.get('FLASK_DEBUG', '1') == '1')
