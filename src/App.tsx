import React, {createContext, CSSProperties, useRef, useState} from 'react'

import {SpinningWheel} from "./components/spinning-wheel/spinning-wheel";
import './app.scss';
import {ShowCover} from "./components/show-cover/show-cover";
import titleWithSkull from './assets/title_with_skull.png';
import {useCookies} from 'react-cookie';
import {
  DEFAULT_SETTINGS,
  DEFAULT_SHOW_SETTINGS_CONTEXT,
  SHOW_SETTINGS,
  ShowSettings,
  ShowSettingsContextType
} from './utils/cookie-utils';
import Settings from './components/settings/settings';
import IconButton from './components/icon-button';
import {BsArrowRightSquareFill} from 'react-icons/bs';

export const ShowSettingsContext = createContext<ShowSettingsContextType>(DEFAULT_SHOW_SETTINGS_CONTEXT);


export interface NextButton {
  isWheelSpinRequested: boolean;
  isShowStarted: boolean;
  showCoverMessage: boolean;
  handleNextButtonClick: () => void;
  setIsWheelSpinRequested: (value: boolean) => void;
  setShowCoverMessage: (value: boolean) => void;
}

export const NextButtonContext = createContext<NextButton>({
  isWheelSpinRequested: false,
  isShowStarted: false,
  showCoverMessage: false,
  setIsWheelSpinRequested: () => {},
  setShowCoverMessage: () => {},
  handleNextButtonClick: () => {}
})

const App = () => {

  const [cookies, setCookie] = useCookies([SHOW_SETTINGS]);

  if(!cookies[SHOW_SETTINGS]) {
    setCookie(SHOW_SETTINGS, DEFAULT_SETTINGS);
  }

  const showSettings: ShowSettings = cookies[SHOW_SETTINGS];
  const [showSettingsContextState, setShowSettingsContextState] = useState<ShowSettings>(showSettings);
  const {wheelValues, performerCount, performerList, punishmentList, spinOrder} = showSettingsContextState;

  const handleShowSettingsUpdate = (updatedShowSettings: ShowSettings) => {
    setCookie(SHOW_SETTINGS, updatedShowSettings);
    setShowSettingsContextState(updatedShowSettings);
  };

  const [isShowStarted, setIsShowStarted] = useState<boolean>(false);
  const [isWheelSpinRequested, setIsWheelSpinRequested] = useState<boolean>(false);
  const [showCoverMessage, setShowCoverMessage] = useState<boolean>(false);

  const handleNextButtonClick = () => {
    if(!isShowStarted) {
      setIsShowStarted(true);
    } else {
      if(showCoverMessage) {
        setShowCoverMessage(false);
        setIsWheelSpinRequested(false);
      } else {
        setIsWheelSpinRequested(true);
      }
    }
  };

  const defaultStyle: CSSProperties = {
    opacity: '100%',
  };

  const hiddenStyle: CSSProperties = {
    opacity: '0%',
    transition: 'ease-in-out 2s'
  };

  // Disables spacebar from scrolling down the page when pressed
  window.addEventListener('keydown', function(e) {
    if(e.keyCode === 32 && e.target === document.body) {
      e.preventDefault();
    }
  });

  const target = useRef(null);

  return (
    <ShowSettingsContext.Provider value={{
      wheelValues,
      punishmentList,
      performerList,
      performerCount,
      spinOrder,
      setShowSettings: handleShowSettingsUpdate
    }}>
      <NextButtonContext.Provider value={{
        setIsWheelSpinRequested,
        handleNextButtonClick,
        isShowStarted,
        isWheelSpinRequested,
        showCoverMessage,
        setShowCoverMessage
      }}
      >
        <div ref={target}>
          {isShowStarted &&
              <>
                  <div className='d-flex row min-vh-100'>
                      <div className='show-title col-sm-5' style={{animation: '3s pulse ease-in-out infinite'}}>
                          <div>
                              <img className="title-image" alt="show title" src={titleWithSkull}/>
                          </div>
                      </div>
                      <div className='col-sm-2 align-content-center'>
                          <div className='d-flex justify-content-center'>
                              <SpinningWheel wheelValues={wheelValues}/>
                          </div>
                      </div>
                  </div>
              </>
          }
          <div style={isShowStarted ? hiddenStyle : defaultStyle}>
            <ShowCover/>
          </div>
          <Settings/>
        </div>
        <IconButton className='next-btn' onClick={handleNextButtonClick}>
          <BsArrowRightSquareFill/>
        </IconButton>
      </NextButtonContext.Provider>
    </ShowSettingsContext.Provider>
  )
}

export default App;
