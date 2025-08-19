<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Custom Chat Widget</title>
<style>
  /* Chat Button */
  #chat-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: #4A90E2;
    color: white;
    border: none;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    cursor: pointer;
    font-size: 30px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  }

  /* Chat Widget Container */
  #chat-widget {
    position: fixed;
    bottom: 90px;
    right: 20px;
    width: 350px;
    max-height: 500px;
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    display: none;
    flex-direction: column;
    overflow: hidden;
    font-family: Arial, sans-serif;
  }

  /* Chat Header */
  #chat-header {
    background-color: #4A90E2;
    color: white;
    padding: 15px;
    font-size: 18px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  #chat-header button {
    background: none;
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
  }

  /* Chat Messages */
  #chat-messages {
    flex: 1;
    padding: 10px;
    overflow-y: auto;
    background-color: #f9f9f9;
  }

  .message {
    margin-bottom: 10px;
    padding: 8px 12px;
    border-radius: 12px;
    max-width: 80%;
    clear: both;
  }

  .user-message {
    background-color: #4A90E2;
    color: white;
    float: right;
  }

  .bot-message {
    background-color: #e0e0e0;
    color: black;
    float: left;
  }

  /* Chat Input */
  #chat-input-container {
    display: flex;
    padding: 10px;
    border-top: 1px solid #ddd;
    background-color: #fff;
  }

  #chat-input {
    flex: 1;
    padding: 10px;
    border-radius: 20px;
    border: 1px solid #ccc;
    outline: none;
  }

  #chat-send {
    margin-left: 10px;
    background-color: #4A90E2;
    border: none;
    color: white;
    padding: 0 15px;
    border-radius: 20px;
    cursor: pointer;
  }
</style>
</head>
<body>

<button id="chat-button">💬</button>

<div id="chat-widget">
  <div id="chat-header">
    Chat
    <button id="chat-close">✖</button>
  </div>
  <div id="chat-messages"></div>
  <div id="chat-input-container">
    <input type="text" id="chat-input" placeholder="Type a message...">
    <button id="chat-send">Send</button>
  </div>
</div>

<script>
  const chatButton = document.getElementById('chat-button');
  const chatWidget = document.getElementById('chat-widget');
  const chatClose = document.getElementById('chat-close');
  const chatSend = document.getElementById('chat-send');
  const chatInput = document.getElementById('chat-input');
  const chatMessages = document.getElementById('chat-messages');

  // Open chat
  chatButton.addEventListener('click', () => {
    chatWidget.style.display = 'flex';
    chatButton.style.display = 'none';
    chatInput.focus();
  });

  // Close chat
  chatClose.addEventListener('click', () => {
    chatWidget.style.display = 'none';
    chatButton.style.display = 'block';
  });

  // Send message function
  function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    // Add user message
    const userMsg = document.createElement('div');
    userMsg.className = 'message user-message';
    userMsg.textContent = text;
    chatMessages.appendChild(userMsg);

    chatInput.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Simulate bot response
    setTimeout(() => {
      const botMsg = document.createElement('div');
      botMsg.className = 'message bot-message';
      botMsg.textContent = 'This is a bot response.';
      chatMessages.appendChild(botMsg);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 500);
  }

  chatSend.addEventListener('click', sendMessage);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
</script>

</body>
</html>
