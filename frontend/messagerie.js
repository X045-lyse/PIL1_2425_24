document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    alert("Vous devez être connecté pour accéder à la messagerie.");
    window.location.href = "connexion.html";
    return;
  }

  const messageForm = document.getElementById("messageForm");
  const messageInput = document.getElementById("messageInput");
  const messagesContainer = document.getElementById("messagesContainer");

  // Charger les messages de localStorage
  let messages = JSON.parse(localStorage.getItem("messages")) || [];

  // Afficher les messages
  function afficherMessages() {
    messagesContainer.innerHTML = "";

    messages.forEach(msg => {
      const div = document.createElement("div");
      div.classList.add("message");

      if (msg.auteur === currentUser.email) {
        div.classList.add("envoye");
      } else {
        div.classList.add("recu");
      }

      div.textContent = `${msg.auteur}: ${msg.texte}`;
      messagesContainer.appendChild(div);
    });

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Envoyer un message
  messageForm.addEventListener("submit", e => {
    e.preventDefault();
    const texte = messageInput.value.trim();
    if (!texte) return;

    const nouveauMessage = {
      auteur: currentUser.email,
      texte: texte,
      date: new Date().toISOString(),
    };

    messages.push(nouveauMessage);
    localStorage.setItem("messages", JSON.stringify(messages));
    messageInput.value = "";
    afficherMessages();
  });

  // Initialiser
  afficherMessages();
});
