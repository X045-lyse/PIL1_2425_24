document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("annoncesContainer");

  // Vérifier l'utilisateur connecté
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    alert("Veuillez vous connecter d'abord.");
    window.location.href = "connexion.html";
    return;
  }

  // Récupérer les annonces dans localStorage
  const offres = JSON.parse(localStorage.getItem("offres")) || [];
  const demandes = JSON.parse(localStorage.getItem("demandes")) || [];

  // Filtrer les annonces de l'utilisateur connecté
  const mesOffres = offres.filter(offre => offre.auteur === currentUser.email);
  const mesDemandes = demandes.filter(demande => demande.auteur === currentUser.email);

  // Fonction pour afficher une carte d'annonce
  function afficherAnnonce(type, annonce, index) {
    const div = document.createElement("div");
    div.className = "annonce";

    div.innerHTML = `
      <h3>${type === 'offre' ? "Offre" : "Demande"} de covoiturage</h3>
      <p><strong>Départ :</strong> ${annonce.depart}</p>
      <p><strong>Arrivée :</strong> ${annonce.arrivee}</p>
      <p><strong>Heure :</strong> ${annonce.heure}</p>
      ${type === 'offre' ? `<p><strong>Places :</strong> ${annonce.places}</p>` : ""}
      <button class="supprimer" data-type="${type}" data-index="${index}">🗑️ Supprimer</button>
    `;

    container.appendChild(div);
  }

  // Afficher les offres et demandes de l'utilisateur
  mesOffres.forEach((offre, index) => afficherAnnonce("offre", offre, index));
  mesDemandes.forEach((demande, index) => afficherAnnonce("demande", demande, index));

  // Gestion suppression
  container.addEventListener("click", e => {
    if (e.target.classList.contains("supprimer")) {
      const type = e.target.dataset.type;
      const index = parseInt(e.target.dataset.index);

      if (type === "offre") {
        offres.splice(index, 1);
        localStorage.setItem("offres", JSON.stringify(offres));
      } else {
        demandes.splice(index, 1);
        localStorage.setItem("demandes", JSON.stringify(demandes));
      }

      location.reload(); // Recharger la page pour mettre à jour
    }
  });
});
