import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import AuthInput from "./AuthInput";
import GradientButton from "./GradientButton";
import PlayfulBackground from "./PlayfulBackground";
import "../../styles/AuthForms.css";

const Register = ({ onSwitchToLogin }) => {
  const { register, error: authError } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [agree, setAgree] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!agree) {
      setError("Bạn cần đồng ý với Điều khoản sử dụng.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    setLoading(true);

    const result = await register(username, email, password);

    if (result.success) {
      // Navigate to chat page after successful registration
      navigate("/chat");
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <PlayfulBackground />

      <div className="auth-card">
        {/* Avatar */}

        <div className="auth-card__avatar auth-card__avatar--pink">🤖</div>

        {/* Title */}

        <h1 className="auth-title">
          Larry <span>⭐</span>
        </h1>

        <p className="auth-subtitle">
          Tạo tài khoản mới để bắt đầu
          <br />
          hành trình cùng AI Larry ❤️
        </p>

        {(error || authError) && (
          <div className="auth-error">{error || authError}</div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          {/* Name */}

          <div className="form-group">
            <label>Họ và tên</label>

            <AuthInput
              id="username"
              icon={<FaUser />}
              placeholder="Nhập họ và tên của bạn"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Email */}

          <div className="form-group">
            <label>Email</label>

            <AuthInput
              id="email"
              type="email"
              icon={<FaEnvelope />}
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}

          <div className="form-group">
            <label>Mật khẩu</label>

            <AuthInput
              id="password"
              type={showPassword ? "text" : "password"}
              icon={<FaLock />}
              rightIcon={showPassword ? <FaEyeSlash /> : <FaEye />}
              onRightClick={() => setShowPassword(!showPassword)}
              placeholder="Nhập mật khẩu của bạn"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Confirm */}

          <div className="form-group">
            <label>Xác nhận mật khẩu</label>

            <AuthInput
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              icon={<FaLock />}
              rightIcon={showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              onRightClick={() => setShowConfirmPassword(!showConfirmPassword)}
              placeholder="Nhập lại mật khẩu của bạn"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {/* Checkbox */}

          <label className="auth-terms">
            <input
              type="checkbox"
              checked={agree}
              onChange={() => setAgree(!agree)}
            />

            <span>
              Tôi đồng ý với <a href="/">Điều khoản</a> và{" "}
              <a href="/">Chính sách bảo mật</a>
            </span>
          </label>

          {/* Register */}

          <GradientButton
            type="submit"
            fullWidth
            variant="pink"
            loading={loading}
            rightIcon="→"
            disabled={!agree}
          >
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </GradientButton>
        </form>

        {/* Footer */}

        <div className="auth-switch">
          Đã có tài khoản?
          <button type="button" onClick={onSwitchToLogin}>
            Đăng nhập ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
