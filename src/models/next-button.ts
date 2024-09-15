export interface NextButton {
  isWheelSpinRequested: boolean;
  isShowStarted: boolean;
  showCoverMessage: boolean;
  handleNextButtonClick: () => void;
  setIsWheelSpinRequested: (value: boolean) => void;
  setShowCoverMessage: (value: boolean) => void;
}
