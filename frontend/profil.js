document.addEventListener('DOMContentLoaded', function() {
    // Récupérer l'utilisateur connecté depuis le localStorage ou sessionStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || 
                        JSON.parse(sessionStorage.getItem('currentUser'));

    // Si aucun utilisateur n'est connecté, rediriger vers la page de connexion
    if (!currentUser) {
        window.location.href = 'login.html';
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

    // Remplir le formulaire avec les données de l'utilisateur
    function fillUserData() {
        // Nom et prénom (obligatoires, venant de l'inscription)
        profileName.textContent = `${currentUser.firstname} ${currentUser.lastname}`;
        lastnameInput.value = currentUser.lastname;
        firstnameInput.value = currentUser.firstname;
        
        // Autres informations (peuvent être vides initialement)
        departurePointInput.value = currentUser.departurePoint || '';
        departureTimeInput.value = currentUser.departureTime || '';
        arrivalTimeInput.value = currentUser.arrivalTime || '';
        
        // Gestion conducteur/passager
        if (currentUser.userType === 'driver') {
            // Afficher la section véhicule
            driverSection.style.display = 'block';
            carBrandInput.value = currentUser.carBrand || '';
            carModelInput.value = currentUser.carModel || '';
            seatsAvailableInput.value = currentUser.seatsAvailable || '';
        } else {
            // Cacher la section véhicule pour les passagers
            driverSection.style.display = 'none';
        }
        
        // Photo de profil (facultative)
        if (currentUser.avatar) {
            profileAvatar.src = currentUser.avatar;
        }
    }

    // Gestionnaire d'upload de photo
    avatarUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                profileAvatar.src = event.target.result;
                // Sauvegarder l'image dans le profil utilisateur
                currentUser.avatar = event.target.result;
                saveUserData();
            };
            reader.readAsDataURL(file);
        }
    });

    // Soumission du formulaire
    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        saveUserData();
        alert('Profil mis à jour avec succès !');
    });

    // Fonction pour sauvegarder les données
    function saveUserData() {
        // Mettre à jour les données modifiables
        currentUser.departurePoint = departurePointInput.value;
        currentUser.departureTime = departureTimeInput.value;
        currentUser.arrivalTime = arrivalTimeInput.value;
        
        // Mettre à jour les infos véhicule si conducteur
        if (currentUser.userType === 'driver') {
            currentUser.carBrand = carBrandInput.value;
            currentUser.carModel = carModelInput.value;
            currentUser.seatsAvailable = seatsAvailableInput.value;
        }
        
        // Mettre à jour le stockage local
        if (localStorage.getItem('currentUser')) {
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        } else {
            sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        }
        
        // Mettre à jour le nom affiché
        profileName.textContent = `${currentUser.firstname} ${currentUser.lastname}`;
    }

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

    // Initialisation
    fillUserData();
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




