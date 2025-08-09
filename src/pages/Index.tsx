import { useEffect } from "react";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import AuditForm from "@/components/AuditForm";
import Footer from "@/components/Footer";

const WEBHOOK_URL = "https://your-webhook-url"; // replace this

const Index = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.text = `
      (function () {
        const WEBHOOK_URL = "${https://hook.eu2.make.com/gonu3z4lcwjujhryw6sh8pns67nylf45
}";
        /*!
 Lightweight Chat Popup (vanilla JS, no deps)
 - Copy-paste into any site. Set WEBHOOK_URL.
 - Requires your webhook to allow CORS and return Access-Control-Allow-Origin.
*/
(function () {
  // ====== CONFIG ======
  const WEBHOOK_URL = "https://your-make-webhook-url"; // <-- set this
  const TITLE = "Chat";
  const SUBTITLE = "Ask anything.";
  const PLACEHOLDER = "Type your message...";
  const POSITION = "bottom-right"; // "bottom-right" | "bottom-left"
  // ====================

  if (!WEBHOOK_URL || WEBHOOK_URL.includes("your-make-webhook-url")) {
    console.warn("[ChatPopup] Please set WEBHOOK_URL in the snippet.");
  }
  if (document.getElementById("lw-chat-widget-host")) return;

  function run() {
    const host = document.createElement("div");
    host.id = "lw-chat-widget-host";
    host.style.all = "initial"; // avoids inheriting page styles (shadow will isolate further)
    const shadow = host.attachShadow({ mode: "open" });
    document.body.appendChild(host);

    const style = document.createElement("style");
    style.textContent = `
      :host, * { box-sizing: border-box; }
      @keyframes spin { to { transform: rotate(360deg); } }

      .lw-root {
        position: fixed;
        z-index: 2147483646;
        bottom: 24px;
        ${POSITION === "bottom-left" ? "left: 24px;" : "right: 24px;"}
        font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial, "Apple Color Emoji", "Segoe UI Emoji";
        color: #101828;
      }
      .lw-btn {
        width: 48px; height: 48px; border-radius: 999px; border: 0;
        background: #4f46e5; color: white; cursor: pointer; position: relative;
        box-shadow: 0 10px 20px rgba(79,70,229,0.35);
        display: inline-flex; align-items: center; justify-content: center;
      }
      .lw-btn:hover { filter: brightness(1.05); }
      .lw-btn .lw-icon { width: 20px; height: 20px; display: block; }
      .lw-glow { position:absolute; inset:0; border-radius:999px; background: rgba(79,70,229,.15); filter: blur(18px); z-index:-1; }

      .lw-card {
        margin-top: 10px; width: min(90vw, 380px);
        background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;
        box-shadow: 0 12px 32px rgba(16,24,40,.18);
      }
      .lw-header { padding: 14px 16px 10px; border-bottom: 1px solid #eef2f7; }
      .lw-title { margin: 0; font-size: 15px; font-weight: 600; line-height: 1.1; }
      .lw-sub { margin: 6px 0 0; font-size: 12.5px; color: #667085; }

      .lw-body { height: 288px; overflow: hidden; }
      .lw-scroll { height: 100%; overflow: auto; padding: 12px 12px 8px; }
      .lw-empty { font-size: 13px; color: #667085; }

      .lw-row { display: flex; margin: 8px 0; }
      .lw-row.user { justify-content: flex-end; }
      .lw-row.assistant { justify-content: flex-start; }
      .lw-bubble {
        max-width: 80%; padding: 8px 10px; border-radius: 10px; font-size: 13px; line-height: 1.35;
        border: 1px solid #eef2f7;
      }
      .lw-bubble.user { background: #4f46e5; color: #fff; border-color: transparent; }
      .lw-bubble.assistant { background: #fff; color: #101828; }

      .lw-footer { display: flex; gap: 8px; border-top: 1px solid #eef2f7; padding: 10px; align-items: center; }
      .lw-input {
        flex: 1; padding: 8px 10px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 14px;
        outline: none;
      }
      .lw-input:focus { border-color: #4f46e5; box-shadow: 0 0 0 3px rgba(79,70,229,.15); }
      .lw-send {
        padding: 8px 12px; background: #111827; color: #fff; border: 0; border-radius: 8px; font-size: 14px; cursor: pointer;
      }
      .lw-send[disabled] { opacity: .6; cursor: not-allowed; }
      .lw-spin {
        width: 16px; height: 16px; border: 2px solid rgba(255,255,255,.35); border-top-color: #fff; border-radius: 999px; display:inline-block;
        animation: spin .9s linear infinite; vertical-align: -3px; margin-right: 6px;
      }

      .lw-close {
        position: absolute; inset: 0; display:flex; align-items:center; justify-content:center;
      }
      .lw-hidden { display: none; }
    `;

    const wrap = document.createElement("div");
    wrap.className = "lw-root";
    wrap.innerHTML = `
      <button class="lw-btn" id="lw-toggle" aria-expanded="false" aria-controls="lw-panel" title="Open chat">
        <svg class="lw-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
          <input class="lw-input" id="lw-input" placeholder="${PLACEHOLDER}" aria-label="Message" />
          <button class="lw-send" id="lw-send" type="submit">Send</button>
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
      // toggle icon (chat <-> X)
      toggleBtn.innerHTML = open
        ? '<div class="lw-close"><svg class="lw-icon" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg></div><span class="lw-glow"></span>'
        : '<svg class="lw-icon" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" /></svg><span class="lw-glow"></span>';
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
      const prev = sendBtn.textContent;
      sendBtn.innerHTML = '<span class="lw-spin"></span>Sending';

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
          addBubble("assistant", `Webhook error: ${res.status} ${res.statusText}`);
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
        sendBtn.textContent = prev;
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
      })();
    `;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* AI/Workflow Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-secondary/10 rounded-full blur-2xl animate-float"></div>
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-primary/20 rounded-full blur-lg animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-36 h-36 bg-secondary/15 rounded-full blur-xl animate-float"></div>
      </div>

      <Hero />
      <Services />
      <AuditForm />
      <Footer />
    </div>
  );
};

export default Index;
