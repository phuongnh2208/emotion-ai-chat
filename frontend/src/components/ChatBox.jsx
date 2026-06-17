import { useEffect, useRef, useState } from "react";
import axios from "axios";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import Message from "./Message";
import ScratchButton from "./ScratchButton";
import TypingIndicator from "./TypingIndicator";
import { getOpeningMessage } from "../constants/openingMessages";

const API_URL = "https://emotion-ai-chat.onrender.com/chat";

function toApiHistory(messages) {
  return messages.map((msg) => ({
    role: msg.sender === "ai" ? "assistant" : "user",
    content: msg.text,
  }));
}

export default function ChatBox({ emotion }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);

  const chatRef = useRef();
  const greetingSentRef = useRef(false);

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  useEffect(() => {
    if (!emotion || greetingSentRef.current) return;

    greetingSentRef.current = true;

    const fetchOpeningMessage = async () => {
      setLoading(true);

      try {
        const res = await axios.post(API_URL, {
          emotion,
          history: [],
        });

        setMessages([
          {
            sender: "ai",
            text: res.data.message,
          },
        ]);
        setChatStarted(true);
      } catch {
        setMessages([
          {
            sender: "ai",
            text: getOpeningMessage(emotion),
          },
        ]);
        setChatStarted(true);
      } finally {
        setLoading(false);
      }
    };

    fetchOpeningMessage();
  }, [emotion]);

  const sendMessage = async () => {
    if (!input.trim() || loading || !emotion) return;

    const text = input.trim();
    const updatedMessages = [
      ...messages,
      {
        sender: "user",
        text,
      },
    ];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(API_URL, {
        emotion,
        history: toApiHistory(updatedMessages),
      });

      const aiText = res.data.message;

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: aiText,
        },
      ]);
    } catch (err) {
      const serverMsg = err.response?.data?.error;
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text:
            serverMsg ||
            "Ôi không! Larry không kết nối được server 😅",
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="chat-window">
      <ChatHeader />

      <div ref={chatRef} className="chat-messages">
        {!emotion && (
          <p className="waiting-hint">
            👀 Larry đang chờ nhìn thấy bạn qua camera...
          </p>
        )}

        {messages.map((msg, index) => (
          <Message key={index} sender={msg.sender} text={msg.text} index={index} />
        ))}

        {loading && <TypingIndicator />}
      </div>

      {chatStarted && (
        <ChatInput
          value={input}
          onChange={setInput}
          onSend={sendMessage}
          disabled={loading}
        />
      )}

      {chatStarted && <ScratchButton />}
    </div>
  );
}
