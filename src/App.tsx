import React, {CSSProperties, useEffect, useState} from 'react'

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

  const [isShowStarted, setIsShowStarted] = useState<boolean>(true);
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

  return (
    <>
      {isShowStarted &&
        <>
          <div className='row'>
            <div className='header col s5' style={{animation: '3s pulse ease-in-out infinite'}}>
              <div>
                <img className="show-title" alt="show title" src={titleWithSkull}/>
              </div>
            </div>
            <div className='col s2' style={{marginTop: '8%'}}>
              <div className='valign-wrapper' style={{justifyContent: 'center'}}>
                <SpinningWheel wheelValues={wheelValues} />
              </div>
            </div>
          </div>
          <Ticker/>
        </>
      }
      <div style={isShowStarted ? hiddenStyle : defaultStyle}>
        <ShowCover>
          <img alt="show title" src={titleWithSkull}/>
        </ShowCover>
      </div>
    </>
  )
}

export default App;
