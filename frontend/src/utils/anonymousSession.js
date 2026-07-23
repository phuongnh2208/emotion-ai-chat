// Anonymous Session Management Utilities

const SESSION_KEY = "larry_anonymous_session";
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export const createAnonymousSession = () => {
  const sessionId = generateSessionId();
  const session = {
    sessionId,
    createdAt: new Date().toISOString(),
    messages: [],
    emotions: [],
    activities: [],
  };

  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
};

export const getAnonymousSession = () => {
  try {
    const sessionData = sessionStorage.getItem(SESSION_KEY);
    if (!sessionData) {
      return createAnonymousSession();
    }

    const session = JSON.parse(sessionData);
    const createdAt = new Date(session.createdAt);
    const now = new Date();

    // Check if session expired
    if (now - createdAt > SESSION_DURATION) {
      clearAnonymousSession();
      return createAnonymousSession();
    }

    return session;
  } catch (error) {
    console.error("Error getting anonymous session:", error);
    return createAnonymousSession();
  }
};

export const updateAnonymousSession = (updates) => {
  try {
    const session = getAnonymousSession();
    const updatedSession = { ...session, ...updates };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(updatedSession));
    return updatedSession;
  } catch (error) {
    console.error("Error updating anonymous session:", error);
    return getAnonymousSession();
  }
};

export const addMessageToSession = (message) => {
  const session = getAnonymousSession();
  const updatedMessages = [...session.messages, message];
  return updateAnonymousSession({ messages: updatedMessages });
};

export const addEmotionToSession = (emotion) => {
  const session = getAnonymousSession();
  const updatedEmotions = [...session.emotions, emotion];
  return updateAnonymousSession({ emotions: updatedEmotions });
};

export const addActivityToSession = (activity) => {
  const session = getAnonymousSession();
  const updatedActivities = [...session.activities, activity];
  return updateAnonymousSession({ activities: updatedActivities });
};

export const clearAnonymousSession = () => {
  sessionStorage.removeItem(SESSION_KEY);
};

export const hasAnonymousSession = () => {
  return sessionStorage.getItem(SESSION_KEY) !== null;
};

const generateSessionId = () => {
  const timestamp = Date.now();
  const randomPart = Math.random().toString(36).substring(2, 15);
  return `anon_${timestamp}_${randomPart}`;
};

export default {
  createAnonymousSession,
  getAnonymousSession,
  updateAnonymousSession,
  addMessageToSession,
  addEmotionToSession,
  addActivityToSession,
  clearAnonymousSession,
  hasAnonymousSession,
};
