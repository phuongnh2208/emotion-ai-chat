/**
 * Gemini Service Integration
 * Provides AI responses with safety checks using Google Gemini API
 * Falls back to Groq API when Gemini fails or runs out of tokens
 * Designed for children ages 6-15
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  buildSafetyPrompt,
  buildUserPrompt,
  buildSafetyCheckPrompt,
} from "../config/safetyPromptTemplate.js";
import { validateAIResponse, validateUserInput } from "../middleware/safety.js";
import { getFallbackReply } from "../fallback.js";
import { getGroqService } from "./groqService.js";

// ============================================================================
// CONFIGURATION
// ============================================================================

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-2.0-flash-exp";
const TEMPERATURE = 0.7;
const MAX_OUTPUT_TOKENS = 300;
const RETRY_DELAY_MS = 2000;
const MAX_RETRIES = 2;

// ============================================================================
// SERVICE CLASS
// ============================================================================

export class GeminiService {
  constructor() {
    this.client = null;
    this.model = null;
    this.initialized = false;
    this.groqService = getGroqService(); // Initialize Groq fallback

    if (GEMINI_API_KEY) {
      try {
        this.client = new GoogleGenerativeAI(GEMINI_API_KEY);
        this.model = this.client.getGenerativeModel({ model: GEMINI_MODEL });
        this.initialized = true;
        console.log("✅ Gemini service initialized");
      } catch (error) {
        console.error("❌ Failed to initialize Gemini:", error.message);
      }
    } else {
      console.warn("⚠️ GEMINI_API_KEY not found - using fallback mode");
    }

    // Log fallback availability
    if (this.groqService.isAvailable()) {
      console.log("✅ Groq fallback available");
    } else {
      console.warn("⚠️ Groq fallback unavailable - using local fallback only");
    }
  }

  /**
   * Check if service is available
   * @returns {boolean} Is available
   */
  isAvailable() {
    return this.initialized && this.model !== null;
  }

  /**
   * Generate AI response with safety checks
   * Falls back to Groq when Gemini fails or runs out of tokens
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
    // If Gemini not available, try Groq fallback
    if (!this.isAvailable()) {
      console.log("Gemini unavailable, trying Groq fallback...");
      return this.tryGroqFallback(emotion, history, sessionId, isFirstMessage);
    }

    try {
      // Build prompts
      const systemPrompt = buildSafetyPrompt(emotion, isFirstMessage);
      const userPrompt = buildUserPrompt(history, emotion, isFirstMessage);

      // Call Gemini with retry logic
      const responseText = await this.callGeminiWithRetry(
        systemPrompt,
        userPrompt,
      );

      // Validate AI response
      const validation = validateAIResponse(responseText, sessionId);

      if (!validation.safe) {
        console.warn("[AI RESPONSE BLOCKED]", validation.reason);

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
        source: "gemini",
        safetyCheck: {
          passed: true,
          level: "safe",
        },
      };
    } catch (error) {
      console.error("Gemini error:", error.message);

      // Check if this is a token/rate limit error - try Groq fallback
      const errorMessage = error.message || "";
      const isTokenOrRateLimitError =
        errorMessage.includes("429") ||
        errorMessage.includes("rate limit") ||
        errorMessage.includes("quota") ||
        errorMessage.includes("token") ||
        errorMessage.includes("RESOURCE_EXHAUSTED");

      if (isTokenOrRateLimitError && this.groqService.isAvailable()) {
        console.log("Gemini rate limit/token error, falling back to Groq...");
        return this.tryGroqFallback(
          emotion,
          history,
          sessionId,
          isFirstMessage,
        );
      }

      // Use local fallback on error
      return {
        message: getFallbackReply(emotion, history),
        emotion,
        fallback: true,
        warning:
          errorMessage.includes("429") || errorMessage.includes("rate limit")
            ? "Hệ thống AI đang bận — Larry đang trả lời ở chế độ dự phòng."
            : "Không thể kết nối tới AI — Larry đang trả lời ở chế độ dự phòng.",
      };
    }
  }

  /**
   * Try Groq as fallback when Gemini fails
   * @param {string} emotion - Detected emotion
   * @param {Array} history - Chat history
   * @param {string} sessionId - Session ID for logging
   * @param {boolean} isFirstMessage - Whether this is the first message
   * @returns {Promise<Object>} Response object
   */
  async tryGroqFallback(emotion, history, sessionId, isFirstMessage) {
    try {
      const groqResponse = await this.groqService.generateResponse(
        emotion,
        history,
        sessionId,
        isFirstMessage,
      );

      // If Groq also failed, use local fallback
      if (groqResponse.fallback && !groqResponse.source) {
        return {
          message: getFallbackReply(emotion, history),
          emotion,
          fallback: true,
          warning:
            "Hệ thống AI đang bận — Larry đang trả lời ở chế độ dự phòng.",
        };
      }

      return groqResponse;
    } catch (error) {
      console.error("Groq fallback error:", error.message);

      return {
        message: getFallbackReply(emotion, history),
        emotion,
        fallback: true,
        warning: "Hệ thống AI đang bận — Larry đang trả lời ở chế độ dự phòng.",
      };
    }
  }

  /**
   * Call Gemini API with retry logic
   * @param {string} systemPrompt - System prompt
   * @param {string} userPrompt - User prompt
   * @returns {Promise<string>} Response text
   */
  async callGeminiWithRetry(systemPrompt, userPrompt) {
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        const result = await this.model.generateContent({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `${systemPrompt}\n\n${userPrompt}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: TEMPERATURE,
            maxOutputTokens: MAX_OUTPUT_TOKENS,
            topP: 0.95,
            topK: 40,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
          ],
        });

        const response = result.response;
        const text = response.text()?.trim();

        if (!text) {
          throw new Error("Gemini trả về nội dung rỗng.");
        }

        return text;
      } catch (error) {
        console.error(`Gemini attempt ${attempt + 1} failed:`, error.message);

        // Check if error is retryable
        const isRetryable = this.isRetryableError(error);

        if (attempt < MAX_RETRIES - 1 && isRetryable) {
          await this.sleep(RETRY_DELAY_MS);
          continue;
        }

        throw error;
      }
    }

    throw new Error("Gemini đã thử tối đa số lần cho phép.");
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
   * Validate user input before sending to Gemini
   * @param {string} text - User input text
   * @param {string} sessionId - Session ID
   * @returns {Object} Validation result
   */
  validateInput(text, sessionId = "unknown") {
    return validateUserInput(text, sessionId);
  }

  /**
   * Get service status
   * @returns {Object} Service status
   */
  getStatus() {
    return {
      available: this.isAvailable(),
      model: GEMINI_MODEL,
      temperature: TEMPERATURE,
      maxOutputTokens: MAX_OUTPUT_TOKENS,
      groqFallback: this.groqService.getStatus(),
    };
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

let geminiServiceInstance = null;

/**
 * Get Gemini service instance (singleton)
 * @returns {GeminiService} Service instance
 */
export function getGeminiService() {
  if (!geminiServiceInstance) {
    geminiServiceInstance = new GeminiService();
  }
  return geminiServiceInstance;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  GeminiService,
  getGeminiService,
};
