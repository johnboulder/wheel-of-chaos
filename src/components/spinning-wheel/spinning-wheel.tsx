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
import { useCookies } from 'react-cookie';
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
import {SHOW_SETTINGS} from '../../utils/cookie-utils';

/**
 * TODO
 * - Read spinOrder, punishmentList, and performerList from local memory or from cookies
 *  - Initialize the cookie when you land on the site
 *  - Update the cookie when you make edits to the show form
 *  - Read the cookie when the page loads
 *
 * - Update background with spinner image
 * - Configure names and titles to appear within the window for any name length
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

  const [cookies, setCookie, removeCookie] = useCookies([SHOW_SETTINGS]);

  const {performerList, punishmentList, spinOrder} = cookies[SHOW_SETTINGS];

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

  const [comicFontSize, setComicFontSize] = useState<number>(8);
  const [punishmentFontSize, setPunishmentFontSize] = useState<number>(8);
  const [comicRef, comicBounds] = useMeasure();
  const [punishmentRef, punishmentBounds] = useMeasure();
  const {width: windowWidth, height: windowHeight} = useWindowSize();
  const increaseComicFontSize = () => setComicFontSize((prev) => prev + 1);
  const decreaseComicFontSize = () => setComicFontSize((prev) => prev - 1);
  const increasePunishmentFontSize = () => setPunishmentFontSize((prev) => prev + 1);
  const decreasePunishmentFontSize = () => setPunishmentFontSize((prev) => prev - 1);

  useEffect(() => {

    const THREE_QUARTERS = 3/4;
    const comicPercentage = comicBounds.width/windowWidth;
    const punishmentPercentage = punishmentBounds.width/windowWidth;

    if(showCoverMessage && isFinite(comicBounds.width) && comicBounds.width > windowWidth) {
      decreaseComicFontSize();
    }

    if(showCoverMessage && isFinite(comicPercentage) && comicPercentage < THREE_QUARTERS) {
      increaseComicFontSize();
    }

    if(showCoverMessage && isFinite(punishmentBounds.width) && punishmentBounds.width > windowWidth) {
      decreasePunishmentFontSize();
    }

    if(showCoverMessage && isFinite(punishmentPercentage) && punishmentPercentage < THREE_QUARTERS) {
      increasePunishmentFontSize();
    }


  }, [comicBounds.width, punishmentBounds.width, windowWidth, windowHeight]);

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
                ref={comicRef}
                style={{fontSize: `${comicFontSize}vmax`}}
            >
              {performerList[spinIterator - 1]}
            </div>
            <div
                className='punishment flow-text'
                //@ts-ignore
                ref={punishmentRef}
                style={{fontSize: `${punishmentFontSize}vmax`}}
            >
              {punishmentList[spinIterator - 1]}
            </div>
          </ShowCover>
        </div>
      </>
  );
};
