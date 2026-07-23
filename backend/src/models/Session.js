/**
 * Session Model
 * Manages chat sessions for both anonymous and authenticated users
 * Anonymous sessions auto-cleanup after 24 hours
 *
 * Privacy: Message content is encrypted (AES-256-GCM) before storage
 * using the encryption utility. Messages are decrypted on retrieval.
 */

import { encryptMessage, decryptMessage } from "../utils/encryption.js";

// Simple ID generator (no external dependency needed)
function generateId() {
  return (
    "sess_" + Date.now() + "_" + Math.random().toString(36).substring(2, 10)
  );
}

// In-memory session store (replace with database in production)
const sessions = new Map();

const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

class Session {
  /**
   * Create a new session
   * @param {Object} options
   * @param {string} [options.sessionId] - Optional session ID (generated if not provided)
   * @param {string} [options.userId] - User ID if authenticated
   * @param {string} options.emotion - Detected emotion
   * @param {string} [options.method] - Input method: 'camera', 'text', 'button'
   * @returns {Object} Session object
   */
  static create({ sessionId, userId, emotion, method = "button" }) {
    const id = sessionId || generateId();
    const now = new Date().toISOString();

    const session = {
      sessionId: id,
      userId: userId || null,
      emotion: emotion || "neutral",
      method,
      messages: [],
      createdAt: now,
      updatedAt: now,
      isAnonymous: !userId,
    };

    sessions.set(id, session);
    return session;
  }

  /**
   * Get session by ID
   * Returns messages with decrypted content
   * @param {string} sessionId
   * @returns {Object|null} Session or null
   */
  static get(sessionId) {
    const session = sessions.get(sessionId);
    if (!session) return null;

    // Check TTL for anonymous sessions
    if (session.isAnonymous) {
      const age = Date.now() - new Date(session.createdAt).getTime();
      if (age > SESSION_TTL_MS) {
        sessions.delete(sessionId);
        return null;
      }
    }

    // Return a copy with decrypted messages
    const decryptedSession = { ...session };
    decryptedSession.messages = session.messages.map((msg) => ({
      ...msg,
      content: decryptMessage(msg.content) || msg.content,
    }));

    return decryptedSession;
  }

  /**
   * Get raw session (with encrypted messages) — for internal use
   * @param {string} sessionId
   * @returns {Object|null} Raw session or null
   */
  static getRaw(sessionId) {
    return sessions.get(sessionId) || null;
  }

  /**
   * Add message to session
   * Encrypts message content before storage
   * @param {string} sessionId
   * @param {Object} message - { role: 'user'|'assistant', content: string, emotion?: string }
   * @returns {Object|null} Updated session or null
   */
  static addMessage(sessionId, message) {
    const session = sessions.get(sessionId);
    if (!session) return null;

    // Encrypt the message content before storing
    const encryptedContent = encryptMessage(message.content);

    session.messages.push({
      ...message,
      content: encryptedContent,
      timestamp: new Date().toISOString(),
    });
    session.updatedAt = new Date().toISOString();

    return session;
  }

  /**
   * Update session emotion
   * @param {string} sessionId
   * @param {string} emotion
   * @returns {Object|null} Updated session or null
   */
  static updateEmotion(sessionId, emotion) {
    const session = sessions.get(sessionId);
    if (!session) return null;

    session.emotion = emotion;
    session.updatedAt = new Date().toISOString();

    return session;
  }

  /**
   * Delete session
   * @param {string} sessionId
   * @returns {boolean} Whether deletion was successful
   */
  static delete(sessionId) {
    return sessions.delete(sessionId);
  }

  /**
   * Get all sessions for a user
   * @param {string} userId
   * @returns {Array} User's sessions
   */
  static getByUser(userId) {
    const userSessions = [];
    for (const session of sessions.values()) {
      if (session.userId === userId) {
        userSessions.push(session);
      }
    }
    return userSessions;
  }

  /**
   * Cleanup expired anonymous sessions
   * @returns {number} Number of cleaned sessions
   */
  static cleanup() {
    const now = Date.now();
    let cleaned = 0;

    for (const [id, session] of sessions.entries()) {
      if (session.isAnonymous) {
        const age = now - new Date(session.createdAt).getTime();
        if (age > SESSION_TTL_MS) {
          sessions.delete(id);
          cleaned++;
        }
      }
    }

    return cleaned;
  }

  /**
   * Get session count
   * @returns {number} Number of active sessions
   */
  static count() {
    return sessions.size;
  }
}

// Run cleanup every hour
setInterval(
  () => {
    const cleaned = Session.cleanup();
    if (cleaned > 0) {
      console.log(`🧹 Cleaned ${cleaned} expired anonymous sessions`);
    }
  },
  60 * 60 * 1000,
);

export default Session;
