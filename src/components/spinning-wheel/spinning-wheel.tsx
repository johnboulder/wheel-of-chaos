import React, {CSSProperties, useCallback, useEffect, useState} from "react"
import './spinning-wheel.scss';
import {
  detectSegmentIntersection,
  getContentSkewY,
  getNextSpinSegment,
  getRotationDegreesOfNextSegment,
  getScale, getSegmentSearchInfo,
  getSegmentSize,
  getSkewY,
  getTransformOrigin,
  getWidthAndHeight
} from "./wheel-utils";
import {Transition} from "react-transition-group";
import {useTransitionStyle} from "./use-transition-style";
import skullIcon from '../../assets/skull_icon.svg';
import laughingIcon from '../../assets/laughing-icon.svg';
import {ShowCover} from "../show-cover/show-cover";
import {usePressObserver} from "../../utils/use-press-observer";
import {SegmentDetector} from "./segment-detector";

const performerList: string[] = [
  'Jarell Barnes',
  'Maddie Daviss',
  'Emily Ogle',
  'Megan McMurtry',
  'Zach Dietsch',
  'Sohrab Forouzesh',
  'Max Shanker',
];

const punishmentList: string[] = [
  'Normal Set',
  'Chaos Coaster',
  'Doggy Daycare',
  'Normal Set',
  'Blind and Bumpin',
  'Normal Set',
  'MULTI-PUNISHMENT',
];

const spinOrder: string[] = [
  'punishment',
  'punishment',
  'punishment',
  'punishment',
  'punishment',
  'punishment',
  'punishment',
];

const showCoverStyle: CSSProperties = {
  opacity: '100%',
  transition: 'ease-in-out 5s'
};

const hideCoverStyle: CSSProperties = {
  opacity: '0%',
  transition: 'ease-in-out 5s'
};

export interface Part {
  value: string;
  color: string;
  isPunishment: boolean;
}

export interface WheelProps {
  wheelValues: Part[];
}

export const SpinningWheel: React.FC<WheelProps> = (props: WheelProps) => {
  const {wheelValues} = props;

  const segmentSize = getSegmentSize(wheelValues.length);
  const [width, height] = getWidthAndHeight(wheelValues.length);
  const skewY = getSkewY(wheelValues.length);
  const scale = getScale(wheelValues.length);
  const contentSkewY = getContentSkewY(wheelValues.length);
  const contentRotation = segmentSize/2;
  const transformationOrigin = getTransformOrigin(wheelValues.length);
  const segmentSearchInfo = getSegmentSearchInfo(wheelValues);

  const wheelParts = wheelValues.map((part: Part, index: number) => {
    const segmentRotation = index * segmentSize;
    const partStyle: CSSProperties = {
      backgroundColor: `${part.color}`,
      transform: `rotate(${segmentRotation}deg) skewY(${skewY}) scale(${scale})`,
      width: `${width}%`,
      height: `${height}%`,
      transformOrigin: `${transformationOrigin}`
    };

    const contentStyle: CSSProperties = {
      paddingBottom: '125%',
      transform: `skewY(${contentSkewY}deg) rotate(${contentRotation}deg)`,
    };

    const imageAsset = part.isPunishment ? skullIcon : laughingIcon;
    const className = part.isPunishment ? 'skull' : 'happy';

    return (
      <div className='part' style={partStyle} key={index}>
        <div className='content' style={contentStyle}>
          <img className={className} alt={part.value} src={imageAsset}/>
        </div>
      </div>
    );
  });

  // TODO randomize the time spent spinning?
  const animationDuration = 5000;
  const [spinIterator, setSpinIterator] = useState<number>(0);
  const [nextAnimationDegrees, setNextAnimationDegrees] = useState<number>(0);

  const defaultStyle: CSSProperties = {
    transform: `rotate(${nextAnimationDegrees}deg)`,
    transition: `cubic-bezier(.42,1.12,.84,.99) ${animationDuration}ms`,
  };

  const [transitionStyles, setTransitionStyles] = useTransitionStyle(nextAnimationDegrees);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [showCoverMessage, setShowCoverMessage] = useState<boolean>(false);

  const [isSpacebarPressed, setIsSpacebarPressed] = usePressObserver("space");

  const hideShowCoverCallback = () => {
    if(showCoverMessage) {
      setShowCoverMessage(!showCoverMessage);
      setIsSpacebarPressed(false);
    }
  };

  const memoizedHideShowCoverCallback = useCallback(hideShowCoverCallback, [showCoverMessage]);

  useEffect(() => {
    if (isSpacebarPressed) {
      const nextSpinSegment = getNextSpinSegment(segmentSearchInfo, spinOrder[spinIterator]);
      const updatedNextAnimationDegrees = getRotationDegreesOfNextSegment(nextAnimationDegrees, nextSpinSegment);
      setNextAnimationDegrees(updatedNextAnimationDegrees);
      setIsSpinning(!isSpinning);
    }
  }, [isSpacebarPressed]);

  useEffect(() => {
    console.log(`Next Animation Degrees: ${nextAnimationDegrees}`);
    setTransitionStyles(nextAnimationDegrees);
  }, [nextAnimationDegrees]);

  const endListener = (node: HTMLElement, done: any) => {
    node.addEventListener('transitionend', (e) => {
      detectSegmentIntersection(e, done);

      // TODO if spin iterator is greater than spin order, we need to have an end animation or something
      setSpinIterator(spinIterator + 1);
      setShowCoverMessage(!showCoverMessage);
    }, false);
  }

  return (
    <>
      <div className='wheel-container'>
        <SegmentDetector/>
        <Transition<undefined> in={isSpinning} timeout={animationDuration} addEndListener={endListener}>
          {state => (
            <div className='wheel' style={{
              ...defaultStyle,
              // @ts-ignore
              ...transitionStyles[state]
            }}>
              {wheelParts}
            </div>
          )}
        </Transition>
      </div>
      <div style={showCoverMessage ? showCoverStyle : hideCoverStyle}>
        <ShowCover callback={memoizedHideShowCoverCallback}>
          <div className='comic'>{performerList[spinIterator - 1]}</div>
          <div className='punishment'>{punishmentList[spinIterator - 1]}</div>
        </ShowCover>
      </div>
    </>
  );
};
