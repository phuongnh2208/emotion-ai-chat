/**
 * Safety Checks Utility
 * Provides keyword detection and content filtering functions
 * Designed for children ages 6-15
 */

import {
  detectWarningKeywords,
  getSafetyLevel,
  WARNING_KEYWORDS,
} from "../config/aiSafetyRules.js";
import { SAFETY_LEVELS, SAFETY_THRESHOLDS } from "../config/constants.js";
import { PATTERN_REGISTRY, matchesAnyPattern } from "../config/patterns.js";

// ============================================================================
// REGEX PATTERNS FOR ADVANCED DETECTION
// ============================================================================

/**
 * Regex patterns for detecting harmful content
 * More sophisticated than simple keyword matching
 */
// Use simplified patterns from patterns.js
export const DETECTION_PATTERNS = PATTERN_REGISTRY;

// ============================================================================
// KEYWORD DETECTION FUNCTIONS
// ============================================================================

/**
 * Check user input for harmful content
 * @param {string} text - User input text
 * @returns {Object} { safe: boolean, reason: string, categories: string[], severity: string }
 */
export function checkUserInput(text) {
  if (!text || typeof text !== "string") {
    return {
      safe: false,
      reason: "Input không hợp lệ",
      categories: [],
      severity: SAFETY_LEVELS.WARNING,
    };
  }

  const lowerText = text.toLowerCase();
  const detectedCategories = [];
  const matchedPatterns = [];

  // Check each category
  for (const [category, patterns] of Object.entries(DETECTION_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(text)) {
        detectedCategories.push(category);
        matchedPatterns.push(pattern.source);
        break; // One match per category is enough
      }
    }
  }

  // Also check keyword-based detection
  const keywordCheck = detectWarningKeywords(text);
  if (keywordCheck.hasWarning) {
    for (const category of keywordCheck.categories) {
      if (!detectedCategories.includes(category)) {
        detectedCategories.push(category);
      }
    }
  }

  // Determine severity
  const severity = getSafetyLevel(detectedCategories);

  // Build result
  if (detectedCategories.length === 0) {
    return {
      safe: true,
      reason: "Nội dung an toàn",
      categories: [],
      severity: SAFETY_LEVELS.SAFE,
    };
  }

  const reason =
    severity === SAFETY_LEVELS.CRITICAL
      ? "Nội dung chứa thông tin nguy hiểm"
      : "Nội dung cần được chú ý";

  return {
    safe: severity !== SAFETY_LEVELS.CRITICAL,
    reason,
    categories: detectedCategories,
    severity,
    matchedPatterns,
  };
}

/**
 * Check AI response for harmful content
 * @param {string} text - AI response text
 * @returns {Object} { safe: boolean, reason: string, categories: string[], severity: string }
 */
export function checkAIResponse(text) {
  if (!text || typeof text !== "string") {
    return {
      safe: false,
      reason: "AI trả về nội dung rỗng",
      categories: [],
      severity: SAFETY_LEVELS.CRITICAL,
    };
  }

  const lowerText = text.toLowerCase();
  const detectedCategories = [];
  const matchedPatterns = [];

  // Check each category
  for (const [category, patterns] of Object.entries(DETECTION_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(text)) {
        detectedCategories.push(category);
        matchedPatterns.push(pattern.source);
        break; // One match per category is enough
      }
    }
  }

  // Also check keyword-based detection
  const keywordCheck = detectWarningKeywords(text);
  if (keywordCheck.hasWarning) {
    for (const category of keywordCheck.categories) {
      if (!detectedCategories.includes(category)) {
        detectedCategories.push(category);
      }
    }
  }

  // Determine severity
  const severity = getSafetyLevel(detectedCategories);

  // Build result
  if (detectedCategories.length === 0) {
    return {
      safe: true,
      reason: "Phản hồi an toàn",
      categories: [],
      severity: SAFETY_LEVELS.SAFE,
    };
  }

  const reason =
    severity === SAFETY_LEVELS.CRITICAL
      ? "AI trả về nội dung không phù hợp"
      : "AI trả về nội dung cần kiểm tra";

  return {
    safe: false,
    reason,
    categories: detectedCategories,
    severity,
    matchedPatterns,
  };
}

// ============================================================================
// ADVANCED DETECTION FUNCTIONS
// ============================================================================

/**
 * Detect personally identifiable information (PII)
 * @param {string} text - Text to check
 * @returns {Object} { hasPII: boolean, types: string[], matches: string[] }
 */
export function detectPII(text) {
  if (!text || typeof text !== "string") {
    return { hasPII: false, types: [], matches: [] };
  }

  const piiPatterns = PII_PATTERNS;

  const detectedTypes = [];
  const matches = [];

  for (const [type, pattern] of Object.entries(piiPatterns)) {
    const found = text.match(pattern);
    if (found) {
      detectedTypes.push(type);
      matches.push(...found);
    }
  }

  return {
    hasPII: detectedTypes.length > 0,
    types: detectedTypes,
    matches: matches.slice(0, 5), // Limit to 5 matches
  };
}

/**
 * Detect aggressive or threatening language
 * @param {string} text - Text to check
 * @returns {Object} { isAggressive: boolean, score: number, indicators: string[] }
 */
export function detectAggressiveLanguage(text) {
  if (!text || typeof text !== "string") {
    return { isAggressive: false, score: 0, indicators: [] };
  }

  const aggressivePatterns = [
    /(mày|tao|chó|đồ\s*ngu|đồ\s*ngốc|thằng|con)/i,
    /(giết|đánh|chém|đâm|bắn|đập)/i,
    /(im\s*đi|câm\s*miệng|thôi\s*ngay|đừng\s*nói)/i,
    /(đồ\s*rác|đồ\s*rác|kinh\s*tởm|ghê\s*tởm)/i,
    /(thuốc\s*độc|thuốc\s*chuột|độc)/i,
  ];

  const indicators = [];
  let score = 0;

  for (const pattern of aggressivePatterns) {
    if (pattern.test(text)) {
      indicators.push(pattern.source);
      score += 10;
    }
  }

  return {
    isAggressive: score >= 20,
    score: Math.min(score, 100),
    indicators: indicators.slice(0, 5),
  };
}

/**
 * Detect manipulation or grooming behavior
 * @param {string} text - Text to check
 * @returns {Object} { isManipulative: boolean, score: number, indicators: string[] }
 */
export function detectManipulation(text) {
  if (!text || typeof text !== "string") {
    return { isManipulative: false, score: 0, indicators: [] };
  }

  const manipulationPatterns = [
    /(đừng\s*nói\s*với\s*(ai|bố\s*mẹ|giáo\s*viên|người\s*lớn))/i,
    /(đây\s*là\s*bí\s*mật|giữ\s*bí\s*mật|không\s*được\s*nói)/i,
    /(chỉ\s*có\s*mình\s*thôi|chỉ\s*biết\s*mình\s*ta)/i,
    /(gửi\s*ảnh|gửi\s*video|show\s*ảnh)/i,
    /(gặp\s*ngoài|gặp\s*thật|gặp\s*trực\s*tiếp)/i,
  ];

  const indicators = [];
  let score = 0;

  for (const pattern of manipulationPatterns) {
    if (pattern.test(text)) {
      indicators.push(pattern.source);
      score += 15;
    }
  }

  return {
    isManipulative: score >= 15,
    score: Math.min(score, 100),
    indicators: indicators.slice(0, 5),
  };
}

// ============================================================================
// COMPREHENSIVE SAFETY CHECK
// ============================================================================

/**
 * Perform comprehensive safety check on text
 * @param {string} text - Text to check
 * @param {string} type - Type of content: 'user' or 'ai'
 * @returns {Object} Comprehensive safety report
 */
export function comprehensiveSafetyCheck(text, type = "user") {
  if (!text || typeof text !== "string") {
    return {
      safe: false,
      overallSeverity: SAFETY_LEVELS.WARNING,
      checks: {},
      recommendation: "REVIEW",
    };
  }

  // Run all checks
  const keywordCheck =
    type === "user" ? checkUserInput(text) : checkAIResponse(text);
  const piiCheck = detectPII(text);
  const aggressiveCheck = detectAggressiveLanguage(text);
  const manipulationCheck = detectManipulation(text);

  // Compile checks
  const checks = {
    keywords: keywordCheck,
    pii: piiCheck,
    aggressive: aggressiveCheck,
    manipulation: manipulationCheck,
  };

  // Determine overall severity
  let overallSeverity = SAFETY_LEVELS.SAFE;

  if (keywordCheck.severity === SAFETY_LEVELS.CRITICAL) {
    overallSeverity = SAFETY_LEVELS.CRITICAL;
  } else if (keywordCheck.severity === SAFETY_LEVELS.WARNING) {
    overallSeverity = SAFETY_LEVELS.WARNING;
  }

  if (piiCheck.hasPII && overallSeverity !== SAFETY_LEVELS.CRITICAL) {
    overallSeverity = SAFETY_LEVELS.WARNING;
  }

  if (manipulationCheck.isManipulative) {
    overallSeverity = SAFETY_LEVELS.CRITICAL;
  }

  if (
    aggressiveCheck.isAggressive &&
    overallSeverity !== SAFETY_LEVELS.CRITICAL
  ) {
    overallSeverity = SAFETY_LEVELS.WARNING;
  }

  // Determine recommendation
  let recommendation = "ALLOW";
  if (overallSeverity === SAFETY_LEVELS.CRITICAL) {
    recommendation = "BLOCK";
  } else if (overallSeverity === SAFETY_LEVELS.WARNING) {
    recommendation = "REVIEW";
  }

  return {
    safe: overallSeverity === SAFETY_LEVELS.SAFE,
    overallSeverity,
    checks,
    recommendation,
    summary: generateSafetySummary(checks, overallSeverity),
  };
}

/**
 * Generate human-readable safety summary
 * @param {Object} checks - Safety checks
 * @param {string} severity - Overall severity
 * @returns {string} Summary
 */
function generateSafetySummary(checks, severity) {
  const issues = [];

  if (checks.keywords.categories.length > 0) {
    issues.push(`Từ khóa nhạy cảm: ${checks.keywords.categories.join(", ")}`);
  }

  if (checks.pii.hasPII) {
    issues.push(`Thông tin cá nhân: ${checks.pii.types.join(", ")}`);
  }

  if (checks.aggressive.isAggressive) {
    issues.push("Ngôn ngữ hung hăng");
  }

  if (checks.manipulation.isManipulative) {
    issues.push("Hành vi thao túng");
  }

  if (issues.length === 0) {
    return "Nội dung an toàn";
  }

  return `Phát hiện vấn đề: ${issues.join("; ")}`;
}

// ============================================================================
// UNIT TEST HELPERS
// ============================================================================

/**
 * Test a pattern against sample texts
 * @param {RegExp} pattern - Pattern to test
 * @param {string[]} samples - Sample texts
 * @returns {Object} Test results
 */
export function testPattern(pattern, samples) {
  const results = {
    pattern: pattern.source,
    totalTests: samples.length,
    matches: 0,
    details: [],
  };

  for (const sample of samples) {
    const match = pattern.test(sample);
    if (match) {
      results.matches++;
    }
    results.details.push({
      text: sample,
      matched: match,
    });
  }

  return results;
}

/**
 * Run unit tests for all detection patterns
 * @returns {Object} Test results
 */
export function runUnitTests() {
  const testCases = {
    SELF_HARM: {
      positive: [
        "Tôi muốn tự tử",
        "Tôi muốn chết",
        "Tôi không còn ai nữa",
        "Tôi là gánh nặng",
      ],
      negative: ["Tôi muốn đi chơi", "Tôi muốn ăn kẹo", "Tôi muốn ngủ"],
    },
    BULLYING: {
      positive: ["Bạn bắt nạt tôi", "Chúng nó đánh tôi", "Chúng nói xấu tôi"],
      negative: ["Tôi thích chơi với bạn", "Bạn cho tôi mượn bút"],
    },
    ABUSE: {
      positive: ["Bố đánh tôi", "Mẹ đánh tôi", "Người lớn làm hại tôi"],
      negative: ["Bố mẹ yêu thương tôi", "Bố mẹ chăm sóc tôi"],
    },
  };

  const results = {};

  for (const [category, cases] of Object.entries(testCases)) {
    const patterns = DETECTION_PATTERNS[category];
    if (!patterns) continue;

    const categoryResults = {
      patterns: patterns.map((p) => p.source),
      positiveTests: [],
      negativeTests: [],
    };

    // Test positive cases
    for (const text of cases.positive) {
      const detected = patterns.some((p) => p.test(text));
      categoryResults.positiveTests.push({
        text,
        detected,
        expected: true,
        passed: detected === true,
      });
    }

    // Test negative cases
    for (const text of cases.negative) {
      const detected = patterns.some((p) => p.test(text));
      categoryResults.negativeTests.push({
        text,
        detected,
        expected: false,
        passed: detected === false,
      });
    }

    results[category] = categoryResults;
  }

  return results;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  checkUserInput,
  checkAIResponse,
  detectPII,
  detectAggressiveLanguage,
  detectManipulation,
  comprehensiveSafetyCheck,
  testPattern,
  runUnitTests,
};
