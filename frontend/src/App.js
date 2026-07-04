import React, { useCallback, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AuthPage from "./components/AuthPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Camera from "./components/Camera";
import ChatBox from "./components/ChatBox";
import PlayfulBackground from "./components/PlayfulBackground";
import "./styles/larry.css";

const ProtectedApp = () => {
  const [emotion, setEmotion] = useState(null);

  const handleEmotionDetected = useCallback((detectedEmotion) => {
    setEmotion(detectedEmotion);
  }, []);

  return (
    <ProtectedRoute>
      <div className="app-shell">
        <PlayfulBackground />
        <div className="app-layout">
          <section className="panel-left">
            <Camera onEmotionDetected={handleEmotionDetected} />
          </section>
          <section className="panel-right">
            <ChatBox emotion={emotion} />
          </section>
        </div>
      </div>
    </ProtectedRoute>
  );
};

const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Đang tải...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <AuthPage />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/" replace /> : <AuthPage />}
      />
      <Route path="/" element={<ProtectedApp />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;