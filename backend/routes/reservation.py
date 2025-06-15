from flask import Blueprint, request, jsonify
from models import db, Reservation

reservation_bp = Blueprint('reservation', __name__)

@reservation_bp.route('/ajouter', methods=['POST'])
def ajouter_reservation():
    data = request.get_json()
    required = ['passager_id', 'trajet_id', 'nombre_places']
    for field in required:
        if field not in data:
            return jsonify({"error": f"Champ manquant : {field}"}), 400
    reservation = Reservation(
        passager_id=data['passager_id'],
        trajet_id=data['trajet_id'],
        nombre_places=data['nombre_places']
    )
    db.session.add(reservation)
    db.session.commit()
    return jsonify({"message": "Réservation ajoutée"}), 201