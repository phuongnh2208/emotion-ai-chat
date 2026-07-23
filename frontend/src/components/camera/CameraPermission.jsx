import React from "react";

export default function CameraPermission({ onAllow, onDeny }) {
  return (
    <div className="camera-permission">
      <div className="camera-permission__icon">📷</div>
      <h3 className="camera-permission__title">
        Larry muốn xem cảm xúc của bạn qua camera
      </h3>
      <p className="camera-permission__desc">
        Camera chỉ dùng để nhận diện cảm xúc theo thời gian thực. Hình ảnh không
        được lưu trữ hay gửi đi đâu cả.
      </p>
      <div className="camera-permission__actions">
        <button
          className="camera-permission__btn camera-permission__btn--allow"
          onClick={onAllow}
        >
          Cho phép dùng camera
        </button>
        <button
          className="camera-permission__btn camera-permission__btn--deny"
          onClick={onDeny}
        >
          Không, nhập cảm xúc bằng văn bản
        </button>
      </div>
    </div>
  );
}
