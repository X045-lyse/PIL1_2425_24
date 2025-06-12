document.getElementById("registerForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const nom = document.getElementById("nom").value;
  const prenom = document.getElementById("prenom").value;
  const tel = document.getElementById("telephone").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const role = document.querySelector('input[name="role"]:checked');

  if (!role) {
    alert("Veuillez choisir un rôle.");
    return;
  }

  // Simuler l'enregistrement
  const message = document.getElementById("message");
  message.textContent = `Compte ${role.value} créé avec succès pour ${prenom} ${nom} !`;

  // Réinitialiser le formulaire
  this.reset();
});
