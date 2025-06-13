document.getElementById("form-connexion").addEventListener("submit", function(e) {
  e.preventDefault();

  const identifiant = document.getElementById("identifiant").value.trim();
  const motdepasse = document.getElementById("motdepasse").value;

  const utilisateurs = JSON.parse(localStorage.getItem("utilisateurs") || "[]");

  const utilisateur = utilisateurs.find(u =>
    (u.email === identifiant || u.telephone === identifiant) && u.motdepasse === motdepasse
  );

  if (utilisateur) {
    alert("Connexion réussie !");
    localStorage.setItem("utilisateurConnecte", JSON.stringify(utilisateur));
    window.location.href = "profil.html"; // ou accueil.html
  } else {
    alert("Identifiants incorrects !");
  }
});
