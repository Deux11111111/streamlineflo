import React, { useState, useRef, useEffect } from "react";

const ChatWidget: React.FC = () => {
  const WEBHOOK_URL = "https://hook.eu2.make.com/gonu3z4lcwjujhryw6sh8pns67nylf45"; // <-- Replace this with your actual webhook

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; text: string }[]
  >([]);
  const [inputValue, setInputValue] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  const addMessage = (role: "user" | "assistant", text: string) => {
    setMessages((prev) => [...prev, { role, text }]);
  };

  const sendMessage = async (text: string) => {
    if (!WEBHOOK_URL || WEBHOOK_URL.includes("your-webhook-url")) {
      addMessage("assistant", "Webhook URL is not configured.");
      return;
    }

    setSending(true);

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          timestamp: new Date().toISOString(),
          origin: window.location.origin,
        }),
      });

      if (!res.ok) {
        addMessage("assistant", `Webhook error: ${res.status} ${res.statusText}`);
        setSending(false);
        return;
      }

      const contentType = res.headers.get("content-type") || "";
      let reply = "";

      if (contentType.includes("application/json")) {
        const json = await res.json();
        reply =
          (json && (json.reply || json.message || json.text || json.data)) ??
          JSON.stringify(json);
      } else {
        reply = await res.text();
      }

      reply = reply.toString().trim();
      if (reply) addMessage("assistant", reply);
    } catch (e) {
      addMessage(
        "assistant",
        "Network/CORS error. Ensure your webhook enables CORS."
      );
    }

    setSending(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sending || !inputValue.trim()) return;
    addMessage("user", inputValue.trim());
    sendMessage(inputValue.trim());
    setInputValue("");
  };

  // Styles from your original design
  const styles = {
    root: {
      position: "fixed" as const,
      zIndex: 2147483646,
      bottom: 24,
      right: 24,
      fontFamily:
        'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", "Helvetica Neue", Arial, "Apple Color Emoji", "Segoe UI Emoji"',
      color: "#111827",
      width: "min(90vw, 380px)",
      maxWidth: "380px",
    },
    btn: {
      width: 48,
      height: 48,
      borderRadius: 999,
      border: 0,
      cursor: "pointer",
      position: "relative" as const,
      color: "#fff",
      background: "#4f46e5",
      boxShadow: "0 12px 28px rgba(79,70,229,.35), 0 4px 10px rgba(79,70,229,.25)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "transform .2s ease, filter .2s ease, box-shadow .2s ease, background .2s ease",
    },
    glow: {
      position: "absolute" as const,
      inset: -4,
      borderRadius: 999,
      background:
        "radial-gradient(60% 60% at 50% 50%, rgba(79,70,229,.35), rgba(79,70,229,0))",
      filter: "blur(10px)",
      zIndex: -1,
    },
    card: {
      marginTop: 12,
      width: "100%",
      borderRadius: 18,
      overflow: "hidden",
      background: "rgba(255,255,255,.82)",
      border: "1px solid rgba(2,6,23,.06)",
      boxShadow: "0 20px 50px rgba(2,6,23,.18), 0 6px 18px rgba(2,6,23,.12)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      animation: "enter 0.28s ease-out",
      display: "flex",
      flexDirection: "column" as const,
      height: 400,
    },
    header: {
      padding: "14px 16px 10px",
      borderBottom: "1px solid rgba(2,6,23,.06)",
      background:
        "linear-gradient(90deg, rgba(79,70,229,.10), rgba(79,70,229,0))",
    },
    title: {
      margin: 0,
      fontSize: 15,
      fontWeight: 600,
      lineHeight: 1.1,
      letterSpacing: 0.2,
    },
    sub: {
      margin: "6px 0 0",
      fontSize: 12.5,
      color: "#667085",
    },
    body: {
      flex: 1,
      overflow: "hidden",
    },
    scroll: {
      height: "100%",
      overflowY: "auto" as const,
      padding: "12px 12px 10px",
    },
    empty: {
      fontSize: 13,
      color: "#667085",
    },
    row: {
      display: "flex",
      margin: "8px 0",
    },
    rowUser: {
      justifyContent: "flex-end",
    },
    rowAssistant: {
      justifyContent: "flex-start",
    },
    bubble: {
      maxWidth: "80%",
      padding: "9px 12px",
      borderRadius: 16,
      fontSize: 13,
      lineHeight: 1.4,
      border: "1px solid transparent",
      animation: "enter 0.25s ease-out",
      wordBreak: "break-word" as const,
    },
    bubbleUser: {
      background: "#4f46e5",
      color: "#fff",
      boxShadow: "0 8px 20px rgba(79,70,229,.35)",
    },
    bubbleAssistant: {
      background: "rgba(2,6,23,.04)",
      color: "#0b1220",
    },
    footer: {
      display: "flex",
      gap: 8,
      borderTop: "1px solid rgba(2,6,23,.06)",
      padding: 10,
      alignItems: "center",
      background: "rgba(255,255,255,.66)",
      backdropFilter: "blur(10px)",
    },
    input: {
      flex: 1,
      height: 44,
      padding: "10px 14px",
      border: "1px solid rgba(2,6,23,.10)",
      borderRadius: 999,
      fontSize: 14,
      outline: "none",
      background: "rgba(255,255,255,.9)",
      transition: "box-shadow .2s ease, border-color .2s ease, background .2s ease",
    },
    inputFocus: {
      borderColor: "#4f46e5",
      boxShadow: "0 0 0 4px rgba(79,70,229,.16)",
      background: "#fff",
    },
    sendBtn: {
      height: 44,
      padding: "0 16px",
      background: "#0b1220",
      color: "#fff",
      border: 0,
      borderRadius: 999,
      fontSize: 14,
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      transition:
        "transform .2s ease, filter .2s ease, box-shadow .2s ease",
      boxShadow: "0 8px 20px rgba(2,6,23,.18)",
    },
    sendBtnDisabled: {
      opacity: 0.6,
      cursor: "not-allowed",
      transform: "none",
    },
    spin: {
      width: 16,
      height: 16,
      border: "2px solid rgba(255,255,255,.35)",
      borderTopColor: "#fff",
      borderRadius: 999,
      display: "inline-block",
      animation: "spin 0.9s linear infinite",
    },
  };

  return (
    <div style={styles.root}>
      {!open && (
        <button
          style={styles.btn}
          onClick={() => setOpen(true)}
          aria-label="Open chat"
        >
          <span style={styles.glow} />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      )}

      {open && (
        <div style={styles.card}>
          <div style={styles.header}>
            <h2 style={styles.title}>Chat</h2>
            <p style={styles.sub}>Ask anything.</p>
          </div>
          <div style={styles.body}>
            <div style={styles.scroll} ref={scrollRef}>
              {messages.length === 0 && (
                <p style={styles.empty}>Say hi 👋</p>
              )}
              {messages.map(({ role, text }, i) => (
                <div
                  key={i}
                  style={{
                    ...styles.row,
                    ...(role === "user"
                      ? styles.rowUser
                      : styles.rowAssistant),
                  }}
                >
                  <div
                    style={{
                      ...styles.bubble,
                      ...(role === "user"
                        ? styles.bubbleUser
                        : styles.bubbleAssistant),
                    }}
                  >
                    {text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form style={styles.footer} onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Type a message"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              style={styles.input}
              disabled={sending}
              aria-label="Message input"
            />
            <button
              type="submit"
              style={{
                ...styles.sendBtn,
                ...(sending || !inputValue.trim()
                  ? styles.sendBtnDisabled
                  : {}),
              }}
              disabled={sending || !inputValue.trim()}
              aria-label="Send message"
            >
              {sending ? (
                <span
                  style={styles.spin}
                  aria-label="Sending"
                  role="status"
                />
              ) : (
                "Send"
              )}
            </button>
          </form>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
        @keyframes enter {
          0% {
            opacity: 0;
            transform: translateY(5px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ChatWidget;
