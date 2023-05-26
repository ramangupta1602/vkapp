import React from "react";
import { DayPerformanceCard } from "./DayPerformanceCard";
import { EmptyCard } from "../EmptyCard";
import { DayPerformanceModel } from "Library/Models/DayPerformanceModel";
import { R } from "Resources";
import { USER_TYPE } from "Library/Constants";
import { MOODS } from "../../../DaysPerformance/Moods";
import * as DateUtil from "../../../../Library/Utils/DateUtil";

export const DayPerformanceSection = ({
  onCardSelect,
  addData,
  data,
  userType,
  startAnimation,
}) => {
  let dayPerformance = null;
  const shouldShowAddButton = userType === USER_TYPE.PATIENT;
  let isAddedToday = false;
  let hasFutureData = false;
  let rewardPoints = 0;
  let isDataUnavailable = true;

  if (data) {
    isDataUnavailable = false;
    dayPerformance = new DayPerformanceModel(data.rating, data.date);
    isAddedToday = DateUtil.isAbsoluteToday(data.date);
    hasFutureData = DateUtil.isFutureDate(data.date);
    rewardPoints = data.rewardPoints ? data.rewardPoints : 0;
  }

  // if data is not added today, then start reward count from 0.
  if (!isAddedToday) {
    rewardPoints = 0;
  }

  // if data is for future date, then we don't give user reward.
  if (hasFutureData) {
    rewardPoints = 3;
  }

  const shouldShowContent = !!dayPerformance;

  return (
    <EmptyCard
      title="Day Performance"
      userType={userType}
      subTitle={
        userType == USER_TYPE.PATIENT
          ? "How was your day today?"
          : " No data added"
      }
      shouldShowContent={shouldShowContent}
      shouldShowAddButton={shouldShowAddButton}
      isAddedToday={isAddedToday}
      icon={R.Images.dayPerformanceEmptyNew}
      onClick={() => {
        addData(rewardPoints, isDataUnavailable);
      }}
      startAnimation={startAnimation}
    >
      <DayPerformanceCard
        updatedDate={dayPerformance ? dayPerformance.date : "2020-02-02"}
        mood={MOODS[dayPerformance ? dayPerformance.rating.toString() : 1]}
        onCardSelect={onCardSelect}
        userType={userType}
        addData={addData}
        rewardPoints={rewardPoints}
        isDataUnavailable={isDataUnavailable}
      />
    </EmptyCard>
  );
};
