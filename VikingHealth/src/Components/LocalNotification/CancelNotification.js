import PushNotification from 'react-native-push-notification';
import moment from 'moment';

export class CancelNotification {
  disableLocalNotificationWeight() {
    PushNotification.cancelLocalNotifications({
      id: '1',
    });
  }
  disableLocalNotificationDays() {
    PushNotification.cancelLocalNotifications({
      id: '2',
    });
  }
  disableLocalNotificationBodyMeasurement() {
    PushNotification.cancelLocalNotifications({
      id: '3',
    });
  }
  disableAllLocalNotification() {
    PushNotification.cancelAllLocalNotifications();
  }
  disableCycleSummaryNotification() {
    PushNotification.cancelLocalNotifications({
      id: '-1',
    });
  }

  disableRewardPointExpiryReminderNotification() {
    PushNotification.cancelLocalNotifications({
      id: '-2',
    });
  }

  disableRewardPointExpiryNotification() {
    PushNotification.cancelLocalNotifications({
      id: '-3',
    });
  }

  cancelAppointmentNotification(startTime) {
    const notificationId = moment(startTime).format('MMDDHHMM');

    PushNotification.cancelLocalNotifications({
      id: `${notificationId}1`,
    });

    PushNotification.cancelLocalNotifications({
      id: `${notificationId}2`,
    });
  }
}
