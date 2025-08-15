import { IconButton } from "./iconButton";
import { Message } from "@/features/messages/messages";
import { ChatLog } from "./chatLog";
import React, { useCallback, useContext, useRef, useState } from "react";
import { Settings } from "./settings";
import { ViewerContext } from "@/features/vrmViewer/viewerContext";
import { AssistantText } from "./assistantText";

type Props = {
  openAiKey: string;
  lmStudioUrl: string;
  lmStudioModel: string;
  systemPrompt: string;
  chatLog: Message[];
  speakerId: number;
  assistantMessage: string;
  onChangeSystemPrompt: (systemPrompt: string) => void;
  onChangeAiKey: (key: string) => void;
  onChangeLmStudioUrl: (key: string) => void;
  onChangeLmStudioModel: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onChangeChatLog: (index: number, text: string) => void;
  onChangeSpeakerId: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  handleClickResetChatLog: () => void;
  handleClickResetSystemPrompt: () => void;
};
export const Menu = ({
  openAiKey,
  lmStudioUrl,
  lmStudioModel,
  systemPrompt,
  chatLog,
  speakerId,
  assistantMessage,
  onChangeSystemPrompt,
  onChangeAiKey,
  onChangeLmStudioUrl,
  onChangeLmStudioModel,
  onChangeChatLog,
  onChangeSpeakerId,
  handleClickResetChatLog,
  handleClickResetSystemPrompt,
}: Props) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showChatLog, setShowChatLog] = useState(false);
  const { viewer } = useContext(ViewerContext);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChangeSystemPrompt = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChangeSystemPrompt(event.target.value);
    },
    [onChangeSystemPrompt]
  );

  const handleAiKeyChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChangeAiKey(event.target.value);
    },
    [onChangeAiKey]
  );

  const handleLmStudioUrlChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChangeLmStudioUrl(event.target.value);
    },
    [onChangeLmStudioUrl]
  );

  const handleClickOpenVrmFile = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleChangeVrmFile = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files) return;

      const file = files[0];
      if (!file) return;

      const file_type = file.name.split(".").pop();

      if (file_type === "vrm") {
        const blob = new Blob([file], { type: "application/octet-stream" });
        const url = window.URL.createObjectURL(blob);
        viewer.loadVrm(url);
      }

      event.target.value = "";
    },
    [viewer]
  );

  return (
    <>
      <div className="absolute z-10 m-24">
        <div className="grid grid-flow-col gap-[8px]">
          <IconButton
            iconName="24/Menu"
            label="設定"
            isProcessing={false}
            onClick={() => setShowSettings(true)}
          ></IconButton>
          {showChatLog ? (
            <IconButton
              iconName="24/CommentOutline"
              label="会話ログ"
              isProcessing={false}
              onClick={() => setShowChatLog(false)}
            />
          ) : (
            <IconButton
              iconName="24/CommentFill"
              label="会話ログ"
              isProcessing={false}
              disabled={chatLog.length <= 0}
              onClick={() => setShowChatLog(true)}
            />
          )}
        </div>
      </div>
      {showChatLog && <ChatLog messages={chatLog} />}
      {showSettings && (
        <Settings
          openAiKey={openAiKey}
          lmStudioUrl={lmStudioUrl}
          lmStudioModel={lmStudioModel}
          chatLog={chatLog}
          systemPrompt={systemPrompt}
          speakerId={speakerId}
          onClickClose={() => setShowSettings(false)}
          onChangeAiKey={handleAiKeyChange}
          onChangeLmStudioUrl={handleLmStudioUrlChange}
          onChangeLmStudioModel={onChangeLmStudioModel}
          onChangeSystemPrompt={handleChangeSystemPrompt}
          onChangeChatLog={onChangeChatLog}
          onChangeSpeakerId={onChangeSpeakerId}
          onClickOpenVrmFile={handleClickOpenVrmFile}
          onClickResetChatLog={handleClickResetChatLog}
          onClickResetSystemPrompt={handleClickResetSystemPrompt}
        />
      )}
      {!showChatLog && assistantMessage && (
        <AssistantText message={assistantMessage} />
      )}
      <input
        type="file"
        className="hidden"
        accept=".vrm"
        ref={fileInputRef}
        onChange={handleChangeVrmFile}
      />
    </>
  );
};
