// style="background-color: rgb(218, 247, 166); width: 100%; height: 100%; transform-origin: 50% 50%; transform: rotate(45deg) skewX(-30deg) skewY(-30deg) translateY(-50%) translateX(-50%);"

import {Part} from "./spinning-wheel";
import {SEGMENT_DETECTOR_CLASS} from "./constants";
import {PunishmentSelectionType} from '../../cookies/show-settings';

export interface SegmentSearchInfo {
  lower: number;
  upper: number;
  isPunishment: boolean;
}

/**
 * A multiple of 360.
 * This represents the base number of wheel rotations we use for each spin. Enough that it looks like a natural spin.
 */
export const DEFAULT_ANIMATION_ROTATION_CONSTANT: number = 360 * 12;


/**
 * The size, in degrees, of each segment of the circle.
 * Found by dividing 360 by the number of segments.
 *
 * @param segmentCount The desired number of wheel segments.
 */
export const getSegmentSize = (segmentCount: number): number => {
  return (360 / segmentCount);
};

/**
 * Skew refers to how much we are distorting the geometric plane of the object. We represent this value in degrees.
 * Assuming each piece of the circle is a square, and has a 90 degree angle by default, the value returned here
 * represents the degrees needed to subtract from 90 to fill the piece of the circle it's responsible for.
 *
 * i.e. If we have 9 segments, each would be rotated by 40 degrees, and the skew would be -50 since we want the
 * corners of the square to appear at 40 degrees.
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

/**
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

/**
 * NOT IMPLEMENTED - RETURNS A CONSTANT VALUE
 */
export const getWidthAndHeight = (segmentCount: number): number[] => {
  return [50, 50];
};

/**
 * TODO can't tell if this is implemented, need to revisit it.
 */
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

/**
 *
 */
export const getTransformOrigin = (segmentCount: number): string => {
  if (segmentCount === 1) {
    return '50% 50%';
  } else if (segmentCount === 2) {
    return '0 50%';
  }

  return '0 100%'
};

/**
 * Creates an array of objects representing wheel segments that simplify the calculations we perform to find things
 * like where the next segment is relative to the current wheel position, and how the wheel should spin to make it
 * to that segment.
 *
 * @param wheelValues An array of objects representing visual components of the wheel segments.
 *
 * @returns Array of SegmentSearchInfo objects that represent each individual segment of the wheel.
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

/**
 * Gets the info of the next segment that the wheel will land on, at random, based on whether the segment is a
 * safe or punishment segment.
 *
 * @param segmentSearchInfo The array of SegmentSearchInfo objects that represent the wheel.
 * @param nextSpinType String representing the type of the next segment we wish to land on. ("punishment" or "safe")
 *
 * @returns The SegmentSearchInfo object representing the next segment the wheel should land on.
 */
export const getNextSpinSegment = (
    segmentSearchInfo: SegmentSearchInfo[],
    nextSpinType: string
): SegmentSearchInfo => {
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

/**
 * Using
 */
export const getWheelSegmentIntersectionId = (): string => {
  const segmentDetector = document.querySelector(`.${SEGMENT_DETECTOR_CLASS}`);
  const wheelParts = document.querySelectorAll('.part');
  let partId = '';
  let intersectedPart: Element | undefined;
  wheelParts.forEach((part) => {
    const detectorRectangle = segmentDetector!.getBoundingClientRect();
    const partRectangle = part.getBoundingClientRect();

    if (
      detectorRectangle.x < partRectangle.x + partRectangle.width &&
      detectorRectangle.x + detectorRectangle.width > partRectangle.x &&
      detectorRectangle.y < partRectangle.y + partRectangle.height &&
      detectorRectangle.y + detectorRectangle.height > partRectangle.y
    ) {
      console.log("Elements touch each other");
      intersectedPart = part;
    } else {
      console.log("Elements do not touch each other");
    }
  });

  if(intersectedPart) {
    partId = intersectedPart.id
  }

  return partId;
};

export const randomIntFromInterval = (min: number, max: number) => {
  let value = Math.floor(Math.random() * (max - min + 1) + min);
  // If value is in the exact middle, keep randomizing. (we want the illusion of natural behavior)
  while(Math.abs((max - min + 1 )/2) <= 5) {
    value = Math.floor(Math.random() * (max - min + 1) + min);
  }

  return value;
}

/**
 * Finds the numeric value in degrees of the wheel's next resting position.
 *
 * Does this by getting a random value between the start and end positions of the nextSpinSegment,
 *
 * @param startPositionDegrees The numeric value in degrees of the starting position of the spin being performed.
 * @param nextSpinSegment The information representing the next segment we wish to have the wheel land on.
 * @param baseRotationValueDegrees The minimum number of full rotations to perform. Defaults to DEFAULT_ANIMATION_ROTATION_CONSTANT
 */
export const getRotationDegreesOfNextSegment = (
    startPositionDegrees: number,
    nextSpinSegment: SegmentSearchInfo,
    baseRotationValueDegrees: number = DEFAULT_ANIMATION_ROTATION_CONSTANT) => {
  let randomIntervalValue: number = randomIntFromInterval(nextSpinSegment.lower, nextSpinSegment.upper);

  if(randomIntervalValue < nextSpinSegment.lower || randomIntervalValue > nextSpinSegment.upper) {
    console.log('Interval value is outside of interval bounds!');
    console.log(`Interval value: ${randomIntervalValue}`);
    console.log(`lower bound: ${nextSpinSegment.lower} | upper bound: ${nextSpinSegment.upper}`);
  }

  const remainder: number = startPositionDegrees % baseRotationValueDegrees;
  const runningRotationTotal: number = startPositionDegrees - remainder;

  console.log(`animationRotationConstant: ${baseRotationValueDegrees}`);
  console.log(`runningRotationTotal: ${runningRotationTotal}`);
  console.log(`randomIntervalValue: ${randomIntervalValue}`);

  return baseRotationValueDegrees + runningRotationTotal + randomIntervalValue;
};

export const getAssignedPunishment = (
  performerIndex: number,
  punishmentList: string[],
  punishmentSelectionTypeList: string[],
  randomPunishmentPool: string[],
  updatePunishmentPoolCallback: (punishmentPool: string[]) => void
) => {
  const punishmentSelectionType = punishmentSelectionTypeList[performerIndex];
  if(punishmentSelectionType === PunishmentSelectionType.IN_ORDER) {
    return punishmentList[performerIndex];
  } else {
    const randomIndex = Math.floor(Math.random() * randomPunishmentPool.length);
    const punishment = randomPunishmentPool[randomIndex];
    updatePunishmentPoolCallback(randomPunishmentPool.splice(randomIndex, 1));
    return punishment;
  }
};
