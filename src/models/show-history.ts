export interface ShowHistory {
  currentPerformer: string;
  currentPage: string;
  wheelPosition: number;

}

export interface PageState {
  pageName: string;
}

export const PageName = {
  START_PAGE: 'start_page',
  WHEEL_PAGE: 'wheel_page',
  PERFORMER_PUNISHMENT_PAGE: 'performer_punishment_page',
};
