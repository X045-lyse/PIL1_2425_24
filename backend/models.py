from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Utilisateur(db.Model):
    __tablename__ = 'utilisateur'
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100))
    prenom = db.Column(db.String(100))
    email = db.Column(db.String(100), unique=True)
    telephone = db.Column(db.String(20), unique=True)
    mot_de_passe = db.Column(db.String(128))
    role = db.Column(db.String(20))  # 'conducteur' ou 'passager'
    photo = db.Column(db.String(255), nullable=True)  # chemin vers la photo de profil
    point_depart = db.Column(db.String(255))
    horaire_depart = db.Column(db.Time)
    horaire_arrivee = db.Column(db.Time)
    vehicule_marque = db.Column(db.String(100), nullable=True)
    vehicule_modele = db.Column(db.String(100), nullable=True)
    vehicule_places = db.Column(db.Integer, nullable=True)

class Trajet(db.Model):
    __tablename__ = 'trajet'
    id = db.Column(db.Integer, primary_key=True)
    conducteur_id = db.Column(db.Integer, db.ForeignKey('utilisateur.id'))
    point_depart = db.Column(db.String(255))
    point_arrivee = db.Column(db.String(255))
    date = db.Column(db.Date)
    heure_depart = db.Column(db.Time)
    nb_places = db.Column(db.Integer)
    depart_lat = db.Column(db.Float)
    depart_lng = db.Column(db.Float)
    arrivee_lat = db.Column(db.Float)
    arrivee_lng = db.Column(db.Float)

class Demande(db.Model):
    __tablename__ = 'demande'
    id = db.Column(db.Integer, primary_key=True)
    passager_id = db.Column(db.Integer, db.ForeignKey('utilisateur.id'))
    point_depart = db.Column(db.String(255))
    point_arrivee = db.Column(db.String(255))
    date = db.Column(db.Date)
    heure_souhaitee = db.Column(db.Time)
    depart_lat = db.Column(db.Float)
    depart_lng = db.Column(db.Float)
    arrivee_lat = db.Column(db.Float)
    arrivee_lng = db.Column(db.Float)

class Matching(db.Model):
    __tablename__ = 'matching'
    id = db.Column(db.Integer, primary_key=True)
    trajet_id = db.Column(db.Integer, db.ForeignKey('trajet.id'))
    demande_id = db.Column(db.Integer, db.ForeignKey('demande.id'))
    status = db.Column(db.String(20))  # 'en attente', 'accepté', 'refusé'
    date_matching = db.Column(db.DateTime)

class Message(db.Model):
    __tablename__ = 'message'
    id = db.Column(db.Integer, primary_key=True)
    expediteur_id = db.Column(db.Integer, db.ForeignKey('utilisateur.id'))
    destinataire_id = db.Column(db.Integer, db.ForeignKey('utilisateur.id'))
    texte = db.Column(db.Text)
    horodatage = db.Column(db.DateTime)

class Reservation(db.Model):
    __tablename__ = 'reservation'
    id = db.Column(db.Integer, primary_key=True)
    passager_id = db.Column(db.Integer, db.ForeignKey('utilisateur.id'), nullable=False)
    trajet_id = db.Column(db.Integer, db.ForeignKey('trajet.id'), nullable=False)
    nombre_places = db.Column(db.Integer, nullable=False)