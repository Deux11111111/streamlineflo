import React, { useState, useEffect, useRef, FormEvent, KeyboardEvent } from "react";

interface ChatWidgetProps {
  webhookUrl: string;
}

type Role = "user" | "assistant";

interface Message {
  id: string;
  text: string;
  role: Role;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ https://adrianzap.app.n8n.cloud/webhook/c803253c-f26b-4a80-83a5-53fad70dbdb6/chat }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "init", text: "Hi there! 👋 My name is Adrian. How can I assist you today?", role: "assistant" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const sessionIdRef = useRef<string>("session_" + Math.random().toString(36).substr(2, 9));

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
  };

  const addMessage = (text: string, role: Role) => {
    setMessages((prev) => [...prev, { id: Date.now().toString(), text, role }]);
  };

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const messageText = inputValue;
    setInputValue("");
    addMessage(messageText, "user");
    setIsSending(true);
    setIsTyping(true);

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          message: messageText
        })
      });

      const data = await response.json();

      if (data?.reply) {
        addMessage(data.reply, "assistant");
      } else {
        addMessage("Oops! No reply received.", "assistant");
      }
    } catch (err) {
      addMessage("Error sending message.", "assistant");
      console.error(err);
    } finally {
      setIsSending(false);
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isSending) sendMessage();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isSending) sendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[2147483646] font-sans text-gray-900">
      <button
        className="w-12 h-12 rounded-full bg-indigo-600 text-white relative flex items-center justify-center shadow-lg hover:bg-indigo-700"
        onClick={toggleChat}
        aria-expanded={isOpen}
        title={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
          </svg>
        )}
        <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-400 to-indigo-600 opacity-30 blur-xl"></span>
      </button>

      {isOpen && (
        <div className="mt-3 w-[min(90vw,380px)] bg-white/80 border border-gray-200 rounded-xl shadow-lg backdrop-blur-md flex flex-col overflow-hidden animate-enter">
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-100/10 to-transparent">
            <h2 className="text-sm font-semibold text-gray-900">AI Assistant</h2>
            <p className="text-xs text-gray-500 mt-1">Start a conversation. We're here to help you 24/7.</p>
          </div>

          <div className="flex-1 h-80 overflow-hidden">
            <div className="h-full overflow-auto p-3 space-y-2">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm leading-5 ${msg.role === "user" ? "bg-indigo-600 text-white shadow-md" : "bg-gray-100 text-gray-800"}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="px-3 py-2 rounded-xl bg-gray-100 text-gray-800 text-sm">
                    <span className="inline-flex space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce delay-200"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce delay-400"></span>
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef}></div>
            </div>
          </div>

          <form className="flex gap-2 p-2 border-t border-gray-200 bg-white/60 backdrop-blur-md" onSubmit={handleSubmit}>
            <input
              type="text"
              className="flex-1 h-11 px-3 rounded-full border border-gray-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 outline-none bg-white/90"
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSending}
            />
            <button
              type="submit"
              className="h-11 px-4 rounded-full bg-gray-800 text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSending}
            >
              {isSending ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : null}
              <span>{isSending ? "Sending" : "Send"}</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
