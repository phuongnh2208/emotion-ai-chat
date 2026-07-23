/**
 * Chat Routes
 * API endpoints for chat functionality with the new flow
 *
 * Privacy & Data Protection:
 * - DELETE /api/chat/history - Delete ALL chat history (authenticated users)
 * - DELETE /api/chat/history/:sessionId - Delete specific session
 */

import { Router } from "express";
import jwt from "jsonwebtoken";
import {
  startChatSession,
  sendMessage,
  getChatHistory,
  deleteChatHistory,
  deleteAllChatHistory,
} from "../controllers/chatController.js";

const router = Router();

const JWT_SECRET =
  process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";

// Authentication middleware (optional - allows anonymous)
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const bearerToken = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;
  const token = bearerToken || req.cookies?.token;

  if (token) {
    try {
      req.user = jwt.verify(token, JWT_SECRET);
    } catch {
      req.user = null;
    }
  } else {
    req.user = null;
  }

  next();
};

// Apply optional auth to all chat routes
router.use(optionalAuth);

// POST /api/chat/session - Start a new chat session (greeting only, no Gemini)
router.post("/session", startChatSession);

// POST /api/chat/message - Send a message and get AI response
router.post("/message", sendMessage);

// GET /api/chat/history/:sessionId - Get chat history for a session
router.get("/history/:sessionId", getChatHistory);

// DELETE /api/chat/history - Delete ALL chat history (authenticated users)
router.delete("/history", deleteAllChatHistory);

// DELETE /api/chat/history/:sessionId - Delete chat history for a specific session
router.delete("/history/:sessionId", deleteChatHistory);

export default router;
