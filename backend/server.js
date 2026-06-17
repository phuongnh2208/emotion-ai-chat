const path = require("path");
require("dotenv").config(); 
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { getFallbackReply } = require("./fallback");

const app = express();
const PORT = process.env.PORT || 5000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash",
  "gemini-2.5-flash-lite",
];
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
    msg.includes("quota") ||
    msg.includes("high demand")
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

async function callGemini(emotion, history = []) {
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const systemPrompt = buildSystemPrompt(emotion);
  const userPrompt = buildUserPrompt(history, emotion);
  const errors = [];

  for (const modelName of GEMINI_MODELS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: systemPrompt,
        });
        return await tryModel(model, userPrompt);
      } catch (err) {
        const short = err.message.split("\n")[0];
        errors.push(`${modelName}: ${short}`);
        console.error(`Model ${modelName} attempt ${attempt + 1} failed:`, short);

        if (attempt === 0 && isRetryableError(err)) {
          await sleep(RETRY_DELAY_MS);
          continue;
        }
        break;
      }
    }
  }

  const err = new Error(errors.join(" | "));
  err.isQuota = errors.some((e) => e.includes("429") || e.includes("quota"));
  throw err;
}

app.post("/chat", async (req, res) => {
  const { emotion, history = [] } = req.body;

  if (!emotion) {
    return res.status(400).json({ error: "Thiếu thông tin cảm xúc." });
  }

  if (!Array.isArray(history)) {
    return res.status(400).json({ error: "history phải là mảng." });
  }

  if (!GEMINI_API_KEY) {
    const message = getFallbackReply(emotion, history);
    return res.json({ message, emotion, fallback: true });
  }

  try {
    const text = await callGemini(emotion, history);
    res.json({ message: text, emotion, fallback: false });
  } catch (err) {
    console.error("Gemini error:", err.message);
    const message = getFallbackReply(emotion, history);
    res.json({
      message,
      emotion,
      fallback: true,
      warning: err.isQuota
        ? "Gemini đang bị giới hạn quota — Larry đang trả lời ở chế độ dự phòng."
        : "Gemini tạm thời không phản hồi — Larry đang trả lời ở chế độ dự phòng.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(
    `GEMINI_API_KEY: ${GEMINI_API_KEY ? "loaded ✓" : "MISSING ✗ — dùng chế độ dự phòng"}`
  );
  console.log(`Models: ${GEMINI_MODELS.join(", ")}`);
});
