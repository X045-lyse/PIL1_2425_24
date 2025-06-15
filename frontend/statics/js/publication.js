const typeSelect = document.getElementById("type");
const conducteurFields = document.getElementById("conducteurFields");
const trajetForm = document.getElementById("trajetForm");
const message = document.getElementById("message");

// Affichage conditionnel
typeSelect.addEventListener("change", () => {
  conducteurFields.style.display = typeSelect.value === "conducteur" ? "block" : "none";
});

// Initialisation des cartes Leaflet
const mapDepart = L.map('mapDepart').setView([6.3703, 2.3912], 13); // Cotonou par défaut
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(mapDepart);

const mapArrivee = L.map('mapArrivee').setView([6.3703, 2.3912], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(mapArrivee);

let departMarker = null;
let arriveeMarker = null;

// Gestion du clic sur la carte de départ
mapDepart.on('click', function(e) {
    if (departMarker) mapDepart.removeLayer(departMarker);
    departMarker = L.marker(e.latlng).addTo(mapDepart);
    document.getElementById('depart_lat').value = e.latlng.lat;
    document.getElementById('depart_lng').value = e.latlng.lng;
});

// Gestion du clic sur la carte d'arrivée
mapArrivee.on('click', function(e) {
    if (arriveeMarker) mapArrivee.removeLayer(arriveeMarker);
    arriveeMarker = L.marker(e.latlng).addTo(mapArrivee);
    document.getElementById('arrivee_lat').value = e.latlng.lat;
    document.getElementById('arrivee_lng').value = e.latlng.lng;
});

// Soumission du formulaire
trajetForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  message.textContent = "";

  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "connexion.html";
    return;
  }

  const type = typeSelect.value;
  const depart_lat = document.getElementById('depart_lat').value;
  const depart_lng = document.getElementById('depart_lng').value;
  const arrivee_lat = document.getElementById('arrivee_lat').value;
  const arrivee_lng = document.getElementById('arrivee_lng').value;

  if (!depart_lat || !depart_lng || !arrivee_lat || !arrivee_lng) {
    message.style.color = "red";
    message.textContent = "Veuillez sélectionner un point de départ et d'arrivée sur la carte.";
    return;
  }

  const data = {
    point_depart: document.getElementById("depart").value.trim(),
    point_arrivee: document.getElementById("arrivee").value.trim(),
    date: document.getElementById("date").value,
    heure_depart: document.getElementById("heure").value,
    depart_lat,
    depart_lng,
    arrivee_lat,
    arrivee_lng
  };
  if (type === "conducteur") {
    data.nb_places = parseInt(document.getElementById("places").value);
  }

  try {
    const res = await fetch(`http://localhost:5000/${type === "conducteur" ? "trajet" : "demande"}/ajouter`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (res.ok) {
      message.style.color = "green";
      message.textContent = "Annonce publiée !";
      form.reset();
      conducteurFields.style.display = "none";
    } else {
      message.style.color = "red";
      message.textContent = result.error || "Erreur lors de la publication.";
    }
  } catch (err) {
    message.style.color = "red";
    message.textContent = "Erreur réseau.";
  }
});
