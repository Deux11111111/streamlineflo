import React, { useEffect } from "react";

export default function ChatWidgetVanilla() {
  useEffect(() => {
    const scriptContent = `
      (function () {
        const WEBHOOK_URL = "https://hook.eu2.make.com/gonu3z4lcwjujhryw6sh8pns67nylf45";
        const TITLE = "Chat";
        const SUBTITLE = "Ask anything.";
        const POSITION = "bottom-right";
        const PRIMARY = "#4f46e5"; // indigo
        const PRIMARY_HOVER = "#4338ca";
        const DARK = "#0b1220";

        if (!WEBHOOK_URL || WEBHOOK_URL.includes("https://hook.eu2.make.com/gonu3z4lcwjujhryw6sh8pns67nylf45")) {
          console.warn("[ChatPopup] Please set WEBHOOK_URL in the snippet.");
        }
        if (document.getElementById("lw-chat-widget-host")) return;

        function run() {
          const host = document.createElement("div");
          host.id = "lw-chat-widget-host";
          host.style.all = "initial";
          const shadow = host.attachShadow({ mode: "open" });
          document.body.appendChild(host);

          const style = document.createElement("style");
          style.textContent = \`
            @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600&display=swap');

            :host, * {
              box-sizing: border-box;
              font-family: 'Montserrat', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial, "Apple Color Emoji", "Segoe UI Emoji";
            }

            @keyframes spin { to { transform: rotate(360deg); } }
            @keyframes enter { 0% { opacity: 0; transform: translateY(6px) scale(.98) } 100% { opacity: 1; transform: translateY(0) scale(1) } }

            .lw-root {
              position: fixed; z-index: 2147483646; bottom: 24px;
              \${POSITION === "bottom-left" ? "left: 24px;" : "right: 24px;"}
              font-family: 'Montserrat', sans-serif;
              color: #111827;
            }

            .lw-btn {
              background: #4f46e5;
              border: none;
              border-radius: 50%;
              width: 48px;
              height: 48px;
              cursor: pointer;
              box-shadow: 0 6px 15px rgba(79, 70, 229, 0.4);
              display: flex;
              align-items: center;
              justify-content: center;
              transition: background-color 0.3s ease, box-shadow 0.3s ease;
            }
            .lw-btn:hover {
              background-color: #4338ca;
              box-shadow: 0 8px 20px rgba(67, 56, 202, 0.6);
            }

            .lw-icon {
              width: 24px;
              height: 24px;
              stroke-width: 2.5;
            }

            /* Panel (glassy) */
            .lw-card {
              margin-top: 12px; width: min(90vw, 380px); border-radius: 18px; overflow: hidden;
              background: rgba(255,255,255,.82); border: 1px solid rgba(2,6,23,.06);
              box-shadow: 0 20px 50px rgba(2,6,23,.18), 0 6px 18px rgba(2,6,23,.12);
              backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
              animation: enter .28s ease-out;
              font-weight: 400;
            }

            .lw-header {
              padding: 14px 16px 10px; border-bottom: 1px solid rgba(2,6,23,.06);
              background: linear-gradient(90deg, rgba(79,70,229,.10), rgba(79,70,229,0));
            }
            .lw-title {
              margin: 0;
              font-size: 18px;
              font-weight: 600;
              line-height: 1.1;
              letter-spacing: .2px;
              color: #3730a3;
            }
            .lw-sub {
              margin: 6px 0 0;
              font-size: 13px;
              color: #667085;
              font-weight: 300;
            }

            .lw-body {
              height: 320px;
              overflow: hidden;
            }
            .lw-scroll {
              height: 100%;
              overflow: auto;
              padding: 12px 12px 10px;
              font-size: 14px;
              color: #1e293b;
              font-weight: 400;
            }
            .lw-empty {
              font-size: 14px;
              color: #94a3b8;
              font-style: italic;
              font-weight: 300;
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
              padding: 10px 16px;
              border-radius: 20px;
              font-size: 14px;
              line-height: 1.5;
              border: 1px solid transparent;
              animation: enter .25s ease-out;
              word-break: break-word;
              white-space: pre-wrap;
            }
            .lw-bubble.user {
              background: \${PRIMARY};
              color: #fff;
              box-shadow: 0 8px 20px rgba(79,70,229,.35);
              font-weight: 500;
            }
            .lw-bubble.assistant {
              background: rgba(2,6,23,.05);
              color: #0b1220;
              font-weight: 400;
            }

            .lw-footer {
              display: flex;
              gap: 8px;
              border-top: 1px solid rgba(2,6,23,.06);
              padding: 12px 12px;
              align-items: center;
              background: rgba(255,255,255,.75);
              backdrop-filter: blur(10px);
            }
            .lw-input {
              flex: 1;
              height: 44px;
              padding: 10px 16px;
              border: 2.5px solid rgba(79, 70, 229, 0.6);
              border-radius: 999px;
              font-size: 14px;
              outline: none;
              background: rgba(255, 255, 255, 0.95);
              transition: box-shadow 0.3s ease, border-color 0.3s ease, background 0.3s ease;
              font-weight: 400;
              font-family: 'Montserrat', sans-serif;
            }
            .lw-input::placeholder {
              color: #a3a3ff;
              font-weight: 300;
            }
            .lw-input:focus {
              border-color: \${PRIMARY};
              box-shadow: 0 0 8px 3px rgba(79, 70, 229, 0.4);
              background: #fff;
            }

            .lw-send {
              height: 44px;
              padding: 0 18px;
              background: \${DARK};
              color: #fff;
              border: 0;
              border-radius: 999px;
              font-size: 14px;
              cursor: pointer;
              display: inline-flex;
              align-items: center;
              gap: 8px;
              transition: transform 0.2s ease, filter 0.2s ease, box-shadow 0.2s ease;
              box-shadow: 0 8px 20px rgba(2,6,23,0.18);
              font-family: 'Montserrat', sans-serif;
              font-weight: 600;
            }
            .lw-send:hover {
              transform: translateY(-1px);
              filter: brightness(1.1);
              box-shadow: 0 10px 25px rgba(2,6,23,0.25);
            }
            .lw-send[disabled] {
              opacity: 0.6;
              cursor: not-allowed;
              transform: none;
            }
            .lw-spin {
              width: 16px;
              height: 16px;
              border: 2px solid rgba(255,255,255,0.35);
              border-top-color: #fff;
              border-radius: 999px;
              display:inline-block;
              animation: spin 0.9s linear infinite;
              vertical-align: -3px;
            }
            .lw-send-icon {
              width: 18px;
              height: 18px;
              display: block;
            }

            .lw-hidden {
              display: none;
            }
          \`;

          const wrap = document.createElement("div");
          wrap.className = "lw-root";
          wrap.innerHTML = \`
            <button class="lw-btn" id="lw-toggle" aria-expanded="false" aria-controls="lw-panel" title="Open chat">
              <svg class="lw-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
              </svg>
              <span class="lw-glow"></span>
            </button>

            <div class="lw-card lw-hidden" id="lw-panel" role="region" aria-label="Chat panel">
              <div class="lw-header">
                <h1 class="lw-title">\${TITLE}</h1>
                <div class="lw-sub">\${SUBTITLE}</div>
              </div>
              <div class="lw-body" id="lw-body">
                <div class="lw-scroll" id="lw-scroll">
                  <div class="lw-empty">Start chatting!</div>
                </div>
              </div>
              <form class="lw-footer" id="lw-form">
                <input type="text" id="lw-input" class="lw-input" placeholder="Write a message..." autocomplete="off" />
                <button type="submit" id="lw-send" class="lw-send" aria-label="Send message">
                  <svg class="lw-send-icon" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                    <line x1="22" y1="2" x2="11" y2="13"/>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                </button>
              </form>
            </div>
          \`;

          shadow.appendChild(style);
          shadow.appendChild(wrap);

          const toggleBtn = shadow.getElementById("lw-toggle");
          const panel = shadow.getElementById("lw-panel");
          const form = shadow.getElementById("lw-form");
          const input = shadow.getElementById("lw-input");
          const scroll = shadow.getElementById("lw-scroll");
          const sendBtn = shadow.getElementById("lw-send");

          let open = false;
          toggleBtn.addEventListener("click", () => {
            open = !open;
            panel.classList.toggle("lw-hidden", !open);
            toggleBtn.setAttribute("aria-expanded", open ? "true" : "false");
            toggleBtn.setAttribute("title", open ? "Close chat" : "Open chat");

            // Swap icon between chat bubble and X
            if (open) {
              toggleBtn.innerHTML =
                '<svg class="lw-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
                '<line x1="18" y1="6" x2="6" y2="18" />' +
                '<line x1="6" y1="6" x2="18" y2="18" />' +
                '</svg>';
              input.focus();
            } else {
              toggleBtn.innerHTML =
                '<svg class="lw-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
                '<path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />' +
                '</svg>';
            }
          });

          let loading = false;
          const messages = [];

          function scrollToBottom() {
            requestAnimationFrame(() => {
              scroll.scrollTop = scroll.scrollHeight;
            });
          }

          function addMessage(text, role = "assistant") {
            if (!text) return;
            const row = document.createElement("div");
            row.className = "lw-row " + role;
            const bubble = document.createElement("div");
            bubble.className = "lw-bubble " + role;
            bubble.textContent = text;
            row.appendChild(bubble);
            scroll.appendChild(row);
            scrollToBottom();
          }

          async function sendMessage(text) {
            if (loading) return;
            loading = true;
            sendBtn.disabled = true;
            addMessage(text, "user");
            input.value = "";
            scroll.querySelector(".lw-empty")?.remove();

            try {
              const res = await fetch(WEBHOOK_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text }),
              });
              if (!res.ok) throw new Error("Network response was not ok");
              const data = await res.json();
              addMessage(data.reply || "No response", "assistant");
            } catch (err) {
              addMessage("Sorry, something went wrong.", "assistant");
              console.error(err);
            } finally {
              loading = false;
              sendBtn.disabled = false;
            }
          }

          form.addEventListener("submit", (e) => {
            e.preventDefault();
            const text = input.value.trim();
            if (!text) return;
            sendMessage(text);
          });
        }

        if (document.readyState === "complete" || document.readyState === "interactive") {
          run();
        } else {
          window.addEventListener("DOMContentLoaded", run);
        }
      })();
    `;

    const script = document.createElement("script");
    script.id = "lw-chat-widget";
    script.textContent = scriptContent;
    document.body.appendChild(script);

    return () => {
      const existing = document.getElementById("lw-chat-widget");
      if (existing) existing.remove();
      const host = document.getElementById("lw-chat-widget-host");
      if (host) host.remove();
    };
  }, []);

  return null;
}

