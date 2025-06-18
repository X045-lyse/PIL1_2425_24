document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "connexion.html";
    return;
  }
  // Récupère l'utilisateur connecté
  const resUser = await fetch("http://localhost:5000/auth/profil", {
    headers: { "Authorization": "Bearer " + token }
  });
  const user = await resUser.json();

  // Charge les trajets
  const resTrajets = await fetch(`http://localhost:5000/trajet/conducteur/${user.id}`);
  const trajets = await resTrajets.json();
  const ulTrajets = document.getElementById("mes-trajets");
  ulTrajets.innerHTML = trajets.length
    ? trajets.map(t =>
        `<li>
          ${t.point_depart} → ${t.point_arrivee} le ${t.date} à ${t.heure_depart}
          <button onclick="supprimerTrajet(${t.id})">Supprimer</button>
          <button onclick="modifierTrajet(${t.id})">Modifier</button>
        </li>`
      ).join("")
    : "<li>Aucun trajet publié</li>";

  // Charge les demandes
  const resDemandes = await fetch(`http://localhost:5000/demande/passager/${user.id}`);
  const demandes = await resDemandes.json();
  const ulDemandes = document.getElementById("mes-demandes");
  ulDemandes.innerHTML = demandes.length
    ? demandes.map(d =>
        `<li>
          ${d.point_depart} → ${d.point_arrivee} le ${d.date} à ${d.heure_souhaitee}
          <button onclick="supprimerDemande(${d.id})">Supprimer</button>
          <button onclick="modifierDemande(${d.id})">Modifier</button>
        </li>`
      ).join("")
    : "<li>Aucune demande publiée</li>";

  // Charge les matchings en attente pour l'utilisateur connecté
  const resMatchings = await fetch(`http://localhost:5000/matching/utilisateur/${user.id}`);
  const matchings = await resMatchings.json();
  const ulMatchings = document.getElementById("mes-matchings");
  ulMatchings.innerHTML = matchings.length
    ? matchings.map(m =>
        `<li>
          Trajet: ${m.trajet.point_depart} → ${m.trajet.point_arrivee} avec ${m.demandeur.prenom} ${m.demandeur.nom}
          <span>Status: ${m.status}</span>
          ${m.status === "en attente" ? `<button onclick="accepterMatching(${m.id})">Accepter</button>` : ""}
        </li>`
      ).join("")
    : "<li>Aucun matching en attente</li>";

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
  const avatarImg = document.getElementById("profile-avatar");
  if (user.photo) {
    avatarImg.src = user.photo;
  } else if (user.email) {
    avatarImg.src = getGravatarUrl(user.email);
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

document.getElementById("logout-btn").addEventListener("click", function(e) {
  e.preventDefault();
  localStorage.removeItem("token");
  window.location.href = "connexion.html";
});

function md5(string) {
  // Fonction md5 minimale (tu peux utiliser une vraie lib pour la prod)
  return CryptoJS.MD5(string).toString();
}

function getGravatarUrl(email, size = 128) {
  const hash = md5(email.trim().toLowerCase());
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
}

// Fonctions de suppression
async function supprimerDemande(id) {
  const token = localStorage.getItem("token");
  if (!confirm("Supprimer cette demande ?")) return;
  await fetch(`http://localhost:5000/demande/supprimer/${id}`, {
    method: "DELETE",
    headers: { "Authorization": "Bearer " + token }
  });
  window.location.reload();
}

async function supprimerTrajet(id) {
  const token = localStorage.getItem("token");
  if (!confirm("Supprimer ce trajet ?")) return;
  await fetch(`http://localhost:5000/trajet/supprimer/${id}`, {
    method: "DELETE",
    headers: { "Authorization": "Bearer " + token }
  });
  window.location.reload();
}

async function modifierTrajet(id) {
  // Récupère les infos du trajet
  const res = await fetch(`http://localhost:5000/trajet/${id}`);
  const trajet = await res.json();
  // Pré-remplis le formulaire (ou affiche un modal)
  // Exemple simple :
  alert(`Pré-remplir le formulaire avec :\nDépart : ${trajet.point_depart}\nArrivée : ${trajet.point_arrivee}\nDate : ${trajet.date}\nHeure : ${trajet.heure_depart}`);
  // Ici tu peux ouvrir un modal ou rediriger vers une page de modification
}

async function modifierDemande(id) {
  const res = await fetch(`http://localhost:5000/demande/${id}`);
  const demande = await res.json();
  alert(`Pré-remplir le formulaire avec :\nDépart : ${demande.point_depart}\nArrivée : ${demande.point_arrivee}\nDate : ${demande.date}\nHeure : ${demande.heure_souhaitee}`);
  // Idem, ouvre un modal ou une page de modification
}

async function accepterMatching(matchingId) {
  const res = await fetch(`http://localhost:5000/matching/accepter/${matchingId}`, {
    method: "PUT"
  });
  const result = await res.json();
  alert(result.message);
  window.location.reload();
}




