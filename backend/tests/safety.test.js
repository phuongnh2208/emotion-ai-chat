/**
 * Safety System Unit Tests
 * Tests for safety checks, keyword detection, and content filtering
 */

import {
  checkUserInput,
  checkAIResponse,
  detectPII,
  detectAggressiveLanguage,
  detectManipulation,
  comprehensiveSafetyCheck,
} from "../src/utils/safetyChecks.js";
import {
  detectWarningKeywords,
  getSafetyLevel,
} from "../src/config/aiSafetyRules.js";
import { SAFETY_LEVELS } from "../src/config/constants.js";
import { PII_PATTERNS } from "../src/config/patterns.js";
import { ESCALATION_PROTOCOL } from "../src/config/conversationPolicy.js";

// ============================================================================
// TEST UTILITIES
// ============================================================================

/**
 * Simple test runner
 */
class TestRunner {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
  }

  test(name, fn) {
    this.tests.push({ name, fn });
  }

  assert(condition, message) {
    if (!condition) {
      throw new Error(message || "Assertion failed");
    }
  }

  assertEqual(actual, expected, message) {
    if (actual !== expected) {
      throw new Error(message || `Expected ${expected}, got ${actual}`);
    }
  }

  assertIncludes(array, item, message) {
    if (!array.includes(item)) {
      throw new Error(message || `Expected array to include ${item}`);
    }
  }

  run() {
    console.log("\n🧪 Running Safety Tests...\n");
    console.log("=".repeat(60));

    for (const { name, fn } of this.tests) {
      try {
        fn();
        this.passed++;
        console.log(`✅ PASS: ${name}`);
      } catch (error) {
        this.failed++;
        console.log(`❌ FAIL: ${name}`);
        console.log(`   Error: ${error.message}`);
      }
    }

    console.log("=".repeat(60));
    console.log(`\n📊 Results: ${this.passed} passed, ${this.failed} failed\n`);

    return this.failed === 0;
  }
}

const runner = new TestRunner();

// ============================================================================
// KEYWORD DETECTION TESTS
// ============================================================================

runner.test("detectWarningKeywords - should detect self-harm keywords", () => {
  const result = detectWarningKeywords("Tôi muốn tự tử");
  runner.assert(result.hasWarning === true, "Should detect warning");
  runner.assertIncludes(
    result.categories,
    "SELF_HARM",
    "Should include SELF_HARM",
  );
});

runner.test("detectWarningKeywords - should detect bullying keywords", () => {
  const result = detectWarningKeywords("Bạn bắt nạt tôi");
  runner.assert(result.hasWarning === true, "Should detect warning");
  runner.assertIncludes(
    result.categories,
    "BULLYING",
    "Should include BULLYING",
  );
});

runner.test("detectWarningKeywords - should detect abuse keywords", () => {
  const result = detectWarningKeywords("Bố đánh tôi");
  runner.assert(result.hasWarning === true, "Should detect warning");
  runner.assertIncludes(result.categories, "ABUSE", "Should include ABUSE");
});

runner.test("detectWarningKeywords - should detect substance keywords", () => {
  const result = detectWarningKeywords("Tôi dùng ma túy");
  runner.assert(result.hasWarning === true, "Should detect warning");
  runner.assertIncludes(
    result.categories,
    "SUBSTANCE",
    "Should include SUBSTANCE",
  );
});

runner.test("detectWarningKeywords - should detect violence keywords", () => {
  const result = detectWarningKeywords("Tôi có súng");
  runner.assert(result.hasWarning === true, "Should detect warning");
  runner.assertIncludes(
    result.categories,
    "VIOLENCE",
    "Should include VIOLENCE",
  );
});

runner.test(
  "detectWarningKeywords - should detect online safety keywords",
  () => {
    const result = detectWarningKeywords("Tôi gặp người lạ");
    runner.assert(result.hasWarning === true, "Should detect warning");
    runner.assertIncludes(
      result.categories,
      "ONLINE_SAFETY",
      "Should include ONLINE_SAFETY",
    );
  },
);

runner.test(
  "detectWarningKeywords - should return safe for normal text",
  () => {
    const result = detectWarningKeywords("Hôm nay tôi đi chơi công viên");
    runner.assert(result.hasWarning === false, "Should not detect warning");
    runner.assertEqual(
      result.categories.length,
      0,
      "Should have no categories",
    );
  },
);

// ============================================================================
// SAFETY LEVEL TESTS
// ============================================================================

runner.test("getSafetyLevel - should return CRITICAL for self-harm", () => {
  const level = getSafetyLevel(["SELF_HARM"]);
  runner.assertEqual(level, SAFETY_LEVELS.CRITICAL, "Should be CRITICAL");
});

runner.test("getSafetyLevel - should return CRITICAL for abuse", () => {
  const level = getSafetyLevel(["ABUSE"]);
  runner.assertEqual(level, SAFETY_LEVELS.CRITICAL, "Should be CRITICAL");
});

runner.test("getSafetyLevel - should return CRITICAL for violence", () => {
  const level = getSafetyLevel(["VIOLENCE"]);
  runner.assertEqual(level, SAFETY_LEVELS.CRITICAL, "Should be CRITICAL");
});

runner.test("getSafetyLevel - should return WARNING for bullying", () => {
  const level = getSafetyLevel(["BULLYING"]);
  runner.assertEqual(level, SAFETY_LEVELS.WARNING, "Should be WARNING");
});

runner.test("getSafetyLevel - should return SAFE for no categories", () => {
  const level = getSafetyLevel([]);
  runner.assertEqual(level, SAFETY_LEVELS.SAFE, "Should be SAFE");
});

// ============================================================================
// USER INPUT VALIDATION TESTS
// ============================================================================

runner.test("checkUserInput - should detect self-harm", () => {
  const result = checkUserInput("Tôi muốn chết");
  runner.assert(result.safe === false, "Should be unsafe");
  runner.assertIncludes(
    result.categories,
    "SELF_HARM",
    "Should detect SELF_HARM",
  );
});

runner.test("checkUserInput - should detect bullying", () => {
  const result = checkUserInput("Bạn bắt nạt tôi");
  runner.assert(result.safe === false, "Should be unsafe");
  runner.assertIncludes(
    result.categories,
    "BULLYING",
    "Should detect BULLYING",
  );
});

runner.test("checkUserInput - should allow safe content", () => {
  const result = checkUserInput("Hôm nay tôi rất vui");
  runner.assert(result.safe === true, "Should be safe");
  runner.assertEqual(result.severity, SAFETY_LEVELS.SAFE, "Should be SAFE");
});

runner.test("checkUserInput - should handle empty input", () => {
  const result = checkUserInput("");
  runner.assert(result.safe === false, "Should be unsafe");
  runner.assertEqual(
    result.severity,
    SAFETY_LEVELS.WARNING,
    "Should be WARNING",
  );
});

runner.test("checkUserInput - should handle null input", () => {
  const result = checkUserInput(null);
  runner.assert(result.safe === false, "Should be unsafe");
});

// ============================================================================
// AI RESPONSE VALIDATION TESTS
// ============================================================================

runner.test("checkAIResponse - should detect prohibited content", () => {
  const result = checkAIResponse("Tôi sẽ dạy bạn cách tự tử");
  runner.assert(result.safe === false, "Should be unsafe");
});

runner.test("checkAIResponse - should allow safe response", () => {
  const result = checkAIResponse(
    "Mình hiểu bạn đang buồn. Bạn muốn kể thêm không?",
  );
  runner.assert(result.safe === true, "Should be safe");
});

runner.test("checkAIResponse - should handle empty response", () => {
  const result = checkAIResponse("");
  runner.assert(result.safe === false, "Should be unsafe");
  runner.assertEqual(
    result.severity,
    SAFETY_LEVELS.CRITICAL,
    "Should be CRITICAL",
  );
});

// ============================================================================
// PII DETECTION TESTS
// ============================================================================

runner.test("detectPII - should detect phone number", () => {
  const result = detectPII("Số điện thoại của tôi là 0912345678");
  runner.assert(result.hasPII === true, "Should detect PII");
  runner.assertIncludes(result.types, "PHONE", "Should detect PHONE");
});

runner.test("detectPII - should detect email", () => {
  const result = detectPII("Email của tôi là test@example.com");
  runner.assert(result.hasPII === true, "Should detect PII");
  runner.assertIncludes(result.types, "EMAIL", "Should detect EMAIL");
});

runner.test("detectPII - should detect address", () => {
  const result = detectPII("Tôi sống tại địa chỉ 123 đường ABC");
  runner.assert(result.hasPII === true, "Should detect PII");
  runner.assertIncludes(result.types, "ADDRESS", "Should detect ADDRESS");
});

runner.test("detectPII - should detect school", () => {
  const result = detectPII("Tôi học trường THCS ABC");
  runner.assert(result.hasPII === true, "Should detect PII");
  runner.assertIncludes(result.types, "SCHOOL", "Should detect SCHOOL");
});

runner.test("detectPII - should not detect PII in safe text", () => {
  const result = detectPII("Hôm nay tôi đi chơi công viên");
  runner.assert(result.hasPII === false, "Should not detect PII");
});

// ============================================================================
// AGGRESSIVE LANGUAGE DETECTION TESTS
// ============================================================================

runner.test(
  "detectAggressiveLanguage - should detect aggressive language",
  () => {
    const result = detectAggressiveLanguage("Mày ngu thật sự");
    runner.assert(result.isAggressive === true, "Should be aggressive");
    runner.assert(result.score >= 20, "Should have score >= 20");
  },
);

runner.test("detectAggressiveLanguage - should not flag normal text", () => {
  const result = detectAggressiveLanguage("Tôi không thích điều này");
  runner.assert(result.isAggressive === false, "Should not be aggressive");
});

runner.test("detectAggressiveLanguage - should score high for threats", () => {
  const result = detectAggressiveLanguage("Tôi sẽ giết bạn");
  runner.assert(result.isAggressive === true, "Should be aggressive");
  runner.assert(result.score >= 20, "Should have high score");
});

// ============================================================================
// MANIPULATION DETECTION TESTS
// ============================================================================

runner.test("detectManipulation - should detect manipulation", () => {
  const result = detectManipulation("Đừng nói với bố mẹ");
  runner.assert(result.isManipulative === true, "Should be manipulative");
  runner.assert(result.score >= 15, "Should have high score");
});

runner.test("detectManipulation - should detect secret keeping", () => {
  const result = detectManipulation("Đây là bí mật, không được nói");
  runner.assert(result.isManipulative === true, "Should be manipulative");
});

runner.test("detectManipulation - should not flag normal text", () => {
  const result = detectManipulation("Hôm nay tôi rất vui");
  runner.assert(result.isManipulative === false, "Should not be manipulative");
});

// ============================================================================
// COMPREHENSIVE SAFETY CHECK TESTS
// ============================================================================

runner.test("comprehensiveSafetyCheck - should detect critical content", () => {
  const result = comprehensiveSafetyCheck("Tôi muốn tự tử", "user");
  runner.assert(result.safe === false, "Should be unsafe");
  runner.assertEqual(
    result.overallSeverity,
    SAFETY_LEVELS.CRITICAL,
    "Should be CRITICAL",
  );
  runner.assertEqual(result.recommendation, "BLOCK", "Should recommend BLOCK");
});

runner.test("comprehensiveSafetyCheck - should detect warning content", () => {
  const result = comprehensiveSafetyCheck("Bạn bắt nạt tôi", "user");
  runner.assert(result.safe === false, "Should be unsafe");
  runner.assertEqual(
    result.overallSeverity,
    SAFETY_LEVELS.WARNING,
    "Should be WARNING",
  );
});

runner.test("comprehensiveSafetyCheck - should allow safe content", () => {
  const result = comprehensiveSafetyCheck("Hôm nay tôi rất vui", "user");
  runner.assert(result.safe === true, "Should be safe");
  runner.assertEqual(
    result.overallSeverity,
    SAFETY_LEVELS.SAFE,
    "Should be SAFE",
  );
  runner.assertEqual(result.recommendation, "ALLOW", "Should recommend ALLOW");
});

runner.test("comprehensiveSafetyCheck - should detect PII", () => {
  const result = comprehensiveSafetyCheck("Số điện thoại: 0912345678", "user");
  runner.assert(result.safe === false, "Should be unsafe");
  runner.assertIncludes(
    result.checks.pii.types,
    "PHONE",
    "Should detect PHONE",
  );
});

// ============================================================================
// ESCALATION PROTOCOL TESTS
// ============================================================================

runner.test("ESCALATION_PROTOCOL - should escalate self-harm", () => {
  const result = ESCALATION_PROTOCOL.checkEscalation("Tôi muốn tự tử");
  runner.assert(
    result.requiresEscalation === true,
    "Should require escalation",
  );
  runner.assertEqual(
    result.level,
    "escalate_immediately",
    "Should be immediate",
  );
});

runner.test("ESCALATION_PROTOCOL - should escalate abuse", () => {
  const result = ESCALATION_PROTOCOL.checkEscalation("Bố đánh tôi");
  runner.assert(
    result.requiresEscalation === true,
    "Should require escalation",
  );
});

runner.test("ESCALATION_PROTOCOL - should not escalate normal text", () => {
  const result = ESCALATION_PROTOCOL.checkEscalation("Hôm nay tôi vui");
  runner.assert(
    result.requiresEscalation === false,
    "Should not require escalation",
  );
});

runner.test("ESCALATION_PROTOCOL - should provide support for bullying", () => {
  const result = ESCALATION_PROTOCOL.checkEscalation("Bạn bắt nạt tôi");
  runner.assert(
    result.requiresEscalation === true,
    "Should require escalation",
  );
  runner.assertEqual(result.level, "support", "Should provide support");
});

// ============================================================================
// EDGE CASE TESTS
// ============================================================================

runner.test("checkUserInput - should handle very long input", () => {
  const longText = "a".repeat(600);
  const result = checkUserInput(longText);
  runner.assert(result.safe === true, "Should handle long text");
});

runner.test("checkUserInput - should handle special characters", () => {
  const result = checkUserInput("Tôi buồn! @#$%^&*()");
  runner.assert(result.safe === true, "Should handle special characters");
});

runner.test("detectPII - should handle empty string", () => {
  const result = detectPII("");
  runner.assert(result.hasPII === false, "Should not detect PII");
  runner.assertEqual(result.types.length, 0, "Should have no types");
});

runner.test("comprehensiveSafetyCheck - should handle null", () => {
  const result = comprehensiveSafetyCheck(null, "user");
  runner.assert(result.safe === false, "Should be unsafe");
});

// ============================================================================
// RUN ALL TESTS
// ============================================================================

const success = runner.run();

// Exit with appropriate code
if (typeof process !== "undefined") {
  process.exit(success ? 0 : 1);
}
