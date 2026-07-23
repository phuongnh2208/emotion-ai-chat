import React, { useState, useEffect } from "react";
import {
  classifyEmotion,
  getEmotionLabel,
  getEmotionIcon,
} from "../../services/emotion/textClassifier";
import "./EmotionClassifier.css";

const EmotionClassifier = ({ text, onEmotionDetected, debounceMs = 500 }) => {
  const [result, setResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (!text || text.trim().length === 0) {
      setResult(null);
      return;
    }

    setIsAnalyzing(true);

    const timeoutId = setTimeout(() => {
      const classification = classifyEmotion(text);
      setResult(classification);
      setIsAnalyzing(false);

      if (onEmotionDetected && classification.emotion) {
        onEmotionDetected(classification.emotion);
      }
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [text, debounceMs, onEmotionDetected]);

  if (!text || text.trim().length === 0 || !result) {
    return null;
  }

  const confidencePercent = Math.round(result.confidence * 100);

  return (
    <div className="emotion-classifier">
      <div className="emotion-classifier__result">
        <span className="emotion-classifier__icon">
          {getEmotionIcon(result.emotion)}
        </span>
        <span className="emotion-classifier__label">
          {getEmotionLabel(result.emotion)}
        </span>
      </div>

      {result.confidence > 0 && (
        <div className="emotion-classifier__confidence">
          <div className="confidence-bar">
            <div
              className="confidence-bar__fill"
              style={{ width: `${confidencePercent}%` }}
            />
          </div>
          <span className="confidence-text">{confidencePercent}% tin cậy</span>
        </div>
      )}

      {isAnalyzing && (
        <div className="emotion-classifier__analyzing">
          <span className="analyzing-dots">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </div>
      )}
    </div>
  );
};

export default EmotionClassifier;
