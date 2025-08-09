import { useState, useRef, useEffect } from "react";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState<{ from: "user" | "bot"; text: string }[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (!message.trim()) return;

    setChatLog((prev) => [...prev, { from: "user", text: message }]);
    setMessage("");

    try {
      const res = await fetch("https://hook.eu2.make.com/92hnx6vb6qwcd906peiaf8l9v1h1698c", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      if (data.reply) {
        setChatLog((prev) => [...prev, { from: "bot", text: data.reply }]);
      }
    } catch (error) {
      console.error(error);
      setChatLog((prev) => [
        ...prev,
        { from: "bot", text: "Sorry, something went wrong." },
      ]);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLog]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat window */}
      <div
        className={`transition-all duration-300 ease-in-out transform ${
          isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0"
        } origin-bottom-right`}
      >
        {isOpen && (
          <div className="w-80 h-[28rem] bg-white border border-gray-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 font-semibold text-lg">
              💬 Streamline Flo
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 space-y-3 overflow-y-auto text-sm bg-gray-50">
              {chatLog.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.from === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2 rounded-2xl max-w-[75%] shadow-sm ${
                      msg.from === "user"
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-white text-gray-800 border rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-white border-t border-gray-200 flex items-center gap-2">
              <input
                type="text"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                onClick={sendMessage}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium transition"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition"
      >
        💬
      </button>
    </div>
  );
}
