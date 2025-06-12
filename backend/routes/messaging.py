from flask import Blueprint, request, jsonify

messaging_bp = Blueprint('messaging', __name__)

@messaging_bp.route('/messages', methods=['GET'])

def get_messages():

    return jsonify({"message":"Liste des messages (à implémenter)"})

@messaging_bp.route('/messages', methods=['POST'])

def send_message():
    data = request.get_json()

    return jsonify({"message":"Message reçu (simulation)", "data": data}), 201