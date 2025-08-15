const VOICEVOX_URL = "http://127.0.0.1:50021";

/**
 * テキストから音声合成用のクエリを作成する
 * @param text テキスト
 * @param speaker 話者ID
 * @returns クエリ
 */
export const audioQuery = async (text: string, speaker: number) => {
  const res = await fetch(
    `${VOICEVOX_URL}/audio_query?text=${text}&speaker=${speaker}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }
  );
  return res.json();
};

/**
 * 音声合成用のクエリから音声を合成する
 * @param query クエリ
 * @param speaker 話者ID
 * @returns 音声データ (wav)
 */
export const synthesis = async (query: any, speaker: number) => {
  const res = await fetch(`${VOICEVOX_URL}/synthesis?speaker=${speaker}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(query),
  });
  if (!res.ok) {
    throw new Error(`Failed to synthesis voice: ${await res.text()}`);
  }
  return res.blob();
};