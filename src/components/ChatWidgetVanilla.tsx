import React, { useEffect } from "react";

export default function ChatWidgetN8N() {
  useEffect(() => {
    if (document.getElementById("lw-chat-widget-host")) return;

    const WEBHOOK_URL = "https://adrianzap.app.n8n.cloud/webhook/c803253c-f26b-4a80-83a5-53fad70dbdb6/chat";

    function generateSessionId() {
      return 'xxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }

    const sessionId = generateSessionId();
    let chatSession = null;

    const host = document.createElement("div");
    host.id = "lw-chat-widget-host";
    const shadow = host.attachShadow({ mode: "open" });
    document.body.appendChild(host);

    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
      :host, * { box-sizing: border-box; font-family: 'Poppins', sans-serif; }
      .lw-root { position: fixed; bottom: 24px; right: 24px; z-index: 9999; }
      .lw-btn { width: 56px; height: 56px; border-radius: 50%; background: #4f46e5; border: none; color: white; cursor: pointer; }
      .lw-card { display: none; flex-direction: column; width: 350px; max-height: 500px; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.2); }
      .lw-card.show { display: flex; }
      .lw-header { padding: 12px; border-bottom: 1px solid #ccc; }
      .lw-body { flex: 1; overflow-y: auto; padding: 12px; }
      .lw-footer { display: flex; padding: 8px; border-top: 1px solid #ccc; }
      .lw-input { flex: 1; padding: 8px; border-radius: 8px; border: 1px solid #ccc; }
      .lw-send { margin-left: 8px; padding: 8px 12px; border-radius: 8px; background: #0b1220; color: white; border: none; cursor: pointer; }
      .lw-row.user { text-align: right; margin-bottom: 8px; }
      .lw-row.assistant { text-align: left; margin-bottom: 8px; }
      .lw-bubble { display: inline-block; padding: 8px 12px; border-radius: 12px; }
      .lw-bubble.user { background: #4f46e5; color: white; }
      .lw-bubble.assistant { background: #f3f4f6; color: black; border: 1px solid #ccc; }
    `;
    shadow.appendChild(style);

    const root = document.createElement("div");
    root.className = "lw-root";
    root.innerHTML = `
      <button class="lw-btn" id="lw-toggle">Chat</button>
      <div class="lw-card" id="lw-panel">
        <div class="lw-header">Chat</div>
        <div class="lw-body" id="lw-body"></div>
        <div class="lw-footer">
          <input class="lw-input" id="lw-input" placeholder="Type your message..." />
          <button class="lw-send" id="lw-send">Send</button>
        </div>
      </div>
    `;
    shadow.appendChild(root);

    const toggleBtn = shadow.getElementById("lw-toggle");
    const panel = shadow.getElementById("lw-panel");
    const input = shadow.getElementById("lw-input");
    const sendBtn = shadow.getElementById("lw-send");
    const body = shadow.getElementById("lw-body");

    toggleBtn.addEventListener("click", () => {
      panel.classList.toggle("show");
      if (panel.classList.contains("show")) input.focus();
    });

    function addMessage(role, text) {
      const row = document.createElement("div");
      row.className = `lw-row ${role}`;
      const bubble = document.createElement("div");
      bubble.className = `lw-bubble ${role}`;
      bubble.textContent = text;
      row.appendChild(bubble);
      body.appendChild(row);
      body.scrollTop = body.scrollHeight;
    }

    async function sendMessage(message) {
      if (!message.trim()) return;
      addMessage("user", message);
      input.value = "";
      sendBtn.disabled = true;

      try {
        const res = await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "sendMessage",
            sessionId: chatSession || sessionId,
            chatInput: message
          })
        });
        const data = await res.json();
        const botMessage = data.output || data.text || data.response || "No response";
        addMessage("assistant", botMessage);
        chatSession = data.sessionId || sessionId;
      } catch (err) {
        addMessage("assistant", "Error sending message.");
        console.error(err);
      } finally {
        sendBtn.disabled = false;
        input.focus();
      }
    }

    sendBtn.addEventListener("click", () => sendMessage(input.value));
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage(input.value);
      }
    });

    return () => {
      host.remove();
    };
  }, []);

  return null;
}

                  
