const conversationsList = document.getElementById('conversationsList');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const chatInputArea = document.querySelector('.chat-input-area');
const chatUserName = document.querySelector('.chat-user-name');
const chatUserPic = document.querySelector('.chat-user-pic');

let conversations = []; // Liste reçue du backend (à remplir)
let activeConversation = null;

// Affiche la liste des conversations dans la sidebar
function renderConversations() {
  conversationsList.innerHTML = '';
  conversations.forEach(conv => {
    const li = document.createElement('li');
    li.classList.add('conversation-item');
    if (activeConversation && conv.id === activeConversation.id) {
      li.classList.add('active');
    }

    // Photo
    const img = document.createElement('img');
    img.classList.add('conversation-pic');
    img.src = conv.userPhoto || 'https://via.placeholder.com/48?text=U';
    img.alt = conv.userName;
    li.appendChild(img);

    // Info
    const info = document.createElement('div');
    info.classList.add('conversation-info');

    const name = document.createElement('div');
    name.classList.add('conversation-name');
    name.textContent = conv.userName;
    info.appendChild(name);

    const lastMsg = document.createElement('div');
    lastMsg.classList.add('conversation-last-message');
    lastMsg.textContent = conv.lastMessage || '';
    info.appendChild(lastMsg);

    li.appendChild(info);

    // Badge unread
    if (conv.unreadCount && conv.unreadCount > 0) {
      const badge = document.createElement('div');
      badge.classList.add('unread-badge');
      badge.textContent = conv.unreadCount;
      li.appendChild(badge);
    }

    li.onclick = () => selectConversation(conv.id);
    conversationsList.appendChild(li);
  });
}

// Affiche les messages de la conversation active
function renderMessages() {
  chatMessages.innerHTML = '';
  if (!activeConversation) {
    chatUserName.textContent = "Sélectionnez une conversation";
    chatUserPic.style.backgroundImage = '';
    chatInputArea.style.display = 'none';

    const empty = document.createElement('p');
    empty.className = 'empty-chat';
    empty.textContent = 'Aucune conversation sélectionnée';
    chatMessages.appendChild(empty);
    return;
  }

  chatUserName.textContent = activeConversation.userName;
  chatUserPic.style.backgroundImage = `url(${activeConversation.userPhoto || 'https://via.placeholder.com/48?text=U'})`;
  chatInputArea.style.display = 'flex';

  activeConversation.messages.forEach(msg => {
    const div = document.createElement('div');
    div.classList.add('message');
    div.classList.add(msg.fromMe ? 'sent' : 'received');
    div.textContent = msg.text;
    chatMessages.appendChild(div);
  });

  // Scroll en bas
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Change la conversation active
function selectConversation(id) {
  activeConversation = conversations.find(c => c.id === id);
  renderConversations();
  renderMessages();
  chatInput.focus();
}

// Envoi du message (ici on appelle juste une fonction externe à compléter)
sendBtn.onclick = () => {
  const text = chatInput.value.trim();
  if (!text || !activeConversation) return;

  // Appeler la fonction backend d'envoi message ici
  // Exemple: sendMessageToBackend(activeConversation.id, text);

  // Vide le champ
  chatInput.value = '';
  chatInput.focus();
};

// Envoi aussi au "Entrée"
chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendBtn.click();
  }
});

// Exemple: fonction pour charger les conversations (backend fait)
// Ici on attend que Laure remplisse "conversations" avec les données réelles
function loadConversations(data) {
  conversations = data;
  renderConversations();
  // Optionnel: sélectionne la première conversation si elle existe
  if (conversations.length > 0) {
    selectConversation(conversations[0].id);
  }
}

// Exporter pour que backend puisse appeler loadConversations et autres
window.loadConversations = loadConversations;
window.selectConversation = selectConversation;

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "connexion.html";
    return;
  }

  // Charger les conversations
  async function loadConversations() {
    const res = await fetch("http://localhost:5000/message/conversations", {
      headers: { "Authorization": "Bearer " + token }
    });
    const conversations = await res.json();
    // ...affiche la liste dans la sidebar
  }

  // Charger les messages d'une conversation
  async function loadMessages(conversationId) {
    const res = await fetch(`http://localhost:5000/message/conversation/${conversationId}`, {
      headers: { "Authorization": "Bearer " + token }
    });
    const messages = await res.json();
    // ...affiche les messages dans la zone de chat
  }

  // Envoi d'un message
  document.getElementById("sendBtn").onclick = async () => {
    const text = document.getElementById("chatInput").value.trim();
    if (!text) return;
    // ...récupère l'id de la conversation ou du destinataire
    await fetch("http://localhost:5000/message/envoyer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({
        destinataire_id: /* à compléter */,
        texte: text
      })
    });
    document.getElementById("chatInput").value = "";
    // Recharge les messages
  };

  loadConversations();
});
