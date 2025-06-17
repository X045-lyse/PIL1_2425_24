from flask import Blueprint, request, jsonify
from models import db, Matching, Trajet, Demande
from datetime import datetime
from utils import haversine  # Place la fonction dans un fichier utils.py ou dans ce fichier

matching_bp = Blueprint('matching', __name__)

@matching_bp.route('/proposer', methods=['POST'])
def proposer_matching():
    data = request.get_json()
    trajet_id = data.get('trajet_id')
    demande_id = data.get('demande_id')
    if not trajet_id or not demande_id:
        return jsonify({"error": "trajet_id et demande_id requis"}), 400

    # Vérifie si le matching existe déjà
    existing = Matching.query.filter_by(trajet_id=trajet_id, demande_id=demande_id).first()
    if existing:
        return jsonify({"message": "Matching déjà existant", "id": existing.id}), 200

    matching = Matching(trajet_id=trajet_id, demande_id=demande_id, status="en attente")
    db.session.add(matching)
    db.session.commit()
    return jsonify({"message": "Matching créé", "id": matching.id}), 201

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

@matching_bp.route('/accepter/<int:matching_id>', methods=['PUT'])
def accepter_matching(matching_id):
    matching = Matching.query.get_or_404(matching_id)
    matching.status = 'accepté'
    db.session.commit()
    return jsonify({"message": "Matching accepté"})

@matching_bp.route('/contacts/<int:user_id>', methods=['GET'])
def get_contacts(user_id):
    matchings = Matching.query.filter_by(status='accepté').all()
    contacts = set()
    for m in matchings:
        # Récupère les deux utilisateurs liés par le matching
        conducteur_id = m.trajet.conducteur_id if m.trajet else None
        passager_id = m.demande.passager_id if m.demande else None
        if conducteur_id == user_id and passager_id:
            contacts.add(passager_id)
        elif passager_id == user_id and conducteur_id:
            contacts.add(conducteur_id)
    return jsonify(list(contacts))

@matching_bp.route('/utilisateur/<int:user_id>', methods=['GET'])
def matchings_utilisateur(user_id):
    matchings = Matching.query.join(Trajet).join(Demande).filter(
        ((Trajet.conducteur_id == user_id) | (Demande.passager_id == user_id))
    ).all()
    result = []
    for m in matchings:
        trajet = m.trajet
        demande = m.demande
        passager = getattr(demande, 'passager', None) if demande else None
        result.append({
            "id": m.id,
            "status": m.status,
            "trajet": {
                "point_depart": trajet.point_depart if trajet else "",
                "point_arrivee": trajet.point_arrivee if trajet else ""
            },
            "demandeur": {
                "prenom": passager.prenom if passager else "",
                "nom": passager.nom if passager else ""
            }
        })
    return jsonify(result)