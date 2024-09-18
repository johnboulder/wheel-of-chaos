import {PageName} from './show-state';

export const getActivePage = (showCoverMessage:boolean): string => {
  if(showCoverMessage) {
    return PageName.PERFORMER_PUNISHMENT_PAGE
  } else {
    return PageName.WHEEL_PAGE;
  }
};
