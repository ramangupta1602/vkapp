import * as DateUtil from '../../Library/Utils/DateUtil';
import { R } from '../../Resources/R';

export function getSlotData(startTime, endTime, receivedDate) {
  const date = receivedDate ?? DateUtil.addDaysFormatted(moment(), -1);
  const startingHour = startTime.hours() + startTime.minutes() / 60;

  return {
    startTime,
    endTime,
    date, // I will look this variable to deleted whether I have to show selected slots or not, because slots are not changing when I am changing dates
    startHour: startingHour, // used for sorting
    icon:
      startingHour < 18
        ? R.Images.AppointmentImages.Sun
        : R.Images.AppointmentImages.Moon,
  };
}
