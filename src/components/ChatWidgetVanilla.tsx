import React, { useEffect } from "react";

export default function ChatWidgetN8N() {
  useEffect(() => {
    console.log("[ChatWidgetN8N] useEffect triggered");
    
    // Check if widget already exists
    if (document.getElementById("lw-chat-widget-host")) {
      console.log("[ChatWidgetN8N] Widget already exists, skipping");
      return;
    }

    const scriptContent = `
      (function() {
        console.log("[ChatWidgetN8N] Script starting...");
        
        const WEBHOOK_URL = "https://adrianzap.app.n8n.cloud/webhook/c803253c-f26b-4a80-83a5-53fad70dbdb6/chat";
        const TITLE = "Chat";
        const SUBTITLE = "Ask anything.";
        const POSITION = "bottom-right";
        const PRIMARY = "#4f46e5";
        const PRIMARY_HOVER = "#4338ca";
        const DARK = "#0b1220";
        
        if (document.getElementById("lw-chat-widget-host")) {
          console.log("[ChatWidgetN8N] Host already exists");
          return;
        }
        
        function generateSessionId() {
          return 'xxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
          });
        }
        
        const sessionId = generateSessionId();
        console.log("[ChatWidgetN8N] Generated session ID:", sessionId);
        
        // Create host element
        const host = document.createElement("div");
        host.id = "lw-chat-widget-host";
        host.style.all = "initial";
        host.style.position = "fixed";
        host.style.zIndex = "2147483647";
        host.style.bottom = "24px";
        host.style.right = POSITION === "bottom-left" ? "auto" : "24px";
        host.style.left = POSITION === "bottom-left" ? "24px" : "auto";
        
        // Create shadow root
        const shadow = host.attachShadow({ mode: "open" });
        
        // Add styles
        const style = document.createElement("style");
        style.textContent = \`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
          
          :host {
            all: initial;
            font-family: 'Poppins', sans-serif;
          }
          
          * {
            box-sizing: border-box;
            font-family: 'Poppins', sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          
          @keyframes enter {
            0% { opacity: 0; transform: translateY(6px) scale(.98); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
          }
          
          .lw-root {
            position: relative;
            color: #111827;
          }
          
          .lw-btn {
            background: \${PRIMARY};
            border: none;
            border-radius: 50%;
            width: 56px;
            height: 56px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 10px 20px rgba(79, 70, 229, 0.4);
            transition: background-color 0.25s ease;
            position: relative;
          }
          
          .lw-btn:hover {
            background: \${PRIMARY_HOVER};
          }
          
          .lw-icon {
            stroke: #fff;
            width: 24px;
            height: 24px;
          }
          
          .lw-glow {
            position: absolute;
            top: -8px;
            left: -8px;
            right: -8px;
            bottom: -8px;
            border-radius: 50%;
            box-shadow: 0 0 10px \${PRIMARY};
            opacity: 0.6;
            pointer-events: none;
          }
          
          .lw-card {
            position: absolute;
            bottom: 70px;
            right: 0;
            width: min(90vw, 380px);
            border-radius: 18px;
            overflow: hidden;
            background: rgba(255, 255, 255, 0.9);
            border: 1.5px solid rgba(79, 70, 229, 0.3);
            box-shadow: 0 25px 60px rgba(79, 70, 229, 0.25);
            backdrop-filter: blur(15px);
            animation: enter 0.28s ease-out;
            display: flex;
            flex-direction: column;
            max-height: 520px;
            min-height: 480px;
          }
          
          .lw-card.lw-left {
            right: auto;
            left: 0;
          }
          
          .lw-header {
            padding: 16px 20px 12px;
            border-bottom: 1px solid rgba(79, 70, 229, 0.15);
            background: linear-gradient(90deg, rgba(79, 70, 229, 0.15), rgba(79, 70, 229, 0));
          }
          
          .lw-title {
            margin: 0;
            font-size: 18px;
            font-weight: 700;
            color: \${PRIMARY};
          }
          
          .lw-sub {
            margin-top: 6px;
            font-size: 13px;
            color: #6b7280;
            font-weight: 500;
          }
          
          .lw-body {
            flex: 1;
            overflow-y: auto;
            padding: 16px 20px;
            scroll-behavior: smooth;
          }
          
          .lw-empty {
            font-size: 14px;
            color: #9ca3af;
            text-align: center;
            margin-top: 32px;
          }
          
          .lw-row {
            display: flex;
            margin-bottom: 12px;
          }
          
          .lw-row.user {
            justify-content: flex-end;
          }
          
          .lw-row.assistant {
            justify-content: flex-start;
          }
          
          .lw-bubble {
            max-width: 75%;
            padding: 12px 16px;
            border-radius: 20px;
            font-size: 14px;
            line-height: 1.4;
            animation: enter 0.25s ease-out;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          }
          
          .lw-bubble.user {
            background-color: \${PRIMARY};
            color: white;
            box-shadow: 0 8px 20px rgba(79, 70, 229, 0.4);
          }
          
          .lw-bubble.assistant {
            background-color: #f3f4f6;
            color: #111827;
            border: 1px solid rgba(79, 70, 229, 0.15);
          }
          
          .lw-footer {
            display: flex;
            gap: 12px;
            border-top: 1px solid rgba(79, 70, 229, 0.15);
            padding: 12px 16px;
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(10px);
          }
          
          .lw-input {
            flex: 1;
            height: 46px;
            padding: 0 20px;
            border-radius: 24px;
            font-size: 15px;
            border: 2.5px solid \${PRIMARY};
            outline: none;
            transition: border-color 0.3s ease;
            color: #111827;
            background: #fff;
            font-weight: 500;
            font-family: 'Poppins', sans-serif;
          }
          
          .lw-input::placeholder {
            color: #a5b4fc;
            font-weight: 400;
          }
          
          .lw-input:focus {
            border-color: \${PRIMARY_HOVER};
            box-shadow: 0 0 12px rgba(79, 70, 229, 0.5);
            background: #fff;
          }
          
          .lw-send {
            background: \${DARK};
            color: white;
            border: none;
            border-radius: 50%;
            width: 46px;
            height: 46px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 10px 25px rgba(11, 18, 32, 0.4);
            transition: background-color 0.3s ease;
          }
          
          .lw-send:hover {
            background: #151e3f;
          }
          
          .lw-send:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
          
          .lw-send-icon {
            stroke: white;
            width: 22px;
            height: 22px;
          }
          
          .lw-loading {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: #6b7280;
            font-style: italic;
          }
          
          .lw-spinner {
            width: 16px;
            height: 16px;
            border: 2px solid #e5e7eb;
            border-top: 2px solid \${PRIMARY};
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          
          .lw-hidden {
            display: none !important;
          }
        \`.replace(/\\\${PRIMARY}/g, PRIMARY)
           .replace(/\\\${PRIMARY_HOVER}/g, PRIMARY_HOVER)
           .replace(/\\\${DARK}/g, DARK);
        
        // Create the widget HTML
        const wrap = document.createElement("div");
        wrap.className = "lw-root";
        wrap.innerHTML = \`
          <button class="lw-btn" id="lw-toggle" title="Open chat">
            <svg class="lw-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
            </svg>
            <span class="lw-glow"></span>
          </button>
          <div class="lw-card \${POSITION === "bottom-left" ? "lw-left" : ""} lw-hidden" id="lw-panel">
            <div class="lw-header">
              <h1 class="lw-title">\${TITLE}</h1>
              <p class="lw-sub">\${SUBTITLE}</p>
            </div>
            <div class="lw-body" id="lw-scroll">
              <div class="lw-empty">Start the conversation...</div>
            </div>
            <div class="lw-footer">
              <input class="lw-input" id="lw-input" placeholder="Type your message…" />
              <button class="lw-send" id="lw-send" disabled>
                <svg class="lw-send-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>
        \`.replace(/\\\${POSITION === "bottom-left" \? "lw-left" : ""}/g, POSITION === "bottom-left" ? "lw-left" : "")
           .replace(/\\\${TITLE}/g, TITLE)
           .replace(/\\\${SUBTITLE}/g, SUBTITLE);
        
        // Append elements
        shadow.appendChild(style);
        shadow.appendChild(wrap);
        document.body.appendChild(host);
        
        console.log("[ChatWidgetN8N] Elements created, finding components...");
        
        // Get elements
        const toggleBtn = shadow.getElementById("lw-toggle");
        const panel = shadow.getElementById("lw-panel");
        const input = shadow.getElementById("lw-input");
        const sendBtn = shadow.getElementById("lw-send");
        const scroll = shadow.getElementById("lw-scroll");
        
        if (!toggleBtn || !panel || !input || !sendBtn || !scroll) {
          console.error("[ChatWidgetN8N] Failed to find elements:", {
            toggleBtn: !!toggleBtn,
            panel: !!panel,
            input: !!input,
            sendBtn: !!sendBtn,
            scroll: !!scroll
          });
          return;
        }
        
        console.log("[ChatWidgetN8N] All elements found, setting up listeners...");
        
        let isFirstOpen = true;
        
        toggleBtn.addEventListener("click", async () => {
          console.log("[ChatWidgetN8N] Toggle clicked");
          panel.classList.toggle("lw-hidden");
          if (!panel.classList.contains("lw-hidden")) {
            input.focus();
            
            if (isFirstOpen) {
              isFirstOpen = false;
              try {
                const response = await fetch(WEBHOOK_URL + '?action=loadPreviousSession', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ sessionId: sessionId })
                });
                
                if (response.ok) {
                  const data = await response.json();
                  if (data && data.messages) {
                    data.messages.forEach(msg => {
                      addMessage(msg.role === 'user' ? 'user' : 'assistant', msg.content);
                    });
                  }
                }
              } catch (err) {
                console.log("No previous session to load");
              }
            }
          }
        });
        
        function addMessage(role, text) {
          const msgWrap = document.createElement("div");
          msgWrap.className = "lw-row " + role;
          const bubble = document.createElement("div");
          bubble.className = "lw-bubble " + role;
          bubble.textContent = text;
          msgWrap.appendChild(bubble);
          scroll.appendChild(msgWrap);
          const empty = scroll.querySelector(".lw-empty");
          if (empty) empty.remove();
          scroll.scrollTop = scroll.scrollHeight;
        }
        
        function addLoadingMessage() {
          const msgWrap = document.createElement("div");
          msgWrap.className = "lw-row assistant";
          msgWrap.id = "loading-message";
          const bubble = document.createElement("div");
          bubble.className = "lw-bubble assistant";
          bubble.innerHTML = '<div class="lw-loading"><div class="lw-spinner"></div>Thinking...</div>';
          msgWrap.appendChild(bubble);
          scroll.appendChild(msgWrap);
          scroll.scrollTop = scroll.scrollHeight;
        }
        
        function removeLoadingMessage() {
          const loading = scroll.querySelector("#loading-message");
          if (loading) loading.remove();
        }
        
        async function sendMessage(text) {
          if (!text.trim()) return;
          addMessage("user", text);
          addLoadingMessage();
          input.value = "";
          input.disabled = true;
          sendBtn.disabled = true;
          
          try {
            const response = await fetch(WEBHOOK_URL + '?action=sendMessage', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                chatInput: text,
                sessionId: sessionId
              })
            });
            
            if (!response.ok) {
              throw new Error("Network error: " + response.status);
            }
            
            const data = await response.json();
            removeLoadingMessage();
            
            let botResponse = "";
            if (data.output) {
              botResponse = data.output;
            } else if (data.text) {
              botResponse = data.text;
            } else if (typeof data === 'string') {
              botResponse = data;
            } else {
              botResponse = data.response || data.message || JSON.stringify(data);
            }
            
            addMessage("assistant", botResponse);
            
          } catch (err) {
            console.error("Error:", err);
            removeLoadingMessage();
            addMessage("assistant", "Sorry, something went wrong. Please try again.");
          } finally {
            input.disabled = false;
            sendBtn.disabled = false;
            input.focus();
          }
        }
        
        sendBtn.addEventListener("click", () => sendMessage(input.value));
        input.addEventListener("input", () => {
          sendBtn.disabled = input.value.trim().length === 0;
        });
        input.addEventListener("keydown", (e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (!sendBtn.disabled) sendMessage(input.value);
          }
        });
        
        console.log("[ChatWidgetN8N] Widget setup complete!");
      })();
    `;
    
    const script = document.createElement("script");
    script.id = "n8n-chat-widget-script";
    script.type = "text/javascript";
    script.textContent = scriptContent;
    document.head.appendChild(script);
    
    return () => {
      console.log("[ChatWidgetN8N] Cleanup");
      const existing = document.getElementById("n8n-chat-widget-script");
      if (existing) existing.remove();
      const host = document.getElementById("lw-chat-widget-host");
      if (host) host.remove();
    };
  }, []);
  
  return null;
}
