import React from "react";
import { EmptyCard } from "../EmptyCard";
import { WaterIntakeLog } from "Library/Models/WaterIntakeLogModel";
import { WaterIntakeCard } from "./WaterIntakeCard";
import { R } from "Resources";
import { USER_TYPE } from "Library/Constants";
import * as DateUtil from "../../../../Library/Utils/DateUtil";
import { RewardPointsConstant } from "../../../Reward/RewardData";

export const WaterLogSection = ({
  onCardSelect,
  addData,
  data,
  userType,
  targetWaterIntakeLevel,
  startAnimation,
}) => {
  let lastWaterIntakeLog = data;
  const todayDate = DateUtil.formatDate(new Date());
  const shouldShowAddButton = userType === USER_TYPE.PATIENT;
  let isAddedToday = false;
  let isTargetAchieved = false;
  let hasFutureDate = false;
  let rewardPoints = 0;
  let isDataUnavailable = true;

  let waterIntakeLog = null;

  // If data is from previous date, then we don't have to show it
  if (lastWaterIntakeLog != null && lastWaterIntakeLog.date !== todayDate) {
    lastWaterIntakeLog.waterIntake = 0;
  }

  if (lastWaterIntakeLog) {
    waterIntakeLog = new WaterIntakeLog(
      lastWaterIntakeLog.waterIntake,
      lastWaterIntakeLog.date,
      lastWaterIntakeLog.waterIntakeUnit
    );
    isAddedToday = DateUtil.isAbsoluteToday(lastWaterIntakeLog.date);
    hasFutureDate = DateUtil.isFutureDate(lastWaterIntakeLog.date);
    isTargetAchieved = lastWaterIntakeLog.waterIntake > targetWaterIntakeLevel;
    isDataUnavailable = false;
  }

  if (isAddedToday) {
    if (lastWaterIntakeLog.rewardPoints) {
      rewardPoints = lastWaterIntakeLog.rewardPoints;
    }
  }

  if (hasFutureDate) {
    rewardPoints = RewardPointsConstant.WaterChartingMax; // maximum
  }

  const shouldShowContent = !!waterIntakeLog; // is equivalent to data? true : false

  return (
    <EmptyCard
      title="Water Intake"
      subTitle={
        userType === USER_TYPE.PATIENT
          ? "Update today’s water intake"
          : " No data added"
      }
      isWaterIntakeCard
      shouldShowContent={shouldShowContent}
      shouldShowAddButton={shouldShowAddButton}
      isAddedToday={isAddedToday && isTargetAchieved}
      icon={R.Images.waterIntakeCardLogoNew}
      startAnimation={startAnimation}
      onClick={() => {
        if (userType === USER_TYPE.PATIENT) {
          addData(waterIntakeLog, rewardPoints, isDataUnavailable);
        }
      }}
    >
      <WaterIntakeCard
        waterIntakeLog={waterIntakeLog}
        targetWaterIntake={targetWaterIntakeLevel}
        onCardSelect={() => onCardSelect(targetWaterIntakeLevel)}
        addData={() => addData(waterIntakeLog, rewardPoints, isDataUnavailable)}
      />
    </EmptyCard>
  );
};
