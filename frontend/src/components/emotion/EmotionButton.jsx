import React from "react";
import { EMOTION_CONFIG } from "../../constants/emotions";
import "../../styles/EmotionSelection.css";

const EmotionButton = ({ emotion, isSelected, onClick }) => {
  const config = EMOTION_CONFIG[emotion];

  if (!config) return null;

  return (
    <button
      className={`emotion-button ${isSelected ? "emotion-button--selected" : ""}`}
      onClick={() => onClick(emotion)}
      type="button"
    >
      <span className="emotion-button__icon">{config.icon}</span>
      <span className="emotion-button__label">{config.label}</span>
    </button>
  );
};

export default EmotionButton;
