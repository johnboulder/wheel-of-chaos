import {Part} from '../spinning-wheel/spinning-wheel';
import {PunishmentSelectionType} from '../../cookies/show-settings';

export const orderedWheelSegmentList = [
  {value: 'punishment', color: '#FCF69C', isPunishment: true},
  {value: 'punishment', color: '#55D8C1', isPunishment: true},
  {value: 'punishment', color: '#F8333C', isPunishment: true},
  {value: 'punishment', color: '#EFCEFA', isPunishment: true},
  {value: 'punishment', color: '#FF6FB5', isPunishment: true},
  {value: 'punishment', color: '#AB46D2', isPunishment: true},
];

export const getWheelSegmentForIndex = (index: number): Part => {
  let normalizedIndex = index;
  if( index > orderedWheelSegmentList.length - 1) {
    normalizedIndex = index % orderedWheelSegmentList.length;
  }
  return orderedWheelSegmentList[normalizedIndex];
};

export const getWheelValues = (wheelSize: number): Part[] => {
  const wheelValues = [];
  for(let index = 0; index < wheelSize; index++) {
    wheelValues.push(getWheelSegmentForIndex(index));
  }
  return wheelValues;
};

export const getPunishmentPool = (punishmentList: string[], punishmentSelectionTypeList: string[]): string[] => {
  const punishmentPool: string[] = [];

  punishmentSelectionTypeList.forEach((punishmentOrderOption, index) => {
    if(punishmentOrderOption === PunishmentSelectionType.RANDOM) {
      punishmentPool.push(punishmentList[index]);
    }
  });

  return punishmentPool;
};
