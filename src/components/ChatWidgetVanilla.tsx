<!-- YOUR EXACT WIDGET HTML -->
<div id="lw-chat-widget">
  <button id="lw-chat-toggle">Chat</button>
  <div id="lw-chat-bubble" style="display:none">
    <div id="lw-chat-messages"></div>
    <input id="lw-chat-input" placeholder="Type a message..." />
  </div>
</div>

<!-- n8n chat script -->
<script type="module">
  import { createChat } from 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';

  const chatContainer = document.createElement('div');
  chatContainer.style.display = 'none'; // hide default container

  document.body.appendChild(chatContainer);

  const chat = createChat({
    webhookUrl: 'YOUR_PRODUCTION_WEBHOOK_URL',
    container: chatContainer
  });

  // Forward messages from your existing input
  const input = document.getElementById('lw-chat-input');
  const messages = document.getElementById('lw-chat-messages');

  input.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter' && input.value.trim()) {
      const text = input.value;
      messages.innerHTML += `<div class="user-msg">${text}</div>`;
      input.value = '';

      // Send to n8n
      const reply = await chat.sendMessage(text);
      messages.innerHTML += `<div class="bot-msg">${reply}</div>`;
    }
  });

  // Toggle bubble
  document.getElementById('lw-chat-toggle').addEventListener('click', () => {
    const bubble = document.getElementById('lw-chat-bubble');
    bubble.style.display = bubble.style.display === 'none' ? 'block' : 'none';
  });
</script>

                  
