import * as faceapi from "face-api.js";

let modelsLoaded = false;

export async function loadFaceApiModels() {
  if (modelsLoaded) return true;
  try {
    await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
    await faceapi.nets.faceExpressionNet.loadFromUri("/models");
    modelsLoaded = true;
    return true;
  } catch (err) {
    console.error("Face API model load failed:", err);
    return false;
  }
}

export async function detectEmotion(videoElement) {
  if (!videoElement || videoElement.readyState !== 4) return null;

  try {
    const detection = await faceapi
      .detectSingleFace(videoElement, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();

    if (!detection) return null;

    const dominant = Object.keys(detection.expressions).reduce((a, b) =>
      detection.expressions[a] > detection.expressions[b] ? a : b,
    );

    return {
      emotion: dominant,
      confidence: detection.expressions[dominant],
      expressions: detection.expressions,
    };
  } catch (err) {
    console.error("Face detection error:", err);
    return null;
  }
}
