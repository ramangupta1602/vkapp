import React from "react";
import { BodyMeasurementsCard } from "./BodyMeasurementsCard";
import { EmptyCard } from "../EmptyCard";
import { BodyMeasurementModel } from "Library/Models/BodyMeasurementModel";
import { R } from "Resources";
import { USER_TYPE } from "Library/Constants";
import * as DateUtil from "../../../../Library/Utils/DateUtil";

export const BodyMeasurementSection = ({
  onCardSelect,
  addData,
  data,
  userType,
  heightUnit,
  cmHeight,
  gender,
  startAnimation,
  currentWeek,
}) => {
  const lastBodyMeasurement = data;
  const shouldShowAddButton = userType === USER_TYPE.PATIENT;
  let isAddedToday = false;
  let hasFutureEntry = false;
  let isWithInWeek = false;
  let canAddRewardPoint = true;
  let lastLogWeek = -1;
  let isDataUnavailable = true;

  let bodyMeasurement = null;

  if (lastBodyMeasurement) {
    const logDate = lastBodyMeasurement.date;
    lastLogWeek = lastBodyMeasurement.week;

    bodyMeasurement = new BodyMeasurementModel(lastBodyMeasurement);
    isAddedToday = DateUtil.isAbsoluteToday(logDate);
    hasFutureEntry = DateUtil.isFutureDate(logDate);
    isWithInWeek =
      lastLogWeek === currentWeek && DateUtil.isAbsoluteWithinAWeek(logDate);

    isDataUnavailable = false;
  }

  if (isAddedToday || hasFutureEntry || isWithInWeek) {
    canAddRewardPoint = false;
  }

  const shouldShowContent = !!bodyMeasurement; // is equivalent to data? true : false

  return (
    <EmptyCard
      title="Body Measurements"
      userType={userType}
      shouldShowContent={shouldShowContent}
      subTitle={
        userType == USER_TYPE.PATIENT
          ? "Update weekly body measurement"
          : " No data added"
      }
      shouldShowAddButton={shouldShowAddButton}
      icon={R.Images.measurementEmptyNew}
      isAddedToday={isAddedToday}
      onClick={() =>
        addData(bodyMeasurement, canAddRewardPoint, isDataUnavailable)
      }
      startAnimation={startAnimation}
    >
      <BodyMeasurementsCard
        gender={gender}
        bodyMeasurement={bodyMeasurement}
        onCardSelect={() => onCardSelect(bodyMeasurement, canAddRewardPoint)}
        addData={() =>
          addData(bodyMeasurement, canAddRewardPoint, isDataUnavailable)
        }
        heightUnit={heightUnit}
        userType={userType}
        cmHeight={cmHeight}
      />
    </EmptyCard>
  );
};
