import math
import jwt
from flask import request, jsonify
from functools import wraps

SECRET_KEY = "votre_cle_secrete"  # Doit être identique à celui de auth.py

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]
            else:
                token = auth_header
        if not token:
            return jsonify({"error": "Token manquant"}), 401
        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            # Tu peux utiliser data["user_id"] ici si besoin
        except Exception:
            return jsonify({"error": "Token invalide"}), 401
        return f(*args, **kwargs)
    return decorated

def haversine(lat1, lon1, lat2, lon2):
    R = 6371  # Rayon de la Terre en km
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi/2)**2 + math.cos(phi1)*math.cos(phi2)*math.sin(dlambda/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c  # Distance en km