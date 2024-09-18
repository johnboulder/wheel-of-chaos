import React, {CSSProperties, useContext, useEffect, useState} from "react"
import './spinning-wheel.scss';
import {
  detectSegmentIntersection, getAssignedPunishment,
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
import {SegmentDetector} from "./segment-detector";
import triPoloskiMusic from "../../assets/audio/tri_poloski.mp3";
import useSound from "use-sound";
import {Ticker} from "../ticker/ticker";
import {useMeasure, useWindowSize} from "react-use";
import {NextButtonContext, ShowSettingsContext, ShowStateHistoryContext} from '../../App';
import {ShowState} from '../../cookies/show-state';
import {getActivePage} from '../../cookies/show-state-history-utils';
import {hideElementTransitionStyle, showElementTransitionStyle} from '../../utils/css-util';

/**
 * TODO
 *  - Show State
 *    - Use show-state to determine what to display to users when the app loads initially
 *    - Need a button in the settings to restart the show
 *  - Show Flow
 *   - Add backward button
 *  - Settings Form
 *   - Add "Reset to Defaults" button
 *   - Add preconfigured punishments
 *  - Look and feel
 *   - Change wheel spinning logic so we only land on segments we haven't landed on yet
 *   - Add purple to wheel segment colors
 *   - Change wheel segment creation logic so the same color never appears next to each other
 *   - Update background with spinner image?
 *   - Show skull when show ends
 *
 *  - Comedian name should appear somewhere before the wheel or the punishment are chosen.
 *    - Flow order: Comedian name -> Wheel + Comedian Name -> Punishment -> Punishment + Comedian Name
 *  - Add ability to return to previous state of show
 */

export interface Part {
  value: string;
  color: string;
  isPunishment: boolean;
}

export interface WheelProps {
  wheelValues: Part[];
}

export const SpinningWheel: React.FC<WheelProps> = (props: WheelProps) => {
  const {
    wheelValues,
    performerList,
    punishmentList,
    spinOrder,
    punishmentSelectionTypeList,
  } = useContext(ShowSettingsContext);

  const {
    isWheelSpinRequested,
    showCoverMessage,
    setIsWheelSpinRequested,
    setShowCoverMessage
  } = useContext(NextButtonContext);

  const {
    showStateHistory,
    setShowStateHistory
  } = useContext(ShowStateHistoryContext);

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
  const {
    performerIndex: performerIndexFromHistory,
    randomPunishmentPool,
    wheelRotationDegrees: wheelRotationDegreesFromHistory,
    pageState
  } = showStateHistory[showStateHistory.length - 1];

  // TODO randomize the time spent spinning?
  const animationDuration = 5000;
  const [spinIterator, setSpinIterator] = useState<number>(performerIndexFromHistory);
  const [nextAnimationDegrees, setNextAnimationDegrees] = useState<number>(wheelRotationDegreesFromHistory);
  const [assignedPunishment, setAssignedPunishment] = useState<string>(pageState.assignedPunishment);

  const defaultStyle: CSSProperties = {
    transform: `rotate(${nextAnimationDegrees}deg)`,
    transition: `cubic-bezier(.42,1.12,.84,.99) ${animationDuration}ms`,
  };

  const [transitionStyles, setTransitionStyles] = useTransitionStyle(nextAnimationDegrees);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [playSpinMusic, { stop: stopSpinMusic }] = useSound(triPoloskiMusic);

  const updateShowStateHistory = () => {
    const updatedShowStateHistory = showStateHistory;
    const latestUpdate: ShowState = {
      performerIndex: spinIterator,
      randomPunishmentPool: randomPunishmentPool.filter((punishment) => punishment !== assignedPunishment),
      activePage: getActivePage(showCoverMessage),
      wheelRotationDegrees: nextAnimationDegrees,
      pageState: {
        isShowStarted: true,
        showCoverMessage,
        assignedPunishment,
      }
    };
    console.log('History updated with: ', latestUpdate);
    updatedShowStateHistory.push(latestUpdate);

    setShowStateHistory({showStateHistory: updatedShowStateHistory});
  }

  useEffect(() => {
    updateShowStateHistory();
  }, [showCoverMessage]);

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

  const transitionEndListener = (node: HTMLElement, done: any) => {
    const eventListener = (e: TransitionEvent) => {
      detectSegmentIntersection(e, done);

      // TODO if spin iterator is greater than spin order, we need to have an end animation or something
      setSpinIterator(spinIterator + 1);
      setShowCoverMessage(!showCoverMessage);
      stopSpinMusic();
      setAssignedPunishment(
        getAssignedPunishment(
          spinIterator,
          punishmentList,
          punishmentSelectionTypeList,
          randomPunishmentPool,
          () => {}
        )
      )
      updateShowStateHistory();
      node.removeEventListener('transitionend', eventListener);
    };

    node.addEventListener('transitionend', eventListener, false);
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
          <Transition<undefined> in={isSpinning} timeout={animationDuration} addEndListener={transitionEndListener}>
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
        <div style={showCoverMessage ? showElementTransitionStyle : hideElementTransitionStyle}>
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
              {assignedPunishment}
            </div>
          </ShowCover>
        </div>
      </>
  );
};
