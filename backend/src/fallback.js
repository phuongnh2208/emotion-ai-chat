/**
 * Fallback Response System - Legacy Wrapper
 * Refactored to use new comprehensive fallback system
 * Maintains backward compatibility with existing code
 *
 * This file provides ESM-compatible exports for the fallback system.
 */

import { getFallbackResponse } from "./utils/fallbackResponses.js";

/**
 * Legacy function - now uses new fallback system
 * @param {string} emotion - Detected emotion
 * @param {Array} history - Chat history
 * @returns {string} Fallback message
 */
export function getFallbackReply(emotion, history = []) {
  const response = getFallbackResponse(emotion, history);
  return response.message;
}

// Re-export for backward compatibility
export { getFallbackResponse };
