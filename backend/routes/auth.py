from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, Utilisateur
import os
import jwt
from datetime import datetime, timedelta
import bcrypt
from utils import token_required, SECRET_KEY

auth_bp = Blueprint('auth', __name__)

UPLOAD_FOLDER = 'uploads/'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    nom = data.get('nom')
    prenom = data.get('prenom')
    email = data.get('email')
    telephone = data.get('telephone')
    mot_de_passe = data.get('mot_de_passe')
    role = data.get('role')
    photo = data.get('photo')  # facultatif
    point_depart = data.get('point_depart')
    horaire_depart = data.get('horaire_depart')  # format "HH:MM"
    horaire_arrivee = data.get('horaire_arrivee')  # format "HH:MM"
    vehicule_marque = data.get('vehicule_marque')
    vehicule_modele = data.get('vehicule_modele')
    vehicule_places = data.get('vehicule_places')

    if Utilisateur.query.filter((Utilisateur.email == email) | (Utilisateur.telephone == telephone)).first():
        return jsonify({"error": "Email ou téléphone déjà utilisé"}), 400

    hashed_password = bcrypt.hashpw(mot_de_passe.encode(), bcrypt.gensalt(rounds=10))
    utilisateur = Utilisateur(
        nom=nom,
        prenom=prenom,
        email=email,
        telephone=telephone,
        mot_de_passe=hashed_password,
        role=role,
        photo=photo,
        point_depart=point_depart,
        horaire_depart=datetime.strptime(horaire_depart, "%H:%M").time() if horaire_depart else None,
        horaire_arrivee=datetime.strptime(horaire_arrivee, "%H:%M").time() if horaire_arrivee else None,
        vehicule_marque=vehicule_marque,
        vehicule_modele=vehicule_modele,
        vehicule_places=vehicule_places
    )
    db.session.add(utilisateur)
    db.session.commit()
    return jsonify({"message": "Utilisateur enregistré avec succès."}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    identifiant = data.get('identifiant')
    mot_de_passe = data.get('mot_de_passe')
    utilisateur = Utilisateur.query.filter(
        (Utilisateur.email == identifiant)
    ).first()
    if utilisateur and bcrypt.checkpw(mot_de_passe.encode(), utilisateur.mot_de_passe.encode()):
        token = jwt.encode(
            {
                "user_id": utilisateur.id,
                "exp": datetime.utcnow() + timedelta(hours=24)
            },
            SECRET_KEY,
            algorithm="HS256"
        )
        return jsonify({"token": token}), 200
    return jsonify({"error": "Identifiants invalides"}), 401

@auth_bp.route('/update/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.get_json()
    utilisateur = Utilisateur.query.get(user_id)
    if not utilisateur:
        return jsonify({"error": "Utilisateur introuvable"}), 404

    # Mets à jour les champs si présents dans la requête
    for field in ['nom', 'prenom', 'email', 'telephone', 'role', 'photo', 'point_depart', 'horaire_depart', 'horaire_arrivee', 'vehicule_marque', 'vehicule_modele', 'vehicule_places']:
        if field in data:
            if field in ['horaire_depart', 'horaire_arrivee'] and data[field]:
                setattr(utilisateur, field, datetime.strptime(data[field], "%H:%M").time())
            else:
                setattr(utilisateur, field, data[field])
    db.session.commit()
    return jsonify({"message": "Profil mis à jour"}), 200

@auth_bp.route('/reset_password', methods=['POST'])
def reset_password():
    data = request.get_json()
    identifiant = data.get('identifiant')
    new_password = data.get('nouveau_mot_de_passe')
    utilisateur = Utilisateur.query.filter(
        (Utilisateur.email == identifiant) | (Utilisateur.telephone == identifiant)
    ).first()
    if not utilisateur:
        return jsonify({"error": "Utilisateur introuvable"}), 404
    utilisateur.mot_de_passe = generate_password_hash(new_password)
    db.session.commit()
    return jsonify({"message": "Mot de passe réinitialisé"}), 200

@auth_bp.route('/upload_photo/<int:user_id>', methods=['POST'])
def upload_photo(user_id):
    if 'photo' not in request.files:
        return jsonify({"error": "Aucun fichier envoyé"}), 400
    file = request.files['photo']
    if file and allowed_file(file.filename):
        filename = f"user_{user_id}_{file.filename}"
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)
        utilisateur = Utilisateur.query.get(user_id)
        utilisateur.photo = filepath
        db.session.commit()
        return jsonify({"message": "Photo uploadée"}), 200
    return jsonify({"error": "Format de fichier non autorisé"}), 400

@auth_bp.route('/changer_role/<int:user_id>', methods=['PUT'])
def changer_role(user_id):
    data = request.get_json()
    utilisateur = Utilisateur.query.get(user_id)
    if not utilisateur:
        return jsonify({"error": "Utilisateur introuvable"}), 404
    if 'role' not in data:
        return jsonify({"error": "Champ 'role' manquant"}), 400
    utilisateur.role = data['role']
    db.session.commit()
    return jsonify({"message": "Rôle modifié"}), 200

@auth_bp.route('/profil', methods=['GET'])
@token_required
def get_profil():
    token = None
    if 'Authorization' in request.headers:
        auth_header = request.headers['Authorization']
        if auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
        else:
            token = auth_header
    try:
        data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = data["user_id"]
    except Exception:
        return jsonify({"error": "Token invalide"}), 401

    utilisateur = Utilisateur.query.get(user_id)
    if not utilisateur:
        return jsonify({"error": "Utilisateur introuvable"}), 404

    return jsonify({
        "id": utilisateur.id,
        "nom": utilisateur.nom,
        "prenom": utilisateur.prenom,
        "email": utilisateur.email,
        "telephone": utilisateur.telephone,
        "role": utilisateur.role,
        "photo": utilisateur.photo,
        "point_depart": utilisateur.point_depart,
        "horaire_depart": utilisateur.horaire_depart.strftime("%H:%M") if utilisateur.horaire_depart else "",
        "horaire_arrivee": utilisateur.horaire_arrivee.strftime("%H:%M") if utilisateur.horaire_arrivee else "",
        "vehicule_marque": utilisateur.vehicule_marque,
        "vehicule_modele": utilisateur.vehicule_modele,
        "vehicule_places": utilisateur.vehicule_places
    })

@auth_bp.route('/profil', methods=['PUT'])
@token_required
def update_profil():
    token = None
    if 'Authorization' in request.headers:
        auth_header = request.headers['Authorization']
        if auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
        else:
            token = auth_header
    try:
        data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = data["user_id"]
    except Exception:
        return jsonify({"error": "Token invalide"}), 401

    utilisateur = Utilisateur.query.get(user_id)
    if not utilisateur:
        return jsonify({"error": "Utilisateur introuvable"}), 404

    champs = ['nom', 'prenom', 'email', 'telephone', 'role', 'photo', 'point_depart', 'horaire_depart', 'horaire_arrivee', 'vehicule_marque', 'vehicule_modele', 'vehicule_places', 'depart_lat', 'depart_lng']
    data = request.get_json()
    for field in champs:
        if field in data:
            if field in ['horaire_depart', 'horaire_arrivee'] and data[field]:
                setattr(utilisateur, field, datetime.strptime(data[field], "%H:%M").time())
            else:
                setattr(utilisateur, field, data[field])
    db.session.commit()
    return jsonify({"message": "Profil mis à jour"}), 200