import { useCallback } from "react";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import AuditForm from "@/components/AuditForm";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import { toast } from "@/hooks/use-toast";

const WEBHOOK_URL =
  "https://hook.eu2.make.com/92hnx6vb6qwcd906peiaf8l9v1h1698c";

const Index = () => {
  const handleSend = useCallback(async (text: string) => {
    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          timestamp: new Date().toISOString(),
          origin: window.location.origin,
        }),
      });

      if (!res.ok) {
        toast({
          title: "Webhook error",
          description: `Request failed: ${res.status} ${res.statusText}`,
          variant: "destructive",
        });
        return;
      }

      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const json = await res.json();
        const candidate =
          (json as any)?.reply ??
          (json as any)?.message ??
          (json as any)?.text ??
          (json as any)?.data;
        if (typeof candidate === "string" && candidate.trim().length > 0)
          return candidate.trim();
        const str = JSON.stringify(json);
        return str.length > 2 ? str : undefined;
      } else {
        const textBody = (await res.text()).trim();
        return textBody.length > 0 ? textBody : undefined;
      }
    } catch (err) {
      console.error("Webhook error:", err);
      toast({
        title: "Network/CORS error",
        description: "Could not read webhook response. Ensure CORS is enabled.",
        variant: "destructive",
      });
      return;
    }
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* AI/Workflow Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-secondary/10 rounded-full blur-2xl animate-float"></div>
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-primary/20 rounded-full blur-lg animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-36 h-36 bg-secondary/15 rounded-full blur-xl animate-float"></div>
      </div>

      <Hero />
      <Services />
      <AuditForm />
      <Footer />

      {/* Floating Chat Widget */}
      <ChatWidget
        title="AI Assistant"
        subtitle="Ask me anything about our services."
        placeholder="Type your message..."
        onSend={handleSend}
        position="bottom-right"
      />
    </div>
  );
};

export default Index;
