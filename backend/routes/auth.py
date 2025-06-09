from flask import Blueprint, request, jsonify

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    nom = data.get('nom')
    email = data.get('email')
    mot_de_passe = data.get('mot_de_passe')
    role = data.get('role')

    # Vérifier que les données sont présentes
    if not all([nom, email, mot_de_passe, role]):
        return jsonify({"error": "Champs manquants"}), 400

    # Pour l'instant, on affiche juste ce qu'on a reçu
    return jsonify({
        "message": "Utilisateur reçu !",
        "utilisateur": {
            "nom": nom,
            "email": email,
            "role": role
        }
    }), 201
