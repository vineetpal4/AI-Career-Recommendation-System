"""
Learning Roadmap progress routes.
Provides persistent storage, toggling, and progress analytics for roadmap tasks.
Associated with authenticated users and career tracks.
"""
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import query_db, execute_db

roadmap_bp = Blueprint('roadmap', __name__)

# Known track task totals for accurate percentage computations
TRACK_TOTALS = {
    'Software Developer': 16,
    'Data Scientist': 14,
    'UX/UI Designer': 11,
}


@roadmap_bp.route('/progress', methods=['GET'])
@jwt_required()
def get_progress():
    """
    Returns saved roadmap progress for the authenticated user.
    Optionally filter by ?career=<career_title>.
    """
    user_id = int(get_jwt_identity())
    career_filter = request.args.get('career', '').strip()
    db_path = current_app.config['DATABASE_PATH']

    if career_filter:
        rows = query_db(
            db_path,
            '''SELECT task_id, career_title, phase, title, is_completed, completed_at
               FROM roadmap_tasks
               WHERE user_id = ? AND career_title = ?''',
            (user_id, career_filter)
        )
    else:
        rows = query_db(
            db_path,
            '''SELECT task_id, career_title, phase, title, is_completed, completed_at
               FROM roadmap_tasks
               WHERE user_id = ?''',
            (user_id,)
        )

    # Group completed task IDs by career
    completed_by_career = {}
    completed_task_ids = []
    
    for r in rows:
        c_title = r['career_title']
        t_id = r['task_id']
        is_done = bool(r['is_completed'])

        if c_title not in completed_by_career:
            completed_by_career[c_title] = []

        if is_done and t_id:
            completed_by_career[c_title].append(t_id)
            completed_task_ids.append(f"{c_title}_{t_id}")

    # Build per-career analytics
    analytics_by_career = {}
    for c_title, total_expected in TRACK_TOTALS.items():
        done_list = completed_by_career.get(c_title, [])
        done_count = len(done_list)
        pct = round((done_count / total_expected) * 100) if total_expected > 0 else 0
        analytics_by_career[c_title] = {
            'completed_count': done_count,
            'total_count': total_expected,
            'remaining_count': max(0, total_expected - done_count),
            'percentage': min(100, pct),
            'completed_tasks': done_list,
        }

    # Total across all tracks
    total_all_tasks = sum(TRACK_TOTALS.values())
    total_completed = sum(len(tasks) for tasks in completed_by_career.values())
    overall_percentage = round((total_completed / total_all_tasks) * 100) if total_all_tasks > 0 else 0

    return jsonify({
        'completed_by_career': completed_by_career,
        'completed_task_ids': completed_task_ids,
        'by_career': analytics_by_career,
        'overall': {
            'total_completed': total_completed,
            'total_tasks': total_all_tasks,
            'percentage': min(100, overall_percentage),
        }
    }), 200


@roadmap_bp.route('/toggle', methods=['POST'])
@jwt_required()
def toggle_task():
    """
    Toggles or sets the completion state of a specific roadmap task.
    Prevents duplicates using (user_id, career_title, task_id) unique constraint.
    """
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}

    career_title = (data.get('career_title') or '').strip()
    task_id = str(data.get('task_id') or '').strip()
    title = (data.get('title') or '').strip()
    phase = (data.get('phase') or '').strip()
    description = (data.get('description') or '').strip()
    week_range = (data.get('week_range') or '').strip()

    if not career_title or not task_id:
        return jsonify({'message': 'career_title and task_id are required'}), 400

    db_path = current_app.config['DATABASE_PATH']

    # If is_completed is explicitly provided, use it; otherwise invert existing state
    if 'is_completed' in data:
        new_state = 1 if data['is_completed'] else 0
    else:
        existing = query_db(
            db_path,
            'SELECT is_completed FROM roadmap_tasks WHERE user_id = ? AND career_title = ? AND task_id = ?',
            (user_id, career_title, task_id),
            one=True
        )
        if existing:
            new_state = 0 if existing['is_completed'] else 1
        else:
            new_state = 1

    # Safe UPSERT avoiding duplicates
    execute_db(
        db_path,
        '''INSERT INTO roadmap_tasks (user_id, career_title, task_id, title, phase, description, week_range, is_completed, completed_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, CASE WHEN ? = 1 THEN CURRENT_TIMESTAMP ELSE NULL END)
           ON CONFLICT(user_id, career_title, task_id) DO UPDATE SET
             is_completed = excluded.is_completed,
             completed_at = CASE WHEN excluded.is_completed = 1 THEN CURRENT_TIMESTAMP ELSE NULL END,
             title = CASE WHEN excluded.title != '' THEN excluded.title ELSE roadmap_tasks.title END,
             phase = CASE WHEN excluded.phase != '' THEN excluded.phase ELSE roadmap_tasks.phase END,
             description = CASE WHEN excluded.description != '' THEN excluded.description ELSE roadmap_tasks.description END,
             week_range = CASE WHEN excluded.week_range != '' THEN excluded.week_range ELSE roadmap_tasks.week_range END''',
        (user_id, career_title, task_id, title, phase, description, week_range, new_state, new_state)
    )

    # Compute updated counts for this career
    rows = query_db(
        db_path,
        'SELECT task_id FROM roadmap_tasks WHERE user_id = ? AND career_title = ? AND is_completed = 1',
        (user_id, career_title)
    )
    done_count = len(rows)
    total_count = TRACK_TOTALS.get(career_title, 16)
    percentage = round((done_count / total_count) * 100) if total_count > 0 else 0

    return jsonify({
        'message': 'Task status updated',
        'career_title': career_title,
        'task_id': task_id,
        'is_completed': bool(new_state),
        'stats': {
            'completed_count': done_count,
            'total_count': total_count,
            'remaining_count': max(0, total_count - done_count),
            'percentage': min(100, percentage),
        }
    }), 200


@roadmap_bp.route('/reset', methods=['POST'])
@jwt_required()
def reset_roadmap():
    """
    Allows user to reset a specific career roadmap track or all tracks.
    """
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}
    career_title = (data.get('career_title') or '').strip()
    db_path = current_app.config['DATABASE_PATH']

    if career_title and career_title.lower() != 'all':
        execute_db(
            db_path,
            'DELETE FROM roadmap_tasks WHERE user_id = ? AND career_title = ?',
            (user_id, career_title)
        )
        msg = f'Roadmap for {career_title} reset.'
    else:
        execute_db(
            db_path,
            'DELETE FROM roadmap_tasks WHERE user_id = ?',
            (user_id,)
        )
        msg = 'All roadmaps reset.'

    return jsonify({'message': msg}), 200
