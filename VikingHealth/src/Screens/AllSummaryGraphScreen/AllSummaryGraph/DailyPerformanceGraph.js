import React, { Component } from "react";
import { View } from "react-native";
import { Style } from "./styles";
import * as DayPerformanceQueries from "AppSyncQueries/DayPerformanceQueries";
import * as DateUtil from "Library/Utils/DateUtil";
import { Query } from "react-apollo";
import moment from "moment";
import { inject, observer } from "mobx-react";
import { WeightLog } from "Library/Models/WeightLogModel";
import GraphView from "../../WaterIntakeDetails/GraphView";
import { DayPerformanceModel } from "Library/Models/DayPerformanceModel";

@inject("userAccountStore", "loginUserStore")
@observer
export default class DailyPerformanceGraph extends Component {
  constructor(props) {
    super(props);

    const todayDate = DateUtil.formattedTodayDate();
    const { startDate } = props.userAccountStore;
    this.cycleHistoryData = props.userAccountStore.cycleHistoryData;

    // pushing start sate for current cycle
    this.cycleHistoryData.push({ startDate, endDate: todayDate });
  }

  processPerformanceLogHistory = (data) => {
    let performanceLogObjs = [];
    if (data) {
      const performanceLogs = data.daysPerformance;

      if (performanceLogs) {
        performanceLogObjs = performanceLogs.map((item) => {
          const performanceLog = new DayPerformanceModel(
            item.rating,
            item.date
          );
          return performanceLog;
        });
      }
    }
    return {
      performanceLogObjs,
    };
  };

  processPerformanceDataForGraph = (data) => {
    const { programStartDate: fromDate } = this.props.userAccountStore;

    const difference = DateUtil.absoluteDifferenceFromToday(fromDate);
    const differenceBetweenDates = difference + 1;
    const dateArray = [];
    const performanceArray = [];

    for (let i = 0; i < differenceBetweenDates; ++i) {
      const d = moment(fromDate);
      d.add(i, "days");
      const dateString = d.format("YYYY-MM-DD");
      dateArray.push(dateString);
    }

    for (const date of dateArray) {
      const intakeLevel = this.getDailyPerformanceForDate(date, data);
      performanceArray.push(intakeLevel);
    }

    if (performanceArray.length > 0) {
      return performanceArray;
    }
    return [0];
  };

  getDailyPerformanceForDate = (date, dailyPerformanceData) => {
    for (var data of dailyPerformanceData) {
      if (data.date === date) {
        return data.rating;
      }
    }

    return 0;
  };

  render() {
    const { width, height } = this.props;
    const { programStartDate, username: userId } = this.props.userAccountStore;

    const todayDate = DateUtil.formattedTodayDate();

    return (
      <View style={Style.graphScreenContainerStyle}>
        <View>
          <Query
            query={DayPerformanceQueries.GetDaysPerformanceData}
            variables={{
              userId,
              fromDate: programStartDate,
              toDate: todayDate,
            }}
            fetchPolicy="cache-and-network">
            {({ data }) => {
              const { performanceLogObjs } = this.processPerformanceLogHistory(
                data
              );
              const dailyPerformanceArray = this.processPerformanceDataForGraph(
                performanceLogObjs
              );

              return (
                <View>
                  <GraphView
                    cycleDemarcationHeight={40}
                    graphWidth={width - 32}
                    graphHeight={height - 50}
                    waterIntakeLevelData={dailyPerformanceArray}
                    waterIntakeUnit={""}
                    waterIntakeLogObjs={[]}
                    programStartDate={programStartDate}
                    programEndDate={todayDate}
                    fromDate={programStartDate}
                    toDate={todayDate}
                    isForDailyPerformance
                    targetWaterIntake={5}
                    isWeekSelected={false}
                    yMax={5}
                    isAllSummaryGraph
                    historyData={this.cycleHistoryData}
                  />
                </View>
              );
            }}
          </Query>
        </View>
      </View>
    );
  }
}
