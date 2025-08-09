import { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, MessageCircle, X } from "lucide-react";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: number;
};

export type ChatWidgetProps = {
  title?: string;
  subtitle?: string;
  placeholder?: string;
  initialMessages?: ChatMessage[];
  onSend?: (message: string) => Promise<string | void> | string | void;
  position?: "bottom-right" | "bottom-left";
};

export default function ChatWidget({
  title = "Chat",
  subtitle = "Ask anything and connect this to your API.",
  placeholder = "Type your message...",
  initialMessages = [],
  onSend,
  position = "bottom-right",
}: ChatWidgetProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [sending, setSending] = useState(false);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const el = scrollRef.current;
    if (!el) return;
    // Scroll to bottom on open and when messages change
    el.scrollTop = el.scrollHeight;
  }, [open, messages.length]);

  const containerPos = useMemo(() => {
    return position === "bottom-left"
      ? "left-6 md:left-8"
      : "right-6 md:right-8";
  }, [position]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || sending) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      createdAt: Date.now(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setSending(true);

    try {
      let reply: string | void;
      if (onSend) {
        reply = await onSend(trimmed);
      } else {
        // Default demo response
        await new Promise((r) => setTimeout(r, 500));
        reply = Echo: ${trimmed};
      }
      if (reply && reply.length > 0) {
        const botMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: reply,
          createdAt: Date.now(),
        };
        setMessages((m) => [...m, botMsg]);
      }
    } catch (e) {
      console.error("Chat send error:", e);
      // Do not add assistant/error messages in chat; let backend respond instead.
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={fixed z-50 bottom-6 md:bottom-8 ${containerPos}}>
      {/* Floating toggle button */}
      <div className="flex justify-end">
        <Button
          aria-expanded={open}
          aria-controls="chat-widget-panel"
          onClick={() => setOpen((v) => !v)}
          className="rounded-full h-12 w-12 shadow-lg relative"
          title={open ? "Close chat" : "Open chat"}
        >
          {open ? (
            <X className="h-5 w-5" />
          ) : (
            <MessageCircle className="h-5 w-5" />
          )}
          {/* Subtle glow */}
          <span className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-primary/10 blur-xl" />
        </Button>
      </div>

      {/* Panel */}
      {open && (
        <Card
          id="chat-widget-panel"
          role="dialog"
          aria-label="Chat widget"
          className="mt-3 w-[min(90vw,380px)] overflow-hidden shadow-xl"
        >
          <header className="px-4 pt-4 pb-3 border-b">
            <h2 className="text-base font-semibold leading-none tracking-tight">
              {title}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          </header>

          <div className="h-72">
            <ScrollArea className="h-full">
              <div ref={scrollRef} className="px-4 py-3 space-y-3">
                {messages.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Start the conversation below.
                  </p>
                )}
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={
                      m.role === "user"
                        ? "flex justify-end"
                        : "flex justify-start"
                    }
                  >
                    <div
                      className={
                        "max-w-[80%] rounded-lg px-3 py-2 text-sm border " +
                        (m.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-card text-foreground")
                      }
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <form
            className="p-3 border-t flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholder}
              aria-label="Message"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <Button type="submit" disabled={sending || input.trim().length === 0}>
              {sending ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Send
                </span>
              ) : (
                "Send"
              )}
            </Button>
          </form>
        </Card>
      )}
    </div>
  );
}
