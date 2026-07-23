export default function TypingIndicator() {
  return (
    <div className="typing-indicator">
      <div className="message-avatar message-avatar--ai">🤖</div>
      <div className="typing-bubble">
        <div className="typing-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <p className="typing-label">Larry đang suy nghĩ...</p>
      </div>
    </div>
  );
}
