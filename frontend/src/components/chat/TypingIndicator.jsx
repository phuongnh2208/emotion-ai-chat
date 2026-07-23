import React from "react";
import "./TypingIndicator.css";

/**
 * TypingIndicator Component
 * Animated typing indicator showing Larry is responding
 */
const TypingIndicator = () => {
  return (
    <div className="typing-indicator">
      <div className="typing-indicator-avatar">🤖</div>
      <div className="typing-indicator-bubble">
        <span className="typing-dot typing-dot-1"></span>
        <span className="typing-dot typing-dot-2"></span>
        <span className="typing-dot typing-dot-3"></span>
      </div>
    </div>
  );
};

export default TypingIndicator;
