document.getElementById("form-inscription").addEventListener("submit", function(e) {
  e.preventDefault();

  const nom = document.getElementById("nom").value.trim();
  const prenom = document.getElementById("prenom").value.trim();
  const telephone = document.getElementById("telephone").value.trim();
  const email = document.getElementById("email").value.trim();
  const motdepasse = document.getElementById("motdepasse").value;
  const role = document.getElementById("role").value;

  if (!nom || !prenom || !telephone || !email || !motdepasse || !role) {
    alert("Veuillez remplir tous les champs.");
    return;
  }

  const utilisateurs = JSON.parse(localStorage.getItem("utilisateurs") || "[]");

  const existant = utilisateurs.find(u => u.email === email || u.telephone === telephone);
  if (existant) {
    alert("Un utilisateur avec ce téléphone ou cet email existe déjà.");
    return;
  }

  const nouveauUser = {
    nom,
    prenom,
    telephone,
    email,
    motdepasse,
    role
  };

  utilisateurs.push(nouveauUser);
  localStorage.setItem("utilisateurs", JSON.stringify(utilisateurs));

  alert("Inscription réussie !");
  window.location.href = "connexion.html";
});
