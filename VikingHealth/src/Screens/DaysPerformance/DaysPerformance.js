import React, { Component } from "react";
import { View, Modal, ScrollView, Alert } from "react-native";
import { styles } from "./Styles";
import { strings } from "../../utility/locales/i18n";
import {
  BackButton,
  PageTitle,
  SubTitle,
  PageInfo,
  CTAButton,
  DateTitlePicker,
  ProgressBarButton,
} from "Components";
import { DaysMood } from "./DaysMood";
import DayPerformanceIndicatorView from "./DayPerformanceIndicatorView";
import { inject, observer } from "mobx-react";
import { OnboardingCompleteModal } from "../OnBoard/OnboardingCompleteModal";
import { Mutation } from "react-apollo";
import * as DayPerformanceQueries from "AppSyncQueries/DayPerformanceQueries";
import moment from "moment";
import * as DateUtil from "../../Library/Utils/DateUtil";
import { R } from "Resources";
import AppUtil from "Library/Utils/AppUtil";
import { CancelNotification } from "Components";
import { LocalNotification } from "Components";
import { API_DATE_FORMAT } from "../../Library/Constants";
import { ButtonState } from "Components/CTAButton/ButtonState";
// import { Sentry } from "react-native-sentry";
import { checkInternetConnection } from "react-native-offline";
import * as RewardManager from "../Reward/RewardManager";
// import * as UserQueries from "AppSyncQueries/UserQueries";
import { RewardKeys } from "../../Screens/Reward/RewardManager";

@inject("userAccountStore", "rewardStore")
@observer
export class DaysPerformance extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);

    this.shouldShowPageInfo = this.props.navigation.getParam(
      "isStepTextShown",
      false
    );
    const date = this.props.navigation.getParam(
      "date",
      moment().format(API_DATE_FORMAT)
    );

    this.isHistoryDate = this.props.navigation.getParam("isHistoryDate", false);

    const value = this.props.navigation.getParam("value", 3);
    this.previousRewardPoint = this.props.navigation.getParam(
      "rewardPoints",
      0
    );

    // checking if we have previous log record or not.. this is useful in checking if user is exploiting reward system.
    this.isDataUnavailable = this.props.navigation.getParam(
      "isDataUnavailable",
      false
    );

    this.userId = this.props.userAccountStore.username;
    this.state = {
      modalVisible: false,
      mood: value,
      date,
    };

    this.localNotification = new LocalNotification();
    this.CancelNotification = new CancelNotification();

    this.isInputEnabled = true;
  }

  CTAClicked = () => {
    const tomorrow = moment(new Date()).add(1, "days");
    const newdate = DateUtil.getDate(tomorrow);
    const endProgramDate = this.props.userAccountStore.programEndDate;
    const startProgramDate = this.props.userAccountStore.programStartDate;
    this.localNotification.checkNewDateForProverbs(
      newdate,
      startProgramDate,
      endProgramDate
    );
    if (moment(endProgramDate).diff(moment(newdate), "days") <= 0) {
      this.CancelNotification.disableLocalNotificationDays();
    }

    if (this.shouldShowPageInfo) {
      this.setState({ modalVisible: true });
    } else {
      this.props.navigation.goBack();
    }

    this.props.rewardStore.setDayPerformanceReward(this.rewardPoints.addPoint);
  };

  _gotoDashboard = () => {
    this.props.navigation.dispatch(AppUtil.resetAction("Dashboard", {}));
  };

  _onDateChanged = (displayDate, date) => {
    const formattedDate = moment(date).format(API_DATE_FORMAT);
    this.setState({ date: formattedDate });
  };

  updateCacheLastRecordedDayPerformance(proxy, dayPerformance) {
    const query = DayPerformanceQueries.LastRecordedDayPerformance;
    const queryVariables = { userId: this.userId };

    try {
      let data = proxy.readQuery({
        query,
        variables: queryVariables,
      });
      if (data.lastDaysPerformance) {
        if (
          !moment(data.lastDaysPerformance.date).isAfter(
            moment(dayPerformance.date)
          )
        ) {
          data.lastDaysPerformance = dayPerformance;
        }
      } else {
        data.lastDaysPerformance = dayPerformance;
      }
      proxy.writeQuery({
        query,
        variables: { userId: this.userId },
        data,
      });
    } catch (e) {
      console.log("EXCEPTION: ", e.message);
    }
  }

  updateCacheDayPerformanceLogList(
    proxy,
    dayPerformance,
    fromDate,
    toDate,
    updateSummary
  ) {
    const query = DayPerformanceQueries.GetDaysPerformanceData;
    const queryVariables = {
      userId: this.userId,
      fromDate,
      toDate,
    };

    try {
      let data = proxy.readQuery({
        query,
        variables: queryVariables,
      });

      if (data.daysPerformance) {
        const dateToUpdate = dayPerformance.date;
        const index = data.daysPerformance.findIndex(
          (log) => log.date === dateToUpdate
        );
        let previousPerformanceRating = null;
        if (index >= 0) {
          previousPerformanceRating = data.daysPerformance[index];
          data.daysPerformance[index] = dayPerformance;
        } else {
          data.daysPerformance.push(dayPerformance);
          data.daysPerformance.sort((a, b) => moment(a.date) - moment(b.date));
        }
        if (updateSummary) {
          this.updateCacheDayPerformanceSummary(
            proxy,
            previousPerformanceRating,
            dayPerformance
          );
        }

        proxy.writeQuery({
          query,
          variables: queryVariables,
          data,
        });
      }
    } catch (e) {
      console.log("EXCEPTION: ", e.message);
    }
  }

  updateCacheDayPerformanceSummary(proxy, previousRating, dayPerformance) {
    const query = DayPerformanceQueries.DaysPerformanceSummaryData;
    const queryVariables = { userId: this.userId };
    try {
      data = proxy.readQuery({
        query,
        variables: queryVariables,
      });

      if (data.daysPerformanceTotalData) {
        if (previousRating) {
          switch (previousRating.rating) {
            case 1:
              data.daysPerformanceTotalData.badDaysCount -= 1;
              break;
            case 2:
              data.daysPerformanceTotalData.poorDaysCount -= 1;
              break;
            case 3:
              data.daysPerformanceTotalData.okayDaysCount -= 1;
              break;
            case 4:
              data.daysPerformanceTotalData.goodDaysCount -= 1;
              break;
            case 5:
              data.daysPerformanceTotalData.excellentDaysCount -= 1;
              break;
          }
        }

        switch (dayPerformance.rating) {
          case 1:
            data.daysPerformanceTotalData.badDaysCount += 1;
            break;
          case 2:
            data.daysPerformanceTotalData.poorDaysCount += 1;
            break;
          case 3:
            data.daysPerformanceTotalData.okayDaysCount += 1;
            break;
          case 4:
            data.daysPerformanceTotalData.goodDaysCount += 1;
            break;
          case 5:
            data.daysPerformanceTotalData.excellentDaysCount += 1;
            break;
        }

        proxy.writeQuery({
          query,
          variables: { userId: this.userId },
          data,
        });
      }
    } catch (e) {}
  }

  updateDayPerformanceResults = (proxy, { data: { addDayPerformance } }) => {
    if (this.shouldShowPageInfo) {
      return;
    }

    this.updateCacheLastRecordedDayPerformance(proxy, addDayPerformance);

    const weekRange = DateUtil.weekRangeFor(addDayPerformance.date);
    const fromDate = weekRange.begin.format(API_DATE_FORMAT);
    const toDate = weekRange.end.format(API_DATE_FORMAT);
    this.updateCacheDayPerformanceLogList(
      proxy,
      addDayPerformance,
      fromDate,
      toDate,
      false
    );

    const programStartDate = this.props.userAccountStore.startDate;
    const programEndDate = AppUtil.getCurrentDate();
    this.updateCacheDayPerformanceLogList(
      proxy,
      addDayPerformance,
      programStartDate,
      programEndDate,
      true
    );
  };

  _moodUpdated = (value) => {
    this.setState({
      mood: value,
    });
  };

  render() {
    const {
      startDate: programStartDate,
      programEndDate,
    } = this.props.userAccountStore;

    const {
      rewardData: {
        total: totalReward,
        [RewardKeys.HasRedeemedForCurrentCycle]: hasRedeemed,
      },
    } = this.props.rewardStore;

    return (
      <View style={[styles.container, { paddingBottom: 20 }]}>
        <Modal
          animationType="fade"
          transparent
          visible={this.state.modalVisible}>
          <OnboardingCompleteModal onDone={this._gotoDashboard} />
        </Modal>

        <View style={[R.AppStyles.headerContainer, { flex: 1 }]}>
          <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
            <BackButton navigation={this.props.navigation} />
            {this.shouldShowPageInfo ? (
              <PageInfo info={strings("days_performance.step3outof3")} />
            ) : (
              <DateTitlePicker
                style={{ marginTop: 11 }}
                date={this.state.date}
                preText="Update performance of"
                onDateChanged={this._onDateChanged}
                programStartDate={programStartDate}
              />
            )}
          </View>
          <ScrollView
            style={{ width: "100%" }}
            showsVerticalScrollIndicator={false}
            scrollEnabled>
            <View style={{ width: "100%" }}>
              <PageTitle
                title={strings("days_performance.how_are_you_feeling_today")}
              />

              <SubTitle
                subTitle={strings(
                  "days_performance.measuure_your_day_performance_dialy"
                )}
              />

              <View style={[styles.dayMoodContainer]}>
                <DaysMood
                  mood={this.state.mood}
                  onValueChange={this._moodUpdated}
                />
              </View>

              <View style={{ alignItems: "center", marginTop: 50 }}>
                <DayPerformanceIndicatorView mood={this.state.mood} />
              </View>

              <Mutation
                mutation={DayPerformanceQueries.AddDayPerformance}
                refetchQueries={["GetLastRecordedLog", "GetProfile"]}
                onError={(error) => {
                  this.isInputEnabled = true;
                //   Sentry.captureMessage(error.message);
                  Alert.alert(
                    "Alert!",
                    "We were not able to log your day performance. Please try again later."
                  );
                }}
                onCompleted={this.CTAClicked}
                update={this.updateDayPerformanceResults}>
                {(addRating, { loading, error, data }) => {
                  let buttonState = ButtonState.Idle;
                  let buttonLabel = "DONE";
                  if (loading) {
                    buttonState = ButtonState.Progress;
                    buttonLabel = "";
                  }

                  return (
                    <View style={[styles.buttonContainer, { marginTop: 40 }]}>
                      <ProgressBarButton
                        disabled={loading}
                        label={buttonLabel}
                        buttonState={buttonState}
                        onClick={() => {
                          this.isHistoryDate = DateUtil.isPastDate(
                            this.state.date
                          );

                          const validateReward = RewardManager.validateUserForReward(
                            programStartDate,
                            programEndDate,
                            hasRedeemed,
                            totalReward
                          );

                          this.rewardPoints = RewardManager.getRewardForDayPerformance(
                            {
                              rating: this.state.mood,
                              previousReward: this.previousRewardPoint,
                              isHistoryDate: this.isHistoryDate,
                              notValidReward: validateReward,
                              totalReward: totalReward,
                            }
                          );

                          // if last log is not present and also user has not day performance data in the reward then only we will give points.
                          // otherwise user is trying to exploit reward system.
                          if (
                            this.isDataUnavailable &&
                            this.props.rewardStore.rewardData[
                              RewardManager.RewardKeys.DayPerformance
                            ].points !== 0
                          ) {
                            this.rewardPoints[
                              RewardManager.RewardKeys.AddPoint
                            ] = 0;
                            this.rewardPoints[
                              RewardManager.RewardKeys.Reward
                            ] = 0;
                          }

                          const mutationVariable = {
                            rating: this.state.mood,
                            date: this.state.date,
                            input: [
                              {
                                points: this.rewardPoints[
                                  RewardManager.RewardKeys.AddPoint
                                ],
                                date: this.state.date,
                                key: RewardManager.RewardKeys.DayPerformance,
                              },
                            ],
                          };

                          if (
                            !this.isHistoryDate &&
                            this.rewardPoints.reward > 0
                          ) {
                            mutationVariable.rewardPoints = this.rewardPoints.reward;
                          }

                          if (!this.isInputEnabled) {
                            return;
                          }

                          this.isInputEnabled = false;

                          checkInternetConnection().then((isConnected) => {
                            if (isConnected === true) {
                              addRating({
                                variables: mutationVariable,
                                refetchQueries: [
                                  {
                                    query:
                                      DayPerformanceQueries.DaysPerformanceSummaryData,
                                    variables: { userId: this.userId },
                                  },
                                ],
                              });
                            } else {
                              this.isInputEnabled = true;
                              Alert.alert(
                                "No Internet Connection",
                                "It seems there is some problem with your internet connection. Please check and try again."
                              );
                            }
                          });
                        }}
                      />
                    </View>
                  );
                }}
              </Mutation>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}
