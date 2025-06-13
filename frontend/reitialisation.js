// Variables globales
let codeGenere = null;
let utilisateurCible = null;

// Charger les utilisateurs depuis localStorage
const utilisateurs = JSON.parse(localStorage.getItem("utilisateurs") || "[]");

// Étape 1 : envoi du code
document.getElementById("form-identifiant").addEventListener("submit", function(e) {
  e.preventDefault();
  const identifiant = document.getElementById("identifiant").value.trim();

  // Chercher l'utilisateur correspondant
  const utilisateur = utilisateurs.find(u =>
    u.email === identifiant || u.telephone === identifiant
  );

  if (!utilisateur) {
    alert("Utilisateur introuvable avec cet identifiant.");
    return;
  }

  // Simuler un code de vérification à 6 chiffres
  codeGenere = Math.floor(100000 + Math.random() * 900000).toString();
  utilisateurCible = utilisateur;

  // Simuler l'envoi par SMS (dans une vraie appli on utilisera une API SMS ici)
  alert("Code de vérification envoyé (simulé) : " + codeGenere);

  // Afficher le formulaire de code
  document.getElementById("form-identifiant").style.display = "none";
  document.getElementById("form-code").style.display = "block";
});

// Étape 2 : vérification du code
document.getElementById("form-code").addEventListener("submit", function(e) {
  e.preventDefault();
  const codeEntre = document.getElementById("code").value.trim();

  if (codeEntre === codeGenere) {
    document.getElementById("form-code").style.display = "none";
    document.getElementById("form-motdepasse").style.display = "block";
  } else {
    alert("Code incorrect !");
  }
});

// Étape 3 : changement du mot de passe
document.getElementById("form-motdepasse").addEventListener("submit", function(e) {
  e.preventDefault();
  const newPass = document.getElementById("new-password").value;
  const confirmPass = document.getElementById("confirm-password").value;

  if (newPass !== confirmPass) {
    alert("Les mots de passe ne correspondent pas.");
    return;
  }

  if (!utilisateurCible) {
    alert("Erreur : aucun utilisateur cible défini.");
    return;
  }

  const index = utilisateurs.findIndex(u =>
    u.email === utilisateurCible.email || u.telephone === utilisateurCible.telephone
  );

  utilisateurs[index].motdepasse = newPass;
  localStorage.setItem("utilisateurs", JSON.stringify(utilisateurs));

  alert("Mot de passe modifié avec succès !");
  window.location.href = "connexion.html";
});
