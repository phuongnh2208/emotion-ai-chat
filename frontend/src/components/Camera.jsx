import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import EmotionBadge from "./EmotionBadge";

export default function Camera({ onEmotionDetected }) {
  const webcamRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const lastEmotionRef = useRef(null);
  const initialEmotionSentRef = useRef(false);

  useEffect(() => {
    async function loadModels() {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceExpressionNet.loadFromUri("/models");
      setModelsLoaded(true);
    }
    loadModels();
  }, []);

  useEffect(() => {
    if (!modelsLoaded) return;

    const interval = setInterval(async () => {
      const video = webcamRef.current?.video;
      if (!video || video.readyState !== 4) return;

      const detection = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (!detection) return;

      const emotion = Object.keys(detection.expressions).reduce((a, b) =>
        detection.expressions[a] > detection.expressions[b] ? a : b
      );

      setCurrentEmotion(emotion);

      if (!initialEmotionSentRef.current) {
        initialEmotionSentRef.current = true;
        lastEmotionRef.current = emotion;
        onEmotionDetected?.(emotion);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [modelsLoaded, onEmotionDetected]);

  const statusText = !modelsLoaded
    ? "Đang tải model nhận diện..."
    : !currentEmotion
      ? "Larry đang quan sát cảm xúc của bạn..."
      : "Larry đang quan sát cảm xúc của bạn...";

  return (
    <div className="camera-panel">
      <h2 className="camera-title">📷 Larry đang nhìn bạn</h2>

      <div className="tv-frame">
        <div className="tv-screen">
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: "user" }}
          />
        </div>
      </div>

      <EmotionBadge emotion={currentEmotion} />

      <p className="camera-status">{statusText}</p>
    </div>
  );
}
