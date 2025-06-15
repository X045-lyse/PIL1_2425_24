// Variables globales
let codeGenere = null;
let utilisateurCible = null;

// Charger les utilisateurs depuis localStorage
const utilisateurs = JSON.parse(localStorage.getItem("utilisateurs") || "[]");

// Étape 1 : Demander le code de réinitialisation
document.getElementById("form-identifiant").addEventListener("submit", async function(e) {
  e.preventDefault();
  const identifiant = document.getElementById("identifiant").value.trim();
  const res = await fetch("http://localhost:5000/auth/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifiant })
  });
  if (res.ok) {
    document.getElementById("form-identifiant").style.display = "none";
    document.getElementById("form-code").style.display = "block";
  } else {
    alert("Utilisateur introuvable.");
  }
});

// Étape 2 : Vérifier le code reçu
document.getElementById("form-code").addEventListener("submit", async function(e) {
  e.preventDefault();
  const code = document.getElementById("code").value.trim();
  const identifiant = document.getElementById("identifiant").value.trim();
  const res = await fetch("http://localhost:5000/auth/verify-code", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifiant, code })
  });
  if (res.ok) {
    document.getElementById("form-code").style.display = "none";
    document.getElementById("form-motdepasse").style.display = "block";
  } else {
    alert("Code incorrect !");
  }
});

// Étape 3 : Changer le mot de passe
document.getElementById("form-motdepasse").addEventListener("submit", async function(e) {
  e.preventDefault();
  const identifiant = document.getElementById("identifiant").value.trim();
  const newPass = document.getElementById("new-password").value;
  const confirmPass = document.getElementById("confirm-password").value;

  if (newPass !== confirmPass) {
    alert("Les mots de passe ne correspondent pas.");
    return;
  }

  const res = await fetch("http://localhost:5000/auth/set-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifiant, nouveau_mot_de_passe: newPass })
  });
  if (res.ok) {
    alert("Mot de passe modifié avec succès !");
    window.location.href = "connexion.html";
  } else {
    alert("Erreur lors de la modification du mot de passe.");
  }
});
