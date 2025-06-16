# IFRI Comotorage – Déploiement sur un autre PC

## Prérequis

- **Python 3.10+** (recommandé : 3.11)
- **MySQL** (ou MariaDB)
- **Node.js** (optionnel, pour un serveur frontend local)
- **Git** (pour cloner le projet)

---

## 1. Cloner le projet

```bash
git clone https://github.com/<votre-utilisateur>/projet_integrateur.git
cd projet_integrateur
```

---

## 2. Installer et configurer la base de données MySQL

1. **Créer la base de données et l’utilisateur** :

```sql
CREATE DATABASE covoiturage CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'ifriuser'@'localhost' IDENTIFIED BY 'motdepassefort';
GRANT ALL PRIVILEGES ON covoiturage.* TO 'ifriuser'@'localhost';
FLUSH PRIVILEGES;
```

2. **Vérifier/modifier la chaîne de connexion** dans `backend/app.py` si besoin :

```python
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://ifriuser:motdepassefort@localhost/covoiturage'
```

---

## 3. Installer les dépendances Python (backend)

```bash
cd backend
python -m venv ../env
../env/Scripts/activate  # (Windows)
# ou
source ../env/bin/activate  # (Linux/Mac)

pip install -r requirements.txt
```

---

## 4. Initialiser la base de données

```bash
python app.py
```
- Les tables seront créées automatiquement au premier lancement grâce à `db.create_all()`.

---

## 5. Lancer le backend Flask

```bash
python app.py
```
- Le backend sera accessible sur [http://localhost:5000](http://localhost:5000)

---

## 6. Lancer le frontend

- **Option 1 : Ouvrir les fichiers HTML directement** (pas recommandé pour les appels API)
- **Option 2 : Utiliser un serveur local** (recommandé)

### Avec VS Code (Live Server) :
- Clique droit sur `frontend/index.html` → "Open with Live Server"

### Ou avec Python :
```bash
cd ../frontend
python -m http.server 5500
```
- Le frontend sera accessible sur [http://localhost:5500](http://localhost:5500)

---

## 7. Configuration CORS

- Le backend autorise déjà les origines `localhost` et `127.0.0.1` sur les ports 5000 et 5500.
- Si tu changes de port ou d’URL, adapte la liste dans `backend/app.py` :

```python
CORS(
    app,
    supports_credentials=True,
    origins=[
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        "http://localhost:5000",
        "http://127.0.0.1:5000"
    ]
)
```

---

## 8. Dépannage

- **Erreur CORS** : vérifie la config CORS et que tu utilises bien le bon port/URL.
- **Erreur 404 sur une image** : place l’image manquante dans `frontend/images/`.
- **Erreur de connexion MySQL** : vérifie l’utilisateur, le mot de passe et que MySQL tourne.

---

## 9. Structure du projet

```
PIL1_2425_24/
│
├── backend/
│   ├── app.py
│   ├── models.py
│   ├── requirements.txt
│   ├── routes/
│   └── ...
│
├── frontend/
│   ├── index.html
│   ├── profil.html
│   ├── ...
│
└── env/  # environnement virtuel Python
```

---

## 10. Accès

- **Backend API** : http://localhost:5000/
- **Frontend** : http://localhost:5500/ (ou via Live Server)

---

**Bon déploiement !**
