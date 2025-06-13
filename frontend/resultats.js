<script>
  // Exemple de résultats simulés (à remplacer par les vrais)
  const matchingResults = [
    {
      conducteur: {
        nom: "Jean Dupont",
        photo: "https://randomuser.me/api/portraits/men/45.jpg",
        from: "IFRI UAC",
        to: "IFRI UAC",
        heureDepart: "08:00",
        placesDisponibles: 3,
      },
      passager: {
        nom: "Marie Curie",
        photo: "https://randomuser.me/api/portraits/women/65.jpg",
        heureDepartSouhaitee: "08:15",
      }
    },
    {
      conducteur: {
        nom: "Paul Martin",
        photo: "https://randomuser.me/api/portraits/men/20.jpg",
        from: "IFRI UAC",
        to: "IFRI UAC",
        heureDepart: "07:45",
        placesDisponibles: 2,
      },
      passager: {
        nom: "Sophie Leroy",
        photo: "https://randomuser.me/api/portraits/women/40.jpg",
        heureDepartSouhaitee: "08:00",
      }
    }
  ];

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
          <p><strong>De :</strong> ${conducteur.from}</p>
          <p><strong>À :</strong> ${conducteur.to}</p>
          <p><strong>Départ :</strong> ${conducteur.heureDepart}</p>
          <p><strong>Places dispo :</strong> ${conducteur.placesDisponibles}</p>
        </div>
        <img src="${passager.photo}" alt="Photo de ${passager.nom}" />
        <div class="matching-result-details">
          <p><strong>Passager :</strong> ${passager.nom}</p>
          <p><strong>Heure départ souhaitée :</strong> ${passager.heureDepartSouhaitee}</p>
        </div>
      `;

      container.appendChild(item);
    });
  }

  // On lance l'affichage au chargement
  afficherMatching(matchingResults);
</script>
