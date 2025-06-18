from flask import Blueprint, request, jsonify
from models import db, Demande, Trajet
from datetime import datetime

demande_bp = Blueprint('demande', __name__)

@demande_bp.route('/ajouter', methods=['POST'])
def ajouter_demande():
    data = request.get_json()
    required = ['passager_id', 'point_depart', 'point_arrivee', 'date', 'heure_souhaitee']
    for field in required:
        if field not in data:
            return jsonify({"error": f"Champ manquant : {field}"}), 400
    # Conversion des champs date et heure
    date_obj = datetime.strptime(data['date'], "%Y-%m-%d").date()
    heure_obj = datetime.strptime(data['heure_souhaitee'], "%H:%M").time()
    demande = Demande(
        passager_id=data['passager_id'],
        point_depart=data['point_depart'],
        point_arrivee=data['point_arrivee'],
        date=date_obj,
        heure_souhaitee=heure_obj,
        depart_lat=data.get('depart_lat'),
        depart_lng=data.get('depart_lng'),
        arrivee_lat=data.get('arrivee_lat'),
        arrivee_lng=data.get('arrivee_lng')
    )
    db.session.add(demande)
    db.session.commit()
    return jsonify({"message": "Demande ajoutée"}), 201

@demande_bp.route('/passager/<int:passager_id>', methods=['GET'])
def demandes_passager(passager_id):
    demandes = Demande.query.filter_by(passager_id=passager_id).all()
    return jsonify([{
        "id": d.id,
        "point_depart": d.point_depart,
        "point_arrivee": d.point_arrivee,
        "date": d.date.isoformat(),
        "heure_souhaitee": d.heure_souhaitee.strftime("%H:%M"),
        "depart_lat": d.depart_lat,
        "depart_lng": d.depart_lng,
        "arrivee_lat": d.arrivee_lat,
        "arrivee_lng": d.arrivee_lng
    } for d in demandes])

@demande_bp.route('/modifier/<int:demande_id>', methods=['PUT'])
def modifier_demande(demande_id):
    data = request.get_json()
    demande = Demande.query.get(demande_id)
    if not demande:
        return jsonify({"error": "Demande introuvable"}), 404
    for field in ['point_depart', 'point_arrivee', 'date', 'heure_souhaitee']:
        if field in data:
            if field == 'date':
                demande.date = datetime.strptime(data['date'], "%Y-%m-%d").date()
            elif field == 'heure_souhaitee':
                demande.heure_souhaitee = datetime.strptime(data['heure_souhaitee'], "%H:%M").time()
            else:
                setattr(demande, field, data[field])
    db.session.commit()
    return jsonify({"message": "Demande modifiée"}), 200

@demande_bp.route('/supprimer/<int:demande_id>', methods=['DELETE'])
def supprimer_demande(demande_id):
    demande = Demande.query.get(demande_id)
    if not demande:
        return jsonify({"error": "Demande introuvable"}), 404
    db.session.delete(demande)
    db.session.commit()
    return jsonify({"message": "Demande supprimée"}), 200

@demande_bp.route('/', methods=['GET'])
def lister_demandes():
    demandes = Demande.query.all()
    return jsonify([{
        "id": d.id,
        "point_depart": d.point_depart,
        "point_arrivee": d.point_arrivee,
        "date": d.date.isoformat(),
        "heure_souhaitee": d.heure_souhaitee.strftime("%H:%M"),
        "depart_lat": d.depart_lat,
        "depart_lng": d.depart_lng,
        "arrivee_lat": d.arrivee_lat,
        "arrivee_lng": d.arrivee_lng
    } for d in demandes])

@demande_bp.route('/<int:id>', methods=['GET'])
def get_demande(id):
    demande = Demande.query.get_or_404(id)
    return jsonify({
        "id": demande.id,
        "point_depart": demande.point_depart,
        "point_arrivee": demande.point_arrivee,
        "date": demande.date.isoformat(),
        "heure_souhaitee": demande.heure_souhaitee.strftime("%H:%M"),
        "depart_lat": demande.depart_lat,
        "depart_lng": demande.depart_lng,
        "arrivee_lat": demande.arrivee_lat,
        "arrivee_lng": demande.arrivee_lng
    })

@demande_bp.route('/trajet/<int:id>', methods=['GET'])
def get_trajet(id):
    trajet = Trajet.query.get_or_404(id)
    return jsonify({
        "id": trajet.id,
        "point_depart": trajet.point_depart,
        "point_arrivee": trajet.point_arrivee,
        "date": trajet.date.isoformat(),
        "heure_depart": trajet.heure_depart.strftime("%H:%M"),
        "nb_places": trajet.nb_places,
        "depart_lat": trajet.depart_lat,
        "depart_lng": trajet.depart_lng,
        "arrivee_lat": trajet.arrivee_lat,
        "arrivee_lng": trajet.arrivee_lng
    })
