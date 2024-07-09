import React, {HTMLProps, useEffect} from "react";
import './show-cover.scss'
import {usePressObserver} from "../../utils/use-press-observer";
import skull from "../../assets/skull.png";

export interface ShowCoverProps extends HTMLProps<any> {
  callback?: () => void;
}

export const ShowCover: React.FC<HTMLProps<any>> = (props) => {
  const {
    children,
    className
  } = props;

  return (
    <div {...props} className={`${className} show-cover-container`}>
      <div className='show-cover'/>
      <div className='title'>{children}</div>
      <div className='head-image'>
          <img src={skull}/>
      </div>
    </div>
  );
};
