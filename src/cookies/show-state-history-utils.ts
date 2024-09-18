import {PageName, ShowStateHistory} from './show-state';

export const getActivePage = (showCoverMessage:boolean): string => {
  if(showCoverMessage) {
    return PageName.PERFORMER_PUNISHMENT_PAGE
  } else {
    return PageName.WHEEL_PAGE;
  }
};

export const getNewShowStateHistory = (randomPunishmentPool: string[]): ShowStateHistory => {
  return {
    showStateHistory: [
      {
        performerIndex: 0,
        randomPunishmentPool: randomPunishmentPool,
        activePage: PageName.START_PAGE,
        wheelRotationDegrees: 0,
        pageState: {
          isShowStarted: false,
          showCoverMessage: false,
          assignedPunishment: '',
        }
      }
    ],
  };
};
