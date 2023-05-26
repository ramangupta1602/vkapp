export const WtHRClassNamesConstant = [
  'Highly obese',
  'Very overweight',
  'Overweight',
  'Healthy',
  'Slim healthy',
  'Very slim',
  'Underweight',
];

export const WtHRClasses = {
  [WtHRClassNamesConstant[0]]: {
    color: '#D11400',
  },
  [WtHRClassNamesConstant[1]]: {
    color: '#E06B00',
  },
  [WtHRClassNamesConstant[2]]: {
    color: '#FF9D40',
  },
  [WtHRClassNamesConstant[3]]: {
    color: '#00BA23',
  },
  [WtHRClassNamesConstant[4]]: {
    color: '#7DCE47',
  },
  [WtHRClassNamesConstant[5]]: {
    color: '#64DDFF',
  },
  [WtHRClassNamesConstant[6]]: {
    color: '#00A9D8',
  },
};

export const MaleWtHRData = {
  [WtHRClassNamesConstant[0]]: {
    displayText: '>63',
    minValue: 63,
    maxValue: 100,
    name: WtHRClassNamesConstant[0],
  },
  [WtHRClassNamesConstant[1]]: {
    displayText: '58-63',
    minValue: 58,
    maxValue: 63,
    name: WtHRClassNamesConstant[1],
  },
  [WtHRClassNamesConstant[2]]: {
    displayText: '53-58',
    minValue: 53,
    maxValue: 58,
    name: WtHRClassNamesConstant[2],
  },
  [WtHRClassNamesConstant[3]]: {
    displayText: '43-53',
    minValue: 43,
    maxValue: 53,
    name: WtHRClassNamesConstant[3],
  },
  [WtHRClassNamesConstant[4]]: {
    displayText: '43-46',
    minValue: 43,
    maxValue: 46,
    name: WtHRClassNamesConstant[4],
  },
  [WtHRClassNamesConstant[5]]: {
    displayText: '35-43',
    minValue: 35,
    maxValue: 43,
    name: WtHRClassNamesConstant[5],
  },
  [WtHRClassNamesConstant[6]]: {
    displayText: '<35',
    minValue: 0,
    maxValue: 35,
    name: WtHRClassNamesConstant[6],
  },
};

export const FemaleWtHRData = {
  [WtHRClassNamesConstant[0]]: {
    displayText: '>58',
    minValue: 58,
    maxValue: 100,
    name: WtHRClassNamesConstant[0],
  },
  [WtHRClassNamesConstant[1]]: {
    displayText: '54-58',
    minValue: 54,
    maxValue: 58,
    name: WtHRClassNamesConstant[1],
  },
  [WtHRClassNamesConstant[2]]: {
    displayText: '49-54',
    minValue: 49,
    maxValue: 54,
    name: WtHRClassNamesConstant[2],
  },
  [WtHRClassNamesConstant[3]]: {
    displayText: '46-49',
    minValue: 46,
    maxValue: 49,
    name: WtHRClassNamesConstant[3],
  },
  [WtHRClassNamesConstant[4]]: {
    displayText: '42-46',
    minValue: 42,
    maxValue: 46,
    name: WtHRClassNamesConstant[4],
  },
  [WtHRClassNamesConstant[5]]: {
    displayText: '35-42',
    minValue: 35,
    maxValue: 42,
    name: WtHRClassNamesConstant[5],
  },
  [WtHRClassNamesConstant[6]]: {
    displayText: '<35',
    minValue: 0,
    maxValue: 35,
    name: WtHRClassNamesConstant[6],
  },
};

function getWtHRClassFor(ratio, classArray) {
  let wthrClass = { name: '', index: 0 };

  WtHRClassNamesConstant.forEach((name, index) => {
    const data = classArray[name];

    if (data.minValue <= ratio && ratio < data.maxValue) {
      wthrClass = data;

      // Classes are in reverse order.. doing so that lower (healthier) class has low index and higher class has higher index...
      wthrClass.index = WtHRClassNamesConstant.length - index;
    }
  });

  return wthrClass;
}

export function getWtHRClass(ratio, gender) {
  if (gender === 'male') {
    return getWtHRClassFor(ratio, MaleWtHRData);
  } else {
    return getWtHRClassFor(ratio, FemaleWtHRData);
  }
}
