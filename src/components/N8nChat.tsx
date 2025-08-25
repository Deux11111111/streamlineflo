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
  webhookUrl = "https://streamline1.app.n8n.cloud/webhook/c803253c-f26b-4a80-83a5-53fad70dbdb6/chat",
  title = "AI Assistant",
  subtitle = "",
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

  // Persistent sessionId across chat
  const [sessionId] = useState(() => crypto.randomUUID());
  const positionClass = position === "bottom-left" ? "left-6" : "right-6";

  // Auto scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    setIsLoading(true);

    const userMessage: Message = {
      id: crypto.randomUUID(),
      text: message,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Send exactly what Chat Trigger expects
    const payload = {
      sessionId: sessionId,
      action: "sendMessage",
      chatInput: message,
    };

    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const responseData = await res.text();

      // Try parse JSON, otherwise fallback to raw string
      try {
        const jsonResponse = JSON.parse(responseData);
        const aiResponse =
          jsonResponse.output ||
          jsonResponse.text ||
          jsonResponse.message ||
          jsonResponse.response;

        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            text: aiResponse
              ? aiResponse
              : typeof jsonResponse === "string"
              ? jsonResponse
              : JSON.stringify(jsonResponse),
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
          text: "Sorry, I'm having trouble connecting right now. Please try again.",
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
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <div
      className={`fixed z-[2147483646] bottom-6 ${positionClass} font-sans text-gray-900`}
    >
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full border-0 cursor-pointer relative text-white bg-indigo-600 hover:bg-indigo-700 inline-flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5"
        aria-expanded={isOpen}
        title={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <MessageCircle className="w-5 h-5" />
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div
          className="mt-3 w-[min(90vw,380px)] rounded-[18px] overflow-hidden border animate-enter"
          style={{
            background: "rgba(255,255,255,0.82)",
            borderColor: "rgba(2,6,23,0.06)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
          role="dialog"
          aria-label="Chat widget"
        >
          {/* Header */}
          <div className="px-4 py-3.5 border-b">
            <h2 className="m-0 text-[15px] font-semibold leading-tight tracking-wide text-gray-900">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-1.5 mb-0 text-[12.5px] text-gray-600">
                {subtitle}
              </p>
            )}
          </div>

          {/* Chat Body */}
          <div className="h-80 overflow-hidden">
            <div ref={scrollRef} className="h-full overflow-auto px-3 py-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex my-2 ${
                    message.sender === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] px-3 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
                      message.sender === "user"
                        ? "text-white bg-indigo-600"
                        : "text-gray-700 bg-gray-100"
                    }`}
                    style={{
                      boxShadow:
                        message.sender === "user"
                          ? "0 8px 20px rgba(79,70,229,0.35)"
                          : "none",
                    }}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer / Input */}
          <div className="flex gap-2 border-t p-2.5 items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 h-11 px-3.5 border rounded-full text-sm outline-none transition-all duration-200 focus:border-indigo-400"
              disabled={isLoading}
            />
            <button
              onClick={() => handleSubmit()}
              disabled={isLoading || !inputValue.trim()}
              className="h-11 px-4 text-white border-0 rounded-full text-sm cursor-pointer inline-flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none bg-indigo-600 hover:bg-indigo-700"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/35 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="w-[18px] h-[18px]" />
              )}
              <span>Send</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default N8nChat;
