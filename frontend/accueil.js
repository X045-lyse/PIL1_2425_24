const utilisateur = JSON.parse(localStorage.getItem("utilisateurConnecte"));

if (!utilisateur) {
  window.location.href = "connexion.html";
} else {
  document.getElementById("nomUtilisateur").textContent = utilisateur.nom + " " + utilisateur.prenom;
}

document.getElementById("logout").addEventListener("click", () => {
  localStorage.removeItem("utilisateurConnecte");
  window.location.href = "connexion.html";
});
