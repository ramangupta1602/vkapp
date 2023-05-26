import { R } from "../../Resources/R";

export const BmiClass = {
  underWeight: "Under Weight",
  healthy: "Healthy",
  overWeight: "Over Weight",
  obesity1: "Obesity Class 1",
  obesity2: "Obesity Class 2",
  Obesity3: "Obesity Class 3",
};

export const BmiData = [
  {
    name: BmiClass.underWeight,
    inRangeIcon: R.Images.UnderWeight_White,
    outRangeIcon: R.Images.UnderWeight_Colored,
    maxValue: 18.4,
    minValue: 0,
    displayString: "< 18.5",
    range: [15, 16, 17, 18, 18.4],
    colorLight: "#81DEF8",
    colorDark: "#00AFF3",
    cardColor: "rgba(221,244,250,1))",
    isUserInRange: false,
    borderColor: "#64DDFF",
  },
  {
    name: BmiClass.healthy,
    inRangeIcon: R.Images.Normal_White,
    outRangeIcon: R.Images.Normal_Colored,
    minValue: 18.5,
    maxValue: 24.9,
    displayString: "18.5 - 24.9",
    range: [18.5, 19, 20, 21, 22, 23, 24, 24.9],
    colorLight: "rgba(150,222,78,1)",
    colorDark: "rgba(110,174,64,1)",
    isUserInRange: false,
    cardColor: "rgba(232,249,216,1)",
    borderColor: "#96DE4E",
  },

  {
    name: BmiClass.overWeight,
    inRangeIcon: R.Images.Preobese_White,
    outRangeIcon: R.Images.Preobese_Colored,
    minValue: 25,
    maxValue: 29.9,
    displayString: "25 - 29.9",
    range: [25, 26, 27, 28, 29, 29.9],
    colorLight: "#F8BA34",
    colorDark: "#DBA200",
    isUserInRange: false,
    cardColor: "rgba(250,245,217,1)",
    borderColor: "#F8BA34",
  },

  {
    name: BmiClass.obesity1,
    inRangeIcon: R.Images.Obesity1_White,
    outRangeIcon: R.Images.Obesity1_Colored,
    minValue: 30,
    maxValue: 34.9,
    displayString: "30 - 34.9",
    range: [30, 31, 32, 33, 34, 34.9],
    colorLight: "#F48E49",
    colorDark: "#EB7322",
    isUserInRange: false,
    cardColor: "rgba(248,231,216,1)",
    borderColor: "#F48E49",
  },

  {
    name: BmiClass.obesity2,
    inRangeIcon: R.Images.Obesity2_White,
    outRangeIcon: R.Images.Obesity2_Colored,
    minValue: 35,
    maxValue: 39.9,
    displayString: "35 - 39.9",
    range: [35, 36, 37, 38, 39, 39.9],
    colorLight: "#ED485C",
    colorDark: "#E11D35",
    isUserInRange: false,
    cardColor: "rgba(251,228,231,1)",
    borderColor: "#ED485C",
  },

  {
    name: BmiClass.Obesity3,
    inRangeIcon: R.Images.Obesity3_White,
    outRangeIcon: R.Images.Obesity3_Colored,
    minValue: 40,
    maxValue: 100,
    displayString: " > 40",
    range: [40, 41, 42, 43, 44, 45, 46, 47, 48, 49],
    colorLight: "#BA3433",
    colorDark: "#A50A09",
    isUserInRange: false,
    cardColor: "rgba(237,227,227,1)",
    borderColor: "#BA3433",
  },
];

export function getBmiClassIndex(bmi) {
  var classIndex = 0;

  BmiData.forEach((data, index) => {
    if (data.minValue <= bmi && data.maxValue >= bmi) {
      classIndex = index;
    }
  });

  return classIndex;
}

export function getBmiClass(bmi) {
  var bmiClassData = BmiData[0];

  BmiData.forEach((data, index) => {
    if (data.minValue <= bmi && data.maxValue >= bmi) {
      bmiClassData = data;
    }
  });

  return bmiClassData;
}

export function getBmiClassForIndex(index) {
  if (BmiData[index]) {
    return BmiData[index];
  }

  return BmiData[0];
}

// from 5feet to 7feet
export const MIN_INCH_VALUE = 60;
export const MAX_INCH_VALUE = 84;
export const FeetScale = Array.from(
  { length: MAX_INCH_VALUE - MIN_INCH_VALUE + 1 },
  (_, index) => index + MIN_INCH_VALUE
);

// from 150,153,156 ........ (increment based on interval)
export const MIN_CM_VALUE = 150;
export const MAX_CM_VALUE = 250;
const interval = 3;
const lengthOfCMScale =
  Math.floor((MAX_CM_VALUE - MIN_CM_VALUE) / interval) + 1;
export const CMScale = Array.from({ length: lengthOfCMScale }, (_, index) => {
  return interval * index + MIN_CM_VALUE;
});
