import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/PrivacyPolicy.css";

/**
 * PrivacyPolicy Component
 * Displays the full privacy policy in an easy-to-read format
 * (not legal jargon) for students, parents, and teachers.
 */
const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="privacy-policy-page">
      <div className="privacy-policy__container">
        {/* Header */}
        <header className="privacy-policy__header">
          <button
            className="privacy-policy__back"
            onClick={() => navigate(-1)}
            aria-label="Quay lại"
          >
            ←
          </button>
          <div className="privacy-policy__title-wrap">
            <span className="privacy-policy__icon" aria-hidden="true">
              🔒
            </span>
            <h1>Chính Sách Bảo Mật — Larry</h1>
          </div>
          <p className="privacy-policy__subtitle">
            Cập nhật lần cuối: Tháng 7, 2026 · Phiên bản 1.0
          </p>
        </header>

        {/* Intro */}
        <section className="privacy-section">
          <h2>📋 Giới Thiệu</h2>
          <p>
            Larry là người bạn đồng hành AI an toàn dành cho học sinh tiểu học
            và THCS. Chúng tôi cam kết bảo vệ quyền riêng tư và dữ liệu cá nhân
            của bạn. Trang này giải thích rõ chúng tôi thu thập gì, dùng để làm
            gì, và quyền của bạn là gì — bằng ngôn ngữ dễ hiểu, không phải thuật
            ngữ pháp lý.
          </p>
        </section>

        {/* What We Collect */}
        <section className="privacy-section">
          <h2>🔒 Chúng Tôi Thu Thập Gì?</h2>

          <h3>Chế độ Ẩn Danh (Không đăng nhập)</h3>
          <ul className="privacy-list">
            <li>
              <span className="checkmark">✅</span> Session ID (tạm thời, tự
              động xóa khi bạn đóng trang)
            </li>
            <li>
              <span className="checkmark">✅</span> Cảm xúc bạn chọn hoặc nhận
              diện được
            </li>
            <li>
              <span className="checkmark">✅</span> Nội dung trò chuyện (chỉ lưu
              trong phiên hiện tại)
            </li>
            <li>
              <span className="checkmark">✅</span> Thống kê sử dụng (thời gian,
              số tin nhắn) — dùng để cải thiện sản phẩm
            </li>
          </ul>
          <p className="privacy-note">
            <span className="crossmark">❌</span> KHÔNG thu thập: Họ tên, email,
            hình ảnh, video, vị trí, hoặc bất kỳ thông tin nhận dạng nào.
          </p>

          <h3>Khi Bạn Đăng Nhập</h3>
          <ul className="privacy-list">
            <li>
              <span className="checkmark">✅</span> Lịch sử trò chuyện (được mã
              hóa)
            </li>
            <li>
              <span className="checkmark">✅</span> Cảm xúc theo thời gian
            </li>
            <li>
              <span className="checkmark">✅</span> Thống kê sử dụng cá nhân
            </li>
          </ul>
          <p className="privacy-note">
            <span className="crossmark">❌</span> KHÔNG thu thập: Hình ảnh,
            video, dữ liệu camera, hoặc thông tin cá nhân nhạy cảm.
          </p>
        </section>

        {/* Camera & Emotion Detection */}
        <section className="privacy-section">
          <h2>📸 Camera & Nhận Diện Cảm Xúc</h2>
          <div className="privacy-callout">
            <h3>Cam Kết Quan Trọng</h3>
            <ul className="privacy-list">
              <li>
                <span className="checkmark">✅</span> Camera CHỈ dùng để nhận
                diện cảm xúc — không bao giờ lưu hình ảnh khuôn mặt
              </li>
              <li>
                <span className="checkmark">✅</span> KHÔNG lưu video
              </li>
              <li>
                <span className="checkmark">✅</span> KHÔNG gửi hình ảnh đến
                server
              </li>
              <li>
                <span className="checkmark">✅</span> Tất cả xử lý diễn ra
                <strong>trên thiết bị của bạn</strong>
              </li>
              <li>
                <span className="checkmark">✅</span> Bạn luôn có thể tắt camera
                bất kỳ lúc nào
              </li>
            </ul>
          </div>
          <p>
            Bạn có quyền: Từ chối sử dụng camera, chỉ dùng nhập văn bản, và xóa
            mọi dữ liệu bất cứ lúc nào.
          </p>
        </section>

        {/* Data Protection */}
        <section className="privacy-section">
          <h2>🛡️ Bảo Vệ Dữ Liệu</h2>

          <h3>Lưu Trữ</h3>
          <ul className="privacy-list">
            <li>
              <span className="checkmark">✅</span> Dữ liệu ẩn danh: lưu trong
              sessionStorage (tự động xóa khi đóng tab)
            </li>
            <li>
              <span className="checkmark">✅</span> Dữ liệu đăng nhập: lưu trong
              localStorage (được mã hóa AES-256)
            </li>
            <li>
              <span className="checkmark">✅</span> Server: tin nhắn được mã hóa
              trước khi lưu trữ
            </li>
          </ul>

          <h3>Chia Sẻ</h3>
          <ul className="privacy-list">
            <li>
              <span className="crossmark">❌</span> KHÔNG bán dữ liệu cho bên
              thứ ba
            </li>
            <li>
              <span className="crossmark">❌</span> KHÔNG sử dụng cho quảng cáo
            </li>
            <li>
              <span className="checkmark">✅</span> Chỉ chia sẻ khi có yêu cầu
              pháp lý hợp lệ
            </li>
          </ul>

          <h3>Bảo Mật Kỹ Thuật</h3>
          <ul className="privacy-list">
            <li>
              <span className="checkmark">✅</span> Mã hóa AES-256 cho dữ liệu
              nhạy cảm
            </li>
            <li>
              <span className="checkmark">✅</span> Token JWT có thời hạn (7
              ngày)
            </li>
            <li>
              <span className="checkmark">✅</span> HTTPS only
            </li>
            <li>
              <span className="checkmark">✅</span> Mật khẩu được băm (bcrypt),
              không lưu dạng plain text
            </li>
          </ul>
        </section>

        {/* School Experiments */}
        <section className="privacy-section">
          <h2>🎓 Thử Nghiệm Tại Trường Học</h2>

          <h3>Dữ Liệu Thu Thập (Hoàn Toàn Ẩn Danh)</h3>
          <ul className="privacy-list">
            <li>
              <span className="checkmark">✅</span> Session ID (không liên kết
              với cá nhân)
            </li>
            <li>
              <span className="checkmark">✅</span> Thời gian sử dụng & số lượt
              chat
            </li>
            <li>
              <span className="checkmark">✅</span> Cảm xúc được chọn
            </li>
            <li>
              <span className="checkmark">✅</span> Phương thức: Camera hoặc
              Text
            </li>
            <li>
              <span className="checkmark">✅</span> Hoạt động (game Scratch, bài
              tập thư giãn)
            </li>
          </ul>

          <h3>Dữ Liệu KHÔNG Thu Thập</h3>
          <ul className="privacy-list">
            <li>
              <span className="crossmark">❌</span> Họ tên học sinh
            </li>
            <li>
              <span className="crossmark">❌</span> Email
            </li>
            <li>
              <span className="crossmark">❌</span> Hình ảnh/video
            </li>
            <li>
              <span className="crossmark">❌</span> Bất kỳ thông tin nhận dạng
              cá nhân nào
            </li>
          </ul>

          <h3>Mục Đích Sử Dụng</h3>
          <ul className="privacy-list">
            <li>
              <span className="checkmark">✅</span> Đánh giá hiệu quả sản phẩm
            </li>
            <li>
              <span className="checkmark">✅</span> Cải thiện trải nghiệm người
              dùng
            </li>
            <li>
              <span className="checkmark">✅</span> Nghiên cứu giáo dục (kết quả
              thống kê, không có dữ liệu cá nhân)
            </li>
          </ul>
        </section>

        {/* Your Rights */}
        <section className="privacy-section">
          <h2>👤 Quyền Của Bạn</h2>
          <ul className="privacy-list">
            <li>
              <span className="checkmark">✅</span> Xem dữ liệu của bạn bất kỳ
              lúc nào
            </li>
            <li>
              <span className="checkmark">✅</span> Xóa toàn bộ dữ liệu bất kỳ
              lúc nào — chỉ với một nút
            </li>
            <li>
              <span className="checkmark">✅</span> Xuất dữ liệu của bạn (nếu đã
              đăng nhập)
            </li>
            <li>
              <span className="checkmark">✅</span> Từ chối cung cấp bất kỳ
              thông tin nào
            </li>
            <li>
              <span className="checkmark">✅</span> Liên hệ admin để yêu cầu xóa
              dữ liệu vĩnh viễn
            </li>
          </ul>
        </section>

        {/* Contact */}
        <section className="privacy-section privacy-section--last">
          <h2>📞 Liên Hệ</h2>
          <p>
            Nếu có thắc mắn về bảo mật, bạn (hoặc phụ huynh) có thể liên hệ:
          </p>
          <ul className="privacy-contact">
            <li>Email: privacy@larry.edu.vn</li>
            <li>Website: https://larry.edu.vn/privacy</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
