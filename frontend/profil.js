document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "connexion.html";
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/auth/profil", {
      headers: { "Authorization": "Bearer " + token }
    });
    if (!res.ok) {
      alert("Erreur lors de la récupération du profil.");
      return;
    }
    const user = await res.json();

    // Remplir les champs du profil
    document.getElementById("profile-name").textContent = user.prenom + " " + user.nom;
    document.getElementById("lastname").value = user.nom || "";
    document.getElementById("firstname").value = user.prenom || "";
    document.getElementById("departure-point").value = user.point_depart || "";
    document.getElementById("departure-time").value = user.horaire_depart || "";
    document.getElementById("arrival-time").value = user.horaire_arrivee || "";
    document.getElementById("car-brand").value = user.vehicule_marque || "";
    document.getElementById("car-model").value = user.vehicule_modele || "";
    document.getElementById("seats-available").value = user.vehicule_places || "";
    document.getElementById("depart_lat").value = user.depart_lat || "";
    document.getElementById("depart_lng").value = user.depart_lng || "";

    // Affiche la section véhicule seulement si conducteur
    if (user.role === "conducteur") {
      document.getElementById("driver-section").style.display = "block";
    } else {
      document.getElementById("driver-section").style.display = "none";
    }

    // Photo de profil
    if (user.photo) {
      document.getElementById("profile-avatar").src = user.photo;
    }
  } catch (err) {
    alert("Erreur réseau lors du chargement du profil.");
  }

  // Initialisation de la carte Leaflet
  const map = L.map('map-preview').setView([6.3703, 2.3912], 13); // Cotonou par défaut
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(map);

  let marker = null;
  map.on('click', function(e) {
    if (marker) map.removeLayer(marker);
    marker = L.marker(e.latlng).addTo(map);
    document.getElementById('depart_lat').value = e.latlng.lat;
    document.getElementById('depart_lng').value = e.latlng.lng;
    document.getElementById('departure-point').value = `${e.latlng.lat.toFixed(6)}, ${e.latlng.lng.toFixed(6)}`;
  });
});

document.getElementById("profile-form").addEventListener("submit", async function(e) {
  e.preventDefault();
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "connexion.html";
    return;
  }

  const data = {
    nom: document.getElementById("lastname").value,
    prenom: document.getElementById("firstname").value,
    point_depart: document.getElementById("departure-point").value,
    horaire_depart: document.getElementById("departure-time").value,
    horaire_arrivee: document.getElementById("arrival-time").value,
    vehicule_marque: document.getElementById("car-brand").value,
    vehicule_modele: document.getElementById("car-model").value,
    vehicule_places: document.getElementById("seats-available").value,
    depart_lat: document.getElementById("depart_lat").value,
    depart_lng: document.getElementById("depart_lng").value
  };

  try {
    const res = await fetch("http://localhost:5000/auth/profil", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (res.ok) {
      alert("Profil mis à jour !");
      window.location.reload();
    } else {
      alert(result.error || "Erreur lors de la mise à jour.");
    }
  } catch (err) {
    alert("Erreur réseau.");
  }
});




