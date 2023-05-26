import React, { Component } from "react";
import { View } from "react-native";
import { Style } from "./styles";
import * as WaterIntakeLogQueries from "AppSyncQueries/WaterIntakeLogQueries";
import * as DateUtil from "Library/Utils/DateUtil";
import { Query } from "react-apollo";
import moment from "moment";
import { inject, observer } from "mobx-react";
import { WeightLog } from "Library/Models/WeightLogModel";
import GraphView from "../../WaterIntakeDetails/GraphView";
import { DayPerformanceModel } from "Library/Models/DayPerformanceModel";
import { WaterIntakeLog } from "Library/Models/WaterIntakeLogModel";

@inject("userAccountStore", "loginUserStore")
@observer
export default class WaterIntakeGraph extends Component {
  constructor(props) {
    super(props);

    const todayDate = DateUtil.formattedTodayDate();
    const { startDate } = props.userAccountStore;
    this.cycleHistoryData = props.userAccountStore.cycleHistoryData;

    // pushing start sate for current cycle
    this.cycleHistoryData.push({ startDate, endDate: todayDate });
  }

  processWaterIntakeLogHistory = data => {
    let waterIntakeLogObjs = [];

    if (data) {
      const waterIntakeLogs = data.waterIntakeLogs;
      if (waterIntakeLogs) {
        waterIntakeLogObjs = waterIntakeLogs.map(item => {
          const waterIntakeLog = new WaterIntakeLog(
            item.waterIntake,
            item.date,
            item.waterIntakeUnit
          );
          return waterIntakeLog;
        });
      }
    }

    return {
      waterIntakeLogObjs
    };
  };

  getIntakeForDate = (date, waterIntakeData) => {
    for (const data of waterIntakeData) {
      if (data.date === date) {
        return data.waterIntake / 1000;
      }
    }

    return 0;
  };

  processWaterIntakeLogsForGraph = waterIntakeData => {
    const { programStartDate: fromDate } = this.props.userAccountStore;
    const difference = DateUtil.absoluteDifferenceFromToday(fromDate);

    const differenceBetweenDates = difference + 1;
    const dateArray = [];
    const intakeArray = [];

    for (let i = 0; i < differenceBetweenDates; ++i) {
      const d = moment(fromDate);
      d.add(i, "days");
      const dateString = d.format("YYYY-MM-DD");
      dateArray.push(dateString);
    }

    for (const date of dateArray) {
      const intakeLevel = this.getIntakeForDate(date, waterIntakeData);
      intakeArray.push(intakeLevel);
    }

    return intakeArray;
  };

  render() {
    const { width, height } = this.props;
    const targetWaterIntake = this.props.loginUserStore.getTargetWaterIntake;
    const { programStartDate, username: userId } = this.props.userAccountStore;

    const todayDate = DateUtil.formattedTodayDate();

    return (
      <View style={Style.graphScreenContainerStyle}>
        <View>
          <Query
            query={WaterIntakeLogQueries.GetWaterIntakeLogs}
            variables={{
              userId,
              fromDate: programStartDate,
              toDate: todayDate
            }}
            fetchPolicy="cache-and-network"
          >
            {({ data }) => {
              const { waterIntakeLogObjs } = this.processWaterIntakeLogHistory(
                data
              );

              const waterIntakeLevelData = this.processWaterIntakeLogsForGraph(
                waterIntakeLogObjs
              );

              return (
                <View>
                  <GraphView
                    cycleDemarcationHeight={40}
                    graphWidth={width - 32}
                    graphHeight={height - 55}
                    waterIntakeLevelData={waterIntakeLevelData}
                    waterIntakeUnit={""}
                    waterIntakeLogObjs={[]}
                    programStartDate={programStartDate}
                    programEndDate={todayDate}
                    fromDate={programStartDate}
                    toDate={todayDate}
                    targetWaterIntake={targetWaterIntake}
                    yMax={targetWaterIntake / 1000}
                    isWeekSelected={false}
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
