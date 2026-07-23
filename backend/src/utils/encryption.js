/**
 * Encryption Utility
 * Provides AES-256-GCM encryption/decryption for sensitive data
 * such as chat messages and user emails.
 *
 * Key management: The encryption key is read from the ENCRYPTION_KEY
 * environment variable (a 32-byte hex string). If not set, a warning
 * is logged and a development key is used (never in production).
 */

import crypto from "crypto";

// ============================================================================
// CONFIGURATION
// ============================================================================

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16; // 16 bytes for GCM
const AUTH_TAG_LENGTH = 16; // 16 bytes for GCM auth tag
const KEY_LENGTH = 32; // 32 bytes = 256 bits

// ============================================================================
// KEY MANAGEMENT
// ============================================================================

/**
 * Get the encryption key from environment variable.
 * Falls back to a development key (with warning) if not set.
 * @returns {Buffer} 32-byte encryption key
 */
function getEncryptionKey() {
  const envKey = process.env.ENCRYPTION_KEY;

  if (envKey) {
    // Accept hex string or raw string
    if (/^[0-9a-fA-F]{64}$/.test(envKey)) {
      return Buffer.from(envKey, "hex");
    }
    // Derive a 32-byte key from the string
    return crypto.scryptSync(envKey, "larry-salt", KEY_LENGTH);
  }

  // Development fallback — log a warning
  console.warn(
    "⚠️ ENCRYPTION_KEY not set — using development key. " +
      "Set ENCRYPTION_KEY in production (32-byte hex string).",
  );
  return crypto.scryptSync("larry-dev-key-change-me", "larry-salt", KEY_LENGTH);
}

// Cache the key so we don't recompute on every call
let cachedKey = null;
function getCachedKey() {
  if (!cachedKey) {
    cachedKey = getEncryptionKey();
  }
  return cachedKey;
}

// ============================================================================
// ENCRYPTION / DECRYPTION
// ============================================================================

/**
 * Encrypt a plaintext string using AES-256-GCM.
 * @param {string} plaintext - The text to encrypt
 * @returns {string} Encrypted string in format: iv.ciphertext.authTag (all hex)
 */
export function encrypt(plaintext) {
  if (!plaintext) return "";

  const key = getCachedKey();
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipherGCM(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.getAuthTag(),
  ]);

  // Format: iv (hex) + "." + ciphertext+authtag (hex)
  return `${iv.toString("hex")}.${encrypted.toString("hex")}`;
}

/**
 * Decrypt an encrypted string produced by encrypt().
 * @param {string} encryptedText - The encrypted string (iv.ciphertext.authTag)
 * @returns {string} Decrypted plaintext, or empty string on failure
 */
export function decrypt(encryptedText) {
  if (!encryptedText) return "";

  try {
    const key = getCachedKey();
    const [ivHex, dataHex] = encryptedText.split(".");

    if (!ivHex || !dataHex) {
      console.error("Invalid encrypted data format");
      return "";
    }

    const iv = Buffer.from(ivHex, "hex");
    const data = Buffer.from(dataHex, "hex");

    // Split ciphertext and auth tag
    const authTag = data.slice(data.length - AUTH_TAG_LENGTH);
    const ciphertext = data.slice(0, data.length - AUTH_TAG_LENGTH);

    const decipher = crypto.createDecipherGCM(ALGORITHM, key, iv, authTag);
    const decrypted = Buffer.concat([
      decipher.update(ciphertext),
      decipher.final(),
    ]);

    return decrypted.toString("utf8");
  } catch (error) {
    console.error("Decryption failed:", error.message);
    return "";
  }
}

// ============================================================================
// MESSAGE ENCRYPTION HELPERS
// ============================================================================

/**
 * Encrypt a chat message before storing in session.
 * @param {string} content - Message content
 * @returns {string} Encrypted content
 */
export function encryptMessage(content) {
  return encrypt(content);
}

/**
 * Decrypt a stored chat message.
 * @param {string} encryptedContent - Encrypted message content
 * @returns {string} Decrypted message content
 */
export function decryptMessage(encryptedContent) {
  return decrypt(encryptedContent);
}

/**
 * Encrypt an email address.
 * @param {string} email - Email to encrypt
 * @returns {string} Encrypted email
 */
export function encryptEmail(email) {
  return encrypt(email);
}

/**
 * Decrypt an email address.
 * @param {string} encryptedEmail - Encrypted email
 * @returns {string} Decrypted email
 */
export function decryptEmail(encryptedEmail) {
  return decrypt(encryptedEmail);
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  encrypt,
  decrypt,
  encryptMessage,
  decryptMessage,
  encryptEmail,
  decryptEmail,
};
