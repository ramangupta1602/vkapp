export const BMIScaleConfigClasses = [
  "underWeight",
  "healthy",
  "overWeight",
  "obese",
];

export const BMIScaleConfig = {
  [BMIScaleConfigClasses[0]]: {
    color: "#18d4fb",
    lines: 3,
    startRange: 0,
    endRange: 18.4,
    isFirst: true,
    isLast: false,
  },

  [BMIScaleConfigClasses[1]]: {
    color: "#91dd66",
    lines: 3,
    startRange: 18.5,
    endRange: 24.9,
    isFirst: false,
    isLast: false,
  },

  [BMIScaleConfigClasses[2]]: {
    color: "#f8a443",
    lines: 3,
    startRange: 25,
    endRange: 29.9,
    isFirst: false,
    isLast: false,
  },

  [BMIScaleConfigClasses[3]]: {
    color: "#e36978",
    lines: 3,
    startRange: 30,
    endRange: 100,
    isFirst: false,
    isLast: true,
  },
};
