from flask import Blueprint, request, jsonify

matching_bp = Blueprint('matching', __name__)

@matching_bp.route('/matchings', methods=['GET'])

def get_matchings():

    return jsonify({"message":"Tous les matchings (à implémenter)"}), 200

@matching_bp.route('/match', methods=['POST'])

def match_passager_conducteur():
    data = request.get_json()

    return jsonify({"message":"Matching en cours (simulation)", "data": data}), 200