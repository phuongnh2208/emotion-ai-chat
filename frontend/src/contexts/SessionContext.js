import React, { createContext, useState, useEffect, useContext } from "react";
import {
  createAnonymousSession,
  getAnonymousSession,
  updateAnonymousSession,
  clearAnonymousSession,
} from "../utils/anonymousSession";

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize session on mount
    const existingSession = getAnonymousSession();
    setSession(existingSession);
    setIsInitialized(true);

    // Cleanup on unmount
    return () => {
      // Optional: Clear session when app closes
      // clearAnonymousSession();
    };
  }, []);

  const refreshSession = () => {
    const updatedSession = getAnonymousSession();
    setSession(updatedSession);
    return updatedSession;
  };

  const updateSession = (updates) => {
    const updatedSession = updateAnonymousSession(updates);
    setSession(updatedSession);
    return updatedSession;
  };

  const resetSession = () => {
    clearAnonymousSession();
    const newSession = createAnonymousSession();
    setSession(newSession);
    return newSession;
  };

  const value = {
    session,
    isInitialized,
    refreshSession,
    updateSession,
    resetSession,
    sessionId: session?.sessionId,
  };

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};

export default SessionContext;
