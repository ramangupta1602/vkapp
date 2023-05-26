import moment from 'moment';
import { extendMoment } from 'moment-range';

const momentRange = extendMoment(moment);

const REFERENCE = moment(); // fixed just for testing, use moment();
const TODAY = REFERENCE.clone().startOf('day');
const YESTERDAY = REFERENCE.clone().subtract(1, 'days').startOf('day');
export const A_WEEK_OLD = REFERENCE.clone().subtract(7, 'days').startOf('day');

export function formattedTodayDate() {
  return formatDate(moment().toDate());
}

export function getTomorrowDate() {
  const todayDate = moment();
  todayDate.add(1, 'days');
  return todayDate.format('YYYY-MM-DD');
}

export function formatDate(date) {
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function formatDateAccordingToSystemMonth(date) {
  const year = date.getFullYear().toString();
  const month = date.getMonth().toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function weekRangeFor(date) {
  const reference = moment(date);
  const begin = reference.clone().isoWeekday(1);
  //reference.clone().startOf('isoWeek')
  const end = reference.clone().isoWeekday(7);
  //begin.clone().add(6, 'days').startOf('day')

  //const beginStr = begin.format("MM/DD/YYYY");
  //const endStr = end.format("MM/DD/YYYY");

  return {
    begin,
    end,
  };
}

export function addWeek(date, noOfWeek) {
  const reference = moment(date);
  reference.add(noOfWeek, 'weeks');
  return reference.format('DD MMM');
}

export function addWeekFormatted(date, noOfWeek) {
  const reference = moment(date);
  reference.add(noOfWeek, 'weeks');
  return reference.format('YYYY-MM-DD');
}

export function addDays(date, noOfDays) {
  const reference = moment(date);
  reference.add(noOfDays, 'days');
  return reference.format('DD MMM');
}

export function addDaysFormatted(date, noOfDays) {
  const reference = moment(date);
  reference.add(noOfDays, 'days');
  return reference.format('YYYY-MM-DD');
}

export function addDayWeek(date, noOfWeek, noOfDays) {
  const reference = moment(date);
  reference.add(noOfWeek, 'weeks');
  reference.add(noOfDays, 'days');
  return reference.format('DD MMM');
}

export function differenceInDaysForProverbs(startDate) {
  const current = moment();
  const startProgramDate = moment(startDate);

  const numberOfDaysDiff = current.diff(startProgramDate, 'days');
  return numberOfDaysDiff;
}

export function absoluteDifferenceFromToday(startDate) {
  const current = moment();
  const startProgramDate = moment(startDate);

  current.startOf('day');
  startProgramDate.startOf('day');

  const numberOfDaysDiff = current.diff(startProgramDate, 'days');
  return numberOfDaysDiff;
}

export function absoluteWeekDifferenceFromToday(startDate) {
  const current = moment();
  const startProgramDate = moment(startDate);

  current.startOf('day');
  startProgramDate.startOf('day');

  const noOfWeek = current.diff(startProgramDate, 'weeks');
  return noOfWeek;
}

export function isFutureDate(date) {
  const daysDiff = absoluteDifferenceFromToday(date);

  return daysDiff < 0;
}

export function isPastDate(date) {
  const daysDiff = absoluteDifferenceFromToday(date);

  return daysDiff > 0;
}

export function absoluteDifference(startDate, endDate) {
  const startProgramDate = moment(startDate);
  const endProgramDate = moment(endDate);

  startProgramDate.startOf('day');
  endProgramDate.startOf('day');

  const numberOfDaysDiff = endProgramDate.diff(startProgramDate, 'days');
  return numberOfDaysDiff;
}

export function differenceInDays(firstDate, secondDate) {
  const a = moment(firstDate, 'MMMM DD, YYYY');
  const b = moment(secondDate, 'MMMM DD, YYYY');
  const diffDays = b.diff(a, 'days');
  return diffDays;
}

export function differenceInTwoDates(firstDate, secondDate) {
  const a = moment(firstDate, 'YYYY-MM-DD');
  const b = moment(secondDate, 'YYYY-MM-DD');
  const diffDays = b.diff(a, 'days');
  return diffDays;
}

export function monthRangeFor(date, programStartDate, programEndDate) {
  const dateToSearch = moment(date);
  if (!(programStartDate && programEndDate)) {
    return {
      begin: dateToSearch,
      end: dateToSearch,
    };
  }
  const programStartDateM = moment(programStartDate);
  //const programEndDateM = moment(programEndDate);

  // if (
  //   !dateToSearch.within(moment().range(programStartDateM, programEndDateM))
  // ) {
  //   return {
  //     begin: programStartDateM,
  //     end: programEndDateM
  //   };
  // }

  // user device date < program start date, so return from start date and till next 4 week
  if (dateToSearch.diff(programStartDate) < 0) {
    return {
      begin: programStartDateM,
      end: programStartDateM.clone().add(4, 'w'),
    };
  }

  let startDateM = moment(programStartDate);
  let endDateM = moment(startDateM);
  endDateM.add(4, 'weeks');
  let dateRange = moment().range(startDateM, endDateM);

  while (!dateToSearch.within(dateRange)) {
    const newStartDate = endDateM.add(0, 'd');
    const newEndDate = newStartDate.clone().add(4, 'w');

    // adding 1 to increment end date without it will enter into infinite loop
    endDateM.add(1, 'd');

    dateRange = moment().range(newStartDate, newEndDate);
  }

  return {
    begin: dateRange.start,
    end: dateRange.end,
  };
}

export function previousDate(date) {
  return moment(date).clone().subtract(1, 'days').startOf('day');
}

export function nextDate(date) {
  return moment(date).clone().add(1, 'days').startOf('day');
}

export function nextMonth(date) {
  return moment(date).add('4', 'w');
}

export function previousMonthDate(date) {
  return moment(date)
    .clone()
    .subtract(moment(date).daysInMonth() + 1, 'days')
    .startOf('day');
}

export function nextMonthDate(date) {
  return moment(date).clone().add(1, 'days').startOf('day');
}

// this function uses old snapshot of today, so even if date changes it will compare it with previous date
export function isToday(momentDate) {
  const isToday = moment(momentDate).isSame(TODAY, 'd');
  return isToday;
}

export function areSameDates(date1, date2) {
  const areSameDate = moment(date1).isSame(date2, 'd');
  return areSameDate;
}

// To overcome with above error, i am introducing this function which is using latest snapshot
export function isAbsoluteToday(momentDate) {
  const reference = moment();
  const today = reference.clone().startOf('day');
  const isToday = moment(momentDate).isSame(today, 'd');
  return isToday;
}

export function isAbsoluteWithinAWeek(momentDate) {
  const week = moment().clone().subtract(7, 'days').startOf('day');
  const isWithinAWeek = moment(momentDate).isAfter(week);
  return isWithinAWeek; //momentDate.isAfter(A_WEEK_OLD);
}

export function isTodayWithinTimeFrame(startDate, duration, unit) {
  const finalDate = moment(startDate)
    .clone()
    .add(duration, unit)
    .startOf('day');
  const isAfterFinalDate = moment().isAfter(finalDate);
  return isAfterFinalDate;
}

export function isAbsoluteYesterday(momentDate) {
  const yesterday = moment().clone().subtract(1, 'days').startOf('day');
  const isYesterday = moment(momentDate).isSame(yesterday, 'd');
  return isYesterday; //m
}

export function isYesterday(momentDate) {
  const isYesterday = moment(momentDate).isSame(YESTERDAY, 'd');
  return isYesterday; //m
}

export function isWithinAWeek(momentDate) {
  const isWithinAWeek = moment(momentDate).isAfter(A_WEEK_OLD);
  return isWithinAWeek; //momentDate.isAfter(A_WEEK_OLD);
}

export function getLastWeekDate() {
  return getFormattedDate(A_WEEK_OLD);
}

export function isTwoWeeksOrMore(momentDate) {
  return !isWithinAWeek(momentDate);
}

export function lastUpdatedDateFormatted(date) {
  const updatedDate = moment(date, 'yyyy-MM-DD');
  if (isToday(updatedDate)) {
    return 'Today';
  } else if (isYesterday(updatedDate)) {
    return 'Yesterday';
  } else if (isWithinAWeek(updatedDate)) {
    return `on ${updatedDate.format('dddd')}`;
  }
  const updateDate = updatedDate.format('MMM DD YYYY');
  return `on ${updateDate}`;
}

export function getDate(date) {
  const updatedDate = moment(date, 'YYYY-MM-DD');

  const newDateFormat = updatedDate.format('YYYY-MM-DD');
  return newDateFormat;
}

export function convertDDMMYYYYtoYYYYMMDD(date) {
  const updatedDate = moment(date, 'DD-MM-YYYY');

  const newDateFormat = updatedDate.format('YYYY-MM-DD');
  return newDateFormat;
}

export function getAppointmentFormattedDate(date) {
  const d = moment(date);
  const format = 'ddd, MMM DD, YYYY';
  return d.format(format);
}

// This time format will be upload to the server
export function getAppointmentFormattedDateTime(date) {
  const d = moment(date);
  const format = 'YYYY-MM-DD HH:mm';
  return d.format(format);
}

export function getAppointmentFormattedTime(date) {
  const d = moment(date);
  const format = 'hh:mm A';
  return d.format(format);
}

export function convertYYYYMMDDtoMMDDYY(date) {
  const updatedDate = moment(date, 'YYYY-MM-DD');

  const newDateFormat = updatedDate.format('MM-DD-YYYY');

  return newDateFormat;
}

export function convertYYYYMMDDtoDDMMMYYYY(date) {
  const updatedDate = moment(date, 'YYYY-MM-DD');

  const newDateFormat = updatedDate.format('DD MMM YYYY');

  return newDateFormat;
}

export function convertDDMMYYYYtoMMDDYYYY(date) {
  const updatedDate = moment(date, 'DD-MM-YYYY');

  const newDateFormat = updatedDate.format('MM-DD-YYYY');
  return newDateFormat;
}

export function getFormattedDate(date) {
  const updatedDate = moment(date, 'YYYY-MM-DD');

  const newDateFormat = updatedDate.format('MMM DD, YYYY');
  return newDateFormat;
}

export function getFormattedDateTime(date) {
  const updatedDate = moment(date, 'YYYY-MM-DD');

  const newDateFormat = updatedDate.format('YYYY-MM-DD hh:mm:ss');
  return newDateFormat;
}

export function dateToString(date, regex) {
  try {
    if (!date) {
      return '';
    }
    if (typeof date.getMonth === 'function' && !!regex) {
      const splitChar =
        regex.indexOf('/') > -1
          ? '/'
          : regex.indexOf('-') > -1
          ? '-'
          : regex.indexOf('.') > -1
          ? '.'
          : '';
      const dateSeparate = regex.split(splitChar);
      let result = '';
      for (const item of dateSeparate) {
        let val = '';
        switch (item) {
          case 'd':
            val = date.getDate();
            break;
          case 'dd':
            val = date2Char(date.getDate());
            break;
          case 'M':
            val = date.getMonth() + 1;
            break;
          case 'MM':
            val = date2Char(date.getMonth() + 1);
            break;
          case 'yyyy':
            val = date.getFullYear();
            break;
          case 'yy':
            val = dadate2Char(date.getFullYear());
            break;
          default:
            break;
        }
        result += val + splitChar;
      }
      return result.substring(0, result.length - 1);
    }
    return date.toString();
  } catch (ex) {
    return '';
  }
}

function concatDateToString(args) {
  if (!args.length) return '';
  let result = '';
  for (let i = 1; i < args.length; i++) {
    result += args[i] + args[0];
  }
  return result.substring(0, result.length - 1);
}

function date2Char(d) {
  return rightString(`0${d}`);
}

function rightString(str) {
  return str.substr(str.length - 2);
}

export function monthAndDay(date) {
  const updatedDate = moment(date, 'yyyy-MM-DD');
  const newDateFormat = updatedDate.format('MMM DD');
  return newDateFormat;
}
export function AgeCalculate(dob) {
  const millis = Date.now() - Date.parse(dob);
  const age = new Date(millis).getFullYear() - 1970;
  return age;
}
export function VideoDateFormatted(createdAt) {
  const CreatedVideoDate = moment(createdAt).format('MMM Do, YYYY on h:mm a');
  return CreatedVideoDate;
}
export function isTodayDate(someDate) {
  const inputDate = new Date(someDate);
  const todaysDate = new Date();
  // call setHours to take the time out of the comparison
  if (inputDate.setHours(0, 0, 0, 0) == todaysDate.setHours(0, 0, 0, 0)) {
    return true;
  }
  return false;
}
export function DurationFormat(duration) {
  const h = Math.floor(duration / 3600);
  const m = Math.floor((duration % 3600) / 60);
  const s = Math.floor((duration % 3600) % 60);
  const hDisplay = h > 0 ? h + (h === 1 ? 'hr, ' : 'hrs, ') : '';
  const mDisplay = m > 0 ? `${m} m, ` : '';
  const sDisplay = s > 0 ? `${s} s` : '';

  return hDisplay + mDisplay + sDisplay;
}

export function getMonthDifference(startingMonth, endingMonth) {
  const date1 = moment(startingMonth);
  const date2 = moment(endingMonth);

  // date1.startOf("month");
  // date2.startOf("month");

  const diff = date2.diff(date1, 'weeks');
  return Math.ceil(diff / 4);

  // date1.startOf("month");
  // date2.startOf("month");

  // const diff = date2.diff(date1, "months");
  // return diff;
}
