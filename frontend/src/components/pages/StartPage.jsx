import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import EmotionButton from "../emotion/EmotionButton";
import EmotionTextInput from "../emotion/EmotionTextInput";
import Camera from "../ui/Camera";
import "../../styles/StartPage.css";

const StartPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [customText, setCustomText] = useState("");
  const [cameraEmotion, setCameraEmotion] = useState(null);

  // Check if emotion was passed from camera or other pages
  const passedEmotion = location.state?.emotion;

  const emotions = ["happy", "sad", "angry", "anxious", "neutral", "surprised"];

  const handleEmotionSelect = (emotion) => {
    setSelectedEmotion(emotion);
  };

  const handleEmotionDetected = (emotion) => {
    setSelectedEmotion(emotion);
  };

  const handleCameraEmotion = (emotion) => {
    setCameraEmotion(emotion);
    // Auto-continue to chat when camera detects emotion
    const emotionData = {
      emotion: emotion,
      customText: "",
      timestamp: new Date().toISOString(),
    };
    sessionStorage.setItem("selectedEmotion", JSON.stringify(emotionData));
    navigate("/chat");
  };

  const handleContinue = () => {
    // Use passed emotion if available, otherwise use selected or custom text
    const emotionToUse = passedEmotion || selectedEmotion;

    if (emotionToUse || customText) {
      // Store emotion in sessionStorage for later use
      const emotionData = {
        emotion: emotionToUse,
        customText: customText,
        timestamp: new Date().toISOString(),
      };
      sessionStorage.setItem("selectedEmotion", JSON.stringify(emotionData));
      navigate("/chat");
    }
  };

  const handleSkip = () => {
    // Skip directly to chat without emotion
    sessionStorage.setItem("cameraOption", "skip");
    navigate("/chat");
  };

  // If emotion was passed from camera, auto-continue to chat
  useEffect(() => {
    if (passedEmotion) {
      const emotionData = {
        emotion: passedEmotion,
        customText: "",
        timestamp: new Date().toISOString(),
      };
      sessionStorage.setItem("selectedEmotion", JSON.stringify(emotionData));
      navigate("/chat");
    }
  }, [passedEmotion, navigate]);

  return (
    <div className="start-page">
      <div className="start-content">
        <div className="start-header">
          <h1 className="start-title">Bạn đang cảm thấy thế nào?</h1>
          <p className="start-subtitle">
            Chọn cảm xúc phù hợp nhất với bạn hoặc bỏ qua để bắt đầu
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

        <div className="camera-section">
          <Camera onEmotionDetected={handleCameraEmotion} />
        </div>

        <div className="start-actions">
          <button
            className="btn-primary btn-large"
            onClick={handleContinue}
            disabled={!selectedEmotion && !customText}
          >
            Tiếp tục
          </button>

          <button className="btn-skip" onClick={handleSkip}>
            Bỏ qua, vào chat ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartPage;
