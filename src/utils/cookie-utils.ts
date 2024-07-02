export interface ShowSettings {
  performerList: string[];
  punishmentList: string[];
  spinOrder: string[];
}

export const SHOW_SETTINGS = 'show-settings';

export const DEFAULT_SETTINGS: ShowSettings = {
  performerList: [
    'Joey Bednarski',
    'Sonal Aggarwal',
    'Jonathan Dunne and Bill Gevirtz',
    'Kerry Stevens',
    'Greg Kennedy',
    'Chris Higgins',
    'Queeny Bitch',
    'Bill Gevirtz',
  ],
  punishmentList: [
    'Say it Again!',
    'A Silly Costume!',
    'The Race!',
    'Severe Thunderstorm Warning!',
    'The Female Experience!',
    'The Future of Comedy!',
    'My Cousin Joey!',
    'The Execution!',
  ],
  spinOrder: [
    'punishment',
    'punishment',
    'punishment',
    'punishment',
    'punishment',
    'punishment',
    'punishment',
    'punishment',
  ]
}
