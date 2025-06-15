document.getElementById("form-connexion").addEventListener("submit", async function(e) {
  e.preventDefault();
  const message = document.getElementById("message");
  message.textContent = "";

  const data = {
    identifiant: document.getElementById("identifiant").value.trim(),
    mot_de_passe: document.getElementById("motdepasse").value
  };

  try {
    const res = await fetch("http://localhost:5000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (res.ok && result.token) {
      localStorage.setItem("token", result.token);
      window.location.href = "accueil.html";
    } else {
      message.textContent = result.error || "Identifiants incorrects !";
    }
  } catch (err) {
    message.textContent = "Erreur réseau.";
  }
});
