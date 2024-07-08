import {IconContext, IconType} from 'react-icons';
import React, {HTMLProps} from 'react';
import {BsGearFill} from 'react-icons/bs';

interface IconButtonProps extends HTMLProps<any>{}

const IconButton = (props: IconButtonProps) => {
  const {children, onClick, className} = props;
  return (
    <button type='button' className={`btn icon-btn floating-btn ${className}`} onClick={onClick}>
      <IconContext.Provider
        value={{
          color:'transparent',
          size: '50px',
          style: {
            stroke: 'white',
            strokeOpacity: '50%',
            strokeWidth: '0.5px',
            overflow: 'visible',
          }
        }}
      >
        <div>
          {children}
        </div>
      </IconContext.Provider>
    </button>
  );
};

export default IconButton;
