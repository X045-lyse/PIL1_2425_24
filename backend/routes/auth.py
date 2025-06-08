from flask import Blueprint

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['GET'])
def register():
    return {"message": "Bienvenue sur /register"}
