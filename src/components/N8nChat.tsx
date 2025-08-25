// src/components/N8nChat.tsx
import React, { useState, useRef, useEffect } from "react";
import { Send, MessageCircle, X } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

interface N8nChatProps {
  webhookUrl: string;
  title?: string;
  subtitle?: string;
  position?: "bottom-right" | "bottom-left";
}

const N8nChat: React.FC<N8nChatProps> = ({
  webhookUrl,
  title = "AI Assistant",
  subtitle = "Your smart workflow helper",
  position = "bottom-right",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: crypto.randomUUID(),
      text: "👋 Hi there! How can I help you today?",
      sender: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // session id persists per chat window
  const [sessionId] = useState(() => crypto.randomUUID());
  const positionClass = position === "bottom-left" ? "left-6" : "right-6";

  // auto scroll on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const sendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      text: message,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    const payload = [
      {
        sessionId,
        action: "sendMessage",
        chatInput: message,
      },
    ];

    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const responseData = await res.text();

      try {
        const json = JSON.parse(responseData);
        const aiResponse =
          json.output || json.text || json.message || json.response;

        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            text:
              aiResponse ||
              (typeof json === "string" ? json : JSON.stringify(json)),
            sender: "assistant",
            timestamp: new Date(),
          },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            text: responseData,
            sender: "assistant",
            timestamp: new Date(),
          },
        ]);
      }
    } catch (error) {
      console.error("Send message error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          text: "⚠️ Sorry, I’m having trouble right now. Try again in a moment.",
          sender: "assistant",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (inputValue.trim()) sendMessage(inputValue);
  };

  return (
    <div
      className={`fixed z-[2147483646] bottom-6 ${positionClass} font-sans text-gray-900`}
    >
      {/* Floating Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full shadow-lg cursor-pointer relative text-white bg-gradient-to-br from-indigo-500 to-purple-600 hover:opacity-90 inline-flex items-center justify-center transition-all duration-300"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div
          className="mt-3 w-[min(90vw,400px)] rounded-2xl overflow-hidden border animate-enter"
          style={{
            background: "rgba(255,255,255,0.9)",
            borderColor: "rgba(0,0,0,0.08)",
            boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Header */}
          <div className="px-4 py-4 border-b bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            <h2 className="text-base font-semibold">{title}</h2>
            {subtitle && <p className="text-xs opacity-80">{subtitle}</p>}
          </div>

          {/* Messages */}
          <div className="h-96 overflow-hidden">
            <div ref={scrollRef} className="h-full overflow-auto px-4 py-3 space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Typing animation */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 px-4 py-2.5 rounded-2xl text-sm text-gray-600 flex space-x-2">
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-300"></span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <form
            onSubmit={handleSubmit}
            className="flex gap-2 border-t p-3 items-center bg-white"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 h-11 px-4 border rounded-full text-sm outline-none transition-all focus:border-indigo-400"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="h-11 px-5 text-white rounded-full text-sm font-medium bg-gradient-to-br from-indigo-500 to-purple-600 hover:opacity-90 transition disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin mx-auto" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default N8nChat;
