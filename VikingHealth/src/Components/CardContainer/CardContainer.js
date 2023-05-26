import React, { Component } from 'react';
import { View, Animated } from 'react-native';
import { inject, observer } from 'mobx-react';
import {
  WeightLogSection,
  BodyMeasurementSection,
  DayPerformanceSection,
  WaterLogSection,
  ApprovedFoodListCard,
  InchesLossSection,
  WeightLossSummaryCard,
} from '../../Screens/Dashboard/Cards/index';
import { USER_TYPE } from 'Library/Constants';
import Styles from './Styles';
import * as CombinedQueries from '../../AppSyncQueries/CombinedQueries';
import { Query } from 'react-apollo';
import ScreenNameConstant from '../../Screens/ScreenNameConstant';
import moment from 'moment';

@inject('userAccountStore', 'loginUserStore', 'rewardStore')
@observer
export class CardContainer extends Component {
  state = {
    animationStarted: false,
    animate: new Animated.Value(0),
  };

  addWeight(lastWeightLog) {
    if (this.props.loginUserStore.userType == USER_TYPE.PATIENT) {
      const params = {
        isStepTextShown: false,
        lastWeightLog,
      };
      this.props.navigate(ScreenNameConstant.LogWeight, params);
    } else if (this.props.loginUserStore.userType === USER_TYPE.ADMIN) {
      this.props.navigate('AboutYou', {
        isBackButtonVisible: true,
      });
    }
  }

  gotoWeightOverview() {
    this.props.navigate(ScreenNameConstant.WeightDetails);
  }

  gotoBodyMeasurementOverview(lastBodyMeasurement, canAddRewardPoint) {
    const params = {
      lastBodyMeasurement,
      canAddRewardPoint,
    };

    this.props.navigate(ScreenNameConstant.BodyMeasurementDetails, params);
  }

  addBodyMeasurement(
    lastBodyMeasurement,
    canAddRewardPoint,
    isDataUnavailable
  ) {
    const params = {
      lastBodyMeasurement,
      canAddRewardPoint,
      isDataUnavailable,
    };
    if (this.props.loginUserStore.userType == USER_TYPE.PATIENT) {
      this.props.navigate(ScreenNameConstant.BodyMeasurements, params);
    }
  }

  addDaysPerformance(rewardPoints, isDataUnavailable) {
    if (this.props.loginUserStore.userType == USER_TYPE.PATIENT) {
      this.props.navigate(ScreenNameConstant.DaysPerformance, {
        isStepTextShown: false,
        rewardPoints,
        isDataUnavailable,
      });
    }
  }

  gotoDaysPerformanceOverview() {
    this.props.navigate(ScreenNameConstant.DaysPerformanceSummary);
  }

  showFullApprovedFoodList() {
    this.props.navigate(ScreenNameConstant.ApprovedFoodList);
  }

  addWater = (lastWaterIntakeLog, rewardPoints, isDataUnavailable) => {
    const params = {
      lastWaterIntakeLog,
      rewardPoints,
      isDataUnavailable,
    };

    this.props.navigate(ScreenNameConstant.LogWaterIntake, params);
  };

  navigateToWaterIntakeDetails = (targetWaterIntake) => {
    const params = {
      targetWaterIntake,
    };
    this.props.navigate(ScreenNameConstant.WaterIntakeDetails, params);
  };

  navigateToMyJourneyScreen = () => {
    this.props.navigate(ScreenNameConstant.SummaryScreen);
  };

  onBmiBubbleTap = (bmi) => {
    this.props.navigate(ScreenNameConstant.BmiTableScreen, { bmi });
  };

  // this function will be called by card, if anyone is expending to animate food card.
  startAnimation = () => {
    if (this.state.animationStarted == true) {
      return;
    }

    this.setState({ animationStarted: true }, () => {
      Animated.timing(this.state.animate, {
        toValue: 1,
        duration: 750,
      }).start();
    });
  };

  getFoodListStyle = () => {
    const widthInterpolation = this.state.animate.interpolate({
      inputRange: [0, 1],
      outputRange: ['50%', '100%'],
    });

    const marginTopInterpolation = this.state.animate.interpolate({
      inputRange: [0, 1],
      outputRange: [-180, 0],
    });

    const heightInterpolation = this.state.animate.interpolate({
      inputRange: [0, 1],
      outputRange: [164, 84],
    });

    return {
      width: widthInterpolation,
      marginTop: marginTopInterpolation,
      height: heightInterpolation,
    };
  };

  render() {
    const {
      losingPhaseStartDate: fromDate,
      programStartDate,
      programEndDate: toDate,
    } = this.props.userAccountStore;
    const userType = this.props.loginUserStore.userType;
    const userId = this.props.userAccountStore.username;
    const { displayWeightUnit, displayHeightUnit } = this.props.loginUserStore;

    const currentWeek = this.props.userAccountStore.weekInProgramOnDate(
      moment()
    );

    const foodListStyle = this.getFoodListStyle();

    return (
      <View
        style={{ marginBottom: 20 }}
        testID={'cardContainer'}
        accessibilityLabel={'cardContainer'}
      >
        <Query
          query={CombinedQueries.DashboardFetchLogQuery}
          variables={{ userId, fromDate, toDate, programStartDate }}
          fetchPolicy='cache-and-network'
        >
          {({ data }) => {
            const responseData = data || {};

            const {
              lastWaterIntakeLog,
              lastWeightLog,
              lastDaysPerformance,
              lastBodyMeasurement,
              bodyMeasurements,
              weightLogs,
              initialBodyMeasurementLogFromDate: initialBMLogFromStartOfCycle,
              initialWeightLogFromDate: initialWeightLogFromStartOfCycle,
            } = responseData;

            this.props.userAccountStore.setLastLoggedWeight(lastWeightLog);
            this.props.userAccountStore.setLastLoggedBM(lastBodyMeasurement);

            this.props.rewardStore.setInitialWeightLog(
              initialWeightLogFromStartOfCycle
            );
            this.props.rewardStore.setInitialBodyMeasurement(
              initialBMLogFromStartOfCycle
            );

            return (
              <View style={Styles.cardsContainerStyle}>
                <View style={Styles.columnStyle}>
                  <WeightLogSection
                    onCardSelect={this.gotoWeightOverview.bind(this)}
                    onBmiBubbleTap={this.onBmiBubbleTap}
                    addData={this.addWeight.bind(this)}
                    data={lastWeightLog}
                    userType={userType}
                    startAnimation={this.startAnimation}
                  />

                  <BodyMeasurementSection
                    gender={this.props.userAccountStore.gender}
                    userId={this.props.userAccountStore.username}
                    onCardSelect={this.gotoBodyMeasurementOverview.bind(this)}
                    addData={this.addBodyMeasurement.bind(this)}
                    heightUnit={this.props.loginUserStore.displayHeightUnit}
                    cmHeight={this.props.userAccountStore.cmHeight}
                    data={lastBodyMeasurement}
                    userType={userType}
                    startAnimation={this.startAnimation}
                    currentWeek={currentWeek}
                  />
                </View>

                <View style={Styles.columnStyle}>
                  <InchesLossSection
                    weightLogs={weightLogs}
                    bodyMeasurementLogs={bodyMeasurements}
                    userType={userType}
                    weightUnit={displayWeightUnit}
                    startDate={fromDate}
                    heightUnit={displayHeightUnit}
                    onCardSelect={this.navigateToMyJourneyScreen}
                    startAnimation={this.startAnimation}
                  />

                  <WaterLogSection
                    onCardSelect={this.navigateToWaterIntakeDetails}
                    addData={this.addWater}
                    data={lastWaterIntakeLog}
                    userType={userType}
                    targetWaterIntakeLevel={
                      this.props.loginUserStore.getTargetWaterIntake
                    }
                    startAnimation={this.startAnimation}
                  />

                  <DayPerformanceSection
                    onCardSelect={this.gotoDaysPerformanceOverview.bind(this)}
                    addData={this.addDaysPerformance.bind(this)}
                    data={lastDaysPerformance}
                    userType={userType}
                    startAnimation={this.startAnimation}
                  />
                </View>
              </View>
            );
          }}
        </Query>

        <View style={{ flexDirection: 'row' }}>
          <Animated.View style={foodListStyle}>
            <ApprovedFoodListCard
              style={{ height: '100%', overflow: 'hidden' }}
              onCardSelect={this.showFullApprovedFoodList.bind(this)}
            />
          </Animated.View>
        </View>
      </View>
    );
  }
}
