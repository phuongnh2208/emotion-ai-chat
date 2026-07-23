import React, { useState, useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import ChatBox from "./ChatBox";

/**
 * ChatPage Component
 * Page wrapper for the chat interface
 * Reads emotion from sessionStorage or props
 */
const ChatPage = ({ emotion: propEmotion, method: propMethod }) => {
  const [emotion, setEmotion] = useState(propEmotion || null);
  const [method, setMethod] = useState(propMethod || "button");
  const [isLoading, setIsLoading] = useState(true);
  const loadedRef = useRef(false);

  useEffect(() => {
    // Only run once
    if (loadedRef.current) return;
    loadedRef.current = true;

    // Try to get emotion from sessionStorage if not provided as prop
    if (!emotion) {
      try {
        const storedEmotion = sessionStorage.getItem("selectedEmotion");
        if (storedEmotion) {
          const emotionData = JSON.parse(storedEmotion);
          setEmotion(emotionData.emotion);
          // Clear after reading
          sessionStorage.removeItem("selectedEmotion");
        }
      } catch (err) {
        console.error("Error reading from sessionStorage:", err);
      }
    }

    // Get camera option from sessionStorage
    try {
      const cameraOption = sessionStorage.getItem("cameraOption");
      if (cameraOption) {
        setMethod(cameraOption);
        // Clear after reading
        sessionStorage.removeItem("cameraOption");
      }
    } catch (err) {
      console.error("Error reading camera option:", err);
    }

    setIsLoading(false);
  }, []); // Empty dependency - only run once on mount

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Đang tải...</p>
      </div>
    );
  }

  if (!emotion) {
    // Redirect to start page if no emotion provided
    return <Navigate to="/start" replace />;
  }

  return (
    <div className="chat-page">
      <ChatBox emotion={emotion} method={method} />
    </div>
  );
};

export default ChatPage;
