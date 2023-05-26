import moment from 'moment-timezone';
import * as DateUtils from './DateUtil';

export const DoctorTimeZone = 'America/Los_Angeles';
export const DISPLAY_FORMAT = 'YYYY-MM-DD';

export function getMonthNameArray(noOfMonths) {
  const current = moment();
  const finalDate = moment().add(noOfMonths, 'months');

  const monthArray = [];

  while (finalDate.diff(current) >= 0) {
    monthArray.push(current.format('MMM YYYY'));
    current.add(1, 'months');
  }

  return {
    startDate: DateUtils.formattedTodayDate(),
    endDate: DateUtils.getFormattedDate(finalDate),
    monthArray,
  };
}

export function getMaxMinAppointmentDate(noOfMonths) {
  let maxDate = null;

  const currentLocalDate = moment();

  maxDate = moment(currentLocalDate).add(noOfMonths, 'months');

  return {
    currentLocalDate,
    maxDate,
  };
}

export function getMonthDaysForMonth(month, minDate, maxDate) {
  const firstDateOfMonth = moment(`01 ${month}`).startOf('month');
  const lastDateOfMonth = moment(`01 ${month}`).endOf('month');

  const range = moment.range(firstDateOfMonth, lastDateOfMonth);

  const dayArray = [];

  for (let day of range.by('day')) {
    if (day.isBefore(minDate, 'days') || day.isAfter(maxDate, 'days')) {
      continue;
    }

    const data = {
      date: day.date(),
      month: day.month(),
      year: day.year(),
      dayOfWeek: day.day(),
      dateString: day.format(DISPLAY_FORMAT),
    };

    dayArray.push(data);
  }

  return dayArray;
}

export function convertTimeToPST(date) {
  const convertedDate = moment(date).tz(DoctorTimeZone);
  return convertedDate;
}

export function getPSTTime(time) {
  const pstTime = moment.tz(time, DoctorTimeZone);
  return pstTime;
}

export function convertToUTCTime(time) {
  return moment(time).utc();
}

// console.log("current time in IST", DateUtils.VideoDateFormatted(moment()));
//   console.log(
//     "current time in UTC",
//     DateUtils.VideoDateFormatted(moment().utc())
//   );
//   console.log(
//     "current time in PST",
//     DateUtils.VideoDateFormatted(moment().tz("America/Los_Angeles"))
//   );

//   console.log(
//     "PST to Local",
//     DateUtils.VideoDateFormatted(moment().tz("America/Los_Angeles").local())
//   );

//   console.log(
//     "Current time from IST to UTC to PST",
//     DateUtils.VideoDateFormatted(moment().utc().tz("America/Los_Angeles"))
//   );
