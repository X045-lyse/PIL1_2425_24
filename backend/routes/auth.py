from flask import Blueprint, request, jsonify
from models import db, Utilisateur
from datetime import time

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    nom = data.get('nom')
    prenom = data.get('prenom')
    email = data.get('email')
    telephone = data.get('telephone')
    mot_de_passe = data.get('mot_de_passe')
    role = data.get('role')
    point_depart = data.get('point_depart')
    horaire = data.get('horaire')  # format attendu : "08:30"
    vehicule = data.get('vehicule')

    # Vérifier que les champs obligatoires sont là
    if not all([nom, prenom, email, telephone, mot_de_passe, role]):
        return jsonify({"error": "Champs obligatoires manquants"}), 400

    # Convertir l'horaire (texte) en objet time
    try:
        h, m = map(int, horaire.split(':'))
        horaire_obj = time(hour=h, minute=m)
    except:
        return jsonify({"error": "Format d'horaire invalide (attendu HH:MM)"}), 400

    # Créer l'utilisateur
    utilisateur = Utilisateur(
        nom=nom,
        prenom=prenom,
        email=email,
        telephone=telephone,
        mot_de_passe=mot_de_passe,
        role=role,
        point_depart=point_depart,
        horaire=horaire_obj,
        vehicule=vehicule
    )

    db.session.add(utilisateur)
    db.session.commit()

    return jsonify({"message": "Utilisateur enregistré avec succès."}), 201

