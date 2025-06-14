from flask import Blueprint, request, jsonify
from models import db, Message
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