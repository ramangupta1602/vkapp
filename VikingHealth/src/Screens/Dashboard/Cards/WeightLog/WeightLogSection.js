import React from "react";
import { WeightCard } from "./WeightCard";
import { EmptyCard } from "../EmptyCard";
import { WeightLog } from "Library/Models/WeightLogModel";
import { R } from "Resources";
import { USER_TYPE } from "Library/Constants";
import * as DateUtil from "../../../../Library/Utils/DateUtil";

export const WeightLogSection = ({
  onCardSelect,
  addData,
  data,
  userType,
  onBmiBubbleTap,
  startAnimation,
}) => {
  const lastWeightLog = data;
  let weightLog = null;
  const shouldShowAddButton = userType === USER_TYPE.PATIENT;
  const shouldShowEditTargetWeightButton = userType === USER_TYPE.ADMIN;
  let isAddedToday = false;

  if (lastWeightLog) {
    weightLog = new WeightLog(
      lastWeightLog.weight,
      lastWeightLog.date,
      lastWeightLog.weightUnit
    );

    isAddedToday = DateUtil.isAbsoluteToday(lastWeightLog.date);
  }

  const shouldShowContent = !!weightLog; // is equivalent to data? true : false

  return (
    <EmptyCard
      title="Weight"
      subTitle={
        userType === USER_TYPE.PATIENT
          ? "Update today’s weight"
          : " No data added"
      }
      shouldShowAddButton={shouldShowAddButton}
      shouldShowEditTargetWeightButton={shouldShowEditTargetWeightButton}
      isAddedToday={isAddedToday}
      icon={R.Images.weightEmptyNew}
      type="weightCard"
      userType={userType}
      addData={addData}
      startAnimation={startAnimation}
      onClick={() => {
        if (userType === USER_TYPE.PATIENT) {
          addData(weightLog);
        }
      }}
      shouldShowContent={shouldShowContent}
    >
      <WeightCard
        weightLog={weightLog}
        onCardSelect={() => onCardSelect(weightLog)}
        onBmiBubbleTap={onBmiBubbleTap}
        addData={() => addData(weightLog)}
      />
    </EmptyCard>
  );
};
