/**
 * Chat Service
 * API calls for chat functionality
 *
 * Privacy & Data Protection:
 * - deleteAllChatHistory() permanently deletes all user chat history
 * - deleteChatHistory() deletes a specific session
 */

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

/**
 * Start a new chat session
 * @param {string} emotion - User's emotion
 * @param {string} method - Input method: 'camera', 'text', 'button'
 * @returns {Promise<Object>} Session data with greeting message
 */
export const startChatSession = async (emotion, method = "button") => {
  const response = await fetch(`${API_BASE_URL}/chat/session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ emotion, method }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Không thể bắt đầu cuộc trò chuyện");
  }

  return response.json();
};

/**
 * Send a message in an existing chat session
 * @param {string} sessionId - Session ID
 * @param {string} message - User's message
 * @param {string} emotion - Current emotion (optional)
 * @returns {Promise<Object>} AI response
 */
export const sendMessage = async (sessionId, message, emotion = null) => {
  const response = await fetch(`${API_BASE_URL}/chat/message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sessionId, message, emotion }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Không thể gửi tin nhắn");
  }

  return response.json();
};

/**
 * Get chat history for a session
 * @param {string} sessionId - Session ID
 * @returns {Promise<Object>} Chat history
 */
export const getChatHistory = async (sessionId) => {
  const response = await fetch(`${API_BASE_URL}/chat/history/${sessionId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Không thể lấy lịch sử trò chuyện");
  }

  return response.json();
};

/**
 * Delete chat history for a specific session
 * @param {string} sessionId - Session ID
 * @returns {Promise<Object>} Success message
 */
export const deleteChatHistory = async (sessionId) => {
  const response = await fetch(`${API_BASE_URL}/chat/history/${sessionId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Không thể xóa lịch sử trò chuyện");
  }

  return response.json();
};

/**
 * Delete ALL chat history for the current user
 * Permanently removes all sessions belonging to the authenticated user.
 * @returns {Promise<Object>} Success message with deleted count
 */
export const deleteAllChatHistory = async () => {
  const response = await fetch(`${API_BASE_URL}/chat/history`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Không thể xóa lịch sử trò chuyện");
  }

  return response.json();
};

/**
 * Create a new session
 * @param {string} emotion - User's emotion
 * @param {string} method - Input method
 * @returns {Promise<Object>} Session data
 */
export const createSession = async (emotion, method = "button") => {
  const response = await fetch(`${API_BASE_URL}/session/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ emotion, method }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Không thể tạo phiên mới");
  }

  return response.json();
};

/**
 * Get session by ID
 * @param {string} sessionId - Session ID
 * @returns {Promise<Object>} Session data
 */
export const getSession = async (sessionId) => {
  const response = await fetch(`${API_BASE_URL}/session/${sessionId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Không thể lấy thông tin phiên");
  }

  return response.json();
};

/**
 * Delete a session
 * @param {string} sessionId - Session ID
 * @returns {Promise<Object>} Success message
 */
export const deleteSession = async (sessionId) => {
  const response = await fetch(`${API_BASE_URL}/session/${sessionId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Không thể xóa phiên");
  }

  return response.json();
};
