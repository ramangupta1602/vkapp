import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Modal,
} from "react-native";
import {
  BackButton,
  PageTitle,
  DateSelection,
  GraphHistory,
  LineChart,
  AddButton,
  SummaryGraph,
  CycleHistoryList,
  GamificationModal,
} from "Components";
import { styles } from "./Styles";
import { strings } from "../../utility/locales/i18n";
import { WaistToHeightInfo } from "./WaistToHeightInfo";
import * as BodyMeasurementQueries from "../../AppSyncQueries/BodyMeasurementQueries";
import * as DateUtil from "../../Library/Utils/DateUtil";
import AppUtil from "Library/Utils/AppUtil";
import { HeightWeightUtil } from "Library/Utils/HeightWeightUtil";
import moment from "moment";
import { USER_TYPE } from "Library/Constants";
import { BodyMeasurementModel } from "Library/Models/BodyMeasurementModel";
import { WaistToHeightRatio } from "./WaistToHeightRatio";
import { R } from "Resources";
import { inject, observer } from "mobx-react";
import { API_DATE_FORMAT } from "Library/Constants";
import * as GraphUtil from "../../utility/GraphUtil";
import { GraphType } from "../../Screens/AllSummaryGraphScreen/AllSummaryGraph/AllSummaryGraphType";
import MeasurementTabs from "./MeasurementTabs";
import ViewJourneyBar from "../WeightDetails/ViewJourneyBar";
import { Query } from "react-apollo";
import ScreenName from "../ScreenNameConstant";

const { width } = Dimensions.get("window");

@inject("userAccountStore", "loginUserStore", "gamificationStore")
@observer
export class BodyMeasurementDetails extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    let date = new Date();
    let monthRange = DateUtil.monthRangeFor(date);

    this.canAddRewardPoint = this.props.navigation.getParam(
      "canAddRewardPoint",
      true
    );
    this.lastBodyMeasurement = this.props.navigation.state.params.lastBodyMeasurement;
    this.cmHeight = this.props.userAccountStore.cmHeight;
    this.gender = this.props.userAccountStore.gender;
    this.userId = this.props.userAccountStore.username;
    this.heightUnit = this.props.loginUserStore.displayHeightUnit;
    this.programStartDate = this.props.userAccountStore.programStartDate;
    this.programEndDate = this.props.userAccountStore.programEndDate;
    this.weekInProgram = this.props.userAccountStore.weekInProgram();
    this.userType = this.props.loginUserStore.userType;

    const { startDate, programEndDate: endDate } = this.props.userAccountStore;

    this.state = {
      selectedIndex: 0,
      isMonthSelected: true,
      isWaistToHeighRatioScreenVisible: false,
      fromDate: monthRange.begin.format(API_DATE_FORMAT),
      toDate: monthRange.end.format(API_DATE_FORMAT),
      cycleStartDate: startDate,
      cycleEndDate: endDate,
      isCurrentCycle: true, /// whether current cycle chip is selected or not. initially it is..
      isGamificationModalVisible: false,
      modalName: null,
    };
  }

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener("didFocus", () => {
      //Quick fix for wthr scale not updating... require changes in render and state for handling it effictively
      //TODO: please refactor it.
      this.setState({});

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

  _measurementClicked = (indexValue) => {
    this.setState({ selectedIndex: indexValue });
  };

  addBodyMeasurement() {
    let params = {
      lastBodyMeasurement: this.lastBodyMeasurement,
      canAddRewardPoint: this.canAddRewardPoint,
    };
    this.props.navigation.navigate("BodyMeasurements", params);
  }

  getWaistToHeightRatio() {
    let waist = this.lastBodyMeasurement.displayWaist(
      HeightWeightUtil.HEIGHT_CM
    );
    return AppUtil.getWaistToHeightRatio(waist, this.cmHeight);
  }

  showHeightToWaistRatioInfoScreen = () => {
    this.setState({ isWaistToHeighRatioScreenVisible: true });
  };

  dismissWaistToHeightInfoModal = () => {
    this.setState({ isWaistToHeighRatioScreenVisible: false });
  };

  renderGraph(data, startDate, endDate, isMonth, graphWidth) {
    let filledValues = {};
    let unit = this.heightUnit;
    data.map((item, index, arr) => {
      let value = item.displayValueForIndex(this.state.selectedIndex, unit);
      filledValues[item.date] = { value: value, week: item.week };
    });

    let startDateM = moment(startDate);
    let endDateM = moment(endDate);
    let dateRange = moment().range(startDateM, endDateM);

    let finalData = [];
    let month = "";
    for (let date of dateRange.by("days")) {
      let formattedDate = date.format("YYYY-MM-DD");
      let filledItem = filledValues[formattedDate];
      let value;
      if (filledItem) {
        value = parseFloat(filledItem.value);
      }

      let xLabel;
      if (isMonth) {
        let currentWeek;
        if (filledItem) {
          currentWeek = "Week " + filledItem.week;
          if (currentWeek == month) {
            xLabel = "";
          } else {
            xLabel = currentWeek;
            month = currentWeek;
          }
        } else {
          xLabel = "";
        }
        // xLabel = date.format('ddd')[0]
      } else {
        let currentMonth = date.format("MMM");
        if (currentMonth == month) {
          xLabel = "";
        } else {
          xLabel = currentMonth;
          month = currentMonth;
        }
      }
      finalData.push({ x: xLabel, y: value });
    }

    let plotAreaWidth = graphWidth - 15 * 2 - 40;
    let gap = 30;
    if (finalData.length > 0) {
      gap = plotAreaWidth / finalData.length;
    }

    return (
      <LineChart
        data={finalData}
        gap={gap}
        numberOfYAxisGuideLine={5}
        hidePoints={!isMonth}
      />
    );
  }

  onBodyMeasurementHistoryClicked(item) {
    if (this.userType === USER_TYPE.PATIENT) {
      let params = {
        selectedBodyMeasurement: item,
        date: item.date,
        canAddRewardPoint: false,
      };
      this.props.navigation.navigate("BodyMeasurements", params);
    }
  }

  computeBodyMeasurementHistory(measurementLogs) {
    const measurementUnit = this.heightUnit;
    if (measurementLogs.length == 0) {
      return <Text>No data</Text>;
    }
    return measurementLogs.reverse().map((item, index, arr) => {
      const value = item.displayValueForIndex(
        this.state.selectedIndex,
        measurementUnit,
        2
      );
      const date = item.date;

      let valueChange;
      const nextIndex = index + 1;
      if (nextIndex <= arr.length - 1) {
        const lastValue = arr[nextIndex].displayValueForIndex(
          this.state.selectedIndex,
          measurementUnit,
          2
        );
        valueChange = value - lastValue;
      }
      const unit = HeightWeightUtil.heightUnit(measurementUnit);

      return (
        <GraphHistory
          key={date}
          isCurrentCycle={this.state.isCurrentCycle}
          onClick={() => {
            if (this.state.isCurrentCycle) {
              this.onBodyMeasurementHistoryClicked(item);
            }
          }}
          date={date}
          value={value}
          displayValue={`${value} ${unit}`}
          change={valueChange}
          unit={unit}
        />
      );
    });
  }

  dateSelectionUpdated(startDate, endDate, rangeType) {
    this.setState({
      isMonthSelected: rangeType === 1,
      fromDate: startDate.format(API_DATE_FORMAT),
      toDate: endDate.format(API_DATE_FORMAT),
    });
  }

  onCycleChipSelected = ({
    startDate,
    endDate,
    isCurrentCycle,
    isAllSelected,
  }) => {
    if (isAllSelected) {
      this.props.navigation.navigate("AllSummaryGraphComponent", {
        graphType: GraphType.BODY_MEASUREMENT_GRAPH,
      });
      return;
    }

    this.setState({
      cycleStartDate: startDate,
      cycleEndDate: endDate,
      isCurrentCycle,
    });
  };

  navigateToMyJourneyScreen = () => {
    this.props.navigation.navigate("SummaryScreen", { showInchLoss: true });
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
  };

  render() {
    const { cycleStartDate, cycleEndDate, isCurrentCycle } = this.state;
    const dateSelectCurrentDate = isCurrentCycle ? new Date() : cycleStartDate;

    const programEndDate = moment(this.programEndDate).format("YYYY-MM-DD");
    const summaryGraphWidth = width - 32 * 2;
    const whtr = this.getWaistToHeightRatio();

    const isPatient = this.props.loginUserStore.userType == USER_TYPE.PATIENT;
    const yourText = isPatient ? "Your" : "";

    return (
      <View style={styles.container}>
        <HeightToWaistInfoModal
          isVisible={this.state.isWaistToHeighRatioScreenVisible}
          ratio={this.getWaistToHeightRatio()}
          dismiss={this.dismissWaistToHeightInfoModal}
        />
        <ScrollView>
          <View>
            <View style={R.AppStyles.headerContainer}>
              <BackButton navigation={this.props.navigation} />
              <View style={styles.headerContainer}>
                <PageTitle
                  title={strings("body_measurement.body_measurement")}
                />
                {this.userType == USER_TYPE.PATIENT && (
                  <AddButton onClick={this.addBodyMeasurement.bind(this)} />
                )}
              </View>
            </View>

            <View
              style={{
                flex: 1,
                marginTop: 30,
                marginLeft: 10,
                marginRight: 10,
              }}
            >
              <WaistToHeightInfo gender={this.gender} ratio={whtr} />
            </View>
            <WaistToHeightInfoSection
              showHeightToWaistRatioInfoScreen={
                this.showHeightToWaistRatioInfoScreen
              }
            />

            <ViewJourneyBar
              yourText={yourText}
              clickListener={this.navigateToMyJourneyScreen}
            />

            <View style={[R.AppStyles.graphContainerStyle, { marginTop: 20 }]}>
              <CycleHistoryList onChipSelected={this.onCycleChipSelected} />

              <View style={{ marginTop: 20 }}>
                <DateSelection
                  date={dateSelectCurrentDate}
                  isWeek={false}
                  programStartDate={cycleStartDate}
                  programEndDate={cycleEndDate}
                  dateRangeUpdated={this.dateSelectionUpdated.bind(this)}
                />
              </View>
              <MeasurementTabs
                measurementClicked={this._measurementClicked}
                selectedIndex={this.state.selectedIndex}
              />

              <Query
                query={BodyMeasurementQueries.GetBodyMeasurementData}
                variables={{
                  userId: this.userId,
                  fromDate: this.state.fromDate,
                  toDate: this.state.toDate,
                }}
                fetchPolicy="cache-and-network"
              >
                {({ data }) => {
                  let bodyMeasurementLogObjs = [];
                  const filledValues = [];
                  const unit = this.heightUnit;

                  if (data) {
                    const bodyMeasurementLogs = data.bodyMeasurements;

                    if (bodyMeasurementLogs) {
                      bodyMeasurementLogObjs = bodyMeasurementLogs.map(
                        (item) => {
                          const bodyMeasurement = new BodyMeasurementModel(
                            item
                          );
                          return bodyMeasurement;
                        }
                      );

                      bodyMeasurementLogObjs.map((item) => {
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
                      this.state.fromDate,
                      programEndDate
                    );
                  }

                  return (
                    <View style={styles.summaryHistoryContainer}>
                      <SummaryGraph
                        filledItems={filledValues}
                        startDate={this.state.fromDate}
                        endDate={this.state.toDate}
                        dataRange={this.state.isMonthSelected ? "all" : "week"}
                        graphWidth={summaryGraphWidth}
                        programEndDate={programEndDate}
                        unit={displayUnit}
                        xAxisData={xAxisData}
                      />

                      <View style={{ height: 30 }} />
                      {this.computeBodyMeasurementHistory(
                        bodyMeasurementLogObjs
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

        <Query
          query={BodyMeasurementQueries.LastRecordedBodyMeasurement}
          fetchPolicy="cache-and-network"
          variables={{
            userId: this.userId,
            fromDate: this.state.fromDate,
            toDate: this.state.toDate,
          }}
        >
          {({ data }) => {
            let isAddedToday = false;
            let hasFutureEntry = false;
            let isWithInWeek = false;
            let lastLogWeek = -1;
            let currentWeek = this.props.userAccountStore.weekInProgramOnDate(
              this.state.date
            );

            if (data && data.lastBodyMeasurement) {
              this.lastBodyMeasurement = new BodyMeasurementModel(
                data.lastBodyMeasurement
              );

              const lastBodyMeasurement = data.lastBodyMeasurement;
              const logDate = lastBodyMeasurement.date;

              isAddedToday = DateUtil.isAbsoluteToday(logDate);
              hasFutureEntry = DateUtil.isFutureDate(logDate);

              lastLogWeek = lastBodyMeasurement.week;

              isWithInWeek =
                lastLogWeek === currentWeek &&
                DateUtil.isAbsoluteWithinAWeek(logDate);

              if (isAddedToday || hasFutureEntry || isWithInWeek) {
                this.canAddRewardPoint = false;
              } else {
                this.canAddRewardPoint = true;
              }
            }

            return null;
          }}
        </Query>
      </View>
    );
  }
}

const WaistToHeightInfoSection = (props) => (
  <View style={{ marginLeft: 16, marginRight: 16, marginTop: 17 }}>
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={[styles.heightToWaistRatio]}>
        {strings("body_measurement.height_to_waist_ratio")}
      </Text>
      <InfoIcon onClick={props.showHeightToWaistRatioInfoScreen} />
    </View>
    <SeparatorLine />
  </View>
);

const InfoIcon = (props) => (
  <TouchableOpacity onPress={props.onClick}>
    <Image
      source={R.Images.info}
      style={[styles.imageInfo, { marginLeft: 4 }]}
    />
  </TouchableOpacity>
);

const SeparatorLine = () => (
  <View
    style={{
      marginTop: 30,
      height: 1,
      width: "100%",
      // backgroundColor: "#D9E2E8",
    }}
  />
);

const HeightToWaistInfoModal = (props) => (
  <Modal animationType="slide" transparent visible={props.isVisible}>
    <WaistToHeightRatio ratio={props.ratio} onCrossClicked={props.dismiss} />
  </Modal>
);
