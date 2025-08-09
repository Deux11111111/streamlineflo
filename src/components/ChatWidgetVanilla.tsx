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
            :host, * { box-sizing: border-box; }
            @keyframes spin { to { transform: rotate(360deg); } }
            @keyframes enter { 0% { opacity: 0; transform: translateY(6px) scale(.98); } 100% { opacity: 1; transform: translateY(0) scale(1); } }

            .lw-root {
              position: fixed; 
              z-index: 2147483646; 
              bottom: 24px;
              \${POSITION === "bottom-left" ? "left: 24px;" : "right: 24px;"}
              font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial, "Apple Color Emoji", "Segoe UI Emoji";
              color: #111827;
              user-select: none;
            }

            .lw-btn {
              background: \${PRIMARY};
              border: none;
              border-radius: 9999px;
              width: 56px;
              height: 56px;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.4), 0 4px 6px -2px rgba(79, 70, 229, 0.3);
              transition: background-color 0.3s ease, box-shadow 0.3s ease;
              position: relative;
            }
            .lw-btn:hover {
              background: \${PRIMARY_HOVER};
              box-shadow: 0 12px 20px -4px rgba(67, 56, 202, 0.6), 0 6px 8px -3px rgba(67, 56, 202, 0.5);
            }

            .lw-icon {
              width: 28px;
              height: 28px;
              stroke: white;
              stroke-width: 2.2;
              stroke-linecap: round;
              stroke-linejoin: round;
            }

            .lw-glow {
              position: absolute;
              top: 50%;
              left: 50%;
              width: 70px;
              height: 70px;
              background: \${PRIMARY};
              filter: blur(10px);
              opacity: 0.4;
              border-radius: 50%;
              transform: translate(-50%, -50%);
              pointer-events: none;
              animation: pulse 2.5s infinite ease-in-out;
              z-index: -1;
            }

            @keyframes pulse {
              0%, 100% { opacity: 0.4; transform: translate(-50%, -50%) scale(1); }
              50% { opacity: 0.1; transform: translate(-50%, -50%) scale(1.15); }
            }

            /* Panel (glassy) */
            .lw-card {
              margin-top: 12px; 
              width: min(90vw, 380px); 
              border-radius: 18px; 
              overflow: hidden;
              background: rgba(255,255,255,0.9); 
              border: 1px solid rgba(79, 70, 229, 0.3);
              box-shadow: 0 20px 50px rgba(79, 70, 229, 0.15), 0 6px 18px rgba(79, 70, 229, 0.12);
              backdrop-filter: blur(16px); 
              -webkit-backdrop-filter: blur(16px);
              animation: enter 0.28s ease-out;
              user-select: text;
            }

            .lw-header {
              padding: 16px 20px 12px; 
              border-bottom: 1px solid rgba(79, 70, 229, 0.1);
              background: linear-gradient(90deg, rgba(79, 70, 229, 0.12), rgba(79, 70, 229, 0));
            }
            .lw-title { 
              margin: 0; 
              font-size: 17px; 
              font-weight: 700; 
              line-height: 1.1; 
              letter-spacing: 0.3px; 
              color: \${DARK};
            }
            .lw-sub { 
              margin: 6px 0 0; 
              font-size: 13.5px; 
              color: #7c83a3; 
            }

            .lw-body { 
              height: 340px; 
              overflow: hidden; 
            }
            .lw-scroll { 
              height: 100%; 
              overflow-y: auto; 
              padding: 14px 14px 12px; 
              scrollbar-width: thin;
              scrollbar-color: \${PRIMARY} transparent;
            }
            .lw-scroll::-webkit-scrollbar {
              width: 8px;
            }
            .lw-scroll::-webkit-scrollbar-thumb {
              background-color: \${PRIMARY};
              border-radius: 20px;
            }
            .lw-empty { 
              font-size: 14px; 
              color: #7c83a3; 
              text-align: center; 
              margin-top: 140px;
            }

            .lw-row { 
              display: flex; 
              margin: 10px 0; 
            }
            .lw-row.user { 
              justify-content: flex-end; 
            }
            .lw-row.assistant { 
              justify-content: flex-start; 
            }
            .lw-bubble {
              max-width: 75%; 
              padding: 11px 16px; 
              border-radius: 18px; 
              font-size: 14px; 
              line-height: 1.5;
              border: 1px solid transparent; 
              animation: enter 0.25s ease-out;
              white-space: pre-line;
              word-wrap: break-word;
            }
            .lw-bubble.user { 
              background: \${PRIMARY}; 
              color: #fff; 
              box-shadow: 0 12px 25px rgba(79, 70, 229, 0.4); 
            }
            .lw-bubble.assistant { 
              background: rgba(67, 56, 202, 0.12); 
              color: \${DARK}; 
              font-weight: 500;
              box-shadow: 0 8px 15px rgba(67, 56, 202, 0.15);
            }

            .lw-footer {
              display: flex; 
              gap: 10px; 
              border-top: 1px solid rgba(79, 70, 229, 0.1);
              padding: 12px 16px; 
              align-items: center;
              background: rgba(255,255,255,0.85); 
              backdrop-filter: blur(12px);
            }
            .lw-input {
              flex: 1; 
              height: 46px; 
              padding: 12px 16px; 
              border: 1.5px solid rgba(79, 70, 229, 0.5); 
              border-radius: 9999px; 
              font-size: 15px; 
              outline: none; 
              background: rgba(255,255,255,0.95);
              transition: box-shadow 0.25s ease, border-color 0.25s ease, background 0.25s ease;
            }
            .lw-input::placeholder { 
              color: #a0a9c1; 
            }
            .lw-input:focus { 
              border-color: \${PRIMARY_HOVER}; 
              box-shadow: 0 0 8px 3px rgba(67, 56, 202, 0.3); 
              background: #fff; 
            }

            .lw-send {
              height: 46px; 
              padding: 0 18px; 
              background: \${DARK}; 
              color: #fff; 
              border: none; 
              border-radius: 9999px; 
              font-size: 15px; 
              cursor: pointer;
              display: inline-flex; 
              align-items: center; 
              gap: 10px;
              transition: transform 0.25s ease, filter 0.25s ease, box-shadow 0.25s ease;
              box-shadow: 0 12px 28px rgba(2, 6, 23, 0.18);
            }
            .lw-send:hover { 
              transform: translateY(-2px); 
              filter: brightness(1.08); 
            }
            .lw-send[disabled] { 
              opacity: 0.6; 
              cursor: not-allowed; 
              transform: none; 
            }
            .lw-spin {
              width: 18px; 
              height: 18px; 
              border: 2.5px solid rgba(255,255,255,0.4); 
              border-top-color: #fff; 
              border-radius: 9999px; 
              display:inline-block;
              animation: spin 0.9s linear infinite; 
              vertical-align: -3px;
            }
            .lw-send-text { 
              vertical-align: middle; 
            }

            .lw-hidden { display: none !important; }
          \`;

          shadow.appendChild(style);

          // Insert the widget root
          shadow.innerHTML += \`
            <div class="lw-root" role="region" aria-label="Live Chat Widget">
              <button id="lw-toggle" aria-expanded="false" title="Open chat" class="lw-btn" aria-controls="lw-panel" aria-haspopup="dialog" aria-live="polite" aria-atomic="true" type="button" tabindex="0">
                <svg class="lw-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
                </svg>
                <span class="lw-glow"></span>
              </button>

              <section id="lw-panel" class="lw-card lw-hidden" role="dialog" aria-modal="true" aria-labelledby="lw-title" tabindex="-1">
                <header class="lw-header">
                  <h2 id="lw-title" class="lw-title">\${TITLE}</h2>
                  <p class="lw-sub">\${SUBTITLE}</p>
                </header>
                <main class="lw-body">
                  <div id="lw-scroll" class="lw-scroll">
                    <div class="lw-empty">No messages yet. Say hello! 👋</div>
                  </div>
                </main>
                <form id="lw-form" class="lw-footer" action="#" method="POST" novalidate autocomplete="off" aria-label="Send message">
                  <input id="lw-input" class="lw-input" type="text" name="message" placeholder="Type your message..." aria-label="Message input" required autocomplete="off" spellcheck="false" />
                  <button id="lw-send" class="lw-send" type="submit" aria-label="Send message" disabled>
                    <span class="lw-send-text">Send</span>
                  </button>
                </form>
              </section>
            </div>
          \`;

          const toggleBtn = shadow.getElementById("lw-toggle");
          const panel = shadow.getElementById("lw-panel");
          const form = shadow.getElementById("lw-form");
          const input = shadow.getElementById("lw-input");
          const scroll = shadow.getElementById("lw-scroll");
          const sendBtn = shadow.getElementById("lw-send");

          let open = false;

          // Toggle chat panel visibility and button icon
          toggleBtn.addEventListener("click", () => {
            open = !open;
            panel.classList.toggle("lw-hidden", !open);
            toggleBtn.setAttribute("aria-expanded", open ? "true" : "false");
            toggleBtn.setAttribute("title", open ? "Close chat" : "Open chat");

            if (open) {
              toggleBtn.innerHTML =
                '<svg class="lw-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
                '<line x1="18" y1="6" x2="6" y2="18"/>' +
                '<line x1="6" y1="6" x2="18" y2="18"/>' +
                '</svg>' +
                '<span class="lw-glow"></span>';
              input.focus();
            } else {
              toggleBtn.innerHTML =
                '<svg class="lw-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
                '<path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />' +
                '</svg>' +
                '<span class="lw-glow"></span>';
            }
          });

          // Enable send button only if input is not empty
          input.addEventListener("input", () => {
            sendBtn.disabled = input.value.trim().length === 0;
          });

          // Handle form submission
          form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const message = input.value.trim();
            if (!message) return;

            // Append user message
            appendMessage("user", message);
            input.value = "";
            sendBtn.disabled = true;

            // Scroll to bottom
            scroll.scrollTop = scroll.scrollHeight;

            try {
              // Send message to webhook
              const response = await fetch(WEBHOOK_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message }),
              });

              if (!response.ok) throw new Error("Network response not ok");

              // Append assistant reply (mock for now)
              appendMessage("assistant", "Thanks for your message! We'll get back to you soon.");

              // Scroll to bottom again
              scroll.scrollTop = scroll.scrollHeight;
            } catch (err) {
              console.error("[ChatWidgetVanilla] Error sending message:", err);
              appendMessage("assistant", "Oops, something went wrong. Please try again.");
              scroll.scrollTop = scroll.scrollHeight;
            }
          });

          function appendMessage(sender, text) {
            const empty = shadow.querySelector(".lw-empty");
            if (empty) empty.style.display = "none";

            const row = document.createElement("div");
            row.className = \`lw-row \${sender}\`;

            const bubble = document.createElement("div");
            bubble.className = \`lw-bubble \${sender}\`;
            bubble.textContent = text;

            row.appendChild(bubble);
            scroll.appendChild(row);
          }
        }

        run();
      })();
    `;

    const script = document.createElement("script");
    script.textContent = scriptContent;
    document.body.appendChild(script);
  }, []);

  return null;
}
