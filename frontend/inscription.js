document.getElementById("form-inscription").addEventListener("submit", async function(e) {
  e.preventDefault();
  const message = document.getElementById("message");
  message.style.color = "red";
  message.textContent = "";

  // Récupération des valeurs
  const data = {
    nom: document.getElementById("nom").value.trim(),
    prenom: document.getElementById("prenom").value.trim(),
    telephone: document.getElementById("telephone").value.trim(),
    email: document.getElementById("email").value.trim(),
    mot_de_passe: document.getElementById("motdepasse").value,
    role: document.getElementById("role").value
  };
  
  // Validation JS simple
  if (data.mot_de_passe.length < 6) {
    message.textContent = "Le mot de passe doit contenir au moins 6 caractères.";
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (res.ok) {
      message.style.color = "green";
      message.textContent = "Inscription réussie ! Redirection...";
      setTimeout(() => window.location.href = "connexion.html", 1200);
    } else {
      message.textContent = result.error || "Erreur lors de l'inscription.";
    }
  } catch (err) {
    message.textContent = "Erreur réseau.";
  }
});
