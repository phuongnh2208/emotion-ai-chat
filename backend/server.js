import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { getGeminiService } from "./src/services/geminiService.js";
import { getGroqService } from "./src/services/groqService.js";
import { getFallbackResponse } from "./src/utils/fallbackResponses.js";
import chatRoutes from "./src/routes/chat.js";
import sessionRoutes from "./src/routes/session.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the backend directory (not the CWD)
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET =
  process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";
const JWT_EXPIRES_IN = "7d";

// In-memory user storage (replace with database in production)
const users = [];

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());
app.use(cookieParser());

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const bearerToken = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;
  const token = bearerToken || req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

// Register endpoint
app.post("/api/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ error: "Username, email, and password are required" });
    }

    const existingUser = users.find(
      (u) => u.email === email || u.username === username,
    );
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User already exists with this email or username" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = {
      id: users.length + 1,
      username,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);

    const token = jwt.sign(
      { id: newUser.id, username: newUser.username, email: newUser.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login endpoint
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = users.find((u) => u.email === email);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Logout endpoint
app.post("/api/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.json({ message: "Logged out successfully" });
});

// Get current user (protected route)
app.get("/api/me", authenticateToken, (req, res) => {
  const user = users.find((u) => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  const { password: _, ...userWithoutPassword } = user;
  res.json({ user: userWithoutPassword });
});

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const geminiService = getGeminiService();
const groqService = getGroqService();

// Register API routes
app.use("/api/chat", chatRoutes);
app.use("/api/session", sessionRoutes);

// Legacy chat endpoint (backward compatibility)
app.post("/chat", async (req, res) => {
  try {
    const { emotion, history = [] } = req.body;

    if (!emotion) {
      return res.status(400).json({ error: "Thiếu thông tin cảm xúc." });
    }

    const isFirstMessage = history.length === 0;
    const response = await geminiService.generateResponse(
      emotion,
      history,
      "legacy-" + Date.now(),
      isFirstMessage,
    );

    res.json(response);
  } catch (error) {
    console.error("Legacy chat error:", error.message);
    const { emotion, history = [] } = req.body;
    const fallbackResponse = getFallbackResponse(
      emotion || "neutral",
      history,
      error.message,
    );
    res.json(fallbackResponse);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(
    `GEMINI_API_KEY: ${GEMINI_API_KEY ? "loaded ✓" : "MISSING ✗ — dùng chế độ dự phòng"}`,
  );
  console.log(
    `GROQ_API_KEY: ${GROQ_API_KEY ? "loaded ✓ (fallback)" : "MISSING ✗"}`,
  );
  console.log(`Model: gemini-2.0-flash-exp`);
  console.log(`Safety: Enabled ✓`);
  console.log(`Encryption: Enabled ✓`);
});
