// style="background-color: rgb(218, 247, 166); width: 100%; height: 100%; transform-origin: 50% 50%; transform: rotate(45deg) skewX(-30deg) skewY(-30deg) translateY(-50%) translateX(-50%);"

import {CSSProperties} from "react";
import {Part} from "./spinning-wheel";
import {Transition} from "react-transition-group";

const partStyleThreeSegments: CSSProperties = {
  // where transformations are applied on the object
  // rotate - 45deg is the base rotation, and we use a multiple of 120 (since each shape accounts for 120deg)
  // skewX and skewY - we're subtracting 30 degrees from each side of the shape (which makes 180deg by default) to create a 120deg angle
  // translate - we subtract 50% of the shape's distance on the x and y axis to move the point to the center where it meets the other shapes of the pie
  transform: 'translateY(-50%) rotate(0deg) skewY(60deg);',
  width: '50%',
  height: '100%',
};

export const getPartCommonStyle = () => {
  // width: 100%; height: 100%;
  // transform-origin: 50% 50%;
  // transform: rotate(45deg) skewX(-30deg) skewY(-30deg) translateY(-50%) translateX(-50%);"


};

/*
* The size, in degrees, of each segment of the circle.
* Found by dividing 360 by the number of segments.
*/
export const getSegmentSize = (segmentCount: number): number => {
  return (360 / segmentCount);
};

/*
* Skew refers to how much we are distorting the geometric plane of the object by.
* We represent this value in degrees.
* Assuming each piece of the circle is a square, and has a 90 degree angle by default
* The value returned here represents the degrees needed to subtract from 90 to fill
* the piece of the circle it's responsible for.
* i.e. If we have 9 segments, each would be rotated by 40 degrees, and the skew would be -50
* since we want the corners of the square to appear at 40 degrees.
*/
export const getSkewY = (segmentCount: number): string => {
  const segmentSize = getSegmentSize(segmentCount);
  if (segmentCount === 1) {
    return '0deg';
  }
  if (segmentCount === 2) {
    return '0deg';
  } else if (segmentCount === 3) {
    return '30deg';
  }

  return `-${90 - segmentSize}deg`;
};

/*
* Represents the same kind of value as skewY, but with respect to the content
* displayed within each circle segment. Since each segment is skewed to some degree,
* the content inside is skewed by the number we subtract from 90, so we simply
* need to calculate this, and add it back.
*/
export const getContentSkewY = (segmentCount: number): number => {
  const segmentSize = getSegmentSize(segmentCount);
  if (segmentCount === 1) {
    return 0;
  }
  if (segmentCount === 2) {
    return 0;
  } else if (segmentCount === 3) {
    return -30;
  }

  return 90 - segmentSize;
};

export const getWidthAndHeight = (segmentCount: number): number[] => {
  return [50, 50];
};

export const getScale = (segmentCount: number): string => {
  if (segmentCount === 1) {
    return '1';
  } else if (segmentCount === 2) {
    return '1.5';
  } else if (segmentCount === 3) {
    return '1.5';
  }

  return '1';
};

export const getTransformOrigin = (segmentCount: number): string => {
  if (segmentCount === 1) {
    return '50% 50%';
  } else if (segmentCount === 2) {
    return '0 50%';
  }

  return '0 100%'
};

export interface SegmentSearchInfo {
  lower: number;
  upper: number;
  isPunishment: boolean;
}

/*
*
*/
export const getSegmentSearchInfo = (wheelValues: Part[]): SegmentSearchInfo[] => {
  const segmentCount = wheelValues.length;
  const segmentSearchInfo: SegmentSearchInfo[] = [];
  const segmentSize = getSegmentSize(segmentCount);

  // Start from the last position, since (when we rotate clockwise) it's the first segment we encounter
  for(let i = segmentCount - 1; i > 0; i--) {
    const lower = (segmentSize * (segmentCount - (i + 1))) + 1; // 1 = (60 * (6 - (5 + 1))) + 1
    const upper = ((segmentCount - (i + 1)) + 1) * segmentSize; // 60 = ((6 - (5 + 1)) + 1) * 60;
    const {isPunishment} = wheelValues[i];

    segmentSearchInfo.push({lower, upper, isPunishment});
  }

  return segmentSearchInfo;
};

export const getNextSpinSegment = (segmentSearchInfo: SegmentSearchInfo[], spinOrder: string[], nextSpinType: string): SegmentSearchInfo => {
  const punishmentIndexes: number[] = [];
  const safeIndexes: number[] = [];

  for(let index = 0; index < segmentSearchInfo.length; index++) {
    const value = segmentSearchInfo[index];
    if(value.isPunishment) {
      punishmentIndexes.push(index);
    } else {
      safeIndexes.push(index);
    }
  }

  let indexArray = punishmentIndexes;
  if(nextSpinType !== 'punishment') {
    indexArray = safeIndexes;
  }

  const indexOfIndexArray = Math.floor(Math.random() * indexArray.length);
  const indexOfChosenSegment = indexArray[indexOfIndexArray];
  const chosenSegmentData = segmentSearchInfo[indexOfChosenSegment];
  return chosenSegmentData;
};

export const detectSegmentIntersection = (e: TransitionEvent, done: any) => {
  const segmentDetector = document.querySelector('.segment-detector');
  const rectangle = segmentDetector!.getBoundingClientRect();
  const x = rectangle.left;
  const y = rectangle.top;

  const segment = document.elementFromPoint(x, y);

  const segmentMessage = segment!.textContent;
  console.log(`The user has landed on: ${segmentMessage}`);
  done(e);
};

export const randomIntFromInterval = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const getRotationDegreesOfNextSegment = (startPositionDegrees: number, animationRotationConstant: number, nextSpinSegment: SegmentSearchInfo) => {
  const randomIntervalValue = randomIntFromInterval(nextSpinSegment.lower, nextSpinSegment.upper);

  if(randomIntervalValue < nextSpinSegment.lower || randomIntervalValue > nextSpinSegment.upper) {
    console.log('Interval value is outsize of interval bounds!');
    console.log(`Interval value: ${randomIntervalValue}`);
    console.log(`lower bound: ${nextSpinSegment.lower} | upper bound: ${nextSpinSegment.upper}`);
  }

  const remainder = startPositionDegrees % animationRotationConstant;
  const runningRotationTotal = startPositionDegrees - remainder;

  console.log(`animationRotationConstant: ${animationRotationConstant}`);
  console.log(`runningRotationTotal: ${runningRotationTotal}`);
  console.log(`randomIntervalValue: ${randomIntervalValue}`);

  return animationRotationConstant + runningRotationTotal + randomIntervalValue;
};
