
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:protection@localhost/ifri_comotorage'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Utilisateur(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100), nullable=False)
    prenom = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    mot_de_passe = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # 'conducteur' ou 'passager'

class Vehicule(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    immatriculation = db.Column(db.String(50), unique=True, nullable=False)
    marque = db.Column(db.String(100), nullable=False)
    modele = db.Column(db.String(100), nullable=False)
    utilisateur_id = db.Column(db.Integer, db.ForeignKey('utilisateur.id'), nullable=False)

class Trajet(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    lieu_depart = db.Column(db.String(100), nullable=False)
    destination = db.Column(db.String(100), nullable=False)
    date = db.Column(db.Date, nullable=False)
    heure = db.Column(db.Time, nullable=False)
    vehicule_id = db.Column(db.Integer, db.ForeignKey('vehicule.id'), nullable=False)
    conducteur_id = db.Column(db.Integer, db.ForeignKey('utilisateur.id'), nullable=False)

class Reservation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    passager_id = db.Column(db.Integer, db.ForeignKey('utilisateur.id'), nullable=False)
    trajet_id = db.Column(db.Integer, db.ForeignKey('trajet.id'), nullable=False)
    nombre_places = db.Column(db.Integer, nullable=False)

class Paiement(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    reservation_id = db.Column(db.Integer, db.ForeignKey('reservation.id'), nullable=False)
    montant = db.Column(db.Float, nullable=False)
    statut = db.Column(db.String(50), nullable=False)

class Evaluation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    note = db.Column(db.Integer, nullable=False)  # de 1 à 5 étoiles
    commentaire = db.Column(db.String(255))
    conducteur_id = db.Column(db.Integer, db.ForeignKey('utilisateur.id'), nullable=False)
    passager_id = db.Column(db.Integer, db.ForeignKey('utilisateur.id'), nullable=False)

with app.app_context():
    db.create_all()

@app.route('/')
def index():
    return "Bienvenue sur IFRI_COMOTORAGE avec Flask & MySQL!"

if __name__ == '__main__':
    app.run(debug=True)
