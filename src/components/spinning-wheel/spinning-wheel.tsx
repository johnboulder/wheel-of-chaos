import React, {CSSProperties, useCallback, useContext, useEffect, useState} from "react"
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
import {SegmentDetector} from "./segment-detector";
import triPoloskiMusic from "../../assets/audio/tri_poloski.mp3";
import useSound from "use-sound";
import {Ticker} from "../ticker/ticker";
import {useMeasure, useWindowSize} from "react-use";
import {SHOW_SETTINGS} from '../../utils/cookie-utils';
import {NextButtonContext, ShowSettingsContext} from '../../App';

/**
 * TODO
 * - Show Flow
 *  - Add forward button
 *  - Save current state of show in cookies, and load it when the site opens (this will allow us to change a performer name mid show)
 *  - Add backward button
 *  - Update punishment page so we don't have to navigate away from the app to administer punishments
 *
 * - Settings Form
 *  - Add "Reset to Defaults" button
 *  - Add preconfigured punishments
 *
 * - Look and feel
 *  - Change wheel segment creation logic so the same color never appears next to each other
 *  - Update background with spinner image?
 *  - Show skull when show ends
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
  const {wheelValues, performerList, punishmentList, spinOrder} = useContext(ShowSettingsContext);
  const {isWheelSpinRequested, showCoverMessage, setIsWheelSpinRequested, setShowCoverMessage} = useContext(NextButtonContext);

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
  const [playSpinMusic, { stop: stopSpinMusic }] = useSound(triPoloskiMusic);

  useEffect(() => {
    if (isWheelSpinRequested) {
      const nextSpinSegment = getNextSpinSegment(segmentSearchInfo, spinOrder[spinIterator]);
      const updatedNextAnimationDegrees = getRotationDegreesOfNextSegment(nextAnimationDegrees, nextSpinSegment);
      setNextAnimationDegrees(updatedNextAnimationDegrees);
      setIsSpinning(!isSpinning);
      playSpinMusic({})
    }
  }, [isWheelSpinRequested]);

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
          <ShowCover>
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
