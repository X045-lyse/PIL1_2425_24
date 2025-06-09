from flask import Flask
from routes.auth import auth_bp  # 👈 importer ton blueprint
from models import db

app = Flask(__name__)

# Configuration SQLite locale
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///comotorage.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialiser SQLAlchemy avec Flask
db.init_app(app)

# 👇 ENREGISTRER LE BLUEPRINT avec le préfixe /api
app.register_blueprint(auth_bp, url_prefix='/api')

@app.route('/')
def home():
    return "IFRI_comotorage - Backend opérationnel !"

if __name__ == '__main__':
    app.run(debug=True)
