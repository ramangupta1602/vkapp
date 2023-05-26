import React, { Component } from "react";
import { Text } from "react-native";
import * as BodyMeasurementQueries from "AppSyncQueries/BodyMeasurementQueries";
import { Query } from "react-apollo";
import { HeightWeightUtil } from "../../Library/Utils/HeightWeightUtil";

export default class InchesLossLogQueryComponent extends Component {
  render() {
    const { userId, programStartDate, programEndDate, heightUnit } = this.props;

    return (
      <Query
        query={BodyMeasurementQueries.GetBodyMeasurementData}
        variables={{
          userId,
          fromDate: programStartDate,
          toDate: programEndDate,
        }}
        fetchPolicy="cache-and-network">
        {({ data }) => {
          if (
            data &&
            data.bodyMeasurements &&
            data.bodyMeasurements.length > 0
          ) {
            const parsedData = HeightWeightUtil.parseBMLogData(data);
            const convertedData = HeightWeightUtil.convertHeightUnit(
              parsedData,
              heightUnit
            );

            const lossData = HeightWeightUtil.computeBMLoss(
              convertedData,
              this.props.programStartDate
            );
            const loss = parseFloat(lossData.toFixed(1));

            this.props.updateData(loss);
            return <Text />;
          }

          return <Text />;
        }}
      </Query>
    );
  }
}
