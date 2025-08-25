// N8nChat.tsx
import React, { useState, useRef, useEffect } from "react";
import { Send, MessageCircle, X, Minimize2, Sparkles, Bot, User } from "lucide-react";

// Utility for combining class names
const cn = (...classes: any[]) => {
  return classes.filter(Boolean).join(" ");
};

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
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      text,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    const payload = {
      sessionId,
      action: "sendMessage",
      chatInput: text,
    };

    try {
      const res = await fetch(webhookUrl!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const responseData = await res.text();

      try {
        const jsonResponse = JSON.parse(responseData);
        const aiResponse = jsonResponse.output || jsonResponse.text || jsonResponse.message || jsonResponse.response;
        setMessages(prev => [
          ...prev,
          {
            id: crypto.randomUUID(),
            text: aiResponse ?? (typeof jsonResponse === "string" ? jsonResponse : JSON.stringify(jsonResponse)),
            sender: "assistant",
            timestamp: new Date(),
          },
        ]);
      } catch {
        setMessages(prev => [
          ...prev,
          { id: crypto.randomUUID(), text: responseData, sender: "assistant", timestamp: new Date() },
        ]);
      }
    } catch (error) {
      console.error("Send message error:", error);
      setMessages(prev => [
        ...prev,
        {
          id: crypto.randomUUID(),
          text: "Sorry, I'm having trouble connecting. Please try again later.",
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
          className="w-16 h-16 rounded-full bg-gradient-to-br from-[hsl(var(--premium-primary))] via-[hsl(var(--premium-secondary))] to-[hsl(var(--premium-accent))] hover:scale-110 transition-all shadow-[var(--premium-shadow)] flex items-center justify-center text-white animate-pulse"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className={`mt-3 w-96 rounded-3xl overflow-hidden shadow-[var(--premium-shadow)]`}>
          <div className="bg-[hsl(var(--premium-glass))] backdrop-blur-2xl border border-[hsl(var(--premium-border))] rounded-3xl flex flex-col">
            {/* Header */}
            <div className="p-4 flex items-center justify-between bg-gradient-to-br from-[hsl(var(--premium-primary))] via-[hsl(var(--premium-secondary))] to-[hsl(var(--premium-accent))]">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center border border-white/30 shadow-lg">
                  <Bot className="w-6 h-6 text-white animate-pulse" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">{title}</h3>
                  <p className="text-white/90 text-sm">{subtitle}</p>
                </div>
              </div>
              <div className="flex space-x-1">
                <button onClick={() => setIsMinimized(!isMinimized)} className="text-white hover:bg-white/20 p-2 rounded-xl">
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20 p-2 rounded-xl">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            {!isMinimized && (
              <div className="flex-1 p-6 overflow-y-auto bg-gradient-to-b from-[hsl(var(--premium-dark))] to-[hsl(var(--premium-dark-accent))] relative">
                <div ref={scrollRef} className="space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex items-start space-x-3 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
                      <div className={`w-8 h-8 rounded-2xl flex items-center justify-center ${msg.sender === "user" ? "bg-gradient-to-br from-[hsl(var(--premium-primary))] to-[hsl(var(--premium-secondary))]" : "bg-[hsl(var(--premium-dark-lighter))] border border-[hsl(var(--premium-border))]"}`}>
                        {msg.sender === "user" ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-[hsl(var(--premium-text))]" />}
                      </div>
                      <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow-lg ${msg.sender === "user" ? "bg-gradient-to-br from-[hsl(var(--premium-primary))] via-[hsl(var(--premium-secondary))] to-[hsl(var(--premium-accent))] text-white" : "bg-[hsl(var(--premium-dark-lighter))]/80 backdrop-blur-xl text-[hsl(var(--premium-text))] border border-[hsl(var(--premium-border))]/50"}`}>
                        <p>{msg.text}</p>
                        <div className="text-xs mt-1 text-[hsl(var(--premium-text-muted))]">{msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-2xl bg-[hsl(var(--premium-dark-lighter))] border border-[hsl(var(--premium-border))] flex items-center justify-center">
                        <Bot className="w-4 h-4 text-[hsl(var(--premium-text))]" />
                      </div>
                      <div className="bg-[hsl(var(--premium-dark-lighter))]/80 backdrop-blur-xl text-[hsl(var(--premium-text))] rounded-2xl px-4 py-3 border border-[hsl(var(--premium-border))]/50 shadow-lg flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-[hsl(var(--premium-primary))] to-[hsl(var(--premium-secondary))] rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gradient-to-r from-[hsl(var(--premium-secondary))] to-[hsl(var(--premium-accent))] rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gradient-to-r from-[hsl(var(--premium-accent))] to-[hsl(var(--premium-primary))] rounded-full animate-bounce"></div>
                        <span className="text-xs text-[hsl(var(--premium-text-muted))] ml-2">AI is thinking...</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Input */}
            {!isMinimized && (
              <div className="p-4 bg-gradient-to-r from-[hsl(var(--premium-dark-accent))] to-[hsl(var(--premium-dark))] border-t border-[hsl(var(--premium-border))]/30 flex space-x-3">
                <input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 rounded-2xl px-4 py-2 bg-[hsl(var(--premium-dark-lighter))]/80 text-[hsl(var(--premium-text))] placeholder:text-[hsl(var(--premium-text-muted))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--premium-primary))]/50"
                  disabled={isLoading}
                />
                <button
                  onClick={() => handleSubmit()}
                  disabled={!inputValue.trim() || isLoading}
                  className="px-4 rounded-2xl bg-gradient-to-br from-[hsl(var(--premium-primary))] via-[hsl(var(--premium-secondary))] to-[hsl(var(--premium-accent))] text-white shadow-lg disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default N8nChat;
