-- Créer la base de données
CREATE DATABASE IF NOT EXISTS covoiturage DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE covoiturage;

-- Table utilisateur
CREATE TABLE utilisateur (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100),
    prenom VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    telephone VARCHAR(20) UNIQUE,
    mot_de_passe VARCHAR(128),
    role VARCHAR(20), -- 'conducteur' ou 'passager'
    photo VARCHAR(255),
    point_depart VARCHAR(255),
    horaire_depart TIME,
    horaire_arrivee TIME,
    vehicule_marque VARCHAR(100),
    vehicule_modele VARCHAR(100),
    vehicule_places INT
);

-- Table trajet
CREATE TABLE trajet (
    id INT AUTO_INCREMENT PRIMARY KEY,
    conducteur_id INT,
    point_depart VARCHAR(255),
    point_arrivee VARCHAR(255),
    date DATE,
    heure_depart TIME,
    nb_places INT,
    depart_lat FLOAT,
    depart_lng FLOAT,
    arrivee_lat FLOAT,
    arrivee_lng FLOAT,
    FOREIGN KEY (conducteur_id) REFERENCES utilisateur(id)
);

-- Table demande
CREATE TABLE demande (
    id INT AUTO_INCREMENT PRIMARY KEY,
    passager_id INT,
    point_depart VARCHAR(255),
    point_arrivee VARCHAR(255),
    date DATE,
    heure_souhaitee TIME,
    depart_lat FLOAT,
    depart_lng FLOAT,
    arrivee_lat FLOAT,
    arrivee_lng FLOAT,
    FOREIGN KEY (passager_id) REFERENCES utilisateur(id)
);

-- Table matching
CREATE TABLE matching (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trajet_id INT,
    demande_id INT,
    status VARCHAR(20),
    date_matching DATETIME,
    FOREIGN KEY (trajet_id) REFERENCES trajet(id),
    FOREIGN KEY (demande_id) REFERENCES demande(id)
);

-- Table message
CREATE TABLE message (
    id INT AUTO_INCREMENT PRIMARY KEY,
    expediteur_id INT,
    destinataire_id INT,
    texte TEXT,
    horodatage DATETIME,
    FOREIGN KEY (expediteur_id) REFERENCES utilisateur(id),
    FOREIGN KEY (destinataire_id) REFERENCES utilisateur(id)
);

-- Table réservation
CREATE TABLE reservation (
    id INT AUTO_INCREMENT PRIMARY KEY,
    passager_id INT NOT NULL,
    trajet_id INT NOT NULL,
    nombre_places INT NOT NULL,
    FOREIGN KEY (passager_id) REFERENCES utilisateur(id),
    FOREIGN KEY (trajet_id) REFERENCES trajet(id)
);
