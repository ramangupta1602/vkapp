import React, { Component } from "react";
import { View, Dimensions } from "react-native";
import Styles from "./styles";
import BodyMeasurementSummaryComponent from "./BodyMeasurementSummaryComponent";
import * as BodyMeasurementQueries from "AppSyncQueries/BodyMeasurementQueries";
import { Query } from "react-apollo";
import { inject, observer } from "mobx-react";
import { HeightWeightUtil } from "../../../Library/Utils/HeightWeightUtil";
import LottieView from "lottie-react-native";
import { R } from "../../../Resources/R";
import { FINAL_HEIGHT } from "./BodyMeasurementSummaryComponent";

const { height } = Dimensions.get("window");

@observer
@inject("userAccountStore", "loginUserStore", "gamificationStore")
export default class BodyMeasurementSummary extends Component {
  computeLossData = (data) => {
    const lossData = data.map((element) => {
      const { initialBM, lastRecordedBM } = element;
      const loss = {};
      for (const key in initialBM) {
        const initial = initialBM[key];
        const final = lastRecordedBM[key];
        loss[key] = parseFloat((final - initial).toFixed(1));
      }

      return loss;
    });

    return lossData;
  };

  render() {
    const {
      username: userId,
      startDate: programStartDate,
      programEndDate,
    } = this.props.userAccountStore;
    const { displayHeightUnit } = this.props.loginUserStore;
    const heightUnitText = HeightWeightUtil.heightUnit(displayHeightUnit);
    const {
      scrollToEnd,
      scrollToTop,
      toggleScrolling,
      firstName,
      isPatient,
    } = this.props;

    return (
      <View style={Styles.containerStyle}>
        <Query
          query={BodyMeasurementQueries.BodyMeasurementHistoryData}
          variables={{
            userId,
            fromDate: programStartDate,
            toDate: programEndDate,
          }}
          fetchPolicy="network-only"
        >
          {({ data }) => {
            if (data && data.lastBodyMeasurement) {
              const currentCycleHistory = this.props.userAccountStore
                .cycleHistoryData;

              {
                /* If user have any entry then it will return something */
              }
              const { lastBodyMeasurement } = data;
              let { initialBodyMeasurementLogFromDate } = data;

              {
                /* It will have data only when user have entry in the current cycle,
            in that case we will assign last entry to initial entry, It will be 
            common case in case of reload cycle...  */
              }
              if (!initialBodyMeasurementLogFromDate) {
                initialBodyMeasurementLogFromDate = lastBodyMeasurement;
              }

              const newRecord = {};
              newRecord.initialBM = initialBodyMeasurementLogFromDate;
              newRecord.lastRecordedBM = lastBodyMeasurement;

              const allCycleData = [...currentCycleHistory, newRecord];
              const convertedData = HeightWeightUtil.convertBMUnitFromHistoryObject(
                allCycleData,
                displayHeightUnit
              );

              const lossData = this.computeLossData(convertedData);
              const allTabData = {};

              if (currentCycleHistory.length > 0) {
                allTabData["initialBM"] = convertedData[0].initialBM;
              } else {
                allTabData[
                  "initialBM"
                ] = HeightWeightUtil.convertHeightUnitFromBMLog(
                  initialBodyMeasurementLogFromDate,
                  displayHeightUnit
                );
              }
              allTabData[
                "lastRecordedBM"
              ] = HeightWeightUtil.convertHeightUnitFromBMLog(
                lastBodyMeasurement,
                displayHeightUnit
              );

              const allTabLossData = this.computeLossData([allTabData])[0];

              return (
                <BodyMeasurementSummaryComponent
                  allCycleData={lossData}
                  allTabLossData={allTabLossData}
                  scrollToEnd={scrollToEnd}
                  scrollToTop={scrollToTop}
                  toggleScrolling={toggleScrolling}
                  heightUnitText={heightUnitText}
                  firstName={firstName}
                  isPatient={isPatient}
                />
              );
            }

            return (
              <View
                style={{
                  flex: 1,
                  height: height - 250,
                  width: "100%",
                  marginTop: 10,
                }}
              >
                <LottieView
                  resizeMode="stretch"
                  style={{ flex: 1 }}
                  progress={0}
                  loop={false}
                  source={R.Animations.BODY}
                />
              </View>
            );
          }}
        </Query>
      </View>
    );
  }
}
