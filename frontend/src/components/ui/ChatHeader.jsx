import React from "react";
import { Link } from "react-router-dom";
import AnonymousBadge from "./AnonymousBadge";
import "../../styles/Header.css";

/**
 * ChatHeader Component
 * Displays the chat header with Larry's avatar, name, safety indicator,
 * and anonymous mode badge.
 *
 * @param {string} emotion - Current detected emotion
 * @param {function} onBack - Back button handler
 * @param {function} onClear - Clear chat handler
 * @param {boolean} isAnonymous - Whether the user is in anonymous mode
 */
const ChatHeader = ({ emotion, onBack, onClear, isAnonymous = true }) => {
  return (
    <header className="chat-header">
      <div className="chat-header__left">
        {onBack && (
          <button
            className="chat-header__back"
            onClick={onBack}
            aria-label="Quay lại"
          >
            ←
          </button>
        )}
        <div className="chat-header__avatar">🤖</div>
        <div className="chat-header__info">
          <h1 className="chat-header__name">
            Larry
            <span aria-hidden="true">⭐</span>
          </h1>
          <p className="chat-header__tagline">Người bạn AI của bạn ❤️</p>
        </div>
      </div>

      <div className="chat-header__right">
        {/* Safety indicator */}
        <div className="chat-header__safety" title="An toàn AI đã được bật">
          <span aria-hidden="true">🛡️</span>
          <span className="chat-header__safety-text">An toàn</span>
        </div>

        {/* Anonymous mode badge */}
        <AnonymousBadge isAnonymous={isAnonymous} />

        {/* Privacy policy link */}
        <Link
          to="/privacy-policy"
          className="chat-header__privacy-link"
          title="Chính sách bảo mật"
          aria-label="Chính sách bảo mật"
        >
          🔒
        </Link>
      </div>

      <div className="chat-header__decor" aria-hidden="true">
        <span>🌈</span>
        <span>⭐</span>
      </div>
    </header>
  );
};

export default ChatHeader;
