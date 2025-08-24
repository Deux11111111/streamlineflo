import React, { useState, useEffect, useRef } from "react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "assistant";
}

export const CustomChat = ({ webhookUrl }: { webhookUrl: string }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sessionId] = useState(() => "chat_session_" + crypto.randomUUID());
  const scrollRef = useRef<HTMLDivElement>(null);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { id: crypto.randomUUID(), text: input, sender: "user" }]);

    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        action: "sendMessage",
        chatInput: input,
      }),
    });

    setInput("");
    if (!eventSource) startSSE();
  };

  const startSSE = () => {
    const es = new EventSource(`${webhookUrl}/stream?sessionId=${encodeURIComponent(sessionId)}`);
    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.content) {
          setMessages((prev) => [...prev, { id: crypto.randomUUID(), text: data.content, sender: "assistant" }]);
        }
      } catch (err) {
        console.error(err);
      }
    };
    es.onerror = () => {
      es.close();
      setEventSource(null);
    };
    setEventSource(es);
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  return (
    <div className="chat-container">
      <div ref={scrollRef} className="chat-messages">
        {messages.map((m) => (
          <div key={m.id} className={m.sender === "user" ? "user-msg" : "assistant-msg"}>
            {m.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input value={input} onChange={(e) => setInput(e.target.value)} />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

