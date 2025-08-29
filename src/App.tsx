// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import N8nChat from "./components/N8nChat";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>

      {/* N8n Chat Widget */}
      <N8nChat 
        webhookUrl="https://streamline1.app.n8n.cloud/webhook/49141e25-b115-46c7-a7c9-f1c34a5fb0cb/chat"
        title="Your Assistant"
        subtitle="How can I help you today?"
        position="bottom-right"
      />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
