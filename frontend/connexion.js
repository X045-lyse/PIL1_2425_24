document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const message = document.getElementById("message");

  if (email === "" || password === "") {
    message.style.color = "red";
    message.textContent = "Tous les champs sont obligatoires.";
  } else {
    message.style.color = "green";
    message.textContent = "Connexion réussie. Redirection...";
    setTimeout(() => {
      // Simule une redirection
      window.location.href = "profil.html";
    }, 1500);
  }
});

document.getElementById("forgot").addEventListener("click", function(e) {
  e.preventDefault();
  alert("Lien de réinitialisation envoyé (simulation).");
});
