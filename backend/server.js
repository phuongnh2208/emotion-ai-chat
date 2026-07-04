const path = require("path");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Groq = require("groq-sdk");
const { getFallbackReply } = require("./fallback");

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";
const JWT_EXPIRES_IN = "7d";

// In-memory user storage (replace with database in production)
const users = [];

// Middleware
app.use(cors({
  origin: [
      "http://localhost:3000",
      "http://localhost:3001",
    ],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;

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
      return res.status(400).json({ error: "Username, email, and password are required" });
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email === email || u.username === username);
    if (existingUser) {
      return res.status(400).json({ error: "User already exists with this email or username" });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const newUser = {
      id: users.length + 1,
      username,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, username: newUser.username, email: newUser.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Return user without password
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

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Return user without password
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
    sameSite: "lax"
  });
  res.json({ message: "Logged out successfully" });
});

// Get current user (protected route)
app.get("/api/me", authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  const { password: _, ...userWithoutPassword } = user;
  res.json({ user: userWithoutPassword });
});

const GROQ_API_KEY = process.env.GROQ_API_KEY;

const groq = GROQ_API_KEY ? new Groq({ apiKey: GROQ_API_KEY }) : null;

const GROQ_MODEL = "llama-3.3-70b-specdec";
const RETRY_DELAY_MS = 2000;

app.use(cors());
app.use(express.json());

const EMOTION_VI = {
  happy: "vui",
  sad: "buồn",
  angry: "tức giận",
  neutral: "bình thường",
  surprised: "ngạc nhiên",
  fearful: "sợ hãi",
  disgusted: "khó chịu",
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableError(err) {
  const msg = err.message || "";
  return (
    msg.includes("429") ||
    msg.includes("503") ||
    msg.includes("rate limit") ||
    msg.includes("overloaded")
  );
}

function buildSystemPrompt(emotion) {
  const emotionVi = EMOTION_VI[emotion] || emotion;

  return `Bạn là Larry.
  Bạn là người bạn đồng hành của học sinh tiểu học và THCS.

  Camera đã nhận diện lúc mở app:
  Emotion = ${emotion} (${emotionVi}).

  QUAN TRỌNG — Cách dùng cảm xúc từ camera:
  - Cảm xúc camera CHỈ là thông tin tham khảo ban đầu, KHÔNG phải sự thật tuyệt đối.
  - LUÔN ưu tiên nội dung học sinh viết trong chat hơn cảm xúc camera.
  - Nếu camera ghi "bình thường" nhưng học sinh nói "em đang rất tức giận/buồn/sợ" thì tin học sinh, KHÔNG nói "bạn đang bình thường".
  - Không dùng cảm xúc camera để kết luận hay phủ nhận cảm xúc học sinh.

  Nếu đây là lượt đầu tiên (học sinh chưa nhắn gì):
  - Chào hỏi ấm áp.
  - BẮT BUỘC nhận xét nhẹ về cảm xúc camera đã nhận diện (vui/buồn/tức giận/bình thường...).
  - Hỏi một câu mở để học sinh chia sẻ.

  Nếu học sinh đã trả lời:
  - Trả lời dựa trên NỘI DUNG học sinh vừa viết.
  - Lắng nghe, thấu hiểu, an ủi.
  - Đặt thêm một câu hỏi để tiếp tục cuộc hội thoại.
  - Thu thập đủ thông tin trước khi đưa lời khuyên.
  - Nếu phát hiện bắt nạt học đường: lắng nghe, an ủi, hướng dẫn nhẹ nhàng, khuyến khích nói với người lớn đáng tin.

  Không kết thúc cuộc trò chuyện quá sớm.

  Chỉ gợi ý chơi game Scratch khi cuộc trò chuyện gần kết thúc hoặc khi phù hợp để giúp thư giãn.

  Luôn trả lời bằng tiếng Việt, giọng ấm áp, dễ hiểu với học sinh. Mỗi lần trả lời khoảng 2-4 câu.`;
}

function buildUserPrompt(history, emotion) {
  const emotionVi = EMOTION_VI[emotion] || emotion;

  if (history.length === 0) {
    return `Camera vừa nhận diện cảm xúc của học sinh: ${emotion} (${emotionVi}).
    Đây là tin nhắn ĐẦU TIÊN — học sinh chưa nhắn gì.
    Hãy chủ động mở lời, BẮT BUỘC nhắc nhẹ về cảm xúc ${emotionVi} mà camera vừa thấy, rồi hỏi một câu mở để học sinh chia sẻ.`;
  }

  const transcript = history
    .map(({ role, content }) => {
      const speaker = role === "user" ? "Học sinh" : "Larry";
      return `${speaker}: ${content}`;
    })
    .join("\n\n");

  return `Đây là lịch sử cuộc trò chuyện:\n\n${transcript}\n\nHãy viết tin nhắn tiếp theo của Larry. Chỉ trả lời nội dung Larry nói, không lặp lại lịch sử, không ghi "Larry:".`;
}

async function tryModel(model, userPrompt) {
  const result = await model.generateContent(userPrompt);
  const text = result.response.text()?.trim();
  if (!text) throw new Error("Gemini trả về rỗng.");
  return text;
}

async function callGroq(emotion, history = []) {
  if (!groq) throw new Error("Chưa cấu hình GROQ_API_KEY");

  const systemPrompt = buildSystemPrompt(emotion);
  const userPrompt = buildUserPrompt(history, emotion);

  // Thử gọi tối đa 2 lần nếu gặp lỗi nghẽn mạng tạm thời
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        model: GROQ_MODEL,
        temperature: 0.6, // Giúp câu trả lời tự nhiên, ấm áp hơn
      });

      const text = chatCompletion.choices[0]?.message?.content?.trim();
      if (!text) throw new Error("Groq trả về nội dung rỗng.");
      return text;

    } catch (err) {
      console.error(`Groq attempt ${attempt + 1} failed:`, err.message);

      if (attempt === 0 && isRetryableError(err)) {
        await sleep(RETRY_DELAY_MS);
        continue;
      }
      throw err;
    }
  }
}

// Protected chat endpoint
app.post("/chat", authenticateToken, async (req, res) => {
  const { emotion, history = [] } = req.body;

  if (!emotion) {
    return res.status(400).json({ error: "Thiếu thông tin cảm xúc." });
  }

  if (!Array.isArray(history)) {
    return res.status(400).json({ error: "history phải là mảng." });
  }

  // Nếu không có API Key thì chạy luôn file fallback dự phòng của bạn
  if (!GROQ_API_KEY) {
    const message = getFallbackReply(emotion, history);
    return res.json({ message, emotion, fallback: true });
  }

  try {
    const text = await callGroq(emotion, history);
    res.json({ message: text, emotion, fallback: false });
  } catch (err) {
    console.error("Groq error:", err.message);
    const message = getFallbackReply(emotion, history);

    const isRateLimit = err.message.includes("429") || err.message.includes("rate limit");
    res.json({
      message,
      emotion,
      fallback: true,
      warning: isRateLimit
        ? "Hệ thống AI đang bận — Larry đang trả lời ở chế độ dự phòng."
        : "Không thể kết nối tới AI — Larry đang trả lời ở chế độ dự phòng.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(
    `GROQ_API_KEY: ${GROQ_API_KEY ? "loaded ✓" : "MISSING ✗ — dùng chế độ dự phòng"}`
  );
  console.log(`Model: ${GROQ_MODEL}`);
});