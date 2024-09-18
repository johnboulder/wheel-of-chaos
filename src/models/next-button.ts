export interface NextButton {
  isWheelSpinRequested: boolean;
  isShowStarted: boolean;
  showCoverMessage: boolean;
  showPerformerName: boolean;
  handleNextButtonClick: () => void;
  setIsWheelSpinRequested: (value: boolean) => void;
  setShowPerformerName: (value: boolean) => void;
  setShowCoverMessage: (value: boolean) => void;
}

export const DEFAULT_NEXT_BUTTON_CONTEXT: NextButton = {
  isWheelSpinRequested: false,
  isShowStarted: false,
  showCoverMessage: false,
  showPerformerName: false,
  handleNextButtonClick: () => {},
  setIsWheelSpinRequested: () => {},
  setShowPerformerName: () => {},
  setShowCoverMessage: () => {},
};
