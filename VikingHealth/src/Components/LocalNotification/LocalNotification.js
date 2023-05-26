import ScheduleNotification from "./ScheduleNotification";
import moment from "moment";
import { AsyncStorage } from "react-native";
import { Platform } from "react-native";
import * as DateUtil from "Library/Utils/DateUtil";
import { CancelNotification } from "./CancelNotification";

export class LocalNotification {
  constructor() {
    this.scheduleNotification = new ScheduleNotification();
    this.cancelNotification = new CancelNotification();
  }
  scheduleLocalNotification(endDate, startDate) {
    this.scheduleNotification.scheduleLocalNotificationWeight();
    this.scheduleNotification.scheduleLocalNotificationDays();
    this.scheduleNotification.scheduleLocalNotificationSummaryPopup(endDate);

    const startProgramDate = moment(startDate);
    const numberOfDaysDiff = DateUtil.differenceInDaysForProverbs(startDate);

    if (Platform.OS === "android") {
      this.scheduleProverbsNotification(numberOfDaysDiff, endDate);
    } else {
      this.scheduleNextsetofproverb(
        numberOfDaysDiff,
        endDate,
        startProgramDate
      );
    }
  }

  scheduleBodyMeasurementLocalNotification() {
    this.scheduleNotification.scheduleLocalNotificationBodyMeasurement();
  }

  scheduleViewSummaryNotification(endDate) {
    this.scheduleNotification.scheduleLocalNotificationSummaryPopup(endDate);
  }

  scheduleRewardPointExpiryReminderNotification(date, credit) {
    this.cancelNotification.disableRewardPointExpiryReminderNotification();
    this.scheduleNotification.scheduleRewardPointExpiryReminderNotification(
      date,
      credit
    );
  }

  scheduleRewardPointExpiryNotification(date, credit) {
    this.cancelNotification.disableRewardPointExpiryNotification();
    this.scheduleNotification.scheduleRewardPointExpiryNotification(
      date,
      credit
    );
  }

  scheduleAppointmentRemainderNotification(startTime, endTime, appointmentId) {
    this.cancelNotification.cancelAppointmentNotification(startTime);
    this.scheduleNotification.scheduleAppointmentRemainderNotification(
      startTime,
      endTime,
      appointmentId
    );
  }

  checkNewDateForProverbs(tomorrow, startProgramDate, endDate) {
    if (Platform.OS === "android") {
      // I don't know why this is done, but removing it makes the code not run certain things - Shikhar.
    } else {
      const current = moment();
      const numberOfDaysDiff = current.diff(startProgramDate, "days");
      AsyncStorage.getItem("tempEndDate").then((value) => {
        const tempEndDate = value;
        if (tempEndDate) {
          this.scheduleNextsetofproverb(
            numberOfDaysDiff,
            tempEndDate,
            startProgramDate
          );
        }
      });
    }
  }

  scheduleNextsetofproverb(numberOfDaysDiff, endDate, startProgramDate) {
    if (moment(endDate).diff(moment(), "days") <= 42) {
      this.scheduleProverbsNotification(numberOfDaysDiff, endDate);
      AsyncStorage.removeItem("tempEndDate");
    } else {
      const tempDate = moment().add(42, "days");
      const tempEndDate = DateUtil.getDate(tempDate);
      const currentDate = moment();
      const numberOfDaysDifference = currentDate.diff(startProgramDate, "days");
      AsyncStorage.setItem("tempEndDate", JSON.stringify(tempEndDate));
      this.scheduleProverbsNotification(numberOfDaysDifference, tempEndDate);
    }
  }

  scheduleProverbsNotification(numberOfDaysDiff, endDate) {
    let notificationDate = moment();
    let i = 0;
    while (notificationDate.isSameOrBefore(moment(endDate))) {
      i++;

      this.scheduleNotification.scheduleMotivationalQuotes(
        notificationDate.toDate(),
        i + 5, // as id for rest of the notifications are set as 1, 2 and 3
        numberOfDaysDiff
      );
      notificationDate = moment(notificationDate).add(1, "days");
      numberOfDaysDiff++;
    }
  }

  scheduleNotificationWithSnoozeButton() {
    this.scheduleNotification.scheduleNotificationWithSnoozeButton();
  }

  cancelAppointmentNotification(startTime) {
    this.cancelNotification.cancelAppointmentNotification(startTime);
  }
}
