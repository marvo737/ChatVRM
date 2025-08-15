import { getChatResponse } from "@/features/chat/openAiChat";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const apiKey = req.body.apiKey || process.env.OPEN_AI_KEY;
  const baseUrl = req.body.baseUrl;
  const model = req.body.model;

  if (!apiKey && !baseUrl) {
    res
      .status(400)
      .json({ message: "APIキーまたはベースURLが設定されていません。" });
    return;
  }

  try {
    const message = await getChatResponse(
      req.body.messages,
      apiKey,
      baseUrl,
      model
    );
    res.status(200).json(message);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "エラーが発生しました。" });
  }
}
