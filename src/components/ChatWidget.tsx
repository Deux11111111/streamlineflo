<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Custom N8N Chat Widget</title>
    <style>
        /* Reset and base styles */
        * { 
            box-sizing: border-box; 
            margin: 0; 
            padding: 0; 
        }
        
        body {
            font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji';
            background: #f5f5f5;
            padding: 20px;
        }

        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');

        /* Animations */
        @keyframes spin { 
            to { transform: rotate(360deg); } 
        }
        
        @keyframes enter { 
            0% { opacity: 0; transform: translateY(6px) scale(0.98); } 
            100% { opacity: 1; transform: translateY(0) scale(1); } 
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Container for demo */
        .demo-container {
            position: fixed;
            bottom: 24px;
            right: 24px;
            z-index: 2147483646;
            font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Ubuntu, Cantarell, 'Noto Sans', sans-serif;
            color: #111827;
        }

        /* Premium Toggle Button */
        .premium-btn {
            width: 48px; 
            height: 48px; 
            border-radius: 999px; 
            border: 0; 
            cursor: pointer; 
            position: relative;
            color: #fff; 
            background: #4f46e5;
            box-shadow: 0 12px 28px rgba(79,70,229,0.35), 0 4px 10px rgba(79,70,229,0.25);
            display: inline-flex; 
            align-items: center; 
            justify-content: center;
            transition: all 0.2s ease;
        }

        .premium-btn:hover { 
            transform: translateY(-2px); 
            box-shadow: 0 16px 32px rgba(79,70,229,0.4), 0 6px 14px rgba(79,70,229,0.3);
            background: #4338ca; 
        }

        .premium-btn .premium-icon { 
            width: 20px; 
            height: 20px; 
            display: block; 
        }

        .premium-glow { 
            position: absolute; 
            inset: -4px; 
            border-radius: 999px; 
            background: radial-gradient(60% 60% at 50% 50%, rgba(79,70,229,0.35), rgba(79,70,229,0)); 
            filter: blur(10px); 
            z-index: -1; 
        }

        /* Premium Glass Panel */
        .premium-card {
            margin-top: 12px; 
            width: min(90vw, 380px); 
            border-radius: 18px; 
            overflow: hidden;
            background: rgba(255,255,255,0.82); 
            border: 1px solid rgba(2,6,23,0.06);
            box-shadow: 0 20px 50px rgba(2,6,23,0.18), 0 6px 18px rgba(2,6,23,0.12);
            backdrop-filter: blur(12px); 
            -webkit-backdrop-filter: blur(12px);
            animation: enter 0.28s ease-out;
            display: none;
        }

        .premium-card.show {
            display: block;
        }

        .premium-header {
            padding: 14px 16px 10px; 
            border-bottom: 1px solid rgba(2,6,23,0.06);
            background: linear-gradient(90deg, rgba(79,70,229,0.10), rgba(79,70,229,0));
        }

        .premium-title { 
            margin: 0; 
            font-size: 15px; 
            font-weight: 600; 
            line-height: 1.1; 
            letter-spacing: 0.2px; 
            color: #111827; 
        }

        .premium-sub { 
            margin: 6px 0 0; 
            font-size: 12.5px; 
            color: #6b7280; 
        }

        .premium-body { 
            height: 320px; 
            overflow: hidden; 
        }

        .premium-scroll { 
            height: 100%; 
            overflow: auto; 
            padding: 12px 12px 10px; 
            scrollbar-width: thin; 
            scrollbar-color: #d1d5db transparent;
        }

        .premium-scroll::-webkit-scrollbar { 
            width: 4px; 
        }

        .premium-scroll::-webkit-scrollbar-track { 
            background: transparent; 
        }

        .premium-scroll::-webkit-scrollbar-thumb { 
            background: #d1d5db; 
            border-radius: 2px; 
        }
        
        .premium-empty { 
            font-size: 13px; 
            color: #6b7280; 
        }

        .premium-row { 
            display: flex; 
            margin: 8px 0; 
            animation: slideIn 0.3s ease;
        }

        .premium-row.user { 
            justify-content: flex-end; 
        }

        .premium-row.assistant { 
            justify-content: flex-start; 
        }

        .premium-bubble {
            max-width: 80%; 
            padding: 9px 12px; 
            border-radius: 16px; 
            font-size: 13px; 
            line-height: 1.4; 
            animation: enter 0.25s ease-out;
        }

        .premium-bubble.user { 
            background: #4f46e5; 
            color: #fff; 
            box-shadow: 0 8px 20px rgba(79,70,229,0.35); 
        }

        .premium-bubble.assistant { 
            background: rgba(0,0,0,0.04); 
            color: #374151; 
        }

        .premium-footer {
            display: flex; 
            gap: 8px; 
            border-top: 1px solid rgba(2,6,23,0.06);
            padding: 10px; 
            align-items: center;
            background: rgba(255,255,255,0.66); 
            backdrop-filter: blur(10px);
        }

        .premium-input {
            flex: 1; 
            height: 44px; 
            padding: 10px 14px; 
            border: 1px solid rgba(0,0,0,0.10); 
            border-radius: 999px; 
            font-size: 14px; 
            outline: none; 
            background: rgba(255,255,255,0.9);
            transition: all 0.2s ease;
        }

        .premium-input::placeholder { 
            color: #9ca3af; 
        }

        .premium-input:focus { 
            border-color: #4f46e5; 
            box-shadow: 0 0 0 4px rgba(79,70,229,0.20); 
            background: #fff; 
        }

        .premium-send {
            height: 44px; 
            padding: 0 16px; 
            background: #1f2937; 
            color: #fff; 
            border: 0; 
            border-radius: 999px; 
            font-size: 14px; 
            font-family: 'Poppins', sans-serif;
            font-weight: 500;
            cursor: pointer;
            display: inline-flex; 
            align-items: center; 
            gap: 8px;
            transition: all 0.2s ease;
            box-shadow: 0 8px 20px rgba(31,41,55,0.18);
        }

        .premium-send:hover { 
            transform: translateY(-1px); 
            filter: brightness(1.05);
        }

        .premium-send:disabled { 
            opacity: 0.6; 
            cursor: not-allowed; 
            transform: none; 
        }

        .premium-spin {
            width: 16px; 
            height: 16px; 
            border: 2px solid rgba(255,255,255,0.35); 
            border-top-color: #fff; 
            border-radius: 999px; 
            display: inline-block;
            animation: spin 0.9s linear infinite; 
            vertical-align: -3px;
        }

        .premium-send-icon { 
            width: 18px; 
            height: 18px; 
            display: block; 
        }

        .typing-indicator {
            display: none;
            margin: 8px 0;
        }

        .typing-indicator.show {
            display: flex;
            justify-content: flex-start;
        }

        .typing-dots {
            background: rgba(0,0,0,0.04);
            color: #374151;
            padding: 9px 12px;
            border-radius: 16px;
            font-size: 13px;
        }

        .dots {
            display: inline-block;
        }

        .dots span {
            display: inline-block;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #999;
            margin: 0 2px;
            animation: typing 1.4s infinite ease-in-out;
        }

        .dots span:nth-child(1) { animation-delay: -0.32s; }
        .dots span:nth-child(2) { animation-delay: -0.16s; }

        @keyframes typing {
            0%, 80%, 100% {
                transform: scale(0);
            }
            40% {
                transform: scale(1);
            }
        }

        .error-message {
            background: #fee;
            color: #c33;
            padding: 10px;
            border-radius: 8px;
            margin: 10px 0;
            font-size: 0.9rem;
        }
    </style>
</head>
<body>
    <div class="demo-container">
        <button class="premium-btn" id="toggleBtn" aria-expanded="false" aria-controls="chatPanel" title="Open chat">
            <svg class="premium-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
            </svg>
            <span class="premium-glow"></span>
        </button>

        <div class="premium-card" id="chatPanel" role="dialog" aria-label="Chat widget">
            <div class="premium-header">
                <h2 class="premium-title">AI Assistant</h2>
                <p class="premium-sub">Start a conversation. We're here to help you 24/7.</p>
            </div>
            
            <div class="premium-body">
                <div class="premium-scroll" id="messagesContainer">
                    <div class="premium-row assistant">
                        <div class="premium-bubble assistant">
                            Hi there! 👋 My name is Nathan. How can I assist you today?
                        </div>
                    </div>
                </div>
            </div>

            <div class="typing-indicator" id="typingIndicator">
                <div class="typing-dots">
                    <div class="dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
            
            <form class="premium-footer" id="chatForm">
                <input 
                    class="premium-input" 
                    id="messageInput" 
                    placeholder="Type your message..." 
                    aria-label="Message" 
                />
                <button class="premium-send" id="sendButton" type="submit">
                    <svg class="premium-send-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>
                    </svg>
                    <span>Send</span>
                </button>
            </form>
        </div>
    </div>

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
                if (this.loadPreviousSession) {
                    this.loadPreviousMessages();
                }
            }

            setupEventListeners() {
                // Toggle chat panel
                this.toggleBtn.addEventListener('click', () => this.toggleChat());
                
                // Send message on form submit
                this.chatForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.sendMessage();
                });

                // Send message on Enter key
                this.messageInput.addEventListener('keydown', (e) => {
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
                if (animate) {
                    row.style.animation = 'slideIn 0.3s ease';
                }
                
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
                    this.sendButton.innerHTML = `
                        <span class="premium-spin"></span>
                        <span style="margin-left:8px">Sending</span>
                    `;
                } else {
                    this.sendButton.innerHTML = `
                        <svg class="premium-send-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>
                        </svg>
                        <span>Send</span>
                    `;
                }
            }

            async loadPreviousMessages() {
                try {
                    const response = await fetch(`${this.webhookUrl}?action=loadPreviousSession`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            [this.chatSessionKey]: this.sessionId
                        })
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const data = await response.json();
                    
                    if (data.messages && Array.isArray(data.messages)) {
                        // Clear initial message and load previous ones
                        this.messagesContainer.innerHTML = '';
                        data.messages.forEach(msg => {
                            this.addMessage(msg.text, msg.sender === 'user' ? 'user' : 'assistant', false);
                        });
                        this.scrollToBottom();
                    }
                } catch (error) {
                    console.error('Error loading previous session:', error);
                    this.addMessage('Error loading previous messages. Starting fresh.', 'assistant');
                }
            }

            async sendMessage() {
                const message = this.messageInput.value.trim();
                if (!message || this.isSending) return;

                // Add user message to UI
                this.addMessage(message, 'user');
                this.messageInput.value = '';
                
                // Disable input while processing
                this.isSending = true;
                this.setInputDisabled(true);
                this.showTyping();

                try {
                    const response = await fetch(`${this.webhookUrl}?action=sendMessage`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            [this.chatInputKey]: message,
                            [this.chatSessionKey]: this.sessionId
                        })
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const contentType = response.headers.get('content-type') || '';
                    let botReply = '';
                    
                    if (contentType.includes('application/json')) {
                        const data = await response.json();
                        botReply = data.output || data.reply || data.message || data.text || data.data || JSON.stringify(data);
                    } else {
                        botReply = await response.text();
                    }
                    
                    this.hideTyping();
                    
                    // Add bot response
                    if (botReply && botReply.toString().trim()) {
                        this.addMessage(botReply.toString().trim(), 'assistant');
                    } else {
                        this.addMessage("Sorry, I didn't receive a proper response. Could you please try again?", 'assistant');
                    }

                } catch (error) {
                    console.error('Error sending message:', error);
                    this.hideTyping();
                    this.addMessage('Network error. Please try again.', 'assistant');
                } finally {
                    this.isSending = false;
                    this.setInputDisabled(false);
                }
            }
        }

        // Initialize the chat widget
        // Replace 'YOUR_N8N_WEBHOOK_URL' with your actual n8n webhook URL
        const chat = new CustomN8NChat({
            webhookUrl: 'https://adrianzap.app.n8n.cloud/webhook/c803253c-f26b-4a80-83a5-53fad70dbdb6/chat',
            chatInputKey: 'chatInput',
            chatSessionKey: 'sessionId',
            loadPreviousSession: true
        });
    </script>
</body>
</html>
