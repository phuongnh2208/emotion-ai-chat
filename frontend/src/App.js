import { useCallback, useState } from "react";
import Camera from "./components/Camera";
import ChatBox from "./components/ChatBox";
import PlayfulBackground from "./components/PlayfulBackground";
import "./styles/larry.css";

function App() {
  const [emotion, setEmotion] = useState(null);

  const handleEmotionDetected = useCallback((detectedEmotion) => {
    setEmotion(detectedEmotion);
  }, []);

  return (
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
  );
}

export default App;
