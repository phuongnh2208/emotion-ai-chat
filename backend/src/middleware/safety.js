/**
 * Safety Middleware
 * Validates user input and AI responses for safety compliance
 * Designed for children ages 6-15
 */

import {
  detectWarningKeywords,
  getSafetyLevel,
  checkProhibitedContent,
} from "../config/aiSafetyRules.js";
import {
  SAFETY_LEVELS,
  ESCALATION_MESSAGES,
  ERROR_MESSAGES,
  FALLBACK_MESSAGES,
} from "../config/constants.js";
import { ESCALATION_PROTOCOL } from "../config/conversationPolicy.js";
import { createLogger } from "../utils/logger.js";

// ============================================================================
// LOGGER INITIALIZATION
// ============================================================================

const safetyLogger = createLogger("SAFETY");

// ============================================================================
// SAFETY LOGGING
// ============================================================================

/**
 * Log safety violation for mentor review
 * @param {Object} violation - Violation details
 */
export function logSafetyViolation(violation) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    type: violation.type,
    level: violation.level,
    content: violation.content?.substring(0, 100),
    categories: violation.categories,
    matchedKeywords: violation.matchedKeywords,
    action: violation.action,
    sessionId: violation.sessionId || "unknown",
  };

  safetyLogger.warn("SAFETY VIOLATION", logEntry);
}

// ============================================================================
// USER INPUT VALIDATION
// ============================================================================

/**
 * Validate user input for safety
 * @param {string} text - User input text
 * @param {string} sessionId - Session ID for logging
 * @returns {Object} { safe: boolean, level: string, reason: string, action: string }
 */
export function validateUserInput(text, sessionId = "unknown") {
  if (!text || typeof text !== "string") {
    return {
      safe: false,
      level: SAFETY_LEVELS.WARNING,
      reason: ERROR_MESSAGES.INVALID_INPUT,
      action: "BLOCK",
    };
  }

  // Check for prohibited content
  const prohibitedCheck = checkProhibitedContent(text);
  if (prohibitedCheck.isProhibited) {
    const violation = {
      type: "PROHIBITED_CONTENT",
      level: SAFETY_LEVELS.CRITICAL,
      content: text,
      violations: prohibitedCheck.violations,
      action: "BLOCK",
      sessionId,
    };

    logSafetyViolation(violation);

    return {
      safe: false,
      level: SAFETY_LEVELS.CRITICAL,
      reason: ERROR_MESSAGES.PROHIBITED_CONTENT,
      action: "BLOCK",
      details: prohibitedCheck.violations,
    };
  }

  // Check for warning keywords
  const warningCheck = detectWarningKeywords(text);
  if (warningCheck.hasWarning) {
    const safetyLevel = getSafetyLevel(warningCheck.categories);

    // Check for escalation
    const escalation = ESCALATION_PROTOCOL.checkEscalation(text);

    const violation = {
      type: "WARNING_KEYWORD",
      level: safetyLevel,
      content: text,
      categories: warningCheck.categories,
      matchedKeywords: warningCheck.matchedKeywords,
      action: escalation.requiresEscalation ? "ESCALATE" : "WARN",
      sessionId,
    };

    logSafetyViolation(violation);

    return {
      safe: safetyLevel !== SAFETY_LEVELS.CRITICAL,
      level: safetyLevel,
      reason: `Phát hiện từ khóa: ${warningCheck.matchedKeywords.join(", ")}`,
      action: escalation.requiresEscalation ? "ESCALATE" : "WARN",
      escalationMessage: escalation.message,
      categories: warningCheck.categories,
    };
  }

  // Content is safe
  return {
    safe: true,
    level: SAFETY_LEVELS.SAFE,
    reason: "Nội dung an toàn",
    action: "ALLOW",
  };
}

// ============================================================================
// AI RESPONSE VALIDATION
// ============================================================================

/**
 * Validate AI response for safety
 * @param {string} text - AI response text
 * @param {string} sessionId - Session ID for logging
 * @returns {Object} { safe: boolean, level: string, reason: string }
 */
export function validateAIResponse(text, sessionId = "unknown") {
  if (!text || typeof text !== "string") {
    return {
      safe: false,
      level: SAFETY_LEVELS.CRITICAL,
      reason: ERROR_MESSAGES.AI_EMPTY_RESPONSE,
      action: "USE_FALLBACK",
    };
  }

  // Check for prohibited content in AI response
  const prohibitedCheck = checkProhibitedContent(text);
  if (prohibitedCheck.isProhibited) {
    const violation = {
      type: "AI_PROHIBITED_CONTENT",
      level: SAFETY_LEVELS.CRITICAL,
      content: text,
      violations: prohibitedCheck.violations,
      action: "USE_FALLBACK",
      sessionId,
    };

    logSafetyViolation(violation);

    return {
      safe: false,
      level: SAFETY_LEVELS.CRITICAL,
      reason: "AI trả về nội dung không phù hợp",
      action: "USE_FALLBACK",
      details: prohibitedCheck.violations,
    };
  }

  // Check for warning keywords in AI response
  const warningCheck = detectWarningKeywords(text);
  if (warningCheck.hasWarning) {
    const safetyLevel = getSafetyLevel(warningCheck.categories);

    const violation = {
      type: "AI_WARNING_KEYWORD",
      level: safetyLevel,
      content: text,
      categories: warningCheck.categories,
      matchedKeywords: warningCheck.matchedKeywords,
      action: "USE_FALLBACK",
      sessionId,
    };

    logSafetyViolation(violation);

    return {
      safe: false,
      level: safetyLevel,
      reason: `AI trả về từ khóa không phù hợp: ${warningCheck.matchedKeywords.join(", ")}`,
      action: "USE_FALLBACK",
      categories: warningCheck.categories,
    };
  }

  // Response is safe
  return {
    safe: true,
    level: SAFETY_LEVELS.SAFE,
    reason: "Phản hồi an toàn",
    action: "ALLOW",
  };
}

// ============================================================================
// SAFETY MIDDLEWARE EXPRESS
// ============================================================================

/**
 * Express middleware for safety validation
 * Validates user input before processing
 */
export function safetyMiddleware(req, res, next) {
  const { message, emotion, history } = req.body;

  // Validate message
  if (message) {
    const validation = validateUserInput(message, req.sessionId || "unknown");

    if (!validation.safe) {
      if (validation.action === "BLOCK") {
        return res.status(400).json({
          error: ERROR_MESSAGES.PROHIBITED_CONTENT,
          reason: validation.reason,
          safeMessage: FALLBACK_MESSAGES.SAFETY_VIOLATION.prohibited_content,
        });
      }

      if (validation.action === "ESCALATE") {
        return res.json({
          message: validation.escalationMessage,
          emotion: emotion || "neutral",
          escalation: true,
          level: validation.level,
        });
      }
    }

    // Attach validation result to request
    req.safetyValidation = validation;
  }

  next();
}

/**
 * Express middleware for AI response validation
 * Validates AI response before sending to user
 */
export function aiResponseValidator(req, res, next) {
  const originalJson = res.json.bind(res);

  res.json = function (data) {
    // Validate AI response if present
    if (data.message) {
      const validation = validateAIResponse(
        data.message,
        req.sessionId || "unknown",
      );

      if (!validation.safe) {
        safetyLogger.warn("[AI RESPONSE BLOCKED]", validation.reason);

        // Replace with safe fallback
        data.message = getSafeFallbackMessage(emotion || "neutral");
        data.fallback = true;
        data.warning = "Hệ thống đang trả lời ở chế độ an toàn.";
        data.safetyBlocked = true;
      }

      data.safetyCheck = {
        passed: validation.safe,
        level: validation.level,
      };
    }

    return originalJson(data);
  };

  next();
}

// ============================================================================
// FALLBACK HELPERS
// ============================================================================

/**
 * Get safe fallback message based on emotion
 * @param {string} emotion - Detected emotion
 * @returns {string} Safe fallback message
 */
function getSafeFallbackMessage(emotion) {
  const emotionMessages = {
    happy:
      "Mình thấy bạn đang vui! Hãy chia sẻ niềm vui của bạn nhé. Bạn đang làm gì vui vậy?",
    sad: "Mình thấy bạn đang buồn. Mình ở đây để lắng nghe bạn. Bạn có muốn kể cho mình nghe không?",
    angry:
      "Mình thấy bạn đang tức giận. Điều đó ổn thôi, cảm xúc là điều tự nhiên. Bạn muốn nói về điều gì không?",
    neutral:
      "Mình là Larry, bạn đồng hành của bạn. Bạn có muốn chia sẻ điều gì không?",
    surprised: "Có điều gì thú vị xảy ra sao? Hãy kể cho mình nghe nhé!",
    fearful:
      "Mình thấy bạn có vẻ lo lắng. Mình ở đây để lắng nghe bạn. Bạn có muốn chia sẻ không?",
    disgusted: "Có điều gì làm bạn khó chịu sao? Hãy nói cho mình biết nhé.",
  };

  return emotionMessages[emotion] || emotionMessages.neutral;
}

// ============================================================================
// SAFETY UTILITIES
// ============================================================================

/**
 * Check if text length is appropriate
 * @param {string} text - Text to check
 * @param {number} maxLength - Maximum allowed length
 * @returns {boolean} Is valid length
 */
export function isValidLength(text, maxLength = 500) {
  return text && text.length <= maxLength;
}

/**
 * Sanitize user input
 * @param {string} text - Text to sanitize
 * @returns {string} Sanitized text
 */
export function sanitizeInput(text) {
  if (!text) return "";

  return text
    .trim()
    .replace(/[<>]/g, "") // Remove HTML tags
    .substring(0, 500); // Limit length
}

/**
 * Check if conversation should be escalated to human
 * @param {string} text - User message
 * @returns {Object} Escalation info
 */
export function checkEscalationNeeded(text) {
  return ESCALATION_PROTOCOL.checkEscalation(text);
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  validateUserInput,
  validateAIResponse,
  safetyMiddleware,
  aiResponseValidator,
  logSafetyViolation,
  checkEscalationNeeded,
  sanitizeInput,
  isValidLength,
};
