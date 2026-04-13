import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const whisperUrl = req.headers["x-whisper-url"] as string;
  if (!whisperUrl) {
    return res.status(400).json({ message: "x-whisper-url header is required" });
  }

  try {
    const chunks: Buffer[] = [];
    for await (const chunk of req) {
      chunks.push(Buffer.from(chunk));
    }
    const body = Buffer.concat(chunks);

    const contentType = req.headers["content-type"] ?? "";

    const response = await fetch(
      `${whisperUrl}/v1/audio/transcriptions`,
      {
        method: "POST",
        headers: { "Content-Type": contentType },
        body: body,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Faster-Whisper error:", errorText);
      return res.status(response.status).json({ message: errorText });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("STT proxy error:", error);
    return res.status(500).json({ message: "STT transcription failed" });
  }
}
