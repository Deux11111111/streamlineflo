import React, { useState, useRef, useEffect } from "react";
import { Send, MessageCircle, X } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

interface N8nChatProps {
  webhookUrl?: string;
  title?: string;
  subtitle?: string;
  position?: "bottom-right" | "bottom-left";
}

const N8nChat: React.FC<N8nChatProps> = ({
  webhookUrl = "https://streamline1.app.n8n.cloud/webhook/c803253c-f26b-4a80-83a5-53fad70dbdb6/chat",
  title = "Your Assistant",
  subtitle = "Online",
  position = "bottom-right",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: crypto.randomUUID(),
      text: "👋 Hi! I'm your assistant. Type something to start the chat!",
      sender: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [sessionId] = useState(() => crypto.randomUUID());
  const positionClass = position === "bottom-left" ? "left-6" : "right-6";

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    setIsLoading(true);
    const userMessage: Message = { id: crypto.randomUUID(), text, sender: "user", timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, action: "sendMessage", chatInput: text }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      let data: any = await res.text();
      try { data = JSON.parse(data); } catch {}

      const aiText = data.output || data.text || data.message || data.response || data;
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), text: aiText, sender: "assistant", timestamp: new Date() },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          text: "Error connecting to AI. Please try again.",
          sender: "assistant",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e?: React.FormEvent | React.KeyboardEvent) => {
    e?.preventDefault();
    sendMessage(inputValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit(e);
  };

  return (
    <div className={`fixed z-[2147483646] bottom-6 ${positionClass} font-sans text-gray-900`}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="pc-toggle-btn"
        aria-expanded={isOpen}
        title={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>

      {/* Chat Widget */}
      {isOpen && (
        <div
          className="pc-chat-widget open"
          style={{
            display: "flex",
            flexDirection: "column",
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div className="pc-chat-header">
            <div className="pc-bot-info">
              <div className="pc-bot-avatar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 8V4H8" />
                  <rect width="16" height="12" x="4" y="8" rx="2" />
                  <path d="M2 14h2" />
                  <path d="M20 14h2" />
                  <path d="M15 13v2" />
                  <path d="M9 13v2" />
                </svg>
              </div>
              <div>
                <h3 className="pc-bot-name">{title}</h3>
                <p className="pc-bot-status">{subtitle}</p>
              </div>
            </div>
            <button className="pc-close-btn" onClick={() => setIsOpen(false)}>
              <X width={16} height={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="pc-messages" ref={scrollRef} style={{ flex: 1, overflowY: "auto" }}>
            {messages.map((msg) => (
              <div key={msg.id} className={`pc-message ${msg.sender}`}>
                <div className="pc-message-content">
                  {msg.text}
                  <div className="pc-message-time">{msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="pc-input-area">
            <input
              className="pc-input"
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <button className="pc-send-btn" onClick={() => handleSubmit()} disabled={isLoading || !inputValue.trim()}>
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/35 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default N8nChat;
