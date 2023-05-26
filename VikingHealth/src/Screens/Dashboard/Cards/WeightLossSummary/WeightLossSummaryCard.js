import React, { Component } from "react";
import { View } from "react-native";
import { Query } from "react-apollo";
import * as WeightLogQueries from "AppSyncQueries/WeightLogQueries";
import { inject, observer } from "mobx-react";
import { HeightWeightUtil } from "../../../../Library/Utils/HeightWeightUtil";
import { WeightLossSummaryCardContainer } from "./WeightLossSummaryCardContainer";
import AppUtil from "Library/Utils/AppUtil";

@inject("userAccountStore", "loginUserStore")
@observer
export class WeightLossSummaryCard extends Component {
  render() {
    const userId = this.props.userAccountStore.username;
    const weightUnit = this.props.loginUserStore.displayWeightUnit;
    const weightUnitText = HeightWeightUtil.weightUnit(weightUnit);
    const { programStartDate } = this.props.userAccountStore;

    return (
      <Query
        query={WeightLogQueries.GetWeightLogs}
        variables={{
          userId,
          fromDate: programStartDate,
          toDate: AppUtil.getCurrentDate(),
        }}
        fetchPolicy="cache-and-network"
      >
        {({ data }) => {
          if (data && data.weightLogs && data.weightLogs.length > 0) {
            const parsedData = HeightWeightUtil.parseLogData(data);
            const convertedData = HeightWeightUtil.convertWeightUnit(
              parsedData,
              weightUnit
            );

            const lossData = HeightWeightUtil.computeLoss(
              convertedData,
              programStartDate
            );
            const lastWeekLostData = HeightWeightUtil.getCurrentWeekLossData(
              lossData
            );

            return (
              <WeightLossSummaryCardContainer
                changeScrolling={this.props.changeScrolling}
                onCardSelect={this.props.onCardSelect}
                lastWeekLostData={lastWeekLostData}
                userType={this.props.loginUserStore.userType}
                firstName={this.props.userAccountStore.firstName}
                weightUnitText={weightUnitText}
              />
            );
          }
          return null;
        }}
      </Query>
    );
  }
}
