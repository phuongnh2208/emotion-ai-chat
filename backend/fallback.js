const OPENING_BY_EMOTION = {
  happy:
    "Chào bạn! 👋\nLarry thấy hôm nay bạn có vẻ vui vẻ đấy!\nBạn có muốn kể cho Larry nghe điều gì vui không?",
  sad:
    "Chào bạn! 👋\nLarry thấy hôm nay bạn có vẻ hơi buồn 😢\nCó chuyện gì xảy ra không? Larry luôn sẵn sàng lắng nghe.",
  angry:
    "Chào bạn! 👋\nLarry thấy bạn có vẻ đang hơi tức giận 😤\nBạn muốn kể cho Larry nghe chuyện gì đã xảy ra không?",
  neutral:
    "Chào bạn! 👋\nMình là Larry — người bạn AI của bạn.\nHôm nay bạn thế nào? Có điều gì muốn chia sẻ không?",
  surprised:
    "Chào bạn! 👋\nLarry thấy bạn có vẻ hơi ngạc nhiên 😲\nCó chuyện gì vừa xảy ra không?",
  fearful:
    "Chào bạn! 👋\nLarry thấy bạn có vẻ hơi lo lắng 😨\nBạn có muốn nói cho Larry biết điều gì đang làm bạn lo không?",
  disgusted:
    "Chào bạn! 👋\nLarry thấy bạn có vẻ không thoải mái lắm.\nBạn muốn kể cho Larry nghe chuyện gì đang xảy ra không?",
};

function getLastUserMessage(history) {
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].role === "user") return history[i].content.toLowerCase();
  }
  return "";
}

function matches(text, keywords) {
  return keywords.some((kw) => text.includes(kw));
}

function getFollowUpReply(userText) {
  if (matches(userText, ["bắt nạt", "bully", "đánh", "chửi", "cô lập"])) {
    if (matches(userText, ["tiền", "lấy tiền", "cướp"])) {
      return "Larry rất tiếc khi nghe điều đó 😔\nViệc bị lấy tiền không phải lỗi của bạn.\nBạn đã nói với giáo viên hoặc bố mẹ chưa?";
    }
    if (matches(userText, ["chưa dám", "không dám", "sợ nói"])) {
      return "Larry hiểu, nói ra đôi khi rất khó.\nNhưng tìm một người lớn đáng tin cậy là rất quan trọng — bạn không cần phải chịu một mình.\nNếu muốn bình tĩnh hơn, Larry có một trò chơi nhỏ giúp bạn thư giãn nhé. 🎮";
    }
    return "Larry rất tiếc khi nghe điều đó.\nViệc bị bắt nạt không phải lỗi của bạn.\nBạn có thể kể rõ hơn không — bị bắt nạt bằng lời nói, đánh nhau hay bị cô lập?";
  }

  if (matches(userText, ["tức giận", "giận", "cáu", "bực"])) {
    return "Larry hiểu bạn đang tức giận 😔\nCảm giác đó hoàn toàn bình thường.\nBạn có muốn kể cho Larry nghe chuyện gì đã xảy ra không?";
  }

  if (matches(userText, ["buồn", "khóc", "tủi", "cô đơn"])) {
    return "Larry hiểu bạn đang buồn 💙\nBuồn là cảm xúc bình thường, và Larry luôn ở đây lắng nghe.\nBạn muốn kể thêm điều gì đang làm bạn buồn không?";
  }

  if (matches(userText, ["sợ", "lo lắng", "hoảng", "sợ hãi"])) {
    return "Larry hiểu bạn đang lo lắng.\nHít thở sâu một chút nhé — bạn an toàn khi đang nói chuyện với Larry.\nĐiều gì đang làm bạn sợ nhất?";
  }

  if (matches(userText, ["vui", "hạnh phúc", "tuyệt", "thích"])) {
    return "Thật tuyệt! Larry rất vui khi nghe điều đó 🎉\nBạn có muốn kể thêm về điều làm bạn vui không?";
  }

  if (matches(userText, ["cảm ơn", "thank"])) {
    return "Không có gì đâu! 💚\nLarry luôn sẵn sàng lắng nghe bạn.\nBạn còn muốn chia sẻ thêm điều gì không?";
  }

  const turnCount = userText.length > 0 ? 1 : 0;
  if (turnCount >= 0) {
    return "Larry đang lắng nghe bạn 💙\nBạn có thể kể thêm cho Larry biết chi tiết hơn được không?\nLarry muốn hiểu bạn hơn.";
  }

  return "Larry hiểu rồi.\nBạn có muốn kể thêm cho Larry nghe không?";
}

function getFallbackReply(emotion, history = []) {
  if (!history.length) {
    return OPENING_BY_EMOTION[emotion] || OPENING_BY_EMOTION.neutral;
  }

  const userText = getLastUserMessage(history);
  return getFollowUpReply(userText);
}

module.exports = { getFallbackReply };
