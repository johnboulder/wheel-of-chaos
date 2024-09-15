import {Part} from '../components/spinning-wheel/spinning-wheel';

export interface ShowSettings {
  performerList: string[];
  punishmentList: string[];
  spinOrder: string[];
  performerCount: number;
  wheelValues: Part[];
}

export interface ShowSettingsContextType extends ShowSettings{
  setShowSettings(showSettings: ShowSettings): void;
}
