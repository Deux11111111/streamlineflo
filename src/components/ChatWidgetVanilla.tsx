import React, { useEffect } from "react";

export default function ChatWidgetN8N() {
  useEffect(() => {
    // Configuration - make these props if you want more flexibility
    const config = {
      webhookUrl: "https://adrianzap.app.n8n.cloud/webhook/c803253c-f26b-4a80-83a5-53fad70dbdb6/chat",
      title: "Chat Support",
      subtitle: "How can I help you?",
      position: "bottom-right", // or "bottom-left"
      primaryColor: "#4f46e5",
      primaryHover: "#4338ca",
      darkColor: "#0b1220"
    };

    if (!config.webhookUrl) {
      console.error("n8n Chat Widget: Webhook URL is required");
      return;
    }

    // Generate session ID
    const sessionId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });

    // Create widget container
    const widgetContainer = document.createElement('div');
    widgetContainer.id = 'n8n-chat-widget';
    document.body.appendChild(widgetContainer);

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      #n8n-chat-widget {
        font-family: 'Poppins', sans-serif;
        position: fixed;
        ${config.position === 'bottom-right' ? 'right: 24px;' : 'left: 24px;'}
        bottom: 24px;
        z-index: 9999;
      }
      
      .n8n-chat-button {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: ${config.primaryColor};
        border: none;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transition: all 0.3s ease;
      }
      
      .n8n-chat-button:hover {
        background: ${config.primaryHover};
        transform: scale(1.05);
      }
      
      .n8n-chat-container {
        width: 380px;
        max-width: 90vw;
        height: 500px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        margin-bottom: 16px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        transform: translateY(20px);
        opacity: 0;
        transition: all 0.3s ease;
      }
      
      .n8n-chat-container.visible {
        transform: translateY(0);
        opacity: 1;
      }
      
      .n8n-chat-header {
        padding: 16px;
        background: ${config.primaryColor};
        color: white;
      }
      
      .n8n-chat-messages {
        flex: 1;
        padding: 16px;
        overflow-y: auto;
      }
      
      .n8n-message {
        margin-bottom: 12px;
        max-width: 80%;
        padding: 10px 14px;
        border-radius: 18px;
        font-size: 14px;
        line-height: 1.4;
        animation: fadeIn 0.3s ease;
      }
      
      .n8n-user-message {
        background: ${config.primaryColor};
        color: white;
        margin-left: auto;
        border-bottom-right-radius: 4px;
      }
      
      .n8n-bot-message {
        background: #f3f4f6;
        color: #111827;
        margin-right: auto;
        border-bottom-left-radius: 4px;
      }
      
      .n8n-chat-input-container {
        padding: 12px;
        border-top: 1px solid #eee;
        display: flex;
        gap: 8px;
      }
      
      .n8n-chat-input {
        flex: 1;
        padding: 12px 16px;
        border: 1px solid #ddd;
        border-radius: 24px;
        outline: none;
        font-size: 14px;
      }
      
      .n8n-chat-input:focus {
        border-color: ${config.primaryColor};
      }
      
      .n8n-send-button {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: ${config.darkColor};
        color: white;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .n8n-loading {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255,255,255,0.3);
        border-radius: 50%;
        border-top-color: white;
        animation: spin 1s ease-in-out infinite;
      }
      
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(6px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);

    // Widget HTML
    widgetContainer.innerHTML = `
      <div class="n8n-chat-container">
        <div class="n8n-chat-header">
          <h3 style="margin: 0">${config.title}</h3>
          <p style="margin: 4px 0 0; font-size: 13px">${config.subtitle}</p>
        </div>
        <div class="n8n-chat-messages" id="n8n-chat-messages">
          <div style="text-align: center; color: #777; margin-top: 40px">How can I help you today?</div>
        </div>
        <div class="n8n-chat-input-container">
          <input type="text" class="n8n-chat-input" id="n8n-chat-input" placeholder="Type your message..." />
          <button class="n8n-send-button" id="n8n-send-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
      <button class="n8n-chat-button" id="n8n-chat-button">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"></path>
        </svg>
      </button>
    `;

    // DOM elements
    const chatButton = document.getElementById('n8n-chat-button');
    const chatContainer = document.querySelector('.n8n-chat-container');
    const chatMessages = document.getElementById('n8n-chat-messages');
    const chatInput = document.getElementById('n8n-chat-input');
    const sendButton = document.getElementById('n8n-send-button');

    // Toggle chat visibility
    let isChatVisible = false;
    chatButton.addEventListener('click', () => {
      isChatVisible = !isChatVisible;
      chatContainer.classList.toggle('visible', isChatVisible);
    });

    // Add message to chat
    function addMessage(text, isUser) {
      const messageElement = document.createElement('div');
      messageElement.className = `n8n-message ${isUser ? 'n8n-user-message' : 'n8n-bot-message'}`;
      messageElement.textContent = text;
      chatMessages.appendChild(messageElement);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Show loading indicator
    function showLoading() {
      const loadingElement = document.createElement('div');
      loadingElement.className = 'n8n-message n8n-bot-message';
      loadingElement.innerHTML = '<div class="n8n-loading"></div> Thinking...';
      loadingElement.id = 'n8n-loading-message';
      chatMessages.appendChild(loadingElement);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Hide loading indicator
    function hideLoading() {
      const loadingElement = document.getElementById('n8n-loading-message');
      if (loadingElement) {
        loadingElement.remove();
      }
    }

    // Send message to n8n webhook
    async function sendMessage() {
      const message = chatInput.value.trim();
      if (!message) return;

      // Add user message
      addMessage(message, true);
      chatInput.value = '';
      
      // Show loading
      showLoading();

      try {
        // Send to n8n webhook
        const response = await fetch(config.webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: message,  // n8n expects "text" field
            sessionId: sessionId
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        hideLoading();

        // Handle n8n response - can be text or JSON
        let reply = '';
        if (typeof data === 'string') {
          reply = data;
        } else if (data.response) {
          reply = data.response;
        } else if (data.text) {
          reply = data.text;
        } else if (data.message) {
          reply = data.message;
        } else {
          reply = "I received your message but didn't understand the response format.";
        }

        addMessage(reply, false);
      } catch (error) {
        hideLoading();
        addMessage("Sorry, there was an error processing your request.", false);
        console.error('Error sending message to n8n:', error);
      }
    }

    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });

    // Cleanup function
    return () => {
      if (widgetContainer) {
        widgetContainer.remove();
      }
      if (style) {
        style.remove();
      }
    };
  }, []);

  return null;
}
