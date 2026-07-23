import React, { useState } from "react";
import "../../styles/EmotionSelection.css";

const EmotionTextInput = ({ onEmotionDetected, onContinue }) => {
  const [text, setText] = useState("");

  const handleTextChange = (e) => {
    const value = e.target.value;
    setText(value);

    // Simple emotion detection from text
    const detectedEmotion = detectEmotionFromText(value);
    if (detectedEmotion) {
      onEmotionDetected(detectedEmotion);
    }
  };

  const detectEmotionFromText = (text) => {
    const lowerText = text.toLowerCase();

    // Vietnamese emotion keywords
    const emotionKeywords = {
      happy: [
        "vui",
        "hạnh phúc",
        "tốt",
        "tuyệt",
        "vui vẻ",
        "phấn khởi",
        "hào hứng",
      ],
      sad: [
        "buồn",
        "khóc",
        "tệ",
        "xấu",
        "chán",
        "buồn bã",
        "đau khổ",
        "thất vọng",
      ],
      angry: [
        "tức",
        "giận",
        "khó chịu",
        "bực",
        "nóng",
        "cáu",
        "tức giận",
        "phẫn nộ",
      ],
      anxious: [
        "lo",
        "sợ",
        "hồi hộp",
        "căng thẳng",
        "lo lắng",
        "bất an",
        "sợ hãi",
      ],
      neutral: ["bình thường", "thường", "ok", "được", "tạm", "bình thường"],
    };

    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      if (keywords.some((keyword) => lowerText.includes(keyword))) {
        return emotion;
      }
    }

    return null;
  };

  return (
    <div className="emotion-text-input">
      <label htmlFor="emotion-text" className="emotion-text-input__label">
        Tôi muốn chia sẻ bằng lời
      </label>
      <textarea
        id="emotion-text"
        className="emotion-text-input__textarea"
        value={text}
        onChange={handleTextChange}
        placeholder="Hôm nay bạn cảm thấy thế nào?"
        rows={4}
      />
    </div>
  );
};

export default EmotionTextInput;
