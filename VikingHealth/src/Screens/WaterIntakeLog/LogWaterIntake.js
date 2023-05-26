import React, { Component } from "react";
import {
  View,
  Dimensions,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { R } from "Resources";
import { WaterLevels, WaterLevelsInOz } from "./WaterLevels";
import {
  BackButton,
  PageTitle,
  DateTitlePicker,
  ProgressBarButton,
} from "Components";
import { styles } from "./style";
import { strings } from "../../utility/locales/i18n";
import * as WaterIntakeLogQueries from "AppSyncQueries/WaterIntakeLogQueries";
import { Mutation } from "react-apollo";
import moment from "moment";
import * as DateUtil from "../../Library/Utils/DateUtil";
import { HeightWeightUtil } from "Library/Utils/HeightWeightUtil";
import { CancelNotification } from "Components";
import { LocalNotification } from "Components";
import { inject, observer } from "mobx-react";
import { ButtonState } from "Components/CTAButton/ButtonState";
import AppUtil from "Library/Utils/AppUtil";
import { API_DATE_FORMAT } from "Library/Constants";
import { Gamification } from "./../../utility/constants/Constants";
// import { Sentry } from "react-native-sentry";
import { checkInternetConnection } from "react-native-offline";
import { UpdateGamificationLogs } from "../../AppSyncQueries/GamificationQueries";
import { appsyncClient } from "../../../App";
import * as RewardManager from "../Reward/RewardManager";

@inject(
  "userAccountStore",
  "loginUserStore",
  "gamificationStore",
  "rewardStore"
)
@observer
export class LogWaterIntake extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);

    const isHistoryDate = this.props.navigation.getParam(
      "isHistoryDate",
      false
    );

    this.previousRewardPoints = this.props.navigation.getParam(
      "rewardPoints",
      0
    );

    this.isDataUnavailable = this.props.navigation.getParam(
      "isDataUnavailable",
      true
    );

    const targetWaterIntakeLevel = this.props.loginUserStore
      .getTargetWaterIntake;

    //should call in same sequence
    this.getParams();
    this.setDefaultWaterIntake();
    this.setHeader();
    this.state = {
      lastWaterIntake: this.lastWaterIntake,
      waterIntake: this.defaultWaterIntake,
      date: this.date,
      isDateChanged: false,
      isHistoryDate,
      targetWaterIntakeLevel,
    };
    this.localNotification = new LocalNotification();
    this.CancelNotification = new CancelNotification();

    this.isInputEnabled = true;
  }

  getParams() {
    this.waterIntakeUnit = this.props.loginUserStore.displayWaterIntakeUnit
      ? this.props.loginUserStore.displayWaterIntakeUnit
      : 0;
    this.shouldShowPageInfo = this.props.navigation.getParam(
      "isStepTextShown",
      false
    );
    this.userId = this.props.userAccountStore.username;
    this.lastWaterIntakeLog = this.props.navigation.getParam(
      "lastWaterIntakeLog",
      null
    );
    this.selectedWaterIntake = this.props.navigation.getParam(
      "waterIntake",
      null
    );
    this.date = this.props.navigation.getParam(
      "date",
      moment().format(API_DATE_FORMAT)
    );
  }

  setDefaultWaterIntake() {
    const isHistoryDate = this.props.navigation.getParam(
      "isHistoryDate",
      false
    );

    if (this.selectedWaterIntake) {
      this.defaultWaterIntake = this.selectedWaterIntake;
      this.lastWaterIntake = this.selectedWaterIntake;
    } else if (this.lastWaterIntakeLog != null) {
      this.defaultWaterIntake = this.lastWaterIntakeLog.waterIntake;
      this.lastWaterIntake = this.lastWaterIntakeLog.waterIntake;
    } else {
      this.defaultWaterIntake = 0;
      this.lastWaterIntake = 0;
    }

    if (!isHistoryDate) {
      this.defaultWaterIntake = 0;
    }
  }

  setHeader() {
    this.title = strings("log_water.heading");
  }

  waterIntakeLogSaved = () => {
    if (!this.state.isHistoryDate) {
      this.props.rewardStore.setWaterPerformanceReward(
        this.rewardPoints.addPoint
      );
    }

    this.props.navigation.goBack();
  };

  updateCacheLastRecordedWaterIntakeLog(proxy, waterIntakeLog) {
    const query = WaterIntakeLogQueries.LastRecordedWaterIntake;
    const queryVariables = { userId: this.userId };
    let data;
    try {
      data = proxy.readQuery({
        query,
        variables: queryVariables,
      });
      if (data.lastWaterIntakeLog) {
        if (
          !moment(data.lastWaterIntakeLog.date).isAfter(
            moment(waterIntakeLog.date)
          )
        ) {
          data.lastWaterIntakeLog = waterIntakeLog;
        }
      } else {
        data.lastWaterIntakeLog = waterIntakeLog;
      }
      proxy.writeQuery({
        query,
        variables: queryVariables,
        data,
      });
    } catch (e) {
      console.log("EXCEPTION isLastWeightQueryAvailable: ", e.message);
    }
  }

  updateCacheWaterIntakeLogList(proxy, waterIntakeLog, fromDate, toDate) {
    const query = WaterIntakeLogQueries.GetWaterIntakeLogs;
    const queryVariables = {
      userId: this.userId,
      fromDate: fromDate,
      toDate: toDate,
    };

    try {
      let data = proxy.readQuery({
        query: query,
        variables: queryVariables,
      });

      if (data.waterIntakeLogs) {
        const dateToUpdate = waterIntakeLog.date;
        const index = data.waterIntakeLogs.findIndex(
          (log) => log.date === dateToUpdate
        );
        if (index >= 0) {
          data.waterIntakeLogs[index] = waterIntakeLog;
        } else {
          data.waterIntakeLogs.push(waterIntakeLog);
          data.waterIntakeLogs.sort((a, b) => moment(a.date) - moment(b.date));
        }

        proxy.writeQuery({
          query: query,
          variables: queryVariables,
          data,
        });
      }
    } catch (e) {
      console.log("EXCEPTION: ", fromDate, toDate, e.message);
    }
  }

  updateLogWaterIntakeResult = (proxy, { data: { addWaterIntakeLog } }) => {
    if (!addWaterIntakeLog) {
      return;
    }

    console.log("mutation is", addWaterIntakeLog);
    this.updateCacheLastRecordedWaterIntakeLog(proxy, addWaterIntakeLog);

    let weekRange = DateUtil.weekRangeFor(addWaterIntakeLog.date);
    let fromDate = weekRange.begin.format(API_DATE_FORMAT);
    let toDate = weekRange.end.format(API_DATE_FORMAT);
    // this.updateCacheWaterIntakeLogList(
    //   proxy,
    //   addWaterIntakeLog,
    //   fromDate,
    //   toDate
    // );

    const programStartDate = this.props.userAccountStore.startDate;
    const programEndDate = AppUtil.getCurrentDate();
    this.updateCacheWaterIntakeLogList(
      proxy,
      addWaterIntakeLog,
      programStartDate,
      programEndDate
    );
  };

  onDateChanged(displayDate, date) {
    const formattedDate = moment(date).format(API_DATE_FORMAT);
    this.setState({ date: formattedDate, isDateChanged: true });
  }

  onSelectingWaterLevel = (waterLevel, selectedWaterLevelIndex) => {
    if (!this.isInputEnabled) {
      return;
    }

    const { waterIntake } = this.state;
    this.setState({ waterIntake: waterIntake + waterLevel });
  };

  getWaterIntakeDetailsCard = () => {
    const { isHistoryDate, isDateChanged } = this.state;
    const waterLevelUnit = HeightWeightUtil.waterUnit(this.waterIntakeUnit);

    if (isDateChanged) {
      return null;
    }

    let todayIntakeTitle = "";
    let targetTitle = "";

    if (!isHistoryDate) {
      todayIntakeTitle = "Today's Intake : ";
      targetTitle = "Today's Target : ";
    } else {
      todayIntakeTitle = "Current Intake : ";
      targetTitle = "Current Target : ";
    }

    return (
      <View style={styles.waterIntakeDetailsCardStyle}>
        <View style={styles.waterIntakeCardSingleDetailStyle}>
          <Text style={styles.waterIntakeCardTitleStyle}>
            {todayIntakeTitle}
          </Text>
          <Text
            style={[styles.waterIntakeCardTitleStyle, { fontWeight: "500" }]}
          >
            {this.state.lastWaterIntake} {waterLevelUnit}{" "}
          </Text>
        </View>
        <View style={styles.waterIntakeCardDivider} />
        <View style={styles.waterIntakeCardSingleDetailStyle}>
          <Text style={styles.waterIntakeCardTitleStyle}>{targetTitle} </Text>
          <Text
            style={[styles.waterIntakeCardTitleStyle, { fontWeight: "500" }]}
          >
            {this.state.targetWaterIntakeLevel.toFixed(0)} {waterLevelUnit}{" "}
          </Text>
        </View>
      </View>
    );
  };

  getRegularWaterIntakeDaysCount = () => {
    const lastCompletedDate = this.props.gamificationStore
      .lastCompletedWIGoalDate;
    const noOfConsecutiveDay = this.props.gamificationStore.waterIntakeConsDays;
    const isToday = DateUtil.isAbsoluteToday(lastCompletedDate);
    const isCompletedYesterday = DateUtil.isYesterday(lastCompletedDate);

    // if it is already uploaded on the server then don't upload it again.
    if (isToday) {
      // this.props.navigation.goBack();
      return;
    }

    const finalWaterIntake =
      this.state.waterIntake + this.state.lastWaterIntake;
    const targetWaterIntakeLevel = this.props.loginUserStore
      .getTargetWaterIntake;

    if (targetWaterIntakeLevel > finalWaterIntake) {
      return 0;
    }

    const consDays = noOfConsecutiveDay + 1;

    switch (consDays) {
      case 30:
        return 30;
      case 7:
        return 7;
      default:
        return 1;
    }
  };

  updateGamificationLogs = () => {
    // get the previous completed date..
    const lastCompletedDate = this.props.gamificationStore
      .lastCompletedWIGoalDate;
    const noOfConsecutiveDay = this.props.gamificationStore.waterIntakeConsDays;
    const isToday = DateUtil.isToday(lastCompletedDate);
    const isCompletedYesterday = DateUtil.isYesterday(lastCompletedDate);
    const todaysDate = DateUtil.formattedTodayDate();
    let noOfDays = 0;

    // if it is already uploaded on the server then don't upload it again.
    if (isToday) {
      // this.props.navigation.goBack();
      return;
    }

    if (isCompletedYesterday) {
      noOfDays = noOfConsecutiveDay + 1;
    } else {
      noOfDays = 1;
    }

    // not calling this function for history so can skip the conditional final intake
    const finalWaterIntake =
      this.state.waterIntake + this.state.lastWaterIntake;
    const targetWaterIntakeLevel = this.props.loginUserStore
      .getTargetWaterIntake;

    const percentage = (finalWaterIntake / targetWaterIntakeLevel) * 100;

    if (percentage < 50) {
      // this.props.navigation.goBack();
      return;
    }

    // if percentage is between 50 & 100, then show 50% modal, no need of server updation
    if (percentage >= 50 && percentage < 100) {
      this.props.gamificationStore.setShowModalFlag(
        true,
        Gamification.WaterIntake.Completed50Percent
      );

      // this.props.navigation.goBack();
      return;
    }

    let shouldShowModal = false;
    let modalName = "";

    switch (noOfDays) {
      case 2:
        shouldShowModal = true;
        modalName = Gamification.WaterIntake.NextAchievement7Days;
        break;

      case 7:
        shouldShowModal = true;
        modalName = Gamification.WaterIntake.Completed7DaysAchievement;
        break;

      case 8:
        shouldShowModal = true;
        modalName = Gamification.WaterIntake.NextAchievement30Days;
        break;
      case 15:
      case 22:
        shouldShowModal = true;
        modalName = Gamification.WaterIntake.NextAchievement30Days;
        break;

      case 30:
        shouldShowModal = true;
        modalName = Gamification.WaterIntake.Completed30DaysAchievement;
        break;

      default:
        shouldShowModal = true;
        modalName = Gamification.WaterIntake.Completed100Percent;
        break;
    }

    this.props.gamificationStore.setShowModalFlag(shouldShowModal, modalName);
    this.props.gamificationStore.setLastCompletedWIGoalDate(todaysDate);
    this.props.gamificationStore.setWaterIntakeConsDays(noOfDays);

    appsyncClient.mutate({
      mutation: UpdateGamificationLogs,
      variables: {
        lastCompletedWIGoalDate: todaysDate,
        waterIntakeConsDays: noOfDays,
      },
    });
  };

  render() {
    const { waterIntake, date, isHistoryDate } = this.state;
    const waterLevelUnit = HeightWeightUtil.waterUnit(this.waterIntakeUnit);
    const {
      startDate: programStartDate,
      programEndDate,
    } = this.props.userAccountStore;

    const {
      rewardData: {
        total: totalReward,
        [RewardManager.RewardKeys.HasRedeemedForCurrentCycle]: hasRedeemed,
      },
    } = this.props.rewardStore;

    let finalWaterIntake = 0;
    const addLogTitle = isHistoryDate
      ? "Edit water intake"
      : "Add water intake";

    if (isHistoryDate) {
      finalWaterIntake = waterIntake;
    } else {
      finalWaterIntake = waterIntake + this.state.lastWaterIntake;
    }

    return (
      <KeyboardAwareScrollView
        style={styles.scrollViewStyle}
        scrollEnabled
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <View style={R.AppStyles.headerContainer}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <BackButton navigation={this.props.navigation} />

              {isHistoryDate && (
                <DateTitlePicker
                  date={this.state.date}
                  preText="Adding log for:"
                  onDateChanged={this.onDateChanged.bind(this)}
                  programStartDate={programStartDate}
                />
              )}
            </View>
            <PageTitle title={this.title} />
          </View>

          {this.getWaterIntakeDetailsCard()}

          <Text style={styles.logText}>{addLogTitle}</Text>

          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInputStyle}
              value={waterIntake.toString()}
              keyboardType="number-pad"
              maxLength={6}
              onChangeText={(text) =>
                this.setState({ waterIntake: text ? parseInt(text) : 0 })
              }
            />
            <Text style={styles.unitTextStyle}>{waterLevelUnit}</Text>
          </View>
          <View style={styles.seperatorStyle} />
          <Text style={styles.quickAdd}>Quick Add</Text>
          <View style={styles.quickAddOptionsContainer}>
            <WaterLevelComponent
              values={
                this.waterIntakeUnit === HeightWeightUtil.WATER_FLOZ
                  ? WaterLevelsInOz
                  : WaterLevels
              }
              onSelectingWaterLevel={this.onSelectingWaterLevel}
              waterLevelUnit={waterLevelUnit}
            />
          </View>

          <Mutation
            mutation={WaterIntakeLogQueries.AddWaterIntakeLog}
            onError={(error) => {
              this.isInputEnabled = true;
            //   Sentry.captureMessage(error.message);
              Alert.alert(
                "Alert!",
                "We were not able to log your water intake. Please try again later."
              );
            }}
            onCompleted={this.waterIntakeLogSaved}
            refetchQueries={["GetLastRecordedLog", "GetWaterIntakeLogs"]}
            update={this.updateLogWaterIntakeResult}
          >
            {(addWaterIntake, { loading, error, data }) => {
              let buttonState = ButtonState.Idle;
              let buttonLabel = "SAVE";
              if (loading) {
                buttonState = ButtonState.Progress;
                buttonLabel = "";
              }

              return (
                <ProgressBarButton
                  disabled={loading}
                  label={buttonLabel}
                  buttonState={buttonState}
                  onClick={() => {
                    if (!this.isInputEnabled) {
                      return;
                    }

                    Keyboard.dismiss();
                    this.isInputEnabled = false;

                    checkInternetConnection().then((isConnected) => {
                      if (isConnected === true) {
                        const badgeType = this.getRegularWaterIntakeDaysCount();
                        // History date....
                        if (isHistoryDate) {
                          Alert.alert(
                            "Alert",
                            "This record will be overridden as you are editing a previous record. Would you like to go ahead?",
                            [
                              {
                                text: "Cancel",
                                onPress: () => console.log("Cancel Pressed"),
                                style: "cancel",
                              },
                              {
                                text: "OK",
                                onPress: () => {
                                  addWaterIntake({
                                    variables: {
                                      waterIntake: finalWaterIntake,
                                      date,
                                      waterIntakeUnit: this.waterIntakeUnit,
                                      // badgeType: 30 -- if history date, we are not changing its badge.
                                    },
                                  });
                                },
                              },
                            ],
                            { cancelable: false }
                          );
                        } else if (waterIntake <= 0) {
                          this.isInputEnabled = true;
                          Alert.alert(
                            "Error",
                            "Please enter valid water intake."
                          );
                        } else {
                          const validateReward = RewardManager.validateUserForReward(
                            programStartDate,
                            programEndDate,
                            hasRedeemed,
                            totalReward
                          );

                          // Current date..
                          this.rewardPoints = RewardManager.getRewardForWaterIntake(
                            {
                              intake: finalWaterIntake,
                              unit: this.waterIntakeUnit,
                              previousReward: this.previousRewardPoints,
                              isHistoryDate: false,
                              notValidReward: validateReward,
                              totalReward: totalReward,
                            }
                          );

                          // if last log is not present and also user has not day performance data `in the reward then only we will give points.
                          // otherwise user is trying to exploit reward system.
                          if (
                            this.isDataUnavailable &&
                            this.props.rewardStore.rewardData[
                              RewardManager.RewardKeys.WaterIntake
                            ].points !== 0
                          ) {
                            this.rewardPoints[
                              RewardManager.RewardKeys.AddPoint
                            ] = 0;
                            this.rewardPoints[
                              RewardManager.RewardKeys.Reward
                            ] = 0;
                          }

                          const variables = {
                            waterIntake: finalWaterIntake,
                            date,
                            waterIntakeUnit: this.waterIntakeUnit,
                            input: [
                              {
                                points: this.rewardPoints[
                                  RewardManager.RewardKeys.AddPoint
                                ],
                                date,
                                key: RewardManager.RewardKeys.WaterIntake,
                              },
                            ],
                          };

                          if (
                            this.rewardPoints[RewardManager.RewardKeys.Reward] >
                            0
                          ) {
                            variables.rewardPoints = this.rewardPoints[
                              RewardManager.RewardKeys.Reward
                            ];
                          }

                          if (badgeType) {
                            variables["badgeType"] = badgeType;
                          }

                          this.updateGamificationLogs();

                          addWaterIntake({
                            variables: variables,
                            optimisticResponse: {
                              __typename: "Mutation",
                              addWaterIntakeLog: {
                                __typename: "WaterIntakeLog",
                                date,
                                waterIntake,
                                waterIntakeUnit: this.waterIntakeUnit,
                                badgeType,
                                rewardPoints: 0,
                              },
                            },
                          });
                        }
                      } else {
                        this.isInputEnabled = true;
                        Alert.alert(
                          "No Internet Connection",
                          "It seems there is some problem with your internet connection. Please check and try again."
                        );
                      }
                    });
                  }}
                  style={{
                    marginTop: 80,
                    marginLeft: 20,
                    marginRight: 20,
                    width: Dimensions.get("window").width - 40,
                  }}
                />
              );
            }}
          </Mutation>

          <TouchableOpacity
            style={{ marginTop: 18 }}
            onPress={() => {
              this.props.navigation.goBack();
            }}
          >
            <Text style={styles.discardButtonStyle}>Discard</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

function WaterLevelComponent({
  values,
  onSelectingWaterLevel,
  waterLevelUnit,
}) {
  return values.map((waterLevel, index) => (
    <TouchableOpacity
      style={styles.quickAddOptionStyle}
      onPress={() => {
        onSelectingWaterLevel(waterLevel.value, index);
      }}
      key={waterLevel}
    >
      <Image
        source={waterLevel.icon}
        style={{
          width: waterLevel.iconWidth,
          height: waterLevel.iconHeight,
          marginTop: waterLevel.topMargin,
        }}
      />
      <Text style={styles.waterLevelValue}>
        {waterLevel.value} {waterLevelUnit}
      </Text>
    </TouchableOpacity>
  ));
}
