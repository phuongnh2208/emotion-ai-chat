import React from "react";
import "./Message.css";

/**
 * Message Component
 * Displays a single chat message with role-based styling
 */
const Message = ({
  role,
  content,
  emotion,
  isEscalation = false,
  level = null,
  isFallback = false,
}) => {
  const isUser = role === "user";
  const isAssistant = role === "assistant";

  // Format content with line breaks
  const formatContent = (text) => {
    return text.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  if (isUser) {
    return (
      <div className={`message message-user`}>
        <div className="message-bubble message-bubble-user">
          <div className="message-content">{formatContent(content)}</div>
        </div>
      </div>
    );
  }

  if (isEscalation) {
    return (
      <div
        className={`message message-assistant message-escalation level-${level}`}
      >
        <div className="message-avatar">🤖</div>
        <div className="message-bubble message-bubble-assistant">
          <div className="message-sender">Larry</div>
          <div className="message-content">{formatContent(content)}</div>
          {level === "CRITICAL" && (
            <div className="message-escalation-notice">
              ⚠️ Nội dung đã được chuyển đến người giám sát
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`message message-assistant`}>
      <div className="message-avatar">🤖</div>
      <div className="message-bubble message-bubble-assistant">
        <div className="message-sender">Larry</div>
        <div className="message-content">{formatContent(content)}</div>
        {isFallback && (
          <div className="message-fallback-notice">
            💡 Phản hồi ở chế độ an toàn
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
