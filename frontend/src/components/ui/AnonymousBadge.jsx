import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/AnonymousBadge.css";

/**
 * AnonymousBadge Component
 * Displays a clear badge when the user is in anonymous mode.
 * Shows "Ẩn danh" with a lock icon, includes a tooltip explaining
 * that data is not stored, and links to the Privacy Policy on click.
 *
 * @param {boolean} isAnonymous - Whether the user is in anonymous mode
 */
const AnonymousBadge = ({ isAnonymous = true }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const navigate = useNavigate();

  if (!isAnonymous) return null;

  const handleClick = () => {
    navigate("/privacy-policy");
  };

  return (
    <div
      className="anonymous-badge"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label="Chế độ ẩn danh - nhấn để xem chính sách bảo mật"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <span className="anonymous-badge__icon" aria-hidden="true">
        🔒
      </span>
      <span className="anonymous-badge__text">Ẩn danh</span>

      {showTooltip && (
        <div className="anonymous-badge__tooltip" role="tooltip">
          Dữ liệu không được lưu trữ. Nhấn để xem chính sách bảo mật.
        </div>
      )}
    </div>
  );
};

export default AnonymousBadge;
