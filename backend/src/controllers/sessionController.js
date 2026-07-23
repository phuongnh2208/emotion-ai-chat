/**
 * Session Controller
 * Handles session creation, retrieval, and deletion
 */

import Session from "../models/Session.js";

/**
 * Create a new session
 * POST /api/session/create
 */
const createSession = (req, res) => {
  try {
    const { sessionId, emotion, method } = req.body;

    const session = Session.create({
      sessionId,
      userId: req.user?.id || null,
      emotion: emotion || "neutral",
      method: method || "button",
    });

    res.status(201).json({
      session: {
        sessionId: session.sessionId,
        emotion: session.emotion,
        method: session.method,
        isAnonymous: session.isAnonymous,
        createdAt: session.createdAt,
      },
    });
  } catch (error) {
    console.error("Create session error:", error);
    res.status(500).json({ error: "Không thể tạo phiên mới" });
  }
};

/**
 * Get session by ID
 * GET /api/session/:id
 */
const getSession = (req, res) => {
  try {
    const { id } = req.params;
    const session = Session.get(id);

    if (!session) {
      return res.status(404).json({ error: "Không tìm thấy phiên" });
    }

    // Only allow access if session belongs to user or is anonymous
    if (session.userId && session.userId !== req.user?.id) {
      return res.status(403).json({ error: "Không có quyền truy cập" });
    }

    res.json({ session });
  } catch (error) {
    console.error("Get session error:", error);
    res.status(500).json({ error: "Không thể lấy thông tin phiên" });
  }
};

/**
 * Delete session
 * DELETE /api/session/:id
 */
const deleteSession = (req, res) => {
  try {
    const { id } = req.params;
    const session = Session.get(id);

    if (!session) {
      return res.status(404).json({ error: "Không tìm thấy phiên" });
    }

    // Only allow deletion if session belongs to user or is anonymous
    if (session.userId && session.userId !== req.user?.id) {
      return res.status(403).json({ error: "Không có quyền xóa" });
    }

    Session.delete(id);
    res.json({ message: "Đã xóa phiên thành công" });
  } catch (error) {
    console.error("Delete session error:", error);
    res.status(500).json({ error: "Không thể xóa phiên" });
  }
};

/**
 * Get all sessions for current user
 * GET /api/session/user
 */
const getUserSessions = (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "Cần đăng nhập" });
    }

    const userSessions = Session.getByUser(req.user.id);
    res.json({ sessions: userSessions });
  } catch (error) {
    console.error("Get user sessions error:", error);
    res.status(500).json({ error: "Không thể lấy danh sách phiên" });
  }
};

export { createSession, getSession, deleteSession, getUserSessions };
