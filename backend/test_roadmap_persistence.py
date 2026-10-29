"""
Test suite for Learning Roadmap Progress Persistence.
Validates:
- Persistent task storage per authenticated user and career track
- Correct percentage, completed count, and remaining count calculations
- Duplicate prevention via UNIQUE(user_id, career_title, task_id)
- User isolation (User A cannot see or mutate User B's progress)
- Retention across logout/login and application restart simulations
"""
import os
import sys

# Ensure backend directory is in path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from database import get_db

def run_roadmap_tests():
    print("[ROADMAP TEST SUITE] Starting verification...")
    app = create_app()
    client = app.test_client()
    passed = 0
    failed = 0

    def assert_test(name, condition, error_detail=""):
        nonlocal passed, failed
        if condition:
            print(f"  [PASS] {name}")
            passed += 1
        else:
            print(f"  [FAIL] {name}: {error_detail}")
            failed += 1

    # --- Setup Test Users ---
    pid = os.getpid()
    email_a = f"roadmap_user_a_{pid}@example.com"
    email_b = f"roadmap_user_b_{pid}@example.com"
    password = "TestPassword123!"

    # 1. Register User A
    res_a = client.post('/api/auth/signup', json={'name': 'User A', 'email': email_a, 'password': password})
    token_a = res_a.get_json().get('token')
    headers_a = {'Authorization': f'Bearer {token_a}'}
    assert_test("User A registered with JWT", bool(token_a))

    # 2. Register User B
    res_b = client.post('/api/auth/signup', json={'name': 'User B', 'email': email_b, 'password': password})
    token_b = res_b.get_json().get('token')
    headers_b = {'Authorization': f'Bearer {token_b}'}
    assert_test("User B registered with JWT", bool(token_b))

    # 3. Initial state for User A: 0 completed tasks
    init_res = client.get('/api/roadmap/progress', headers=headers_a)
    init_data = init_res.get_json()
    assert_test("User A initial progress is 0 completed", init_data['overall']['total_completed'] == 0)

    # 4. User A toggles Task 1 in Software Developer (sd-1)
    t1_res = client.post('/api/roadmap/toggle', headers=headers_a, json={
        'career_title': 'Software Developer',
        'task_id': 'sd-1',
        'title': 'Java / Python Fundamentals',
        'phase': 'Phase 1: Fundamentals',
        'is_completed': True,
    })
    assert_test("User A toggles sd-1 (completed: True)", t1_res.status_code == 200 and t1_res.get_json()['is_completed'] is True)
    assert_test("User A sd-1 stats show 1 completed / 16 total", t1_res.get_json()['stats']['completed_count'] == 1)

    # 5. User A toggles Task 2 in Software Developer (sd-2)
    t2_res = client.post('/api/roadmap/toggle', headers=headers_a, json={
        'career_title': 'Software Developer',
        'task_id': 'sd-2',
        'title': 'OOP Principles',
        'phase': 'Phase 1: Fundamentals',
        'is_completed': True,
    })
    assert_test("User A toggles sd-2 (completed: True)", t2_res.status_code == 200)

    # 6. Verify GET /api/roadmap/progress reflects persisted tasks
    prog_a = client.get('/api/roadmap/progress', headers=headers_a).get_json()
    sd_tasks = prog_a['completed_by_career'].get('Software Developer', [])
    assert_test("User A has exactly 2 completed SD tasks", len(sd_tasks) == 2 and 'sd-1' in sd_tasks and 'sd-2' in sd_tasks)
    sd_stats = prog_a['by_career']['Software Developer']
    assert_test("User A SD percentage is 12-13% (2/16)", sd_stats['percentage'] in (12, 13) and sd_stats['remaining_count'] == 14)

    # 7. Duplicate Prevention Test: Toggling sd-1 again with is_completed=True should NOT create duplicate
    dup_res = client.post('/api/roadmap/toggle', headers=headers_a, json={
        'career_title': 'Software Developer',
        'task_id': 'sd-1',
        'is_completed': True,
    })
    assert_test("Duplicate task toggle does not fail", dup_res.status_code == 200)
    prog_a2 = client.get('/api/roadmap/progress', headers=headers_a).get_json()
    sd_tasks2 = prog_a2['completed_by_career'].get('Software Developer', [])
    assert_test("Duplicate task toggle maintains exactly 2 completed tasks", len(sd_tasks2) == 2)

    # 8. User A toggles a task in a different track: Data Scientist (ds-1)
    ds_res = client.post('/api/roadmap/toggle', headers=headers_a, json={
        'career_title': 'Data Scientist',
        'task_id': 'ds-1',
        'title': 'Python for Data Science',
        'phase': 'Phase 1: Foundations',
        'is_completed': True,
    })
    assert_test("User A toggles ds-1 in Data Scientist track", ds_res.status_code == 200)

    prog_multi = client.get('/api/roadmap/progress', headers=headers_a).get_json()
    assert_test("Software Developer track still has 2 tasks", len(prog_multi['completed_by_career']['Software Developer']) == 2)
    assert_test("Data Scientist track has 1 task", len(prog_multi['completed_by_career']['Data Scientist']) == 1)
    assert_test("User A overall total is 3 tasks completed", prog_multi['overall']['total_completed'] == 3)

    # 9. User Isolation Check: User B's progress must be completely independent
    prog_b = client.get('/api/roadmap/progress', headers=headers_b).get_json()
    assert_test("User B has 0 completed tasks (User A progress isolated)", prog_b['overall']['total_completed'] == 0)

    # 10. Untoggle (unchecking) a task: User A marks sd-2 as incomplete
    untoggle_res = client.post('/api/roadmap/toggle', headers=headers_a, json={
        'career_title': 'Software Developer',
        'task_id': 'sd-2',
        'is_completed': False,
    })
    assert_test("User A marks sd-2 incomplete (is_completed: False)", untoggle_res.status_code == 200 and untoggle_res.get_json()['is_completed'] is False)

    prog_untoggle = client.get('/api/roadmap/progress', headers=headers_a).get_json()
    sd_after_untoggle = prog_untoggle['completed_by_career'].get('Software Developer', [])
    assert_test("User A SD tasks count decremented to 1", len(sd_after_untoggle) == 1 and 'sd-1' in sd_after_untoggle and 'sd-2' not in sd_after_untoggle)

    # 11. Logout / Login Simulation
    # Re-login User A and obtain a brand new token
    relogin_res = client.post('/api/auth/login', json={'email': email_a, 'password': password})
    new_token_a = relogin_res.get_json().get('token')
    new_headers_a = {'Authorization': f'Bearer {new_token_a}'}
    assert_test("User A fresh login token acquired", bool(new_token_a))

    relogin_prog = client.get('/api/roadmap/progress', headers=new_headers_a).get_json()
    assert_test("Progress preserved across logout/login: SD has 1, DS has 1", 
                len(relogin_prog['completed_by_career']['Software Developer']) == 1 and 
                len(relogin_prog['completed_by_career']['Data Scientist']) == 1)

    # 12. Application Restart Simulation
    # Re-initialize the Flask app & SQLite connection to simulate a server restart
    del app, client
    restarted_app = create_app()
    restarted_client = restarted_app.test_client()
    restart_prog = restarted_client.get('/api/roadmap/progress', headers=new_headers_a).get_json()
    assert_test("Progress preserved across full application restart from SQLite disk", 
                restart_prog['overall']['total_completed'] == 2 and 
                'sd-1' in restart_prog['completed_by_career']['Software Developer'] and 
                'ds-1' in restart_prog['completed_by_career']['Data Scientist'])

    print("\n" + "="*50)
    print(f"[ROADMAP TESTS COMPLETED] Passed: {passed} | Failed: {failed}")
    print("="*50)
    return failed == 0

if __name__ == '__main__':
    success = run_roadmap_tests()
    sys.exit(0 if success else 1)
