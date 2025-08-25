<!-- Premium Chatbot Widget with n8n functionality -->
<div id="premium-chatbot"></div>
<script type="module">
  // Chatbot CSS Styles (exactly your premium design)
  const styles = `
    .pc-chatbot-container { position: fixed; bottom: 24px; right: 24px; z-index: 9999; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
    .pc-chat-widget { width: 384px; height: 500px; background: rgba(45, 55, 72, 0.95); backdrop-filter: blur(20px); border: 1px solid rgba(102, 126, 234, 0.3); border-radius: 16px; box-shadow: 0 20px 40px -10px rgba(102, 126, 234, 0.3); margin-bottom: 16px; overflow: hidden; display: none; animation: pc-scale-in 0.2s ease-out; }
    .pc-chat-widget.open { display: block; }
    .pc-chat-header { background: linear-gradient(135deg, rgb(102, 126, 234), rgb(192, 132, 252)); padding: 16px; display: flex; align-items: center; justify-content: space-between; }
    .pc-bot-info { display: flex; align-items: center; gap: 12px; }
    .pc-bot-avatar { width: 40px; height: 40px; background: rgba(255, 255, 255, 0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; position: relative; }
    .pc-bot-avatar::after { content: ''; position: absolute; top: -4px; right: -4px; width: 16px; height: 16px; background: #10B981; border-radius: 50%; border: 2px solid rgba(45, 55, 72, 1); animation: pc-pulse 2s ease-in-out infinite; }
    .pc-bot-name { color: white; font-weight: 600; margin: 0; font-size: 14px; }
    .pc-bot-status { color: rgba(255, 255, 255, 0.8); font-size: 12px; margin: 0; }
    .pc-close-btn { background: none; border: none; color: white; cursor: pointer; padding: 8px; border-radius: 4px; transition: all 0.2s; }
    .pc-close-btn:hover { background: rgba(255, 255, 255, 0.2); }
    .pc-messages { height: 350px; padding: 16px; overflow-y: auto; background: rgba(45, 55, 72, 1); }
    .pc-message { margin-bottom: 16px; animation: pc-slide-up 0.3s ease-out; }
    .pc-message.user { text-align: right; }
    .pc-message-content { display: inline-block; max-width: 80%; padding: 12px 16px; border-radius: 16px; font-size: 14px; line-height: 1.4; }
    .pc-message.user .pc-message-content { background: linear-gradient(135deg, rgb(102, 126, 234), rgb(192, 132, 252)); color: white; }
    .pc-message.bot .pc-message-content { background: rgba(55, 65, 81, 1); color: rgba(255, 255, 255, 0.9); }
    .pc-message-time { font-size: 11px; opacity: 0.6; margin-top: 4px; }
    .pc-input-area { padding: 16px; border-top: 1px solid rgba(102, 126, 234, 0.2); background: rgba(45, 55, 72, 1); display: flex; gap: 8px; }
    .pc-input { flex: 1; background: rgba(55, 65, 81, 1); border: 1px solid rgba(102, 126, 234, 0.3); border-radius: 8px; padding: 12px; color: white; font-size: 14px; outline: none; }
    .pc-input:focus { border-color: rgb(102, 126, 234); box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2); }
    .pc-input::placeholder { color: rgba(255, 255, 255, 0.5); }
    .pc-send-btn { background: linear-gradient(135deg, rgb(102, 126, 234), rgb(192, 132, 252)); border: none; border-radius: 8px; padding: 12px; color: white; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
    .pc-send-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
    .pc-send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .pc-toggle-btn { width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, rgb(102, 126, 234), rgb(192, 132, 252)); border: none; color: white; cursor: pointer; box-shadow: 0 0 30px rgba(102, 126, 234, 0.4); transition: all 0.3s; display: flex; align-items: center; justify-content: center; position: relative; }
    .pc-toggle-btn:hover { transform: scale(1.1); }
    .pc-toggle-btn.open { transform: scale(0.9); }
    @keyframes pc-scale-in { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
    @keyframes pc-slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes pc-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
    @media (max-width: 768px) { .pc-chat-widget { width: calc(100vw - 48px); height: calc(100vh - 100px); bottom: 80px; right: 24px; } }
  `;
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);

  // Premium Chatbot with n8n logic
  class PremiumChatbot {
    constructor() {
      this.isOpen = false;
      this.webhookUrl = "https://streamline1.app.n8n.cloud/webhook/c803253c-f26b-4a80-83a5-53fad70dbdb6/chat"; // your n8n webhook
      this.sessionId = crypto.randomUUID();
      this.messages = [
        { id: '1', content: "👋 Hi! Welcome to StreamlineFlo", sender: 'bot', timestamp: new Date() }
      ];
      this.render();
    }

    render() {
      const container = document.getElementById('premium-chatbot');
      if (!container) return;

      container.innerHTML = `
        <div class="pc-chatbot-container">
          <div class="pc-chat-widget ${this.isOpen ? 'open' : ''}">
            <div class="pc-chat-header">
              <div class="pc-bot-info">
                <div class="pc-bot-avatar">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 8V4H8"/>
                    <rect width="16" height="12" x="4" y="8" rx="2"/>
                    <path d="M2 14h2"/>
                    <path d="M20 14h2"/>
                    <path d="M15 13v2"/>
                    <path d="M9 13v2"/>
                  </svg>
                </div>
                <div>
                  <h3 class="pc-bot-name">Your Assistant</h3>
                  <p class="pc-bot-status">Online</p>
                </div>
              </div>
              <button class="pc-close-btn" onclick="premiumChatbot.toggleChat()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div class="pc-messages" id="pc-messages">${this.renderMessages()}</div>
            <div class="pc-input-area">
              <input type="text" class="pc-input" id="pc-input" placeholder="Type your message..." onkeypress="premiumChatbot.handleKeyPress(event)">
              <button class="pc-send-btn" onclick="premiumChatbot.sendMessage()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                </svg>
              </button>
            </div>
          </div>
          <button class="pc-toggle-btn ${this.isOpen ? 'open' : ''}" onclick="premiumChatbot.toggleChat()">
            ${this.isOpen ? 
              '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>' :
              '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>'
            }
          </button>
        </div>
      `;
    }

    renderMessages() {
      return this.messages.map(m => `
        <div class="pc-message ${m.sender}">
          <div class="pc-message-content">
            ${m.content}
            <div class="pc-message-time">${m.timestamp.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
          </div>
        </div>
      `).join('');
    }

    toggleChat() {
      this.isOpen = !this.isOpen;
      this.render();
      if(this.isOpen) setTimeout(()=>document.getElementById('pc-input')?.focus(),100);
    }

    handleKeyPress(e) { if(e.key==='Enter') this.sendMessage(); }

    async sendMessage() {
      const input = document.getElementById('pc-input');
      if(!input || !input.value.trim()) return;

      const messageText = input.value.trim();
      input.value = '';

      this.messages.push({ id: Date.now().toString(), content: messageText, sender: 'user', timestamp: new Date() });
      this.render();
      this.scrollToBottom();

      // Send to n8n
      const payload = { sessionId: this.sessionId, action: 'sendMessage', chatInput: messageText };
      try {
        const res = await fetch(this.webhookUrl, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
        const responseData = await res.text();
        let aiResponse = responseData;
        try { 
          const jsonResponse = JSON.parse(responseData);
          aiResponse = jsonResponse.output || jsonResponse.text || jsonResponse.message || jsonResponse.response || responseData;
        } catch{}
        this.messages.push({ id: (Date.now()+1).toString(), content: aiResponse, sender: 'bot', timestamp: new Date() });
        this.render();
        this.scrollToBottom();
      } catch(err) {
        this.messages.push({ id: (Date.now()+1).toString(), content: "Sorry, connection error. Try again.", sender:'bot', timestamp: new Date() });
        this.render(); this.scrollToBottom();
      }
    }

    scrollToBottom() { setTimeout(()=>{const m=document.getElementById('pc-messages'); if(m)m.scrollTop=m.scrollHeight;},100); }
  }

  window.premiumChatbot = new PremiumChatbot();
</script>
