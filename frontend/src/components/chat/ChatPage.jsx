import React from "react";
import { useLocation, Navigate } from "react-router-dom";
import ChatBox from "./ChatBox";

/**
 * ChatPage Component
 * Page wrapper for the chat interface
 * Can receive emotion and method from:
 * - Direct props (for use in ProtectedApp)
 * - URL search params (?emotion=happy&method=camera)
 * - Location state (from navigation)
 */
const ChatPage = ({ emotion: propEmotion, method: propMethod }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  // Priority: props > URL params > location state
  const emotion =
    propEmotion || searchParams.get("emotion") || location.state?.emotion;
  const method =
    propMethod ||
    searchParams.get("method") ||
    location.state?.method ||
    "button";

  if (!emotion) {
    // Redirect to emotion selection if no emotion provided
    return <Navigate to="/emotion" replace />;
  }

  return (
    <div className="chat-page">
      <ChatBox emotion={emotion} method={method} />
    </div>
  );
};

export default ChatPage;
