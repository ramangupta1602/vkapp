import PushNotification from "react-native-push-notification";
import moment from "moment";
import AppUtil from "../../Library/Utils/AppUtil";
import { quotes } from "./Proverbs";

export default class ScheduleNotification {
  scheduleLocalNotificationWeight() {
    const now = moment().add(1, "days").toDate();
    now.setHours(8);
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);
    PushNotification.localNotificationSchedule({
      message: "Time to record your weight",
      title: "Please record your weight",
      smallIcon: "ic_notification",
      largeIcon: "ic_notification",
      date: now,
      repeatType: "day",
      userInfo: {
        id: "1",
        screenType: "LogWeight",
      },
      id: "1",
      popInitialNotification: false,
    });
  }
  scheduleLocalNotificationSummaryPopup(programEndDate) {
    const now = moment(programEndDate).add(1, "days").toDate();
    now.setHours(9);
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);
    PushNotification.localNotificationSchedule({
      message: "Your Program Summary is ready. Tap to view.",
      title: "Program Completed",
      smallIcon: "ic_notification",
      largeIcon: "ic_notification",
      date: now,
      userInfo: {
        id: "-1", // because motivation quote id is incremental counter from 5 to .., therefore going in reverse direction
        screenType: "Dashboard",
      },
      id: "-1",
      popInitialNotification: false,
    });
  }

  scheduleRewardPointExpiryReminderNotification(date, credit) {
    const now = moment(date).toDate();
    now.setHours(9);
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);

    PushNotification.localNotificationSchedule({
      message: `Hey! Your reward points worth ${credit} are expiring in 10 days. Redeem them for future Viking Health Services.`,
      title: "Viking Health",
      smallIcon: "ic_notification",
      largeIcon: "ic_notification",
      date: now,
      userInfo: {
        id: "-2", // because motivation quote id is incremental counter from 5 to .., therefore going in reverse direction
        screenType: "RewardHistory",
      },
      id: "-2",
      popInitialNotification: false,
    });
  }

  scheduleRewardPointExpiryNotification(date, credit) {
    const now = moment(date).toDate();
    now.setHours(9);
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);

    PushNotification.localNotificationSchedule({
      message: `Your reward points have expired.`,
      title: "Viking Health",
      smallIcon: "ic_notification",
      largeIcon: "ic_notification",
      date: now,
      userInfo: {
        id: "-3", // because motivation quote id is incremental counter from 5 to .., therefore going in reverse direction
        screenType: "RewardHistory",
      },
      id: "-3",
      popInitialNotification: false,
    });
  }

  scheduleLocalNotificationDays() {
    const now = moment().add(1, "days").toDate();
    now.setHours(20);
    now.setMinutes(0);
    now.setMilliseconds(0);
    PushNotification.localNotificationSchedule({
      message: "Time to record day's performance",
      title: "Please record your day's performance",
      date: now,
      smallIcon: "ic_notification",
      largeIcon: "ic_notification",
      repeatType: "day",
      userInfo: {
        id: "2",
        screenType: "DaysPerformance",
      },
      id: "2",
      popInitialNotification: false,
    });
  }
  scheduleLocalNotificationBodyMeasurement() {
    const startDate = moment().add(7, "days").toDate();
    startDate.setHours(8);
    startDate.setMinutes(5);
    startDate.setMilliseconds(0);
    PushNotification.localNotificationSchedule({
      message: "Time to add weekly body measurement",
      title: "Please record body measurement",
      smallIcon: "ic_notification",
      largeIcon: "ic_notification",
      date: startDate,
      repeatType: "week",
      userInfo: {
        id: "3",
        screenType: "BodyMeasurements",
      },
      id: "3",
      popInitialNotification: false,
    });
  }
  scheduleMotivationalQuotes(selectedDate, id, numberOfDaysDiff) {
    selectedDate.setHours(7);
    selectedDate.setMinutes(0);
    selectedDate.setMilliseconds(0);

    const validDay = AppUtil.getQuotesIndex(numberOfDaysDiff); ///numberOfDaysDiff%quotes.length;

    // console.log(AppUtil.quotesSelection(validDay), validDay);

    if (moment(selectedDate).isSameOrAfter(moment())) {
      PushNotification.localNotificationSchedule({
        message: "AppUtil.quotesSelection(validDay)",
        title: "Quote for the day!",
        date: selectedDate,
        smallIcon: "ic_notification",
        largeIcon: "ic_notification",
        userInfo: {
          id,
          screenType: "Dashboard",
        },
        id,
        popInitialNotification: false,
      });
    }
  }

  scheduleAppointmentRemainderNotification(startTime, endTime, appointmentId) {
    const oneDayBefore = moment(startTime).subtract(1, "d");
    const oneHourBefore = moment(startTime).subtract(30, "m");

    const currentTime = moment();
    const appointmentTime = moment(startTime).format("hh:mm A");
    const appointmentEndTime = moment(endTime).format("hh:mm A");

    const appointmentNotificationIdentifier = startTime.format("MMDDHHMM");

    if (currentTime.isSameOrBefore(moment(oneDayBefore).subtract(5, "m"))) {
      PushNotification.localNotificationSchedule({
        message: `You have an upcoming appointment with Dr. Middelthon from ${appointmentTime} - ${appointmentEndTime} tomorrow. Please be available on time.`,
        title: "Viking Health",
        date: oneDayBefore.toDate(),
        smallIcon: "ic_notification",
        largeIcon: "ic_notification",
        userInfo: {
          id: `${appointmentNotificationIdentifier}1`,
          screenType: "AppointmentListing",
          type: "APP_NOTIFICATION",
        },
        id: `${appointmentNotificationIdentifier}1`,
        popInitialNotification: false,
      });
    }

    if (currentTime.isSameOrBefore(moment(oneHourBefore).subtract(5, "m"))) {
      PushNotification.localNotificationSchedule({
        message: `You have an upcoming appointment with Dr. Middelthon from ${appointmentTime} - ${appointmentEndTime} in 30 minutes. Please be available on time.`,
        title: "Viking Health",
        date: oneHourBefore.toDate(),
        smallIcon: "ic_notification",
        largeIcon: "ic_notification",
        userInfo: {
          id: `${appointmentNotificationIdentifier}2`,
          screenType: "AppointmentListing",
          type: "APP_NOTIFICATION",
        },
        id: `${appointmentNotificationIdentifier}2`,
        popInitialNotification: false,
      });
    }
  }

  scheduleNotificationWithSnoozeButton() {
    PushNotification.localNotificationSchedule({
      message: "With Snooze Button",
      title: "Snooze",
      date: new Date(),
      smallIcon: "ic_notification",
      largeIcon: "ic_notification",
      actions: '["Snooze", "Not Snooze"]',
      userInfo: {
        id: "-10",
        screenType: "Dashboard",
      },
      id: "-10",
      popInitialNotification: false,
    });
  }
}
