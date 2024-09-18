import {DEFAULT_SHOW_SETTINGS} from './show-settings';

export const SHOW_STATE_HISTORY_COOKIE_KEY = 'show-state-history';

export interface ShowStateHistory {
  showStateHistory: ShowState[]
}

export interface ShowState {
  performerIndex: number;
  randomPunishmentPool: string[];
  activePage: string;
  wheelRotationDegrees: number;
  pageState: CommonPageState;
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

export const DEFAULT_SHOW_STATE_HISTORY: ShowStateHistory = {
  showStateHistory: [
    {
      performerIndex: 0,
      randomPunishmentPool: DEFAULT_SHOW_SETTINGS.randomPunishmentPool,
      activePage: PageName.START_PAGE,
      wheelRotationDegrees: 0,
      pageState: {
        isShowStarted: false,
        showCoverMessage: false,
      }
    }
  ],
}

export interface ShowStateHistoryContextType extends ShowStateHistory {
  setShowStateHistory(showSettings: ShowStateHistory): void;
}

export const DEFAULT_SHOW_STATE_HISTORY_CONTEXT: ShowStateHistoryContextType = {
  ...DEFAULT_SHOW_STATE_HISTORY,
  setShowStateHistory: (showSettings: ShowStateHistory) => {
  },
};
