import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/emotion-selection");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="landing-page">
      <div className="landing-content">
        <div className="landing-hero">
          <h1 className="landing-title">Xin chào 👋</h1>
          <h2 className="landing-subtitle">Chào mừng đến với Larry</h2>
          <p className="landing-description">
            Người bạn đồng hành an toàn, lắng nghe và hỗ trợ bạn mọi lúc
          </p>
        </div>

        <div className="landing-actions">
          <button className="btn-primary btn-large" onClick={handleGetStarted}>
            Bắt đầu ngay
          </button>

          <button className="btn-secondary" onClick={handleLogin}>
            Đăng nhập
          </button>
        </div>

        <div className="landing-features">
          <div className="feature-item">
            <span className="feature-icon">🔒</span>
            <span className="feature-text">Ẩn danh & Bảo mật</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">💬</span>
            <span className="feature-text">Lắng nghe không phán xét</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🛡️</span>
            <span className="feature-text">An toàn & Hỗ trợ</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
