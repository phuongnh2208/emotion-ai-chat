import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSession } from "../../contexts/SessionContext";

const ProtectedRoute = ({ children, requireAuth = false }) => {
  const { isAuthenticated, loading } = useAuth();
  const { isInitialized } = useSession();
  const location = useLocation();

  if (loading || !isInitialized) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Đang tải...</p>
      </div>
    );
  }

  // If route requires authentication and user is not logged in
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Allow anonymous access for non-auth routes
  return children;
};

export default ProtectedRoute;
