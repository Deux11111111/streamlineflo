import React, { useEffect } from "react";

export default function ChatWidgetVanilla() {
  useEffect(() => {
    console.log("[ChatWidgetVanilla] useEffect triggered");

    const scriptContent = `
      (function () {
        console.log("[ChatWidgetVanilla] injected script running");

        // ========= CONFIG =========
        const WEBHOOK_URL = "https://hook.eu2.make.com/gonu3z4lcwjujhryw6sh8pns67nylf45";
        const TITLE = "Chat";
        const SUBTITLE = "Ask anything.";
        const POSITION = "bottom-right"; // "bottom-right" | "bottom-left"
        // Theme colors
        const PRIMARY = "#4f46e5"; // indigo
        const PRIMARY_HOVER = "#4338ca";
        const DARK = "#0b1220";
        // ==========================

        if (!WEBHOOK_URL || WEBHOOK_URL.includes("https://hook.eu2.make.com/gonu3z4lcwjujhryw6sh8pns67nylf45")) {
          console.warn("[ChatPopup] Please set WEBHOOK_URL in the snippet.");
        }
        if (document.getElementById("lw-chat-widget-host")) return;

        function run() {
          console.log("[ChatWidgetVanilla] run() called");

          const host = document.createElement("div");
          host.id = "lw-chat-widget-host";
          host.style.all = "initial";
          const shadow = host.attachShadow({ mode: "open" });
          document.body.appendChild(host);

          const style = document.createElement("style");
          style.textContent = \`
            @import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');

            :host, * {
              box-sizing: border-box;
              font-family: 'Poppins', sans-serif;
            }

            @keyframes spin { to { transform: rotate(360deg); } }
            @keyframes enter { 0% { opacity: 0; transform: translateY(6px) scale(.98) } 100% { opacity: 1; transform: translateY(0) scale(1) } }

            .lw-root {
              position: fixed;
              z-index: 2147483646;
              bottom: 24px;
              \${POSITION === "bottom-left" ? "left: 24px;" : "right: 24px;"}
              color: #111827;
              font-size: 14px;
              user-select: none;
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
              box-shadow: 0 6px 20px rgba(79,70,229,.4);
              transition: background-color 0.3s ease;
              position: relative;
              outline-offset: 4px;
            }
            .lw-btn:hover {
              background: \${PRIMARY_HOVER};
              box-shadow: 0 8px 24px rgba(67,56,202,.6);
            }
            .lw-icon {
              width: 28px;
              height: 28px;
              stroke-width: 2.2;
            }
            .lw-glow {
              position: absolute;
              top: 0; left: 0; right: 0; bottom: 0;
              border-radius: 50%;
              box-shadow: 0 0 8px 3px rgba(79,70,229,.5);
              opacity: 0;
              transition: opacity 0.3s ease;
              pointer-events: none;
            }
            .lw-btn:focus-visible .lw-glow {
              opacity: 1;
            }

            /* Panel (glassy) */
            .lw-card {
              margin-top: 12px;
              width: min(90vw, 380px);
              border-radius: 18px;
              overflow: hidden;
              background: rgba(255,255,255,0.85);
              border: 1.5px solid rgba(79,70,229,0.4);
              box-shadow: 0 20px 50px rgba(79,70,229,0.25), 0 6px 18px rgba(79,70,229,0.15);
              backdrop-filter: blur(14px);
              -webkit-backdrop-filter: blur(14px);
              animation: enter 0.28s ease-out;
              user-select: text;
            }

            .lw-header {
              padding: 16px 20px 12px;
              border-bottom: 1px solid rgba(79,70,229,0.15);
              background: linear-gradient(90deg, rgba(79,70,229,0.15), rgba(79,70,229,0));
            }
            .lw-title {
              margin: 0;
              font-size: 17px;
              font-weight: 700;
              letter-spacing: 0.4px;
              color: #3730a3;
            }
            .lw-sub {
              margin: 6px 0 0;
              font-size: 13px;
              color: #5b5fc7;
              font-weight: 500;
            }

            .lw-body {
              height: 320px;
              overflow: hidden;
              background: #fafafa;
            }
            .lw-scroll {
              height: 100%;
              overflow-y: auto;
              padding: 14px 16px 12px;
            }
            .lw-empty {
              font-size: 14px;
              color: #8b8bbf;
              font-weight: 500;
              text-align: center;
              margin-top: 40px;
            }

            .lw-row {
              display: flex;
              margin: 8px 0;
            }
            .lw-row.user {
              justify-content: flex-end;
            }
            .lw-row.assistant {
              justify-content: flex-start;
            }
            .lw-bubble {
              max-width: 80%;
              padding: 11px 16px;
              border-radius: 20px;
              font-size: 14px;
              line-height: 1.5;
              border: 1px solid transparent;
              animation: enter 0.25s ease-out;
              white-space: pre-wrap;
              word-wrap: break-word;
              box-shadow: 0 2px 8px rgba(0,0,0,0.06);
            }
            .lw-bubble.user {
              background: \${PRIMARY};
              color: #fff;
              box-shadow: 0 8px 24px rgba(79,70,229,0.4);
              border-color: rgba(79,70,229,0.8);
            }
            .lw-bubble.assistant {
              background: #f5f7ff;
              color: #3730a3;
              border-color: rgba(79,70,229,0.3);
            }

            .lw-footer {
              display: flex;
              gap: 12px;
              border-top: 1.5px solid rgba(79,70,229,0.3);
              padding: 14px 16px;
              align-items: center;
              background: rgba(255,255,255,0.95);
              backdrop-filter: blur(16px);
              -webkit-backdrop-filter: blur(16px);
            }
            .lw-input {
              flex: 1;
              height: 48px;
              padding: 12px 18px;
              border: 2.5px solid \${PRIMARY};
              border-radius: 9999px;
              font-size: 15px;
              outline: none;
              background: #fff;
              transition: box-shadow 0.3s ease, border-color 0.3s ease;
              font-weight: 600;
              color: #222;
              box-shadow: 0 4px 12px rgba(79,70,229,0.25);
              font-family: 'Poppins', sans-serif;
            }
            .lw-input::placeholder {
              color: #9ca3af;
              font-weight: 500;
            }
            .lw-input:focus {
              border-color: \${PRIMARY_HOVER};
              box-shadow: 0 0 14px 4px rgba(67,56,202,0.5);
              background: #fff;
            }

            .lw-send {
              height: 48px;
              padding: 0 18px;
              background: \${DARK};
              color: #fff;
              border: none;
              border-radius: 9999px;
              font-size: 15px;
              cursor: pointer;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              box-shadow: 0 10px 28px rgba(2,6,23,0.3);
              transition: background-color 0.3s ease, transform 0.2s ease, filter 0.2s ease, box-shadow 0.3s ease;
              font-weight: 700;
            }
            .lw-send:hover {
              background: #121b2f;
              transform: translateY(-2px);
              filter: brightness(1.1);
              box-shadow: 0 14px 36px rgba(2,6,23,0.4);
            }
            .lw-send[disabled] {
              opacity: 0.6;
              cursor: not-allowed;
              transform: none;
              box-shadow: none;
            }
            .lw-spin {
              width: 18px;
              height: 18px;
              border: 3px solid rgba(255,255,255,0.35);
              border-top-color: #fff;
              border-radius: 50%;
              display: inline-block;
              animation: spin 0.9s linear infinite;
              vertical-align: -3px;
            }
            .lw-send-icon {
              width: 20px;
              height: 20px;
              display: block;
              stroke-width: 2.5;
            }

            .lw-hidden {
              display: none;
            }
          \`;

          const wrap = document.createElement("div");
          wrap.className = "lw-root";
          wrap.innerHTML = \`
            <button class="lw-btn" id="lw-toggle" aria-expanded="false" aria-controls="lw-panel" title="Open chat">
              <svg class="lw-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
              </svg>
              <span class="lw-glow"></span>
            </button>

            <div class="lw-card lw-hidden" id="lw-panel" role="dialog" aria-modal="true" aria-labelledby="lw-title" aria-describedby="lw-subtitle">
              <header class="lw-header">
                <h2 class="lw-title" id="lw-title">\${TITLE}</h2>
                <p class="lw-sub" id="lw-subtitle">\${SUBTITLE}</p>
              </header>
              <section class="lw-body" id="lw-body">
                <div class="lw-scroll" id="lw-scroll">
                  <p class="lw-empty">Start chatting now.</p>
                </div>
              </section>
              <footer class="lw-footer">
                <input type="text" id="lw-input" class="lw-input" placeholder="Type a message..." autocomplete="off" />
                <button id="lw-send" class="lw-send" title="Send message" aria-label="Send message">
                  <svg class="lw-send-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </footer>
            </div>
          \`;

          shadow.appendChild(style);
          shadow.appendChild(wrap);

          const toggleBtn = shadow.getElementById("lw-toggle");
          const panel = shadow.getElementById("lw-panel");
          const input = shadow.getElementById("lw-input");
          const sendBtn = shadow.getElementById("lw-send");
          const scroll = shadow.getElementById("lw-scroll");

          let isOpen = false;

          function togglePanel() {
            isOpen = !isOpen;
            panel.classList.toggle("lw-hidden", !isOpen);
            toggleBtn.setAttribute("aria-expanded", isOpen.toString());
            toggleBtn.setAttribute("title", isOpen ? "Close chat" : "Open chat");
            if (isOpen) {
              input.focus();
            }
          }

          toggleBtn.addEventListener("click", togglePanel);

          function addMessage(role, text) {
            const msgWrap = document.createElement("div");
            msgWrap.className = \`lw-row \${role}\`;

            const bubble = document.createElement("div");
            bubble.className = \`lw-bubble \${role}\`;
            bubble.textContent = text;

            msgWrap.appendChild(bubble);
            scroll.appendChild(msgWrap);

            // Remove the empty placeholder if it exists
            const empty = scroll.querySelector(".lw-empty");
            if (empty) empty.remove();

            // Scroll to bottom
            scroll.scrollTop = scroll.scrollHeight;
          }

          async function sendMessage(text) {
            if (!text.trim()) return;

            addMessage("user", text);

            input.value = "";
            input.disabled = true;
            sendBtn.disabled = true;

            try {
              const res = await fetch(WEBHOOK_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text }),
              });

              console.log("[ChatWidgetVanilla] Response status:", res.status);

              if (!res.ok) {
                throw new Error("Network response was not ok: " + res.statusText);
              }

              const data = await res.json();
              console.log("[ChatWidgetVanilla] Response data:", data);

              if (data.response) {
                addMessage("assistant", data.response);
              } else {
                addMessage("assistant", "No 'result' field in response.");
              }
            } catch (err) {
              console.error("[ChatWidgetVanilla] Error sending message", err);
              addMessage("assistant", "Sorry, something went wrong.");
            } finally {
              input.disabled = false;
              sendBtn.disabled = false;
              input.focus();
            }
          }

          sendBtn.addEventListener("click", () => sendMessage(input.value));
          input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              sendMessage(input.value);
            }
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
