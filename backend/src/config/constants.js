/**
 * Application Constants
 * Centralized configuration for all hard-coded values
 */

// ============================================================================
// API CONFIGURATION
// ============================================================================

export const API_CONFIG = {
  GEMINI_MODEL: "gemini-2.0-flash-exp",
  TEMPERATURE: 0.7,
  MAX_OUTPUT_TOKENS: 300,
  RETRY_DELAY_MS: 2000,
  MAX_RETRIES: 2,
  MAX_MESSAGE_LENGTH: 500,
};

// ============================================================================
// EMOTION MAPPINGS
// ============================================================================

export const EMOTION_VI = {
  happy: "vui",
  sad: "buồn",
  angry: "tức giận",
  neutral: "bình thường",
  surprised: "ngạc nhiên",
  fearful: "sợ hãi",
  disgusted: "khó chịu",
};

export const EMOTION_ICONS = {
  happy: "😊",
  sad: "😢",
  angry: "😤",
  neutral: "😐",
  surprised: "😲",
  fearful: "😨",
  disgusted: "😕",
};

// ============================================================================
// SAFETY THRESHOLDS
// ============================================================================

export const SAFETY_THRESHOLDS = {
  MAX_CONVERSATION_MESSAGES: 20,
  MIN_MESSAGES_BEFORE_CLOSING: 3,
  MAX_PHASE_MESSAGES: {
    greeting: 2,
    listening: 10,
    supporting: 8,
    closing: 3,
  },
  PII_MAX_MATCHES: 5,
  AGGRESSIVE_SCORE_THRESHOLD: 20,
  MANIPULATION_SCORE_THRESHOLD: 15,
};

// ============================================================================
// ESCALATION MESSAGES
// ============================================================================

export const ESCALATION_MESSAGES = {
  SELF_HARM:
    "Mình rất lo lắng cho bạn. Bạn không đơn độc đâu. Hãy nói với bố mẹ hoặc giáo viên NGAY, hoặc gọi đường dây nóng 111.",
  ABUSE:
    "Bạn không phải là người có lỗi. Hãy nói với người lớn đáng tin cậy NGAY. Bạn có thể gọi 111 để được bảo vệ.",
  VIOLENCE: "Điều này rất nguy hiểm. Hãy nói với bố mẹ hoặc giáo viên NGAY.",
  BULLYING:
    "Bạn không đáng bị đối xử như vậy. Hãy nói với bố mẹ hoặc giáo viên để được giúp đỡ.",
  SUBSTANCE: "Những thứ đó rất nguy hiểm. Hãy nói với bố mẹ hoặc giáo viên.",
};

// ============================================================================
// FALLBACK MESSAGES
// ============================================================================

export const FALLBACK_MESSAGES = {
  API_ERROR: {
    rate_limit:
      "Hệ thống đang bận một chút. Mình vẫn ở đây để lắng nghe bạn nhé! 💙",
    timeout: "Kết nối có vẻ không ổn định. Đừng lo, mình vẫn ở đây với bạn! 💙",
    service_unavailable:
      "Hệ thống đang bảo trì. Mình vẫn ở đây để lắng nghe bạn nhé! 💙",
    default:
      "Có lỗi xảy ra. Đừng lo, mình vẫn ở đây với bạn! Bạn có muốn chia sẻ điều gì không? 💙",
  },
  SAFETY_VIOLATION: {
    prohibited_content:
      "Mình không thể trả lời câu hỏi này. Hãy nói với bố mẹ hoặc giáo viên nhé. Họ sẽ giúp bạn! 💙",
    critical_keyword:
      "Mình rất lo lắng cho bạn. Hãy nói với bố mẹ hoặc giáo viên NGAY. Bạn không đơn độc đâu! 💙",
    warning_keyword:
      "Mình nghĩ bạn nên nói với bố mẹ hoặc giáo viên về điều này. Họ sẽ giúp bạn tốt hơn! 💙",
    default:
      "Mình không chắc về điều này. Hãy nói với bố mẹ hoặc giáo viên để được giúp đỡ nhé! 💙",
  },
  ADULT_HELP: {
    sad: "Nếu bạn cảm thấy buồn quá, hãy nói với bố mẹ hoặc giáo viên nhé. Họ sẽ giúp bạn! 💙",
    angry:
      "Nếu bạn cảm thấy tức giận quá, hãy nói với bố mẹ hoặc giáo viên nhé. Họ sẽ giúp bạn! 💙",
    fearful:
      "Nếu bạn cảm thấy sợ hãi, hãy nói với bố mẹ hoặc giáo viên ngay nhé. Họ sẽ bảo vệ bạn! 💙",
    neutral:
      "Nếu bạn cần giúp đỡ, hãy nói với bố mẹ hoặc giáo viên nhé. Họ luôn ở bên bạn! 💙",
  },
};

// ============================================================================
// CONVERSATION PHASES
// ============================================================================

export const CONVERSATION_PHASES = {
  GREETING: "greeting",
  LISTENING: "listening",
  SUPPORTING: "supporting",
  CLOSING: "closing",
};

// ============================================================================
// SAFETY LEVELS
// ============================================================================

export const SAFETY_LEVELS = {
  SAFE: "safe",
  WARNING: "warning",
  CRITICAL: "critical",
  ESCALATE: "escalate",
};

// ============================================================================
// ERROR MESSAGES
// ============================================================================

export const ERROR_MESSAGES = {
  MISSING_EMOTION: "Thiếu thông tin cảm xúc.",
  INVALID_HISTORY: "history phải là mảng.",
  INVALID_INPUT: "Input không hợp lệ",
  PROHIBITED_CONTENT: "Nội dung chứa thông tin không phù hợp",
  AI_EMPTY_RESPONSE: "AI trả về nội dung rỗng",
  GEMINI_NOT_INITIALIZED: "Chưa cấu hình GEMINI_API_KEY",
  GROQ_DEPRECATED:
    "Groq đã bị thay thế bằng Gemini. Vui lòng sử dụng GeminiService.",
};

// ============================================================================
// SUCCESS MESSAGES
// ============================================================================

export const SUCCESS_MESSAGES = {
  SERVER_RUNNING: "Server running on http://localhost:",
  GEMINI_LOADED: "loaded ✓",
  GEMINI_MISSING: "MISSING ✗ — dùng chế độ dự phòng",
  SAFETY_ENABLED: "Safety: Enabled ✓",
};

// ============================================================================
// RETRYABLE ERRORS
// ============================================================================

export const RETRYABLE_ERRORS = [
  "429",
  "503",
  "rate limit",
  "overloaded",
  "timeout",
  "ECONNRESET",
  "ENOTFOUND",
];

// ============================================================================
// CLOSING KEYWORDS
// ============================================================================

export const CLOSING_KEYWORDS = [
  "tạm biệt",
  "bye",
  "cảm ơn",
  "đủ rồi",
  "không còn gì",
  "hẹn gặp lại",
];

// ============================================================================
// CONCERNING KEYWORDS
// ============================================================================

export const CONCERNING_KEYWORDS = ["buồn", "tức", "sợ", "không vui", "tệ"];

// ============================================================================
// HELP KEYWORDS
// ============================================================================

export const HELP_KEYWORDS = [
  "giúp tôi",
  "phải làm sao",
  "bị làm sao",
  "không biết",
];

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  API_CONFIG,
  EMOTION_VI,
  EMOTION_ICONS,
  SAFETY_THRESHOLDS,
  ESCALATION_MESSAGES,
  FALLBACK_MESSAGES,
  CONVERSATION_PHASES,
  SAFETY_LEVELS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  RETRYABLE_ERRORS,
  CLOSING_KEYWORDS,
  CONCERNING_KEYWORDS,
  HELP_KEYWORDS,
};
