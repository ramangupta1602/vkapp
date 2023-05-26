import React from "react";
import { View } from "react-native";
import { styles } from "./style";
import VerticalAxis from "./VerticalAxis";
import DividerLines from "./DividerLines";
import { LinearGradient, Stop, Defs } from "react-native-svg";
import moment from "moment";
import { BarChart, Grid, XAxis } from "react-native-svg-charts";
import * as DateUtil from "Library/Utils/DateUtil";
import {
  RenderGaps,
  CycleDemarcationIndicator,
  ShowLegends,
} from "../../Components/Graphs/SummaryGraph";

const Gradient = () => (
  <Defs key={"gradient"}>
    <LinearGradient id={"gradient"} x1={"0%"} y={"0%"} x2={"0%"} y2={"100%"}>
      <Stop offset={"0%"} stopColor={"#86A8E7"} />
      <Stop offset={"46.43%"} stopColor={"#47AEE0"} />
      <Stop offset={"100%"} stopColor={"#91EAE4"} />
    </LinearGradient>
  </Defs>
);

const getMaximumOfData = (waterIntakeLevelData) => {
  let maximum = 0;

  waterIntakeLevelData.forEach((item) => {
    if (item > maximum) {
      maximum = item;
    }
  });

  return maximum;
};

function getXAxisData(fromDate, toDate, isWeekSelected) {
  const dateFormat = "DD MMM";
  const startDate = moment(fromDate, "YYYY-MM-DD");
  const endDate = moment(toDate, "YYYY-MM-DD");
  const dateDiff = DateUtil.differenceInDays(startDate, endDate) / 2;

  const startDateFormatted = startDate.format(dateFormat);
  const endDateFromatted = endDate.format(dateFormat);
  const midDateFormatted = startDate.add(dateDiff, "days").format(dateFormat);

  const dataWeek = ["M", "T", "W", "T", "F", "S", "S"];
  const monthdate = [startDateFormatted, midDateFormatted, endDateFromatted];

  let xAxisData = [];

  if (isWeekSelected) {
    xAxisData = dataWeek;
  } else {
    xAxisData = monthdate;
  }

  return xAxisData;
}

export default function GraphView({
  waterIntakeLevelData,
  isAllSummaryGraph,
  fromDate,
  toDate,
  isWeekSelected,
  isForDailyPerformance,
  waterIntakeUnit,
  yMax,
  graphHeight,
  graphWidth,
  cycleDemarcationHeight = 0,
  historyData,
}) {
  const maxOfData = getMaximumOfData(waterIntakeLevelData);
  let max = yMax;

  if (maxOfData > yMax) {
    max = maxOfData;
  }

  const xAxisData = getXAxisData(fromDate, toDate, isWeekSelected);

  return (
    <View>
      {/* Real graph */}
      <View
        style={[
          styles.graphContainer,
          { width: graphWidth, height: graphHeight + 5 },
        ]}>
        <View style={{ flex: 1 }}>
          <DividerLines
            isForDailyPerformance={isForDailyPerformance}
            height={graphHeight - 55 - cycleDemarcationHeight}
          />
          <BarChart
            style={{
              height: graphHeight - 60,
              width: graphWidth - 50,
              marginLeft: 16,
              marginTop: 0,
            }}
            data={waterIntakeLevelData}
            contentInset={{
              top: cycleDemarcationHeight,
              left: 20,
              right: 20,
            }}
            numberOfTicks={0}
            svg={{
              strokeWidth: 2,
              fill: "url(#gradient)",
            }}
            spacingInner={isWeekSelected ? 0.8 : 0.5}
            yMin={0}
            yMax={max}
            animate
            animationDuration={500}>
            <Grid />
            <Gradient />

            {isAllSummaryGraph && (
              <CycleDemarcationIndicator
                isBarGraph
                historyData={historyData}
                programStartDate={fromDate}
              />
            )}

            {isAllSummaryGraph && (
              <RenderGaps
                isBarGraph
                historyData={historyData}
                programStartDate={fromDate}
              />
            )}
          </BarChart>
          <XAxis
            style={{
              height: 40,
              width: graphWidth - 64,
              // backgroundColor: "rgba(0,0,0,0.1)",
              borderTopWidth: 1,
              borderTopColor: "#D9E2E8",
              marginRight: 16,
              // marginTop: -20,
              marginLeft: 16,
              paddingTop: 13.5,
            }}
            data={xAxisData}
            formatLabel={(value, index) => xAxisData[index]}
            contentInset={{ left: 25, right: 25 }}
            svg={{
              fill: "#A1AAB3",
              fontSize: 14,
              fontFamily: "Lato-Regular",
            }}
          />
        </View>

        <VerticalAxis
          targetWaterIntake={max * 1000}
          waterIntakeUnit={waterIntakeUnit}
          isForDailyPerformance={isForDailyPerformance}
          height={graphHeight - 65 - cycleDemarcationHeight}
        />
      </View>

      {isAllSummaryGraph && <ShowLegends historyData={historyData} />}
    </View>
  );
}
