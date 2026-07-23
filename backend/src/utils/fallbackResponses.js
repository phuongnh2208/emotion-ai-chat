/**
 * Fallback Response System
 * Provides safe, age-appropriate responses when AI is unavailable
 * Designed for children ages 6-15
 */

import { SAFETY_LEVELS } from "../config/aiSafetyRules.js";

// ============================================================================
// FALLBACK RESPONSES BY EMOTION
// ============================================================================

/**
 * Get fallback response based on emotion and context
 * @param {string} emotion - Detected emotion
 * @param {Array} history - Chat history
 * @param {string} reason - Reason for fallback (optional)
 * @returns {Object} Fallback response
 */
export function getFallbackResponse(
  emotion = "neutral",
  history = [],
  reason = null,
) {
  const emotionResponses = getEmotionResponses(emotion);
  const isFirstMessage = history.length === 0;

  let message;

  if (isFirstMessage) {
    message = getGreetingFallback(emotion);
  } else {
    message = getConversationFallback(emotion, history);
  }

  // Add encouragement to seek adult help if needed
  const shouldAddEncouragement = shouldEncourageAdultHelp(emotion, history);
  if (shouldAddEncouragement) {
    message += "\n\n💡 " + getAdultHelpMessage(emotion);
  }

  return {
    message,
    emotion,
    fallback: true,
    reason: reason || "AI service không khả dụng",
    timestamp: new Date().toISOString(),
  };
}

/**
 * Get emotion-specific responses
 * @param {string} emotion - Emotion type
 * @returns {Object} Response templates
 */
function getEmotionResponses(emotion) {
  const responses = {
    happy: {
      greetings: [
        "Chào bạn! Mình thấy bạn đang rất vui! 😊 Hãy kể cho mình biết điều gì làm bạn vui nhé!",
        "Xin chào! Mình thấy nụ cười của bạn! 🌟 Bạn đang làm gì vui vậy?",
      ],
      continuations: [
        "Thật tuyệt khi thấy bạn vui! Hãy tiếp tục chia sẻ nhé. Bạn còn điều gì thú vị khác không?",
        "Mình rất vui vì bạn đang có một ngày tốt lành! Bạn muốn kể thêm không?",
      ],
    },

    sad: {
      greetings: [
        "Chào bạn... Mình thấy bạn đang buồn. 😢 Mình ở đây để lắng nghe bạn. Bạn có muốn kể cho mình nghe không?",
        "Xin chào. Mình thấy bạn có vẻ không được vui. Mình hiểu mà. Bạn muốn chia sẻ điều gì không?",
      ],
      continuations: [
        "Mình hiểu cảm giác của bạn. Điều đó thật sự không dễ dàng. Bạn muốn nói thêm không?",
        "Cảm ơn bạn đã chia sẻ với mình. Mình ở đây để lắng nghe. Bạn còn điều gì muốn nói không?",
      ],
    },

    angry: {
      greetings: [
        "Chào bạn. Mình thấy bạn đang tức giận. Điều đó ổn thôi, cảm xúc là điều tự nhiên. Bạn muốn nói về điều gì không?",
        "Xin chào. Mình thấy bạn có vẻ khó chịu. Mình ở đây để lắng nghe. Bạn có muốn chia sẻ không?",
      ],
      continuations: [
        "Mình hiểu bạn đang tức giận. Điều đó hoàn toàn bình thường. Bạn muốn nói thêm không?",
        "Cảm xúc của bạn là điều tự nhiên. Mình ở đây để lắng nghe. Bạn còn điều gì muốn nói không?",
      ],
    },

    neutral: {
      greetings: [
        "Xin chào! Mình là Larry, bạn đồng hành của bạn. Bạn có muốn chia sẻ điều gì không?",
        "Chào bạn! Mình rất vui được gặp bạn. Hôm nay bạn thế nào?",
      ],
      continuations: [
        "Mình đang lắng nghe bạn đây. Bạn còn điều gì muốn chia sẻ không?",
        "Cảm ơn bạn đã chia sẻ. Bạn còn điều gì khác không?",
      ],
    },

    surprised: {
      greetings: [
        "Chào bạn! Mình thấy bạn có vẻ ngạc nhiên! 😲 Có điều gì thú vị xảy ra sao? Hãy kể cho mình nghe!",
        "Xin chào! Mình thấy bạn đang ngạc nhiên. Có điều gì xảy ra vậy?",
      ],
      continuations: [
        "Thật thú vị! Hãy tiếp tục kể cho mình nghe nhé. Còn điều gì khác không?",
        "Mình cũng ngạc nhiên theo bạn! Bạn còn muốn chia sẻ gì không?",
      ],
    },

    fearful: {
      greetings: [
        "Chào bạn... Mình thấy bạn có vẻ lo lắng. 😟 Mình ở đây để lắng nghe bạn. Bạn có muốn chia sẻ không?",
        "Xin chào. Mình thấy bạn có vẻ sợ hãi. Mình hiểu. Bạn muốn nói về điều gì không?",
      ],
      continuations: [
        "Mình hiểu bạn đang lo lắng. Mình ở đây để lắng nghe. Bạn muốn nói thêm không?",
        "Cảm ơn bạn đã chia sẻ. Mình sẽ ở đây với bạn. Bạn còn điều gì muốn nói không?",
      ],
    },

    disgusted: {
      greetings: [
        "Chào bạn. Mình thấy bạn có vẻ khó chịu. Có điều gì làm bạn không vui sao? Hãy nói cho mình biết nhé.",
        "Xin chào. Mình thấy bạn có vẻ không thích điều gì đó. Bạn muốn chia sẻ không?",
      ],
      continuations: [
        "Mình hiểu cảm giác của bạn. Điều đó thật sự không dễ chịu. Bạn còn muốn nói gì không?",
        "Cảm ơn bạn đã chia sẻ. Mình ở đây để lắng nghe. Bạn còn điều gì khác không?",
      ],
    },
  };

  return responses[emotion] || responses.neutral;
}

/**
 * Get greeting fallback message
 * @param {string} emotion - Emotion type
 * @returns {string} Greeting message
 */
function getGreetingFallback(emotion) {
  const responses = getEmotionResponses(emotion);
  const greetings = responses.greetings;

  // Randomly select a greeting
  const randomIndex = Math.floor(Math.random() * greetings.length);
  return greetings[randomIndex];
}

/**
 * Get conversation fallback message
 * @param {string} emotion - Emotion type
 * @param {Array} history - Chat history
 * @returns {string} Conversation message
 */
function getConversationFallback(emotion, history) {
  const responses = getEmotionResponses(emotion);
  const continuations = responses.continuations;

  // Randomly select a continuation
  const randomIndex = Math.floor(Math.random() * continuations.length);
  return continuations[randomIndex];
}

/**
 * Get adult help encouragement message
 * @param {string} emotion - Emotion type
 * @returns {string} Encouragement message
 */
function getAdultHelpMessage(emotion) {
  const messages = {
    sad: "Nếu bạn cảm thấy buồn quá, hãy nói với bố mẹ hoặc giáo viên nhé. Họ sẽ giúp bạn! 💙",
    angry:
      "Nếu bạn cảm thấy tức giận quá, hãy nói với bố mẹ hoặc giáo viên nhé. Họ sẽ giúp bạn! 💙",
    fearful:
      "Nếu bạn cảm thấy sợ hãi, hãy nói với bố mẹ hoặc giáo viên ngay nhé. Họ sẽ bảo vệ bạn! 💙",
    neutral:
      "Nếu bạn cần giúp đỡ, hãy nói với bố mẹ hoặc giáo viên nhé. Họ luôn ở bên bạn! 💙",
  };

  return messages[emotion] || messages.neutral;
}

/**
 * Determine if should encourage seeking adult help
 * @param {string} emotion - Emotion type
 * @param {Array} history - Chat history
 * @returns {boolean} Should encourage
 */
function shouldEncourageAdultHelp(emotion, history) {
  // Always encourage for serious emotions
  const seriousEmotions = ["sad", "angry", "fearful"];
  if (seriousEmotions.includes(emotion)) {
    return true;
  }

  // Encourage if conversation is long
  if (history.length >= 6) {
    return true;
  }

  // Encourage if detected concerning keywords in history
  const lastUserMessage = history.filter((msg) => msg.role === "user").pop();

  if (lastUserMessage) {
    const concerningKeywords = ["buồn", "tức", "sợ", "không vui", "tệ"];
    const hasConcerning = concerningKeywords.some((keyword) =>
      lastUserMessage.content.toLowerCase().includes(keyword),
    );
    if (hasConcerning) {
      return true;
    }
  }

  return false;
}

// ============================================================================
// SPECIAL FALLBACK SCENARIOS
// ============================================================================

/**
 * Get fallback for API errors
 * @param {string} emotion - Detected emotion
 * @param {string} errorType - Type of error
 * @returns {Object} Fallback response
 */
export function getAPIErrorFallback(
  emotion = "neutral",
  errorType = "unknown",
) {
  let reason;
  let message;

  switch (errorType) {
    case "rate_limit":
      reason = "Hệ thống AI đang bận";
      message =
        "Hệ thống đang bận một chút. Mình vẫn ở đây để lắng nghe bạn nhé! 💙";
      break;

    case "timeout":
      reason = "Kết nối quá lâu";
      message =
        "Kết nối có vẻ không ổn định. Đừng lo, mình vẫn ở đây với bạn! 💙";
      break;

    case "service_unavailable":
      reason = "Dịch vụ không khả dụng";
      message =
        "Hệ thống đang bảo trì. Mình vẫn ở đây để lắng nghe bạn nhé! 💙";
      break;

    default:
      reason = "Lỗi kết nối";
      message =
        "Có lỗi xảy ra. Đừng lo, mình vẫn ở đây với bạn! Bạn có muốn chia sẻ điều gì không? 💙";
  }

  return {
    message,
    emotion,
    fallback: true,
    reason,
    errorType,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Get fallback for safety violations
 * @param {string} emotion - Detected emotion
 * @param {string} violationType - Type of violation
 * @returns {Object} Fallback response
 */
export function getSafetyViolationFallback(
  emotion = "neutral",
  violationType = "unknown",
) {
  let message;

  switch (violationType) {
    case "prohibited_content":
      message =
        "Mình không thể trả lời câu hỏi này. Hãy nói với bố mẹ hoặc giáo viên nhé. Họ sẽ giúp bạn! 💙";
      break;

    case "critical_keyword":
      message =
        "Mình rất lo lắng cho bạn. Hãy nói với bố mẹ hoặc giáo viên NGAY. Bạn không đơn độc đâu! 💙";
      break;

    case "warning_keyword":
      message =
        "Mình nghĩ bạn nên nói với bố mẹ hoặc giáo viên về điều này. Họ sẽ giúp bạn tốt hơn! 💙";
      break;

    default:
      message =
        "Mình không chắc về điều này. Hãy nói với bố mẹ hoặc giáo viên để được giúp đỡ nhé! 💙";
  }

  return {
    message,
    emotion,
    fallback: true,
    reason: "Vi phạm quy tắc an toàn",
    violationType,
    timestamp: new Date().toISOString(),
    safetyBlocked: true,
  };
}

/**
 * Get fallback for empty AI response
 * @param {string} emotion - Detected emotion
 * @returns {Object} Fallback response
 */
export function getEmptyResponseFallback(emotion = "neutral") {
  const messages = {
    happy:
      "Mình thấy bạn đang vui! Hãy chia sẻ niềm vui của bạn nhé. Bạn đang làm gì vui vậy? 😊",
    sad: "Mình thấy bạn đang buồn. Mình ở đây để lắng nghe bạn. Bạn có muốn kể cho mình nghe không? 😢",
    angry:
      "Mình thấy bạn đang tức giận. Điều đó ổn thôi, cảm xúc là điều tự nhiên. Bạn muốn nói về điều gì không? 😤",
    neutral:
      "Mình là Larry, bạn đồng hành của bạn. Bạn có muốn chia sẻ điều gì không? 😊",
    surprised: "Có điều gì thú vị xảy ra sao? Hãy kể cho mình nghe nhé! 😲",
    fearful:
      "Mình thấy bạn có vẻ lo lắng. Mình ở đây để lắng nghe bạn. Bạn có muốn chia sẻ không? 😟",
    disgusted: "Có điều gì làm bạn khó chịu sao? Hãy nói cho mình biết nhé. 😕",
  };

  return {
    message: messages[emotion] || messages.neutral,
    emotion,
    fallback: true,
    reason: "AI trả về nội dung rỗng",
    timestamp: new Date().toISOString(),
  };
}

// ============================================================================
// FALLBACK UTILITIES
// ============================================================================

/**
 * Check if fallback should be used
 * @param {Error} error - Error object
 * @returns {boolean} Should use fallback
 */
export function shouldUseFallback(error) {
  if (!error) return true;

  const retryableErrors = [
    "429",
    "503",
    "rate limit",
    "overloaded",
    "timeout",
    "ECONNRESET",
    "ENOTFOUND",
  ];

  const errorMessage = error.message || "";
  return retryableErrors.some((err) => errorMessage.includes(err));
}

/**
 * Get appropriate fallback based on error
 * @param {string} emotion - Detected emotion
 * @param {Array} history - Chat history
 * @param {Error} error - Error object
 * @returns {Object} Fallback response
 */
export function getContextualFallback(
  emotion = "neutral",
  history = [],
  error = null,
) {
  // If there's an error, determine the type
  if (error) {
    const errorMessage = error.message || "";

    if (errorMessage.includes("429") || errorMessage.includes("rate limit")) {
      return getAPIErrorFallback(emotion, "rate_limit");
    }

    if (errorMessage.includes("timeout")) {
      return getAPIErrorFallback(emotion, "timeout");
    }

    if (errorMessage.includes("503") || errorMessage.includes("unavailable")) {
      return getAPIErrorFallback(emotion, "service_unavailable");
    }
  }

  // Default fallback
  return getFallbackResponse(emotion, history, error?.message || null);
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  getFallbackResponse,
  getAPIErrorFallback,
  getSafetyViolationFallback,
  getEmptyResponseFallback,
  getContextualFallback,
  shouldUseFallback,
};
