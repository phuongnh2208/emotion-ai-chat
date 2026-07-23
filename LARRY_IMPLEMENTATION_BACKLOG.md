# Larry - Implementation Backlog

## 📋 Tổng Quan

Document này chia kế hoạch cải tiến Larry thành backlog triển khai chi tiết, bao gồm:
- **7 Epics** theo thứ tự ưu tiên
- **40+ Tasks** cụ thể, mỗi task có thể hoàn thành độc lập
- **Dependencies** rõ ràng giữa các task
- **Sprint Timeline** 5 sprints
- **Parallel execution** markers

---

## 🎯 EPIC-01: AI SAFETY FOUNDATION
**Mục tiêu**: Xây dựng lớp an toàn AI cốt lõi - yếu tố quan trọng nhất
**Priority**: 🔴 CRITICAL

### TSK-AI-001: AI Safety Rules Configuration
- **Mục tiêu**: Tạo file cấu hình AI Safety Rules với tất cả rules cấm và bắt buộc
- **File cần tạo**: 
  - `backend/src/config/aiSafetyRules.js`
- **File cần sửa**: Không
- **Điều kiện hoàn thành**:
  - File chứa đầy đủ PROHIBITED, MANDATORY, WARNING_KEYWORDS
  - Có comment rõ ràng cho từng rule
  - Export đúng format
- **Phụ thuộc**: Không
- **Ưu tiên**: Critical

### TSK-AI-002: Safety Prompt Template
- **Mục tiêu**: Tạo template prompt an toàn cho Gemini với đầy đủ safety guidelines
- **File cần tạo**:
  - `backend/src/config/safetyPromptTemplate.js`
- **File cần sửa**: Không
- **Điều kiện hoàn thành**:
  - Template có đầy đủ các section: CẤM TUYỆT ĐỐI, LUÔN LUÔN LÀM, PHÁT HIỆN NGUY HIỂM
  - Có parameter cho emotion và isFirstMessage
  - Ngôn ngữ tiếng Việt, phù hợp học sinh 6-15 tuổi
- **Phụ thuộc**: TSK-AI-001
- **Ưu tiên**: Critical

### TSK-AI-003: Conversation Policy
- **Mục tiêu**: Định nghĩa policy cho từng giai đoạn cuộc trò chuyện
- **File cần tạo**:
  - `backend/src/config/conversationPolicy.js`
- **File cần sửa**: Không
- **Điều kiện hoàn thành**:
  - 4 giai đoạn: GREETING, LISTENING, SUPPORTING, CLOSING
  - Mỗi giai đoạn có maxMessages, actions, avoid
  - ESCALATION protocol cho trường hợp nguy hiểm
- **Phụ thuộc**: TSK-AI-001
- **Ưu tiên**: Critical

### TSK-AI-004: Safety Middleware
- **Mục tiêu**: Tạo middleware kiểm tra nội dung trước/sau khi gọi Gemini
- **File cần tạo**:
  - `backend/src/middleware/safety.js`
- **File cần sửa**:
  - `backend/server.js` (integrate middleware)
- **Điều kiện hoàn thành**:
  - Middleware kiểm tra user input có chứa từ khóa nguy hiểm không
  - Kiểm tra AI response có vi phạm safety rules không
  - Trả về safe fallback message nếu phát hiện vi phạm
  - Log các cảnh báo để mentor review
- **Phụ thuộc**: TSK-AI-001, TSK-AI-002
- **Ưu tiên**: Critical

### TSK-AI-005: Gemini Service Integration
- **Mục tiêu**: Tạo service tích hợp Gemini API với safety checks
- **File cần tạo**:
  - `backend/src/services/geminiService.js`
- **File cần sửa**:
  - `backend/package.json` (thêm @google/generative-ai)
  - `backend/server.js` (thay thế Groq bằng Gemini)
- **Điều kiện hoàn thành**:
  - Service class với method generateResponse()
  - Tích hợp system prompt với safety rules
  - Safety check sau khi nhận response
  - Fallback mechanism khi Gemini fails
  - Temperature = 0.7, maxOutputTokens = 300
- **Phụ thuộc**: TSK-AI-002, TSK-AI-004
- **Ưu tiên**: Critical

### TSK-AI-006: Content Filtering - Keyword Detection
- **Mục tiêu**: Xây dựng hệ thống phát hiện từ khóa nguy hiểm
- **File cần tạo**:
  - `backend/src/utils/safetyChecks.js`
- **File cần sửa**:
  - `backend/src/services/geminiService.js` (integrate checks)
- **Điều kiện hoàn thành**:
  - Regex patterns cho bullying, self-harm, abuse keywords
  - Function checkUserInput(text) → { safe, reason }
  - Function checkAIResponse(text) → { safe, reason }
  - Unit tests cho các patterns
- **Phụ thuộc**: TSK-AI-001
- **Ưu tiên**: Critical

### TSK-AI-007: Fallback Response System
- **Mục tiêu**: Cải thiện hệ thống fallback khi AI không khả dụng
- **File cần tạo**:
  - `backend/src/utils/fallbackResponses.js`
- **File cần sửa**:
  - `backend/data/fallback.js` (refactor)
- **Điều kiện hoàn thành**:
  - Fallback responses theo từng emotion
  - Luôn bao gồm message khuyến khích tìm người lớn
  - Không đưa ra lời khuyên nguy hiểm
  - Phân biệt giữa API error và safety violation
- **Phụ thuộc**: TSK-AI-001
- **Ưu tiên**: High

---

## 🎯 EPIC-02: NO-LOGIN USER FLOW
**Mục tiêu**: Cho phép sử dụng không cần đăng nhập - tôn trọng quyền riêng tư
**Priority**: 🔴 CRITICAL

### TSK-UI-001: Landing Page (No Login)
- **Mục tiêu**: Tạo màn hình chào mừng với nút "Bắt đầu ngay"
- **File cần tạo**:
  - `frontend/src/components/pages/LandingPage.jsx`
  - `frontend/src/styles/LandingPage.css`
- **File cần sửa**:
  - `frontend/src/App.js` (add route)
- **Điều kiện hoàn thành**:
  - Hiển thị "Xin chào 👋" và "Chào mừng đến với Larry"
  - Button "Bắt đầu ngay" màu pastel, lớn, bo tròn
  - Link "Đăng nhập" cho user đã có tài khoản
  - Responsive cho desktop + tablet
  - Animation nhẹ khi hover
- **Phụ thuộc**: Không
- **Ưu tiên**: Critical

### TSK-UI-002: Emotion Selection Screen
- **Mục tiêu**: Tạo màn hình chọn cảm xúc với 8 buttons lớn + text input
- **File cần tạo**:
  - `frontend/src/components/pages/EmotionSelectionPage.jsx`
  - `frontend/src/components/emotion/EmotionButton.jsx`
  - `frontend/src/components/emotion/EmotionTextInput.jsx`
  - `frontend/src/styles/EmotionSelection.css`
- **File cần sửa**:
  - `frontend/src/constants/emotions.js` (expand to 8 emotions)
  - `frontend/src/App.js` (add route)
- **Điều kiện hoàn thành**:
  - 8 emotion buttons: 😊😢😡😰😨😐❤️ (có thể thêm 😲)
  - Mỗi button: lớn, pastel color, hover effect
  - Textarea "Tôi muốn chia sẻ bằng lời"
  - Emotion classifier cho text input
  - Button "Tiếp tục"
  - Privacy notice: "Chế độ ẩn danh"
- **Phụ thuộc**: TSK-UI-001
- **Ưu tiên**: Critical

### TSK-UI-003: Camera Option Screen
- **Mục tiêu**: Tạo màn hình tùy chọn dùng camera hoặc text
- **File cần tạo**:
  - `frontend/src/components/pages/CameraOptionPage.jsx`
  - `frontend/src/styles/CameraOption.css`
- **File cần sửa**:
  - `frontend/src/App.js` (add route)
- **Điều kiện hoàn thành**:
  - 2 cards: "📷 Dùng Camera" và "⌨️ Nhập cảm xúc"
  - Privacy info: "Camera chỉ dùng để nhận diện cảm xúc"
  - Button "Bỏ qua, vào chat ngay"
  - Responsive, pastel design
- **Phụ thuộc**: TSK-UI-002
- **Ưu tiên**: Critical

### TSK-UI-004: Anonymous Session Management
- **Mục tiêu**: Tạo hệ thống quản lý session ẩn danh
- **File cần tạo**:
  - `frontend/src/utils/anonymousSession.js`
  - `frontend/src/contexts/SessionContext.js`
- **File cần sửa**:
  - `frontend/src/App.js` (wrap with SessionContext)
- **Điều kiện hoàn thành**:
  - createAnonymousSession() → tạo sessionId
  - getAnonymousSession() → lấy data từ sessionStorage
  - clearAnonymousSession() → xóa khi logout
  - Session data: sessionId, messages, emotions, activities
  - Tự động xóa khi đóng tab
- **Phụ thuộc**: TSK-UI-003
- **Ưu tiên**: Critical

### TSK-UI-005: Protected Route Refactor
- **Mục tiêu**: Sửa ProtectedRoute để cho phép anonymous access
- **File cần tạo**: Không
- **File cần sửa**:
  - `frontend/src/components/ui/ProtectedRoute.jsx`
  - `frontend/src/context/AuthContext.js`
- **Điều kiện hoàn thành**:
  - ProtectedRoute cho phép truy cập không cần login
  - Chỉ bắt buộc login khi user muốn lưu lịch sử
  - Hiển thị option "Tiếp tục ẩn danh"
  - Redirect về / sau khi login thành công
- **Phụ thuộc**: TSK-UI-004
- **Ưu tiên**: Critical

### TSK-UI-006: Emotion Text Classifier
- **Mục tiêu**: Tạo component phân loại cảm xúc từ văn bản
- **File cần tạo**:
  - `frontend/src/services/emotion/textClassifier.js`
  - `frontend/src/components/emotion/EmotionClassifier.jsx`
- **File cần sửa**: Không
- **Điều kiện hoàn thành**:
  - Simple keyword-based classification (hoặc có thể dùng API)
  - Hỗ trợ tiếng Việt
  - Trả về emotion: happy, sad, angry, neutral, etc.
  - Confidence score
  - Fallback to neutral nếu không detect được
- **Phụ thuộc**: TSK-UI-002
- **Ưu tiên**: High

### TSK-UI-007: Privacy Banner Component
- **Mục tiêu**: Tạo component hiển thị thông tin quyền riêng tư
- **File cần tạo**:
  - `frontend/src/components/ui/PrivacyBanner.jsx`
  - `frontend/src/styles/PrivacyBanner.css`
- **File cần sửa**: Không
- **Điều kiện hoàn thành**:
  - Hiển thị icon 🔒 và message ngắn gọn
  - Có link đến Privacy Policy đầy đủ
  - Có thể đóng banner
  - Lưu trạng thái "đã đóng" vào localStorage
- **Phụ thuộc**: Không
- **Ưu tiên**: High

---

## 🎯 EPIC-03: CAMERA AS OPTION
**Mục tiêu**: Camera không tự mở, là tùy chọn của user
**Priority**: 🔴 CRITICAL

### TSK-CAM-001: Camera Permission Flow
- **Mục tiêu**: Tạo flow xin quyền camera một cách rõ ràng
- **File cần tạo**:
  - `frontend/src/components/camera/CameraPermission.jsx`
- **File cần sửa**:
  - `frontend/src/components/ui/Camera.jsx` (refactor)
- **Điều kiện hoàn thành**:
  - Hiển thị explanation trước khi xin quyền
  - Xử lý user deny gracefully
  - Hiển thị alternative: "Nhập cảm xúc bằng văn bản"
  - Không tự động request permission
- **Phụ thuộc**: TSK-UI-003
- **Ưu tiên**: Critical

### TSK-CAM-002: Camera Component Refactor
- **Mục tiêu**: Refactor Camera component để không tự động chạy
- **File cần tạo**: Không
- **File cần sửa**:
  - `frontend/src/components/ui/Camera.jsx`
- **Điều kiện hoàn thành**:
  - Chỉ start detection khi user cho phép
  - Props onStart, onStop để control
  - Hiển thị rõ: "Camera chỉ dùng để nhận diện cảm xúc"
  - Không lưu hình ảnh/video
  - Stop detection khi user rời khỏi trang
- **Phụ thuộc**: TSK-CAM-001
- **Ưu tiên**: Critical

### TSK-CAM-003: Emotion Detection Service
- **Mục tiêu**: Tạo service quản lý Face API.js detection
- **File cần tạo**:
  - `frontend/src/services/emotion/faceApi.js`
- **File cần sửa**:
  - `frontend/src/components/ui/Camera.jsx` (use service)
- **Điều kiện hoàn thành**:
  - Load models từ /models
  - Detect emotion mỗi 1-2 giây
  - Return dominant emotion
  - Handle errors gracefully
  - Cleanup on unmount
- **Phụ thuộc**: Không
- **Ưu tiên**: High

### TSK-CAM-004: Camera UI Redesign
- **Mục tiêu**: Redesign camera UI với pastel colors, cute style
- **File cần tạo**: Không
- **File cần sửa**:
  - `frontend/src/styles/Camera.css` (tạo mới nếu chưa có)
  - `frontend/src/components/ui/Camera.jsx` (styling)
- **Điều kiện hoàn thành**:
  - Pastel border, rounded corners
  - Cute loading animation
  - Emotion badge với màu phù hợp
  - Status text thân thiện
  - Responsive cho tablet
- **Phụ thuộc**: TSK-CAM-002
- **Ưu tiên**: Medium

---

## 🎯 EPIC-04: CHAT SYSTEM REDESIGN
**Mục tiêu**: Cải thiện luồng chat, Larry chào trước rồi mới hỏi
**Priority**: 🔴 HIGH

### TSK-CHAT-001: Chat Flow Restructure
- **Mục tiêu**: Thay đổi luồng chat: Larry chào → Hỏi → User trả lời → Gemini trả lời
- **File cần tạo**: Không
- **File cần sửa**:
  - `frontend/src/components/ui/ChatBox.jsx`
  - `backend/src/services/geminiService.js`
- **Điều kiện hoàn thành**:
  - Step 1: Larry gửi greeting message (dựa trên emotion)
  - Step 2: Larry hỏi "Bạn có muốn kể cho mình nghe không?"
  - Step 3: User trả lời
  - Step 4: Gemini mới được gọi để trả lời
  - Không gọi Gemini ngay khi mở app
- **Phụ thuộc**: TSK-AI-005
- **Ưu tiên**: Critical

### TSK-CHAT-002: Chat Header Redesign
- **Mục tiêu**: Redesign ChatHeader với safety indicator và privacy info
- **File cần tạo**: Không
- **File cần sửa**:
  - `frontend/src/components/ui/ChatHeader.jsx`
  - `frontend/src/styles/Header.css`
- **Điều kiện hoàn thành**:
  - Hiển thị "Larry đang ở đây 💬"
  - Safety indicator icon (🛡️)
  - Privacy badge nếu anonymous mode
  - Button mở Privacy Policy
  - User menu (nếu đăng nhập)
- **Phụ thuộc**: TSK-UI-007
- **Ưu tiên**: High

### TSK-CHAT-003: Message Bubble Redesign
- **Mục tiêu**: Redesign message bubbles với pastel colors
- **File cần tạo**: Không
- **File cần sửa**:
  - `frontend/src/components/ui/Message.jsx`
  - `frontend/src/styles/Message.css` (tạo mới)
- **Điều kiện hoàn thành**:
  - AI messages: pastel blue/pink background
  - User messages: pastel green/yellow
  - Rounded corners (large border-radius)
  - Soft shadows
  - Timestamp nhẹ
  - Emotion indicator nếu có
- **Phụ thuộc**: Không
- **Ưu tiên**: Medium

### TSK-CHAT-004: Typing Indicator Animation
- **Mục tiêu**: Tạo animation typing indicator đáng yêu
- **File cần tạo**: Không
- **File cần sửa**:
  - `frontend/src/components/ui/TypingIndicator.jsx`
  - `frontend/src/styles/TypingIndicator.css`
- **Điều kiện hoàn thành**:
  - Animation: 3 dots bouncing
  - Màu pastel
  - Text "Larry đang suy nghĩ..."
  - Smooth animation
- **Phụ thuộc**: Không
- **Ưu tiên**: Low

### TSK-CHAT-005: Chat Input Enhancement
- **Mục tiêu**: Thêm emotion quick-select vào chat input
- **File cần tạo**: Không
- **File cần sửa**:
  - `frontend/src/components/ui/ChatInput.jsx`
  - `frontend/src/styles/ChatInput.css`
- **Điều kiện hoàn thành**:
  - Textarea chính
  - Button gửi
  - Quick emotion buttons (😊😢😡) bên cạnh
  - Click emotion → thêm emoji vào message
  - Disabled khi loading
- **Phụ thuộc**: Không
- **Ưu tiên**: Medium

### TSK-CHAT-006: Backend Chat API Refactor
- **Mục tiêu**: Refactor chat endpoint để support new flow
- **File cần tạo**:
  - `backend/src/controllers/chatController.js`
  - `backend/src/routes/chat.js`
- **File cần sửa**:
  - `backend/server.js` (replace inline chat route)
- **Điều kiện hoàn thành**:
  - POST /api/chat/session - tạo session mới
  - POST /api/chat/message - gửi message
  - GET /api/chat/history - lấy lịch sử (nếu authenticated)
  - Support anonymous sessions
  - Safety checks trên mọi input/output
- **Phụ thuộc**: TSK-AI-004, TSK-AI-005
- **Ưu tiên**: Critical

### TSK-CHAT-007: Session Management Backend
- **Mục tiêu**: Tạo hệ thống quản lý session ở backend
- **File cần tạo**:
  - `backend/src/models/Session.js`
  - `backend/src/controllers/sessionController.js`
  - `backend/src/routes/session.js`
- **File cần sửa**:
  - `backend/server.js` (add session routes)
- **Điều kiện hoàn thành**:
  - Model Session: sessionId, messages, emotions, createdAt
  - POST /api/session/create - tạo session
  - GET /api/session/:id - lấy session
  - DELETE /api/session/:id - xóa session
  - Auto cleanup sau 24h (cho anonymous)
- **Phụ thuộc**: TSK-CHAT-006
- **Ưu tiên**: High

---

## 🎯 EPIC-05: UI/UX REDESIGN
**Mục tiêu**: Redesign toàn bộ UI với pastel colors, cute style
**Priority**: 🟡 HIGH

### TSK-UI-008: Design System Setup
- **Mục tiêu**: Tạo design system với CSS variables
- **File cần tạo**:
  - `frontend/src/styles/design-system.css`
- **File cần sửa**:
  - `frontend/src/index.css` (import design-system)
- **Điều kiện hoàn thành**:
  - CSS variables: colors, typography, spacing, radius, shadows
  - Pastel color palette
  - Font family: Nunito
  - Responsive breakpoints
  - Utility classes
- **Phụ thuộc**: Không
- **Ưu tiên**: High

### TSK-UI-009: Global Styles & Components
- **Mục tiêu**: Tạo global styles và base components
- **File cần tạo**:
  - `frontend/src/styles/global.css`
  - `frontend/src/components/ui/Button.jsx`
  - `frontend/src/components/ui/Card.jsx`
- **File cần sửa**:
  - `frontend/src/index.css` (import global)
- **Điều kiện hoàn thành**:
  - Reset CSS
  - Base styles cho body, headings
  - Button component: primary, secondary, variants
  - Card component: pastel background, rounded corners
  - Consistent spacing
- **Phụ thuộc**: TSK-UI-008
- **Ưu tiên**: High

### TSK-UI-010: Login Page Redesign
- **Mục tiêu**: Redesign Login page với pastel theme
- **File cần tạo**: Không
- **File cần sửa**:
  - `frontend/src/components/ui/Login.jsx`
  - `frontend/src/styles/AuthForms.css`
- **Điều kiện hoàn thành**:
  - Pastel background
  - Cute avatar 🤖
  - Rounded input fields
  - Gradient button
  - "Quên mật khẩu?" link
  - Responsive
- **Phụ thuộc**: TSK-UI-008
- **Ưu tiên**: Medium

### TSK-UI-011: Register Page Redesign
- **Mục tiêu**: Redesign Register page
- **File cần tạo**: Không
- **File cần sửa**:
  - `frontend/src/components/ui/Register.jsx`
  - `frontend/src/styles/AuthForms.css`
- **Điều kiện hoàn thành**:
  - Consistent với Login page
  - Thêm field username
  - Password strength indicator (optional)
  - Terms of service checkbox
- **Phụ thuộc**: TSK-UI-010
- **Ưu tiên**: Medium

### TSK-UI-012: Playful Background Component
- **Mục tiêu**: Tạo background animation component
- **File cần tạo**: Không
- **File cần sửa**:
  - `frontend/src/components/ui/PlayfulBackground.jsx`
  - `frontend/src/styles/PlayfulBackground.css`
- **Điều kiện hoàn thành**:
  - Floating shapes (circles, stars)
  - Pastel colors
  - Smooth animation
  - Performance optimized (requestAnimationFrame)
  - Responsive
- **Phụ thuộc**: TSK-UI-008
- **Ưu tiên**: Low

### TSK-UI-013: Responsive Layout System
- **Mục tiêu**: Đảm bảo tất cả pages responsive trên desktop + tablet
- **File cần tạo**: Không
- **File cần sửa**:
  - Tất cả CSS files
  - `frontend/src/App.js` (layout)
- **Điều kiện hoàn thành**:
  - Desktop: 2-column layout (camera + chat)
  - Tablet: Single column, stack vertically
  - Breakpoints: 768px, 1024px
  - Touch-friendly buttons (min 44x44px)
  - Test trên iPad, Android tablet
- **Phụ thuộc**: TSK-UI-008
- **Ưu tiên**: High

---

## 🎯 EPIC-06: PRIVACY & DATA PROTECTION
**Mục tiêu**: Triển khai privacy policy và data protection
**Priority**: 🟡 HIGH

### TSK-PRIVACY-001: Privacy Policy Page
- **Mục tiêu**: Tạo page hiển thị privacy policy
- **File cần tạo**:
  - `frontend/src/components/pages/PrivacyPolicy.jsx`
  - `frontend/src/styles/PrivacyPolicy.css`
- **File cần sửa**:
  - `frontend/src/App.js` (add route)
- **Điều kiện hoàn thành**:
  - Full privacy policy content
  - Easy to read, không phải legal jargon
  - Sections: What we collect, How we use, Your rights
  - Link từ footer và banner
- **Phụ thuộc**: Không
- **Ưu tiên**: High

### TSK-PRIVACY-002: Data Encryption
- **Mục tiêu**: Implement encryption cho sensitive data
- **File cần tạo**:
  - `backend/src/utils/encryption.js`
- **File cần sửa**:
  - `backend/src/models/User.js` (encrypt email)
  - `backend/src/controllers/chatController.js` (encrypt messages)
- **Điều kiện hoàn thành**:
  - Sử dụng crypto module
  - Encrypt messages trước khi lưu
  - Decrypt khi user request
  - Key management từ environment variable
- **Phụ thuộc**: TSK-CHAT-007
- **Ưu tiên**: High

### TSK-PRIVACY-003: Data Deletion Feature
- **Mục tiêu**: Cho phép user xóa dữ liệu của họ
- **File cần tạo**: Không
- **File cần sửa**:
  - `backend/src/controllers/chatController.js` (add delete endpoint)
  - `frontend/src/components/ui/UserMenu.jsx` (add delete button)
- **Điều kiện hoàn thành**:
  - DELETE /api/chat/history - xóa toàn bộ lịch sử
  - DELETE /api/session/:id - xóa session
  - Frontend: button "Xóa lịch sử" trong UserMenu
  - Confirmation dialog trước khi xóa
- **Phụ thuộc**: TSK-CHAT-007
- **Ưu tiên**: Medium

### TSK-PRIVACY-004: Anonymous Mode Indicator
- **Mục tiêu**: Hiển thị rõ khi user đang ở chế độ ẩn danh
- **File cần tạo**:
  - `frontend/src/components/ui/AnonymousBadge.jsx`
- **File cần sửa**:
  - `frontend/src/components/ui/ChatHeader.jsx` (add badge)
- **Điều kiện hoàn thành**:
  - Badge hiển thị "Ẩn danh" với icon 🔒
  - Tooltip giải thích: "Dữ liệu không được lưu"
  - Click → mở Privacy Policy
- **Phụ thuộc**: TSK-UI-004
- **Ưu tiên**: Medium
