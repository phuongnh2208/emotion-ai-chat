import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/CameraOption.css";

const CameraOptionPage = () => {
  const navigate = useNavigate();

  const handleCameraOption = () => {
    // Navigate to camera/chat with camera enabled
    sessionStorage.setItem("cameraOption", "camera");
    navigate("/");
  };

  const handleTextOption = () => {
    // Navigate to chat with text-only mode
    sessionStorage.setItem("cameraOption", "text");
    navigate("/");
  };

  const handleSkip = () => {
    // Skip directly to chat
    sessionStorage.setItem("cameraOption", "skip");
    navigate("/");
  };

  return (
    <div className="camera-option-page">
      <div className="camera-option-content">
        <div className="camera-option-header">
          <h1 className="camera-option-title">Bạn muốn dùng camera không?</h1>
          <p className="camera-option-subtitle">
            Camera giúp Larry nhận diện cảm xúc của bạn tốt hơn
          </p>
        </div>

        <div className="camera-options-grid">
          <div className="camera-option-card" onClick={handleCameraOption}>
            <div className="camera-option-icon">📷</div>
            <h3 className="camera-option-title-card">Dùng Camera</h3>
            <p className="camera-option-description">
              Cho phép Larry nhìn thấy cảm xúc của bạn qua camera
            </p>
            <button className="btn-primary">Chọn camera</button>
          </div>

          <div className="camera-option-card" onClick={handleTextOption}>
            <div className="camera-option-icon">⌨️</div>
            <h3 className="camera-option-title-card">Nhập cảm xúc</h3>
            <p className="camera-option-description">
              Chỉ dùng văn bản, không cần camera
            </p>
            <button className="btn-secondary">Chọn văn bản</button>
          </div>
        </div>

        <div className="camera-option-footer">
          <div className="privacy-info">
            <span className="privacy-icon">🔒</span>
            <p className="privacy-text">
              Camera chỉ dùng để nhận diện cảm xúc. Hình ảnh không được lưu hoặc
              gửi đi đâu.
            </p>
          </div>

          <button className="btn-skip" onClick={handleSkip}>
            Bỏ qua, vào chat ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default CameraOptionPage;
