# Larry - Kế Hoạch Cải Tiến Toàn Diện

## 📋 Tổng Quan Dự Án

### Công Nghệ Hiện Tại
- **Frontend**: ReactJS (Create React App)
- **Backend**: Node.js + ExpressJS
- **AI Chat**: Groq API (cần chuyển sang Gemini theo yêu cầu)
- **Nhận diện cảm xúc**: Face API.js
- **Camera**: react-webcam
- **Authentication**: JWT + bcrypt

### Vấn Đề Hiện Tại
1. Camera tự động mở ngay - không tôn trọng quyền riêng tư
2. Không có tùy chọn nhập cảm xúc bằng văn bản
3. Thiếu lớp AI Safety
4. Bắt buộc đăng nhập để sử dụng
5. Chưa có chính sách bảo vệ dữ liệu rõ ràng
6. Backend đang dùng Groq thay vì Gemini
7. Chưa có module thử nghiệm thực tế

---

## 1. 🛡️ AI SAFETY - ĐẶT AN TOÀN LÊN HÀNG ĐẦU

### 1.1 AI Safety Rules

```javascript
// backend/src/config/aiSafetyRules.js

export const AI_SAFETY_RULES = {
  // Cấm tuyệt đối
  PROHIBITED: {
    medical_advice: "Không đưa ra chẩn đoán, điều trị y tế/tâm lý",
    dangerous_advice: "Không khuyến khích hành vi nguy hiểm",
    violence: "Không cổ vũ bạo lực dưới mọi hình thức",
    bullying: "Không khuyến khích bắt nạt, trêu chọc",
    self_harm: "Không đề cập đến tự làm hại bản thân",
    inappropriate_content: "Không có nội dung không phù hợp với học sinh",
    impersonation: "Không đóng vai bác sĩ, chuyên gia tâm lý, giáo viên",
  },

  // Luôn tuân thủ
  MANDATORY: {
    gentle_tone: "Giọng điệu luôn nhẹ nhàng, ấm áp, thân thiện",
    positive_framing: "Khuyến khích tư duy tích cực",
    encourage_help: "Khuyến khích chia sẻ với cha mẹ/giáo viên/chuyên gia",
    respect_emotions: "Tôn trọng và xác nhận cảm xúc của học sinh",
    age_appropriate: "Ngôn ngữ phù hợp với lứa tuổi tiểu học và THCS",
  },

  // Từ khóa cảnh báo cần can thiệp
  WARNING_KEYWORDS: {
    bullying: ["bắt nạt", "trêu chọc", "đánh nhau", "không ai thích tôi"],
    self_harm: ["muốn chết", "tự làm đau", "không muốn sống"],
    abuse: ["bị đánh", "bị xâm hại", "bị ép"],
    extreme_negative: ["ghét bản thân", "vô dụng", "không ai cần"]
  }
};
```

### 1.2 Safety Prompt Template

```javascript
// backend/src/config/safetyPromptTemplate.js

export const SAFETY_PROMPT_TEMPLATE = (emotion) => `
Bạn là Larry - người bạn đồng hành AI an toàn cho học sinh tiểu học và THCS.

## 🛡️ NGUYÊN TẮC AN TOÀN (BẮT BUỘC TUÂN THỦ)

### 1. CẤM TUYỆT ĐỐI
- ❌ KHÔNG đưa ra lời khuyên y tế, tâm lý, điều trị
- ❌ KHÔNG đóng vai bác sĩ, chuyên gia tâm lý, giáo viên
- ❌ KHÔNG khuyến khích bạo lực, bắt nạt, trả thù
- ❌ KHÔNG nói "bạn nên tự làm đau bản thân" hoặc tương tự
- ❌ KHÔNG xem nhẹ cảm xúc tiêu cực của học sinh

### 2. LUÔN LUÔN LÀM
- ✅ Nói chuyện nhẹ nhàng, ấm áp, thân thiện
- ✅ Lắng nghe và xác nhận cảm xúc: "Mình hiểu bạn đang buồn"
- ✅ Khuyến khích chia sẻ với người lớn đáng tin:
  * "Bạn có thể nói chuyện với ba mẹ về điều này"
  * "Thầy/cô giáo luôn sẵn sàng lắng nghe bạn"
  * "Nếu cảm thấy không khỏe, hãy nói với người lớn"
- ✅ Đưa ra gợi ý tích cực, phù hợp lứa tuổi
- ✅ Tôn trọng quyền riêng tư và ranh giới cá nhân

### 3. PHÁT HIỆN NGUY HIỂM
Nếu phát hiện dấu hiệu:
- Bắt nạt học đường → Lắng nghe, an ủi, khuyến khích nói với thầy/cô/ba mẹ
- Tự làm hại bản thân → Thể hiện quan tâm, khuyến khích tìm người lớn ngay
- Bạo lực gia đình → Lắng nghe, an ủi, hướng dẫn tìm giúp đỡ từ người đáng tin

**QUAN TRỌNG**: Không cố gắng tự xử lý các vấn đề nghiêm trọng. Luôn chuyển hướng đến chuyên gia/người lớn.

### 4. CẢM XÚC HIỆN TẠI
Camera vừa nhận diện: ${emotion}
- Đây chỉ là tham khảo, ưu tiên lời học sinh nói
- Nếu học sinh nói cảm xúc khác → Tin học sinh

## 📝 PHONG CÁCH GIAO TIẾP
- Ngôn ngữ đơn giản, dễ hiểu với học sinh 6-15 tuổi
- Mỗi lần trả lời 2-4 câu, không dài dòng
- Dùng emoji vui vẻ nhưng không quá nhiều
- Đặt câu hỏi mở để khuyến khích chia sẻ
- Không phán xét, không chỉ trích

## 🎯 MỤC TIÊU
Tạo môi trường an toàn để học sinh:
- Chia sẻ cảm xúc mà không sợ bị đánh giá
- Học cách nhận diện và quản lý cảm xúc
- Biết khi nào cần tìm giúp đỡ từ người lớn
`;
```

### 1.3 Conversation Policy

```javascript
// backend/src/config/conversationPolicy.js

export const CONVERSATION_POLICY = {
  // Giai đoạn 1: Chào hỏi
  GREETING: {
    maxMessages: 2,
    actions: ["greet", "acknowledge_emotion", "ask_open_question"],
    avoid: ["giving_advice", "suggesting_games"]
  },

  // Giai đoạn 2: Lắng nghe
  LISTENING: {
    maxMessages: 4,
    actions: ["validate_emotions", "ask_follow_up", "show_empathy"],
    avoid: ["solving_problems", "giving_direct_advice"]
  },

  // Giai đoạn 3: Hỗ trợ
  SUPPORTING: {
    maxMessages: 3,
    actions: ["gentle_suggestions", "encourage_help_seeking", "positive_reframing"],
    avoid: ["medical_advice", "diagnosis"]
  },

  // Giai đoạn 4: Kết thúc/Khuyến nghị hoạt động
  CLOSING: {
    maxMessages: 2,
    actions: ["suggest_activities", "encourage_future_chat", "remind_safety"],
    canSuggestGames: true
  },

  // Chuyển sang chuyên gia khi cần
  ESCALATION: {
    triggers: ["self_harm_risk", "abuse_disclosure", "severe_distress"],
    response: "encourage_professional_help",
    never: ["attempt_to_handle_alone"]
  }
};
```

---

## 2. 🔓 LUỒNG NGƯỜI DÙNG MỚI (NO LOGIN REQUIRED)

### 2.1 User Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│  LANDING PAGE (Không cần đăng nhập)                     │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Xin chào 👋                                    │   │
│  │  Chào mừng đến với Larry                        │   │
│  │                                                 │   │
│  │  [Bắt đầu ngay]  ← MÀU PASTEL, LỚN, BO TRÒN    │   │
│  │                                                 │   │
│  │  Đã có tài khoản? [Đăng nhập]                   │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                    ↓ Click "Bắt đầu ngay"
┌─────────────────────────────────────────────────────────┐
│  EMOTION SELECTION SCREEN                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Hôm nay bạn thấy thế nào?                      │   │
│  │                                                 │   │
│  │  😊 Vui      😢 Buồn      😡 Tức giận          │   │
│  │  😰 Căng thẳng  😨 Lo lắng  😐 Bình thường     │   │
│  │  ❤️ Hạnh phúc                                   │   │
│  │                                                 │   │
│  │  Các nút cảm xúc: LỚN, PASTEL, BO TRÒN         │   │
│  │  Hover: Hiệu ứng nhẹ, scale up                  │   │
│  │                                                 │   │
│  │  ─────────────────────────────────────────     │   │
│  │                                                 │   │
│  │  💬 Tôi muốn chia sẻ bằng lời                   │   │
│  │  [Textarea để nhập cảm xúc]                     │   │
│  │                                                 │   │
│  │  [Tiếp tục]                                     │   │
│  │                                                 │   │
│  │  🔒 Chế độ ẩn danh - Không lưu dữ liệu cá nhân │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                    ↓ Chọn cảm xúc hoặc nhập văn bản
┌─────────────────────────────────────────────────────────┐
│  CAMERA OPTION SCREEN                                   │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Bạn muốn Larry quan sát cảm xúc qua camera?    │   │
│  │                                                 │   │
│  │  ┌──────────────┐    ┌──────────────┐          │   │
│  │  │              │    │              │          │   │
│  │  │   📷         │    │   ⌨️         │          │   │
│  │  │  Dùng Camera │    │ Nhập cảm xúc │          │   │
│  │  │              │    │              │          │   │
│  │  └──────────────┘    └──────────────┘          │   │
│  │                                                 │   │
│  │  💡 Camera chỉ dùng để nhận diện cảm xúc       │   │
│  │     Không lưu hình ảnh, không lưu video         │   │
│  │                                                 │   │
│  │  [Bỏ qua, vào chat ngay]                        │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
         ↓                        ↓
    [Dùng Camera]          [Nhập cảm xúc] / [Bỏ qua]
         ↓                        ↓
    Camera mở &            Emotion từ text →
    nhận diện              Emotion Classification
         ↓                        ↓
         └────────────┬───────────┘
                      ↓
┌─────────────────────────────────────────────────────────┐
│  CHAT SCREEN                                            │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Larry đang ở đây 💬                            │   │
│  │                                                 │   │
│  │  Larry: "Mình thấy hôm nay bạn có vẻ [emotion] │   │
│  │          Mình luôn sẵn sàng lắng nghe bạn 😊"   │   │
│  │                                                 │   │
│  │  ─────────────────────────────────────────     │   │
│  │                                                 │   │
│  │  💭 Bạn có muốn kể cho mình nghe không?        │   │
│  │                                                 │   │
│  │  [Nhập tin nhắn...]              [Gửi]         │   │
│  │                                                 │   │
│  │  🎮 [Chơi Scratch]  📊 [Cảm xúc của bạn]       │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                      ↓
              (Sau khi chat)
┌─────────────────────────────────────────────────────────┐
│  OPTIONAL: ĐĂNG NHẬP/ĐĂNG KÝ                           │
│  ┌─────────────────────────────────────────────────┐   │
│  │  💾 Lưu lịch sử trò chuyện?                     │   │
│  │                                                 │   │
│  │  [Đăng nhập]  [Đăng ký]  [Không, cảm ơn]       │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Luồng Anonymous Mode

```javascript
// frontend/src/utils/anonymousSession.js

export const createAnonymousSession = () => {
  const sessionId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const sessionData = {
    sessionId,
    createdAt: new Date().toISOString(),
    messages: [],
    emotions: [],
    activities: []
  };
  
  // Lưu vào sessionStorage (xóa khi đóng tab)
  sessionStorage.setItem('larry_session', JSON.stringify(sessionData));
  
  return sessionId;
};

export const getAnonymousSession = () => {
  const data = sessionStorage.getItem('larry_session');
  return data ? JSON.parse(data) : null;
};

export const clearAnonymousSession = () => {
  sessionStorage.removeItem('larry_session');
};
```

---

## 3. 🎨 THIẾT KẾ UI/UX MỚI

### 3.1 Design System

```css
/* frontend/src/styles/design-system.css */

:root {
  /* Pastel Color Palette */
  --color-primary: #FFB6C1;        /* Light Pink */
  --color-primary-dark: #FF69B4;   /* Hot Pink */
  --color-secondary: #87CEEB;      /* Sky Blue */
  --color-secondary-dark: #00BFFF; /* Deep Sky Blue */
  --color-accent: #DDA0DD;         /* Plum */
  --color-success: #98FB98;        /* Pale Green */
  --color-warning: #FFE4B5;        /* Moccasin */
  --color-error: #FFB6C1;          /* Light Pink */
  
  /* Emotion Colors */
  --emotion-happy: #FFE66D;
  --emotion-sad: #74C0FC;
  --emotion-angry: #FF6B6B;
  --emotion-neutral: #C3C3C3;
  --emotion-surprised: #FFA94D;
  --emotion-fearful: #9775FA;
  --emotion-disgusted: #69DB7C;
  
  /* Typography */
  --font-family: 'Nunito', 'Segoe UI', sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 2rem;
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;
  
  /* Border Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --radius-xl: 30px;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.12);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.16);
  
  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
  --transition-slow: 350ms ease;
}
```

### 3.2 Component Structure (After Refactor)

```
frontend/src/
├── components/
│   ├── ui/                          # Reusable UI components
│   │   ├── Button/
│   │   │   ├── Button.jsx
│   │   │   ├── Button.css
│   │   │   └── index.js
│   │   ├── Input/
│   │   ├── Card/
│   │   ├── Modal/
│   │   └── ...
│   │
│   ├── layout/                      # Layout components
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   └── Footer.jsx
│   │
│   ├── emotion/                     # Emotion-related components
│   │   ├── EmotionSelector.jsx      # Screen chọn cảm xúc
│   │   ├── EmotionButton.jsx        # Nút cảm xúc lớn
│   │   ├── EmotionBadge.jsx
│   │   └── EmotionTextInput.jsx     # Nhập cảm xúc bằng văn bản
│   │
│   ├── camera/                      # Camera components
│   │   ├── Camera.jsx
│   │   ├── CameraPermission.jsx     # Xin quyền camera
│   │   └── CameraPreview.jsx
│   │
│   ├── chat/                        # Chat components
│   │   ├── ChatBox.jsx
│   │   ├── ChatHeader.jsx
│   │   ├── ChatInput.jsx
│   │   ├── Message.jsx
│   │   ├── TypingIndicator.jsx
│   │   └── MessageBubble.jsx
│   │
│   ├── auth/                        # Auth components
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── AuthForm.jsx
│   │   └── ProtectedRoute.jsx
│   │
│   ├── games/                       # Game components
│   │   ├── ScratchButton.jsx
│   │   ├── ScratchGamePage.jsx
│   │   └── ScratchPlayer.jsx
│   │
│   └── pages/                       # Page components
│       ├── LandingPage.jsx
│       ├── EmotionSelectionPage.jsx
│       ├── CameraOptionPage.jsx
│       ├── ChatPage.jsx
│       └── PrivacyInfo.jsx
│
├── contexts/
│   ├── AuthContext.js
│   ├── EmotionContext.js            # Quản lý trạng thái cảm xúc
│   ├── ChatContext.js               # Quản lý trạng thái chat
│   └── SessionContext.js            # Quản lý session ẩn danh
│
├── hooks/
│   ├── useEmotionDetection.js
│   ├── useCamera.js
│   ├── useChat.js
│   └── useAnonymousSession.js
│
├── services/
│   ├── api/
│   │   ├── auth.js
│   │   ├── chat.js
│   │   └── session.js
│   ├── emotion/
│   │   ├── faceApi.js
│   │   └── textClassifier.js
│   └── ai/
│       ├── gemini.js
│       └── safety.js
│
├── constants/
│   ├── emotions.js
│   ├── openingMessages.js
│   ├── safetyRules.js
│   └── routes.js
│
├── utils/
│   ├── anonymousSession.js
│   ├── emotionClassifier.js
│   └── helpers.js
│
└── styles/
    ├── design-system.css
    ├── global.css
    ├── LandingPage.css
    ├── EmotionSelection.css
    ├── Camera.css
    ├── Chat.css
    └── AuthForms.css
```

---

## 4. 🔄 KIẾN TRÚC BACKEND MỚI

### 4.1 Cấu Trúc Thư Mục

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   ├── gemini.js
│   │   └── aiSafetyRules.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Session.js
│   │   ├── Message.js
│   │   └── ExperimentData.js
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   ├── chat.js
│   │   ├── session.js
│   │   └── experiment.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── chatController.js
│   │   └── sessionController.js
│   │
│   ├── services/
│   │   ├── geminiService.js
│   │   ├── emotionService.js
│   │   ├── safetyService.js
│   │   └── experimentService.js
│   │
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── safety.js
│   │   └── rateLimit.js
│   │
│   ├── utils/
│   │   ├── prompts.js
│   │   ├── safetyChecks.js
│   │   └── helpers.js
│   │
│   └── app.js
│
├── data/
│   └── fallback.js
│
├── .env.example
├── package.json
└── server.js
```

### 4.2 API Design

#### Authentication Endpoints
```
POST   /api/auth/register          - Đăng ký (optional)
POST   /api/auth/login             - Đăng nhập (optional)
POST   /api/auth/logout            - Đăng xuất
GET    /api/auth/me                - Lấy thông tin user hiện tại
```

#### Chat Endpoints
```
POST   /api/chat/session           - Tạo session chat mới (anonymous)
POST   /api/chat/message           - Gửi tin nhắn
GET    /api/chat/history           - Lấy lịch sử chat (nếu đăng nhập)
DELETE /api/chat/history           - Xóa lịch sử chat
```

#### Emotion Endpoints
```
POST   /api/emotion/classify       - Phân loại cảm xúc từ văn bản
POST   /api/emotion/detect         - Nhận diện cảm xúc từ camera (server-side)
```

#### Experiment Endpoints (cho thử nghiệm tại trường)
```
POST   /api/experiment/session     - Tạo session thử nghiệm
POST   /api/experiment/log         - Ghi log hoạt động
GET    /api/experiment/stats       - Lấy thống kê (chỉ mentor)
```

### 4.3 Gemini Integration

```javascript
// backend/src/services/geminiService.js

const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash" // Hoặc gemini-1.5-pro
    });
  }

  async generateResponse(systemPrompt, userPrompt, conversationHistory) {
    try {
      const chat = this.model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: systemPrompt }]
          },
          {
            role: "model",
            parts: [{ text: "Tôi đã hiểu các nguyên tắc an toàn. Tôi sẽ luôn tuân thủ chúng." }]
          },
          ...conversationHistory.map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
          }))
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 300, // Giới hạn để trả lời ngắn gọn
        },
      });

      const result = await chat.sendMessage(userPrompt);
      const response = await result.response;
      const text = response.text();

      // Safety check sau khi nhận response
      const safetyCheck = this.performSafetyCheck(text);
      
      if (!safetyCheck.safe) {
        return this.getSafeFallback(safetyCheck.reason);
      }

      return text;
    } catch (error) {
      console.error('Gemini error:', error);
      throw error;
    }
  }

  performSafetyCheck(text) {
    // Kiểm tra xem response có vi phạm safety rules không
    const lowerText = text.toLowerCase();
    
    // Kiểm tra các từ khóa nguy hiểm
    const dangerousPatterns = [
      /bác sĩ/i, /chuyên gia tâm lý/i, /bác sĩ tâm lý/i,
      /chẩn đoán/i, /bệnh/i, /thuốc/i,
      /tự làm hại/i, /tự tử/i, /chết/i
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(text)) {
        return {
          safe: false,
          reason: `Phát hiện nội dung không an toàn: ${pattern}`
        };
      }
    }

    return { safe: true };
  }

  getSafeFallback(reason) {
    return "Mình xin lỗi, mình không thể trả lời câu hỏi này. "
         + "Nhưng mình luôn ở đây để lắng nghe bạn. "
         + "Nếu bạn cần giúp đỡ, hãy nói với ba mẹ hoặc thầy cô nhé! 💙";
  }
}

module.exports = new GeminiService();
```

---

## 5. 📱 DANH SÁCH MÀN HÌNH CẦN TẠO/SỬA

### 5.1 Màn Hình Mới

| #   | Tên Màn Hình            | Mô Tả                                        | Priority |
| --- | ----------------------- | -------------------------------------------- | -------- |
| 1   | **LandingPage**         | Màn hình chào mừng, không cần đăng nhập      | 🔴 High   |
| 2   | **EmotionSelection**    | Chọn cảm xúc bằng icon lớn hoặc nhập văn bản | 🔴 High   |
| 3   | **CameraOption**        | Tùy chọn dùng camera hoặc nhập văn bản       | 🔴 High   |
| 4   | **PrivacyInfo**         | Hiển thị chính sách bảo mật rõ ràng          | 🟡 Medium |
| 5   | **ChatPage** (refactor) | Màn hình chat chính                          | 🔴 High   |
| 6   | **Login** (refactor)    | Giữ nguyên nhưng cải thiện UX                | 🟡 Medium |
| 7   | **Register** (refactor) | Giữ nguyên nhưng cải thiện UX                | 🟡 Medium |

### 5.2 Components Cần Tạo

#### Core Components
```
✅ EmotionSelector - Màn hình chọn cảm xúc
✅ EmotionButton - Nút cảm xúc lớn, pastel
✅ EmotionTextInput - Textarea nhập cảm xúc
✅ CameraOption - Tùy chọn camera/text
✅ PrivacyBanner - Banner thông báo quyền riêng tư
✅ AnonymousBadge - Badge "Chế độ ẩn danh"
✅ SafetyIndicator - Icon/indicator cho AI Safety
✅ EmotionClassifier - Component phân loại cảm xúc từ text
```

#### Chat Components (Refactor)
```
✅ ChatHeader - Thêm indicator an toàn, privacy info
✅ MessageBubble - Redesign với pastel colors
✅ TypingIndicator - Animation mới, đáng yêu
✅ ChatInput - Thêm button emotion
✅ QuickReactions - Cảm xúc nhanh trong chat
```

#### Auth Components (Refactor)
```
✅ AuthLayout - Layout chung cho login/register
✅ SocialLogin - (Optional) Đăng nhập bằng Google
✅ GuestModePrompt - Prompt "Tiếp tục ẩn danh"
```

---

## 6. 🎯 PROMPT GEMINI MỚI

### 6.1 System Prompt (AI Safety Enabled)

```javascript
// backend/src/utils/prompts.js

export const GEMINI_SYSTEM_PROMPT = (emotion, isFirstMessage) => `
Bạn là Larry - trợ lý AI an toàn và thân thiện cho học sinh tiểu học và THCS (6-15 tuổi).

═══════════════════════════════════════════════════════════
🛡️ NGUYÊN TẮC AN TOÀN - BẮT BUỘC TUÂN THỦ
═══════════════════════════════════════════════════════════

【CẤM TUYỆT ĐỐI】
❌ Không đóng vai bác sĩ, chuyên gia tâm lý, giáo viên
❌ Không đưa ra chẩn đoán y tế/tâm lý
❌ Không kê đơn thuốc hoặc liệu pháp điều trị
❌ Không khuyến khích bạo lực, bắt nạt, trả thù
❌ Không đề cập đến tự làm hại bản thân dưới mọi hình thức
❌ Không xem nhẹ hoặc phủ nhận cảm xúc tiêu cực
❌ Không yêu cầu thông tin cá nhân (tên, địa chỉ, trường học)

【LUÔN LUÔN LÀM】
✅ Nói chuyện nhẹ nhàng, ấm áp, thân thiện như người bạn
✅ Lắng nghe và xác nhận cảm xúc: "Mình hiểu bạn đang buồn"
✅ Khuyến khích chia sẻ với người lớn đáng tin:
   - "Bạn có thể nói chuyện với ba mẹ về điều này"
   - "Thầy/cô giáo luôn sẵn sàng lắng nghe bạn"
   - "Nếu cảm thấy không khỏe, hãy nói với người lớn"
✅ Đưa ra gợi ý tích cực, phù hợp lứa tuổi
✅ Tôn trọng quyền riêng tư và ranh giới cá nhân

【PHÁT HIỆN NGUY HIỂM - XỬ LÝ NHẸ NHÀNG】
Nếu phát hiện dấu hiệu:
• Bắt nạt học đường → "Mình rất tiếc khi nghe điều này. Bạn nên nói với thầy/cô hoặc ba mẹ ngay."
• Tự làm hại → "Mình quan tâm về bạn. Hãy nói chuyện với người lớn ngay nhé, họ sẽ giúp bạn."
• Bạo lực gia đình → "Mình ở đây để lắng nghe. Bạn cần tìm giúp đỡ từ người đáng tin."

⚠️ QUAN TRỌNG: Không cố gắng tự xử lý. Luôn chuyển hướng đến chuyên gia/người lớn.

═══════════════════════════════════════════════════════════
📊 CẢM XÚC HIỆN TẠI
═══════════════════════════════════════════════════════════

Camera vừa nhận diện: ${emotion}

LƯU Ý:
• Đây chỉ là tham khảo ban đầu
• Ưu tiên lời học sinh nói hơn cảm xúc camera
• Nếu học sinh nói cảm xúc khác → Tin học sinh

═══════════════════════════════════════════════════════════
💬 PHONG CÁCH GIAO TIẾP
═══════════════════════════════════════════════════════════

• Ngôn ngữ đơn giản, dễ hiểu (học sinh 6-15 tuổi)
• Mỗi lần trả lời 2-4 câu, không dài dòng
• Dùng emoji vui vẻ nhưng không quá nhiều (1-2 emoji/lần)
• Đặt câu hỏi mở để khuyến khích chia sẻ
• Không phán xét, không chỉ trích
• Giọng điệu: ấm áp, thân thiện, như người bạn

═══════════════════════════════════════════════════════════
${isFirstMessage ? '🎯 ĐÂY LÀ TIN NHẮN ĐẦU TIÊN' : ''}
═══════════════════════════════════════════════════════════

${isFirstMessage ? `
BẮT BUỘC:
1. Chào hỏi ấm áp
2. Nhận xét nhẹ về cảm xúc: "Mình thấy hôm nay bạn có vẻ [cảm xúc]"
3. Hỏi một câu mở: "Bạn có muốn kể cho mình nghe không?"
` : `
Tiếp tục lắng nghe và hỗ trợ học sinh dựa trên nội dung họ vừa chia sẻ.
`}

═══════════════════════════════════════════════════════════
🎮 HOẠT ĐỘNG ĐỀ XUẤT (chỉ khi phù hợp)
═══════════════════════════════════════════════════════════

Chỉ gợi ý khi cuộc trò chuyện gần kết thúc hoặc học sinh cần thư giãn:
• Game Scratch (học sinh tự làm game)
• Bài tập hít thở đơn giản
• Hoạt động thư giãn phù hợp lứa tuổi

═══════════════════════════════════════════════════════════
`;
```

### 6.2 User Prompt Template

```javascript
export const GEMINI_USER_PROMPT_TEMPLATE = (history, userMessage) => {
  if (history.length === 0) {
    return `Đây là lần đầu tiên chúng ta trò chuyện. Hãy chào hỏi ấm áp và hỏi học sinh muốn chia sẻ điều gì.`;
  }

  const transcript = history
    .map(({ role, content }) => {
      const speaker = role === "user" ? "Học sinh" : "Larry";
      return `${speaker}: ${content}`;
    })
    .join("\n\n");

  return `Đây là lịch sử cuộc trò chuyện:

${transcript}

Học sinh vừa nói: "${userMessage}"

Hãy viết tin nhắn tiếp theo của Larry. Chỉ trả lời nội dung Larry nói, không lặp lại lịch sử, không ghi "Larry:".`;
};
```

---

## 7. 🔒 PRIVACY POLICY

### 7.1 Privacy Policy Content

```markdown
# CHÍNH SÁCH BẢO MẬT - LARRY

## 📋 Giới Thiệu
Larry là người bạn đồng hành AI an toàn dành cho học sinh. Chúng tôi cam kết bảo vệ quyền riêng tư và dữ liệu cá nhân của bạn.

## 🔒 Chúng Tôi Thu Thập Gì?

### Chế độ Ẩn Danh (Không đăng nhập)
✅ Session ID (tạm thời, xóa khi đóng tab)
✅ Cảm xúc được chọn/nhận diện
✅ Nội dung trò chuyện (chỉ trong session)
✅ Thống kê sử dụng (thời gian, số tin nhắn)

❌ KHÔNG thu thập: Họ tên, email, hình ảnh, video, vị trí

### Khi Đăng Nhập
✅ Lịch sử trò chuyện (được mã hóa)
✅ Cảm xúc theo thời gian
✅ Thống kê sử dụng

❌ KHÔNG thu thập: Hình ảnh, video, dữ liệu camera

## 📸 Camera & Nhận Diện Cảm Xúc

### Cam Kết
✅ Camera CHỈ dùng để nhận diện cảm xúc
✅ KHÔNG lưu hình ảnh khuôn mặt
✅ KHÔNG lưu video
✅ KHÔNG gửi hình ảnh đến server
✅ Tất cả xử lý diễn ra trên thiết bị của bạn

### Bạn Có Quyền
• Từ chối sử dụng camera
• Chỉ dùng chế độ nhập văn bản
• Xóa mọi dữ liệu bất cứ lúc nào

## 🛡️ Bảo Vệ Dữ Liệu

### Lưu Trữ
• Dữ liệu ẩn danh: sessionStorage (xóa khi đóng tab)
• Dữ liệu đăng nhập: localStorage (mã hóa)
• Server: Mã hóa end-to-end

### Chia Sẻ
❌ KHÔNG bán dữ liệu cho bên thứ ba
❌ KHÔNG sử dụng cho quảng cáo
✅ Chỉ chia sẻ: Khi có yêu cầu pháp lý

### Bảo Mật
• Mã hóa AES-256
• Token JWT có thời hạn
• HTTPS only
• Không lưu password dạng plain text

## 🎓 Thử Nghiệm Tại Trường

### Dữ Liệu Thu Thập (Ẩn Danh)
• Session ID
• Thời gian sử dụng
• Cảm xúc được chọn
• Phương thức: Camera hoặc Text
• Số lượt chat, thời lượng
• Hoạt động (game Scratch, bài tập)

### Dữ Liệu KHÔNG Thu Thập
❌ Họ tên học sinh
❌ Email
❌ Hình ảnh/video
❌ Thông tin nhận dạng cá nhân

### Mục Đích
• Đánh giá hiệu quả sản phẩm
• Cải thiện trải nghiệm người dùng
• Nghiên cứu giáo dục

## 👤 Quyền Của Bạn

• Xem dữ liệu của bạn
• Xóa dữ liệu bất cứ lúc nào
• Xuất dữ liệu (nếu đăng nhập)
• Từ chối cung cấp thông tin
• Liên hệ admin để yêu cầu xóa dữ liệu

## 📞 Liên Hệ

Nếu có thắc mắc về bảo mật:
• Email: privacy@larry.edu.vn
• Website: https://larry.edu.vn/privacy

## 📅 Cập Nhật

Phiên bản: 1.0
Ngày có hiệu lực: 2024-XX-XX
```

---

## 8. 🧪 KẾ HOẠCH THỬ NGHIỆM TẠI TRƯỜNG

### 8.1 Mục Tiêu Thử Nghiệm

```
Giai đoạn 1: Thử nghiệm nhỏ (2 tuần)
├── 1 trường học
├── 50-100 học sinh
├── Thu thập feedback
└── Điều chỉnh lỗi

Giai đoạn 2: Mở rộng (1 tháng)
├── 3-5 trường học
├── 200-500 học sinh
├── Thu thập dữ liệu ẩn danh
└── Phân tích xu hướng cảm xúc

Giai đoạn 3: Triển khai rộng (3 tháng)
├── 10+ trường học
├── 1000+ học sinh
├── Đánh giá toàn diện
└── Tối ưu hóa hệ thống
```

### 8.2 Dữ Liệu Thu Thập (Ẩn Danh)

```javascript
// backend/src/models/ExperimentData.js

{
  sessionId: "string",
  timestamp: "ISO 8601",
  schoolId: "string (optional)",
  grade: "string (optional)",
  
  // Cảm xúc
  emotionSelected: "happy|sad|angry|...",
  emotionSource: "camera|text|manual",
  emotionConfidence: "number (0-1)",
  
  // Tương tác
  method: "camera|text|both",
  messageCount: "number",
  sessionDuration: "seconds",
  
  // Hoạt động
  usedScratchGame: "boolean",
  usedBreathingExercise: "boolean",
  
  // Feedback (optional)
  satisfactionRating: "1-5",
  feedback: "string"
}
```

### 8.3 Mentor Dashboard

```javascript
// frontend/src/pages/MentorDashboard.jsx

// Chỉ truy cập được với mentor@larry.edu.vn

Features:
• Xem thống kê tổng quan
• Lọc theo trường/khối
• Xuất báo cáo Excel/CSV
• Theo dõi xu hướng cảm xúc
• Đánh giá hiệu quả sản phẩm
```

---

## 9. 🚀 TRIỂN KHAI

### 9.1 Environment Setup

```bash
# Frontend
cd frontend
npm install

# Backend
cd backend
npm install
cp .env.example .env
# Configure GEMINI_API_KEY, JWT_SECRET, etc.

# Run development
npm run dev
```

### 9.2 Environment Variables

```env
# Backend .env
NODE_ENV=development
PORT=5000

# Database (optional, for production)
MONGODB_URI=mongodb://localhost:27017/larry

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# AI
GEMINI_API_KEY=your-gemini-api-key

# CORS
FRONTEND_URL=http://localhost:3000

# Experiment
EXPERIMENT_MODE=true
MENTOR_EMAIL=mentor@larry.edu.vn
```

### 9.3 Deployment Checklist

- [ ] Setup MongoDB/PostgreSQL
- [ ] Configure environment variables
- [ ] Enable HTTPS
- [ ] Setup CDN for models
- [ ] Configure CORS properly
- [ ] Setup rate limiting
- [ ] Enable logging & monitoring
- [ ] Backup strategy
- [ ] Security audit
- [ ] Load testing

---

## 📊 TÓM TẮT

### Files Cần Tạo Mới (~30 files)
- 7 màn hình mới/refactor
- 15+ components mới
- 5+ services
- 3 utilities
- Documentation files

### Files Cần Sửa (~15 files)
- App.js
- AuthContext.js
- ChatBox.jsx
- Camera.jsx
- server.js
- Styles

### Ưu Tiên
1. 🔴 **AI Safety** - Yếu tố quan trọng nhất
2. 🔴 **No Login Required** - Trải nghiệm người dùng
3. 🔴 **Emotion Selection** - Thay thế camera-only
4. 🟡 **UI/UX Redesign** - Pastel, cute, friendly
5. 🟡 **Privacy Policy** - Minh bạch với phụ huynh
6. 🟢 **Testing Module** - Cho trường học

### Tech Stack (Giữ Nguyên)
- ReactJS + Create React App
- Node.js + ExpressJS
- Gemini API (thay thế Groq)
- Face API.js
- react-webcam

---

## 📞 LIÊN HỆ & HỖ TRỢ

**Project**: Larry - AI Companion for Students  
**Version**: 2.0  
**Last Updated**: 2024-XX-XX  
**Author**: Senior Full Stack Developer

---

## 📝 GHI CHÚ

- Tất cả thay đổi đều giữ nguyên stack công nghệ hiện tại
- Ưu tiên trải nghiệm người dùng và an toàn
- Code phải có comment rõ ràng
- Component tái sử dụng cao
- Dễ bảo trì và mở rộng

**Lưu ý quan trọng**: Đây là sản phẩm cho học sinh, nên AN TOÀN và QUYỀN RIÊNG TƯ là ưu tiên hàng đầu.