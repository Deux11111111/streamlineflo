<script>
class CustomN8NChat {
    constructor(options) {
        this.webhookUrl = options.webhookUrl;
        this.sessionId = this.generateSessionId();
        this.chatInputKey = options.chatInputKey || 'chatInput';
        this.chatSessionKey = options.chatSessionKey || 'sessionId';
        this.loadPreviousSession = options.loadPreviousSession !== false;
        
        this.toggleBtn = document.getElementById('toggleBtn');
        this.chatPanel = document.getElementById('chatPanel');
        this.messagesContainer = document.getElementById('messagesContainer');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.chatForm = document.getElementById('chatForm');
        this.typingIndicator = document.getElementById('typingIndicator');
        
        this.isOpen = false;
        this.isSending = false;
        
        this.init();
    }

    generateSessionId() {
        return 'session_' + Math.random().toString(36).substr(2, 9);
    }

    init() {
        this.setupEventListeners();
        if (this.loadPreviousSession) this.loadPreviousMessages();
    }

    setupEventListeners() {
        this.toggleBtn.addEventListener('click', () => this.toggleChat());
        this.chatForm.addEventListener('submit', e => {
            e.preventDefault();
            this.sendMessage();
        });
        this.messageInput.addEventListener('keydown', e => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.chatPanel.classList.add('show');
            this.toggleBtn.setAttribute('aria-expanded', 'true');
            this.toggleBtn.title = 'Close chat';
            this.toggleBtn.innerHTML = `
                <svg class="premium-icon" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
                <span class="premium-glow"></span>
            `;
            setTimeout(() => this.messageInput.focus(), 100);
        } else {
            this.chatPanel.classList.remove('show');
            this.toggleBtn.setAttribute('aria-expanded', 'false');
            this.toggleBtn.title = 'Open chat';
            this.toggleBtn.innerHTML = `
                <svg class="premium-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
                </svg>
                <span class="premium-glow"></span>
            `;
        }
        this.scrollToBottom();
    }

    scrollToBottom() {
        setTimeout(() => {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }, 50);
    }

    addMessage(text, role, animate = true) {
        const row = document.createElement('div');
        row.className = `premium-row ${role}`;
        if (animate) row.style.animation = 'slideIn 0.3s ease';
        const bubble = document.createElement('div');
        bubble.className = `premium-bubble ${role}`;
        bubble.textContent = text;
        row.appendChild(bubble);
        this.messagesContainer.appendChild(row);
        this.scrollToBottom();
    }

    showTyping() {
        this.typingIndicator.classList.add('show');
        this.scrollToBottom();
    }

    hideTyping() {
        this.typingIndicator.classList.remove('show');
    }

    setInputDisabled(disabled) {
        this.messageInput.disabled = disabled;
        this.sendButton.disabled = disabled;
        if (disabled) {
            this.sendButton.innerHTML = `<span class="premium-spin"></span><span style="margin-left:8px">Sending</span>`;
        } else {
            this.sendButton.innerHTML = `
                <svg class="premium-send-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>
                </svg>
                <span>Send</span>
            `;
        }
    }

    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message || this.isSending) return;

        this.addMessage(message, 'user');
        this.messageInput.value = '';
        this.setInputDisabled(true);
        this.showTyping();
        this.isSending = true;

        try {
            const response = await fetch(this.webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    [this.chatInputKey]: message,
                    [this.chatSessionKey]: this.sessionId
                })
            });

            if (!response.ok) throw new Error(`Server error: ${response.status}`);
            const data = await response.json();
            const reply = data.reply || 'Sorry, I could not process that.';

            this.addMessage(reply, 'assistant');
        } catch (err) {
            console.error(err);
            const errorRow = document.createElement('div');
            errorRow.className = 'error-message';
            errorRow.textContent = `Error sending message: ${err.message}`;
            this.messagesContainer.appendChild(errorRow);
            this.scrollToBottom();
        } finally {
            this.setInputDisabled(false);
            this.hideTyping();
            this.isSending = false;
        }
    }

    loadPreviousMessages() {
        const saved = JSON.parse(localStorage.getItem(this.sessionId) || '[]');
        saved.forEach(msg => this.addMessage(msg.text, msg.role, false));
    }
}

// Initialize widget
new CustomN8NChat({ webhookUrl: 'https://adrianzap.app.n8n.cloud/webhook/c803253c-f26b-4a80-83a5-53fad70dbdb6/chat' });
</script>
