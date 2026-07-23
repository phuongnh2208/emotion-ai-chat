/**
 * User Model
 * Manages user data with encrypted sensitive fields (email).
 *
 * In the current implementation, users are stored in-memory (in server.js).
 * This model provides a structured interface with encryption for sensitive
 * fields, and can be easily adapted to a database in production.
 */

import { encryptEmail, decryptEmail } from "../utils/encryption.js";

// In-memory user store (replace with database in production)
const users = new Map();

class User {
  /**
   * Create a new user
   * @param {Object} options
   * @param {string} options.username - Username
   * @param {string} options.email - Email (will be encrypted)
   * @param {string} options.passwordHash - Hashed password
   * @returns {Object} User object (without password)
   */
  static create({ username, email, passwordHash }) {
    const id = `user_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    const now = new Date().toISOString();

    const user = {
      id,
      username,
      // Encrypt email before storing
      email: encryptEmail(email),
      passwordHash,
      createdAt: now,
      updatedAt: now,
    };

    users.set(id, user);

    // Return without sensitive fields
    const { passwordHash: _, email: __, ...safeUser } = user;
    return {
      ...safeUser,
      email: email, // Return decrypted email for the response
    };
  }

  /**
   * Get user by ID (returns decrypted email)
   * @param {string} id - User ID
   * @returns {Object|null} User object or null
   */
  static getById(id) {
    const user = users.get(id);
    if (!user) return null;

    return {
      id: user.id,
      username: user.username,
      email: decryptEmail(user.email),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * Get user by email (for login lookup)
   * @param {string} email - Email to search for
   * @returns {Object|null} User object or null
   */
  static getByEmail(email) {
    for (const user of users.values()) {
      if (decryptEmail(user.email) === email) {
        return {
          id: user.id,
          username: user.username,
          email: decryptEmail(user.email),
          passwordHash: user.passwordHash,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };
      }
    }
    return null;
  }

  /**
   * Get user by username
   * @param {string} username - Username to search for
   * @returns {Object|null} User object or null
   */
  static getByUsername(username) {
    for (const user of users.values()) {
      if (user.username === username) {
        return {
          id: user.id,
          username: user.username,
          email: decryptEmail(user.email),
          passwordHash: user.passwordHash,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };
      }
    }
    return null;
  }

  /**
   * Check if email already exists
   * @param {string} email - Email to check
   * @returns {boolean}
   */
  static emailExists(email) {
    for (const user of users.values()) {
      if (decryptEmail(user.email) === email) {
        return true;
      }
    }
    return false;
  }

  /**
   * Check if username already exists
   * @param {string} username - Username to check
   * @returns {boolean}
   */
  static usernameExists(username) {
    return users.has(username);
  }

  /**
   * Delete a user
   * @param {string} id - User ID
   * @returns {boolean} Whether deletion was successful
   */
  static delete(id) {
    return users.delete(id);
  }

  /**
   * Get total user count
   * @returns {number}
   */
  static count() {
    return users.size;
  }
}

export default User;
