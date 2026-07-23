import React, { Suspense, useCallback, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { SessionProvider } from "./contexts/SessionContext";
import Login from "./components/ui/Login";
import Register from "./components/ui/Register";
import ProtectedRoute from "./components/ui/ProtectedRoute";
import Camera from "./components/ui/Camera";
import PlayfulBackground from "./components/ui/PlayfulBackground";
import UserMenu from "./components/ui/UserMenu";
import LandingPage from "./components/pages/LandingPage";
import EmotionSelectionPage from "./components/pages/EmotionSelectionPage";
import CameraOptionPage from "./components/pages/CameraOptionPage";
import PrivacyPolicy from "./components/pages/PrivacyPolicy";
import PrivacyBanner from "./components/ui/PrivacyBanner";
import { ChatPage } from "./components/chat";
import "./styles/larry.css";
import "./styles/chat-page.css";

const ScratchGamePage = React.lazy(
  () => import("./components/ui/ScratchGamePage"),
);

// ProtectedApp now uses the new ChatPage component
const ProtectedApp = () => {
  const [emotion, setEmotion] = useState(null);

  const handleEmotionDetected = useCallback((detectedEmotion) => {
    setEmotion(detectedEmotion);
  }, []);

  return (
    <ProtectedRoute>
      <div className="app-shell">
        <PrivacyBanner />
        <PlayfulBackground />

        <div className="app-layout">
          <section className="panel-left">
            <div className="camera-stack">
              <Camera onEmotionDetected={handleEmotionDetected} />
              <div className="camera-stack__menu">
                <UserMenu />
              </div>
            </div>
          </section>
          <section className="panel-right">
            {/* Use ChatPage with emotion prop */}
            {emotion ? (
              <ChatPage emotion={emotion} />
            ) : (
              <div className="no-emotion-message">
                <p>Vui lòng chọn cảm xúc để bắt đầu trò chuyện</p>
              </div>
            )}
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
      <Route path="/" element={<LandingPage />} />
      <Route path="/emotion-selection" element={<EmotionSelectionPage />} />
      <Route path="/camera-option" element={<CameraOptionPage />} />
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
      />

      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Register />}
      />
      <Route
        path="/game"
        element={
          <ProtectedRoute requireAuth={true}>
            <Suspense
              fallback={
                <div className="loading-screen">
                  <div className="spinner"></div>
                  <p>Đang mở Scratch...</p>
                </div>
              }
            >
              <ScratchGamePage />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat"
        element={
          <ProtectedRoute requireAuth={false}>
            <ProtectedApp />
          </ProtectedRoute>
        }
      />
      {/* Privacy Policy Page - accessible from banner, header, and footer */}
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <SessionProvider>
        <Router>
          <AppContent />
        </Router>
      </SessionProvider>
    </AuthProvider>
  );
}

export default App;
