import React, { Component } from "react";
import {
  View,
  ScrollView,
  Text,
  Dimensions,
  AppState,
  TouchableOpacity,
} from "react-native";
import {
  BackButton,
  AddButton,
  PageTitle,
  DateSelection,
  SummaryGraph,
  GraphHistory,
  CycleHistoryList,
  GamificationModal,
} from "Components";
import { R } from "Resources";
import * as Constants from "../../utility/constants/Constants";
import { HeightWeightUtil } from "Library/Utils/HeightWeightUtil";
import { styles } from "./Styles";
import { strings } from "../../utility/locales/i18n";
import { WeightComponent } from "./WeightComponent";
import { Query } from "react-apollo";
import * as WeightLogQueries from "AppSyncQueries/WeightLogQueries";
import * as DateUtil from "Library/Utils/DateUtil";
import { USER_TYPE } from "Library/Constants";
import { WeightLog } from "Library/Models/WeightLogModel";
import { API_DATE_FORMAT } from "Library/Constants";
import { inject, observer } from "mobx-react";
import * as GraphUtil from "../../utility/GraphUtil";
import { GraphType } from "../AllSummaryGraphScreen/AllSummaryGraph/AllSummaryGraphType";
import ViewJourneyBar from "./ViewJourneyBar";
import ScreenName from "../ScreenNameConstant";

const { width } = Dimensions.get("window");

@inject("userAccountStore", "loginUserStore", "gamificationStore")
@observer
export class WeightDetails extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    let date = new Date();
    let weekRange = DateUtil.weekRangeFor(date);

    const { startDate, programEndDate: endDate } = this.props.userAccountStore;

    this.state = {
      graphAllData: [],
      weekLabels: Constants.weekLabels,
      graphWeekData: [],
      isWeekSelected: true,
      fromDate: weekRange.begin.format(API_DATE_FORMAT),
      toDate: weekRange.end.format(API_DATE_FORMAT),
      appState: AppState.currentState,
      cycleStartDate: startDate,
      cycleEndDate: endDate,
      isCurrentCycle: true, /// whether current cycle chip is selected or not. initially it is..
      isGamificationModalVisible: false,
      modalName: null,
    };
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

  addWeight() {
    let params = {
      isStepTextShown: false,
      lastWeightLog: this.lastWeightLog,
    };
    this.props.navigation.navigate("LogWeight", params);
  }

  dateSelectionUpdated(startDate, endDate, rangeType) {
    // const programEndDate = moment(this.props.userAccountStore.programEndDate);

    const toDate = endDate.format(API_DATE_FORMAT);
    const fromDate = startDate.format(API_DATE_FORMAT);
    const isWeekSelected = rangeType === 1;

    // if (!isWeekSelected) {
    //   toDate = programEndDate.format(API_DATE_FORMAT);
    // }

    this.setState({
      isWeekSelected,
      fromDate,
      toDate,
    });
  }

  onWeightHistoryClicked(date, value) {
    if (this.userType == USER_TYPE.PATIENT) {
      let params = {
        isStepTextShown: false,
        weight: value,
        date: date,
        lastWeightLog: this.lastWeightLog,
      };
      this.props.navigation.navigate("LogWeight", params);
    }
  }

  computeWeightHistory(weightLogs) {
    let weightUnit = this.props.loginUserStore.displayWeightUnit;
    if (weightLogs.length == 0) {
      return <Text>No data</Text>;
    }
    return weightLogs.reverse().map((item, index, arr) => {
      let weight = item.displayWeight(weightUnit);
      let date = item.date;

      let weightChange;
      let nextIndex = index + 1;
      if (nextIndex <= arr.length - 1) {
        let lastWeight = arr[nextIndex];
        weightChange = weight - lastWeight.displayWeight(weightUnit);
      }
      const unit = HeightWeightUtil.weightUnit(weightUnit);
      const clickListener = this.state.isCurrentCycle
        ? this.onWeightHistoryClicked.bind(this)
        : null;

      return (
        <GraphHistory
          key={date}
          index={index}
          isCurrentCycle={this.state.isCurrentCycle}
          onClick={clickListener}
          date={date}
          value={weight}
          displayValue={`${weight} ${unit}`}
          change={weightChange}
          unit={unit}
        />
      );
    });
  }

  processWeightLossProgress = (data) => {
    const weightUnit = this.props.loginUserStore.displayWeightUnit;
    const targetWeight = this.props.userAccountStore.displayTargetWeight;
    const weightUnitText = this.props.loginUserStore.weightUnitText;
    let initialWeight = "-";
    let currentWeight = "-";
    let weightLost = 0;
    let weightLossProgress = 0;
    let isWeightLoss = true;
    let bmi = 20;

    if (data) {
      const lastWeightLogObj = data.lastWeightLog;
      const initialWeightLogObj = data.initialWeightLog;

      if (lastWeightLogObj && initialWeightLogObj) {
        const lastWeightLog = new WeightLog(
          lastWeightLogObj.weight,
          lastWeightLogObj.date,
          lastWeightLogObj.weightUnit
        );
        const initialWeightLog = new WeightLog(
          initialWeightLogObj.weight,
          initialWeightLogObj.date,
          initialWeightLogObj.weightUnit
        );

        this.lastWeightLog = lastWeightLog;

        currentWeight = lastWeightLog.displayWeight(weightUnit);
        initialWeight = initialWeightLog.displayWeight(weightUnit);
        weightLost = (initialWeight - currentWeight).toFixed(1);

        if (initialWeight === targetWeight) {
          weightLossProgress = 100;
        } else {
          weightLossProgress =
            ((initialWeight - currentWeight) / (initialWeight - targetWeight)) *
            100;
        }

        isWeightLoss = weightLost >= 0;

        bmi = this.props.userAccountStore.bmi(lastWeightLog);
      }
    }
    return {
      initialWeight,
      currentWeight,
      targetWeight,
      weightLost,
      weightLossProgress,
      isWeightLoss,
      bmi,
      weightUnitText,
    };
  };

  processWeightLogHistory = (data) => {
    const weightUnit = this.props.loginUserStore.displayWeightUnit;
    let weightLogObjs = [];
    const filledWeights = {};

    if (data) {
      const weightLogs = data.weightLogs;

      if (weightLogs) {
        weightLogObjs = weightLogs.map((item) => {
          const weightLog = new WeightLog(
            item.weight,
            item.date,
            item.weightUnit
          );
          return weightLog;
        });
        weightLogObjs.map((item, index, arr) => {
          filledWeights[item.date] = item.displayWeight(weightUnit);
        });
      }
    }

    return {
      weightLogObjs,
      filledWeights,
    };
  };

  navigateToMyJourneyScreen = () => {
    this.props.navigation.navigate("SummaryScreen");
  };

  onCycleChipSelected = ({
    startDate,
    endDate,
    index,
    isCurrentCycle,
    isAllSelected,
  }) => {
    if (isAllSelected) {
      this.props.navigation.navigate("AllSummaryGraphComponent", {
        graphType: GraphType.WEIGHT_GRAPH,
      });
      return;
    }

    this.setState({
      cycleStartDate: startDate,
      cycleEndDate: endDate,
      isCurrentCycle,
    });
  };

  handleGamificationModalClick = () => {
    this.props.gamificationStore.setShowModalFlag(false, null);
    this.setState({ isGamificationModalVisible: false });

    setTimeout(() => {
      this.props.navigation.navigate(ScreenName.RewardHistory);
    }, 1000);
  };

  handleGamificationModalBackdropClick = () => {
    this.props.gamificationStore.setShowModalFlag(false, null);
    this.setState({ isGamificationModalVisible: false });

    setTimeout(() => {
      this.props.navigation.navigate(ScreenName.RewardHistory);
    }, 1000);
  };

  render() {
    const { cycleStartDate, cycleEndDate, isCurrentCycle } = this.state;
    const summaryGraphWidth = width - 32 * 2;
    const dateSelectCurrentDate = isCurrentCycle ? new Date() : cycleStartDate;

    const userId = this.props.userAccountStore.username;
    const isPatient = this.props.loginUserStore.userType == USER_TYPE.PATIENT;
    const yourText = isPatient ? "Your" : "";

    return (
      <View style={styles.container}>
        <ScrollView>
          <View>
            {/* Header */}
            <View style={R.AppStyles.headerContainer}>
              <BackButton navigation={this.props.navigation} />
              <View style={styles.headerContainer}>
                <PageTitle title={strings("weight_details.Weight")} />
                {this.userType == USER_TYPE.PATIENT && (
                  <AddButton onClick={this.addWeight.bind(this)} />
                )}
              </View>
            </View>

            {/* Weight log query */}
            <View style={{ marginTop: 30, marginLeft: 10, marginRight: 10 }}>
              <Query
                query={WeightLogQueries.WeightLogsForPatients}
                variables={{ userId: userId }}
                fetchPolicy="cache-and-network"
              >
                {({ loading, error, data }) => {
                  return (
                    <WeightComponent
                      {...this.processWeightLossProgress(data)}
                    />
                  );
                }}
              </Query>
            </View>

            <ViewJourneyBar
              yourText={yourText}
              clickListener={this.navigateToMyJourneyScreen}
            />

            <View style={R.AppStyles.graphContainerStyle}>
              <CycleHistoryList onChipSelected={this.onCycleChipSelected} />

              <View style={{ marginTop: 20 }}>
                <DateSelection
                  date={dateSelectCurrentDate}
                  isWeek
                  isShowTillToday={false}
                  programStartDate={cycleStartDate}
                  programEndDate={cycleEndDate}
                  dateRangeUpdated={this.dateSelectionUpdated.bind(this)}
                />
              </View>

              {/* Weight log history graph */}
              <Query
                query={WeightLogQueries.GetWeightLogs}
                variables={{
                  userId: userId,
                  fromDate: this.state.fromDate,
                  toDate: this.state.toDate,
                }}
                fetchPolicy="cache-and-network"
              >
                {({ data }) => {
                  const {
                    weightLogObjs,
                    filledWeights,
                  } = this.processWeightLogHistory(data);

                  const xAxisData = GraphUtil.getXAxisData(
                    this.state.fromDate,
                    this.state.toDate,
                    this.state.isWeekSelected
                  );

                  return (
                    <View style={styles.summaryHistoryContainer}>
                      <SummaryGraph
                        filledItems={filledWeights}
                        startDate={this.state.fromDate}
                        endDate={this.state.toDate}
                        dataRange={this.state.isWeekSelected ? "week" : "all"}
                        graphWidth={summaryGraphWidth}
                        programEndDate={cycleEndDate}
                        unit={this.props.loginUserStore.weightUnitText}
                        xAxisData={xAxisData}
                        showUserAddedWeightOnly // to render tooltip with optional talkbubble when to show only those logs at which user specified weights.
                      />
                      <View style={{ height: 30 }} />
                      {this.computeWeightHistory(weightLogObjs)}
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
}
