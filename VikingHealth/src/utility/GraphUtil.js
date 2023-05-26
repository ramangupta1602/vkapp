import moment from "moment";
import * as DateUtil from "../Library/Utils/DateUtil";

export function getXAxisData(fromDate, toDate, isWeekSelected) {
  const dataWeek = ["M", "T", "W", "T", "F", "S", "S"];
  const monthdate = getAxisDataForFullCourse(fromDate, toDate);

  let xAxisData = [];

  if (isWeekSelected) {
    xAxisData = dataWeek;
  } else {
    xAxisData = monthdate;
  }

  return xAxisData;
}

export function getXAxisWeekLevelData() {
  // In the code we are showing hard coded 4 weeks, therefore I am also returning
  // 4 week label for now..
  return ["Week 1", "Week 2", "Week 3", "Week 4"];
}

export function getAxisDataForFullCourse(fromDate, toDate) {
  const dateFormat = "DD MMM";
  const startDate = moment(fromDate, "YYYY-MM-DD");
  const endDate = moment(toDate, "YYYY-MM-DD");
  const dateDiff = DateUtil.differenceInDays(startDate, endDate) / 2;

  const startDateFormatted = startDate.format(dateFormat);
  const endDateFromatted = endDate.format(dateFormat);
  const midDateFormatted = startDate.add(dateDiff, "days").format(dateFormat);

  return [startDateFormatted, midDateFormatted, endDateFromatted];
}
