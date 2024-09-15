export interface ShowState {
  remainingPerformerList: string[];
  remainingPunishmentList: string[];
  remainingPunishmentOrderList: string[];
  performerCount: number;
  wheelPosition: number;
  activePage: string;
}

export const RANDOM_PUNISHMENT = 'random_punishment';
export const IN_ORDER_PUNISHMENT = 'in_order_punishment';
