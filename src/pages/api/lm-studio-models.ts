import type { NextApiRequest, NextApiResponse } from "next";

type Model = {
  id: string;
  object: "model";
  created: number;
  owned_by: string;
};

type Data = {
  models: Model[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | { message: string }>
) {
  const baseUrl = req.query.baseUrl as string;
  const apiKey = req.query.apiKey as string | undefined;

  if (!baseUrl) {
    res.status(400).json({ message: "baseUrl is required" });
    return;
  }

  try {
    const url = new URL(baseUrl);
    const modelsUrl = `${url.protocol}//${url.host}/v1/models`;

    const headers: Record<string, string> = {};
    if (apiKey) {
      headers["Authorization"] = `Bearer ${apiKey}`;
    }

    const response = await fetch(modelsUrl, { headers });
    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.statusText}`);
    }
    const data = await response.json();
    res.status(200).json({ models: data.data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch models";
    console.error(error);
    res.status(500).json({ message });
  }
}
