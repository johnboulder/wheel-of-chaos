import React from "react";
import './ticker.scss'

export const Ticker: React.FC = () => {
  return (
      <div className='ticker'>
          <div className='circle' style={{
              transform: 'translate(-50%, -50%)'
          }}>
              <div className='tick-pointer' style={{
                  transform: 'translate(-50%, -480%)'
              }}/>
          </div>
      </div>
  );
}
