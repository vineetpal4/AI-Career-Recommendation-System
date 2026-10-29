"""
Comprehensive End-to-End API Test Suite for CareerAI.
Validates all backend endpoints, error states, and database operations.
"""
import io
import json
import os
import sys

# Ensure backend directory is in path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from database import get_db

def run_tests():
    print("[TEST SUITE] Initializing CareerAI Flask test client...")
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

    # 1. Health Check
    res = client.get('/api/health')
    assert_test("Health endpoint responds 200", res.status_code == 200, f"Status: {res.status_code}")

    # 2. Database Schema Verification
    conn = get_db(app.config['DATABASE_PATH'])
    tables = [r[0] for r in conn.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall()]
    conn.close()
    expected_tables = ['users', 'user_profiles', 'assessments', 'career_recommendations', 'saved_careers', 'roadmap_tasks', 'learning_resources', 'saved_jobs', 'resumes', 'interview_sessions', 'chat_history', 'notifications']
    all_tables_present = all(t in tables for t in expected_tables)
    assert_test("Database schema: all 12 tables initialized", all_tables_present, f"Missing: {set(expected_tables) - set(tables)}")

    # 3. Auth: Signup
    test_email = f"tester_{os.getpid()}@example.com"
    signup_res = client.post('/api/auth/signup', json={
        'name': 'Alex Johnson',
        'email': test_email,
        'password': 'SecurePassword123!'
    })
    assert_test("Auth: Signup succeeds with 201", signup_res.status_code == 201, signup_res.get_data(as_text=True))
    token = signup_res.get_json().get('token')
    assert_test("Auth: JWT token issued on signup", bool(token))

    # 4. Auth: Duplicate Signup should fail
    dup_res = client.post('/api/auth/signup', json={
        'name': 'Alex Johnson',
        'email': test_email,
        'password': 'SecurePassword123!'
    })
    assert_test("Auth: Duplicate email signup rejected with 409", dup_res.status_code == 409)

    # 5. Auth: Login
    login_res = client.post('/api/auth/login', json={
        'email': test_email,
        'password': 'SecurePassword123!'
    })
    assert_test("Auth: Login succeeds with 200", login_res.status_code == 200)
    login_token = login_res.get_json().get('token')
    auth_headers = {'Authorization': f'Bearer {login_token}'}

    # 6. Auth: Wrong password rejected
    wrong_pass_res = client.post('/api/auth/login', json={
        'email': test_email,
        'password': 'WrongPassword!'
    })
    assert_test("Auth: Incorrect password rejected with 401", wrong_pass_res.status_code == 401)

    # 7. User Profile: Get & Update
    prof_get = client.get('/api/user/profile', headers=auth_headers)
    assert_test("User: Profile GET responds 200", prof_get.status_code == 200)

    prof_put = client.put('/api/user/profile', headers=auth_headers, json={
        'education': 'B.Tech Computer Science',
        'college': 'XYZ Institute of Technology',
        'experience': '0–1 years',
        'career_goal': 'Full Stack Software Engineer',
        'location': 'Bangalore, India',
        'skills': ['Python', 'JavaScript', 'React', 'SQL'],
        'interests': 'Web development, open source, cloud computing',
        'learning_preference': 'Hands-on projects and coding tutorials'
    })
    assert_test("User: Profile PUT update succeeds", prof_put.status_code == 200)

    prof_verify = client.get('/api/user/profile', headers=auth_headers)
    skills = prof_verify.get_json().get('skills', [])
    assert_test("User: Updated skills stored and retrievable", 'React' in skills)

    # 8. Career Assessment & Recommendations
    assessment_payload = {
        'answers': {
            '1': 'Building software and web applications',
            '2': 'Technology / IT',
            '3': 'Technical / engineering problems',
            '4': ['JavaScript', 'Python', 'React', 'Problem Solving'],
            '5': 'Fast-paced tech startup with modern tech stack',
            '6': '0–1 years',
            '7': 'Continuous learning and building impactful tech products'
        }
    }
    eval_res = client.post('/api/assessment/submit', headers=auth_headers, json=assessment_payload)
    assert_test("Assessment: Submission succeeds with 200", eval_res.status_code == 200)
    eval_data = eval_res.get_json()
    recs = eval_data.get('careers', [])
    assert_test("Assessment: Recommendation engine generates careers", len(recs) > 0)
    if recs:
        assert_test("Assessment: Top match has score & title", recs[0].get('match_score') > 0 and bool(recs[0].get('career_title')))

    # 9. Assessment Results Persistence
    results_res = client.get('/api/assessment/results', headers=auth_headers)
    assert_test("Assessment: Results GET responds with saved recommendations", results_res.status_code == 200 and len(results_res.get_json().get('careers', [])) > 0)

    # 10. Saved Careers API
    save_c_res = client.post('/api/careers/save', headers=auth_headers, json={'career_title': 'Software Developer'})
    assert_test("Careers: Save career responds 200", save_c_res.status_code == 200)

    saved_c_get = client.get('/api/careers/saved', headers=auth_headers)
    saved_list = [c.get('career_title') for c in saved_c_get.get_json()]
    assert_test("Careers: Saved career retrievable in list", 'Software Developer' in saved_list)

    del_c_res = client.delete('/api/careers/save/Software Developer', headers=auth_headers)
    assert_test("Careers: Remove saved career succeeds", del_c_res.status_code == 200)

    # 11. Jobs API
    jobs_list = client.get('/api/jobs?type=Full-time')
    assert_test("Jobs: Filtered listings respond 200", jobs_list.status_code == 200 and len(jobs_list.get_json().get('jobs', [])) > 0)

    save_j_res = client.post('/api/jobs/save', headers=auth_headers, json={
        'job_id': 'job-1',
        'role': 'Frontend Developer',
        'company': 'TechCorp Solutions',
        'location': 'Bangalore',
        'job_type': 'Full-time',
        'status': 'Applied'
    })
    assert_test("Jobs: Save / apply job succeeds", save_j_res.status_code == 200)

    saved_j_get = client.get('/api/jobs/saved', headers=auth_headers)
    assert_test("Jobs: Get saved jobs list succeeds", saved_j_get.status_code == 200 and len(saved_j_get.get_json()) > 0)

    status_update_res = client.put('/api/jobs/status', headers=auth_headers, json={
        'job_id': 'job-1',
        'status': 'Interview'
    })
    assert_test("Jobs: Update status to Interview succeeds", status_update_res.status_code == 200)

    # 12. Resume Studio API
    resume_save = client.post('/api/resume/save', headers=auth_headers, json={
        'name': 'Software Dev Resume',
        'template': 'modern',
        'content': {'summary': 'Passionate coder', 'skills': 'Python, React'}
    })
    assert_test("Resume: Save resume responds 200", resume_save.status_code == 200)

    resume_get = client.get('/api/resume', headers=auth_headers)
    assert_test("Resume: Get resumes list succeeds", resume_get.status_code == 200 and len(resume_get.get_json()) > 0)

    # 13. Resume ATS Analyser
    sample_resume_text = """
    Alex Johnson - Software Engineer
    Contact: alex@example.com | 9876543210 | Bangalore | linkedin.com/in/alex
    Professional Summary:
    Dedicated full stack developer with experience in Python and React. Built high-scale applications.
    Work Experience:
    Software Developer Intern at TechCorp. Developed REST APIs, designed responsive UI components.
    Education:
    B.Tech Computer Science from XYZ Institute.
    Technical Skills:
    Python, JavaScript, React, SQL, Git, Docker.
    Projects:
    CareerAI Platform - Built full-stack career guidance tool with Flask and React.
    Certifications:
    AWS Certified Cloud Practitioner.
    """
    analyze_res = client.post('/api/resume/analyze', json={'text': sample_resume_text})
    assert_test("Resume Analyser: Text parsing responds 200", analyze_res.status_code == 200)
    ats_score = analyze_res.get_json().get('score', 0)
    assert_test("Resume Analyser: Computed ATS quality score > 60", ats_score >= 60, f"Score: {ats_score}")

    # 14. Resume PDF Generation (ReportLab)
    pdf_res = client.post('/api/resume/download-pdf', json={
        'name': 'Alex Johnson',
        'email': 'alex@example.com',
        'phone': '+91 9876543210',
        'location': 'Bangalore, India',
        'summary': 'Dedicated full stack developer.',
        'education': 'B.Tech Computer Science',
        'skills': 'Python, JavaScript, React, SQL',
        'experience': 'Frontend Developer at XYZ',
        'projects': 'CareerAI - Career platform',
        'certifications': 'AWS Cloud Practitioner',
        'template': 'modern'
    })
    assert_test("Resume: PDF download responds 200", pdf_res.status_code == 200)
    assert_test("Resume: Content-Type is application/pdf", pdf_res.headers.get('Content-Type') == 'application/pdf')
    assert_test("Resume: Binary PDF starts with '%PDF-'", pdf_res.data.startswith(b'%PDF-'))

    # 15. AI Career Assistant Chat
    chat_res = client.post('/api/assistant/chat', headers=auth_headers, json={
        'message': 'How do I start preparing for a Software Developer role?'
    })
    assert_test("Assistant: Chat responds with 200", chat_res.status_code == 200)
    chat_reply = chat_res.get_json().get('reply', '')
    assert_test("Assistant: Provides thoughtful reply", len(chat_reply) > 20)

    # 16. Notifications API
    notif_create = client.post('/api/notifications', headers=auth_headers, json={
        'title': 'Milestone Achieved!',
        'message': 'You completed Phase 1 of your roadmap.',
        'type': 'success'
    })
    assert_test("Notifications: Create notification responds 201", notif_create.status_code == 201)
    notif_id = notif_create.get_json().get('id')

    notif_get = client.get('/api/notifications', headers=auth_headers)
    assert_test("Notifications: List notifications responds 200", notif_get.status_code == 200 and len(notif_get.get_json()) > 0)

    notif_read = client.put(f'/api/notifications/{notif_id}/read', headers=auth_headers)
    assert_test("Notifications: Mark single read responds 200", notif_read.status_code == 200)

    notif_read_all = client.put('/api/notifications/read-all', headers=auth_headers)
    assert_test("Notifications: Mark all read responds 200", notif_read_all.status_code == 200)

    print("\n" + "="*50)
    print(f"[TEST SUITE COMPLETED] Passed: {passed} | Failed: {failed}")
    print("="*50)
    return failed == 0

if __name__ == '__main__':
    success = run_tests()
    sys.exit(0 if success else 1)
