import {Part} from '../components/spinning-wheel/spinning-wheel';

export interface ShowSettings {
  performerList: string[];
  punishmentList: string[];
  punishmentOrderList: string[];
  spinOrder: string[];
  performerCount: number;
  wheelValues: Part[];
}

export type PunishmentOrderOptionType = 'random' | 'in_order';

export const PunishmentOrderOption = {
  RANDOM: 'random',
  IN_ORDER: 'in_order',
};

export const PunishmentOrderOptionMessages: Map<string, string> = new Map([
  [PunishmentOrderOption.RANDOM, 'Random'],
  [PunishmentOrderOption.IN_ORDER, 'In Order'],
]);

export interface ShowSettingsContextType extends ShowSettings {
  setShowSettings(showSettings: ShowSettings): void;
}
