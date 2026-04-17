import { IconButton } from "./iconButton";

type Props = {
  userMessage: string;
  isMicRecording: boolean;
  isChatProcessing: boolean;
  isSttEnabled: boolean;
  isVisionEnabled: boolean;
  onChangeUserMessage: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onClickSendButton: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onClickMicButton: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onClickSttToggle: () => void;
  onClickVisionToggle: () => void;
};
export const MessageInput = ({
  userMessage,
  isMicRecording,
  isChatProcessing,
  isSttEnabled,
  isVisionEnabled,
  onChangeUserMessage,
  onClickMicButton,
  onClickSendButton,
  onClickSttToggle,
  onClickVisionToggle,
}: Props) => {
  return (
    <div className="absolute bottom-0 z-20 w-screen">
      <div className="bg-base text-black">
        <div className="mx-auto max-w-4xl p-16">
          <div className="grid grid-flow-col gap-[8px] grid-cols-[repeat(auto-fill,min-content)_1fr_min-content]">
            <IconButton
              iconName="24/Microphone"
              className={
                isSttEnabled
                  ? "bg-primary hover:bg-primary-hover active:bg-primary-press"
                  : "bg-surface3 hover:bg-surface3-hover active:bg-surface3-press text-secondary"
              }
              isProcessing={false}
              disabled={isChatProcessing}
              onClick={onClickSttToggle}
              label={isSttEnabled ? "STT ON" : "STT OFF"}
            />
            {isSttEnabled && (
              <IconButton
                iconName="24/Dot"
                className="bg-secondary hover:bg-secondary-hover active:bg-secondary-press disabled:bg-secondary-disabled"
                isProcessing={isMicRecording}
                disabled={isChatProcessing}
                onClick={onClickMicButton}
                label={isMicRecording ? "録音中..." : "録音"}
              />
            )}
            <IconButton
              iconName="24/Camera"
              className={
                isVisionEnabled
                  ? "bg-primary hover:bg-primary-hover active:bg-primary-press"
                  : "bg-surface3 hover:bg-surface3-hover active:bg-surface3-press text-secondary"
              }
              isProcessing={false}
              disabled={isChatProcessing}
              onClick={onClickVisionToggle}
              label={isVisionEnabled ? "Vision ON" : "Vision OFF"}
            />
            <input
              type="text"
              placeholder="聞きたいことをいれてね"
              onChange={onChangeUserMessage}
              disabled={isChatProcessing}
              className="bg-surface1 hover:bg-surface1-hover focus:bg-surface1 disabled:bg-surface1-disabled disabled:text-primary-disabled rounded-16 w-full px-16 text-text-primary typography-16 font-bold disabled"
              value={userMessage}
            ></input>

            <IconButton
              iconName="24/Send"
              className="bg-secondary hover:bg-secondary-hover active:bg-secondary-press disabled:bg-secondary-disabled"
              isProcessing={isChatProcessing}
              disabled={isChatProcessing || !userMessage}
              onClick={onClickSendButton}
            />
          </div>
        </div>
        <div className="py-4 bg-[#413D43] text-center text-white font-Montserrat">
          powered by VRoid, VOICEVOX, LM Studio
        </div>
      </div>
    </div>
  );
};
