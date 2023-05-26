import { R } from "../../Resources/R";
import { RewardKeys } from "./RewardManager";

const RewardData = [
  {
    name: "Water Intake",
    icon: R.Images.waterIntakeCardLogoNew,
    rewards: [
      { title: "For adding water intake", points: 1 },
      { title: "For adding 60oz/2L water intake ", points: 2 },
      { title: "For adding 120oz/3.5L water intake", points: 3 },
    ],
  },

  {
    name: "Body Measurement",
    icon: R.Images.measurementEmptyNew,
    rewards: [{ title: "For adding measurement once a week", points: 8 }],
  },

  {
    name: "Calorie Intake (Loading Phase)",
    icon: R.Images.inchesLossLogoNew,
    rewards: [
      { title: "For adding calories", points: 25 },
      { title: "For reaching 5000 calories", points: 25 },
    ],
  },

  {
    name: "Weight",
    icon: R.Images.weightEmptyNew,
    rewards: [
      { title: "For reducing 5% of starting weight", points: 50 },
      { title: "For reducing 10% of starting weight", points: 50 },
      { title: "For reducing 15% of starting weight", points: 50 },
      { title: "For reducing 20% of starting weight", points: 50 },
    ],
  },

  {
    name: "BMI",
    icon: R.Images.weightEmptyNew,
    rewards: [
      { title: "For reducing your BMI by 1 class ", points: 50 },
      { title: "For reducing your BMI by 1 more class ", points: 50 },
    ],
  },

  {
    name: "Waist to Height Ratio (WtHR)",
    icon: R.Images.measurementEmptyNew,
    rewards: [
      { title: "For reducing your WtHR by 1 class ", points: 50 },
      { title: "For reducing your WtHR by 1 more class ", points: 50 },
    ],
  },

  {
    name: "Day Performance",
    icon: R.Images.dayPerformanceEmptyNew,
    rewards: [
      { title: "For adding performance", points: 1 },
      { title: "For adding 3-4 star performance", points: 2 },
      { title: "For adding 5 star performance", points: 3 },
    ],
  },
];

export const RewardTermsAndCondition = {
  title:
    "Please go through the Terms and Conditions for the Reward Points below.",
  points: [
    "1. You will not be awarded any reward points after 12 weeks of your program.",
    "2. If not redeemed, earned reward points will expire after a gestation period of 3 months.",
    "3. The reward points can only be redeemed for future Viking Health services.",
    "4. No real money is awarded from the app. Your rewards points are equivalent to monetary discount of your future Viking Health services.",
    "5. The award points can only be redeemed after the 11th week of the program.",
    "6. Reward points will be reset once you start a new cycle.",
    "7. For now, redeeming is a one time option.",
  ],
};

const {
  DayPerformance,
  WaterIntake,
  BodyMeasurement,
  CalorieIntake,
  WeightLoss5,
  WeightLoss10,
  WeightLoss15,
  WeightLoss20,
  BMClass1,
  BMClass2,
  WtHrClass1,
  WtHrClass2,
  Total,
  Weight,
  BMI,
  WtHr,
  HasRedeemedForCurrentCycle,
  HasCreditUsed,
} = RewardKeys || {};

export const InitialRewardData = {
  [DayPerformance]: { points: 0, date: "2020-05-20" },
  [WaterIntake]: { points: 0, date: "2020-05-20" },
  [BodyMeasurement]: { points: 0, date: "2020-05-20" },
  [CalorieIntake]: { points: 0, date: "2020-05-20" },

  [WeightLoss5]: { points: 0, date: "2020-05-20" },
  [WeightLoss10]: { points: 0, date: "2020-05-20" },
  [WeightLoss15]: { points: 0, date: "2020-05-20" },
  [WeightLoss20]: { points: 0, date: "2020-05-20" },

  [BMClass1]: { points: 0, date: "2020-05-20" },
  [BMClass2]: { points: 0, date: "2020-05-20" },

  [WtHrClass1]: { points: 0, date: "2020-05-20" },
  [WtHrClass2]: { points: 0, date: "2020-05-20" },

  [Total]: 0,
  [HasRedeemedForCurrentCycle]: false,
  [HasCreditUsed]: false,
};

export const RewardPointsConstant = {
  WaterChartingMax: 3,
  DayPerformanceChartingMax: 3,
  CalorieIntakeMax: 50,
  BmChartingMax: 8,
};

export default RewardData;
