import React, { useState, useRef, useEffect } from "react";
import { Send, MessageCircle, X, Minimize2, Sparkles, Bot, User } from "lucide-react";

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
  const [isMinimized, setIsMinimized] = useState(false);
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

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const responseData = await res.text();

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
    if (e.key === "Enter") handleSubmit(e);
  };

  return (
    <div className={`fixed z-[2147483646] bottom-6 ${positionClass} font-sans`}>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 hover:scale-110 transition-all shadow-lg flex items-center justify-center text-white"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="mt-3 w-[min(90vw,380px)] rounded-3xl overflow-hidden shadow-lg border border-gray-200 backdrop-blur-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-t-3xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-white/30 flex items-center justify-center">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold">{title}</h3>
                {subtitle && <p className="text-sm opacity-90">{subtitle}</p>}
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="h-80 overflow-auto px-4 py-4 bg-gray-50">
                <div ref={scrollRef} className="space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                          msg.sender === "user"
                            ? "bg-indigo-500 text-white shadow-md"
                            : "bg-gray-100 text-gray-800 shadow-sm"
                        }`}
                      >
                        <p>{msg.text}</p>
                        <div className="text-xs opacity-60 mt-1 text-right">
                          {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start space-x-2 items-center text-gray-500">
                      <Bot className="w-4 h-4 animate-spin" />
                      <span>AI is thinking...</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Input */}
              <div className="flex gap-2 p-3 border-t bg-white/50 backdrop-blur-sm">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 h-10 px-3 rounded-full border outline-none"
                  disabled={isLoading}
                />
                <button
                  onClick={() => handleSubmit()}
                  disabled={!inputValue.trim() || isLoading}
                  className="h-10 px-4 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition flex items-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default N8nChat;
