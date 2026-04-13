let mediaRecorder: MediaRecorder | null = null;
let chunks: Blob[] = [];

/**
 * マイクからの録音を開始する
 * @returns 録音が正常に開始された場合 true
 */
export async function startRecording(): Promise<boolean> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    chunks = [];

    mediaRecorder = new MediaRecorder(stream, {
      mimeType: MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm",
    });

    mediaRecorder.addEventListener("dataavailable", (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    });

    mediaRecorder.start();
    return true;
  } catch (e) {
    console.error("Failed to start recording:", e);
    return false;
  }
}

/**
 * 録音を停止し、音声データの Blob を返す
 * @returns 音声データの Blob。録音していない場合は null
 */
export function stopRecording(): Promise<Blob | null> {
  return new Promise((resolve) => {
    if (!mediaRecorder || mediaRecorder.state !== "recording") {
      resolve(null);
      return;
    }

    mediaRecorder.addEventListener("stop", () => {
      const blob = new Blob(chunks, { type: mediaRecorder!.mimeType });
      mediaRecorder!.stream.getTracks().forEach((track) => track.stop());
      mediaRecorder = null;
      chunks = [];
      resolve(blob);
    });

    mediaRecorder.stop();
  });
}

/**
 * 録音中かどうかを返す
 */
export function isRecording(): boolean {
  return mediaRecorder !== null && mediaRecorder.state === "recording";
}

/**
 * 音声 Blob を Faster-Whisper サーバーに送信して文字起こしする
 * @param audioBlob 音声データ
 * @param whisperUrl Faster-Whisper サーバーの URL
 * @returns 文字起こし結果のテキスト
 */
export async function transcribeAudio(
  audioBlob: Blob,
  whisperUrl: string
): Promise<string> {
  const formData = new FormData();
  formData.append("file", audioBlob, "recording.webm");
  formData.append("model", "whisper-1");
  formData.append("language", "ja");

  const res = await fetch("/api/stt", {
    method: "POST",
    headers: {
      "x-whisper-url": whisperUrl,
    },
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Transcription failed: ${res.statusText}`);
  }

  const data = await res.json();
  return data.text;
}
