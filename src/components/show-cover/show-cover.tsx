import React, {HTMLProps, useEffect} from "react";
import './show-cover.scss'
import vrLady from "../../assets/vr_lady.png";
import {usePressObserver} from "../../utils/use-press-observer";

export interface ShowCoverProps extends HTMLProps<any> {
  callback?: () => void;
}

export const ShowCover: React.FC<ShowCoverProps> = (props) => {
  const {children, callback} = props;

  const [isBackspacePressed, setIsBackspacePressed] = usePressObserver("backspace");

  useEffect(() => {
    if(isBackspacePressed && callback) {
      callback();
      setIsBackspacePressed(false);
    }
  }, [isBackspacePressed]);

  return (
    <div className='show-cover-container'>
      <div className='show-cover'/>
      <div className='title'>{children}</div>
      <div className='vr-lady'>
        <img src={vrLady}/>
      </div>
    </div>
  );
};
