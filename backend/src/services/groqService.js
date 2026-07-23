/**
 * Groq Service Integration
 * Provides AI responses using Groq API as a fallback when Gemini fails
 * or runs out of tokens.
 *
 * Uses the same safety prompt template and safety checks as Gemini service.
 * Designed for children ages 6-15.
 */

import Groq from "groq-sdk";
import {
  buildSafetyPrompt,
  buildUserPrompt,
} from "../config/safetyPromptTemplate.js";
import { validateAIResponse } from "../middleware/safety.js";
import { getFallbackReply } from "../fallback.js";

// ============================================================================
// CONFIGURATION
// ============================================================================

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = "llama-3.1-8b-instant"; // Fast, cost-effective model
const TEMPERATURE = 0.7;
const MAX_TOKENS = 300;
const RETRY_DELAY_MS = 2000;
const MAX_RETRIES = 2;

// ============================================================================
// SERVICE CLASS
// ============================================================================

export class GroqService {
  constructor() {
    this.client = null;
    this.initialized = false;

    if (GROQ_API_KEY) {
      try {
        this.client = new Groq({
          apiKey: GROQ_API_KEY,
        });
        this.initialized = true;
        console.log("✅ Groq service initialized (Gemini fallback)");
      } catch (error) {
        console.error("❌ Failed to initialize Groq:", error.message);
      }
    } else {
      console.warn("⚠️ GROQ_API_KEY not found - Groq fallback unavailable");
    }
  }

  /**
   * Check if service is available
   * @returns {boolean} Is available
   */
  isAvailable() {
    return this.initialized && this.client !== null;
  }

  /**
   * Generate AI response using Groq
   * @param {string} emotion - Detected emotion
   * @param {Array} history - Chat history
   * @param {string} sessionId - Session ID for logging
   * @param {boolean} isFirstMessage - Whether this is the first message
   * @returns {Promise<Object>} Response object
   */
  async generateResponse(
    emotion,
    history = [],
    sessionId = "unknown",
    isFirstMessage = false,
  ) {
    if (!this.isAvailable()) {
      return {
        message: getFallbackReply(emotion, history),
        emotion,
        fallback: true,
        warning: "Groq service không khả dụng - đang sử dụng chế độ dự phòng.",
      };
    }

    try {
      // Build prompts using the same safety template as Gemini
      const systemPrompt = buildSafetyPrompt(emotion, isFirstMessage);
      const userPrompt = buildUserPrompt(history, emotion, isFirstMessage);

      // Call Groq with retry logic
      const responseText = await this.callGroqWithRetry(
        systemPrompt,
        userPrompt,
      );

      // Validate AI response
      const validation = validateAIResponse(responseText, sessionId);

      if (!validation.safe) {
        console.warn("[GROQ RESPONSE BLOCKED]", validation.reason);

        return {
          message: getFallbackReply(emotion, history),
          emotion,
          fallback: true,
          warning: "Hệ thống đang trả lời ở chế độ an toàn.",
          safetyBlocked: true,
        };
      }

      return {
        message: responseText,
        emotion,
        fallback: false,
        source: "groq",
        safetyCheck: {
          passed: true,
          level: "safe",
        },
      };
    } catch (error) {
      console.error("Groq error:", error.message);

      return {
        message: getFallbackReply(emotion, history),
        emotion,
        fallback: true,
        warning:
          error.message.includes("429") || error.message.includes("rate limit")
            ? "Hệ thống AI đang bận — Larry đang trả lời ở chế độ dự phòng."
            : "Không thể kết nối tới AI — Larry đang trả lời ở chế độ dự phòng.",
      };
    }
  }

  /**
   * Call Groq API with retry logic
   * @param {string} systemPrompt - System prompt
   * @param {string} userPrompt - User prompt
   * @returns {Promise<string>} Response text
   */
  async callGroqWithRetry(systemPrompt, userPrompt) {
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const response = await this.client.chat.completions.create({
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: userPrompt,
            },
          ],
          model: GROQ_MODEL,
          temperature: TEMPERATURE,
          max_tokens: MAX_TOKENS,
          top_p: 0.95,
        });

        const text = response.choices?.[0]?.message?.content?.trim();

        if (!text) {
          throw new Error("Groq trả về nội dung rỗng.");
        }

        return text;
      } catch (error) {
        console.error(
          `Groq attempt ${attempt + 1} failed:`,
          error.message || error,
        );

        const isRetryable = this.isRetryableError(error);

        if (attempt < MAX_RETRIES - 1 && isRetryable) {
          await this.sleep(RETRY_DELAY_MS);
          continue;
        }

        throw error;
      }
    }

    throw new Error("Groq đã thử tối đa số lần cho phép.");
  }

  /**
   * Check if error is retryable
   * @param {Error} error - Error object
   * @returns {boolean} Is retryable
   */
  isRetryableError(error) {
    const msg = error.message || "";
    return (
      msg.includes("429") ||
      msg.includes("503") ||
      msg.includes("rate limit") ||
      msg.includes("overloaded") ||
      msg.includes("timeout") ||
      msg.includes("ECONNRESET")
    );
  }

  /**
   * Sleep utility
   * @param {number} ms - Milliseconds to sleep
   * @returns {Promise} Promise that resolves after ms
   */
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Get service status
   * @returns {Object} Service status
   */
  getStatus() {
    return {
      available: this.isAvailable(),
      model: GROQ_MODEL,
      temperature: TEMPERATURE,
      maxTokens: MAX_TOKENS,
    };
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

let groqServiceInstance = null;

/**
 * Get Groq service instance (singleton)
 * @returns {GroqService} Service instance
 */
export function getGroqService() {
  if (!groqServiceInstance) {
    groqServiceInstance = new GroqService();
  }
  return groqServiceInstance;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  GroqService,
  getGroqService,
};
