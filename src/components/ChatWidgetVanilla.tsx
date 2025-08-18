import React, { useEffect } from "react";

export default function ChatWidgetVanilla() {
  useEffect(() => {
    if (document.getElementById("lw-chat-widget-host")) return;

    const host = document.createElement("div");
    host.id = "lw-chat-widget-host";
    host.style.all = "initial";
    const shadow = host.attachShadow({ mode: "open" });
    document.body.appendChild(host);

    // ===== Inject your styles exactly as before =====
    const style = document.createElement("style");
    style.textContent = `
@import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
:host, * { box-sizing: border-box; font-family: 'Poppins', sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes enter { 0% { opacity: 0; transform: translateY(6px) scale(.98); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
.lw-root { position: fixed; z-index: 2147483646; bottom: 24px; right: 24px; color: #111827; }
.lw-btn { background: #4f46e5; border: none; border-radius: 50%; width: 56px; height: 56px; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 20px rgba(79, 70, 229, 0.4); transition: background-color 0.25s ease; }
.lw-btn:hover { background: #4338ca; }
.lw-icon { stroke: #fff; width: 24px; height: 24px; }
.lw-glow { position: absolute; top: -8px; left: -8px; right: -8px; bottom: -8px; border-radius: 50%; box-shadow: 0 0 10px #4f46e5; opacity: 0.6; pointer-events: none; }
.lw-card { margin-top: 12px; width: min(90vw, 380px); border-radius: 18px; overflow: hidden; background: rgba(255, 255, 255, 0.9); border: 1.5px solid rgba(79, 70, 229, 0.3); box-shadow: 0 25px 60px rgba(79, 70, 229, 0.25); backdrop-filter: blur(15px); animation: enter 0.28s ease-out; display: flex; flex-direction: column; max-height: 520px; min-height: 480px; }
.lw-header { padding: 16px 20px 12px; border-bottom: 1px solid rgba(79, 70, 229, 0.15); background: linear-gradient(90deg, rgba(79, 70, 229, 0.15), rgba(79, 70, 229, 0)); }
.lw-title { margin: 0; font-size: 18px; font-weight: 700; color: #4f46e5; }
.lw-sub { margin-top: 6px; font-size: 13px; color: #6b7280; font-weight: 500; }
.lw-body { flex: 1; overflow-y: auto; padding: 16px 20px; scroll-behavior: smooth; }
.lw-empty { font-size: 14px; color: #9ca3af; text-align: center; margin-top: 32px; }
.lw-row { display: flex; margin-bottom: 12px; }
.lw-row.user { justify-content: flex-end; }
.lw-row.assistant { justify-content: flex-start; }
.lw-bubble { max-width: 75%; padding: 12px 16px; border-radius: 20px; font-size: 14px; line-height: 1.4; animation: enter 0.25s ease-out; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
.lw-bubble.user { background-color: #4f46e5; color: white; box-shadow: 0 8px 20px rgba(79, 70, 229, 0.4); }
.lw-bubble.assistant { background-color: #f3f4f6; color: #111827; border: 1px solid rgba(79, 70, 229, 0.15); }
.lw-footer { display: flex; gap: 12px; border-top: 1px solid rgba(79, 70, 229, 0.15); padding: 12px 16px; background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(10px); }
.lw-input { flex: 1; height: 46px; padding: 0 20px; border-radius: 24px; font-size: 15px; border: 2.5px solid #4f46e5; outline: none; transition: border-color 0.3s ease; color: #111827; background: #fff; font-weight: 500; font-family: 'Poppins', sans-serif; }
.lw-input::placeholder { color: #a5b4fc; font-weight: 400; }
.lw-input:focus { border-color: #4338ca; box-shadow: 0 0 12px rgba(79, 70, 229, 0.5); background: #fff; }
.lw-send { background: #0b1220; color: white; border: none; border-radius: 50%; width: 46px; height: 46px; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 25px rgba(11, 18, 32, 0.4); transition: background-color 0.3s ease; }
.lw-send:hover { background: #151e3f; }
.lw-send:disabled { opacity: 0.6; cursor: not-allowed; }
.lw-send-icon { stroke: white; width: 22px; height: 22px; }
.lw-hidden { display: none; }
`;

    shadow.appendChild(style);

    // ===== Inject your HTML structure exactly as before =====
    const wrap = document.createElement("div");
    wrap.className = "lw-root";
    wrap.innerHTML = `
<button class="lw-btn" id="lw-toggle" aria-expanded="false" aria-controls="lw-panel" title="Open chat">
  <svg class="lw-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
  </svg>
  <span class="lw-glow"></span>
</button>
<div class="lw-card lw-hidden" id="lw-panel" role="region" aria-live="polite" aria-label="Chat panel">
  <div class="lw-header">
    <h1 class="lw-title">Chat</h1>
    <p class="lw-sub">Ask anything.</p>
  </div>
  <div class="lw-body" id="lw-scroll" tabindex="0">
    <div class="lw-empty">Start the conversation...</div>
  </div>
  <form class="lw-footer" id="lw-form" autocomplete="off">
    <input class="lw-input" id="lw-input" placeholder="Type your message…" aria-label="Type your message" autocomplete="off" />
    <button type="submit" class="lw-send" id="lw-send" aria-label="Send message" disabled>
      <svg class="lw-send-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
      </svg>
    </button>
  </form>
</div>
`;
    shadow.appendChild(wrap);

    const toggleBtn = shadow.getElementById("lw-toggle");
    const panel = shadow.getElementById("lw-panel");
    const input = shadow.getElementById("lw-input");
    const sendBtn = shadow.getElementById("lw-send");

    // ===== TOGGLE PANEL =====
    toggleBtn.addEventListener("click", () => {
      const expanded = toggleBtn.getAttribute("aria-expanded") === "true";
      toggleBtn.setAttribute("aria-expanded", !expanded);
      panel.classList.toggle("lw-hidden");
      if (!panel.classList.contains("lw-hidden")) input.focus();
    });

    // ===== INTEGRATE n8n createChat() =====
    // We'll inject a hidden div to attach n8n chat to our shadow DOM
    const chatContainer = document.createElement("div");
    chatContainer.id = "n8n-chat-container";
    chatContainer.style.all = "initial";
    panel.appendChild(chatContainer);

    import('https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js').then(({ createChat }) => {
      createChat({
        container: chatContainer,
        webhookUrl: "YOUR_ON_CHAT_MESSAGE_TRIGGER_URL",
        onMessage: (message) => {
          // Render messages inside our lw-body using your design
          const scroll = shadow.getElementById("lw-scroll");
          const empty = scroll.querySelector(".lw-empty");
          if (empty) empty.remove();

          const msgWrap = document.createElement("div");
          msgWrap.className = "lw-row assistant";

          const bubble = document.createElement("div");
          bubble.className = "lw-bubble assistant";
          bubble.textContent = message;

          msgWrap.appendChild(bubble);
          scroll.appendChild(msgWrap);
          scroll.scrollTop = scroll.scrollHeight;
        },
      });
    });

    // ===== INPUT FORM =====
    input.addEventListener("input", () => {
      sendBtn.disabled = input.value.trim().length === 0;
    });

    shadow.getElementById("lw-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;

      const scroll = shadow.getElementById("lw-scroll");

      // Show user message
      const msgWrap = document.createElement("div");
      msgWrap.className = "lw-row user";
      const bubble = document.createElement("div");
      bubble.className = "lw-bubble user";
      bubble.textContent = text;
      msgWrap.appendChild(bubble);
      scroll.appendChild(msgWrap);
      scroll.scrollTop = scroll.scrollHeight;

      // Send to n8n chat
      const evt = new CustomEvent("n8n-send-message", { detail: text });
      chatContainer.dispatchEvent(evt);

      input.value = "";
      sendBtn.disabled = true;
    });
  }, []);

  return null;
}

