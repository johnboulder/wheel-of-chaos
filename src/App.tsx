import React, {createContext, CSSProperties, useRef, useState} from 'react'

import {SpinningWheel} from "./components/spinning-wheel/spinning-wheel";
import './app.scss';
import {ShowCover} from "./components/show-cover/show-cover";
import titleWithSkull from './assets/title_with_skull.png';
import {useCookies} from 'react-cookie';
import {
  DEFAULT_SETTINGS,
  DEFAULT_SHOW_SETTINGS_CONTEXT,
  SHOW_SETTINGS_COOKIE_KEY,
} from './cookies/show-settings';
import Settings from './components/settings/settings';
import IconButton from './components/icon-button';
import {BsArrowRightSquareFill} from 'react-icons/bs';
import {NextButton} from './models/next-button';
import {ShowSettings, ShowSettingsContextType} from './cookies/show-settings';

export const ShowSettingsContext = createContext<ShowSettingsContextType>(DEFAULT_SHOW_SETTINGS_CONTEXT);

export const NextButtonContext = createContext<NextButton>({
  isWheelSpinRequested: false,
  isShowStarted: false,
  showCoverMessage: false,
  setIsWheelSpinRequested: () => {},
  setShowCoverMessage: () => {},
  handleNextButtonClick: () => {}
})

const App = () => {
  const today = new Date();
  const tenYearsFromNow = new Date(today.getFullYear() + 10, today.getMonth(), today.getDate());

  const [cookies, setCookie] = useCookies([SHOW_SETTINGS_COOKIE_KEY]);

  if(!cookies[SHOW_SETTINGS_COOKIE_KEY]) {
    setCookie(SHOW_SETTINGS_COOKIE_KEY, DEFAULT_SETTINGS, {expires: tenYearsFromNow});
  }

  const showSettings: ShowSettings = cookies[SHOW_SETTINGS_COOKIE_KEY];

  const [
    showSettingsContextState,
    setShowSettingsContextState
  ] = useState<ShowSettings>(showSettings);

  const {
    wheelValues,
    performerCount,
    performerList,
    punishmentSelectionTypeList,
    randomPunishmentPool,
    punishmentList,
    spinOrder
  } = showSettingsContextState;

  const handleShowSettingsUpdate = (updatedShowSettings: ShowSettings) => {
    setCookie(SHOW_SETTINGS_COOKIE_KEY, updatedShowSettings, {expires: tenYearsFromNow});
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
      punishmentSelectionTypeList,
      randomPunishmentPool,
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
