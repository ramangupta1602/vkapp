import React, { Component } from "react";
import { View, Alert, Button } from "react-native";
import { Style } from "./styles";
import { SummaryGraph } from "Components";
import { HeightWeightUtil } from "Library/Utils/HeightWeightUtil";
import * as GraphUtil from "../../../utility/GraphUtil";
import { Query } from "react-apollo";
import { inject, observer } from "mobx-react";
import { WeightLog } from "Library/Models/WeightLogModel";
import MeasurementTabs from "./../../BodyMeasurementsDetails/MeasurementTabs";
import * as BodyMeasurementQueries from "AppSyncQueries/BodyMeasurementQueries";
import { BodyMeasurementModel } from "Library/Models/BodyMeasurementModel";

@inject("userAccountStore", "loginUserStore")
@observer
export default class BodyMeasurementGraph extends Component {
  constructor(props) {
    super(props);

    const { programEndDate, startDate } = this.props.userAccountStore;
    this.cycleHistoryData = this.props.userAccountStore.cycleHistoryData;

    // pushing start sate for current cycle
    this.cycleHistoryData.push({ startDate, endDate: programEndDate });

    this.state = {
      selectedIndex: 0
    };
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
      weightLogObjs,
      filledWeights
    };
  };

  _measurementClicked = indexValue => {
    this.setState({ selectedIndex: indexValue });
  };

  render() {
    const { width, height } = this.props;
    const {
      programStartDate,
      programEndDate,
      username: userId,
      cycleHistoryData,
      startDate
    } = this.props.userAccountStore;

    // pushing start sate for current cycle
    cycleHistoryData.push({ startDate, endDate: programEndDate });

    return (
      <View style={Style.graphScreenContainerStyle}>
        <View style={{ marginTop: 10 }}>
          <MeasurementTabs
            measurementClicked={this._measurementClicked}
            selectedIndex={this.state.selectedIndex}
          />

          {/* Weight log history graph */}
          <Query
            query={BodyMeasurementQueries.GetBodyMeasurementData}
            variables={{
              userId,
              fromDate: programStartDate,
              toDate: programEndDate
            }}
            fetchPolicy="cache-and-network"
          >
            {({ data }) => {
              let bodyMeasurementLogObjs = [];
              const filledValues = [];
              const unit = this.heightUnit;

              if (data) {
                let bodyMeasurementLogs = data.bodyMeasurements;

                if (bodyMeasurementLogs) {
                  bodyMeasurementLogObjs = bodyMeasurementLogs.map(item => {
                    let bodyMeasurement = new BodyMeasurementModel(item);
                    return bodyMeasurement;
                  });

                  bodyMeasurementLogObjs.map(item => {
                    const value = item.displayValueForIndex(
                      this.state.selectedIndex,
                      unit
                    );
                    filledValues[item.date] = value;
                    return null;
                  });
                }
              }

              let xAxisData = [];
              const displayUnit = HeightWeightUtil.heightUnit(unit);

              if (this.state.isMonthSelected) {
                xAxisData = GraphUtil.getXAxisWeekLevelData();
              } else {
                xAxisData = GraphUtil.getAxisDataForFullCourse(
                  programStartDate,
                  programEndDate
                );
              }

              return (
                <View>
                  <SummaryGraph
                    filledItems={filledValues}
                    startDate={programStartDate}
                    isAllSummaryGraph
                    endDate={programEndDate}
                    dataRange={"all"}
                    graphWidth={width}
                    graphHeight={height - 100}
                    programEndDate={programEndDate}
                    unit={this.props.loginUserStore.heightUnitText}
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
