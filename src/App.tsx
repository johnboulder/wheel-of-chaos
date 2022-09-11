import React, {CSSProperties, useEffect, useState} from 'react'

import {Part, SpinningWheel} from "./components/spinning-wheel/spinning-wheel";
import logo from './assets/agents_of_chaos_header_image.svg'

import './app.scss';
import {PerformerTitleCard} from "./components/performer-title/performer-title-card";
import {Ticker} from "./components/ticker/ticker";
import {ShowCover} from "./components/show-cover/show-cover";
import {Transition} from "react-transition-group";

// TODO move button into this container

const App = () => {

  const wheelValues: Part[] = [
    {value: 'safe', color: '#F8333C', isPunishment: false},
    {value: 'punishment', color: '#EFCEFA', isPunishment: true},
    {value: 'safe', color: '#FF6FB5', isPunishment: false},
    {value: 'punishment', color: '#FCF69C', isPunishment: true},
    {value: 'safe', color: '#55D8C1', isPunishment: false},
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

  return (
    <>
      {isShowStarted &&
          <>
              <div className='container'>
                  <div className='row'>
                      <div className='col s2'/>
                      <div className='header col s8' style={{animation: '3s pulse ease-in-out infinite'}}>
                          <div>Agents of Chaos</div>
                      </div>
                  </div>
                  <div className='valign-wrapper' style={{justifyContent: 'center'}}>
                      <SpinningWheel wheelValues={wheelValues} />
                  </div>
              </div>
              <Ticker/>
          </>
      }
      <div style={isShowStarted ? hiddenStyle : defaultStyle}>
        <ShowCover>Agents of Chaos</ShowCover>
      </div>
    </>
  )
}

export default App;
