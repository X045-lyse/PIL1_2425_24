from flask import Blueprint, request, jsonify
from models import db, Trajet
from datetime import datetime
from utils import token_required

trajet_bp = Blueprint('trajet', __name__)

@trajet_bp.route('/ajouter', methods=['POST'])
@token_required
def ajouter_trajet():
    data = request.get_json()
    # Conversion des champs date et heure
    date_obj = datetime.strptime(data['date'], "%Y-%m-%d").date()
    heure_obj = datetime.strptime(data['heure_depart'], "%H:%M").time()
    trajet = Trajet(
        conducteur_id=data['conducteur_id'],
        point_depart=data['point_depart'],
        point_arrivee=data['point_arrivee'],
        date=date_obj,
        heure_depart=heure_obj,
        nb_places=data['nb_places'],
        depart_lat=data.get('depart_lat'),
        depart_lng=data.get('depart_lng'),
        arrivee_lat=data.get('arrivee_lat'),
        arrivee_lng=data.get('arrivee_lng')
    )
    db.session.add(trajet)
    db.session.commit()
    return jsonify({"message": "Trajet ajouté"}), 201

@trajet_bp.route('/conducteur/<int:conducteur_id>', methods=['GET'])
def trajets_conducteur(conducteur_id):
    trajets = Trajet.query.filter_by(conducteur_id=conducteur_id).all()
    return jsonify([{
        "id": t.id,
        "point_depart": t.point_depart,
        "point_arrivee": t.point_arrivee,
        "date": t.date.isoformat(),
        "heure_depart": t.heure_depart.strftime("%H:%M"),
        "nb_places": t.nb_places,
        "depart_lat": t.depart_lat,
        "depart_lng": t.depart_lng,
        "arrivee_lat": t.arrivee_lat,
        "arrivee_lng": t.arrivee_lng
    } for t in trajets])

@trajet_bp.route('/', methods=['GET'])
def lister_trajets():
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 10))
    trajets = Trajet.query.paginate(page=page, per_page=per_page, error_out=False)
    return jsonify([{
        "id": t.id,
        "point_depart": t.point_depart,
        "point_arrivee": t.point_arrivee,
        "date": t.date.isoformat(),
        "heure_depart": t.heure_depart.strftime("%H:%M"),
        "nb_places": t.nb_places,
        "depart_lat": t.depart_lat,
        "depart_lng": t.depart_lng,
        "arrivee_lat": t.arrivee_lat,
        "arrivee_lng": t.arrivee_lng
    } for t in trajets.items])

@trajet_bp.route('/modifier/<int:trajet_id>', methods=['PUT'])
def modifier_trajet(trajet_id):
    data = request.get_json()
    trajet = Trajet.query.get(trajet_id)
    if not trajet:
        return jsonify({"error": "Trajet introuvable"}), 404
    for field in ['point_depart', 'point_arrivee', 'date', 'heure_depart', 'nb_places']:
        if field in data:
            if field == 'date':
                trajet.date = datetime.strptime(data['date'], "%Y-%m-%d").date()
            elif field == 'heure_depart':
                trajet.heure_depart = datetime.strptime(data['heure_depart'], "%H:%M").time()
            else:
                setattr(trajet, field, data[field])
    db.session.commit()
    return jsonify({"message": "Trajet modifié"}), 200

@trajet_bp.route('/supprimer/<int:trajet_id>', methods=['DELETE'])
def supprimer_trajet(trajet_id):
    trajet = Trajet.query.get(trajet_id)
    if not trajet:
        return jsonify({"error": "Trajet introuvable"}), 404
    db.session.delete(trajet)
    db.session.commit()
    return jsonify({"message": "Trajet supprimé"}), 200