// N8nChat.tsx
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Minimize2, Sparkles, Bot, User } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

const cn = (...inputs: any[]) => twMerge(clsx(inputs));

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface N8nChatProps {
  webhookUrl: string;
  title?: string;
  subtitle?: string;
  position?: 'bottom-right' | 'bottom-left';
}

const N8nChat: React.FC<N8nChatProps> = ({
  webhookUrl,
  title = "AI Assistant",
  subtitle = "How can I help you today?",
  position = "bottom-right"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [sessionId] = useState(() => crypto.randomUUID());
  const positionClasses = position === 'bottom-right' ? 'right-4 bottom-4' : 'left-4 bottom-4';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    setIsLoading(true);

    const userMessage: Message = {
      id: crypto.randomUUID(),
      text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    const payload = {
      sessionId,
      action: "sendMessage",
      chatInput: text
    };

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.text();

      try {
        const jsonResponse = JSON.parse(data);
        const aiResponse = jsonResponse.output || jsonResponse.text || jsonResponse.message || jsonResponse.response;

        setMessages(prev => [...prev, {
          id: crypto.randomUUID(),
          text: aiResponse ? aiResponse : typeof jsonResponse === 'string' ? jsonResponse : JSON.stringify(jsonResponse),
          sender: 'assistant',
          timestamp: new Date()
        }]);
      } catch {
        setMessages(prev => [...prev, {
          id: crypto.randomUUID(),
          text: data,
          sender: 'assistant',
          timestamp: new Date()
        }]);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        text: "Sorry, I'm having trouble connecting. Please try again later.",
        sender: 'assistant',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e?: React.FormEvent | React.KeyboardEvent) => {
    e?.preventDefault();
    sendMessage(inputValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit(e);
  };

  if (!isOpen) {
    return (
      <div className={cn("fixed z-50", positionClasses)}>
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-[hsl(var(--premium-primary))] via-[hsl(var(--premium-secondary))] to-[hsl(var(--premium-accent))] hover:from-[hsl(var(--premium-primary-dark))] hover:via-[hsl(var(--premium-primary))] hover:to-[hsl(var(--premium-secondary))] text-white shadow-[var(--premium-shadow)] hover:shadow-[var(--premium-glow)] transition-all duration-500 hover:scale-110 group border-0 animate-pulse relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[hsl(var(--premium-primary))] to-[hsl(var(--premium-secondary))] opacity-0 scale-110 group-hover:opacity-20 group-hover:scale-125 transition-all duration-500 blur-xl"></div>
        </button>
      </div>
    );
  }

  return (
    <div className={cn("fixed z-50 transition-all duration-500 animate-scale-in", positionClasses)}>
      <div className={cn(
        "w-96 transition-all duration-500 ease-out transform",
        isMinimized ? "h-16 scale-95" : "h-[600px] scale-100"
      )}>
        <div className="bg-[hsl(var(--premium-glass))] backdrop-blur-2xl border border-[hsl(var(--premium-border))] rounded-3xl shadow-[var(--premium-shadow)] hover:shadow-[var(--premium-glow)] overflow-hidden h-full flex flex-col transition-all duration-300 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--premium-primary))]/10 via-transparent to-[hsl(var(--premium-secondary))]/10 pointer-events-none"></div>
          <div className="relative bg-gradient-to-br from-[hsl(var(--premium-primary))] via-[hsl(var(--premium-secondary))] to-[hsl(var(--premium-accent))] p-4 flex items-center justify-between">
            <div className="relative z-10 flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center border border-white/30 shadow-lg">
                <Bot className="w-6 h-6 text-white animate-pulse" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg tracking-tight">{title}</h3>
                <p className="text-white/90 text-sm font-medium">{subtitle}</p>
              </div>
            </div>
            <div className="relative z-10 flex items-center space-x-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:bg-white/20 h-9 w-9 rounded-xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 h-9 w-9 rounded-xl transition-all duration-300 hover:scale-110 hover:rotate-90 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              <div className="flex-1 p-6 overflow-y-auto bg-gradient-to-b from-[hsl(var(--premium-dark))] to-[hsl(var(--premium-dark-accent))] relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--premium-primary))]/5 via-transparent to-[hsl(var(--premium-secondary))]/5"></div>
                <div className="space-y-6 relative z-10">
                  {messages.map((message, index) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex items-start space-x-3",
                        message.sender === 'user' ? "justify-end flex-row-reverse space-x-reverse" : "justify-start"
                      )}
                      style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
                        message.sender === 'user' 
                          ? "bg-gradient-to-br from-[hsl(var(--premium-primary))] to-[hsl(var(--premium-secondary))]"
                          : "bg-gradient-to-br from-[hsl(var(--premium-dark-lighter))] to-[hsl(var(--premium-dark-accent))] border border-[hsl(var(--premium-border))]"
                      )}>
                        {message.sender === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-[hsl(var(--premium-text))]" />}
                      </div>
                      <div className={cn(
                        "max-w-[75%] rounded-2xl px-4 py-3 text-sm backdrop-blur-sm shadow-lg transition-all duration-300 hover:shadow-xl",
                        message.sender === 'user'
                          ? "bg-gradient-to-br from-[hsl(var(--premium-primary))] via-[hsl(var(--premium-secondary))] to-[hsl(var(--premium-accent))] text-white shadow-[var(--premium-shadow)]"
                          : "bg-[hsl(var(--premium-dark-lighter))]/80 backdrop-blur-xl text-[hsl(var(--premium-text))] border border-[hsl(var(--premium-border))]/50"
                      )}>
                        <p className="leading-relaxed font-medium">{message.text}</p>
                        <div className={cn(
                          "text-xs mt-2 opacity-70",
                          message.sender === 'user' ? "text-white/80" : "text-[hsl(var(--premium-text-muted))]"
                        )}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-[hsl(var(--premium-dark-lighter))] to-[hsl(var(--premium-dark-accent))] border border-[hsl(var(--premium-border))] flex items-center justify-center shrink-0 shadow-lg">
                        <Bot className="w-4 h-4 text-[hsl(var(--premium-text))]" />
                      </div>
                      <div className="bg-[hsl(var(--premium-dark-lighter))]/80 backdrop-blur-xl text-[hsl(var(--premium-text))] rounded-2xl px-4 py-3 border border-[hsl(var(--premium-border))]/50 shadow-lg flex items-center gap-1">
                        <div className="w-2 h-2 bg-gradient-to-r from-[hsl(var(--premium-primary))] to-[hsl(var(--premium-secondary))] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-gradient-to-r from-[hsl(var(--premium-secondary))] to-[hsl(var(--premium-accent))] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-gradient-to-r from-[hsl(var(--premium-accent))] to-[hsl(var(--premium-primary))] rounded-full animate-bounce"></div>
                        <span className="text-xs text-[hsl(var(--premium-text-muted))] ml-2">AI is thinking...</span>
                      </div>
                    </div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-6 bg-gradient-to-r from-[hsl(var(--premium-dark-accent))] to-[hsl(var(--premium-dark))] border-t border-[hsl(var(--premium-border))]/30 backdrop-blur-xl">
                <form onSubmit={handleSubmit} className="flex space-x-3">
                  <input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 rounded-2xl px-4 py-2 bg-[hsl(var(--premium-dark-lighter))]/80 backdrop-blur-xl border border-[hsl(var(--premium-border))]/50 text-[hsl(var(--premium-text))] placeholder:text-[hsl(var(--premium-text-muted))]"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isLoading}
                    className="px-6 h-12 rounded-2xl border-0 shadow-[var(--premium-shadow)] hover:shadow-[var(--premium-glow)] bg-gradient-to-br from-[hsl(var(--premium-primary))] via-[hsl(var(--premium-secondary))] to-[hsl(var(--premium-accent))] text-white transition-all duration-300 hover:scale-105 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default N8nChat;
