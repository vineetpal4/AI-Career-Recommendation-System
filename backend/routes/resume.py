"""
Resume builder, analyser, and PDF generation routes.
Uses ReportLab for PDF generation and PyPDF2 for parsing uploaded resumes.
"""
import io
import json
import os
import re
from flask import Blueprint, request, jsonify, send_file, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from database import query_db, execute_db

resume_bp = Blueprint('resume', __name__)

ALLOWED_EXTENSIONS = {'pdf', 'txt'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@resume_bp.route('', methods=['GET'])
@jwt_required()
def get_resumes():
    user_id = int(get_jwt_identity())
    db_path = current_app.config['DATABASE_PATH']
    rows = query_db(db_path, 'SELECT id, name, template, content, created_at, updated_at FROM resumes WHERE user_id = ? ORDER BY updated_at DESC', (user_id,))
    resumes = []
    for r in rows:
        item = dict(r)
        if item.get('content'):
            try:
                item['content'] = json.loads(item['content'])
            except Exception:
                pass
        resumes.append(item)
    return jsonify(resumes), 200


@resume_bp.route('/save', methods=['POST'])
@jwt_required()
def save_resume():
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}
    name = (data.get('name') or 'My Resume').strip()
    template = data.get('template', 'modern')
    content = data.get('content', {})
    resume_id = data.get('id')

    db_path = current_app.config['DATABASE_PATH']
    content_str = json.dumps(content) if isinstance(content, (dict, list)) else str(content)

    if resume_id:
        execute_db(
            db_path,
            'UPDATE resumes SET name = ?, template = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?',
            (name, template, content_str, resume_id, user_id)
        )
        saved_id = resume_id
    else:
        saved_id = execute_db(
            db_path,
            'INSERT INTO resumes (user_id, name, template, content) VALUES (?, ?, ?, ?)',
            (user_id, name, template, content_str)
        )

    return jsonify({'message': 'Resume saved successfully', 'id': saved_id}), 200


@resume_bp.route('/<int:resume_id>', methods=['DELETE'])
@jwt_required()
def delete_resume(resume_id):
    user_id = int(get_jwt_identity())
    db_path = current_app.config['DATABASE_PATH']
    execute_db(db_path, 'DELETE FROM resumes WHERE id = ? AND user_id = ?', (resume_id, user_id))
    return jsonify({'message': 'Resume deleted'}), 200


@resume_bp.route('/analyze', methods=['POST'])
def analyze_resume():
    """
    Analyzes an uploaded PDF resume or text payload.
    Extracts text, checks for standard sections, calculates ATS compatibility score,
    and returns missing items and improvement tips.
    """
    text_content = ""

    if 'file' in request.files:
        file = request.files['file']
        if file and file.filename != '':
            if not allowed_file(file.filename):
                return jsonify({'message': 'Only PDF or TXT files are supported'}), 400
            
            filename = secure_filename(file.filename)
            if filename.lower().endswith('.pdf'):
                try:
                    import PyPDF2
                    pdf_reader = PyPDF2.PdfReader(file.stream)
                    for page in pdf_reader.pages:
                        extracted = page.extract_text()
                        if extracted:
                            text_content += extracted + "\n"
                except Exception as e:
                    return jsonify({'message': f'Failed to parse PDF: {str(e)}'}), 400
            else:
                text_content = file.read().decode('utf-8', errors='ignore')
    else:
        data = request.get_json(silent=True) or {}
        text_content = data.get('text', '')

    if not text_content or len(text_content.strip()) < 30:
        return jsonify({'message': 'Could not extract enough text from resume. Please check file format.'}), 400

    lower_text = text_content.lower()

    sections_to_check = {
        'Contact Info': [r'\b(email|phone|mobile|github|linkedin|contact)\b'],
        'Professional Summary': [r'\b(summary|objective|profile|about me)\b'],
        'Work Experience': [r'\b(experience|employment|work history|internship)\b'],
        'Education': [r'\b(education|degree|university|college|b\.?tech|b\.?e|bca|mca|bachelor|master)\b'],
        'Skills': [r'\b(skills|technical skills|technologies|tools|competencies)\b'],
        'Projects': [r'\b(projects|academic projects|personal projects)\b'],
        'Certifications': [r'\b(certifications|certificates|licenses|courses)\b'],
    }

    found = []
    missing = []
    for section, patterns in sections_to_check.items():
        is_found = False
        for pat in patterns:
            if re.search(pat, lower_text):
                is_found = True
                break
        if is_found:
            found.append(section)
        else:
            missing.append(section)

    # ATS Scoring Calculation
    score = 40  # base
    if 'Contact Info' in found: score += 10
    if 'Work Experience' in found: score += 15
    if 'Education' in found: score += 10
    if 'Skills' in found: score += 15
    if 'Projects' in found: score += 10
    if 'Professional Summary' in found: score += 5
    if 'Certifications' in found: score += 5

    # Check for action verbs
    action_verbs = ['built', 'developed', 'designed', 'implemented', 'led', 'managed', 'created', 'optimized', 'engineered', 'spearheaded']
    verbs_count = sum(1 for verb in action_verbs if verb in lower_text)
    if verbs_count >= 3:
        score += 5

    # Cap score at 98 (leave room for human perfection)
    score = min(max(score, 35), 98)

    suggestions = []
    if 'Professional Summary' in missing:
        suggestions.append('Add a 2–3 sentence professional summary highlighting your career target and key strengths.')
    if 'Projects' in missing:
        suggestions.append('Include 2–3 practical projects with tech stack and live demo or GitHub links.')
    if 'Certifications' in missing:
        suggestions.append('Add recognized certifications or relevant online courses (Coursera, Udemy, AWS, etc.).')
    if verbs_count < 3:
        suggestions.append('Begin bullet points with strong action verbs (e.g., "Architected", "Engineered", "Reduced latency by 30%").')
    suggestions.append('Ensure quantifiable metrics are present (e.g., "Improved response time by 25%", "Handled 10k+ daily users").')
    suggestions.append('Keep fonts standard and maintain a single-column ATS-friendly layout.')

    return jsonify({
        'score': score,
        'found': found,
        'missing': missing,
        'suggestions': suggestions,
        'word_count': len(text_content.split()),
        'disclaimer': 'Rule-based ATS resume analysis for guidance and formatting estimation.'
    }), 200


@resume_bp.route('/download-pdf', methods=['POST'])
def generate_pdf():
    """
    Generates and returns an ATS-friendly PDF using ReportLab.
    """
    try:
        from reportlab.lib.pagesizes import letter
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.lib import colors

        data = request.get_json() or {}
        name = data.get('name', 'Applicant Name')
        email = data.get('email', '')
        phone = data.get('phone', '')
        location = data.get('location', '')
        linkedin = data.get('linkedin', '')
        summary = data.get('summary', '')
        education = data.get('education', '')
        skills = data.get('skills', '')
        projects = data.get('projects', '')
        experience = data.get('experience', '')
        certifications = data.get('certifications', '')
        template = data.get('template', 'modern')

        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=40, leftMargin=40,
            topMargin=40, bottomMargin=40
        )

        styles = getSampleStyleSheet()

        # Custom Palette based on template
        primary_color = colors.HexColor('#6366F1') if template == 'modern' else (colors.HexColor('#1E293B') if template == 'classic' else colors.HexColor('#EC4899'))
        text_color = colors.HexColor('#1E293B')
        muted_color = colors.HexColor('#64748B')

        title_style = ParagraphStyle(
            'ResumeTitle',
            parent=styles['Heading1'],
            fontName='Helvetica-Bold',
            fontSize=22,
            leading=26,
            textColor=primary_color,
            spaceAfter=4,
        )

        contact_style = ParagraphStyle(
            'ResumeContact',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=9,
            leading=12,
            textColor=muted_color,
            spaceAfter=12,
        )

        section_heading = ParagraphStyle(
            'ResumeSectionHeading',
            parent=styles['Heading2'],
            fontName='Helvetica-Bold',
            fontSize=12,
            leading=16,
            textColor=primary_color,
            spaceBefore=10,
            spaceAfter=4,
        )

        body_style = ParagraphStyle(
            'ResumeBody',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=10,
            leading=14,
            textColor=text_color,
            spaceAfter=8,
        )

        story = []

        # Name & Contact header
        story.append(Paragraph(name, title_style))
        contact_parts = [p for p in [email, phone, location, linkedin] if p]
        story.append(Paragraph('  •  '.join(contact_parts), contact_style))
        story.append(HRFlowable(width="100%", thickness=1, color=primary_color, spaceBefore=0, spaceAfter=10))

        def add_section(heading, text):
            if text and text.strip():
                story.append(Paragraph(heading.upper(), section_heading))
                story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#E2E8F0'), spaceBefore=2, spaceAfter=6))
                for line in text.split('\n'):
                    if line.strip():
                        story.append(Paragraph(line.strip(), body_style))
                story.append(Spacer(1, 4))

        add_section('Professional Summary', summary)
        add_section('Education', education)
        add_section('Technical Skills', skills)
        add_section('Work Experience', experience)
        add_section('Projects', projects)
        add_section('Certifications & Achievements', certifications)

        doc.build(story)
        buffer.seek(0)

        filename = f"{re.sub(r'[^a-zA-Z0-9_-]', '_', name)}_Resume.pdf"
        return send_file(
            buffer,
            as_attachment=True,
            download_name=filename,
            mimetype='application/pdf'
        )

    except Exception as e:
        return jsonify({'message': f'Failed to generate PDF: {str(e)}'}), 500
