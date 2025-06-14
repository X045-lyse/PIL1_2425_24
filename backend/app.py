from flask import Flask, jsonify
from flask_cors import CORS
from models import db
from routes.auth import auth_bp
from routes.trajet import trajet_bp
from routes.demande import demande_bp
from routes.matching import matching_bp
from routes.message import message_bp
from routes.reservation import reservation_bp

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://ifriuser:motdepassefort@localhost/covoiturage'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
CORS(
    app,
    supports_credentials=True,
    origins=[
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        "http://localhost:5000",
        "http://127.0.0.1:5000"
    ]
)

db.init_app(app)

# Enregistrement des blueprints
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(trajet_bp, url_prefix='/trajet')
app.register_blueprint(demande_bp, url_prefix='/demande')
app.register_blueprint(matching_bp, url_prefix='/matching')
app.register_blueprint(message_bp, url_prefix='/message')
app.register_blueprint(reservation_bp, url_prefix='/reservation')


@app.route('/ping')
def ping():
    return "pong"


@app.route('/')
def home():
    return "Bienvenue sur l'API de covoiturage !"


@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Ressource non trouvée"}), 404


@app.errorhandler(500)
def server_error(e):
    return jsonify({"error": "Erreur interne du serveur"}), 500


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)