import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import {
  loadFaceApiModels,
  detectEmotion,
} from "../../services/emotion/faceApi";
import EmotionBadge from "./EmotionBadge";
import CameraPermission from "../camera/CameraPermission";
import "../../styles/Camera.css";

export default function Camera({ onEmotionDetected, onStart, onStop }) {
  const webcamRef = useRef(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const lastEmotionRef = useRef(null);
  const initialEmotionSentRef = useRef(false);
  const navigate = useNavigate();

  const stopDetection = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
    onStop?.();
  }, [onStop]);

  useEffect(() => {
    if (!permissionGranted) return;

    let cancelled = false;

    async function init() {
      const loaded = await loadFaceApiModels();
      if (!cancelled) setModelsLoaded(loaded);
    }
    init();

    return () => {
      cancelled = true;
      stopDetection();
    };
  }, [permissionGranted, stopDetection]);

  useEffect(() => {
    if (!modelsLoaded || !permissionGranted) return;

    setIsRunning(true);
    onStart?.();

    intervalRef.current = setInterval(async () => {
      const video = webcamRef.current?.video;
      if (!video) return;

      const result = await detectEmotion(video);
      if (!result) return;

      setCurrentEmotion(result.emotion);

      if (!initialEmotionSentRef.current) {
        initialEmotionSentRef.current = true;
        lastEmotionRef.current = result.emotion;
        onEmotionDetected?.(result.emotion);
      }
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsRunning(false);
    };
  }, [modelsLoaded, permissionGranted, onEmotionDetected, onStart]);

  const handleAllow = () => {
    setPermissionGranted(true);
  };

  const handleDeny = () => {
    setPermissionGranted(false);
    // Navigate to start page if camera permission denied
    navigate("/start");
  };

  if (!permissionGranted) {
    return <CameraPermission onAllow={handleAllow} onDeny={handleDeny} />;
  }

  const statusText = !modelsLoaded
    ? "🧠 Đang tải model nhận diện..."
    : !currentEmotion
      ? "👀 Larry đang quan sát cảm xúc của bạn..."
      : "😊 Larry đã nhận diện được cảm xúc!";

  return (
    <div className="camera-panel">
      <div className="camera-panel__header">
        <span className="camera-panel__icon">📷</span>
        <h3 className="camera-panel__title">Camera</h3>
        {isRunning && <span className="camera-panel__dot" title="Đang chạy" />}
      </div>

      <div className="camera-panel__frame">
        <div className="camera-panel__screen">
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: "user" }}
          />
        </div>
      </div>

      <EmotionBadge emotion={currentEmotion} />

      <p className="camera-panel__status">{statusText}</p>

      <p className="camera-panel__privacy">
        🔒 Camera chỉ dùng để nhận diện cảm xúc. Hình ảnh/video không được lưu.
      </p>
    </div>
  );
}
