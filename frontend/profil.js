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
    document.getElementById("departure-time").value = user.horaire || "";
    // Si tu as un champ arrival-time, adapte ici
    document.getElementById("car-brand").value = user.vehicule_marque || "";
    document.getElementById("car-model").value = user.vehicule_modele || "";
    document.getElementById("seats-available").value = user.vehicule_places || "";

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
    // Affiche les coordonnées dans le champ "Point de départ habituel"
    document.getElementById('departure-point').value = `${e.latlng.lat.toFixed(6)}, ${e.latlng.lng.toFixed(6)}`;
  });
});

// Exemple de code pour l'inscription
document.getElementById('register-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const user = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        firstname: document.getElementById('firstname').value,
        lastname: document.getElementById('lastname').value,
        userType: document.querySelector('input[name="user-type"]:checked').value, // 'driver' ou 'passenger'
        // Les autres champs seront remplis plus tard dans le profil
        departurePoint: '',
        departureTime: '',
        arrivalTime: '',
        carBrand: '',
        carModel: '',
        seatsAvailable: '',
        avatar: 'images/default-avatar.png'
    };

    // Sauvegarder l'utilisateur
    localStorage.setItem('currentUser', JSON.stringify(user));
    // Rediriger vers la page de profil
    window.location.href = 'profile.html';
});




