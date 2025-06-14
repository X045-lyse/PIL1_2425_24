from flask import Blueprint, request, jsonify
from models import db, Matching, Trajet, Demande
from datetime import datetime
from utils import haversine  # Place la fonction dans un fichier utils.py ou dans ce fichier

matching_bp = Blueprint('matching', __name__)

@matching_bp.route('/proposer', methods=['POST'])
def proposer_matching():
    data = request.get_json()

    # Vérification des champs obligatoires
    if not data or 'trajet_id' not in data or 'demande_id' not in data:
        return jsonify({"error": "trajet_id et demande_id sont obligatoires"}), 400

    trajet = Trajet.query.get(data['trajet_id'])
    demande = Demande.query.get(data['demande_id'])

    if not trajet or not demande:
        return jsonify({"error": "Trajet ou demande introuvable"}), 404

    # Vérification des coordonnées GPS
    for attr in ['depart_lat', 'depart_lng', 'arrivee_lat', 'arrivee_lng']:
        if getattr(trajet, attr) is None or getattr(demande, attr) is None:
            return jsonify({"error": f"Coordonnée manquante ({attr})"}), 400

    # Distance entre points de départ
    dist_depart = haversine(trajet.depart_lat, trajet.depart_lng, demande.depart_lat, demande.depart_lng)
    dist_arrivee = haversine(trajet.arrivee_lat, trajet.arrivee_lng, demande.arrivee_lat, demande.arrivee_lng)
    rayon = 1.0

    if dist_depart > rayon or dist_arrivee > rayon:
        return jsonify({"error": "Les points de départ ou d'arrivée sont trop éloignés"}), 400

    # Vérifie la compatibilité horaire (±15 min)
    try:
        diff = abs(
            (datetime.combine(trajet.date, trajet.heure_depart) -
             datetime.combine(demande.date, demande.heure_souhaitee)).total_seconds()
        )
    except Exception as e:
        return jsonify({"error": "Erreur sur les horaires : " + str(e)}), 400

    if diff > 15 * 60:
        return jsonify({"error": "Horaires incompatibles"}), 400

    # Matching déjà existant ?
    if Matching.query.filter_by(trajet_id=trajet.id, demande_id=demande.id).first():
        return jsonify({"error": "Matching déjà existant"}), 409

    matching = Matching(
        trajet_id=trajet.id,
        demande_id=demande.id,
        status='en attente'
    )
    db.session.add(matching)
    db.session.commit()
    return jsonify({"message": "Matching proposé"}), 201

@matching_bp.route('/', methods=['GET'])
def lister_matchings():
    matchings = Matching.query.all()
    return jsonify([
        {
            "id": m.id,
            "trajet_id": m.trajet_id,
            "demande_id": m.demande_id,
            "status": m.status,
            "date_matching": m.date_matching.isoformat() if m.date_matching else None
        } for m in matchings
    ])