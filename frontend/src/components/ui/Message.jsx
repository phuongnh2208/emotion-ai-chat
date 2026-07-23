export default function Message({ sender, text, index = 0 }) {
  const isUser = sender === "user";

  return (
    <div
      className={`message-row ${isUser ? "message-row--user" : ""}`}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div
        className={`message-avatar ${isUser ? "message-avatar--user" : "message-avatar--ai"}`}
      >
        {isUser ? "🧒" : "🤖"}
      </div>
      <div
        className={`message-bubble ${isUser ? "message-bubble--user" : "message-bubble--ai"}`}
      >
        {text}
      </div>
    </div>
  );
}
