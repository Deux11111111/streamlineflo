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
  subtitle = "",
  position = "bottom-right",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: crypto.randomUUID(),
      text: "Hey! Welcome to StreamlineFlo 👋",
      sender: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [sessionId] = useState(() => "chat_session_" + crypto.randomUUID());
  const positionClass = position === "bottom-left" ? "left-6" : "right-6";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

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

    setIsTyping(true);

    const payload = [
      {
        sessionId: sessionId,
        chatInput: message,
        action: "sendMessage",
      },
    ];

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
      try {
        const jsonResponse = JSON.parse(responseData);
        const aiResponse =
          jsonResponse.output || jsonResponse.text || jsonResponse.message || jsonResponse.response;

        if (aiResponse) {
          setMessages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              text: aiResponse,
              sender: "assistant",
              timestamp: new Date(),
            },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              text: typeof jsonResponse === "string" ? jsonResponse : JSON.stringify(jsonResponse),
              sender: "assistant",
              timestamp: new Date(),
            },
          ]);
        }
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
      setIsTyping(false);
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
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full border-0 cursor-pointer relative text-white bg-gradient-to-br from-indigo-600 to-purple-600 hover:scale-110 transition-transform duration-200 shadow-xl flex items-center justify-center"
        aria-expanded={isOpen}
        title={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div
          className="mt-3 w-[min(90vw,400px)] rounded-[20px] overflow-hidden border border-gray-200 shadow-2xl animate-enter bg-white/95 backdrop-blur-lg"
          role="dialog"
          aria-label="Chat widget"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-gray-300">
            <h2 className="m-0 text-lg font-bold text-gray-900">{title}</h2>
            {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
          </div>

          {/* Chat Body */}
          <div className="h-96 overflow-hidden">
            <div ref={scrollRef} className="h-full overflow-auto px-4 py-4 space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] px-4 py-2.5 rounded-3xl text-sm ${
                      msg.sender === "user"
                        ? "text-white bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg"
                        : "text-gray-800 bg-gray-100"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 max-w-[25%] px-4 py-2.5 rounded-3xl flex items-center space-x-1 animate-pulse">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer / Input */}
          <div className="flex gap-3 border-t border-gray-300 p-3 items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 h-12 px-4 border rounded-full text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition"
              disabled={isLoading}
            />
            <button
              onClick={() => handleSubmit()}
              disabled={isLoading || !inputValue.trim()}
              className="h-12 px-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-full shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default N8nChat;
