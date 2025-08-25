import React, { useState, useRef, useEffect } from "react";
import { Send, MessageCircle, X, Bot } from "lucide-react";

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
  title = "Your Assistant",
  subtitle = "How can I help you today?",
  position = "bottom-right",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: crypto.randomUUID(),
      text: "👋 Hi! This is your premium chatbot design. Connect your AI service to make it functional.",
      sender: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [sessionId] = useState(() => crypto.randomUUID());
  const positionClass = position === "bottom-left" ? "left-6" : "right-6";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
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

  const handleSendMessage = () => {
    sendMessage(inputValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <style>{`
        .chatbot-bg { background-color: #1a1a2e; }
        .chatbot-surface { background-color: #16213e; }
        .chatbot-border { color: #3b4d66; }
        .chatbot-primary { background: linear-gradient(to right, #6366f1, #8b5cf6); }
        .chatbot-success { background-color: #10b981; }
        
        @keyframes chatbot-scale-in {
          0% { opacity: 0; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }

        @keyframes chatbot-slide-up {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes chatbot-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .animate-chatbot-scale-in {
          animation: chatbot-scale-in 0.2s ease-out;
        }

        .animate-chatbot-slide-up {
          animation: chatbot-slide-up 0.3s ease-out;
        }

        .animate-chatbot-pulse {
          animation: chatbot-pulse 2s infinite;
        }
      `}</style>
      
      <div className={`fixed bottom-6 ${positionClass} z-50 font-sans`}>
        {/* Chat Widget */}
        <div
          className={cn(
            "relative w-96 h-[500px] mb-4 rounded-2xl overflow-hidden transition-all duration-200",
            "bg-[#1a1a2e]/95 backdrop-blur-xl border border-[#3b4d66]/30",
            "shadow-[0_20px_40px_-10px] shadow-[#6366f1]/30",
            "md:w-96 md:h-[500px] max-md:w-[calc(100vw-48px)] max-md:h-[calc(100vh-100px)] max-md:fixed max-md:bottom-20 max-md:right-6 max-md:left-6 max-md:mb-0",
            isOpen 
              ? "block animate-chatbot-scale-in" 
              : "hidden"
          )}
        >
          {/* Close Button - Top Right */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-3 right-3 z-10 p-1.5 hover:bg-white/20 rounded-full transition-all duration-200 hover:scale-110"
          >
            <X className="w-4 h-4 text-white" />
          </button>

          {/* Header */}
          <div className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] p-4 pr-12 flex items-center">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#10b981] rounded-full border-2 border-[#1a1a2e] animate-chatbot-pulse" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">{title}</h3>
                <p className="text-white/80 text-xs">{subtitle}</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="h-[350px] p-4 overflow-y-auto bg-[#1a1a2e]">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "mb-4 animate-chatbot-slide-up",
                  message.sender === 'user' ? "text-right" : "text-left"
                )}
              >
                <div
                  className={cn(
                    "inline-block max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed",
                    message.sender === 'user'
                      ? "bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white"
                      : "bg-[#16213e] text-white/90"
                  )}
                >
                  {message.text}
                  <div
                    className={cn(
                      "text-xs mt-1 opacity-60",
                      message.sender === 'user' ? "text-white/80" : "text-white/60"
                    )}
                  >
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-[#3b4d66]/20 bg-[#1a1a2e] flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 bg-[#16213e] border border-[#3b4d66]/30 rounded-lg px-3 py-3 text-white text-sm outline-none focus:border-[#6366f1] focus:shadow-[0_0_0_2px] focus:shadow-[#6366f1]/20 placeholder-white/50"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] border-none rounded-lg px-3 py-3 text-white cursor-pointer transition-all duration-200 flex items-center justify-center hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-14 h-14 rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] border-none text-white cursor-pointer transition-all duration-300 flex items-center justify-center relative",
            "shadow-[0_0_30px] shadow-[#6366f1]/40",
            "hover:scale-110",
            isOpen ? "scale-90" : "scale-100"
          )}
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageCircle className="w-6 h-6" />
          )}
        </button>
      </div>
    </>
  );
};

export default N8nChat;
