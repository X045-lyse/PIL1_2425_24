document.addEventListener("DOMContentLoaded", () => {
  const annoncesList = document.getElementById("annonces-list");
  const voirTrajets = document.getElementById("voir-trajets");
  const voirDemandes = document.getElementById("voir-demandes");
  const message = document.getElementById("message");

  function getToken() {
    return localStorage.getItem("token");
  }

  async function chargerAnnonces(type) {
    annoncesList.innerHTML = "<em>Chargement...</em>";
    message.textContent = "";
    const url = type === "trajet"
      ? "http://localhost:5000/trajet/?page=1&per_page=10"
      : "http://localhost:5000/demande/?page=1&per_page=10";
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        annoncesList.innerHTML = data.map(a => `
          <div class="annonce">
            <strong>${type === "trajet" ? "Trajet" : "Demande"}</strong><br>
            <b>De :</b> ${a.point_depart} <b>à</b> ${a.point_arrivee}<br>
            <b>Date :</b> ${a.date} <b>Heure :</b> ${a.heure_depart || a.heure_souhaitee}<br>
            ${type === "trajet" ? `<b>Places :</b> ${a.nb_places}` : ""}
            <br>
            ${getToken() ? `<button onclick="initierMatching('${type}', ${a.id})">Proposer un matching</button>` : ""}
          </div>
        `).join("");
      } else {
        annoncesList.innerHTML = "<em>Aucune annonce trouvée.</em>";
      }
    } catch (err) {
      annoncesList.innerHTML = "";
      message.textContent = "Erreur de chargement.";
    }
  }

  voirTrajets.onclick = () => chargerAnnonces("trajet");
  voirDemandes.onclick = () => chargerAnnonces("demande");
  voirTrajets.click();

  window.initierMatching = async function(type, id) {
    if (!getToken()) {
      alert("Connectez-vous pour proposer un matching.");
      window.location.href = "connexion.html";
      return;
    }
    // À compléter : appel API pour le matching
    alert(`Matching à implémenter pour ${type} id=${id}`);
  };
});
