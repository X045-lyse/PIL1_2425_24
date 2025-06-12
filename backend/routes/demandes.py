from flask import Blueprint, request, jsonify

demandes_bp = Blueprint('demandes', __name__)

@demandes_bp.route('/demandes', methods=['GET'])

def get_demandes():

    return jsonify({"message":"Liste des demandes (à implémenter)"})

@demandes_bp.route('/demandes', methods=['POST'])

def create_demande():
    data = request.get_json()

    return jsonify({"message":"Demande reçue (simulation)", "data": data}), 201 