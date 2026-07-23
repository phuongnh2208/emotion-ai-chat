/**
 * Conversation Policy Configuration
 * Defines behavior rules for different conversation phases
 * Designed for safe AI interactions with children (ages 6-15)
 */

// ============================================================================
// CONVERSATION PHASES
// ============================================================================

export const CONVERSATION_PHASES = {
  GREETING: "greeting", // Initial greeting, first interaction
  LISTENING: "listening", // User is sharing, AI should listen
  SUPPORTING: "supporting", // User needs support, AI provides comfort
  CLOSING: "closing", // Conversation is ending
};

// ============================================================================
// PHASE DEFINITIONS
// ============================================================================

export const PHASE_DEFINITIONS = {
  [CONVERSATION_PHASES.GREETING]: {
    name: "Chào hỏi",
    description: "Giai đoạn đầu tiên, AI chào hỏi và tạo không gian an toàn",
    maxMessages: 2, // Max AI messages in this phase
    actions: [
      "Chào hỏi ấm áp, thân thiện",
      "Nhận xét nhẹ về cảm xúc camera (nếu có)",
      "Hỏi một câu mở để học sinh chia sẻ",
      "Tạo cảm giác an toàn, tin tưởng",
    ],
    avoid: [
      "Đưa ra lời khuyên ngay lập tức",
      "Kết thúc cuộc trò chuyện sớm",
      "Yêu cầu thông tin cá nhân",
      "Phán xét cảm xúc của học sinh",
    ],
    transitions: {
      next: CONVERSATION_PHASES.LISTENING,
      trigger: "Học sinh trả lời tin nhắn chào hỏi",
    },
  },

  [CONVERSATION_PHASES.LISTENING]: {
    name: "Lắng nghe",
    description: "Giai đoạn học sinh chia sẻ, AI lắng nghe và thấu hiểu",
    maxMessages: 10, // Max AI messages in this phase
    actions: [
      "Lắng nghe tích cực, thể hiện sự quan tâm",
      "Thấu hiểu và an ủi",
      "Đặt câu hỏi mở để khuyến khích chia sẻ thêm",
      "Thu thập đủ thông tin trước khi đưa ra lời khuyên",
      "Xác nhận cảm xúc của học sinh",
    ],
    avoid: [
      "Ngắt lời học sinh",
      "Phán xét hoặc chỉ trích",
      "Đưa ra lời khuyên quá sớm",
      "Chuyển chủ đề đột ngột",
      "Kết thúc cuộc trò chuyện quá sớm",
    ],
    transitions: {
      next: CONVERSATION_PHASES.SUPPORTING,
      trigger: "Phát hiện vấn đề cần hỗ trợ hoặc học sinh yêu cầu lời khuyên",
    },
  },

  [CONVERSATION_PHASES.SUPPORTING]: {
    name: "Hỗ trợ",
    description: "Giai đoạn AI cung cấp sự hỗ trợ, lời khuyên phù hợp",
    maxMessages: 8, // Max AI messages in this phase
    actions: [
      "Đưa ra lời khuyên phù hợp lứa tuổi",
      "Gợi ý hoạt động thư giãn (nếu phù hợp)",
      "Khuyến khích nói với người lớn đáng tin",
      "Đề xuất giải pháp an toàn, lành mạnh",
      "Kiểm tra xem học sinh đã hiểu chưa",
    ],
    avoid: [
      "Đưa ra lời khuyên y tế chuyên sâu",
      "Đưa ra lời khuyên tài chính, pháp lý",
      "Giải quyết vấn đề nghiêm trọng một mình",
      "Đảm bảo vấn đề đã được giải quyết hoàn toàn",
    ],
    transitions: {
      next: CONVERSATION_PHASES.CLOSING,
      trigger: "Vấn đề đã được giải quyết hoặc học sinh muốn kết thúc",
    },
  },

  [CONVERSATION_PHASES.CLOSING]: {
    name: "Kết thúc",
    description: "Giai đoạn kết thúc cuộc trò chuyện một cách tích cực",
    maxMessages: 3, // Max AI messages in this phase
    actions: [
      "Tóm tắt những điểm tích cực",
      "Khuyến khích và động viên",
      "Nhắc nhở có thể quay lại bất cứ lúc nào",
      "Gợi ý hoạt động thư giãn (nếu phù hợp)",
    ],
    avoid: [
      "Kết thúc đột ngột",
      "Để lại cảm giác lo lắng",
      "Hứa hẹn không thể thực hiện",
    ],
    transitions: {
      next: null, // End of conversation
      trigger: "Học sinh nói tạm biệt hoặc không còn gì để chia sẻ",
    },
  },
};

// ============================================================================
// ESCALATION PROTOCOL
// ============================================================================

export const ESCALATION_PROTOCOL = {
  // Conditions that require immediate escalation
  CRITICAL_CONDITIONS: {
    SELF_HARM: {
      keywords: ["tự tử", "tự sát", "chết", "muốn chết", "tự gây thương"],
      action: "ESCALATE_IMMEDIATELY",
      message:
        "Mình rất lo lắng cho bạn. Bạn không đơn độc đâu. Hãy nói với bố mẹ hoặc giáo viên NGAY, hoặc gọi đường dây nóng 111.",
    },
    ABUSE: {
      keywords: ["bố đánh", "mẹ đánh", "hiếp dâm", "lạm dụng", "xâm hại"],
      action: "ESCALATE_IMMEDIATELY",
      message:
        "Bạn không phải là người có lỗi. Hãy nói với người lớn đáng tin cậy NGAY. Bạn có thể gọi 111 để được bảo vệ.",
    },
    VIOLENCE: {
      keywords: ["giết người", "đâm", "chém", "súng", "vũ khí"],
      action: "ESCALATE_IMMEDIATELY",
      message: "Điều này rất nguy hiểm. Hãy nói với bố mẹ hoặc giáo viên NGAY.",
    },
  },

  // Conditions that need attention but not immediate escalation
  WARNING_CONDITIONS: {
    BULLYING: {
      keywords: ["bắt nạt", "đánh đập", "chửi bới", "nói xấu"],
      action: "PROVIDE_SUPPORT",
      message:
        "Bạn không đáng bị đối xử như vậy. Hãy nói với bố mẹ hoặc giáo viên để được giúp đỡ.",
    },
    SUBSTANCE: {
      keywords: ["ma túy", "rượu", "bia", "thuốc lá"],
      action: "PROVIDE_SUPPORT",
      message: "Những thứ đó rất nguy hiểm. Hãy nói với bố mẹ hoặc giáo viên.",
    },
  },

  // Escalation levels
  LEVELS: {
    NONE: "none", // No escalation needed
    SUPPORT: "support", // Provide additional support
    ESCALATE_IMMEDIATELY: "escalate_immediately", // Must escalate to human
    ESCALATE_URGENT: "escalate_urgent", // Urgent escalation required
  },

  /**
   * Check if content requires escalation
   * @param {string} text - User input text
   * @returns {Object} { requiresEscalation: boolean, level: string, condition: string, message: string }
   */
  checkEscalation(text) {
    const lowerText = text.toLowerCase();

    // Check critical conditions first
    for (const [condition, config] of Object.entries(
      this.CRITICAL_CONDITIONS,
    )) {
      const hasKeyword = config.keywords.some((keyword) =>
        lowerText.includes(keyword),
      );
      if (hasKeyword) {
        return {
          requiresEscalation: true,
          level: this.LEVELS.ESCALATE_IMMEDIATELY,
          condition,
          message: config.message,
          action: config.action,
        };
      }
    }

    // Check warning conditions
    for (const [condition, config] of Object.entries(this.WARNING_CONDITIONS)) {
      const hasKeyword = config.keywords.some((keyword) =>
        lowerText.includes(keyword),
      );
      if (hasKeyword) {
        return {
          requiresEscalation: true,
          level: this.LEVELS.SUPPORT,
          condition,
          message: config.message,
          action: config.action,
        };
      }
    }

    return {
      requiresEscalation: false,
      level: this.LEVELS.NONE,
      condition: null,
      message: null,
      action: null,
    };
  },
};

// ============================================================================
// CONVERSATION STATE MANAGEMENT
// ============================================================================

export class ConversationStateManager {
  constructor() {
    this.state = {
      currentPhase: CONVERSATION_PHASES.GREETING,
      messageCount: 0,
      phaseMessageCount: 0,
      detectedEmotion: null,
      detectedIssues: [],
      escalationTriggered: false,
      startedAt: new Date(),
      lastActivity: new Date(),
    };
  }

  /**
   * Get current phase
   * @returns {string} Current phase
   */
  getCurrentPhase() {
    return this.state.currentPhase;
  }

  /**
   * Increment message count and check phase transition
   * @param {string} userMessage - User's message
   * @returns {Object} { phaseChanged: boolean, newPhase: string, escalation: Object }
   */
  processMessage(userMessage) {
    this.state.messageCount++;
    this.state.phaseMessageCount++;
    this.state.lastActivity = new Date();

    // Check for escalation
    const escalation = ESCALATION_PROTOCOL.checkEscalation(userMessage);
    if (escalation.requiresEscalation) {
      this.state.escalationTriggered = true;
      this.state.detectedIssues.push({
        condition: escalation.condition,
        timestamp: new Date(),
      });
      return {
        phaseChanged: false,
        newPhase: this.state.currentPhase,
        escalation,
      };
    }

    // Check phase transition
    const currentPhaseDef = PHASE_DEFINITIONS[this.state.currentPhase];
    const shouldTransition = this.shouldTransitionPhase(
      userMessage,
      currentPhaseDef,
    );

    if (shouldTransition && currentPhaseDef.transitions.next) {
      this.state.currentPhase = currentPhaseDef.transitions.next;
      this.state.phaseMessageCount = 0;
      return {
        phaseChanged: true,
        newPhase: this.state.currentPhase,
        escalation: null,
      };
    }

    return {
      phaseChanged: false,
      newPhase: this.state.currentPhase,
      escalation: null,
    };
  }

  /**
   * Determine if should transition to next phase
   * @param {string} userMessage - User's message
   * @param {Object} currentPhaseDef - Current phase definition
   * @returns {boolean} Should transition
   */
  shouldTransitionPhase(userMessage, currentPhaseDef) {
    const lowerMessage = userMessage.toLowerCase();

    // Check if user wants to end conversation
    const closingKeywords = [
      "tạm biệt",
      "bye",
      "cảm ơn",
      "đủ rồi",
      "không còn gì",
    ];
    const wantsToClose = closingKeywords.some((keyword) =>
      lowerMessage.includes(keyword),
    );

    if (wantsToClose && this.state.messageCount > 3) {
      return true;
    }

    // Check if max messages reached
    if (this.state.phaseMessageCount >= currentPhaseDef.maxMessages) {
      return true;
    }

    // Phase-specific transition logic
    if (this.state.currentPhase === CONVERSATION_PHASES.GREETING) {
      // Transition from greeting after user responds
      return this.state.phaseMessageCount >= 1;
    }

    if (this.state.currentPhase === CONVERSATION_PHASES.LISTENING) {
      // Transition to supporting if user explicitly asks for help
      const helpKeywords = [
        "giúp tôi",
        "phải làm sao",
        "bị làm sao",
        "không biết",
      ];
      const needsHelp = helpKeywords.some((keyword) =>
        lowerMessage.includes(keyword),
      );
      return needsHelp && this.state.phaseMessageCount >= 3;
    }

    return false;
  }

  /**
   * Get phase-specific guidance
   * @returns {Object} Phase guidance
   */
  getPhaseGuidance() {
    const phaseDef = PHASE_DEFINITIONS[this.state.currentPhase];
    return {
      phase: this.state.currentPhase,
      phaseName: phaseDef.name,
      actions: phaseDef.actions,
      avoid: phaseDef.avoid,
      maxMessages: phaseDef.maxMessages,
      currentCount: this.state.phaseMessageCount,
    };
  }

  /**
   * Get conversation statistics
   * @returns {Object} Statistics
   */
  getStatistics() {
    return {
      totalMessages: this.state.messageCount,
      currentPhase: this.state.currentPhase,
      phaseMessageCount: this.state.phaseMessageCount,
      duration: Date.now() - this.state.startedAt.getTime(),
      escalationTriggered: this.state.escalationTriggered,
      detectedIssues: this.state.detectedIssues,
    };
  }

  /**
   * Reset state for new conversation
   */
  reset() {
    this.state = {
      currentPhase: CONVERSATION_PHASES.GREETING,
      messageCount: 0,
      phaseMessageCount: 0,
      detectedEmotion: null,
      detectedIssues: [],
      escalationTriggered: false,
      startedAt: new Date(),
      lastActivity: new Date(),
    };
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get phase by message count
 * @param {number} messageCount - Total message count
 * @param {boolean} hasEscalation - Whether escalation was triggered
 * @returns {string} Phase
 */
export function getPhaseByMessageCount(messageCount, hasEscalation = false) {
  if (hasEscalation) {
    return CONVERSATION_PHASES.SUPPORTING;
  }

  if (messageCount === 0) {
    return CONVERSATION_PHASES.GREETING;
  }

  if (messageCount < 5) {
    return CONVERSATION_PHASES.LISTENING;
  }

  if (messageCount < 12) {
    return CONVERSATION_PHASES.SUPPORTING;
  }

  return CONVERSATION_PHASES.CLOSING;
}

/**
 * Check if conversation should end
 * @param {number} messageCount - Total message count
 * @param {string} lastMessage - Last user message
 * @returns {boolean} Should end
 */
export function shouldEndConversation(messageCount, lastMessage) {
  const lowerMessage = lastMessage.toLowerCase();
  const closingKeywords = [
    "tạm biệt",
    "bye",
    "cảm ơn",
    "đủ rồi",
    "không còn gì",
    "hẹn gặp lại",
  ];

  const wantsToClose = closingKeywords.some((keyword) =>
    lowerMessage.includes(keyword),
  );

  // End if user says goodbye after at least 3 messages
  if (wantsToClose && messageCount >= 3) {
    return true;
  }

  // End if too many messages (prevent infinite conversations)
  if (messageCount >= 20) {
    return true;
  }

  return false;
}
