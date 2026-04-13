import React from "react";
import { IconButton } from "./iconButton";
import { TextButton } from "./textButton";
import { Message } from "@/features/messages/messages";
import { VOICEVOX_SPEAKERS } from "@/features/constants/voicevoxSpeakers";

type Props = {
  lmStudioUrl: string;
  lmStudioModel: string;
  systemPrompt: string;
  chatLog: Message[];
  speakerId: number;
  onClickClose: () => void;
  onChangeLmStudioUrl: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeLmStudioModel: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onChangeSystemPrompt: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onChangeChatLog: (index: number, text: string) => void;
  onClickOpenVrmFile: () => void;
  onClickResetChatLog: () => void;
  onClickResetSystemPrompt: () => void;
  onChangeSpeakerId: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};
export const Settings = ({
  lmStudioUrl,
  lmStudioModel,
  chatLog,
  systemPrompt,
  speakerId,
  onClickClose,
  onChangeSystemPrompt,
  onChangeLmStudioUrl,
  onChangeLmStudioModel,
  onChangeChatLog,
  onClickOpenVrmFile,
  onClickResetChatLog,
  onClickResetSystemPrompt,
  onChangeSpeakerId,
}: Props) => {
  const [models, setModels] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (lmStudioUrl) {
      fetch(`/api/lm-studio-models?baseUrl=${encodeURIComponent(lmStudioUrl)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.models) {
            setModels(data.models.map((m: any) => m.id));
          }
        })
        .catch(console.error);
    }
  }, [lmStudioUrl]);

  return (
    <div className="absolute z-40 w-full h-full bg-white/80 backdrop-blur ">
      <div className="absolute m-24">
        <IconButton
          iconName="24/Close"
          isProcessing={false}
          onClick={onClickClose}
        ></IconButton>
      </div>
      <div className="max-h-full overflow-auto">
        <div className="text-text1 max-w-3xl mx-auto px-24 py-64 ">
          <div className="my-24 typography-32 font-bold">設定</div>
          <div className="my-24">
            <div className="my-16 typography-20 font-bold">LM Studio</div>
            <div className="my-8">
              <div className="typography-16 font-bold">API URL</div>
              <input
                className="text-ellipsis px-16 py-8 w-full bg-surface1 hover:bg-surface1-hover rounded-8"
                type="text"
                placeholder="http://localhost:1234/v1"
                value={lmStudioUrl}
                onChange={onChangeLmStudioUrl}
              />
            </div>
            {models.length > 0 && (
              <div className="my-8">
                <div className="typography-16 font-bold">Model</div>
                <select
                  value={lmStudioModel}
                  onChange={onChangeLmStudioModel}
                  className="px-16 py-8 w-full bg-surface1 hover:bg-surface1-hover rounded-8"
                >
                  {models.map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="my-8">
              ローカルで起動したLM StudioのAPIエンドポイントとモデルを選択してください。
            </div>
          </div>
          <div className="my-40">
            <div className="my-16 typography-20 font-bold">
              キャラクターモデル
            </div>
            <div className="my-8">
              <TextButton onClick={onClickOpenVrmFile}>VRMを開く</TextButton>
            </div>
          </div>
          <div className="my-40">
            <div className="my-8">
              <div className="my-16 typography-20 font-bold">
                キャラクター設定（システムプロンプト）
              </div>
              <TextButton onClick={onClickResetSystemPrompt}>
                キャラクター設定リセット
              </TextButton>
            </div>

            <textarea
              value={systemPrompt}
              onChange={onChangeSystemPrompt}
              className="px-16 py-8  bg-surface1 hover:bg-surface1-hover h-168 rounded-8 w-full"
            ></textarea>
          </div>
          <div className="my-40">
            <div className="my-16 typography-20 font-bold">声の選択</div>
            <select
              value={speakerId}
              onChange={onChangeSpeakerId}
              className="px-16 py-8 bg-surface1 hover:bg-surface1-hover rounded-8"
            >
              {VOICEVOX_SPEAKERS.map((speaker) => (
                <option key={speaker.id} value={speaker.id}>
                  {speaker.name}
                </option>
              ))}
            </select>
          </div>
          {chatLog.length > 0 && (
            <div className="my-40">
              <div className="my-8 grid-cols-2">
                <div className="my-16 typography-20 font-bold">会話履歴</div>
                <TextButton onClick={onClickResetChatLog}>
                  会話履歴リセット
                </TextButton>
              </div>
              <div className="my-8">
                {chatLog.map((value, index) => {
                  return (
                    <div
                      key={index}
                      className="my-8 grid grid-flow-col  grid-cols-[min-content_1fr] gap-x-fixed"
                    >
                      <div className="w-[64px] py-8">
                        {value.role === "assistant" ? "Character" : "You"}
                      </div>
                      <input
                        key={index}
                        className="bg-surface1 hover:bg-surface1-hover rounded-8 w-full px-16 py-8"
                        type="text"
                        value={value.content}
                        onChange={(event) => {
                          onChangeChatLog(index, event.target.value);
                        }}
                      ></input>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
