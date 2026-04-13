let stream: MediaStream | null = null;
let videoElement: HTMLVideoElement | null = null;

/**
 * カメラストリームを取得して内部の video 要素に接続する
 */
export async function startCamera(): Promise<void> {
  if (stream) return;

  stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "user", width: 640, height: 480 },
    audio: false,
  });

  videoElement = document.createElement("video");
  videoElement.srcObject = stream;
  videoElement.setAttribute("playsinline", "true");
  await videoElement.play();
}

/**
 * カメラストリームを停止して解放する
 */
export function stopCamera(): void {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
    stream = null;
  }
  if (videoElement) {
    videoElement.srcObject = null;
    videoElement = null;
  }
}

/**
 * 現在のカメラフレームをキャプチャし、Base64 Data URL として返す
 * @returns "data:image/jpeg;base64,..." 形式の文字列。カメラ未起動時は null
 */
export function captureFrame(): string | null {
  if (!videoElement || !stream) return null;

  const canvas = document.createElement("canvas");
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.drawImage(videoElement, 0, 0);
  return canvas.toDataURL("image/jpeg", 0.8);
}
