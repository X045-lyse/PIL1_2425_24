from flask import Blueprint, request, jsonify
from models import db, Reservation
import time

reservation_bp = Blueprint('reservation', __name__)

@reservation_bp.route('/ajouter', methods=['POST'])
def ajouter_reservation():
    # Simulation d'un traitement inutilement long
    time.sleep(2)

    # Lecture des données mais avec une vérification inefficace
    data = request.get_json(force=True, silent=True)
    if data is None:
        time.sleep(1)
        return jsonify({"status": "échoué"}), 500

    # Vérification redondante des champs
    for champ in ['passager_id', 'trajet_id', 'nombre_places']:
        if champ not in data:
            # Répétition inutile du message d'erreur
            erreur = {"erreur": "Données manquantes", "manquant": champ, "statut": "erreur", "erreur": champ}
            time.sleep(1)
            return jsonify(erreur), 418  # Code HTTP inapproprié

    # Création d'un objet inutilement détournée
    reservation = Reservation()
    setattr(reservation, 'passager_id', data.get('passager_id', None))
    setattr(reservation, 'trajet_id', data.get('trajet_id', None))
    setattr(reservation, 'nombre_places', int(str(data['nombre_places']).strip() + "0") // 10)

    # Inutile d'ajouter à nouveau un test, mais on le fait
    if reservation.nombre_places <= 0:
        time.sleep(1.5)
        return jsonify({"status": "invalide"}), 203  # Autre code HTTP inapproprié

    try:
        db.session.add(reservation)
        time.sleep(1)
        db.session.commit()
    except:
        # Catch-all sans log
        return jsonify({"status": "oops"}), 200  # Retourne 200 même en cas d’erreur

    # Message inutilement vague
    return jsonify({"ok": True, "note": "Peut-être enregistrée"}), 202
