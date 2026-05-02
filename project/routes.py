from flask import Blueprint, request, jsonify, render_template
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from itsdangerous import URLSafeTimedSerializer
from models import db, Admin, Opportunity
import re

bp = Blueprint('main', __name__) 

ALLOWED_CATEGORIES = ['Education', 'Technology', 'Healthcare', 'Environment', 'Arts', 'Community']
@bp.route('/api/check-auth', methods=['GET'])
def check_auth():
    if current_user.is_authenticated:
        return jsonify({"authenticated": True, "email": current_user.email}), 200
    return jsonify({"authenticated": False}), 200

# ─── AUTH ───────────────────────────────────────────────────

@bp.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    full_name = data.get('full_name', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    confirm_password = data.get('confirm_password', '')

    if not all([full_name, email, password, confirm_password]):
        return jsonify({"error": "All fields are required"}), 400
    if not re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', email):
        return jsonify({"error": "Invalid email address"}), 400
    if len(password) < 8:
        return jsonify({"error": "Password must be at least 8 characters"}), 400
    if password != confirm_password:
        return jsonify({"error": "Passwords do not match"}), 400
    if Admin.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 409

    new_admin = Admin(
        full_name=full_name,
        email=email,
        password_hash=generate_password_hash(password)
    )
    db.session.add(new_admin)
    db.session.commit()
    return jsonify({"message": "Account created successfully"}), 201


@bp.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    remember = data.get('remember', False)

    user = Admin.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"error": "Invalid email or password"}), 401

    login_user(user, remember=remember)
    return jsonify({"message": "Login successful", "user": {"id": user.id, "full_name": user.full_name}}), 200


@bp.route('/api/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logged out successfully"}), 200


@bp.route('/api/forgot-password', methods=['POST'])
def forgot_password():
    from flask import current_app
    data = request.get_json()
    email = data.get('email', '').strip().lower()

    user = Admin.query.filter_by(email=email).first()
    if user:
        s = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
        token = s.dumps(email, salt='password-reset-salt')
        reset_link = f"http://localhost:5000/api/reset-password/{token}"
        print(f"\n[PASSWORD RESET LINK for {email}]:\n{reset_link}\n")

    return jsonify({"message": "If this email is registered, a reset link has been sent."}), 200


@bp.route('/api/reset-password/<token>', methods=['POST'])
def reset_password(token):
    from flask import current_app
    s = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    try:
        email = s.loads(token, salt='password-reset-salt', max_age=3600)
    except Exception:
        return jsonify({"error": "Token is invalid or has expired"}), 400

    data = request.get_json()
    new_password = data.get('password', '')
    if len(new_password) < 8:
        return jsonify({"error": "Password must be at least 8 characters"}), 400

    user = Admin.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    user.password_hash = generate_password_hash(new_password)
    db.session.commit()
    return jsonify({"message": "Password reset successful"}), 200


# ─── OPPORTUNITIES ───────────────────────────────────────────

@bp.route('/api/opportunities', methods=['GET'])
@login_required
def get_opportunities():
    opps = Opportunity.query.filter_by(admin_id=current_user.id).all()
    return jsonify({"status": "success", "data": [{
        'id': o.id, 'name': o.name, 'duration': o.duration,
        'start_date': o.start_date, 'description': o.description,
        'skills': o.skills, 'category': o.category,
        'future_opportunities': o.future_opportunities,
        'max_applicants': o.max_applicants
    } for o in opps]}), 200


@bp.route('/api/opportunities', methods=['POST'])
@login_required
def create_opportunity():
    data = request.get_json()
    name = data.get('name', '').strip()
    category = data.get('category', '').strip()

    if not name:
        return jsonify({"error": "Opportunity name is required"}), 400
    if category not in ALLOWED_CATEGORIES:
        return jsonify({"error": f"Category must be one of: {', '.join(ALLOWED_CATEGORIES)}"}), 400

    opp = Opportunity(
        name=name,
        duration=data.get('duration'),
        start_date=data.get('start_date'),
        description=data.get('description'),
        skills=data.get('skills'),
        category=category,
        future_opportunities=data.get('future_opportunities', False),
        max_applicants=data.get('max_applicants'),
        admin_id=current_user.id
    )
    db.session.add(opp)
    db.session.commit()
    return jsonify({"status": "success", "data": {"id": opp.id, "name": opp.name}}), 201


@bp.route('/api/opportunities/<int:opp_id>', methods=['GET'])
@login_required
def get_opportunity(opp_id):
    opp = Opportunity.query.filter_by(id=opp_id, admin_id=current_user.id).first()
    if not opp:
        return jsonify({"error": "Opportunity not found"}), 404
    return jsonify({"status": "success", "data": {
        'id': opp.id, 'name': opp.name, 'duration': opp.duration,
        'start_date': opp.start_date, 'description': opp.description,
        'skills': opp.skills, 'category': opp.category,
        'future_opportunities': opp.future_opportunities,
        'max_applicants': opp.max_applicants
    }}), 200


@bp.route('/api/opportunities/<int:opp_id>', methods=['PUT'])
@login_required
def update_opportunity(opp_id):
    opp = Opportunity.query.filter_by(id=opp_id, admin_id=current_user.id).first()
    if not opp:
        return jsonify({"error": "Opportunity not found"}), 404

    data = request.get_json()
    opp.name = data.get('name', opp.name)
    opp.duration = data.get('duration', opp.duration)
    opp.start_date = data.get('start_date', opp.start_date)
    opp.description = data.get('description', opp.description)
    opp.skills = data.get('skills', opp.skills)
    opp.category = data.get('category', opp.category)
    opp.future_opportunities = data.get('future_opportunities', opp.future_opportunities)
    opp.max_applicants = data.get('max_applicants', opp.max_applicants)
    db.session.commit()
    return jsonify({"status": "success", "message": "Opportunity updated"}), 200


@bp.route('/api/opportunities/<int:opp_id>', methods=['DELETE'])
@login_required
def delete_opportunity(opp_id):
    opp = Opportunity.query.filter_by(id=opp_id, admin_id=current_user.id).first()
    if not opp:
        return jsonify({"error": "Opportunity not found"}), 404

    db.session.delete(opp)
    db.session.commit()
    return jsonify({"status": "success", "message": "Opportunity deleted"}), 200