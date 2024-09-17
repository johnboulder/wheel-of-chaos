export const SHOW_STATE_HISTORY_COOKIE_KEY = 'show-state-history';

export interface ShowStateHistory {
  showStateHistory: ShowState[]
}

export interface ShowState {
  performerIndex: number;
  randomPunishmentPool: string[];
  activePage: string;
  wheelRotationDegrees: number;
}

export interface CommonPageState {
  isShowStarted: boolean,
  showCoverMessage: boolean,
}

export const PageName = {
  START_PAGE: 'start_page',
  END_PAGE: 'end_page',
  WHEEL_PAGE: 'wheel_page',
  PERFORMER_PUNISHMENT_PAGE: 'performer_punishment_page',
};
