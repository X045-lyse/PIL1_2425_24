document.addEventListener("DOMContentLoaded", async () => {
  // Vérifie le token dans le localStorage
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "connexion.html";
    return;
  }

  // Récupère le nom/prénom depuis le backend avec le token dans l'en-tête Authorization
  try {
    const res = await fetch("http://localhost:5000/auth/profil", {
      headers: {
        "Authorization": "Bearer " + token
      }
    });
    if (res.ok) {
      const user = await res.json();
      document.getElementById("nomUtilisateur").textContent = user.nom + " " + user.prenom;
    } else {
      window.location.href = "connexion.html";
    }
  } catch {
    document.getElementById("nomUtilisateur").textContent = "Utilisateur";
  }

  document.getElementById("logout").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "connexion.html";
  });
});
