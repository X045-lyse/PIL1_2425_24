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
    const urlAutre = type === "trajet"
      ? "http://localhost:5000/demande/?page=1&per_page=10"
      : "http://localhost:5000/trajet/?page=1&per_page=10";
    try {
      const res = await fetch(url);
      const data = await res.json();
      const resAutre = await fetch(urlAutre);
      const dataAutre = await resAutre.json();

      if (Array.isArray(data) && data.length > 0) {
        annoncesList.innerHTML = data.map(a => {
          let autres = Array.isArray(dataAutre) && dataAutre.length > 0
            ? dataAutre.map(autre => `
              <button onclick="proposerMatchingDirect('${type}', ${a.id}, ${autre.id})">
                Associer avec ${type === "trajet" ? "demande" : "trajet"} #${autre.id}
              </button>
            `).join(" ")
            : "<em>Aucune annonce à associer.</em>";
          return `
            <div class="annonce">
              <strong>${type === "trajet" ? "Trajet" : "Demande"}</strong><br>
              <b>De :</b> ${a.point_depart} <b>à</b> ${a.point_arrivee}<br>
              <b>Date :</b> ${a.date} <b>Heure :</b> ${a.heure_depart || a.heure_souhaitee}<br>
              ${type === "trajet" ? `<b>Places :</b> ${a.nb_places}` : ""}
              <div style="margin-top:8px;">${getToken() ? autres : ""}</div>
            </div>
          `;
        }).join("");
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

    // Demande à l'utilisateur de choisir l'autre annonce à matcher
    // Exemple simple : si on clique sur un trajet, on demande l'id de la demande à matcher
    let autreId = prompt("Entrez l'ID de l'autre annonce à matcher (demande si trajet, trajet si demande) :");
    if (!autreId) return;

    let trajet_id, demande_id;
    if (type === "trajet") {
      trajet_id = id;
      demande_id = autreId;
    } else {
      trajet_id = autreId;
      demande_id = id;
    }

    const res = await fetch("http://localhost:5000/matching/proposer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trajet_id, demande_id })
    });
    const result = await res.json();
    alert(result.message || result.error);
  };

  // Fonction de matching direct
  window.proposerMatchingDirect = async function(type, id, autreId) {
    let trajet_id, demande_id;
    if (type === "trajet") {
      trajet_id = id;
      demande_id = autreId;
    } else {
      trajet_id = autreId;
      demande_id = id;
    }
    const res = await fetch("http://localhost:5000/matching/proposer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trajet_id, demande_id })
    });
    const result = await res.json();
    alert(result.message || result.error);
  };
});

async function proposerMatching(trajet_id, demande_id) {
  const res = await fetch("http://localhost:5000/matching/proposer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ trajet_id, demande_id })
  });
  const result = await res.json();
  alert(result.message || result.error);
}
