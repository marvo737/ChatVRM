import { audioQuery, synthesis } from "@/features/voicevox/voicevox";
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import path from "path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const message = req.body.message;
  const speakerId = req.body.speakerId;

  if (typeof message !== "string" || typeof speakerId !== "number") {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  try {
    // [word] 形式のタグを除去
    const text = message.replace(/\[(.*?)\]/g, "");
    const query = await audioQuery(text, speakerId);
    query.outputSamplingRate = 44100;
    const voice = await synthesis(query, speakerId);

    const buffer = Buffer.from(await voice.arrayBuffer());

    res.setHeader("Content-Type", "audio/wav");
    res.status(200).send(buffer);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "synthesis failed" });
  }
}
