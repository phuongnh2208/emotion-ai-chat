/**
 * Simplified Detection Patterns
 * Regex patterns for safety content detection
 */

// ============================================================================
// SIMPLIFIED PATTERNS
// ============================================================================

/**
 * Self-harm patterns - simplified and consolidated
 */
export const SELF_HARM_PATTERNS = [
  /tự\s*(tử|sát|gây\s*thương)/i,
  /(muốn|không\s*muốn)\s*(chết|sống)/i,
  /(cắt|cứa|chém|đâm)\s*(tay|mình)/i,
  /(nhảy\s*lầu|treo\s*cổ|uống\s*thuốc)/i,
  /(không\s*còn\s*ai|vô\s*dụng|gánh\s*nặng)/i,
  /(không\s*xứng\s*đáng|tốt\s*hơn\s*là\s*chết|biến\s*mất)/i,
];

/**
 * Bullying patterns - simplified
 */
export const BULLYING_PATTERNS = [
  /(bắt\s*nạt|đánh\s*đập|chửi\s*bới|nói\s*xấu)/i,
  /(cô\s*lập|không\s*chơi\s*với|đe\s*dọa)/i,
  /(làm\s*nhục|chê\s*bai|trêu\s*chọc)/i,
  /(bắt\s*phục\s*vụ|lấy\s*đồ|đòi\s*tiền|bảo\s*kê)/i,
];

/**
 * Abuse patterns - simplified
 */
export const ABUSE_PATTERNS = [
  /(bố|mẹ|bố\s*mẹ|người\s*lớn)\s*(đánh|đập|hành\s*hung)/i,
  /(hiếp\s*dâm|lạm\s*dụng|xâm\s*hại|làm\s*hại)/i,
  /(sờ\s*vào|cởi\s*đồ|xem\s*trộm)/i,
  /(đe\s*dọa\s*(giết|đánh)|bỏ\s*đói|không\s*cho\s*(ăn|uống))/i,
];

/**
 * Substance abuse patterns - simplified
 */
export const SUBSTANCE_PATTERNS = [
  /(ma\s*túy|heroin|cocaine|cần\s*sa|cỏ)/i,
  /(thuốc\s*(lá|lào)|rượu|bia)/i,
  /(hút|inject|tiêm|hít|đá)/i,
];

/**
 * Violence patterns - simplified
 */
export const VIOLENCE_PATTERNS = [
  /(giết\s*người|đâm|chém|bắn|đánh\s*chết)/i,
  /(đánh\s*nhau|vũ\s*khí|súng|dao|bom|chất\s*nổ)/i,
  /(phá\s*hủy|đốt\s*nhà|cướp|trộm|hiếp)/i,
];

/**
 * Online safety patterns - simplified
 */
export const ONLINE_SAFETY_PATTERNS = [
  /gặp\s*người\s*lạ|hẹn\s*hò\s*online/i,
  /gửi\s*ảnh\s*(nude|nhạy\s*cảm)/i,
  /(webcam|video\s*call\s*người\s*lạ|chia\s*sẻ\s*mật\s*khẩu)/i,
  /(tài\s*khoản\s*bị\s*hack|lừa\s*đảo|scam|mất\s*tiền|chuyển\s*tiền)/i,
];

/**
 * Aggressive language patterns - simplified
 */
export const AGGRESSIVE_PATTERNS = [
  /(mày|tao|chó|đồ\s*(ngu|ngốc|rác)|thằng|con)/i,
  /(giết|đánh|chém|đâm|bắn|đập)/i,
  /(im\s*đi|câm\s*miệng|thôi\s*ngay|đừng\s*nói)/i,
  /(kinh\s*tởm|ghê\s*tởm|thuốc\s*độc|thuốc\s*chuột)/i,
];

/**
 * Manipulation patterns - simplified
 */
export const MANIPULATION_PATTERNS = [
  /đừng\s*nói\s*với\s*(ai|bố\s*mẹ|giáo\s*viên|người\s*lớn)/i,
  /(đây\s*là\s*bí\s*mật|giữ\s*bí\s*mật|không\s*được\s*nói)/i,
  /(chỉ\s*có\s*mình\s*thôi|chỉ\s*biết\s*mình\s*ta)/i,
  /(gửi\s*ảnh|gửi\s*video|show\s*ảnh)/i,
  /(gặp\s*ngoài|gặp\s*thật|gặp\s*trực\s*tiếp)/i,
];

// ============================================================================
// PII PATTERNS
// ============================================================================

export const PII_PATTERNS = {
  PHONE: /(\+84|0)[0-9]{9,10}/g,
  EMAIL: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  ADDRESS: /(địa\s*chỉ|số\s*\d+.*đường|phường|quận|thành\s*phố)/i,
  SCHOOL: /(trường|thpt|thcs|tiểu\s*học|trung\s*học)/i,
  NAME: /(tên\s*là|tôi\s*tên|em\s*tên)/i,
};

// ============================================================================
// PATTERN REGISTRY
// ============================================================================

export const PATTERN_REGISTRY = {
  SELF_HARM: SELF_HARM_PATTERNS,
  BULLYING: BULLYING_PATTERNS,
  ABUSE: ABUSE_PATTERNS,
  SUBSTANCE: SUBSTANCE_PATTERNS,
  VIOLENCE: VIOLENCE_PATTERNS,
  ONLINE_SAFETY: ONLINE_SAFETY_PATTERNS,
  AGGRESSIVE: AGGRESSIVE_PATTERNS,
  MANIPULATION: MANIPULATION_PATTERNS,
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if text matches any pattern in category
 * @param {string} text - Text to check
 * @param {RegExp[]} patterns - Array of patterns
 * @returns {boolean} Has match
 */
export function matchesAnyPattern(text, patterns) {
  return patterns.some((pattern) => pattern.test(text));
}

/**
 * Get all matching patterns
 * @param {string} text - Text to check
 * @param {RegExp[]} patterns - Array of patterns
 * @returns {RegExp[]} Matching patterns
 */
export function getMatchingPatterns(text, patterns) {
  return patterns.filter((pattern) => pattern.test(text));
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  SELF_HARM_PATTERNS,
  BULLYING_PATTERNS,
  ABUSE_PATTERNS,
  SUBSTANCE_PATTERNS,
  VIOLENCE_PATTERNS,
  ONLINE_SAFETY_PATTERNS,
  AGGRESSIVE_PATTERNS,
  MANIPULATION_PATTERNS,
  PII_PATTERNS,
  PATTERN_REGISTRY,
  matchesAnyPattern,
  getMatchingPatterns,
};
