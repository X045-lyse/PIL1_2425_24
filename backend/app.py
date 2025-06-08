from flask import Flask
from routes.auth import auth_bp  # importation du blueprint d'authentification

app = Flask(__name__)

# Enregistrer le blueprint auth 
app.register_blueprint(auth_bp, url_prefix='/api')

@app.route('/')
def home():
    return "IFRI_comotorage - Backend opérationnel !"

if __name__ == '__main__':
    app.run(debug=True)
