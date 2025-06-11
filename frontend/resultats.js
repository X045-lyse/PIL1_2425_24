const donnees = [
  {
    nom: "Jean K.",
    photo: "https://randomuser.me/api/portraits/men/12.jpg",
    depart: "Agla",
    arrivee: "IFRI",
    heure: "07:30",
    role: "Conducteur",
    places: 3
  },
  {
    nom: "Fatou A.",
    photo: "https://randomuser.me/api/portraits/women/45.jpg",
    depart: "Calavi",
    arrivee: "IFRI",
    heure: "07:45",
    role: "Passager"
  },
  {
    nom: "Marc D.",
    photo: "https://randomuser.me/api/portraits/men/33.jpg",
    depart: "Kouhounou",
    arrivee: "IFRI",
    heure: "08:00",
    role: "Conducteur",
    places: 2
  }
];

const container = document.getElementById("resultats");

donnees.forEach((personne) => {
  const card = document.createElement("div");
  card.className = "card";

  const img = document.createElement("img");
  img.src = personne.photo;

  const info = document.createElement("div");
  info.className = "info";
  info.innerHTML = `
    <h3>${personne.nom}</h3>
    <p><strong>${personne.role}</strong></p>
    <p>${personne.depart} → ${personne.arrivee}</p>
    <p>Départ : ${personne.heure}</p>
    ${personne.role === "Conducteur" ? `<p>Places : ${personne.places}</p>` : ""}
  `;

  const btn = document.createElement("button");
  btn.className = "btn";
  btn.textContent = "Contacter";
  btn.onclick = () => alert(`Contacter ${personne.nom} (simulé)`);

  card.appendChild(img);
  card.appendChild(info);
  card.appendChild(btn);
  container.appendChild(card);
});
