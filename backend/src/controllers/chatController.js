/**
 * Chat Controller
 * Handles chat message processing with the new flow:
 * Step 1: Larry sends greeting (based on emotion)
 * Step 2: Larry asks "Bạn có muốn kể cho mình nghe không?"
 * Step 3: User replies
 * Step 4: Gemini is called to respond
 *
 * Privacy: Messages are encrypted (AES-256-GCM) at rest via the Session model.
 * Deletion endpoints allow users to permanently remove their data.
 */

import Session from "../models/Session.js";
import { getGeminiService } from "../services/geminiService.js";
import { getFallbackResponse } from "../utils/fallbackResponses.js";
import {
  safetyMiddleware,
  aiResponseValidator,
  validateUserInput,
} from "../middleware/safety.js";

const geminiService = getGeminiService();

/**
 * Emotion-based greeting messages for the new flow
 */
const GREETING_MESSAGES = {
  happy: "Chào bạn! 👋\nLarry thấy hôm nay bạn có vẻ vui vẻ đấy!",
  sad: "Chào bạn! 👋\nLarry thấy hôm nay bạn có vẻ hơi buồn 😢",
  angry: "Chào bạn! 👋\nLarry thấy bạn có vẻ đang hơi tức giận 😤",
  neutral: "Chào bạn! 👋\nLarry thấy bạn đang khá bình thường 😊",
  surprised: "Chào bạn! 👋\nLarry thấy bạn có vẻ hơi ngạc nhiên 😲",
  fearful: "Chào bạn! 👋\nLarry thấy bạn có vẻ hơi lo lắng 😨",
  disgusted: "Chào bạn! 👋\nLarry thấy bạn có vẻ không thoải mái lắm.",
};

/**
 * Follow-up question after greeting
 */
const FOLLOW_UP_QUESTION =
  "Bạn có muốn kể cho mình nghe điều gì đang xảy ra không? Larry luôn sẵn sàng lắng nghe bạn 💚";

/**
 * Get greeting message based on emotion
 * @param {string} emotion
 * @returns {string} Greeting message
 */
function getGreeting(emotion) {
  return GREETING_MESSAGES[emotion] || GREETING_MESSAGES.neutral;
}

/**
 * Start a new chat session
 * POST /api/chat/session
 * Returns greeting + follow-up question without calling Gemini
 */
const startChatSession = async (req, res) => {
  try {
    const { emotion, method } = req.body;

    if (!emotion) {
      return res.status(400).json({ error: "Thiếu thông tin cảm xúc." });
    }

    // Create session
    const session = Session.create({
      userId: req.user?.id || null,
      emotion,
      method: method || "button",
    });

    // Step 1: Larry sends greeting (no Gemini call)
    const greeting = getGreeting(emotion);

    // Step 2: Add follow-up question
    const fullGreeting = `${greeting}\n\n${FOLLOW_UP_QUESTION}`;

    // Store greeting in session history (encrypted by Session model)
    Session.addMessage(session.sessionId, {
      role: "assistant",
      content: fullGreeting,
      emotion,
    });

    res.status(201).json({
      sessionId: session.sessionId,
      message: fullGreeting,
      emotion,
      step: "greeting",
    });
  } catch (error) {
    console.error("Start chat session error:", error);
    res.status(500).json({ error: "Không thể bắt đầu cuộc trò chuyện" });
  }
};

/**
 * Send a message in an existing chat session
 * POST /api/chat/message
 * Step 3: User replies → Step 4: Gemini responds
 */
const sendMessage = async (req, res) => {
  try {
    // Apply safety middleware
    await new Promise((resolve, reject) => {
      safetyMiddleware(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    const { sessionId, message, emotion } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: "Thiếu sessionId." });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Tin nhắn không được để trống." });
    }

    // Get session (messages are auto-decrypted by Session.get)
    const session = Session.get(sessionId);
    if (!session) {
      return res
        .status(404)
        .json({ error: "Phiên không tồn tại hoặc đã hết hạn." });
    }

    // Validate user input
    const inputValidation = validateUserInput(message, sessionId);
    if (inputValidation.action === "BLOCK") {
      return res.status(400).json({
        error: "Nội dung không phù hợp",
        reason: inputValidation.reason,
        message:
          "Mình không thể trả lời câu hỏi này. Hãy nói với bố mẹ hoặc giáo viên nhé.",
        emotion: session.emotion,
        fallback: true,
      });
    }

    if (inputValidation.action === "ESCALATE") {
      return res.json({
        message: inputValidation.escalationMessage,
        emotion: session.emotion,
        escalation: true,
        level: inputValidation.level,
      });
    }

    // Step 3: Store user message (encrypted by Session.addMessage)
    Session.addMessage(sessionId, {
      role: "user",
      content: message.trim(),
      emotion: emotion || session.emotion,
    });

    // Update emotion if provided
    if (emotion && emotion !== session.emotion) {
      Session.updateEmotion(sessionId, emotion);
    }

    // Build history for Gemini (messages are already decrypted)
    const history = session.messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Step 4: Call Gemini
    const currentEmotion = emotion || session.emotion;
    const isFirstUserMessage =
      history.filter((m) => m.role === "user").length === 1;

    const response = await geminiService.generateResponse(
      currentEmotion,
      history,
      sessionId,
      isFirstUserMessage,
    );

    // Store AI response in session (encrypted by Session.addMessage)
    Session.addMessage(sessionId, {
      role: "assistant",
      content: response.message,
      emotion: currentEmotion,
    });

    // Apply AI response validator
    await new Promise((resolve, reject) => {
      aiResponseValidator(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    res.json({
      ...response,
      sessionId,
      step: "response",
    });
  } catch (error) {
    console.error("Send message error:", error.message);

    const { sessionId, emotion } = req.body;
    const session = sessionId ? Session.get(sessionId) : null;

    // Use fallback on error
    const fallbackResponse = getFallbackResponse(
      emotion || session?.emotion || "neutral",
      session?.messages || [],
      error.message,
    );

    res.json({
      ...fallbackResponse,
      sessionId,
      step: "fallback",
    });
  }
};

/**
 * Get chat history for a session
 * GET /api/chat/history/:sessionId
 */
const getChatHistory = (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = Session.get(sessionId);

    if (!session) {
      return res.status(404).json({ error: "Không tìm thấy phiên" });
    }

    // Only allow if session belongs to user or is anonymous
    if (session.userId && session.userId !== req.user?.id) {
      return res.status(403).json({ error: "Không có quyền truy cập" });
    }

    res.json({
      sessionId: session.sessionId,
      emotion: session.emotion,
      messages: session.messages,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    });
  } catch (error) {
    console.error("Get chat history error:", error);
    res.status(500).json({ error: "Không thể lấy lịch sử trò chuyện" });
  }
};

/**
 * Delete chat history for a specific session
 * DELETE /api/chat/history/:sessionId
 */
const deleteChatHistory = (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = Session.get(sessionId);

    if (!session) {
      return res.status(404).json({ error: "Không tìm thấy phiên" });
    }

    // Only allow if session belongs to user or is anonymous
    if (session.userId && session.userId !== req.user?.id) {
      return res.status(403).json({ error: "Không có quyền xóa" });
    }

    Session.delete(sessionId);
    res.json({ message: "Đã xóa lịch sử trò chuyện thành công" });
  } catch (error) {
    console.error("Delete chat history error:", error);
    res.status(500).json({ error: "Không thể xóa lịch sử" });
  }
};

/**
 * Delete ALL chat history for the current user
 * DELETE /api/chat/history
 * Permanently removes all sessions belonging to the authenticated user.
 * For anonymous users, deletes the specified session.
 */
const deleteAllChatHistory = (req, res) => {
  try {
    if (req.user?.id) {
      // Authenticated user: delete all their sessions
      const userSessions = Session.getByUser(req.user.id);
      let deletedCount = 0;

      for (const session of userSessions) {
        if (Session.delete(session.sessionId)) {
          deletedCount++;
        }
      }

      res.json({
        message: `Đã xóa ${deletedCount} phiên lịch sử trò chuyện`,
        deletedCount,
      });
    } else {
      // Anonymous user: require sessionId
      const { sessionId } = req.body;
      if (!sessionId) {
        return res.status(400).json({
          error: "Vui lòng cung cấp sessionId để xóa",
        });
      }

      const session = Session.get(sessionId);
      if (!session) {
        return res.status(404).json({ error: "Không tìm thấy phiên" });
      }

      Session.delete(sessionId);
      res.json({
        message: "Đã xóa lịch sử trò chuyện thành công",
        deletedCount: 1,
      });
    }
  } catch (error) {
    console.error("Delete all chat history error:", error);
    res.status(500).json({ error: "Không thể xóa lịch sử" });
  }
};

export {
  startChatSession,
  sendMessage,
  getChatHistory,
  deleteChatHistory,
  deleteAllChatHistory,
};
