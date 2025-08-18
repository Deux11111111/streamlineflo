import React, { useEffect } from "react";

export default function ChatWidgetVanilla() {
  useEffect(() => {
    console.log("[ChatWidgetVanilla] useEffect triggered");

    const scriptContent = `
      (function () {
        console.log("[ChatWidgetVanilla] injected script running");

        const WEBHOOK_URL = "https://adrianzap.app.n8n.cloud/webhook/c803253c-f26b-4a80-83a5-53fad70dbdb6/chat";
        const TITLE = "Chat";
        const SUBTITLE = "Ask anything.";
        const PRIMARY = "#4f46e5";
        const PRIMARY_HOVER = "#4338ca";
        const DARK = "#0b1220";

        if (document.getElementById("lw-chat-widget-host")) return;

        function generateSessionId() {
          return 'xxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
          });
        }
        const sessionId = generateSessionId();

        const host = document.createElement("div");
        host.id = "lw-chat-widget-host";
        host.style.all = "initial";
        const shadow = host.attachShadow({ mode: "open" });
        document.body.appendChild(host);

        const fontLink = document.createElement("link");
        fontLink.rel = "stylesheet";
        fontLink.href = "https://fonts.googleapis.com/css2?family=Poppins&display=swap";
        shadow.appendChild(fontLink);

        const style = document.createElement("style");
        style.textContent = `
          * { box-sizing: border-box; font-family: 'Poppins', sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
          .lw-root { position: fixed; bottom: 1rem; right: 1rem; z-index: 99999; }
          .lw-btn { background: ${PRIMARY}; border: none; border-radius: 50%; width: 56px; height: 56px; cursor: pointer; color: white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.2); }
          .lw-btn:hover { background: ${PRIMARY_HOVER}; }
          .lw-card { width: 320px; max-height: 400px; background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2); display: flex; flex-direction: column; overflow: hidden; position: absolute; bottom: 70px; right: 0; }
          .lw-hidden { display: none; }
          .lw-header { background: ${PRIMARY}; color: white; padding: 1rem; }
          .lw-title { margin: 0; font-size: 1rem; font-weight: bold; }
          .lw-sub { margin: 0; font-size: 0.85rem; opacity: 0.8; }
          .lw-body { flex: 1; padding: 1rem; overflow-y: auto; background: #f9f9f9; }
          .lw-empty { color: #666; text-align: center; font-size: 0.9rem; }
          .lw-footer { display: flex; border-top: 1px solid #ddd; }
          .lw-input { flex: 1; border: none; padding: 0.75rem; font-size: 0.9rem; outline: none; }
          .lw-send { background: none; border: none; padding: 0 1rem; cursor: pointer; color: ${PRIMARY}; }
          .lw-send:disabled { opacity: 0.5; cursor: not-allowed; }
          .lw-row { display: flex; margin-bottom: 0.5rem; }
          .lw-row.user { justify-content: flex-end; }
          .lw-row.assistant { justify-content: flex-start; }
          .lw-bubble { padding: 0.5rem 0.75rem; border-radius: 12px; max-width: 75%; font-size: 0.9rem; }
          .lw-bubble.user { background: ${PRIMARY}; color: white; border-bottom-right-radius: 4px; }
          .lw-bubble.assistant { background: #e5e7eb; color: ${DARK}; border-bottom-left-radius: 4px; }
          @keyframes blink { 0% {opacity: .2;} 20% {opacity:1;} 100%{opacity:.2;} }
          .typing span { animation: blink 1.4s infinite both; }
          .typing span:nth-child(2){ animation-delay: .2s; }
          .typing span:nth-child(3){ animation-delay: .4s; }
        `;

        const wrap = document.createElement("div");
        wrap.className = "lw-root";
        shadow.appendChild(style);
        shadow.appendChild(wrap);

        // Button with chat icon
        const toggleBtn = document.createElement("button");
        toggleBtn.className = "lw-btn";
        toggleBtn.setAttribute("aria-expanded", "false");
        toggleBtn.setAttribute("aria-controls", "lw-panel");
        toggleBtn.setAttribute("title", "Open chat");
        toggleBtn.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24">
            <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
          </svg>
        `;
        wrap.appendChild(toggleBtn);

        // Chat panel
        const panel = document.createElement("div");
        panel.className = "lw-card lw-hidden";
        panel.id = "lw-panel";
        panel.innerHTML = `
          <div class="lw-header">
            <h1 class="lw-title">${TITLE}</h1>
            <p class="lw-sub">${SUBTITLE}</p>
          </div>
          <div class="lw-body" id="lw-scroll">
            <div class="lw-empty">Start the conversation...</div>
          </div>
          <form class="lw-footer" id="lw-form">
            <input class="lw-input" id="lw-input" placeholder="Type your message…" />
            <button type="submit" class="lw-send" id="lw-send" disabled>
              <svg class="lw-send-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        `;
        wrap.appendChild(panel);

        toggleBtn.addEventListener("click", () => {
          const expanded = toggleBtn.getAttribute("aria-expanded") === "true";
          toggleBtn.setAttribute("aria-expanded", !expanded);
          panel.classList.toggle("lw-hidden");
          if (!panel.classList.contains("lw-hidden")) shadow.getElementById("lw-input").focus();
        });

        const input = shadow.getElementById("lw-input");
        const sendBtn = shadow.getElementById("lw-send");
        const scroll = shadow.getElementById("lw-scroll");
        const form = shadow.getElementById("lw-form");

        function addMessage(role, text) {
          const msgWrap = document.createElement("div");
          msgWrap.className = `lw-row ${role}`;
          const bubble = document.createElement("div");
          bubble.className = `lw-bubble ${role}`;
          bubble.textContent = text;
          msgWrap.appendChild(bubble);
          scroll.appendChild(msgWrap);
          const empty = scroll.querySelector(".lw-empty");
          if (empty) empty.style.display = "none";
          scroll.scrollTop = scroll.scrollHeight;
        }

        form.addEventListener("submit", async (e) => {
          e.preventDefault();
          const message = input.value.trim();
          if (!message) return;
          addMessage('user', message);
          input.value = '';
          sendBtn.disabled = true;

          try {
            const response = await fetch(WEBHOOK_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ sessionId, message })
            });
            const data = await response.json();
            addMessage('assistant', data.reply || 'Sorry, no response.');
          } catch (err) {
            addMessage('assistant', 'Error sending message.');
          }
        });

        input.addEventListener('input', () => {
          sendBtn.disabled = !input.value.trim();
        });
      })();
    `;

    const scriptEl = document.createElement('script');
    scriptEl.textContent = scriptContent;
    document.body.appendChild(scriptEl);
  }, []);

  return null;
}
