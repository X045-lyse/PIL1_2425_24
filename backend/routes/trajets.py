from flask import Blueprint, request, jsonify

trajets_bp = Blueprint('trajets', __name__)

@trajets_bp.route('/trajets', methods=['GET'])

def get_trajets():

    return jsonify({"message":"Liste des trajets (à implémenter)"})

@trajets_bp.route('/trajets', methods=['POST'])

def create_trajet():
    data = request.get_json()

    return jsonify({"message":"Trajet reçu (simulation)", "data": data}), 201