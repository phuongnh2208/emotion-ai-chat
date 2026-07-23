/**
 * Fallback Response System - Legacy Wrapper
 * Refactored to use new comprehensive fallback system
 * Maintains backward compatibility with existing code
 */

const { getFallbackResponse } = require("./src/utils/fallbackResponses");

/**
 * Legacy function - now uses new fallback system
 * @param {string} emotion - Detected emotion
 * @param {Array} history - Chat history
 * @returns {string} Fallback message
 */
function getFallbackReply(emotion, history = []) {
  const response = getFallbackResponse(emotion, history);
  return response.message;
}

// Re-export for backward compatibility
module.exports = { getFallbackReply };
