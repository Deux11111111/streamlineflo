import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import N8nChat from "./components/N8nChat";

const queryClient = new QueryClient();

const App = () => (
   const showChatbot = false; // set to true to enable later
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>

        <N8nChat 
          webhookUrl="https://jeffzeb12.app.n8n.cloud/webhook/c803253c-f26b-4a80-83a5-53fad70dbdb6/chat"
          title="Your Assistant"
          subtitle="How can I help you today?"
          position="bottom-right"
        />
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
