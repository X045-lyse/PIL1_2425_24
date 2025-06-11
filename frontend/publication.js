const typeSelect = document.getElementById("type");
const conducteurFields = document.getElementById("conducteurFields");
const trajetForm = document.getElementById("trajetForm");
const message = document.getElementById("message");

// Affichage conditionnel
typeSelect.addEventListener("change", () => {
  conducteurFields.style.display = typeSelect.value === "conducteur" ? "block" : "none";
});

// Soumission du formulaire
trajetForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const role = typeSelect.value;
  const depart = document.getElementById("depart").value.trim();
  const arrivee = document.getElementById("arrivee").value.trim();
  const heure = document.getElementById("heure").value;
  const places = document.getElementById("places").value;

  if (!role || !depart || !arrivee || !heure || (role === "conducteur" && !places)) {
    message.style.color = "red";
    message.textContent = "Veuillez remplir tous les champs requis.";
    return;
  }

  message.style.color = "green";
  message.textContent = "Trajet publié avec succès !";
  this.reset();
  conducteurFields.style.display = "none";
});
