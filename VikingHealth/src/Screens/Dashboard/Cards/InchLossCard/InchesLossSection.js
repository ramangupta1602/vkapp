import React from "react";
import { EmptyCard } from "../EmptyCard";
import InchesLossCard from "./InchesLossCard";
import { R } from "Resources";
import { USER_TYPE } from "Library/Constants";
import { HeightWeightUtil } from "../../../../Library/Utils/HeightWeightUtil";

export const InchesLossSection = ({
  weightLogs,
  bodyMeasurementLogs,
  userType,
  onCardSelect,
  weightUnit,
  heightUnit,
  startDate,
  startAnimation,
}) => {
  const hasWeightLogs = weightLogs && weightLogs.length > 0;
  const hasBMLogs = bodyMeasurementLogs && bodyMeasurementLogs.length > 0;
  const shouldShowContent = hasWeightLogs || hasBMLogs;

  let weightLoss = 0;
  let bmLoss = 0;

  // Weight loss calculation...
  if (hasWeightLogs) {
    const parsedData = HeightWeightUtil.parseLogData({ weightLogs });
    const convertedData = HeightWeightUtil.convertWeightUnit(
      parsedData,
      weightUnit
    );

    const lossData = HeightWeightUtil.computeLoss(convertedData, startDate);
    const lastWeekLostData = HeightWeightUtil.getCurrentWeekLossData(lossData);
    weightLoss = parseFloat(lastWeekLostData.toFixed(1));
  }

  // BM loss calculation...
  if (hasBMLogs) {
    const parsedData = HeightWeightUtil.parseBMLogData({
      bodyMeasurements: bodyMeasurementLogs,
    });
    const convertedData = HeightWeightUtil.convertHeightUnit(
      parsedData,
      heightUnit
    );

    const lossData = HeightWeightUtil.computeBMLoss(
      convertedData,
      startDate,
      true
    );
    bmLoss = parseFloat(lossData.toFixed(1));
  }

  return (
    <EmptyCard
      title="Inches Lost"
      userType={userType}
      subTitle={
        userType == USER_TYPE.PATIENT
          ? "Get started to see your progress"
          : " No data added"
      }
      shouldShowContent={shouldShowContent}
      shouldShowAddButton={false}
      isAddedToday={false}
      icon={R.Images.inchesLossLogoNew}
      startAnimation={startAnimation}
    >
      <InchesLossCard
        weightLoss={weightLoss}
        inchesLoss={bmLoss}
        onCardSelect={onCardSelect}
        heightUnit={heightUnit}
        weightUnit={weightUnit}
      />
    </EmptyCard>
  );
};
