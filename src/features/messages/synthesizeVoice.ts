export async function synthesizeVoice(message: string, speakerId: number) {
  const body = {
    message: message,
    speakerId: speakerId,
  };

  const res = await fetch("/api/tts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Failed to synthesize voice: ${res.statusText}`);
  }

  const blob = await res.blob();
  return blob;
}
