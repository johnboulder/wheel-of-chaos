import {CSSProperties, useState} from "react";

export type UseTransitionStyle = [TransitionState, SetTransitionStyleCallback];

export type SetTransitionStyleCallback = (animationDegrees: number) => void;

export type TransitionState = {
  'entering': CSSProperties,
  'entered': CSSProperties,
  'exiting': CSSProperties,
  'exited': CSSProperties,
};

export const useTransitionStyle = (animationDegrees: number): UseTransitionStyle => {
  const [transitionStyles, setTransitionStyleState] = useState(
    {
      entering: {transform: `rotate(${animationDegrees}deg)`},
      entered: {transform: `rotate(${animationDegrees}deg)`},
      exiting: {transform: `rotate(${animationDegrees}deg)`},
      exited: {transform: `rotate(${animationDegrees}deg)`},
    }
  );

  const setTransitionStyle = (updatedAnimationDegrees: number): void => {
    setTransitionStyleState({
      entering: {transform: `rotate(${updatedAnimationDegrees}deg)`}, // first position after resting
      entered: {transform: `rotate(${updatedAnimationDegrees}deg)`}, // second position after resting
      exiting: {transform: `rotate(${updatedAnimationDegrees}deg)`}, // third position after resting
      exited: {transform: `rotate(${updatedAnimationDegrees}deg)`}, // resting start
    })
  };

  return [transitionStyles, setTransitionStyle];
};
