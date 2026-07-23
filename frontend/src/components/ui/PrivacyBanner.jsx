import React, { useState, useEffect } from "react";
import "../../styles/PrivacyBanner.css";

const PrivacyBanner = ({ onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if banner was previously dismissed
    const dismissed = localStorage.getItem("privacyBannerDismissed");
    if (!dismissed) {
      // Show banner after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("privacyBannerDismissed", "true");
    setIsDismissed(true);
    if (onDismiss) {
      onDismiss();
    }
  };

  const handleLearnMore = () => {
    // Navigate to privacy policy page
    window.location.href = "/privacy-policy";
  };

  if (isDismissed) {
    return null;
  }

  return (
    <div
      className={`privacy-banner ${isVisible ? "privacy-banner--visible" : ""}`}
    >
      <div className="privacy-banner__content">
        <div className="privacy-banner__icon">🔒</div>
        <div className="privacy-banner__text">
          <strong>Quyền riêng tư của bạn quan trọng</strong>
          <p>
            Larry hoạt động ẩn danh. Dữ liệu của bạn không được lưu trữ hoặc
            chia sẻ.
            <button className="privacy-banner__link" onClick={handleLearnMore}>
              Tìm hiểu thêm
            </button>
          </p>
        </div>
        <button
          className="privacy-banner__close"
          onClick={handleDismiss}
          aria-label="Đóng"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default PrivacyBanner;
