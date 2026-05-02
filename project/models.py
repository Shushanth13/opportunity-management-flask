from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin

db = SQLAlchemy()

class Admin(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    opportunities = db.relationship('Opportunity', backref='creator', lazy=True)

class Opportunity(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)   # ← "name" not "title"
    duration = db.Column(db.String(100))
    start_date = db.Column(db.String(50))
    description = db.Column(db.Text)
    skills = db.Column(db.String(300))
    category = db.Column(db.String(100))
    future_opportunities = db.Column(db.String(200))
    max_applicants = db.Column(db.Integer)
    admin_id = db.Column(db.Integer, db.ForeignKey('admin.id'), nullable=False)