"use client";
import { useEffect } from "react";
import "../styles/chat-widget.css"; // 👈 make sure you created this and copied your <style> CSS there

export default function ChatWidget() {
  useEffect(() => {
    // ---- Your CustomN8NChat class moved into React ----
    class CustomN8NChat {
      webhookUrl: string;
      chatInputKey: string;
      chatSessionKey: string;
      loadPreviousSession: boolean;
      messagesContainer: HTMLElement | null;
      typingIndicator: HTMLElement | null;
      chatForm: HTMLFormElement | null;
      messageInput: HTMLInputElement | null;
      toggleBtn: HTMLButtonElement | null;
      chatPanel: HTMLElement | null;
      sessionId: string;

      constructor({
        webhookUrl,
        chatInputKey,
        chatSessionKey,
        loadPreviousSession = true,
      }: {
        webhookUrl: string;
        chatInputKey: string;
        chatSessionKey: string;
        loadPreviousSession?: boolean;
      }) {
        this.webhookUrl = webhookUrl;
        this.chatInputKey = chatInputKey;
        this.chatSessionKey = chatSessionKey;
        this.loadPreviousSession = loadPreviousSession;

        this.messagesContainer = document.getElementById("messagesContainer");
        this.typingIndicator = document.getElementById("typingIndicator");
        this.chatForm = document.getElementById("chatForm") as HTMLFormElement;
        this.messageInput = document.getElementById(
          "messageInput"
        ) as HTMLInputElement;
        this.toggleBtn = document.getElementById(
          "toggleBtn"
        ) as HTMLButtonElement;
        this.chatPanel = document.getElementById("chatPanel");

        this.sessionId =
          localStorage.getItem(this.chatSessionKey) || this.generateSessionId();

        this.init();
      }

      generateSessionId() {
        const id = Math.random().toString(36).substring(2);
        localStorage.setItem(this.chatSessionKey, id);
        return id;
      }

      init() {
        if (!this.chatForm || !this.messageInput) return;

        this.chatForm.addEventListener("submit", (e) => {
          e.preventDefault();
          const message = this.messageInput!.value.trim();
          if (message) {
            this.addMessage(message, "user");
            this.messageInput!.value = "";
            this.sendMessage(message);
          }
        });

        if (this.toggleBtn && this.chatPanel) {
          this.toggleBtn.addEventListener("click", () => {
            const expanded =
              this.toggleBtn!.getAttribute("aria-expanded") === "true";
            this.toggleBtn!.setAttribute(
              "aria-expanded",
              (!expanded).toString()
            );
            this.chatPanel!.style.display = expanded ? "none" : "flex";
          });
        }
      }

      addMessage(text: string, sender: "user" | "assistant") {
        if (!this.messagesContainer) return;
        const row = document.createElement("div");
        row.className = `premium-row ${sender}`;
        const bubble = document.createElement("div");
        bubble.className = `premium-bubble ${sender}`;
        bubble.textContent = text;
        row.appendChild(bubble);
        this.messagesContainer.appendChild(row);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
      }

      showTyping(show: boolean) {
        if (this.typingIndicator) {
          this.typingIndicator.style.display = show ? "flex" : "none";
        }
      }

      async sendMessage(message: string) {
        this.showTyping(true);
        try {
          const response = await fetch(this.webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              [this.chatInputKey]: message,
              [this.chatSessionKey]: this.sessionId,
            }),
          });
          const data = await response.json();
          if (data && data.reply) {
            this.addMessage(data.reply, "assistant");
          }
        } catch (err) {
          console.error("Chat error:", err);
        } finally {
          this.showTyping(false);
        }
      }
    }

    // ---- Initialize your chat widget ----
    new CustomN8NChat({
      webhookUrl: "YOUR_N8N_WEBHOOK_URL", // 👈 replace with your real webhook
      chatInputKey: "chatInput",
      chatSessionKey: "sessionId",
      loadPreviousSession: true,
    });
  }, []);

  // ---- Your full design ----
  return (
    <div className="demo-container">
      <button
        className="premium-btn"
        id="toggleBtn"
        aria-expanded="false"
        aria-controls="chatPanel"
        title="Open chat"
      >
        <svg
          className="premium-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
        </svg>
        <span className="premium-glow"></span>
      </button>

      <div
        className="premium-card"
        id="chatPanel"
        role="dialog"
        aria-label="Chat widget"
        style={{ display: "none" }}
      >
        <div className="premium-header">
          <h2 className="premium-title">AI Assistant</h2>
          <p className="premium-sub">
            Start a conversation. We're here to help you 24/7.
          </p>
        </div>

        <div className="premium-body">
          <div className="premium-scroll" id="messagesContainer">
            <div className="premium-row assistant">
              <div className="premium-bubble assistant">
                Hi there! 👋 My name is Nathan. How can I assist you today?
              </div>
            </div>
          </div>
        </div>

        <div className="typing-indicator" id="typingIndicator">
          <div className="typing-dots">
            <div className="dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>

        <form className="premium-footer" id="chatForm">
          <input
            className="premium-input"
            id="messageInput"
            placeholder="Type your message..."
            aria-label="Message"
          />
          <button className="premium-send" id="sendButton" type="submit">
            <svg
              className="premium-send-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}

