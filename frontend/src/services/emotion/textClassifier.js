// Emotion Text Classification Service
// Simple keyword-based emotion detection for Vietnamese text

const EMOTION_KEYWORDS = {
  happy: {
    keywords: [
      "vui",
      "hạnh phúc",
      "tốt",
      "tuyệt",
      "vui vẻ",
      "phấn khởi",
      "hào hứng",
      "chill",
      "thích",
      "yêu",
      "thương",
      "cười",
      "hạnh phúc",
      "sung sướng",
      "phấn khích",
      "hứng thú",
      "vui thích",
      "hài lòng",
      "hân hoan",
    ],
    weight: 1.0,
  },
  sad: {
    keywords: [
      "buồn",
      "khóc",
      "tệ",
      "xấu",
      "chán",
      "buồn bã",
      "đau khổ",
      "thất vọng",
      "sầu",
      "đau",
      "nhớ",
      "tiếc",
      "buồn phiền",
      "u sầu",
      "đau buồn",
      "xót xa",
      "thương cảm",
      "đau lòng",
      "buồn rầu",
      "uất ức",
    ],
    weight: 1.0,
  },
  angry: {
    keywords: [
      "tức",
      "giận",
      "khó chịu",
      "bực",
      "nóng",
      "cáu",
      "tức giận",
      "phẫn nộ",
      "ghét",
      "chán ghét",
      "căm ghét",
      "tức tối",
      "nóng giận",
      "bực bội",
      "khó chịu",
      "bất mãn",
      "phật ý",
      "khó chịu",
      "cáu kỉnh",
    ],
    weight: 1.0,
  },
  anxious: {
    keywords: [
      "lo",
      "sợ",
      "hồi hộp",
      "căng thẳng",
      "lo lắng",
      "bất an",
      "sợ hãi",
      "lo âu",
      "căng thẳng",
      "hồi hộp",
      "bồn chồn",
      "bất an",
      "lo ngại",
      "e ngại",
      "sợ sệt",
      "lo sợ",
      "băn khoăn",
      "phân vân",
      "hoang mang",
    ],
    weight: 1.0,
  },
  surprised: {
    keywords: [
      "ngạc nhiên",
      "bất ngờ",
      "wow",
      "thật",
      "không thể tin",
      "đùng",
      "bất ngờ",
      "ngạc nhiên",
      "kinh ngạc",
      "sửng sốt",
      "bất ngờ",
    ],
    weight: 1.0,
  },
  fearful: {
    keywords: [
      "sợ",
      "hoảng",
      "khủng",
      "kinh",
      "hãi",
      "hoảng sợ",
      "kinh hoảng",
      "khủng khiếp",
      "đáng sợ",
      "rùng mình",
      "kinh hãi",
      "hoảng loạn",
    ],
    weight: 1.0,
  },
  disgusted: {
    keywords: [
      "ghê",
      "kinh tởm",
      "khó chịu",
      "phản cảm",
      "ghê tởm",
      "khó ưa",
      "khó chịu",
      "bất mãn",
      "phật ý",
    ],
    weight: 1.0,
  },
};

const NEGATION_WORDS = [
  "không",
  "chưa",
  "chẳng",
  "chả",
  "đâu",
  "chẳng hề",
  "không hề",
  "không phải",
  "chẳng phải",
];

const INTENSIFIERS = [
  "rất",
  "cực kỳ",
  "vô cùng",
  "siêu",
  "quá",
  "lắm",
  "hết sức",
  "cực",
];

/**
 * Classify emotion from Vietnamese text
 * @param {string} text - Input text to classify
 * @returns {Object} - { emotion: string, confidence: number, scores: Object }
 */
export const classifyEmotion = (text) => {
  if (!text || text.trim().length === 0) {
    return {
      emotion: "neutral",
      confidence: 0,
      scores: {},
    };
  }

  const lowerText = text.toLowerCase();
  const words = lowerText.split(/\s+/);

  const scores = {};
  let totalScore = 0;

  // Calculate base scores for each emotion
  for (const [emotion, config] of Object.entries(EMOTION_KEYWORDS)) {
    let emotionScore = 0;
    let matchCount = 0;

    for (const keyword of config.keywords) {
      if (lowerText.includes(keyword)) {
        emotionScore += config.weight;
        matchCount++;
      }
    }

    if (matchCount > 0) {
      scores[emotion] = emotionScore;
      totalScore += emotionScore;
    }
  }

  // If no emotions detected, return neutral
  if (totalScore === 0) {
    return {
      emotion: "neutral",
      confidence: 0.5,
      scores: {},
    };
  }

  // Normalize scores
  const normalizedScores = {};
  for (const [emotion, score] of Object.entries(scores)) {
    normalizedScores[emotion] = score / totalScore;
  }

  // Find dominant emotion
  let dominantEmotion = "neutral";
  let maxScore = 0;

  for (const [emotion, score] of Object.entries(normalizedScores)) {
    if (score > maxScore) {
      maxScore = score;
      dominantEmotion = emotion;
    }
  }

  // Adjust confidence based on context
  let confidence = maxScore;

  // Check for negations (reduce confidence)
  const hasNegation = NEGATION_WORDS.some((negation) =>
    words.some((word) => word.includes(negation)),
  );

  if (hasNegation) {
    confidence *= 0.7;
  }

  // Check for intensifiers (increase confidence)
  const hasIntensifier = INTENSIFIERS.some((intensifier) =>
    words.some((word) => word.includes(intensifier)),
  );

  if (hasIntensifier) {
    confidence = Math.min(confidence * 1.2, 1.0);
  }

  return {
    emotion: dominantEmotion,
    confidence: Math.min(confidence, 1.0),
    scores: normalizedScores,
  };
};

/**
 * Get emotion label in Vietnamese
 * @param {string} emotion - Emotion key
 * @returns {string} - Vietnamese label
 */
export const getEmotionLabel = (emotion) => {
  const labels = {
    happy: "Vui vẻ",
    sad: "Buồn",
    angry: "Tức giận",
    anxious: "Lo lắng",
    surprised: "Ngạc nhiên",
    fearful: "Sợ hãi",
    disgusted: "Khó chịu",
    neutral: "Bình thường",
  };

  return labels[emotion] || "Bình thường";
};

/**
 * Get emotion icon
 * @param {string} emotion - Emotion key
 * @returns {string} - Emoji icon
 */
export const getEmotionIcon = (emotion) => {
  const icons = {
    happy: "😊",
    sad: "😢",
    angry: "😡",
    anxious: "😰",
    surprised: "😲",
    fearful: "😨",
    disgusted: "😖",
    neutral: "😐",
  };

  return icons[emotion] || "😐";
};

export default {
  classifyEmotion,
  getEmotionLabel,
  getEmotionIcon,
};
