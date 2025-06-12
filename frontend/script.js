


















document.addEventListener('DOMContentLoaded', function() {
    // Sample data for demonstration
    const sampleRides = [
        {
            id: 1,
            type: 'driver',
            driver: {
                name: 'Jean Dupont',
                avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
                rating: 4.8
            },
            departure: 'Cotonou, Stade de l'Amitié',
            arrival: 'IFRI, Université d'Abomey-Calavi',
            date: '2025-06-15',
            time: '07:30',
            seats: 3,
            price: 'Gratuit',
            notes: 'Trajet direct, pas de détours'
        },
        {
            id: 2,
            type: 'driver',
            driver: {
                name: 'Marie Lawson',
                avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
                rating: 4.9
            },
            departure: 'Abomey-Calavi, PK3',
            arrival: 'IFRI, Université d'Abomey-Calavi',
            date: '2025-06-15',
            time: '08:00',
            seats: 2,
            price: 'Gratuit',
            notes: 'Petite voiture, peu de bagages'
        },
        {
            id: 3,
            type: 'passenger',
            passenger: {
                name: 'Koffi Adjo',
                avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
                rating: 4.5
            },
            departure: 'Godomey, Carrefour SIAF',
            arrival: 'IFRI, Université d'Abomey-Calavi',
            date: '2025-06-15',
            time: '07:45',
            seats: 1,
            price: 'Partage frais',
            notes: 'Disponible tous les jours de la semaine'
        },
        {
            id: 4,
            type: 'driver',
            driver: {
                name: 'Aïcha Bello',
                avatar: 'https://randomuser.me/api/portraits/women/63.jpg',
                rating: 4.7
            },
            departure: 'Cotonou, Ganhi',
            arrival: 'IFRI, Université d'Abomey-Calavi
            date: '2025-06-16',
            time: '07:15',
            seats: 4,
            price: 'Gratuit',
            notes: 'Passage par Akassato'
        }
            id: 5,
            type: 'passenger',
            passenger: {
                name: 'Marc Tossa',
                avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
                rating: 4.3
            },
            departure: 'Calavi, Université',
            arrival: 'IFRI, Université d'Abomey-Calavi'
            date: '2025-06-16'
            time: '08:30'
            seats: 1,
            price: 'Gratuit',
            notes: 'Juste pour aujourd'hui'
    
    ];

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

    // Current filter state
    let currentFilter = 'all';

    // Initialize the page
    function init() {
        displayRides(sampleRides);
        setupEventListeners();
        setDefaultDate();
    }

    // Set default date to today in date inputs
    function setDefaultDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('date').value = today;
        document.getElementById('publishDate').value = today;
    }

    // Display rides in the UI
    function displayRides(rides) {
        ridesContainer.innerHTML = '';
        
        rides.forEach(ride => {
            // Apply filter
            if (currentFilter === 'drivers' && ride.type !== 'driver') return;
            if (currentFilter === 'passengers' && ride.type !== 'passenger') return;
            
            const rideCard = document.createElement('div');
            rideCard.className = 'col-md-6 col-lg-4';
            
            const user = ride.type === 'driver' ? ride.driver : ride.passenger;
            
            rideCard.innerHTML = `
                <div class="card ride-card shadow-sm" data-id="${ride.id}">
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
                showRideDetails(rideId);
            });
        });
    }

    // Render rating stars
    function renderRatingStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        let stars = '';
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="bi bi-star-fill"></i>';
        }
        
        if (hasHalfStar) {
            stars += '<i class="bi bi-star-half"></i>';
        }
        
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="bi bi-star"></i>';
        }
        
        return stars;
    }

    // Format date for display
    function formatDate(dateString) {
        const options = { weekday: 'short', day: 'numeric', month: 'short' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    }

    // Show ride details in modal
    function showRideDetails(rideId) {
        const ride = sampleRides.find(r => r.id === rideId);
        if (!ride) return;
        
        const user = ride.type === 'driver' ? ride.driver : ride.passenger;
        
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
        // Search form submission
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // In a real app, this would filter the rides based on search criteria
            alert('Fonctionnalité de recherche à implémenter');
        });
        
        // Publish form submission
        publishForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const rideType = document.querySelector('input[name="rideType"]:checked').value;
            const departure = document.getElementById('publishDeparture').value;
            const arrival = document.getElementById('publishArrival').value;
            const date = document.getElementById('publishDate').value;
            const time = document.getElementById('publishTime').value;
            const seats = document.getElementById('publishSeats').value;
            const notes = document.getElementById('publishNotes').value;
            
            // Validate inputs
            if (!departure || !arrival || !date || !time || (rideType === 'offer' && !seats)) {
                alert('Veuillez remplir tous les champs obligatoires');
                return;
            }
            
            // In a real app, this would send the data to the server
            alert('Trajet publié avec succès! (Fonctionnalité à implémenter)');
            publishForm.reset();
            setDefaultDate();
        });
        
        // Filter change events
        filterAll.addEventListener('change', function() {
            if (this.checked) {
                currentFilter = 'all';
                displayRides(sampleRides);
            }
        });
        
        filterDrivers.addEventListener('change', function() {
            if (this.checked) {
                currentFilter = 'drivers';
                displayRides(sampleRides);
            }
        });
        
        filterPassengers.addEventListener('change', function() {
            if (this.checked) {
                currentFilter = 'passengers';
                displayRides(sampleRides);
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



    // Initialize the application
    init();
});