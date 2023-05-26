import React, { Component } from "react";
import { BackHandler, View, Platform } from "react-native";
import { inject, observer } from "mobx-react";
import { CycleSummaryContainer } from "./CycleSummaryContainer";
import { Query } from "react-apollo";
import * as CombinedQueries from "./../../AppSyncQueries/CombinedQueries";
import {
  calculateWaterLogSummary,
  getHistoryDataObject,
} from "../../Components/Gamification/ReloadConfirmationModal";
import { BottomBarConstant } from "../../Components/Tabbar/BottomTabBar";
import { BottomBarContext } from "../../Context/BottomTabContext";
import AppUtil from "../../Library/Utils/AppUtil";

@observer
@inject("userAccountStore", "loginUserStore")
export class CycleSummary extends Component {
  static navigationOptions = {
    header: null,
  };

  static contextType = BottomBarContext;

  componentDidMount() {
    const { lastAcceptedCycle } = this.props.userAccountStore;

    const isFromSummaryPopUp = this.props.navigation.getParam(
      "isFromSummaryPopUp",
      false
    );

    if (lastAcceptedCycle < 2 && isFromSummaryPopUp) {
      this.context.setTabPopup(BottomBarConstant.ShowSummaryPopup);
    }

    this.context.setSelectedTab(BottomBarConstant.SummaryTab);

    BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);
  }

  handleBackButton = () => {
    return false;
  };

  componentWillUnmount() {
    this.context.setTabPopup(null);
  }

  render() {
    const {
      username: userId,
      startDate: fromDate,
      programEndDate: toDate,
    } = this.props.userAccountStore;

    const hasPastEndDate = this.props.userAccountStore.hasProgramCompletedFunction();

    return (
      <View style={{ flex: 1 }}>
        <Query
          query={CombinedQueries.CurrentCycleHistory}
          variables={{ userId, fromDate, toDate }}
          fetchPolicy="cache-and-network"
        >
          {({ data }) => {
            const responseData = data || {};

            const {
              initialWeightLogFromDate = {},
              lastWeightLogFromDate: lastWeightLog = {},
              lastBodyMeasurementFromDate: lastBodyMeasurement = {},
              initialBodyMeasurementLogFromDate = {},
              waterIntakeLogs = [],
            } = responseData;

            const waterIntakeSummary = calculateWaterLogSummary(
              { waterIntakeLogs: waterIntakeLogs },
              this.props.loginUserStore,
              this.props.userAccountStore
            );

            const currentHistory = {
              initialBodyMeasurementLog: initialBodyMeasurementLogFromDate,
              lastBodyMeasurement: lastBodyMeasurement,
              initialWeightLog: initialWeightLogFromDate,
              lastWeightLog: lastWeightLog,
              waterIntakeSummary,
            };

            const history = getHistoryDataObject(
              currentHistory,
              this.props.userAccountStore,
              hasPastEndDate
            );

            return (
              <CycleSummaryContainer
                navigation={this.props.navigation}
                historyData={history}
                shouldShowCurrentCycle={hasPastEndDate}
              />
            );
          }}
        </Query>
      </View>
    );
  }
}
