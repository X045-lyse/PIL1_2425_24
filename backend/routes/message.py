from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Message, Utilisateur
from datetime import datetime

message_bp = Blueprint('message', __name__)

@message_bp.route('/envoyer', methods=['POST'])
def envoyer_message():
    data = request.get_json()
    message = Message(
        expediteur_id=data['expediteur_id'],
        destinataire_id=data['destinataire_id'],
        texte=data['texte'],
        horodatage=datetime.utcnow()
    )
    db.session.add(message)
    db.session.commit()
    return jsonify({"message": "Message envoyé"}), 201

@message_bp.route('/conversation/<int:user1>/<int:user2>', methods=['GET'])
def get_conversation(user1, user2):
    messages = Message.query.filter(
        ((Message.expediteur_id == user1) & (Message.destinataire_id == user2)) |
        ((Message.expediteur_id == user2) & (Message.destinataire_id == user1))
    ).order_by(Message.horodatage).all()
    return jsonify([{
        "id": m.id,
        "expediteur_id": m.expediteur_id,
        "destinataire_id": m.destinataire_id,
        "texte": m.texte,
        "horodatage": m.horodatage.isoformat() if m.horodatage else None
    } for m in messages])

@message_bp.route('/conversations/<int:user_id>', methods=['GET'])
def get_conversations(user_id):
    # Récupère tous les utilisateurs avec qui user_id a échangé
    expediteurs = db.session.query(Message.destinataire_id).filter_by(expediteur_id=user_id)
    destinataires = db.session.query(Message.expediteur_id).filter_by(destinataire_id=user_id)
    user_ids = set([uid for (uid,) in expediteurs.union(destinataires).all() if uid != user_id])

    conversations = []
    for other_id in user_ids:
        last_msg = Message.query.filter(
            ((Message.expediteur_id == user_id) & (Message.destinataire_id == other_id)) |
            ((Message.expediteur_id == other_id) & (Message.destinataire_id == user_id))
        ).order_by(Message.horodatage.desc()).first()
        other_user = Utilisateur.query.get(other_id)
        conversations.append({
            "user_id": other_id,
            "nom": other_user.nom,
            "prenom": other_user.prenom,
            "photo": other_user.photo,
            "dernier_message": last_msg.texte if last_msg else "",
            "horodatage": last_msg.horodatage.isoformat() if last_msg else ""
        })
    return jsonify(conversations)

@message_bp.route('/utilisateur/<int:user_id>', methods=['GET'])
def get_utilisateur(user_id):
    user = Utilisateur.query.get(user_id)
    if not user:
        return jsonify({"message": "Utilisateur non trouvé"}), 404

    # Si user.photo est déjà une URL complète, on la garde, sinon on génère un avatar
    if user.photo and (user.photo.startswith("http://") or user.photo.startswith("https://")):
        photo_url = user.photo
    elif user.photo:
        # Si c'est un chemin local, adapte selon ton serveur (exemple ci-dessous)
        photo_url = f"http://localhost:5000/{user.photo.lstrip('/')}"
    else:
        # Avatar par défaut avec initiales
        initials = (user.prenom[0] if user.prenom else "") + (user.nom[0] if user.nom else "")
        photo_url = f"https://ui-avatars.com/api/?name={initials}&background=2563eb&color=fff"

    return jsonify({
        "id": user.id,
        "nom": user.nom,
        "prenom": user.prenom,
        "photo": photo_url
    })