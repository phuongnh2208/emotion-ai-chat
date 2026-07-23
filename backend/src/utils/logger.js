/**
 * Unified Logger Utility
 * Provides consistent logging across the application
 */

import { SAFETY_LEVELS } from "../config/aiSafetyRules.js";

// ============================================================================
// LOG LEVELS
// ============================================================================

export const LOG_LEVELS = {
  ERROR: "error",
  WARN: "warn",
  INFO: "info",
  DEBUG: "debug",
};

// ============================================================================
// LOGGER CLASS
// ============================================================================

export class Logger {
  constructor(component = "APP") {
    this.component = component;
    this.enabled = process.env.LOG_LEVEL !== "silent";
  }

  /**
   * Format log message
   * @param {string} level - Log level
   * @param {string} message - Log message
   * @param {Object} data - Additional data
   * @returns {string} Formatted log
   */
  format(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const component = this.component.padEnd(15);
    const levelStr = level.toUpperCase().padEnd(7);

    let log = `[${timestamp}] [${component}] [${levelStr}] ${message}`;

    if (data) {
      log += `\n${JSON.stringify(data, null, 2)}`;
    }

    return log;
  }

  /**
   * Log error message
   * @param {string} message - Error message
   * @param {Object} data - Additional data
   */
  error(message, data = null) {
    if (!this.enabled) return;
    console.error(this.format(LOG_LEVELS.ERROR, message, data));
  }

  /**
   * Log warning message
   * @param {string} message - Warning message
   * @param {Object} data - Additional data
   */
  warn(message, data = null) {
    if (!this.enabled) return;
    console.warn(this.format(LOG_LEVELS.WARN, message, data));
  }

  /**
   * Log info message
   * @param {string} message - Info message
   * @param {Object} data - Additional data
   */
  info(message, data = null) {
    if (!this.enabled) return;
    console.log(this.format(LOG_LEVELS.INFO, message, data));
  }

  /**
   * Log debug message
   * @param {string} message - Debug message
   * @param {Object} data - Additional data
   */
  debug(message, data = null) {
    if (!this.enabled) return;
    console.debug(this.format(LOG_LEVELS.DEBUG, message, data));
  }

  /**
   * Log safety violation
   * @param {Object} violation - Violation details
   */
  logSafetyViolation(violation) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      type: violation.type,
      level: violation.level,
      content: this.truncate(violation.content, 100),
      categories: violation.categories,
      matchedKeywords: violation.matchedKeywords,
      action: violation.action,
      sessionId: violation.sessionId || "unknown",
    };

    this.warn("SAFETY VIOLATION", logEntry);
  }

  /**
   * Log API call
   * @param {string} service - Service name
   * @param {boolean} success - Success status
   * @param {number} duration - Duration in ms
   * @param {Object} metadata - Additional metadata
   */
  logAPICall(service, success, duration, metadata = {}) {
    const logEntry = {
      service,
      success,
      duration: `${duration}ms`,
      ...metadata,
    };

    if (success) {
      this.debug("API CALL", logEntry);
    } else {
      this.error("API CALL FAILED", logEntry);
    }
  }

  /**
   * Truncate string to max length
   * @param {string} str - String to truncate
   * @param {number} maxLength - Maximum length
   * @returns {string} Truncated string
   */
  truncate(str, maxLength = 100) {
    if (!str || typeof str !== "string") return "";
    return str.length > maxLength ? str.substring(0, maxLength) + "..." : str;
  }
}

// ============================================================================
// SPECIALIZED LOGGERS
// ============================================================================

/**
 * Create logger for specific component
 * @param {string} component - Component name
 * @returns {Logger} Logger instance
 */
export function createLogger(component) {
  return new Logger(component);
}

// ============================================================================
// PRE-CONFIGURED LOGGERS
// ============================================================================

export const SafetyLogger = new Logger("SAFETY");
export const GeminiLogger = new Logger("GEMINI");
export const MiddlewareLogger = new Logger("MIDDLEWARE");
export const FallbackLogger = new Logger("FALLBACK");

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  Logger,
  createLogger,
  LOG_LEVELS,
  SafetyLogger,
  GeminiLogger,
  MiddlewareLogger,
  FallbackLogger,
};
