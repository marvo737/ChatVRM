import { getChatResponseStream } from "@/features/chat/openAiChat";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { messages, apiKey, baseUrl, model } = req.body;

  try {
    const stream = await getChatResponseStream(
      messages,
      apiKey || process.env.OPEN_AI_KEY,
      baseUrl,
      model
    );

    res.writeHead(200, {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    });

    const reader = stream.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      res.write(value);
    }
    res.end();
  } catch (error) {
    console.error("Error in chat-stream API:", error);
    res.status(500).json({ message: "Error streaming chat response" });
  }
}