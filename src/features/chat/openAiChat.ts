import { Message } from "../messages/messages";

export async function getChatResponse(
  messages: Message[],
  apiKey: string,
  baseUrl?: string,
  model?: string
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (apiKey) {
    headers["Authorization"] = `Bearer ${apiKey}`;
  }

  const body: { model?: string; messages: Message[] } = {
    messages: messages,
  };

  body.model = model || "gpt-3.5-turbo";

  const completionsUrl = baseUrl
    ? `${new URL(baseUrl).protocol}//${new URL(baseUrl).host}/v1/chat/completions`
    : "https://api.openai.com/v1/chat/completions";

  const res = await fetch(
    completionsUrl,
    {
      headers: headers,
      method: "POST",
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    throw new Error("Something went wrong");
  }

  const data = await res.json();
  const [aiRes] = data.choices;
  const message = aiRes.message?.content || "エラーが発生しました";

  return { message: message };
}

export async function getChatResponseStream(
  messages: Message[],
  apiKey: string,
  baseUrl?: string,
  model?: string
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (apiKey) {
    headers["Authorization"] = `Bearer ${apiKey}`;
  }

  const body: {
    model?: string;
    messages: Message[];
    stream: boolean;
    max_tokens: number;
  } = {
    messages: messages,
    stream: true,
    max_tokens: 200,
  };

  body.model = model || "gpt-3.5-turbo";

  const completionsUrl = baseUrl
    ? `${new URL(baseUrl).protocol}//${new URL(baseUrl).host}/v1/chat/completions`
    : "https://api.openai.com/v1/chat/completions";

  const res = await fetch(
    completionsUrl,
    {
      headers: headers,
      method: "POST",
      body: JSON.stringify(body),
    }
  );

  const reader = res.body?.getReader();
  if (res.status !== 200 || !reader) {
    throw new Error("Something went wrong");
  }

  const stream = new ReadableStream({
    async start(controller: ReadableStreamDefaultController) {
      const decoder = new TextDecoder("utf-8");
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const data = decoder.decode(value);
          const chunks = data
            .split("data:")
            .filter((val) => !!val && val.trim() !== "[DONE]");
          for (const chunk of chunks) {
            const json = JSON.parse(chunk);
            const messagePiece = json.choices[0].delta.content;
            if (!!messagePiece) {
              controller.enqueue(messagePiece);
            }
          }
        }
      } catch (error) {
        controller.error(error);
      } finally {
        reader.releaseLock();
        controller.close();
      }
    },
  });

  return stream;
}
