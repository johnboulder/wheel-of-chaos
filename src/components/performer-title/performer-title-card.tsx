import React from 'react'

import './performer-title-card.scss';
import vrLady from '../../assets/vr_lady.png';

export interface TitleCardProps {
  titleText: string;
}

export const PerformerTitleCard: React.FC<TitleCardProps> = (props) => {
  const {titleText} = props;

  return (
    <>
      <div className='container'>
        <div className='row'>
          <div className='col s12 title-card'>
            {titleText}
          </div>
        </div>
      </div>
      <div className='vr-lady'>
        <img src={vrLady}/>
      </div>
    </>
  );
};
