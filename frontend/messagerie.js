const conversationsList = document.getElementById('conversationsList');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const chatInputArea = document.querySelector('.chat-input-area');
const chatUserName = document.querySelector('.chat-user-name');
const chatUserPic = document.querySelector('.chat-user-pic');

let conversations = [];
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

// Change la conversation active et charge les messages
async function selectConversation(id) {
  activeConversation = conversations.find(c => c.id === id);
  const token = localStorage.getItem("token");
  const resUser = await fetch("http://localhost:5000/auth/profil", {
    headers: { "Authorization": "Bearer " + token }
  });
  const user = await resUser.json();
  const res = await fetch(`http://localhost:5000/message/conversation/${user.id}/${id}`, {
    headers: { "Authorization": "Bearer " + token }
  });
  const messages = await res.json();
  activeConversation.messages = messages.map(msg => ({
    text: msg.texte,
    fromMe: msg.expediteur_id === user.id
  }));
  renderConversations();
  renderMessages();
  chatInput.focus();
}

// Envoi du message
sendBtn.onclick = async () => {
  const text = chatInput.value.trim();
  if (!text || !activeConversation) return;
  const token = localStorage.getItem("token");
  const resUser = await fetch("http://localhost:5000/auth/profil", {
    headers: { "Authorization": "Bearer " + token }
  });
  const user = await resUser.json();
  await fetch("http://localhost:5000/message/envoyer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({
      expediteur_id: user.id,
      destinataire_id: activeConversation.id,
      texte: text
    })
  });
  chatInput.value = "";
  // Recharge les messages
  selectConversation(activeConversation.id);
};

// Envoi aussi au "Entrée"
chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendBtn.click();
  }
});

// Charge les contacts matchés et les affiche dans la sidebar
document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "connexion.html";
    return;
  }

  const resUser = await fetch("http://localhost:5000/auth/profil", {
    headers: { "Authorization": "Bearer " + token }
  });
  const user = await resUser.json();
  const resProfil = await fetch(`http://localhost:5000/message/utilisateur/${user.id}`);
  const profil = await resProfil.json();

  const picSidebar = document.querySelector('.profile-pic-placeholder');
  if (picSidebar) {
    picSidebar.style.backgroundImage = `url('${profil.photo}')`;
    picSidebar.style.backgroundSize = "cover";
    picSidebar.style.backgroundPosition = "center";
    picSidebar.style.border = "2px solid #2563eb";
    picSidebar.style.cursor = "pointer";
    picSidebar.title = "Voir mon profil";
    picSidebar.onclick = () => window.location.href = "profil.html";
  }

  const res = await fetch(`http://localhost:5000/matching/contacts/${user.id}`);
  const contacts = await res.json();

  conversations = [];
  for (let contactId of contacts) {
    const resContact = await fetch(`http://localhost:5000/message/utilisateur/${contactId}`);
    if (!resContact.ok) continue;
    const contact = await resContact.json();
    if (!contact.id) continue;
    conversations.push({
      id: contact.id,
      userName: contact.prenom + " " + contact.nom,
      userPhoto: contact.photo, // <-- c'est ici que l'avatar est pris
      lastMessage: "",
      unreadCount: 0,
      messages: []
    });
  }
  renderConversations();
  if (conversations.length > 0) {
    selectConversation(conversations[0].id);
  }
});
