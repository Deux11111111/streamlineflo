// chatWidget.js
(function () {
  /*!
 Premium Glass Chat Popup (vanilla JS, no deps)
 - Copy-paste into any site. Set WEBHOOK_URL.
 - Your webhook must allow CORS (Access-Control-Allow-Origin: *).
*/
(function () {
  // ========= CONFIG =========
  const WEBHOOK_URL = "https://hook.eu2.make.com/gonu3z4lcwjujhryw6sh8pns67nylf45"; // <-- set this
  const TITLE = "Chat";
  const SUBTITLE = "Ask anything.";
  const POSITION = "bottom-right"; // "bottom-right" | "bottom-left"
  // Theme
  const PRIMARY = "#4f46e5"; // indigo
  const PRIMARY_HOVER = "#4338ca";
  const DARK = "#0b1220";
  // ==========================

  if (!WEBHOOK_URL || WEBHOOK_URL.includes("your-webhook-url")) {
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
    style.textContent = `
      :host, * { box-sizing: border-box; }
      @keyframes spin { to { transform: rotate(360deg); } }
      @keyframes enter { 0% { opacity: 0; transform: translateY(6px) scale(.98) } 100% { opacity: 1; transform: translateY(0) scale(1) } }

      .lw-root {
        position: fixed; z-index: 2147483646; bottom: 24px;
        ${POSITION === "bottom-left" ? "left: 24px;" : "right: 24px;"}
        font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial, "Apple Color Emoji", "Segoe UI Emoji";
        color: #111827;
      }

      /* Toggle Button */
      .lw-btn {
        width: 48px; height: 48px; border-radius: 999px; border: 0; cursor: pointer; position: relative;
        color: #fff; background: ${PRIMARY};
        box-shadow: 0 12px 28px rgba(79,70,229,.35), 0 4px 10px rgba(79,70,229,.25);
        display: inline-flex; align-items: center; justify-content: center;
        transition: transform .2s ease, filter .2s ease, box-shadow .2s ease, background .2s ease;
      }
      .lw-btn:hover { transform: translateY(-1px); filter: brightness(1.03); background: ${PRIMARY_HOVER}; }
      .lw-btn .lw-icon { width: 20px; height: 20px; display: block; }
      .lw-glow { position:absolute; inset:-4px; border-radius:999px; background: radial-gradient(60% 60% at 50% 50%, rgba(79,70,229,.35), rgba(79,70,229,0)); filter: blur(10px); z-index:-1; }

      /* Panel (glassy) */
      .lw-card {
        margin-top: 12px; width: min(90vw, 380px); border-radius: 18px; overflow: hidden;
        background: rgba(255,255,255,.82); border: 1px solid rgba(2,6,23,.06);
        box-shadow: 0 20px 50px rgba(2,6,23,.18), 0 6px 18px rgba(2,6,23,.12);
        backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
        animation: enter .28s ease-out;
      }

      .lw-header {
        padding: 14px 16px 10px; border-bottom: 1px solid rgba(2,6,23,.06);
        background: linear-gradient(90deg, rgba(79,70,229,.10), rgba(79,70,229,0));
      }
      .lw-title { margin: 0; font-size: 15px; font-weight: 600; line-height: 1.1; letter-spacing: .2px; }
      .lw-sub { margin: 6px 0 0; font-size: 12.5px; color: #667085; }

      .lw-body { height: 320px; overflow: hidden; }
      .lw-scroll { height: 100%; overflow: auto; padding: 12px 12px 10px; }
      .lw-empty { font-size: 13px; color: #667085; }

      .lw-row { display: flex; margin: 8px 0; }
      .lw-row.user { justify-content: flex-end; }
      .lw-row.assistant { justify-content: flex-start; }
      .lw-bubble {
        max-width: 80%; padding: 9px 12px; border-radius: 16px; font-size: 13px; line-height: 1.4;
        border: 1px solid transparent; animation: enter .25s ease-out;
      }
      .lw-bubble.user { background: ${PRIMARY}; color: #fff; box-shadow: 0 8px 20px rgba(79,70,229,.35); }
      .lw-bubble.assistant { background: rgba(2,6,23,.04); color: #0b1220; }

      .lw-footer {
        display: flex; gap: 8px; border-top: 1px solid rgba(2,6,23,.06);
        padding: 10px; align-items: center;
        background: rgba(255,255,255,.66); backdrop-filter: blur(10px);
      }
      .lw-input {
        flex: 1; height: 44px; padding: 10px 14px; border: 1px solid rgba(2,6,23,.10); border-radius: 999px; font-size: 14px; outline: none; background: rgba(255,255,255,.9);
        transition: box-shadow .2s ease, border-color .2s ease, background .2s ease;
      }
      .lw-input::placeholder { color: #9aa4b2; }
      .lw-input:focus { border-color: ${PRIMARY}; box-shadow: 0 0 0 4px rgba(79,70,229,.16); background: #fff; }

      .lw-send {
        height: 44px; padding: 0 16px; background: ${DARK}; color: #fff; border: 0; border-radius: 999px; font-size: 14px; cursor: pointer;
        display: inline-flex; align-items: center; gap: 8px;
        transition: transform .2s ease, filter .2s ease, box-shadow .2s ease;
        box-shadow: 0 8px 20px rgba(2,6,23,.18);
      }
      .lw-send:hover { transform: translateY(-1px); filter: brightness(1.02); }
      .lw-send[disabled] { opacity: .6; cursor: not-allowed; transform: none; }
      .lw-spin {
        width: 16px; height: 16px; border: 2px solid rgba(255,255,255,.35); border-top-color: #fff; border-radius: 999px; display:inline-block;
        animation: spin .9s linear infinite; vertical-align: -3px;
      }
      .lw-send-icon { width: 18px; height: 18px; display:block; }

      .lw-close {
        position: absolute; inset: 0; display:flex; align-items:center; justify-content:center;
      }
      .lw-hidden { display: none; }
    `;

    const wrap = document.createElement("div");
    wrap.className = "lw-root";
    wrap.innerHTML = `
      <button class="lw-btn" id="lw-toggle" aria-expanded="false" aria-controls="lw-panel" title="Open chat">
        <svg class="lw-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
        </svg>
        <span class="lw-glow"></span>
      </button>

      <div class="lw-card lw-hidden" id="lw-panel" role="dialog" aria-label="Chat widget">
        <div class="lw-header">
          <h2 class="lw-title">${TITLE}</h2>
          <p class="lw-sub">${SUBTITLE}</p>
        </div>
        <div class="lw-body">
          <div class="lw-scroll" id="lw-scroll">
            <p class="lw-empty" id="lw-empty">Start the conversation below.</p>
          </div>
        </div>
        <form class="lw-footer" id="lw-form">
          <input class="lw-input" id="lw-input" placeholder="Type your message..." aria-label="Message" />
          <button class="lw-send" id="lw-send" type="submit">
            <svg class="lw-send-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>
            </svg>
            <span>Send</span>
          </button>
        </form>
      </div>
    `;

    shadow.appendChild(style);
    shadow.appendChild(wrap);

    const toggleBtn = shadow.getElementById("lw-toggle");
    const panel = shadow.getElementById("lw-panel");
    const input = shadow.getElementById("lw-input");
    const form = shadow.getElementById("lw-form");
    const scroll = shadow.getElementById("lw-scroll");
    const empty = shadow.getElementById("lw-empty");
    const sendBtn = shadow.getElementById("lw-send");

    let open = false;
    let sending = false;

    function setOpen(next) {
      open = next;
      panel.classList.toggle("lw-hidden", !open);
      toggleBtn.setAttribute("aria-expanded", String(open));
      toggleBtn.title = open ? "Close chat" : "Open chat";
      toggleBtn.innerHTML = open
        ? '<div class="lw-close"><svg class="lw-icon" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg></div><span class="lw-glow"></span>'
        : '<svg class="lw-icon" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/></svg><span class="lw-glow"></span>';
      if (open) setTimeout(() => input.focus(), 0);
      scrollToBottom();
    }

    function scrollToBottom() {
      scroll.scrollTop = scroll.scrollHeight;
    }

    function addBubble(role, text) {
      if (empty) empty.remove();
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
      if (!WEBHOOK_URL) {
        addBubble("assistant", "Webhook URL is not configured.");
        return;
      }
      sending = true;
      sendBtn.disabled = true;
      const prev = sendBtn.innerHTML;
      sendBtn.innerHTML = '<span class="lw-spin"></span><span style="margin-left:8px">Sending</span>';

      try {
        const res = await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text,
            timestamp: new Date().toISOString(),
            origin: window.location.origin
          }),
        });

        if (!res.ok) {
          addBubble("assistant", "Webhook error: " + res.status + " " + res.statusText);
          return;
        }

        const ct = res.headers.get("content-type") || "";
        let reply = "";
        if (ct.includes("application/json")) {
          const json = await res.json();
          reply =
            (json && (json.reply || json.message || json.text || json.data)) ??
            JSON.stringify(json);
        } else {
          reply = await res.text();
        }
        reply = (reply || "").toString().trim();
        if (reply) addBubble("assistant", reply);
      } catch (err) {
        console.error("[ChatPopup] webhook error:", err);
        addBubble("assistant", "Network/CORS error. Ensure your webhook enables CORS.");
      } finally {
        sending = false;
        sendBtn.disabled = false;
        sendBtn.innerHTML = prev;
      }
    }

    toggleBtn.addEventListener("click", () => setOpen(!open));

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (sending) return;
      const text = String(input.value || "").trim();
      if (!text) return;
      addBubble("user", text);
      input.value = "";
      sendMessage(text);
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        form.dispatchEvent(new Event("submit", { cancelable: true }));
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run, { once: true });
  } else {
    run();
  }
})();


