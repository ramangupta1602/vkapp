import { observable, action, set, computed } from "mobx";
import { persist } from "mobx-persist";
import { InitialRewardData } from "../Screens/Reward/RewardData";
import {
  RewardKeys,
  convertPointToAmountString,
} from "../Screens/Reward/RewardManager";
import * as DateUtil from "../Library/Utils/DateUtil";
import { LocalNotification } from "../Components/LocalNotification/LocalNotification";
import { CancelNotification } from "../Components/LocalNotification/CancelNotification";
import { USER_TYPE } from "../Library/Constants";
import { UserAccountStore } from "./UserAccountStore";
import { hasRewardExpired } from "../Screens/Reward/RewardManager";
import moment from "moment";

const {
  DayPerformance,
  WaterIntake,
  BodyMeasurement,
  CalorieIntake,
  Total,
} = RewardKeys;

export class RewardStore {
  userAccountStore = new UserAccountStore();

  @persist("object") @observable rewardData = InitialRewardData;
  @observable showRewardOf = 1;
  @observable showConfetti = false;

  @persist("object") @observable initialWeightLog = null;
  @persist("object") @observable initialBodyMeasurementLog = null;
  @persist @observable flagShowRewardTooltip = false;
  @persist @observable flagShowRewardInfoTooltip = false;

  @persist @observable rewardPointsHistoryData = "[]";

  // Popup variables.
  @persist points = 0;
  @persist currentPopupValue = 0;
  @persist previousPopupValue = 0;
  @persist popupMeasurementUnit = 0;
  @persist weightPercentageLoss = 0;

  // for redeem notifications
  @persist programStartDate = null;
  @persist programEndDate = null;
  @persist hasScheduledNotification = false;

  constructor(userAccountStore) {
    this.userAccountStore = userAccountStore;
  }

  scheduleLocalNotification(credit) {
    const notification = new LocalNotification();
    const startDate = this.userAccountStore.startDate;

    const currentDate = moment().startOf("dates");
    const expiryDate = moment(startDate).add(6, "months").startOf("day");
    const remainderNotificationDate = moment(startDate)
      .add(6, "months")
      .subtract(10, "days")
      .startOf("day");

    if (currentDate.isBefore(remainderNotificationDate)) {
      notification.scheduleRewardPointExpiryReminderNotification(
        remainderNotificationDate,
        credit
      );
    }

    if (currentDate.isBefore(expiryDate)) {
      notification.scheduleRewardPointExpiryNotification(expiryDate, credit);
    }

    this.hasScheduledNotification = true;
  }

  cancelLocalNotification() {
    const notification = new CancelNotification();
    notification.disableRewardPointExpiryNotification();
    notification.disableRewardPointExpiryReminderNotification();
    this.hasScheduledNotification = false;
  }

  checkForNotification(rewardPoints) {
    if (this.userAccountStore.loginStore.userType == USER_TYPE.ADMIN) {
      return;
    }

    let receivedRewardPoints = rewardPoints ?? InitialRewardData;

    const startDate = this.userAccountStore.startDate;
    const hasCreditExpired = hasRewardExpired(startDate);
    const credit = convertPointToAmountString(
      receivedRewardPoints[RewardKeys.Total]
    );

    if (hasCreditExpired) {
      return;
    }

    const receivedCreditUsed = receivedRewardPoints[RewardKeys.HasCreditUsed];
    const receivedTotal = receivedRewardPoints[RewardKeys.Total];

    const currentCreditUsed = this.rewardData[RewardKeys.HasCreditUsed];
    const currentTotal = this.rewardData[RewardKeys.Total];

    if (currentCreditUsed != receivedCreditUsed && receivedCreditUsed) {
      this.cancelLocalNotification();
      return;
    }

    if (currentTotal == receivedTotal) {
      return;
    }

    if (receivedTotal === 0) {
      this.cancelLocalNotification();
    }

    this.scheduleLocalNotification(credit);
  }

  updateNotificationAfterAddingPoints() {
    const credit = convertPointToAmountString(
      this.rewardData[RewardKeys.Total]
    );
    this.scheduleLocalNotification(credit);
  }

  @action setDayPerformanceReward(point) {
    if (point < 1) {
      return;
    }

    this.rewardData[DayPerformance].points += point;
    this.rewardData[DayPerformance].date = DateUtil.formattedTodayDate();
    this.updateTotalAndConfetti(point);
    this.updateNotificationAfterAddingPoints();
  }

  @action setWaterPerformanceReward(point) {
    if (point < 1) {
      return;
    }

    this.rewardData[WaterIntake].points += point;
    this.rewardData[WaterIntake].date = DateUtil.formattedTodayDate();
    this.updateTotalAndConfetti(point);

    this.updateNotificationAfterAddingPoints();
  }

  @action setCalorieIntakeReward(point) {
    if (point < 1) {
      return;
    }

    this.rewardData[CalorieIntake].points += point;
    this.rewardData[CalorieIntake].date = DateUtil.formattedTodayDate();
    this.updateTotalAndConfetti(point, false);

    this.updateNotificationAfterAddingPoints();
  }

  @action setBMChartingReward(point) {
    if (point < 1) {
      return;
    }

    this.rewardData[BodyMeasurement].points += point;
    this.rewardData[BodyMeasurement].date = DateUtil.formattedTodayDate();
    this.updateTotalAndConfetti(point);

    this.updateNotificationAfterAddingPoints();
  }

  @action disableShowConfetti() {
    // this.showRewardOf = 1;
    this.showConfetti = false;
  }

  @action setRewardPointFromUserProfile(rewardPoints, rewardPointsHistory) {
    this.checkForNotification(JSON.parse(rewardPoints));

    if (rewardPoints) {
      this.rewardData = {
        ...InitialRewardData,
        ...JSON.parse(rewardPoints),
      };
    } else {
      this.rewardData = InitialRewardData; // in case we delete reward directly, then we want to set it to initial as it will receive null for rewardpoints
    }

    if (rewardPointsHistory) {
      this.rewardPointsHistoryData = rewardPointsHistory;
    }
  }

  @computed get rewardPointsHistory() {
    if (!this.rewardPointsHistoryData) {
      return [];
    }

    if (this.rewardPointsHistoryData.length === 0) {
      return [];
    }

    return JSON.parse(this.rewardPointsHistoryData);
  }

  @action setRewardForKey(input) {
    var total = 0;

    input.forEach((item) => {
      this.rewardData[item.key].points += item.points;
      this.rewardData[item.key].date = DateUtil.formattedTodayDate();
      total += item.points;
    });

    this.updateTotalAndConfetti(total, false);
    this.updateNotificationAfterAddingPoints();
  }

  @action setInitialWeightLog(weightLog) {
    this.initialWeightLog = weightLog;
  }

  @action setInitialBodyMeasurement(bodyMeasurement) {
    this.initialBodyMeasurementLog = bodyMeasurement;
  }

  @action setPointRedeemed(isRedeem) {
    set(this.rewardData, RewardKeys.HasRedeemedForCurrentCycle, isRedeem);
  }

  @action setPopupData = ({
    currentPopupValue,
    previousPopupValue,
    popupMeasurementUnit,
    weightPercentageLoss,
    points,
  }) => {
    this.currentPopupValue = currentPopupValue;
    this.previousPopupValue = previousPopupValue;
    this.popupMeasurementUnit = popupMeasurementUnit;
    this.weightPercentageLoss = weightPercentageLoss;
    this.points = points;
  };

  updateTotalAndConfetti(point, showConfetti = true) {
    if (point <= 0) {
      return;
    }

    // if total was previously 0, then we have to show tooltip
    if (this.rewardData[Total] === 0) {
      this.flagShowRewardTooltip = showConfetti; // show confetti is only false in calorie case, we want to tooltip after adding it.
    }

    this.rewardData[Total] += point;

    this.showRewardOf = point;
    this.showConfetti = showConfetti;
  }

  @action updateConfettiForBodymeasurement(point) {
    if (point <= 0 || !point) {
      return;
    }

    this.showRewardOf = point;
    this.showConfetti = true;

    // if total was previously 8 (i.e for current record , total is set by setRewardForKey),
    // then we have to show tooltip
    if (this.rewardData[Total] === 8) {
      this.flagShowRewardTooltip = true; // show confetti is only false in calorie case, we want to tooltip after adding it.
    }
  }

  @action unsetToolTipFlag() {
    this.flagShowRewardTooltip = false;
    this.flagShowRewardInfoTooltip = true;
  }

  @action unsetRewardHistoryTooltip() {
    this.flagShowRewardInfoTooltip = false;
  }

  @action updateRewardAfterCycleReload() {
    this.rewardData = { ...InitialRewardData };
    this.cancelLocalNotification();
  }

  hasAvailedRewardForKey(key) {
    return this.rewardData[key].points > 0;
  }

  setRewardCreditUsed() {
    this.rewardData[RewardKeys.HasCreditUsed] = true;
  }

  clearData() {
    this.rewardData = InitialRewardData;
    this.showRewardOf = 1;
    this.flagShowRewardTooltip = false;

    this.points = 0;
    this.currentPopupValue = 0;
    this.previousPopupValue = 0;
    this.popupMeasurementUnit = 0;
    this.weightPercentageLoss = 0;

    this.rewardPointsHistoryData = "[]";
    this.initialBodyMeasurementLog = null;
    this.initialWeightLog = null;
    this.hasScheduledNotification = false;
  }
}
