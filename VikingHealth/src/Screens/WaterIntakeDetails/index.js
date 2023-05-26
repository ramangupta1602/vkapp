import React, { Component } from "react";
import { View, ScrollView, Text, AppState, Dimensions } from "react-native";
import {
  BackButton,
  AddButton,
  PageTitle,
  DateSelection,
  GraphHistory,
  GamificationModal,
  CycleHistoryList,
} from "Components";
import moment from "moment";
import { Query } from "react-apollo";
import { HeightWeightUtil } from "Library/Utils/HeightWeightUtil";
import * as DateUtil from "../../Library/Utils/DateUtil";
import * as Constants from "../../utility/constants/Constants";
import * as WaterIntakeLogQueries from "AppSyncQueries/WaterIntakeLogQueries";
import { WaterIntakeLog } from "Library/Models/WaterIntakeLogModel";
import { R } from "Resources";
import { strings } from "../../utility/locales/i18n";
import { styles } from "./style";
import { API_DATE_FORMAT, USER_TYPE } from "Library/Constants";
import WaterBottle from "./waterBottleView";
import { inject, observer } from "mobx-react";
import GraphView from "./GraphView";
import { Gamification } from "./../../utility/constants/Constants";
import { GraphType } from "../../Screens/AllSummaryGraphScreen/AllSummaryGraph/AllSummaryGraphType";
import { RewardPointsConstant } from "../../Screens/Reward/RewardData";
import ScreenNameConstant from "../../Screens/ScreenNameConstant";
@inject("userAccountStore", "loginUserStore", "gamificationStore")
@observer
export class WaterIntakeDetails extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.targetWaterIntake = this.props.navigation.getParam(
      "targetWaterIntake",
      null
    );
    const date = new Date();
    const weekRange = DateUtil.weekRangeFor(date);
    const { startDate, programEndDate: endDate } = this.props.userAccountStore;

    this.state = {
      graphAllData: [],
      weekLabels: Constants.weekLabels,
      graphWeekData: [],
      isWeekSelected: true,
      fromDate: weekRange.begin.format(API_DATE_FORMAT),
      toDate: weekRange.end.format(API_DATE_FORMAT),
      appState: AppState.currentState,
      isGamificationModalVisible: false,
      cycleStartDate: startDate,
      cycleEndDate: endDate,
      modalName: Gamification.WaterIntake.Completed30DaysAchievement,
      isCurrentCycle: true,
    };

    this.rewardPoints = 0;
    this.isDataUnavailable = true;
  }

  componentDidMount() {
    this.userType = this.props.loginUserStore.userType;

    this.focusListener = this.props.navigation.addListener("didFocus", () => {
      this.checkForGamificationToShow();
    });
  }

  checkForGamificationToShow = () => {
    const modalName = this.props.gamificationStore.shouldShowModal();

    if (modalName) {
      this.setState({ isGamificationModalVisible: true, modalName });
      return;
    }
  };

  addWaterIntake = () => {
    const params = {
      isStepTextShown: false,
      lastWaterIntakeLog: this.lastWaterIntakeLog,
      rewardPoints: this.rewardPoints,
      isDataUnavailable: this.isDataUnavailable,
    };
    this.props.navigation.navigate(ScreenNameConstant.LogWaterIntake, params);
  };

  dateSelectionUpdated = (startDate, endDate, rangeType) => {
    this.setState({
      isWeekSelected: rangeType === 1,
      fromDate: startDate.format(API_DATE_FORMAT),
      toDate: endDate.format(API_DATE_FORMAT),
    });
  };

  onWaterIntakeHistoryClicked = (date, value) => {
    if (this.userType === USER_TYPE.PATIENT) {
      const params = {
        isStepTextShown: false,
        waterIntake: value,
        date,
        isHistoryDate: true,
        lastWaterIntakeLog: this.lastWaterIntakeLog,
        isDataUnavailable: this.isDataUnavailable,
      };
      this.props.navigation.navigate("LogWaterIntake", params);
    }
  };

  computeWaterIntakeHistory = (waterIntakeLogs, waterIntakeUnit) => {
    if (waterIntakeLogs.length === 0) {
      return <Text>No data</Text>;
    }
    return waterIntakeLogs.reverse().map((item) => {
      const waterIntake =
        waterIntakeUnit === HeightWeightUtil.WATER_FLOZ
          ? item.waterIntake
          : HeightWeightUtil.litreValue(item.waterIntake).toFixed(2);
      const date = item.date;

      const unit = HeightWeightUtil.waterBigUnit(waterIntakeUnit);

      const clickListener = this.state.isCurrentCycle
        ? this.onWaterIntakeHistoryClicked.bind(this)
        : null;

      return (
        <GraphHistory
          onClick={clickListener}
          isCurrentCycle={this.state.isCurrentCycle}
          date={date}
          value={
            waterIntakeUnit === HeightWeightUtil.WATER_FLOZ
              ? waterIntake
              : HeightWeightUtil.litreToMlValue(waterIntake)
          }
          displayValue={`${waterIntake} ${unit}`}
          unit={unit}
          isFromWaterIntake
        />
      );
    });
  };

  processWaterIntakeLogHistory = (data) => {
    let waterIntakeLevelData = [];
    let waterIntakeLogObjs = [];

    if (data) {
      const waterIntakeLogs = data.waterIntakeLogs;
      if (waterIntakeLogs) {
        waterIntakeLogObjs = waterIntakeLogs.map((item, index) => {
          const waterIntakeLog = new WaterIntakeLog(
            item.waterIntake,
            item.date,
            item.waterIntakeUnit
          );
          return waterIntakeLog;
        });
        waterIntakeLevelData = this.processWaterIntakeLogsForGraph(
          waterIntakeLogs
        );
      } else {
        waterIntakeLevelData = [0];
      }
    } else {
      waterIntakeLevelData = [0];
    }
    return {
      waterIntakeLogObjs,
      waterIntakeLevelData,
    };
  };

  getIntakeForDate = (date, waterIntakeData) => {
    for (var data of waterIntakeData) {
      if (data.date === date) {
        return data.waterIntake / 1000;
      }
    }

    return 0;
  };

  processWaterIntakeLogsForGraph = (waterIntakeData) => {
    const { fromDate, toDate } = this.state;
    const difference = DateUtil.differenceInTwoDates(fromDate, toDate);
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

    // in case user program start date is greater than toDate (no possible in normal flow)
    if (intakeArray.length > 1) {
      return intakeArray;
    }
    return [0];
  };

  onCycleChipSelected = ({
    startDate,
    endDate,
    isCurrentCycle,
    isAllSelected,
  }) => {
    if (isAllSelected) {
      this.props.navigation.navigate("AllSummaryGraphComponent", {
        graphType: GraphType.WATER_INTAKE_GRAPH,
      });
      return;
    }

    this.setState({
      cycleStartDate: startDate,
      cycleEndDate: endDate,
      isCurrentCycle,
    });
  };

  render() {
    const { cycleStartDate, cycleEndDate, isCurrentCycle } = this.state;
    const dateSelectCurrentDate = isCurrentCycle ? new Date() : cycleStartDate;

    const targetWaterIntake = this.targetWaterIntake;

    const userId = this.props.userAccountStore.username;
    const waterIntakeUnit = this.props.loginUserStore.displayWaterIntakeUnit;
    return (
      <View style={styles.container}>
        <ScrollView>
          <View>
            <View style={R.AppStyles.headerContainer}>
              <BackButton navigation={this.props.navigation} />

              <View style={styles.headerContainer}>
                <PageTitle title={strings("waterIntake_details.title")} />
                {this.userType === USER_TYPE.PATIENT && (
                  <AddButton onClick={this.addWaterIntake} />
                )}
              </View>
            </View>

            {/* water bottle */}
            <Query
              query={WaterIntakeLogQueries.LastRecordedWaterIntake}
              variables={{ userId }}
              fetchPolicy="cache-and-network"
            >
              {({ data }) => {
                this.lastWaterIntakeLog = data.lastWaterIntakeLog;
                const todayDate = DateUtil.formatDate(new Date());

                let isTodayRecord = false;
                let isFutureRecord = false;

                if (
                  data.lastWaterIntakeLog != null &&
                  data.lastWaterIntakeLog.date !== todayDate
                ) {
                  this.lastWaterIntakeLog.waterIntake = 0;
                }

                if (data.lastWaterIntakeLog != null) {
                  isTodayRecord = DateUtil.isAbsoluteToday(
                    data.lastWaterIntakeLog.date
                  );
                  isFutureRecord = DateUtil.isFutureDate(
                    data.lastWaterIntakeLog.date
                  );
                  this.rewardPoints = data.lastWaterIntakeLog.rewardPoints ?? 0;
                  this.isDataUnavailable = false;
                }

                if (!isTodayRecord) {
                  this.rewardPoints = 0;
                }

                if (isFutureRecord) {
                  this.rewardPoints = RewardPointsConstant.WaterChartingMax;
                }

                return (
                  <WaterBottle
                    lastWaterIntakeLog={data.lastWaterIntakeLog}
                    targetIntake={targetWaterIntake}
                    waterIntakeUnit={waterIntakeUnit}
                  />
                );
              }}
            </Query>

            <View style={[R.AppStyles.graphContainerStyle, { marginTop: 20 }]}>
              <CycleHistoryList onChipSelected={this.onCycleChipSelected} />

              {/* Date selection */}
              <View style={{ marginTop: 20 }}>
                <DateSelection
                  date={dateSelectCurrentDate}
                  isWeek
                  programStartDate={cycleStartDate}
                  // for the current cycle show till today else show till end date. this is not a normal use case scnerio, but in testing, when previous cycle start date was in future, it was crashing, therefore this condition
                  programEndDate={isCurrentCycle ? new Date() : cycleEndDate}
                  dateRangeUpdated={this.dateSelectionUpdated}
                />
              </View>

              {/* Graph */}
              <Query
                query={WaterIntakeLogQueries.GetWaterIntakeLogs}
                variables={{
                  userId,
                  fromDate: this.state.fromDate,
                  toDate: this.state.toDate,
                }}
                fetchPolicy="cache-and-network"
              >
                {({ data, loading, error }) => {
                  console.log(
                    "Query data is",
                    data,
                    this.state.fromDate,
                    this.state.toDate
                  );

                  const {
                    waterIntakeLogObjs,
                    waterIntakeLevelData,
                  } = this.processWaterIntakeLogHistory(data);

                  return (
                    <View
                      style={[
                        styles.summaryHistoryContainer,
                        { marginLeft: 8, marginRight: 8 },
                      ]}
                    >
                      {/* Real graph */}
                      <GraphView
                        graphWidth={Dimensions.get("window").width - 32}
                        graphHeight={250}
                        waterIntakeLevelData={waterIntakeLevelData}
                        waterIntakeUnit={waterIntakeUnit}
                        waterIntakeLogObjs={waterIntakeLogObjs}
                        programStartDate={cycleStartDate}
                        programEndDate={cycleEndDate}
                        fromDate={this.state.fromDate}
                        toDate={this.state.toDate}
                        targetWaterIntake={targetWaterIntake}
                        yMax={targetWaterIntake / 1000}
                        isWeekSelected={this.state.isWeekSelected}
                        onWaterIntakeHistoryClicked={
                          this.onWaterIntakeHistoryClicked
                        }
                      />
                      <View style={{ height: 30 }} />
                      {this.computeWaterIntakeHistory(
                        waterIntakeLogObjs,
                        waterIntakeUnit
                      )}
                    </View>
                  );
                }}
              </Query>
            </View>
          </View>
        </ScrollView>

        <GamificationModal
          isVisible={this.state.isGamificationModalVisible}
          onClick={() => {
            this.handleGamificationModalClick();
          }}
          onBackdropPress={() => {
            this.handleGamificationModalBackdropClick();
          }}
          modalName={this.state.modalName}
        />
      </View>
    );
  }

  handleGamificationModalClick = () => {
    if (this.handleQuoteCase()) {
      return;
    }

    this.props.gamificationStore.setShowModalFlag(false, null);
    this.setState({ isGamificationModalVisible: false });
  };

  handleGamificationModalBackdropClick = () => {
    if (this.handleQuoteCase()) {
      return;
    }

    this.props.gamificationStore.setShowModalFlag(false, null);
    this.setState({ isGamificationModalVisible: false });
  };

  handleQuoteCase = () => {
    this.props.gamificationStore.setIsCardShownForFirstTime(true);

    if (this.state.modalName === Gamification.QuoteModal) {
      this.setState({ isGamificationModalVisible: false });

      setTimeout(() => {
        this.setState({
          modalName: Gamification.WaterIntake.Completed0Percent,
          isGamificationModalVisible: true,
        });
      }, 1000);

      return true;
    }
    return false;
  };
}
