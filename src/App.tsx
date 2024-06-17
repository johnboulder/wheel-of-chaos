import React, {CSSProperties, useEffect, useRef, useState} from 'react'

import {Part, SpinningWheel} from "./components/spinning-wheel/spinning-wheel";

import './app.scss';
import {Ticker} from "./components/ticker/ticker";
import {ShowCover} from "./components/show-cover/show-cover";
import titleWithSkull from './assets/title_with_skull.png';

// TODO move button into this container

const App = () => {

  const wheelValues: Part[] = [
    {value: 'punishment', color: '#F8333C', isPunishment: true},
    {value: 'punishment', color: '#EFCEFA', isPunishment: true},
    {value: 'punishment', color: '#FF6FB5', isPunishment: true},
    {value: 'punishment', color: '#FCF69C', isPunishment: true},
    {value: 'punishment', color: '#55D8C1', isPunishment: true},
    {value: 'punishment', color: '#AB46D2', isPunishment: true},
  ];

  const [isShowStarted, setIsShowStarted] = useState<boolean>(false);
  const defaultStyle: CSSProperties = {
    opacity: '100%',
  };

  const hiddenStyle: CSSProperties = {
    opacity: '0%',
    transition: 'ease-in-out 5s'
  };

  const spaceBarHandler = (event: KeyboardEvent) => {
    if (event.key === " ") {
      setIsShowStarted(true);
    } else {
      document.addEventListener("keyup", spaceBarHandler, {once: true});
    }
  };

  useEffect(() => {
    document.addEventListener("keyup", spaceBarHandler, {once: true});
  }, []);

  // Disables spacebar from scrolling down the page when pressed
  window.addEventListener('keydown', function(e) {
    if(e.keyCode == 32 && e.target == document.body) {
      e.preventDefault();
    }
  });

  return (
    <>
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
                {/*<div className='flex-circle' style={{marginTop: '-50%'}}/>*/}
              </div>
            </div>
          </>
      }
      <div style={isShowStarted ? hiddenStyle : defaultStyle}>
        <ShowCover/>
      </div>
    </>
  )
}

export default App;
