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

  if (!baseUrl) {
    res.status(400).json({ message: "baseUrl is required" });
    return;
  }

  try {
    // baseUrl might contain paths like /chat/completions, remove them to get the base path
    const url = new URL(baseUrl);
    const modelsUrl = `${url.protocol}//${url.host}/v1/models`;

    const response = await fetch(modelsUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.statusText}`);
    }
    const data = await response.json();
    res.status(200).json({ models: data.data });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || "Failed to fetch models" });
  }
}