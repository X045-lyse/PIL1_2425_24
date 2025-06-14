document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "connexion.html";
    return;
  }

  // Éléments du DOM
  const profileForm = document.getElementById('profile-form');
  const profileName = document.getElementById('profile-name');
  const lastnameInput = document.getElementById('lastname');
  const firstnameInput = document.getElementById('firstname');
  const departurePointInput = document.getElementById('departure-point');
  const departureTimeInput = document.getElementById('departure-time');
  const arrivalTimeInput = document.getElementById('arrival-time');
  const carBrandInput = document.getElementById('car-brand');
  const carModelInput = document.getElementById('car-model');
  const seatsAvailableInput = document.getElementById('seats-available');
  const avatarUpload = document.getElementById('avatar-upload');
  const profileAvatar = document.getElementById('profile-avatar');
  const cancelBtn = document.getElementById('cancel-btn');
  const logoutBtn = document.getElementById('logout');
  const driverSection = document.getElementById('driver-section');

  // Charger les infos utilisateur
  let user = {};
  try {
    const res = await fetch("http://localhost:5000/auth/profil", {
      headers: { "Authorization": "Bearer " + token }
    });
    user = await res.json();

    // Remplir le formulaire avec les données de l'utilisateur
    function fillUserData() {
        // Nom et prénom (obligatoires, venant de l'inscription)
        profileName.textContent = `${user.firstname} ${user.lastname}`;
        lastnameInput.value = user.lastname;
        firstnameInput.value = user.firstname;
        
        // Autres informations (peuvent être vides initialement)
        departurePointInput.value = user.departurePoint || '';
        departureTimeInput.value = user.departureTime || '';
        arrivalTimeInput.value = user.arrivalTime || '';
        
        // Gestion conducteur/passager
        if (user.userType === 'driver') {
            // Afficher la section véhicule
            driverSection.style.display = 'block';
            carBrandInput.value = user.carBrand || '';
            carModelInput.value = user.carModel || '';
            seatsAvailableInput.value = user.seatsAvailable || '';
        } else {
            // Cacher la section véhicule pour les passagers
            driverSection.style.display = 'none';
        }
        
        // Photo de profil (facultative)
        if (user.avatar) {
            profileAvatar.src = user.avatar;
        }
    }

    fillUserData();

  } catch (err) {
    alert("Erreur lors du chargement du profil.");
  }

  // Gestionnaire d'upload de photo
  avatarUpload.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = function(event) {
              profileAvatar.src = event.target.result;
              // Sauvegarder l'image dans le profil utilisateur
              user.avatar = event.target.result;
              saveUserData();
          };
          reader.readAsDataURL(file);
      }
  });

  // Modification du profil
  profileForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const data = {
      nom: lastnameInput.value,
      prenom: firstnameInput.value,
      point_depart: departurePointInput.value,
      horaire: departureTimeInput.value,
      horaire_arrivee: arrivalTimeInput.value,
      vehicule_marque: carBrandInput.value,
      vehicule_modele: carModelInput.value,
      vehicule_places: seatsAvailableInput.value
    };
    try {
      const res = await fetch(`http://localhost:5000/auth/update/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
        },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        alert("Profil mis à jour !");
        location.reload();
      } else {
        alert("Erreur lors de la mise à jour.");
      }
    } catch {
      alert("Erreur réseau.");
    }
  });

  // Bouton Annuler
  cancelBtn.addEventListener('click', function() {
      fillUserData(); // Réinitialiser les champs
  });

  // Bouton Déconnexion
  logoutBtn.addEventListener('click', function() {
      // Effacer les données de session
      localStorage.removeItem('currentUser');
      sessionStorage.removeItem('currentUser');
      // Rediriger vers la page de connexion
      window.location.href = 'login.html';
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




