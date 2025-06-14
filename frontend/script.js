document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const ridesContainer = document.getElementById('ridesContainer');
    const searchForm = document.getElementById('searchForm');
    const publishForm = document.getElementById('publishForm');
    const filterAll = document.getElementById('filter-all');
    const filterDrivers = document.getElementById('filter-drivers');
    const filterPassengers = document.getElementById('filter-passengers');
    const seatsField = document.getElementById('seatsField');
    const offerType = document.getElementById('offerType');
    const requestType = document.getElementById('requestType');
    const rideDetailsModal = new bootstrap.Modal(document.getElementById('rideDetailsModal'));
    const rideDetailsContent = document.getElementById('rideDetailsContent');
    const contactRideUser = document.getElementById('contactRideUser');

    let currentFilter = 'all';
    let allRides = [];

    // Initialize the page
    async function init() {
        await fetchAndDisplayRides();
        setupEventListeners();
        setDefaultDate();
    }

    // Set default date to today in date inputs
    function setDefaultDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('date').value = today;
        document.getElementById('publishDate').value = today;
    }

    // Fetch rides from backend
    async function fetchAndDisplayRides() {
        ridesContainer.innerHTML = "<div class='text-center'>Chargement...</div>";
        let trajets = [];
        let demandes = [];
        try {
            const resTrajets = await fetch("http://localhost:5000/trajet/?page=1&per_page=20");
            trajets = await resTrajets.json();
        } catch {}
        try {
            const resDemandes = await fetch("http://localhost:5000/demande/?page=1&per_page=20");
            demandes = await resDemandes.json();
        } catch {}
        // Harmonise les données pour l'affichage
        allRides = [
            ...trajets.map(t => ({
                id: t.id,
                type: 'driver',
                user: {
                    name: t.conducteur_nom || "Conducteur",
                    avatar: t.conducteur_photo || "https://randomuser.me/api/portraits/men/1.jpg",
                    rating: t.conducteur_note || 4.5
                },
                departure: t.point_depart,
                arrival: t.point_arrivee,
                date: t.date,
                time: t.heure_depart,
                seats: t.nb_places,
                price: t.prix || 'Gratuit',
                notes: t.notes || ''
            })),
            ...demandes.map(d => ({
                id: d.id,
                type: 'passenger',
                user: {
                    name: d.passager_nom || "Passager",
                    avatar: d.passager_photo || "https://randomuser.me/api/portraits/men/2.jpg",
                    rating: d.passager_note || 4.5
                },
                departure: d.point_depart,
                arrival: d.point_arrivee,
                date: d.date,
                time: d.heure_souhaitee,
                seats: d.nb_places || 1,
                price: d.prix || 'À discuter',
                notes: d.notes || ''
            }))
        ];
        displayRides(allRides);
    }

    // Display rides in the UI
    function displayRides(rides) {
        ridesContainer.innerHTML = '';
        rides
            .filter(ride => {
                if (currentFilter === 'drivers') return ride.type === 'driver';
                if (currentFilter === 'passengers') return ride.type === 'passenger';
                return true;
            })
            .forEach(ride => {
                const rideCard = document.createElement('div');
                rideCard.className = 'col-md-6 col-lg-4';
                const user = ride.user;
                rideCard.innerHTML = `
                    <div class="card ride-card shadow-sm" data-id="${ride.id}" data-type="${ride.type}">
                        <div class="card-body">
                            <span class="ride-type ${ride.type}">${ride.type === 'driver' ? 'Conducteur' : 'Passager'}</span>
                            <div class="driver-info">
                                <img src="${user.avatar}" alt="${user.name}" class="driver-avatar">
                                <div>
                                    <h5 class="driver-name">${user.name}</h5>
                                    <div class="text-warning">
                                        ${renderRatingStars(user.rating)}
                                        <small class="text-muted">${user.rating}</small>
                                    </div>
                                </div>
                            </div>
                            <div class="route">
                                <i class="bi bi-geo-alt-fill route-icon"></i>
                                <div class="route-details">
                                    <div class="route-point">
                                        <span class="point-marker start"></span>
                                        <span>${ride.departure}</span>
                                    </div>
                                    <div class="route-point">
                                        <span class="point-marker end"></span>
                                        <span>${ride.arrival}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="ride-meta">
                                <div>
                                    <small class="text-muted">Date</small>
                                    <div>${formatDate(ride.date)}</div>
                                </div>
                                <div>
                                    <small class="text-muted">Heure</small>
                                    <div>${ride.time}</div>
                                </div>
                                <div>
                                    <small class="text-muted">${ride.type === 'driver' ? 'Places' : 'Personnes'}</small>
                                    <div>${ride.seats}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                ridesContainer.appendChild(rideCard);
            });

        // Add click event to all ride cards
        document.querySelectorAll('.ride-card').forEach(card => {
            card.addEventListener('click', function() {
                const rideId = parseInt(this.getAttribute('data-id'));
                const rideType = this.getAttribute('data-type');
                showRideDetails(rideId, rideType);
            });
        });
    }

    // Render rating stars
    function renderRatingStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        let stars = '';
        for (let i = 0; i < fullStars; i++) stars += '<i class="bi bi-star-fill"></i>';
        if (hasHalfStar) stars += '<i class="bi bi-star-half"></i>';
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) stars += '<i class="bi bi-star"></i>';
        return stars;
    }

    // Format date for display
    function formatDate(dateString) {
        if (!dateString) return '';
        const options = { weekday: 'short', day: 'numeric', month: 'short' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    }

    // Show ride details in modal
    function showRideDetails(rideId, rideType) {
        const ride = allRides.find(r => r.id === rideId && r.type === rideType);
        if (!ride) return;
        const user = ride.user;
        rideDetailsContent.innerHTML = `
            <div class="mb-4">
                <div class="d-flex align-items-center mb-3">
                    <img src="${user.avatar}" alt="${user.name}" class="rounded-circle me-3" width="80" height="80">
                    <div>
                        <h4 class="mb-1">${user.name}</h4>
                        <div class="text-warning mb-1">
                            ${renderRatingStars(user.rating)}
                            <span class="text-muted ms-1">${user.rating}</span>
                        </div>
                        <span class="badge bg-${ride.type === 'driver' ? 'primary' : 'success'}">
                            ${ride.type === 'driver' ? 'Conducteur' : 'Passager'}
                        </span>
                    </div>
                </div>
                <div class="card mb-3">
                    <div class="card-body">
                        <h5 class="card-title">Détails du trajet</h5>
                        <div class="mb-2">
                            <i class="bi bi-calendar me-2"></i>
                            <strong>Date:</strong> ${formatDate(ride.date)}
                        </div>
                        <div class="mb-2">
                            <i class="bi bi-clock me-2"></i>
                            <strong>Heure de départ:</strong> ${ride.time}
                        </div>
                        ${ride.type === 'driver' ? `
                            <div class="mb-2">
                                <i class="bi bi-people me-2"></i>
                                <strong>Places disponibles:</strong> ${ride.seats}
                            </div>
                        ` : `
                            <div class="mb-2">
                                <i class="bi bi-person me-2"></i>
                                <strong>Nombre de personnes:</strong> ${ride.seats}
                            </div>
                        `}
                        <div class="mb-2">
                            <i class="bi bi-cash-coin me-2"></i>
                            <strong>Participation:</strong> ${ride.price}
                        </div>
                    </div>
                </div>
                <div class="card mb-3">
                    <div class="card-body">
                        <h5 class="card-title">Itinéraire</h5>
                        <div class="route-point mb-2">
                            <span class="point-marker start me-2"></span>
                            <strong>Départ:</strong> ${ride.departure}
                        </div>
                        <div class="route-point">
                            <span class="point-marker end me-2"></span>
                            <strong>Arrivée:</strong> ${ride.arrival}
                        </div>
                    </div>
                </div>
                ${ride.notes ? `
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Notes supplémentaires</h5>
                            <p>${ride.notes}</p>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
        rideDetailsModal.show();
    }

    // Setup event listeners
    function setupEventListeners() {
        // Search form submission (à adapter selon tes critères)
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // À implémenter : filtrer allRides selon les critères du formulaire
            alert('Fonctionnalité de recherche à implémenter');
        });

        // Publish form submission
        publishForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const rideType = document.querySelector('input[name="rideType"]:checked').value;
            const departure = document.getElementById('publishDeparture').value;
            const arrival = document.getElementById('publishArrival').value;
            const date = document.getElementById('publishDate').value;
            const time = document.getElementById('publishTime').value;
            const seats = document.getElementById('publishSeats').value;
            const notes = document.getElementById('publishNotes').value;
            const token = localStorage.getItem("token");

            if (!departure || !arrival || !date || !time || (rideType === 'offer' && !seats)) {
                alert('Veuillez remplir tous les champs obligatoires');
                return;
            }

            // Géocodage des adresses
            const departCoords = await geocode(departure);
            const arriveeCoords = await geocode(arrival);
            if (!departCoords || !arriveeCoords) {
                alert("Impossible de géocoder l'adresse de départ ou d'arrivée.");
                return;
            }

            let url, data;
            if (rideType === 'offer') {
                url = "http://localhost:5000/trajet/ajouter";
                data = {
                    point_depart: departure,
                    point_arrivee: arrival,
                    date: date,
                    heure_depart: time,
                    nb_places: parseInt(seats),
                    notes: notes,
                    depart_lat: departCoords.lat,
                    depart_lng: departCoords.lng,
                    arrivee_lat: arriveeCoords.lat,
                    arrivee_lng: arriveeCoords.lng
                };
            } else {
                url = "http://localhost:5000/demande/ajouter";
                data = {
                    point_depart: departure,
                    point_arrivee: arrival,
                    date: date,
                    heure_souhaitee: time,
                    notes: notes,
                    depart_lat: departCoords.lat,
                    depart_lng: departCoords.lng,
                    arrivee_lat: arriveeCoords.lat,
                    arrivee_lng: arriveeCoords.lng
                };
            }

            try {
                const res = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token
                    },
                    body: JSON.stringify(data)
                });
                if (res.ok) {
                    alert('Annonce publiée avec succès !');
                    publishForm.reset();
                    setDefaultDate();
                    await fetchAndDisplayRides();
                } else {
                    const err = await res.json();
                    alert(err.error || "Erreur lors de la publication.");
                }
            } catch {
                alert("Erreur réseau.");
            }
        });

        // Filter change events
        filterAll.addEventListener('change', function() {
            if (this.checked) {
                currentFilter = 'all';
                displayRides(allRides);
            }
        });
        filterDrivers.addEventListener('change', function() {
            if (this.checked) {
                currentFilter = 'drivers';
                displayRides(allRides);
            }
        });
        filterPassengers.addEventListener('change', function() {
            if (this.checked) {
                currentFilter = 'passengers';
                displayRides(allRides);
            }
        });

        // Ride type change (show/hide seats field)
        offerType.addEventListener('change', function() {
            seatsField.style.display = 'block';
        });
        requestType.addEventListener('change', function() {
            seatsField.style.display = 'none';
        });

        // Contact button in ride details modal
        contactRideUser.addEventListener('click', function() {
            alert('Fonctionnalité de messagerie à implémenter');
            rideDetailsModal.hide();
        });
    }

    // Fonction de géocodage OpenStreetMap (Nominatim)
    async function geocode(address) {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
        const data = await res.json();
        if (data && data.length > 0) {
            return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
        }
        return null;
    }

    // Initialize the application
    init();
});