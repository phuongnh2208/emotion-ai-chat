import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

import { useAuth } from "../context/AuthContext";
import AuthInput from "../components/AuthInput";
import GradientButton from "../components/ui/GradientButton";
import PlayfulBackground from "../components/PlayfulBackground";
import "../styles/AuthForms.css";

export default function Login() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [remember, setRemember] = useState(true);

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    setError("");

    const result = await login(email, password);

    if (!result.success) {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="auth-page">
      <PlayfulBackground />

      <div className="auth-wrapper">
        <div className="auth-card">
          {/* Avatar */}
          <div className="auth-card__avatar">
            🤖
          </div>
          {/* Title */}

          <h1 className="auth-title">Đăng nhập</h1>

          <p className="auth-subtitle">
            Đăng nhập để bắt đầu trò chuyện cùng Larry
          </p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* EMAIL */}

            <div className="form-group">
              <label>Email</label>

              <AuthInput
                icon={<FaEnvelope />}
                type="email"
                placeholder="Nhập email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* PASSWORD */}

            <div className="form-group">
              <label>Mật khẩu</label>

              <AuthInput
                icon={<FaLock />}
                rightIcon={
                  showPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )
                }
                onRightClick={() =>
                  setShowPassword(!showPassword)
                }
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />
            </div>

            {/* remember */}

            <div className="auth-remember-row">
              <label className="auth-remember">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={() => setRemember(!remember)}
                />
                <span>Ghi nhớ đăng nhập</span>
              </label>

              <button type="button" className="forgot-btn">
                Quên mật khẩu?
              </button>
            </div>

            {/* LOGIN */}

            <GradientButton
              type="submit"
              loading={loading}
              fullWidth
            >
              {loading
                ? "Đang đăng nhập..."
                : "Đăng nhập →"}
            </GradientButton>
          </form>

          {/* bottom */}

          <div className="auth-bottom">
            Chưa có tài khoản?

            <Link to="/register">
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}