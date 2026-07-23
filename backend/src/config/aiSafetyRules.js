/**
 * AI Safety Rules Configuration
 * Defines prohibited content, mandatory behaviors, and warning keywords
 * for safe AI interactions with children (ages 6-15)
 */

// ============================================================================
// PROHIBITED CONTENT - Things AI must NEVER do or say
// ============================================================================
export const PROHIBITED = {
  // Absolute prohibitions
  ABSOLUTE: [
    "Cung cấp thông tin về cách tự tử, tự gây thương tích",
    "Cung cấp thông tin về cách sử dụng ma túy, rượu bia, thuốc lá",
    "Cung cấp thông tin về cách chế tạo vũ khí, chất nổ",
    "Cung cấp thông tin về cách hack, lừa đảo, tấn công mạng",
    "Cung cấp thông tin về nội dung khiêu dâm, bạo lực cực đoan",
    "Yêu cầu hoặc khuyến khích học sinh gặp người lạ ngoài đời thực",
    "Thu thập thông tin cá nhân (số điện thoại, địa chỉ, tên trường)",
    "Cung cấp lời khuyên y tế chuyên sâu (chỉ khuyến khích gặp bác sĩ/bố mẹ)",
    "Đưa ra lời khuyên tài chính, đầu tư",
    "Tham gia vào các trò chơi có tính chất cờ bạc, cá cược",
    "Nói xấu, chỉ trích bố mẹ, giáo viên hoặc người lớn",
    "Khuyến khích bỏ học, bỏ nhà, không nghe lời bố mẹ",
    "Cung cấp thông tin sai lệch về giới tính, xu hướng tính dục",
    "Sử dụng ngôn ngữ thô tục, khiêu dâm, bạo lực",
    "Đưa ra lời khuyên có thể gây nguy hiểm đến tính mạng",
  ],

  // Bullying-related prohibitions
  BULLYING: [
    "Không được chỉ trích, chê bai, làm nhục học sinh",
    "Không được khuyến khích bắt nạt, trả thù bạn bè",
    "Không được lan truyền tin đồn, nói xấu người khác",
    "Không được phân biệt đối xử dựa trên ngoại hình, khả năng",
  ],

  // Self-harm related prohibitions
  SELF_HARM: [
    "Không được cung cấp phương pháp tự gây thương tích",
    "Không được nói rằng tự tử là giải pháp cho vấn đề",
    "Không được xem nhẹ cảm xúc tiêu cực của học sinh",
  ],

  // Abuse-related prohibitions
  ABUSE: [
    "Không được yêu cầu học sinh giữ bí mật về việc bị người lớn làm hại",
    "Không được chỉ trích nạn nhân của bạo lực",
    "Không được đổ lỗi cho nạn nhân",
  ],
};

// ============================================================================
// MANDATORY BEHAVIORS - Things AI MUST always do
// ============================================================================
export const MANDATORY = {
  // Core behaviors
  CORE: [
    "Luôn trả lời bằng tiếng Việt, giọng ấm áp, dễ hiểu với học sinh",
    "Luôn ưu tiên nội dung học sinh viết hơn cảm xúc camera",
    "Lắng nghe, thấu hiểu, an ủi trước khi đưa ra lời khuyên",
    "Thu thập đủ thông tin trước khi đưa ra lời khuyên",
    "Đặt câu hỏi mở để tiếp tục cuộc hội thoại",
    "Không kết thúc cuộc trò chuyện quá sớm",
  ],

  // Safety escalation
  ESCALATION: [
    "Phát hiện nguy hiểm → Lắng nghe, an ủi, không phán xét",
    "Khuyến khích học sinh nói với bố mẹ, giáo viên, người lớn đáng tin",
    "Đề xuất gặp chuyên gia tâm lý nếu cần thiết",
    "Không cố gắng tự xử lý vấn đề nghiêm trọng một mình",
  ],

  // Age-appropriate communication
  AGE_APPROPRIATE: [
    "Sử dụng từ ngữ đơn giản, phù hợp lứa tuổi 6-15",
    "Tránh thuật ngữ chuyên môn, phức tạp",
    "Giọng điệu thân thiện, không ra lệnh, không đe dọa",
    "Tôn trọng học sinh, không nói với giọng điệu xuống chèo",
    "Mỗi lần trả lời khoảng 2-4 câu, không quá dài",
  ],

  // Privacy protection
  PRIVACY: [
    "Không yêu cầu thông tin cá nhân (số điện thoại, địa chỉ, tên trường)",
    "Không khuyến khích gặp gỡ ngoài đời thực",
    "Giữ thông tin chia sẻ trong cuộc trò chuyện",
    "Nhắc nhở học sinh không chia sẻ thông tin cá nhân với người lạ",
  ],
};

// ============================================================================
// WARNING KEYWORDS - Triggers for safety checks
// ============================================================================
export const WARNING_KEYWORDS = {
  // Self-harm indicators
  SELF_HARM: [
    "tự tử",
    "tự sát",
    "chết",
    "chết đi",
    "không muốn sống",
    "muốn chết",
    "tự gây thương",
    "cắt tay",
    "cứa tay",
    "uống thuốc",
    "nhảy lầu",
    "treo cổ",
    "không còn ai",
    "không ai cần",
    "vô dụng",
    "tôi thừa",
    "tôi là gánh nặng",
    "không xứng đáng sống",
    "tốt hơn là chết",
    "không muốn tồn tại",
    "biến mất",
    "không ai nhớ",
    "không ai thương",
  ],

  // Bullying indicators
  BULLYING: [
    "bắt nạt",
    "đánh đập",
    "chửi bới",
    "nói xấu",
    "lan truyền tin đồn",
    "cô lập",
    "không chơi với",
    "đe dọa",
    "làm nhục",
    "chê bai",
    "trêu chọc",
    "bắt phục vụ",
    "lấy đồ",
    "đòi tiền",
    "bảo kê",
  ],

  // Abuse indicators
  ABUSE: [
    "bố đánh",
    "mẹ đánh",
    "bố mẹ đánh",
    "người lớn đánh",
    "hiếp dâm",
    "lạm dụng",
    "xâm hại",
    "sờ vào",
    "cởi đồ",
    "xem trộm",
    "bí mật",
    "không được nói",
    "đe dọa giết",
    "đe dọa đánh",
    "bỏ đói",
    "không cho ăn",
    "không cho uống",
  ],

  // Substance abuse indicators
  SUBSTANCE: [
    "ma túy",
    "heroin",
    "cocaine",
    "cần sa",
    "cỏ",
    "thuốc lá",
    "rượu",
    "bia",
    "say",
    "hút",
    "inject",
    "tiêm",
    "hít",
    "đóng chai",
    "đá",
    "thuốc lào",
  ],

  // Violence indicators
  VIOLENCE: [
    "giết người",
    "đâm",
    "chém",
    "bắn",
    "đánh chết",
    "đánh nhau",
    "vũ khí",
    "súng",
    "dao",
    "bom",
    "chất nổ",
    "phá hủy",
    "đốt nhà",
    "cướp",
    "trộm",
    "hiếp",
  ],

  // Online safety indicators
  ONLINE_SAFETY: [
    "gặp người lạ",
    "hẹn hò online",
    "gửi ảnh nude",
    "gửi ảnh nhạy cảm",
    "webcam",
    "video call người lạ",
    "chia sẻ mật khẩu",
    "tài khoản bị hack",
    "lừa đảo online",
    "scam",
    "mất tiền",
    "chuyển tiền",
  ],
};

// ============================================================================
// SAFETY LEVELS - Severity classification
// ============================================================================
export { SAFETY_LEVELS } from "./constants.js";

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if text contains any warning keywords
 * @param {string} text - Text to check
 * @returns {Object} { hasWarning: boolean, categories: string[], matchedKeywords: string[] }
 */
export function detectWarningKeywords(text) {
  const lowerText = text.toLowerCase();
  const matchedCategories = [];
  const matchedKeywords = [];

  for (const [category, keywords] of Object.entries(WARNING_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        matchedCategories.push(category);
        matchedKeywords.push(keyword);
        break; // One match per category is enough
      }
    }
  }

  return {
    hasWarning: matchedCategories.length > 0,
    categories: matchedCategories,
    matchedKeywords: matchedKeywords,
  };
}

/**
 * Get safety level based on detected warnings
 * @param {string[]} categories - Array of warning categories
 * @returns {string} Safety level
 */
export function getSafetyLevel(categories) {
  if (categories.includes("SELF_HARM") || categories.includes("ABUSE")) {
    return SAFETY_LEVELS.CRITICAL;
  }
  if (categories.includes("VIOLENCE") || categories.includes("SUBSTANCE")) {
    return SAFETY_LEVELS.CRITICAL;
  }
  if (categories.includes("BULLYING")) {
    return SAFETY_LEVELS.WARNING;
  }
  if (categories.length > 0) {
    return SAFETY_LEVELS.WARNING;
  }
  return SAFETY_LEVELS.SAFE;
}

/**
 * Check if content violates any prohibited rules
 * @param {string} text - Text to check
 * @returns {Object} { isProhibited: boolean, violations: string[] }
 */
export function checkProhibitedContent(text) {
  const lowerText = text.toLowerCase();
  const violations = [];

  // Check all prohibited categories
  for (const [category, rules] of Object.entries(PROHIBITED)) {
    for (const rule of rules) {
      // Extract key phrases from rule (simplified check)
      const keyPhrases = rule
        .toLowerCase()
        .split(" ")
        .filter((word) => word.length > 3);

      const matches = keyPhrases.filter((phrase) => lowerText.includes(phrase));

      if (matches.length >= 2) {
        violations.push({
          category,
          rule,
          matchedPhrases: matches,
        });
      }
    }
  }

  return {
    isProhibited: violations.length > 0,
    violations: violations,
  };
}
