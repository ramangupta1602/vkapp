import { HeightWeightUtil } from "../../Library/Utils/HeightWeightUtil";
import { RewardPointsConstant } from "./RewardData";
import * as DateUtil from "../../Library/Utils/DateUtil";
import { R } from "../../Resources/R";

export const MAX_REWARD_POINTS = 1200;

export const RewardKeys = {
  Reward: "reward",
  AddPoint: "addPoint",

  DayPerformance: "dayPerformance",
  WaterIntake: "waterIntake",
  BodyMeasurement: "bodyMeasurement",
  CalorieIntake: "calorieIntake",
  Weight: "Weight",
  BMI: "bmi",
  WtHr: "wthr",
  WeightLoss5: "weightLoss5",
  WeightLoss10: "weightLoss10",
  WeightLoss15: "weightLoss15",
  WeightLoss20: "weightLoss20",
  BMClass1: "bmClass1",
  BMClass2: "bmClass2",
  WtHrClass1: "wthrClass1",
  WtHrClass2: "wthrClass2",
  Total: "total",
  HasRedeemedForCurrentCycle: "hasRedeemedForCurrentCycle",
  HasCreditUsed: "hasUsedCredit",
};

export const RewardDisplayName = {
  Reward: "reward",
  AddPoint: "addPoint",
  DayPerformance: "dayPerformance",
  WaterIntake: "waterIntake",
  BodyMeasurement: "bodyMeasurement",
  CalorieIntake: "calorieIntake",
  Weight: "Weight",
  BMI: "BMI",
  WtHr: "Waist to Height Ratio",
  WeightLoss5: "weightLoss5",
  WeightLoss10: "weightLoss10",
  WeightLoss15: "weightLoss15",
  WeightLoss20: "weightLoss20",
  BMClass1: "bmClass1",
  BMClass2: "bmClass2",
  WtHrClass1: "wthrClass1",
  WtHrClass2: "wthrClass2",
  Total: "total",
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
} = RewardKeys;

//************************************
//      DAYS PERFORMANCe
// ************************************
function getRewardPointForRating(rating) {
  if (rating <= 2) {
    return 1;
  }

  if (rating <= 4) {
    return 2;
  }

  return 3;
}

export function getRewardForDayPerformance({
  rating,
  previousReward,
  isHistoryDate,
  notValidReward,
  totalReward,
}) {
  if (!notValidReward) {
    return { [RewardKeys.Reward]: 0, [RewardKeys.AddPoint]: 0 };
  }

  let currentReward = getRewardPointForRating(rating);

  currentReward = getRewardPointsAfterPointsValidation(
    totalReward,
    currentReward
  );

  if (isHistoryDate) {
    return { [RewardKeys.Reward]: 0, [RewardKeys.AddPoint]: 0 };
  }

  if (currentReward <= previousReward) {
    return { [RewardKeys.Reward]: previousReward, [RewardKeys.AddPoint]: 0 };
  }

  return {
    [RewardKeys.Reward]: currentReward,
    [RewardKeys.AddPoint]: currentReward - previousReward,
  };
}

//************************************
//      Water Intake
// ************************************

function getWaterIntakeRewardForOz(intake) {
  if (intake < 60) {
    return 1;
  }

  if (intake < 120) {
    return 2;
  }

  return 3;
}

function getWaterIntakeRewardForMl(intake) {
  if (intake < 2000) {
    return 1;
  }

  if (intake < 3500) {
    return 2;
  }

  return 3;
}

function getRewardPointsForWaterIntake(intake, unit) {
  if (unit === HeightWeightUtil.WATER_FLOZ) {
    return getWaterIntakeRewardForOz(intake);
  }

  return getWaterIntakeRewardForMl(intake);
}

export function getRewardForWaterIntake({
  intake,
  unit,
  previousReward,
  isHistoryDate,
  notValidReward,
  totalReward,
}) {
  if (!notValidReward) {
    return { [RewardKeys.Reward]: 0, [RewardKeys.AddPoint]: 0 };
  }

  let currentReward = getRewardPointsForWaterIntake(intake, unit);

  currentReward = getRewardPointsAfterPointsValidation(
    totalReward,
    currentReward
  );

  if (isHistoryDate) {
    return { [RewardKeys.Reward]: 0, [RewardKeys.AddPoint]: 0 };
  }

  if (currentReward <= previousReward) {
    return { [RewardKeys.Reward]: previousReward, [RewardKeys.AddPoint]: 0 };
  }

  return {
    [RewardKeys.Reward]: currentReward,
    [RewardKeys.AddPoint]: currentReward - previousReward,
  };
}

//************************************
//      Calorie Intake
// ************************************

function getRewardFromCalorieIntake(calorieIntake) {
  if (calorieIntake < 5000) {
    return 25;
  }

  return RewardPointsConstant.CalorieIntakeMax;
}

export function getRewardForCalorieIntake(calorieIntake, previousReward) {
  const currentReward = getRewardFromCalorieIntake(calorieIntake);

  if (currentReward <= previousReward) {
    return { [RewardKeys.Reward]: previousReward, [RewardKeys.AddPoint]: 0 };
  }

  return {
    [RewardKeys.Reward]: currentReward,
    [RewardKeys.AddPoint]: currentReward - previousReward,
  };
}

// Validate user program dates for reward
export function validateUserForReward(
  programStartDate,
  programEndDate,
  hasRedeemedForCurrentCycle = false,
  totalRewardPoints = 0
) {
  const dayDifferenceFromStartDate = DateUtil.absoluteDifferenceFromToday(
    programStartDate
  );
  const dayDifferenceFromEndDate = DateUtil.absoluteDifferenceFromToday(
    programEndDate
  );

  const hasProgramEnded = dayDifferenceFromEndDate > 0;
  const hasPassed12Week = dayDifferenceFromStartDate > 85; // startdate is back than 12 week or 84 days + 1 day because of miscalculation of end date shown to user
  const hasMaximumReward = totalRewardPoints >= 1200;

  if (
    hasPassed12Week ||
    hasProgramEnded ||
    hasRedeemedForCurrentCycle ||
    hasMaximumReward
  ) {
    return false;
  }

  return true;
}

export function getRewardPointsAfterPointsValidation(totalPoints, pointGained) {
  if (totalPoints >= MAX_REWARD_POINTS) {
    return 0;
  }

  if (totalPoints + pointGained >= MAX_REWARD_POINTS) {
    return MAX_REWARD_POINTS - totalPoints;
  }

  return pointGained;
}

// Preparing reward data for History screen
export function PrepareRewardData(rewardData) {
  const RewardArray = [];

  const weightData = getRewardDataForWeight(rewardData);

  if (weightData.data.length) {
    RewardArray.push(weightData);
  }

  const bmiData = getRewardDataForBmi(rewardData);
  if (bmiData.data.length) {
    RewardArray.push(bmiData);
  }

  const wthrData = getRewardDataForWtHR(rewardData);
  if (wthrData.data.length) {
    RewardArray.push(wthrData);
  }

  const bodyMeasurementData = getRewardDataForBodyMeasurement(rewardData);
  if (bodyMeasurementData.data.length) {
    RewardArray.push(bodyMeasurementData);
  }

  const dayPerformanceData = getRewardDataForDaysPerformance(rewardData);
  if (dayPerformanceData.data.length) {
    RewardArray.push(dayPerformanceData);
  }

  const waterIntakeData = getRewardDataForWaterIntake(rewardData);
  if (waterIntakeData.data.length) {
    RewardArray.push(waterIntakeData);
  }

  const calorieIntakeData = getRewardDataForCalorieIntake(rewardData);
  if (calorieIntakeData.data.length) {
    RewardArray.push(calorieIntakeData);
  }

  if (RewardArray.length % 2 != 0) {
    RewardArray.push({
      isQuoteCard: true,
      total: 0,
      data: [],
      title: "Quote",
      startColor: "rgba(65,215,243,1)",
      endColor: "rgba(81,160,255,1)",
    });
  }

  return breakRewardArrayOfSize2(RewardArray);
}

function getRewardDataForWeight(rewardData) {
  const array = [];
  let total = 0;

  if (rewardData[WeightLoss5].points) {
    let data = rewardData[WeightLoss5];
    array.push({
      date: data.date,
      points: data.points,
      desc: "For losing 5% of starting weight",
    });
    total += data.points;
  }

  if (rewardData[WeightLoss10].points) {
    let data = rewardData[WeightLoss10];
    array.push({
      date: data.date,
      points: data.points,
      desc: "For losing 10% of starting weight",
    });
    total += data.points;
  }

  if (rewardData[WeightLoss15].points) {
    let data = rewardData[WeightLoss15];
    array.push({
      date: data.date,
      points: data.points,
      desc: "For losing 15% of starting weight",
    });
    total += data.points;
  }

  if (rewardData[WeightLoss20].points) {
    let data = rewardData[WeightLoss20];
    array.push({
      date: data.date,
      points: data.points,
      desc: "For losing 20% of starting weight",
    });
    total += data.points;
  }

  return {
    total,
    data: array,
    title: "Weight",
    startColor: "#C2E6FF",
    endColor: "#63ABFC",
    gridImage: R.Images.RewardImages.BackgroundCards.Grid.WeightLoss,
    listImage: R.Images.RewardImages.BackgroundCards.List.WeightLoss,
  };
}

function getRewardDataForBmi(rewardData) {
  const array = [];
  let total = 0;

  if (rewardData[BMClass1].points) {
    let data = rewardData[BMClass1];
    array.push({
      date: data.date,
      points: data.points,
      desc: "For reducing your BMI by 1 class",
    });
    total += data.points;
  }

  if (rewardData[BMClass2].points) {
    let data = rewardData[BMClass2];
    array.push({
      date: data.date,
      points: data.points,
      desc: "For reducing your BMI by 1 more class",
    });
    total += data.points;
  }

  return {
    total,
    data: array,
    title: "BMI",
    startColor: "#FDC9D1",
    endColor: "#FB99A4",
    gridImage: R.Images.RewardImages.BackgroundCards.Grid.Bmi,
    listImage: R.Images.RewardImages.BackgroundCards.List.Bmi,
  };
}

function getRewardDataForWtHR(rewardData) {
  const array = [];
  let total = 0;

  if (rewardData[WtHrClass1].points) {
    let data = rewardData[WtHrClass1];
    array.push({
      date: data.date,
      points: data.points,
      desc: "For reducing your WtHr by 1 class",
    });
    total += data.points;
  }

  if (rewardData[WtHrClass2].points) {
    let data = rewardData[WtHrClass2];
    array.push({
      date: data.date,
      points: data.points,
      desc: "For reducing your WtHr by 1 more class",
    });
    total += data.points;
  }

  return {
    total,
    data: array,
    title: "Waist to Height Ratio",
    startColor: "#FCDAF9",
    endColor: "#F1A8E8",
    gridImage: R.Images.RewardImages.BackgroundCards.Grid.Wthr,
    listImage: R.Images.RewardImages.BackgroundCards.List.Wthr,
  };
}

function getRewardDataForBodyMeasurement(rewardData) {
  const array = [];
  let total = 0;

  if (rewardData[BodyMeasurement].points) {
    let data = rewardData[BodyMeasurement];
    array.push({
      date: data.date,
      points: data.points,
      desc: "For adding all 8 body measurements once a week",
    });
    total += data.points;
  }

  return {
    total,
    data: array,
    title: "Body Measurement",
    startColor: "#DFF7AC",
    endColor: "#AFCC71",
    gridImage: R.Images.RewardImages.BackgroundCards.Grid.BodyMeasurement,
    listImage: R.Images.RewardImages.BackgroundCards.List.BodyMeasurement,
  };
}

function getRewardDataForDaysPerformance(rewardData = {}) {
  const array = [];
  let total = 0;

  if (rewardData[DayPerformance].points) {
    let data = rewardData[DayPerformance];
    array.push({
      date: data.date,
      points: data.points,
      desc: "For adding your daily performance till now",
    });
    total += data.points;
  }

  return {
    total,
    data: array,
    title: "Day Performance",
    startColor: "#FFEEC0",
    endColor: "#FBC462",
    gridImage: R.Images.RewardImages.BackgroundCards.Grid.DayPerformance,
    listImage: R.Images.RewardImages.BackgroundCards.List.DayPerformance,
  };
}

function getRewardDataForWaterIntake(rewardData) {
  const array = [];
  let total = 0;

  if (rewardData[WaterIntake].points) {
    let data = rewardData[WaterIntake];
    array.push({
      date: data.date,
      points: data.points,
      desc: "For adding your water intake levels till now",
    });
    total += data.points;
  }

  return {
    total,
    data: array,
    title: "Water Intake",
    startColor: "#AEECFB",
    endColor: "#76D5F6",
    gridImage: R.Images.RewardImages.BackgroundCards.Grid.WaterIntake,
    listImage: R.Images.RewardImages.BackgroundCards.List.WaterIntake,
  };
}

function getRewardDataForCalorieIntake(rewardData) {
  const array = [];
  let total = 0;

  if (rewardData[CalorieIntake].points) {
    let data = rewardData[CalorieIntake];
    array.push({
      date: data.date,
      points: data.points,
      desc: "For adding your calories while Loading",
    });
    total += data.points;
  }

  return {
    total,
    data: array,
    title: "Loading",
    startColor: "#F0F4F7",
    endColor: "#AAC3D4",
    gridImage: R.Images.RewardImages.BackgroundCards.Grid.Loading,
    listImage: R.Images.RewardImages.BackgroundCards.List.Loading,
  };
}

function breakRewardArrayOfSize2(rewardArray) {
  let array = [];

  for (let i = 0; i < rewardArray.length; i += 2) {
    let tempArray = [rewardArray[i], rewardArray[i + 1]];
    array.push(tempArray);
  }

  return array;
}

//
export function shouldShowRedeem(startDate) {
  const diffWeek = DateUtil.absoluteWeekDifferenceFromToday(startDate);
  return diffWeek >= 11;
}

export function convertPointToAmountString(points) {
  return `$${(points / 4).toFixed(2)}`;
}

export function hasRewardExpired(startDate) {
  const hasExpired = DateUtil.isTodayWithinTimeFrame(startDate, 6, "months");
  return hasExpired;
}
