/**
 * Session Routes
 * API endpoints for session management
 */

import { Router } from "express";
import jwt from "jsonwebtoken";
import {
  createSession,
  getSession,
  deleteSession,
  getUserSessions,
} from "../controllers/sessionController.js";

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
      // Token invalid but that's okay - user is anonymous
      req.user = null;
    }
  } else {
    req.user = null;
  }

  next();
};

// Apply optional auth to all session routes
router.use(optionalAuth);

// POST /api/session/create - Create new session
router.post("/create", createSession);

// GET /api/session/:id - Get session by ID
router.get("/:id", getSession);

// DELETE /api/session/:id - Delete session
router.delete("/:id", deleteSession);

// GET /api/session/user/all - Get all sessions for current user
router.get("/user/all", getUserSessions);

export default router;
