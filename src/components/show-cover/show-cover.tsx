import React, {HTMLProps, useEffect} from "react";
import './show-cover.scss'
import {usePressObserver} from "../../utils/use-press-observer";
import skull from "../../assets/skull.png";

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
      <div className='head-image'>
          <img src={skull}/>
      </div>
    </div>
  );
};
