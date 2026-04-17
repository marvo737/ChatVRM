import { MessageInput } from "@/components/messageInput";
import { useState, useEffect, useCallback } from "react";
import {
  startRecording,
  stopRecording,
  transcribeAudio,
} from "@/features/stt/stt";

type Props = {
  isChatProcessing: boolean;
  isSttEnabled: boolean;
  isVisionEnabled: boolean;
  whisperUrl: string;
  onChatProcessStart: (text: string) => void;
  onToggleStt: () => void;
  onToggleVision: () => void;
};

export const MessageInputContainer = ({
  isChatProcessing,
  isSttEnabled,
  isVisionEnabled,
  whisperUrl,
  onChatProcessStart,
  onToggleStt,
  onToggleVision,
}: Props) => {
  const [userMessage, setUserMessage] = useState("");
  const [isMicRecording, setIsMicRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const handleClickMicButton = useCallback(async () => {
    if (isMicRecording) {
      setIsMicRecording(false);
      setIsTranscribing(true);

      const audioBlob = await stopRecording();
      if (audioBlob && whisperUrl) {
        try {
          const text = await transcribeAudio(audioBlob, whisperUrl);
          if (text) {
            setUserMessage(text);
            onChatProcessStart(text);
          }
        } catch (e) {
          console.error("Transcription failed:", e);
        }
      }

      setIsTranscribing(false);
      return;
    }

    const started = await startRecording();
    if (started) {
      setIsMicRecording(true);
    }
  }, [isMicRecording, whisperUrl, onChatProcessStart]);

  const handleClickSendButton = useCallback(() => {
    onChatProcessStart(userMessage);
  }, [onChatProcessStart, userMessage]);

  useEffect(() => {
    if (!isChatProcessing) {
      setUserMessage("");
    }
  }, [isChatProcessing]);

  return (
    <MessageInput
      userMessage={userMessage}
      isChatProcessing={isChatProcessing}
      isMicRecording={isMicRecording || isTranscribing}
      isSttEnabled={isSttEnabled}
      isVisionEnabled={isVisionEnabled}
      onChangeUserMessage={(e) => setUserMessage(e.target.value)}
      onClickMicButton={handleClickMicButton}
      onClickSendButton={handleClickSendButton}
      onClickSttToggle={onToggleStt}
      onClickVisionToggle={onToggleVision}
    />
  );
};
