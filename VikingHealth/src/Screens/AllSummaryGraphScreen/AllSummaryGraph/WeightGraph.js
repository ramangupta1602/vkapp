import React, { Component } from "react";
import { View } from "react-native";
import { Style } from "./styles";
import { SummaryGraph } from "Components";
import * as WeightLogQueries from "AppSyncQueries/WeightLogQueries";
import * as GraphUtil from "../../../utility/GraphUtil";
import { Query } from "react-apollo";
import { inject, observer } from "mobx-react";
import { WeightLog } from "Library/Models/WeightLogModel";

@inject("userAccountStore", "loginUserStore")
@observer
export default class WeightGraph extends Component {
  constructor(props) {
    super(props);

    const { programEndDate, startDate } = props.userAccountStore;
    this.cycleHistoryData = props.userAccountStore.cycleHistoryData;

    // pushing start sate for current cycle
    this.cycleHistoryData.push({ startDate, endDate: programEndDate });
  }

  processWeightLogHistory = data => {
    const weightUnit = this.props.loginUserStore.displayWeightUnit;
    let weightLogObjs = [];
    const filledWeights = {};

    if (data) {
      const weightLogs = data.weightLogs;

      if (weightLogs) {
        weightLogObjs = weightLogs.map(item => {
          const weightLog = new WeightLog(
            item.weight,
            item.date,
            item.weightUnit
          );
          return weightLog;
        });
        weightLogObjs.map(item => {
          filledWeights[item.date] = item.displayWeight(weightUnit);
        });
      }
    }

    return {
      filledWeights
    };
  };

  render() {
    const { width, height } = this.props;
    const {
      programStartDate,
      programEndDate,
      username: userId
    } = this.props.userAccountStore;

    return (
      <View style={Style.graphScreenContainerStyle}>
        <View>
          {/* Weight log history graph */}
          <Query
            query={WeightLogQueries.GetWeightLogs}
            variables={{
              userId,
              fromDate: programStartDate,
              toDate: programEndDate
            }}
            fetchPolicy="cache-and-network"
          >
            {({ data }) => {
              const { filledWeights } = this.processWeightLogHistory(data);

              const xAxisData = GraphUtil.getXAxisData(
                programStartDate,
                programEndDate,
                false
              );

              return (
                <View>
                  <SummaryGraph
                    filledItems={filledWeights}
                    startDate={programStartDate}
                    isAllSummaryGraph
                    endDate={programEndDate}
                    dataRange={"all"}
                    graphWidth={width}
                    graphHeight={height - 70}
                    programEndDate={programEndDate}
                    unit={this.props.loginUserStore.weightUnitText}
                    xAxisData={xAxisData}
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
