import React, { Component } from "react";
import { View, Text, ScrollView, Dimensions } from "react-native";
import {
  BackButton,
  AddButton,
  PageTitle,
  DateSelection,
  CycleHistoryList,
  GraphHistory,
} from "Components";
import { R } from "Resources";
import { styles } from "./Styles";
import { strings } from "../../utility/locales/i18n";
import { Query } from "react-apollo";
import { MoodSummaryChart } from "./MoodSummaryChart";
import * as DayPerformanceQueries from "AppSyncQueries/DayPerformanceQueries";
import * as DateUtil from "../../Library/Utils/DateUtil";
import moment from "moment";
import { DayPerformanceModel } from "Library/Models/DayPerformanceModel";
import { MOODS } from "../DaysPerformance/Moods";
import { USER_TYPE } from "Library/Constants";
import { API_DATE_FORMAT } from "Library/Constants";
import { inject, observer } from "mobx-react";
import GraphView from "../WaterIntakeDetails/GraphView";
import { GraphType } from "../../Screens/AllSummaryGraphScreen/AllSummaryGraph/AllSummaryGraphType";

const { width } = Dimensions.get("window");

@inject("userAccountStore", "loginUserStore")
@observer
export class DaysPerformanceSummary extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    let date = new Date();
    let weekRange = DateUtil.weekRangeFor(date);
    const { startDate, programEndDate: endDate } = this.props.userAccountStore;

    this.state = {
      isWeekSelected: true,
      fromDate: weekRange.begin.format("YYYY-MM-DD"),
      toDate: weekRange.end.format("YYYY-MM-DD"),
      cycleStartDate: startDate,
      cycleEndDate: endDate,
      isCurrentCycle: true, /// whether current cycle chip is selected or not. initially it is..
      key: 1
    };

    this.isDataUnavailable = false;
    this.rewardPoints = 0;
    this.userType = this.props.loginUserStore.userType;
  }

  addDaysPerformance() {
    this.props.navigation.navigate("DaysPerformance", {
      isStepTextShown: false,
      rewardPoints: this.rewardPoints,
      isDataUnavailable: this.isDataUnavailable,
    });
  }

  dateSelectionUpdated(startDate, endDate, rangeType) {
    this.setState({
      isWeekSelected: rangeType == 1,
      fromDate: startDate.format(API_DATE_FORMAT),
      toDate: endDate.format(API_DATE_FORMAT),
    });
  }

  onHistoryClicked(date, value) {
    if (this.userType == USER_TYPE.PATIENT) {
      this.props.navigation.navigate("DaysPerformance", {
        isStepTextShown: false,
        date: date,
        value: value,
        isHistoryDate: true,
        rewardPoints: this.rewardPoints,
        isDataUnavailable: this.isDataUnavailable,
      });
    }
  }

  componentDidMount() {
    this.willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      () => {
        this.setState({
          key: this.state.key + 1
        })
      }
    );
  }

  componentWillUnmount() {
    this.willFocusSubscription.remove();
  }


  computePerformanceHistory(performaneLogs) {
    if (performaneLogs.length == 0) {
      return <Text>No data</Text>;
    }
    return performaneLogs.reverse().map((item, index, arr) => {
      let date = item.date;
      let mood = MOODS[item.rating].name;
      let color = MOODS[item.rating].color;
      const clickListener = this.state.isCurrentCycle
        ? this.onHistoryClicked.bind(this)
        : null;

      return (
        <GraphHistory
          isCurrentCycle={this.state.isCurrentCycle}
          onClick={clickListener}
          date={date}
          value={item.rating}
          displayValue={mood}
          color={color}
        />
      );
    });
  }

  processPerformanceLogHistory = (data) => {
    let performanceLogObjs = [];
    let filledRatings = [];
    if (data) {
      let performaneLogs = data.daysPerformance;
      if (performaneLogs) {
        performanceLogObjs = performaneLogs.map((item, index) => {
          let performanceLog = new DayPerformanceModel(item.rating, item.date);
          return performanceLog;
        });
        performanceLogObjs.map((item, index, arr) => {
          // filledRatings.push(item.rating);
          // filledRatings[item.date] = item.rating;
        });
      }
    }
    return {
      performanceLogObjs,
      filledRatings,
    };
  };

  processPerformanceDataForGraph = (data) => {
    const { fromDate, toDate } = this.state;
    const difference = DateUtil.differenceInTwoDates(fromDate, toDate);
    const differenceBetweenDates = difference + 1;
    const dateArray = [];
    const performanceArray = [];

    for (let i = 0; i < differenceBetweenDates; ++i) {
      const d = moment(fromDate);
      d.add(i, "days");
      const dateString = d.format("YYYY-MM-DD");
      dateArray.push(dateString);
    }

    for (const date of dateArray) {
      const intakeLevel = this.getDailyPerformanceForDate(date, data);
      performanceArray.push(intakeLevel);
    }

    if (performanceArray.length > 0) {
      return performanceArray;
    }
    return [0];
  };

  getDailyPerformanceForDate = (date, dailyPerformanceData) => {
    for (var data of dailyPerformanceData) {
      if (data.date === date) {
        return data.rating;
      }
    }

    return 0;
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
        graphType: GraphType.DAY_PERFORMANCE_GRAPH,
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
    const { programStartDate, programEndDate } = this.props.userAccountStore;
    const { cycleStartDate, cycleEndDate, isCurrentCycle } = this.state;
    const dateSelectCurrentDate = isCurrentCycle ? new Date() : cycleStartDate;
    const userId = this.props.userAccountStore.username;

    return (
      <View style={styles.container}>
        <ScrollView>
          <View>
            <View style={[R.AppStyles.headerContainer]}>
              <BackButton navigation={this.props.navigation} />
              <View style={styles.headerContainer}>
                <PageTitle title={strings("days_performance_summary.title")} />
                {this.userType == USER_TYPE.PATIENT && (
                  <AddButton onClick={this.addDaysPerformance.bind(this)} />
                )}
              </View>
            </View>

            <Query
              query={DayPerformanceQueries.DaysPerformanceSummaryData}
              variables={{ userId: userId }}
              fetchPolicy="cache-and-network"
            >
              {({ loading, error, data }) => {
                if (data) {
                  let summaryData = data.daysPerformanceTotalData;
                  if (summaryData) {
                    let summaryData = [
                      data.daysPerformanceTotalData.excellentDaysCount,
                      data.daysPerformanceTotalData.goodDaysCount,
                      data.daysPerformanceTotalData.okayDaysCount,
                      data.daysPerformanceTotalData.poorDaysCount,
                      data.daysPerformanceTotalData.badDaysCount,
                    ];
                    return <MoodSummaryChart data={summaryData} />;
                  }
                }
                return <View />;
              }}
            </Query>

            <Query
              query={DayPerformanceQueries.LastRecordedDayPerformance}
              variables={{ userId: userId }}
              fetchPolicy="cache-and-network"
            >
              {({ loading, error, data }) => {
                if (data && data.lastDaysPerformance) {
                  const { date, rewardPoints } = data.lastDaysPerformance;

                  const isTodayData = DateUtil.isAbsoluteToday(date);
                  const isFutureDate =
                    DateUtil.absoluteDifferenceFromToday(date) < 0;

                  this.rewardPoints = rewardPoints;

                  if (!isTodayData) {
                    this.rewardPoints = 0;
                  }

                  if (isFutureDate) {
                    this.rewardPoints = 3; // setting it max so what we don't give points when logging.
                  }
                } else {
                  this.rewardPoints = 0;
                  this.isDataUnavailable = true;
                }

                return (
                  <View style={R.AppStyles.graphContainerStyle}>
                    <CycleHistoryList
                      onChipSelected={this.onCycleChipSelected}
                    />
                    <View style={{ marginTop: 20 }}>
                      <DateSelection
                        date={dateSelectCurrentDate}
                        isWeek
                        programStartDate={cycleStartDate}
                        // for the current cycle show till today else show till end date. this is not a normal use case scnerio, but in testing, when previous cycle start date was in future, it was crashing, therefore this condition
                        programEndDate={
                          isCurrentCycle ? new Date() : cycleEndDate
                        }
                        dateRangeUpdated={this.dateSelectionUpdated.bind(this)}
                      />
                      <Query
                        query={DayPerformanceQueries.GetDaysPerformanceData}
                        variables={{
                          userId: userId,
                          fromDate: this.state.fromDate,
                          toDate: this.state.toDate,
                        }}
                        fetchPolicy="cache-and-network"
                      >
                        {({ data }) => {
                          const {
                            performanceLogObjs,
                          } = this.processPerformanceLogHistory(data);
                          const dailyPerformanceArray = this.processPerformanceDataForGraph(
                            performanceLogObjs
                          );

                          return (
                            <View
                              style={[
                                styles.summaryHistoryContainer,
                                { marginHorizontal: 8 },
                              ]}
                            >
                              <GraphView
                                graphWidth={Dimensions.get("window").width - 32}
                                graphHeight={250}
                                waterIntakeLevelData={dailyPerformanceArray}
                                waterIntakeUnit={""}
                                waterIntakeLogObjs={[]}
                                programStartDate={programStartDate}
                                programEndDate={programEndDate}
                                fromDate={this.state.fromDate}
                                toDate={this.state.toDate}
                                isForDailyPerformance
                                targetWaterIntake={5}
                                isWeekSelected={this.state.isWeekSelected}
                                yMax={5}
                              />

                              <View style={{ height: 30 }} />
                              {this.computePerformanceHistory(
                                performanceLogObjs
                              )}
                            </View>
                          );
                        }}
                      </Query>
                    </View>
                  </View>
                );
              }}
            </Query>
          </View>
        </ScrollView>
      </View>
    );
  }
}
