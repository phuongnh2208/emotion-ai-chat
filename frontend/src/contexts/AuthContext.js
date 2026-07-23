import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

const API_BASE_URL = process.env.REACT_APP_API_URL || "https://emotion-ai-chat.onrender.com";

const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }

  delete axios.defaults.headers.common.Authorization;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        setAuthToken(token);
        try {
          const response = await axios.get(`${API_BASE_URL}/api/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(response.data.user);
        } catch (err) {
          localStorage.removeItem("token");
          setAuthToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const register = async (username, email, password) => {
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/register`, {
        username,
        email,
        password
      });

      const { user: userData, token } = response.data;
      localStorage.setItem("token", token);
      setAuthToken(token);
      setUser(userData);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Registration failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const login = async (email, password) => {
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/login`, {
        email,
        password
      });

      const { user: userData, token } = response.data;
      localStorage.setItem("token", token);
      setAuthToken(token);
      setUser(userData);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Login failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/logout`);
    } catch (err) {
      console.error("Logout error:", err);
    }
    localStorage.removeItem("token");
    setAuthToken(null);
    setUser(null);
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};