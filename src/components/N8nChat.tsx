// N8nChat.tsx
import React, { useState, useRef, useEffect } from "react";
import { Send, MessageCircle, X, Bot, User, Sparkles, Minimize2 } from "lucide-react";

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
  subtitle = "How can I help you today?",
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

  const [sessionId] = useState(() => crypto.randomUUID());
  const positionClass = position === "bottom-left" ? "left-6" : "right-6";

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
      sessionId,
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
          className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 via-indigo-500 to-blue-400 text-white shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-110 relative overflow-hidden animate-pulse"
          title="Open chat"
        >
          <MessageCircle className="w-6 h-6 relative z-10" />
          <Sparkles className="absolute top-0 right-0 w-3 h-3 text-yellow-400 animate-bounce" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 hover:opacity-30 rounded-full transition-opacity duration-300"></div>
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div
          className={`mt-3 w-[min(90vw,380px)] rounded-3xl overflow-hidden border backdrop-blur-xl bg-[rgba(255,255,255,0.85)] shadow-2xl transition-all duration-300`}
          role="dialog"
        >
          {/* Header */}
          <div className="relative flex items-center justify-between p-4 bg-gradient-to-br from-purple-600 via-indigo-500 to-blue-400 text-white">
            <div className="flex items-center space-x-3 z-10 relative">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shadow-lg">
                <Bot className="w-6 h-6 animate-pulse text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg tracking-tight">{title}</h3>
                <p className="text-sm font-medium">{subtitle}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 z-10 relative">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-9 w-9 rounded-xl hover:bg-white/20 transition-all duration-300 flex items-center justify-center"
              >
                <Minimize2 className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="h-9 w-9 rounded-xl hover:bg-white/20 transition-all duration-300 flex items-center justify-center"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="h-80 overflow-auto p-3 relative">
                <div ref={scrollRef} className="space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm transition-all duration-300 ${
                          msg.sender === "user"
                            ? "bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-400 text-white shadow-lg"
                            : "bg-gray-100 text-gray-800 shadow-sm"
                        }`}
                      >
                        {msg.text}
                        <div className="text-xs mt-1 text-gray-500">
                          {msg.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Typing Animation */}
                  {isLoading && (
                    <div className="flex justify-start space-x-2 items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shadow-sm">
                        <Bot className="w-4 h-4 text-gray-700" />
                      </div>
                      <div className="bg-gray-100/80 rounded-2xl px-4 py-3 flex items-center gap-1 shadow-lg">
                        <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                        <span className="text-xs text-gray-500">AI is thinking...</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Input */}
              <div className="p-3 flex gap-2 border-t bg-gray-50">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 rounded-full border outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSubmit}
                  disabled={!inputValue.trim() || isLoading}
                  className="px-4 rounded-full bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-400 text-white flex items-center gap-2 transition-all duration-300 hover:scale-105 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Send
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
