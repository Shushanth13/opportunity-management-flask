from flask import Flask, render_template
from config import Config
from models import db
from flask_login import LoginManager
from models import Admin

app = Flask(__name__, template_folder='templates', static_folder='static')
app.config.from_object(Config)

db.init_app(app)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'main.login'
login_manager.session_protection = 'strong'

@login_manager.user_loader
def load_user(user_id):
    return db.session.get(Admin, int(user_id))

@app.route('/')
def index():
    return render_template('admin.html')

from routes import bp
app.register_blueprint(bp)

with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)