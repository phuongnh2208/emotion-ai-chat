/**
 * System Prompt Builder
 * Creates safety-focused system prompts for Larry AI
 */

import { buildSafetyPrompt } from "./safetyPrompt.js";

/**
 * Get system prompt for Gemini
 * @param {Object} params - Prompt parameters
 * @param {string} params.emotion - Detected emotion
 * @param {boolean} params.isFirstMessage - Is first message
 * @returns {string} System prompt
 */
export function getSystemPrompt({
  emotion = "neutral",
  isFirstMessage = false,
} = {}) {
  return buildSafetyPrompt(emotion, isFirstMessage);
}

export default { getSystemPrompt };
