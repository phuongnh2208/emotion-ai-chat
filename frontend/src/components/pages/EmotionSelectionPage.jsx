import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmotionButton from "../emotion/EmotionButton";
import EmotionTextInput from "../emotion/EmotionTextInput";
import "../../styles/EmotionSelection.css";

const EmotionSelectionPage = () => {
  const navigate = useNavigate();
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [customText, setCustomText] = useState("");

  const emotions = [
    "happy",
    "sad",
    "angry",
    "anxious",
    "neutral",
    "surprised",
    "fearful",
  ];

  const handleEmotionSelect = (emotion) => {
    setSelectedEmotion(emotion);
  };

  const handleEmotionDetected = (emotion) => {
    setSelectedEmotion(emotion);
  };

  const handleContinue = () => {
    if (selectedEmotion || customText) {
      // Store emotion in sessionStorage for later use
      const emotionData = {
        emotion: selectedEmotion,
        customText: customText,
        timestamp: new Date().toISOString(),
      };
      sessionStorage.setItem("selectedEmotion", JSON.stringify(emotionData));
      navigate("/camera-option");
    }
  };

  return (
    <div className="emotion-selection-page">
      <div className="emotion-selection-content">
        <div className="emotion-selection-header">
          <h1 className="emotion-selection-title">
            Bạn đang cảm thấy thế nào?
          </h1>
          <p className="emotion-selection-subtitle">
            Chọn cảm xúc phù hợp nhất với bạn
          </p>
          <div className="privacy-notice">
            <span className="privacy-icon">🔒</span>
            <span className="privacy-text">
              Chế độ ẩn danh - Dữ liệu không được lưu
            </span>
          </div>
        </div>

        <div className="emotion-buttons-grid">
          {emotions.map((emotion) => (
            <EmotionButton
              key={emotion}
              emotion={emotion}
              isSelected={selectedEmotion === emotion}
              onClick={handleEmotionSelect}
            />
          ))}
        </div>

        <div className="emotion-text-section">
          <EmotionTextInput
            onEmotionDetected={handleEmotionDetected}
            onContinue={setCustomText}
          />
        </div>

        <div className="emotion-selection-actions">
          <button
            className="btn-primary btn-large"
            onClick={handleContinue}
            disabled={!selectedEmotion && !customText}
          >
            Tiếp tục
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmotionSelectionPage;
