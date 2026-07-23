import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./ChatBox.css";
import { startChatSession, sendMessage } from "../../services/chatService";
import { useAuth } from "../../contexts/AuthContext";
import ChatHeader from "./ChatHeader";
import Message from "./Message";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";

/**
 * ChatBox Component
 * Main chat interface for the emotion AI chat system
 *
 * @param {string} emotion - Current detected emotion
 * @param {string} method - Input method: 'camera', 'text', 'button'
 */
const ChatBox = ({ emotion, method = "button" }) => {
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize chat session on mount
  useEffect(() => {
    const initSession = async () => {
      if (!emotion) {
        navigate("/start");
        return;
      }

      try {
        setIsLoading(true);
        const data = await startChatSession(emotion, method);
        setSessionId(data.sessionId);
        setMessages([
          {
            id: Date.now(),
            role: "assistant",
            content: data.message,
            emotion: data.emotion,
          },
        ]);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    initSession();
  }, [emotion, method, navigate]);

  // Handle sending a message
  const handleSendMessage = async (message) => {
    if (!message.trim() || !sessionId || isLoading) return;

    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      role: "user",
      content: message.trim(),
      emotion,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const data = await sendMessage(sessionId, message, emotion);

      if (data.escalation) {
        // Handle escalation response
        const escalationMessage = {
          id: Date.now() + 1,
          role: "assistant",
          content: data.message,
          emotion: data.emotion,
          isEscalation: true,
          level: data.level,
        };
        setMessages((prev) => [...prev, escalationMessage]);
      } else {
        // Add AI response
        const aiMessage = {
          id: Date.now() + 1,
          role: "assistant",
          content: data.message,
          emotion: data.emotion,
          isFallback: data.fallback,
        };
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle going back
  const handleBack = () => {
    navigate("/start");
  };

  // Handle clearing chat
  const handleClearChat = () => {
    setMessages([]);
    setSessionId(null);
    // Reinitialize session
    setTimeout(() => {
      const initSession = async () => {
        try {
          const data = await startChatSession(emotion, method);
          setSessionId(data.sessionId);
          setMessages([
            {
              id: Date.now(),
              role: "assistant",
              content: data.message,
              emotion: data.emotion,
            },
          ]);
        } catch (err) {
          setError(err.message);
        }
      };
      initSession();
    }, 100);
  };

  if (isLoading && messages.length === 0) {
    return (
      <div className="chatbox-loading">
        <TypingIndicator />
        <p>Đang kết nối với Larry...</p>
      </div>
    );
  }

  if (error && messages.length === 0) {
    return (
      <div className="chatbox-error">
        <p>Không thể kết nối: {error}</p>
        <button onClick={() => navigate("/start")}>Quay lại</button>
      </div>
    );
  }

  return (
    <div className="chatbox-container">
      <ChatHeader
        emotion={emotion}
        onBack={handleBack}
        onClear={handleClearChat}
        isAnonymous={!isAuthenticated}
      />

      <div className="chatbox-messages">
        {messages.map((msg) => (
          <Message
            key={msg.id}
            role={msg.role}
            content={msg.content}
            emotion={msg.emotion}
            isEscalation={msg.isEscalation}
            level={msg.level}
            isFallback={msg.isFallback}
          />
        ))}
        {isLoading && messages.length > 0 && (
          <div className="typing-indicator-wrapper">
            <TypingIndicator />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput
        onSend={handleSendMessage}
        disabled={isLoading || !sessionId}
        placeholder="Nhập tin nhắn của bạn..."
      />
    </div>
  );
};

export default ChatBox;
