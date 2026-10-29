"""
Database initialization and helper functions for CareerAI.
Uses SQLite with WAL mode for better concurrent read performance.
"""
import sqlite3
import os


def get_db(db_path=None):
    """Get a database connection."""
    if db_path is None:
        db_path = os.environ.get('DATABASE_PATH', 'careerai.db')
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    conn.execute('PRAGMA journal_mode=WAL')
    conn.execute('PRAGMA foreign_keys=ON')
    return conn


def init_db(db_path='careerai.db'):
    """Initialize the database schema."""
    conn = get_db(db_path)
    cursor = conn.cursor()

    cursor.executescript("""
        -- Users table
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- User profiles (extended info)
        CREATE TABLE IF NOT EXISTS user_profiles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            education TEXT,
            college TEXT,
            experience TEXT,
            career_goal TEXT,
            location TEXT,
            skills TEXT,  -- JSON array stored as text
            interests TEXT,
            learning_preference TEXT,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Career assessments
        CREATE TABLE IF NOT EXISTS assessments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            answers TEXT NOT NULL,  -- JSON stored as text
            completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Career recommendations
        CREATE TABLE IF NOT EXISTS career_recommendations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            assessment_id INTEGER REFERENCES assessments(id) ON DELETE SET NULL,
            career_title TEXT NOT NULL,
            match_score INTEGER NOT NULL,
            field TEXT,
            explanation TEXT,
            matching_skills TEXT,  -- JSON
            skills_to_develop TEXT,  -- JSON
            next_steps TEXT,  -- JSON
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Saved careers
        CREATE TABLE IF NOT EXISTS saved_careers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            career_title TEXT NOT NULL,
            saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, career_title)
        );

        -- Roadmap tasks
        CREATE TABLE IF NOT EXISTS roadmap_tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            career_title TEXT NOT NULL,
            task_id TEXT NOT NULL,
            phase TEXT,
            title TEXT NOT NULL,
            description TEXT,
            week_range TEXT,
            is_completed INTEGER DEFAULT 0,
            completed_at TIMESTAMP,
            order_index INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, career_title, task_id)
        );

        -- Learning resources
        CREATE TABLE IF NOT EXISTS learning_resources (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            url TEXT,
            topic TEXT,
            career TEXT,
            skill_level TEXT,
            is_free INTEGER DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- User resource completions
        CREATE TABLE IF NOT EXISTS resource_completions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            resource_id INTEGER NOT NULL REFERENCES learning_resources(id) ON DELETE CASCADE,
            completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, resource_id)
        );

        -- Saved jobs
        CREATE TABLE IF NOT EXISTS saved_jobs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            job_id TEXT NOT NULL,
            role TEXT,
            company TEXT,
            location TEXT,
            job_type TEXT,
            status TEXT DEFAULT 'Saved',
            saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, job_id)
        );

        -- Resumes
        CREATE TABLE IF NOT EXISTS resumes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            name TEXT,
            content TEXT,  -- JSON of all resume fields
            template TEXT DEFAULT 'modern',
            file_path TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Interview practice sessions
        CREATE TABLE IF NOT EXISTS interview_sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            question_id INTEGER,
            category TEXT,
            difficulty TEXT,
            question_text TEXT,
            user_answer TEXT,
            feedback TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Chat history
        CREATE TABLE IF NOT EXISTS chat_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            role TEXT NOT NULL,
            content TEXT NOT NULL,
            is_rule_based INTEGER DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        -- Notifications
        CREATE TABLE IF NOT EXISTS notifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            title TEXT NOT NULL,
            message TEXT NOT NULL,
            type TEXT DEFAULT 'info',
            is_read INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)

    # Ensure task_id column exists if table was created in an earlier version
    cursor.execute('PRAGMA table_info(roadmap_tasks)')
    existing_cols = [c[1] for c in cursor.fetchall()]
    if 'task_id' not in existing_cols:
        cursor.execute('ALTER TABLE roadmap_tasks ADD COLUMN task_id TEXT')
    cursor.execute("""
        CREATE UNIQUE INDEX IF NOT EXISTS idx_roadmap_user_career_task
        ON roadmap_tasks(user_id, career_title, task_id)
    """)

    # Seed learning resources if empty
    cursor.execute('SELECT COUNT(*) FROM learning_resources')
    if cursor.fetchone()[0] == 0:
        seed_resources(cursor)

    conn.commit()
    conn.close()
    print(f'[CareerAI] Database initialized at {db_path}')


def seed_resources(cursor):
    """Insert sample learning resources."""
    resources = [
        ('Python for Everybody', 'Beginner Python programming course', 'https://www.coursera.org/specializations/python', 'Python', 'Data Scientist', 'Beginner', 1),
        ('The Odin Project', 'Full stack web development curriculum', 'https://www.theodinproject.com', 'Web Development', 'Software Developer', 'Beginner', 1),
        ('CS50x', 'Harvard introduction to computer science', 'https://cs50.harvard.edu/x/', 'Computer Science', 'Software Developer', 'Beginner', 1),
        ('LeetCode', 'Practice data structures and algorithm problems', 'https://leetcode.com', 'DSA', 'Software Developer', 'Intermediate', 1),
        ('freeCodeCamp', 'Free coding certifications covering HTML, CSS, JS, and more', 'https://www.freecodecamp.org', 'Web Development', 'Full Stack Developer', 'Beginner', 1),
        ('Kaggle Learn', 'Free micro-courses for data science and ML', 'https://www.kaggle.com/learn', 'Data Science', 'Data Scientist', 'Beginner', 1),
        ('React Documentation', 'Official React docs and tutorials', 'https://react.dev', 'React', 'Software Developer', 'Intermediate', 1),
        ('SQL Tutorial - W3Schools', 'Interactive SQL tutorial for beginners', 'https://www.w3schools.com/sql/', 'SQL', 'Data Analyst', 'Beginner', 1),
        ('Docker Getting Started', 'Official Docker beginner tutorial', 'https://docs.docker.com/get-started/', 'DevOps', 'DevOps Engineer', 'Beginner', 1),
        ('Figma Learn Design', 'Official Figma tutorials for beginners', 'https://www.figma.com/resources/learn-design/', 'UX Design', 'UX Designer', 'Beginner', 1),
    ]
    cursor.executemany(
        'INSERT INTO learning_resources (title, description, url, topic, career, skill_level, is_free) VALUES (?,?,?,?,?,?,?)',
        resources
    )


def query_db(db_path, query, args=(), one=False):
    """Execute a SELECT query and return results."""
    conn = get_db(db_path)
    cursor = conn.execute(query, args)
    rv = cursor.fetchall()
    conn.close()
    return (rv[0] if rv else None) if one else rv


def execute_db(db_path, query, args=()):
    """Execute an INSERT/UPDATE/DELETE query and return lastrowid."""
    conn = get_db(db_path)
    cursor = conn.execute(query, args)
    conn.commit()
    lastrowid = cursor.lastrowid
    conn.close()
    return lastrowid
