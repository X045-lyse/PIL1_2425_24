<script>
  document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "connexion.html";
      return;
    }
    const res = await fetch("http://localhost:5000/matching/resultats", {
      headers: { "Authorization": "Bearer " + token }
    });
    const results = await res.json();
    afficherMatching(results);
  });

  function afficherMatching(results) {
    const container = document.getElementById("matching-results");
    container.innerHTML = "";

    if (!results || results.length === 0) {
      container.innerHTML = "<p>Aucun matching trouvé.</p>";
      return;
    }

    results.forEach(({ conducteur, passager }) => {
      const item = document.createElement("div");
      item.classList.add("matching-result-item");

      item.innerHTML = `
        <img src="${conducteur.photo}" alt="Photo de ${conducteur.nom}" />
        <div class="matching-result-details">
          <p><strong>Conducteur :</strong> ${conducteur.nom}</p>
          <p><strong>De :</strong> ${conducteur.point_depart}</p>
          <p><strong>À :</strong> ${conducteur.point_arrivee}</p>
          <p><strong>Départ :</strong> ${conducteur.heure_depart}</p>
          <p><strong>Places dispo :</strong> ${conducteur.nb_places}</p>
        </div>
        <img src="${passager.photo}" alt="Photo de ${passager.nom}" />
        <div class="matching-result-details">
          <p><strong>Passager :</strong> ${passager.nom}</p>
          <p><strong>Heure départ souhaitée :</strong> ${passager.heure_souhaitee}</p>
        </div>
      `;

      container.appendChild(item);
    });
  }

  // On lance l'affichage au chargement
  afficherMatching(matchingResults);
</script>
