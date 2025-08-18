import React, { useEffect } from "react";

export default function ChatWidgetVanilla() {
  useEffect(() => {
    console.log("[ChatWidgetVanilla] useEffect triggered");

    const scriptContent = `
      (function () {
        console.log("[ChatWidgetVanilla] injected script running");

        // ========= CONFIG =========
        const WEBHOOK_URL = "https://adrianzap.app.n8n.cloud/webhook/c803253c-f26b-4a80-83a5-53fad70dbdb6/chat";
        const TITLE = "Chat";
        const SUBTITLE = "Ask anything.";
        const PRIMARY = "#4f46e5";
        const PRIMARY_HOVER = "#4338ca";
        const DARK = "#0b1220";
        // ==========================

        if (document.getElementById("lw-chat-widget-host")) return;

        function generateSessionId() {
          return 'xxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
          });
        }
        const sessionId = generateSessionId();

        function run() {
          console.log("[ChatWidgetVanilla] run() called");

          const host = document.createElement("div");
          host.id = "lw-chat-widget-host";
          host.style.all = "initial";
          const shadow = host.attachShadow({ mode: "open" });
          document.body.appendChild(host);

          // ✅ load Google Font into Shadow DOM
          const fontLink = document.createElement("link");
          fontLink.rel = "stylesheet";
          fontLink.href = "https://fonts.googleapis.com/css2?family=Poppins&display=swap";
          shadow.appendChild(fontLink);

          const style = document.createElement("style");
style.textContent = `
* {
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* === Your Full Widget CSS === */
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

/* Typing animation */
@keyframes blink { 0% {opacity: .2;} 20% {opacity:1;} 100%{opacity:.2;} }
.typing span { animation: blink 1.4s infinite both; }
.typing span:nth-child(2){ animation-delay: .2s; }
.typing span:nth-child(3){ animation-delay: .4s; }
`;

          const wrap = document.createElement("div");
          wrap.className = "lw-root";
          wrap.innerHTML = `
            <button class="lw-btn" id="lw-toggle" aria-expanded="false" aria-controls="lw-panel" title="Open chat">
              <svg class="lw-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
              </svg>
            </button>

            <div class="lw-card lw-hidden" id="lw-panel">
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
            </div>
          `;

          shadow.appendChild(style);
          shadow.appendChild(wrap);

          const toggleBtn = shadow.getElementById("lw-toggle");
          const panel = shadow.getElementById("lw-panel");
          const input = shadow.getElementById("lw-input");
          const sendBtn = shadow.getElementById("lw-send");
          const scroll = shadow.getElementById("lw-scroll");
          const form = shadow.getElementById("lw-form");

          toggleBtn.addEventListener("click", () => {
            const expanded = toggleBtn.getAttribute("aria-expanded") === "true";
            toggleBtn.setAttribute("aria-expanded", !expanded);
            panel.classList.toggle("lw-hidden");
            if (!panel.classList.contains("lw-hidden")) input.focus();
          });

          function addMessage(role, text) {
            const msgWrap = document.createElement("div");
            msgWrap.className = `lw-row ${role}`;
            const bubble = document.createElement("div");
            bubble.className = `lw-bubble ${role}`;
            bubble.textContent = text;
            msgWrap.appendChild(bubble);
            scroll.appendChild(msgWrap);
            const empty = scroll.querySelector(".lw-empty");
            if (empty) empty.remove();
            scroll.scrollTop = scroll.scrollHeight;
            return msgWrap;
          }

          function addTypingIndicator() {
            const wrap = document.createElement("div");
            wrap.className = "lw-row assistant typing";
            const bubble = document.createElement("div");
            bubble.className = "lw-bubble assistant";
            bubble.innerHTML = `<span>.</span><span>.</span><span>.</span>`;
            wrap.appendChild(bubble);
            scroll.appendChild(wrap);
            scroll.scrollTop = scroll.scrollHeight;
            return wrap;
          }

          async function sendMessage(text) {
            if (!text.trim()) return;

            addMessage("user", text);
            input.value = "";
            sendBtn.disabled = true;

            // add typing...
            const typingEl = addTypingIndicator();

            try {
              const res = await fetch(WEBHOOK_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: text, sessionId }),
              });
              const data = await res.json();

              typingEl.remove();
              if (data.content) {
                addMessage("assistant", data.content);
              } else {
                addMessage("assistant", "(No response)");
              }
            } catch (err) {
              typingEl.remove();
              addMessage("assistant", "Sorry, something went wrong.");
            } finally {
              input.focus();
            }
          }

          form.addEventListener("submit", (e) => {
            e.preventDefault();
            sendMessage(input.value);
          });

          input.addEventListener("input", () => {
            sendBtn.disabled = input.value.trim().length === 0;
          });
        }
        run();
      })();
    `;

    const script = document.createElement("script");
    script.id = "chat-widget-script";
    script.type = "text/javascript";
    script.textContent = scriptContent;
    document.body.appendChild(script);

    return () => {
      const existing = document.getElementById("chat-widget-script");
      if (existing) existing.remove();
      const host = document.getElementById("lw-chat-widget-host");
      if (host) host.remove();
    };
  }, []);

  return null;
}
