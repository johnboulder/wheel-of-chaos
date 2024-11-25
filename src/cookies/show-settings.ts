import {Part} from '../components/spinning-wheel/spinning-wheel';

export const SHOW_SETTINGS_COOKIE_KEY = 'show-settings';

export interface ShowSettings {
  performerList: string[];
  punishmentList: string[];
  punishmentSelectionTypeList: string[];
  randomPunishmentPool: string[];
  spinOrder: string[];
  performerCount: number;
  wheelValues: Part[];
}

export const PunishmentSelectionType = {
  RANDOM: 'random',
  IN_ORDER: 'in_order',
};

export const PunishmentSelectionTypeMessages: Map<string, string> = new Map([
  [PunishmentSelectionType.RANDOM, 'Random'],
  [PunishmentSelectionType.IN_ORDER, 'In Order'],
]);

export interface ShowSettingsContextType extends ShowSettings {
  setShowSettings(showSettings: ShowSettings): void;
}

export const DEFAULT_SHOW_SETTINGS: ShowSettings = {
  performerCount: 8,
  punishmentSelectionTypeList: [
    PunishmentSelectionType.RANDOM,
    PunishmentSelectionType.RANDOM,
    PunishmentSelectionType.RANDOM,
    PunishmentSelectionType.RANDOM,
    PunishmentSelectionType.RANDOM,
    PunishmentSelectionType.RANDOM,
    PunishmentSelectionType.RANDOM,
    PunishmentSelectionType.RANDOM,
  ],
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
  randomPunishmentPool: [
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
  ],
  wheelValues: [
    {value: 'punishment', color: '#FCF69C', isPunishment: true},
    {value: 'punishment', color: '#55D8C1', isPunishment: true},
    {value: 'punishment', color: '#F8333C', isPunishment: true},
    {value: 'punishment', color: '#EFCEFA', isPunishment: true},
    {value: 'punishment', color: '#FF6FB5', isPunishment: true},
    {value: 'punishment', color: '#FCF69C', isPunishment: true},
    {value: 'punishment', color: '#55D8C1', isPunishment: true},
    {value: 'punishment', color: '#AB46D2', isPunishment: true},
  ]
};

export const DEFAULT_SHOW_SETTINGS_CONTEXT: ShowSettingsContextType = {
  ...DEFAULT_SHOW_SETTINGS,
  setShowSettings: (showSettings: ShowSettings) => {
  },
};
