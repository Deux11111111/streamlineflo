import React, { useState, useRef, useEffect } from "react";
import { Send, MessageCircle, X } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

interface N8nChatProps {
  webhookUrl: string; // your webhook URL
  title?: string;
  subtitle?: string;
  position?: "bottom-right" | "bottom-left";
}

const N8nChat: React.FC<N8nChatProps> = ({
  webhookUrl = "https://adrianzap.app.n8n.cloud/webhook/c803253c-f26b-4a80-83a5-53fad70dbdb6/chat",
  title = "Your Personal Assistant",
  subtitle = "How can I help you today?",
  position = "bottom-right",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: crypto.randomUUID(),
      text: "Hey! Welcome to StreamlineFlo",
      sender: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);

  // persistent sessionId across chat
  const [sessionId] = useState(() => "chat_session_" + crypto.randomUUID());
  const positionClass = position === "bottom-left" ? "left-6" : "right-6";

  // auto scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // start SSE connection
  const startSSE = () => {
    if (eventSource) return; // already connected
    const es = new EventSource(`${webhookUrl}/stream?sessionId=${encodeURIComponent(sessionId)}`);

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.content) {
          setMessages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              text: data.content,
              sender: "assistant",
              timestamp: new Date(),
            },
          ]);
        }
      } catch (err) {
        console.error("Error parsing SSE message:", err);
      }
    };

    es.onerror = (err) => {
      console.error("SSE connection error:", err);
      es.close();
      setEventSource(null);
    };

    setEventSource(es);
  };

  const sendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    // start SSE only when user sends the first message
    startSSE();

    const userMessage: Message = {
      id: crypto.randomUUID(),
      text: message,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          chatInput: message,
          action: "sendMessage",
        }),
      });
      // SSE delivers the assistant response
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          text: "Sorry, I'm having trouble connecting right now. Please try again.",
          sender: "assistant",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  return (
    <div className={`fixed z-[2147483646] bottom-6 ${positionClass} font-sans text-gray-900`}>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full border-0 cursor-pointer relative text-white bg-indigo-600 hover:bg-indigo-700 inline-flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5"
        aria-expanded={isOpen}
        title={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="mt-3 w-[min(90vw,380px)] rounded-[18px] overflow-hidden border animate-enter bg-white/80 backdrop-blur-md shadow-lg">
          {/* Header */}
          <div className="px-4 py-3.5 border-b border-gray-200">
            <h2 className="text-[15px] font-semibold text-gray-900">{title}</h2>
            <p className="mt-1.5 text-[12.5px] text-gray-600">{subtitle}</p>
          </div>

          {/* Chat Body */}
          <div className="h-80 overflow-hidden">
            <div ref={scrollRef} className="h-full overflow-auto px-3 py-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex my-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-3 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
                      msg.sender === "user" ? "text-white" : "text-gray-700"
                    }`}
                    style={{
                      background: msg.sender === "user" ? "#4f46e5" : "rgba(0,0,0,0.04)",
                      boxShadow: msg.sender === "user" ? "0 8px 20px rgba(79,70,229,0.35)" : "none",
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <form onSubmit={handleSubmit} className="flex gap-2 border-t p-2.5 items-center border-gray-200 bg-white/60 backdrop-blur-sm">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 h-11 px-3.5 border rounded-full text-sm outline-none"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="h-11 px-4 text-white rounded-full bg-gray-800 hover:bg-gray-900 inline-flex items-center gap-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? <div className="w-4 h-4 border-2 border-white/35 border-t-white rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
              <span>Send</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default N8nChat;
