import React, { Component } from "react";
import { Text } from "react-native";
import * as WeightLogQueries from "AppSyncQueries/WeightLogQueries";
import { Query } from "react-apollo";
import { HeightWeightUtil } from "../../Library/Utils/HeightWeightUtil";

export default class WeightLossLogQueryComponent extends Component {
  render() {
    const { userId, programStartDate, programEndDate, weightUnit } = this.props;

    return (
      <Query
        query={WeightLogQueries.GetWeightLogs}
        variables={{
          userId,
          fromDate: programStartDate,
          toDate: programEndDate
        }}
        fetchPolicy='cache-and-network'
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

            const loss = parseFloat(lastWeekLostData.toFixed(1));

            this.props.updateData(loss);

            return <Text />;
          }
          return <Text />;
        }}
      </Query>
    );
  }
}
