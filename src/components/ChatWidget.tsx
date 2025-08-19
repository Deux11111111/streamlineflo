// src/components/ChatWidget.tsx
import { useEffect } from 'react';
import '@n8n/chat/style.css';
import { createChat } from '@n8n/chat';

interface ChatWidgetProps {
  webhookUrl?: string;
}

export const ChatWidget = ({ 
  webhookUrl = "https://adrianzap.app.n8n.cloud/webhook/c803253c-f26b-4a80-83a5-53fad70dbdb6/chat" 
}: ChatWidgetProps) => {
  
  useEffect(() => {
    createChat({
      webhookUrl: webhookUrl,
      mode: 'window', // floating window style
      showWelcomeScreen: false,
      loadPreviousSession: true,
      initialMessages: [
        'Hi there! 👋',
        'My name is Nathan. How can I assist you today?'
      ],
      i18n: {
        en: {
          title: 'Hi there! 👋',
          subtitle: "Start a chat. We're here to help you 24/7.",
          getStarted: 'New Conversation',
          inputPlaceholder: 'Type your question..',
        },
      },
      enableStreaming: false,
    });
  }, [webhookUrl]);

  return <div id="n8n-chat"></div>;
};

