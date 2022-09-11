import React from "react";
import './ticker.scss'

export const Ticker: React.FC = () => {
  return (
    <div className='ticker'>
      <div className='circle'/>
      <div className='triangle'/>
    </div>
  );
}
