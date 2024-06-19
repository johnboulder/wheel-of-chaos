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
import skullIcon from '../../assets/skull.png';
import laughingIcon from '../../assets/laughing-icon.svg';
import {ShowCover} from "../show-cover/show-cover";
import {usePressObserver} from "../../utils/use-press-observer";
import {SegmentDetector} from "./segment-detector";
import triPoloskiMusic from "../../assets/audio/tri_poloski.mp3";
import useSound from "use-sound";
import {Ticker} from "../ticker/ticker";
import {useMeasure, useWindowSize} from "react-use";

const performerList: string[] = [
  'Joey Bednarski',
  'Sonal Aggarwal',
  'Jonathan Dunne and Bill Gevirtz',
  'Kerry Stevens',
  'Greg Kennedy',
  'Chris Higgins',
  'Queeny Chandler',
  'Bill Gevirtz',
];

const punishmentList: string[] = [
  'Say it Again!',
  'A Silly Costume!',
  'The Race!',
  'Severe Thunderstorm Warning!',
  'The Female Experience!',
  'The Future of Comedy!',
  'My Cousin Joey!',
  'The Execution!',
];

const spinOrder: string[] = [
  'punishment',
  'punishment',
  'punishment',
  'punishment',
  'punishment',
  'punishment',
  'punishment',
  'punishment',
];

/**
 * TODO
 * - Shorten spin time
 * - Shorten music
 * - Update background with spinner image
 * - Configure names and titles to appear within the window for any name length
 * - Disable spacebar scrolling
 */

const showCoverStyle: CSSProperties = {
  opacity: '100%',
  transition: 'ease-in-out 2s'
};

const hideCoverStyle: CSSProperties = {
  opacity: '0%',
  transition: 'ease-in-out 2s'
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
  const [playSpinMusic, { stop: stopSpinMusic }] = useSound(triPoloskiMusic);
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
      playSpinMusic({})
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
      stopSpinMusic();
    }, false);
  }

  const [fontSize, setFontSize] = useState<number>(8);
  const [ref, bounds] = useMeasure();
  const {width: windowWidth, height: windowHeight} = useWindowSize();
  const increaseFontSize = () => setFontSize((prev) => prev + 1);
  const decreaseFontSize = () => setFontSize((prev) => prev - 1);

  useEffect(() => {

    const THREE_QUARTERS = 3/4;
    const windowPercentage = bounds.width/windowWidth;

    if(showCoverMessage && isFinite(bounds.width) && bounds.width > windowWidth) {
      decreaseFontSize();
    }

    if(showCoverMessage && isFinite(windowPercentage) && windowPercentage < THREE_QUARTERS) {
      increaseFontSize();
    }


  }, [bounds.width, windowWidth, windowHeight]);

  return (
      <>
        <Ticker/>
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
            <div
                className='comic flow-text'
                //@ts-ignore
                ref={ref}
                style={{fontSize: `${fontSize}vmax`}}
            >
              {performerList[spinIterator - 1]}
            </div>
            <div
                className='punishment flow-text'
                style={{fontSize: `${fontSize}vmax`}}
            >
              {punishmentList[spinIterator - 1]}
            </div>
          </ShowCover>
        </div>
      </>
  );
};
