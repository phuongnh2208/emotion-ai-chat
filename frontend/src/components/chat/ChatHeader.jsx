import React from "react";
import "./ChatHeader.css";

/**
 * ChatHeader Component
 * Displays emotion info and navigation controls
 */
const ChatHeader = ({ emotion, onBack, onClear }) => {
  const emotionLabels = {
    happy: "Vui vẻ",
    sad: "Buồn",
    angry: "Tức giận",
    neutral: "Bình thường",
    surprised: "Ngạc nhiên",
    fearful: "Lo lắng",
    disgusted: "Khó chịu",
  };

  const emotionIcons = {
    happy: "😊",
    sad: "😢",
    angry: "😤",
    neutral: "😊",
    surprised: "😲",
    fearful: "😨",
    disgusted: "🤢",
  };

  return (
    <header className="chat-header">
      <div className="chat-header-left">
        <button
          className="chat-header-back"
          onClick={onBack}
          aria-label="Quay lại"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <div className="chat-header-center">
        <div className="chat-header-emotion">
          <span className="chat-header-emotion-icon">
            {emotionIcons[emotion] || "😊"}
          </span>
          <div className="chat-header-emotion-info">
            <span className="chat-header-title">Larry</span>
            <span className="chat-header-subtitle">
              Cảm xúc: {emotionLabels[emotion] || emotion}
            </span>
          </div>
        </div>
      </div>

      <div className="chat-header-right">
        <button
          className="chat-header-clear"
          onClick={onClear}
          aria-label="Xóa cuộc trò chuyện"
          title="Bắt đầu lại"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default ChatHeader;
