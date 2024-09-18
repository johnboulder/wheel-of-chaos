export interface NextButton {
  isWheelSpinRequested: boolean;
  isShowStarted: boolean;
  showCoverMessage: boolean;
  handleNextButtonClick: () => void;
  setIsWheelSpinRequested: (value: boolean) => void;
  setShowCoverMessage: (value: boolean) => void;
}

export const DEFAULT_NEXT_BUTTON_CONTEXT: NextButton = {
  isWheelSpinRequested: false,
  isShowStarted: false,
  showCoverMessage: false,
  handleNextButtonClick: () => {},
  setIsWheelSpinRequested: () => {},
  setShowCoverMessage: () => {},
};
