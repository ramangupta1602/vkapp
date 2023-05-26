import React, { Component } from "react";
import { View, Text, ScrollView } from "react-native";
import moment from "moment";
import { AreaChart, Grid } from "react-native-svg-charts";
import * as shape from "d3-shape";
import {
  ClipPath,
  Defs,
  LinearGradient,
  Rect,
  Stop,
  Line,
  G,
  Circle,
  Text as SvgText,
} from "react-native-svg";
import { styles } from "../style";
import { GraphBackground } from "./GraphBackground";
import * as ColorPallate from "./CycleIndicatorColorPallate";

// Days ENUMS
const DAYS = {
  monday: 0,
  tuesday: 1,
  wednesday: 2,
  thursday: 3,
  friday: 4,
  saturday: 5,
  sunday: 6,
};

const Gradient = () => (
  <Defs key={"defs"}>
    <LinearGradient id={"gradient"} x1={"0%"} y={"0%"} x2={"0%"} y2={"80%"}>
      <Stop offset={"0%"} stopColor={"#B5CEFC"} />
      <Stop offset={"30.43%"} stopColor={"#B5CEFB"} stopOpacity={0.5} />
      <Stop offset={"100%"} stopColor={"#F3F8FB"} stopOpacity={1} />
    </LinearGradient>
  </Defs>
);

function getMaxAndMinForFinalData(finalData) {
  let sortedList = finalData.concat([]);

  sortedList = sortedList.sort((a, b) => {
    return a.y - b.y;
  });

  let min = sortedList[0].y;
  let max = sortedList[sortedList.length - 1].y;

  min -= 5;
  max += 5;

  if (min < 0) {
    min = 0;
  }

  return {
    min,
    max,
  };
}

const Tooltip = function ({ x, y, data, yUnit, xAxisOffset, showStartPoint }) {
  if (xAxisOffset === 0 && !showStartPoint) {
    return null;
  }

  let actualXOffset = xAxisOffset - 0.5;

  // if data has all the 7 entryies t
  if (xAxisOffset === 7) {
    actualXOffset = xAxisOffset - 1;
  }

  if (showStartPoint) {
    actualXOffset = xAxisOffset - 1;
  }

  // sometimes, xAxisOffset gives value where data is undefined. Usually happens with wrong data.
  if (!data[xAxisOffset - 1]) {
    return null;
  }

  return (
    <View
      style={{
        zIndex: 100,
        position: "absolute",
        width: 58,
        height: 27,
        top: y(data[xAxisOffset - 1].y) - 55,
        left: x(actualXOffset) - 35,
      }}
    >
      <TalkBubble data={data[xAxisOffset - 1].y} yUnit={yUnit} />

      <View
        style={{
          position: "absolute",
          width: 15,
          height: 15,
          top: 45,
          left: 25,
          borderRadius: 7.5,
          backgroundColor: "white",
          shadowColor: "#387BF4",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 1,
          shadowRadius: 5,
          elevation: 10,
        }}
      />

      <View
        style={{
          position: "absolute",
          width: 10,
          height: 10,
          top: 47.5,
          left: 27.5,
          borderRadius: 5,
          backgroundColor: "#387BF4",
          elevation: 15,
        }}
      />
    </View>
  );
};

/**
 * this tooltip is used for 'Week' graphs where
 * we need to show only those tooltips at which user specified weight.
 * Also, talkbubble is only shown when user wants to really see the tooltip data.
 * That's why it is different from the original method of showing tooltip & talkbubble -
 * i.e. Tooltip component
 */
const TooltipWithOptionalTalkBubble = function ({
  x,
  y,
  data,
  yUnit,
  xAxisOffset,
  setShowHideTalkBubble,
  isShowingBubble,
}) {
  let actualXOffset = xAxisOffset;

  // for Monday/Sunday tooltip, it gets distroted from left little/right bit. That's why shifting tooltip to right/left.
  if (xAxisOffset === DAYS.monday) {
    actualXOffset = xAxisOffset + 0.2;
  } else if (xAxisOffset === DAYS.sunday) {
    actualXOffset = xAxisOffset - 0.2;
  }

  // handle show/hide talkbubble that shows weight.
  const handleShowTalkBubble = () => {
    setShowHideTalkBubble(isShowingBubble ? null : xAxisOffset); // sending tooltip offset to its parent
  };

  return (
    <>
      <Circle
        cx={x(actualXOffset)}
        cy={y(data[xAxisOffset].y)}
        r={27}
        fill={"transparent"}
        onPress={handleShowTalkBubble}
      />
      <Circle
        cx={x(actualXOffset)}
        cy={y(data[xAxisOffset].y)}
        r={4}
        fill={"#387BF4"}
        onPress={handleShowTalkBubble}
      />
      <View
        style={{
          zIndex: 100,
          position: "absolute",
          width: 58,
          height: 27,
          top: y(data[xAxisOffset].y) - 50,
          left: x(actualXOffset) - 35,
        }}
      >
        {isShowingBubble && (
          <TalkBubble data={data[xAxisOffset].y} yUnit={yUnit} />
        )}
      </View>
    </>
  );
};

const TalkBubble = ({ data, yUnit }) => (
  <View style={styles.talkBubble}>
    <View
      style={[
        styles.talkBubbleSquare,
        {
          backgroundColor: "white",
          justifyContent: "center",
        },
      ]}
    >
      <Text
        style={{
          width: "100%",
          color: "#024481",
          fontSize: 12,
          fontFamily: "Lato",
          fontWeight: "600",
          textAlign: "center",
        }}
      >
        {data.toFixed(1)} {yUnit}
      </Text>
    </View>
    <View style={styles.talkBubbleTriangle} />
  </View>
);

// this function will return starting and ending data related stuff.
function getDays(startDate, endDate, programEndDate, dataRange) {
  const hidePoints = dataRange === "all";
  const startDateM = moment(startDate);
  let endDateM = moment(endDate);
  const programEndM = moment(programEndDate);

  if (hidePoints) {
    endDateM = programEndM;
  }

  const dateRange = moment().range(startDateM, endDateM);

  return dateRange;
}

function getDataToPlotInRange(filledItems, dateRange, isWeekRange) {
  const finalData = [];
  let month = "";

  for (const date of dateRange.by("days")) {
    const formattedDate = date.format("YYYY-MM-DD");
    const value = parseFloat(filledItems[formattedDate]);
    let xLabel = "";

    if (isWeekRange) {
      xLabel = date.format("ddd")[0];
    } else {
      gap = 10;
      const currentMonth = date.format("MMM");
      if (currentMonth === month) {
        xLabel = "";
      } else {
        xLabel = currentMonth;
        month = currentMonth;
      }
    }
    finalData.push({ x: xLabel, y: value, date: formattedDate });
  }

  /**
   * Below finalData's value has not been copied in other variable
   * and that's why originally this value is changing later in the code. Shallow copied.
   * That's why need to return another variable in string so as to preserve this
   * original data.
   */
  return { finalData, finalDataInString: JSON.stringify(finalData) };
}

const processDataFroMissingPoint = (data) => {
  // Inserting missing data in the array so that it can be plotted into area garph.
  // I am doing this in 3 steps.
  /*  
    1. Inserting data in the beginning of the array with the first valid encounted value. (Fill till we
       encounter first value).
    2. Removing invalid entry in the array from the end of the data. (Show data only till last)
    3. Filling up the missing value with slope value (average) of the adjacent two values     
  */
  const startPoint = fillDataInTheBeginningForArray(data);
  const endPoint = removeDataFromTheEndOfArray(data);
  fillMissingValueInTheArray(data);
  return {
    startPoint,
    endPoint,
  };
};

const fillDataInTheBeginningForArray = (data) => {
  let isValueEncounted = false;
  let firstValueEncounted = 0;
  let noOfInvalidElement = 0;

  for (const d of data) {
    if (d.y) {
      isValueEncounted = true;
      firstValueEncounted = d.y;
      break;
    }

    noOfInvalidElement += 1;
  }

  // fill all the invalid element with firstValueEncounted only if it it encounted.
  // If it is not encountered (when there is no data) , just leave it. we will handle it in
  // next step
  if (!isValueEncounted) {
    return data.length;
  }

  for (let i = 0; i < noOfInvalidElement; ++i) {
    data[i].y = firstValueEncounted;
  }

  return noOfInvalidElement;
};

const removeDataFromTheEndOfArray = (data) => {
  let noOfInvalidElement = 0;
  let lastValue = 0;

  for (let i = data.length - 1; i >= 0; --i) {
    if (data[i].y) {
      lastValue = data[i].y;
      break;
    }
    ++noOfInvalidElement;
  }

  for (let i = data.length - 1; i >= 0; --i) {
    if (data[i].y) {
      break;
    }
    data[i].y = lastValue;
  }

  return noOfInvalidElement;
};

const fillMissingValueInTheArray = (data) => {
  // first locate the missing value
  // then count the no of missing element till the first value is encounted.
  // Due to first step ,  previous value is always valid.
  // value of the element is (nextValue - previousValue)/(no of invalid element between + 1);

  for (let i = 0; i < data.length; ++i) {
    if (!data[i].y && data[i].y !== 0) {
      const previousValue = data[i - 1].y;
      const { noOfMissingValue, validValue } = findNextValidElement(data, i);

      fillInMissingValuesForRange(
        data,
        i,
        noOfMissingValue,
        previousValue,
        validValue
      );
    }
  }
};

function findNextValidElement(data, index) {
  let noOfMissingValue = 1;
  let validValue = 0;

  for (let j = index + 1; j < data.length; ++j) {
    if (data[j].y) {
      validValue = data[j].y;
      break;
    }

    ++noOfMissingValue;
  }

  return {
    noOfMissingValue,
    validValue,
  };
}

const fillInMissingValuesForRange = (
  data,
  currentIndex,
  noOfMissingValue,
  previousValue,
  validValue
) => {
  const difference = validValue - previousValue;
  let currentMissingIndex = 1;

  for (let i = currentIndex; i < currentIndex + noOfMissingValue; ++i) {
    const value = (difference / (noOfMissingValue + 1)) * currentMissingIndex;
    data[i].y = parseFloat((previousValue + value).toFixed(2));
    currentMissingIndex += 1;
  }
};

/**
 * from all the previous operation we have array of data having all days (missing / non missing).
 * Now I am calculating cycle demarcation using merely date difference for example
 *
 * startData : 2020-01-01 programEndDate: 2020-04-01
 * Cycle 1 ==> startDate : 2020-01-01 || endDate : 2020-02-01
 * Cycle 2 ==> startDate : 2020-02-02 || endDate : 2020-03-01
 * Current cycle ==> startDate : 2020-03-01 || endDate: 2020 -04-01
 *
 *
 * So demarcation will be at :
 * Cycle 2 start : 2020-02-02 - 2020-01-01 => 31 days
 * Cycle 3 start : 2020-03-01 - 2020-01-01 => 60 days and so on.
 *
 */
getIndexForCycleDemarcation = (historyData, programStartDate) => {
  const cycleStartIndexes = [];
  const startDate = moment(programStartDate);
  startDate.startOf("d");

  const len = historyData.length;

  historyData.forEach((history, index) => {
    /*
    Commented this because as of VH-861, we need to show cycle banner for all cycles no matter what.
    if (index === len - 1) {
      // skipping last cycle (current cycle)\
      return;
    }
    */

    const cycleStartDate = moment(history.endDate).startOf("d");

    const dateDiff = cycleStartDate.diff(startDate, "d");

    cycleStartIndexes.push(dateDiff);
  });

  return cycleStartIndexes;
};

export const CycleDemarcationIndicator = ({
  x,
  historyData,
  height,
  programStartDate,
}) => {
  const startIndexes = this.getIndexForCycleDemarcation(
    historyData,
    programStartDate
  );
  return startIndexes.map((startIndex, index) => {
    const colors = ColorPallate.getColorForIndex(index);

    const startingPoint = x(startIndex);

    // in some testing cases (startdate  = todaydate) starting point is NaN,
    // so to remove it, this check..
    if (!startingPoint) {
      return;
    }

    return (
      <G
        style={{
          position: "absolute",
          left: x(startIndex),
          height: height - 50,
          width: 60,
          zIndex: 110,
        }}
      >
        <G>
          <Circle cx={x(startIndex) - 59} cy={10} r={12} fill={"#F3F8FB"} />

          <Rect
            x={x(startIndex) - 59}
            height={20}
            width={59}
            fill={colors.backgroundColor}
          />

          <Circle
            cx={x(startIndex) - 59}
            cy={10}
            r={10}
            fill={colors.backgroundColor}
          />
          <SvgText
            x={x(startIndex) - 50}
            y={14.5}
            fill={colors.textColor}
            fontSize="12"
            fontFamily="Lato-Regular"
          >
            {`Cycle ${index + 1}`}
          </SvgText>
        </G>

        <Line
          x1={x(startIndex - 0.15)}
          y1="0%"
          x2={x(startIndex - 0.15)}
          y2="100%"
          key={"zero-axis"}
          stroke={colors.backgroundColor}
          strokeDasharray={[8, 6]}
          strokeWidth={1}
        />
      </G>
    );
  });
};

parseHistoryForGaps = (historyData, programStartDate) => {
  if (historyData.length === 0) {
    return [];
  }

  const gapArray = [];

  let lastHistoryRecord = historyData[0];
  const len = historyData.length;
  const programStart = moment(programStartDate);

  for (let i = 1; i < len; ++i) {
    const currentRecord = historyData[i];

    const lastRecordEndDate = moment(lastHistoryRecord.endDate);
    const currentRecordStartDate = moment(currentRecord.startDate);

    const dayDiff = currentRecordStartDate.diff(lastRecordEndDate, "d");
    lastHistoryRecord = currentRecord;

    // ignoring if day diff is more than 5
    if (dayDiff > 5) {
      const startDayIndex = currentRecordStartDate.diff(programStart, "d");
      const endDayIndex = lastRecordEndDate.diff(programStart, "d");

      gapArray.push({ startIndex: endDayIndex, endIndex: startDayIndex });
    }
  }

  return gapArray;
};

export const RenderGaps = ({ historyData, programStartDate, x, y }) => {
  const gapsIndex = this.parseHistoryForGaps(historyData, programStartDate);

  return gapsIndex.map((indexes) => {
    const { startIndex, endIndex } = indexes;
    const startPosition = x(startIndex) + 3;
    // const width = x(endIndex - startIndex); unused components. that's why commented.

    // in some testing cases (startdate  = todaydate) starting point is NaN,
    // so to remove it, this check..
    if (!startPosition) {
      return;
    }

    return (
      <Rect
        x={x(startIndex) + 3}
        width={x(endIndex - startIndex)}
        height="100%"
        zIndex={50}
        fill={ColorPallate.gapPeriodColor}
      />
    );
  });
};

const SinglePallateBox = ({ index }) => {
  let color = ColorPallate.getColorForIndex(index);
  let text = `Reload Cycle ${index + 1}`;

  if (index === -1) {
    color = { backgroundColor: ColorPallate.gapPeriodColor };
    text = "Break Period";
  }

  return (
    <View style={styles.singlePallateContainerStyle}>
      <View
        style={[
          styles.pallateBoxStyle,
          { backgroundColor: color.backgroundColor },
        ]}
      />
      <Text style={styles.pallateIndicatorTextStyle}>{text}</Text>
    </View>
  );
};

export const ShowLegends = ({ historyData }) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {historyData.map((item, index) => {
        /*
        * Commented this because as of VH-861, we need to show cycle banner for all cycles no matter what.
            if (index === historyData.length - 1) {
              return <View />;
            }
        */

        return <SinglePallateBox index={index} />;
      })}
      <SinglePallateBox index={-1} />
    </ScrollView>
  );
};

/**
 * to get tool tip for each cycle start & end date.
 * Info: finalData is an array of object -
 * that contains weight of each day from programStartDate to programEndDate.
 * We find cycle start/end date from historyData.
 * With the help of finalData and cycle start/end date we calculate weight of these particular dates(cycle start/end).
 * We call ToolTip component and pass xAxisOffset that is basically the index of finalData array.
 * finalData[xAxisOffset] simply contains the data of that particular day.
 */
const getCycleStartEndDateXAxisOffset = (
  historyData,
  programStartDate,
  unit,
  xAxisOffsetForCurrentCycle // this is the xAxisOffset for rendering tooltip for the cycle that is not completed.
) => {
  const xAxisOffsets = []; // stores the indexes for the tooltip data.
  for (i in historyData) {
    let item = historyData[i];
    const presentDate = moment().format("YYYY-MM-DD");
    const formattedProgramStartData = moment(programStartDate).startOf("d");
    // for cycle start date
    const formattedCycleStartDate = moment(item.startDate).startOf("d");
    const dateDiffForCycleStart = formattedCycleStartDate.diff(
      formattedProgramStartData,
      "d"
    );
    xAxisOffsets.push(dateDiffForCycleStart);

    /**
     * If current cycle end date is less then the present date - that means the cycle is already ended -
     * then render the tooltip according to the data of cycle's end date.
     * Otherwise, if the current cycle is already running and is not yet completed -
     * then render the tootip according to the last weight added.
     * This condition of rendering the tooltip of last added weight was from before long time.
     */
    if (moment(item.endDate).format("YYYY-MM-DD") < presentDate) {
      // for cycle end date
      const formattedCycleEndDate = moment(item.endDate).startOf("d");
      const dateDiffForCycleEnd = formattedCycleEndDate.diff(
        formattedProgramStartData,
        "d"
      );
      xAxisOffsets.push(dateDiffForCycleEnd);
    } else {
      xAxisOffsets.push(xAxisOffsetForCurrentCycle - 1); // subtracting by 1 becuase below we are adding it by one.
    }
  }
  // renders the tooltip for all cycle start/end date except currentcycle end date.
  return xAxisOffsets.map((item) => {
    // sending index by adding 1 because in the ToolTip component, we are reducing to 1.
    // Logic of reducing by 1 was already done before.
    return <Tooltip yUnit={unit} xAxisOffset={item + 1} />;
  });
};

export class SummaryGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      /**
       * it helps to keep track of -
       * the item at which user wants to see TalkBubble for Week graphs
       */
      weekGraphTalkBubbleXOffset: null,
    };
  }

  // renders the tooltips & talkbubble for week graphs at which user specified weight
  getUserAddedWeightOnlyTooltip = (finalData, unit) => {
    const xAxisOffsets = []; // stores the indexes for the tooltip data.

    /**
     * callback function. Helps to know for which tooltip user wants to see talkbubble -
     * so that the other talkbubble can be hidden
     */
    const handleShowHideTextBubble = (itemToBeShown) => {
      this.setState({ weekGraphTalkBubbleXOffset: itemToBeShown });
    };

    // knowing what are the offsets at which user entered weight specifics
    for (let i = 0; i < finalData.length; i++) {
      if (finalData[i].y) {
        // user entered weight
        xAxisOffsets.push(i);
      }
    }

    // rendering tootips & talkbubble for which user specified weights
    return xAxisOffsets.map((item, index) => {
      return (
        <TooltipWithOptionalTalkBubble
          yUnit={unit}
          xAxisOffset={item}
          key={item}
          setShowHideTalkBubble={handleShowHideTextBubble} // callback to know which tooltip user pressed
          isShowingBubble={this.state.weekGraphTalkBubbleXOffset === item} // show/hide talkbubble
        />
      );
    });
  };
  render() {
    const {
      filledItems,
      startDate,
      endDate,
      dataRange,
      programEndDate,
      unit,
      xAxisData,
      historyData,
      showStartPoint,
      isAllSummaryGraph,
      showUserAddedWeightOnly,
    } = this.props;

    const hidePoints = dataRange === "all";
    const isWeekRange = !hidePoints;
    const dateRange = getDays(startDate, endDate, programEndDate, hidePoints);
    const { finalData, finalDataInString } = getDataToPlotInRange(
      filledItems,
      dateRange,
      isWeekRange
    );
    const userAddedOnlyFinalData = JSON.parse(finalDataInString);

    // Start point -> No of entries from begning when data is not entered.
    // End Point -> No of enteries from end where data is not found.
    const { startPoint, endPoint } = processDataFroMissingPoint(finalData);
    const { min, max } = getMaxAndMinForFinalData(finalData);
    const xAxisOffset = finalData.length - endPoint;
    // const shouldShowStartPoint =
    //   startPoint !== finalData.length && showStartPoint;
    const showUserAddedTooltipOnly = isWeekRange && showUserAddedWeightOnly;

    //defining it outside cause some error.
    const Clips = ({ x }) => (
      <Defs key={"clips"}>
        <ClipPath id={"clip-path-1"} key={"0"}>
          <Rect
            x={x(startPoint - 0.5)}
            y={"0"}
            width={x(finalData.length - endPoint - startPoint)}
            height={"100%"}
          />
        </ClipPath>
      </Defs>
    );

    return (
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "#F3F8FB",
          borderRadius: 10,
        }}
      >
        {/* remove flex from here */}
        <View style={{ flex: 1 }}>
          <GraphBackground
            width={"100%"}
            height={this.props.graphHeight ?? 170}
            padding={10}
            paddingTop={20}
            backgroundColor={"white"}
            xAxisHeight={20}
            yAxisWidth={40}
            xAxisData={xAxisData}
            yMin={min}
            yMax={max}
            yUnit={unit}
            yAxisUnitPrecision={0}
            average={0}
            yAxisFontSize={10}
          >
            <AreaChart
              style={{ flex: 1 }}
              data={finalData}
              yAccessor={({ item }) => item.y}
              contentInset={{ top: 0 }}
              curve={shape.curveNatural}
              yMax={max}
              yMin={min}
              animate
              numberOfTicks={0}
              svg={{
                fill: "url(#gradient)",
                clipPath: "url(#clip-path-1)",
              }}
            >
              <Grid />
              <Clips />
              <Gradient />

              {/*
               * If the graph is not for 'ALL', then render below component.
               * Otherwise, if the graph is for 'ALL',
               * then render tootip from below function getCycleStartEndDateTooltip
               */}
              {!showUserAddedTooltipOnly && (
                <Tooltip yUnit={unit} xAxisOffset={xAxisOffset} />
              )}

              {/**
               * If I add below <Tooltip> component in the above condition (as both condition are same) -
               * it throws a wierd error.
               * That's why writing it seperately below - to render cycle start date weight tooltip.
               */}
              {!showUserAddedTooltipOnly && (
                <Tooltip
                  yUnit={unit}
                  xAxisOffset={startPoint + 1}
                  showStartPoint={true}
                />
              )}

              {/** render tooltips for cycle start/end date for 'ALL' graph */}
              {isAllSummaryGraph &&
                getCycleStartEndDateXAxisOffset(
                  historyData,
                  startDate,
                  unit,
                  xAxisOffset
                )}

              {/** renders optional talkbubble tooltip for 'WEEK' graph if props.showUserAddedWeightOnly is true */}
              {showUserAddedTooltipOnly &&
                this.getUserAddedWeightOnlyTooltip(
                  userAddedOnlyFinalData,
                  unit
                )}

              {isAllSummaryGraph && (
                <RenderGaps
                  historyData={historyData}
                  programStartDate={startDate}
                />
              )}

              {isAllSummaryGraph && (
                <CycleDemarcationIndicator
                  historyData={historyData}
                  programStartDate={startDate}
                />
              )}
            </AreaChart>
          </GraphBackground>

          {isAllSummaryGraph && <ShowLegends historyData={historyData} />}
        </View>
      </View>
    );
  }
}
