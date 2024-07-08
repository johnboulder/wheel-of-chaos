import {Part} from '../spinning-wheel/spinning-wheel';

export const orderedWheelSegmentList = [
  {value: 'punishment', color: '#FCF69C', isPunishment: true},
  {value: 'punishment', color: '#55D8C1', isPunishment: true},
  {value: 'punishment', color: '#F8333C', isPunishment: true},
  {value: 'punishment', color: '#EFCEFA', isPunishment: true},
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
