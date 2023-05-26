import React, { Component } from "react";
import {
  View,
  Dimensions,
  Alert,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import { R } from "Resources";
import {
  BackButton,
  PageTitle,
  SubTitle,
  PageInfo,
  Ruler,
  DateTitlePicker,
  ProgressBarButton,
} from "Components";
import { Analytics } from "aws-amplify";
import { styles } from "./Styles";
import { strings } from "../../utility/locales/i18n";
import * as WeightLogQueries from "AppSyncQueries/WeightLogQueries";
import { Mutation } from "react-apollo";
import moment from "moment";
import * as DateUtil from "../../Library/Utils/DateUtil";
import { CancelNotification } from "Components";
import { LocalNotification } from "Components";
import { inject, observer } from "mobx-react";
import AppUtil from "Library/Utils/AppUtil";
import { API_DATE_FORMAT } from "Library/Constants";
import { ButtonState } from "Components/CTAButton/ButtonState";
// import { Sentry } from "react-native-sentry";
import { checkInternetConnection } from "react-native-offline";
import { WeightLog } from "../../Library/Models/WeightLogModel";
import { HeightWeightUtil } from "../../Library/Utils/HeightWeightUtil";
import * as RewardManager from "../Reward/RewardManager";
import { Gamification } from "./../../utility/constants/Constants";

@observer
@inject(
  "userAccountStore",
  "loginUserStore",
  "rewardStore",
  "gamificationStore"
)
export class LogWeight extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    //should call in same sequence
    this.getParams();
    this.setDefaultWeight();
    this.setHeader();
    this.state = {
      weight: this.defaultWeight,
      date: this.date,
    };
    this.localNotification = new LocalNotification();
    this.CancelNotification = new CancelNotification();

    this.initialWeightLog = this.props.rewardStore.initialWeightLog;

    this.isInputEnabled = true;
  }

  getParams() {
    this.shouldShowPageInfo = this.props.navigation.getParam(
      "isStepTextShown",
      false
    );
    this.rulerWidth = Dimensions.get("window").width;
    this.weightUnit = this.props.loginUserStore.displayWeightUnit
      ? this.props.loginUserStore.displayWeightUnit
      : 0;
    this.userId = this.props.userAccountStore.username;
    this.lastWeightLog = this.props.navigation.getParam("lastWeightLog", null);
    this.selectedWeight = this.props.navigation.getParam("weight", null);
    this.isComingFromNotification = this.props.navigation.getParam(
      "isComingFromNotification",
      false
    );
    this.date = this.props.navigation.getParam(
      "date",
      moment().format(API_DATE_FORMAT)
    );
  }

  setDefaultWeight() {
    if (this.selectedWeight) {
      this.defaultWeight = this.selectedWeight;
    } else if (this.lastWeightLog != null) {
      this.defaultWeight = this.lastWeightLog.displayWeight(this.weightUnit);
    } else if (
      this.lastWeightLog == null &&
      this.isComingFromNotification === true
    ) {
      this.lastWeightLog = new WeightLog(
        this.props.userAccountStore.lastLoggedWeight,
        null,
        this.props.userAccountStore.lastLoggedWeightUnit
      );
      // this condition is to take care of the fact, when the user is entirely new and he has not logged
      // in any weight till now and he starts to receive notifications, then he should be redirected to the weight screen
      // with the proper default weight like 70 or 150 based on the units.
      if (this.lastWeightLog.weight == null) {
        this.defaultWeight = this.weightUnit === 1 ? 150 : 70;
      } else {
        this.defaultWeight = this.lastWeightLog.displayWeight(this.weightUnit);
      }
    } else if (this.weightUnit === 1) {
      this.defaultWeight = 150;
    } else {
      this.defaultWeight = 70;
    }
  }

  setHeader() {
    if (this.shouldShowPageInfo) {
      this.buttonText = strings("common_message.next_text");
      this.title = strings("log_weight.add_your_weight");
    } else if (this.selectedWeight) {
      this.title = strings("log_weight.edit_your_weight");
      this.buttonText = strings("profile.update");
    } else {
      this.title = strings("log_weight.add_your_weight");
      this.buttonText = strings("common_message.done_caps");
    }
  }

  weightUpdated(value) {
    this.setState({ weight: value });
  }

  weightLogSaved = () => {
    const tomorrow = moment(new Date()).add(1, "days");
    const newdate = DateUtil.getDate(tomorrow);
    const endProgramDate = this.props.userAccountStore.programEndDate;
    const startProgramDate = this.props.userAccountStore.programStartDate;

    this.props.rewardStore.setRewardForKey(this.reward.input);

    if (this.reward.popupData) {
      this.props.rewardStore.setPopupData(this.reward.popupData);
      this.props.gamificationStore.setShowModalFlag(
        true,
        this.reward.popupData.name
      );
    }

    if (moment(endProgramDate).diff(moment(newdate), "days") <= 0) {
      this.CancelNotification.disableLocalNotificationWeight();
    }
    this.localNotification.checkNewDateForProverbs(
      newdate,
      startProgramDate,
      endProgramDate
    );

    if (this.shouldShowPageInfo) {
      this.props.navigation.navigate("BodyMeasurements", {
        isStepTextShown: true,
        userId: this.userId,
      });
    } else {
      this.props.navigation.goBack();
    }
  };

  updateCacheLastRecordedWeightLog(proxy, weightLog) {
    const query = WeightLogQueries.LastRecordedWeight;
    const queryVariables = { userId: this.userId };
    let data;
    try {
      data = proxy.readQuery({
        query,
        variables: queryVariables,
      });
      if (data.lastWeightLog) {
        if (!moment(data.lastWeightLog.date).isAfter(moment(weightLog.date))) {
          data.lastWeightLog = weightLog;
        }
      } else {
        data.lastWeightLog = weightLog;
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

  updateCacheLastAndInitialWeightLogs(proxy, weightLog) {
    const query = WeightLogQueries.WeightLogsForPatients;
    const queryVariables = { userId: this.userId };

    try {
      let data = proxy.readQuery({
        query,
        variables: queryVariables,
      });
      if (data.initialWeightLog) {
        if (data.initialWeightLog.date == weightLog.date) {
          data.initialWeightLog = weightLog;
        }
      } else {
        data.initialWeightLog = weightLog;
      }

      if (data.lastWeightLog) {
        if (data.lastWeightLog.date === weightLog.date) {
          data.lastWeightLog = weightLog;
        }
      } else {
        data.lastWeightLog = weightLog;
      }
      proxy.writeQuery({
        query,
        variables: queryVariables,
        data,
      });
    } catch (e) {
      console.log(
        "EXCEPTION isWeightLogsForPatientsQueryAvailable: ",
        e.message
      );
    }
  }

  updateCacheWeightLogList(proxy, weightLog, fromDate, toDate) {
    const query = WeightLogQueries.GetWeightLogs;
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

      if (data.weightLogs) {
        const dateToUpdate = weightLog.date;
        const index = data.weightLogs.findIndex(
          (log) => log.date === dateToUpdate
        );
        if (index >= 0) {
          data.weightLogs[index] = weightLog;
        } else {
          data.weightLogs.push(weightLog);
          data.weightLogs.sort((a, b) => moment(a.date) - moment(b.date));
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

  updateLogWeightResult = (proxy, { data: { addWeightLog } }) => {
    if (!addWeightLog) return;
    this.updateCacheLastRecordedWeightLog(proxy, addWeightLog);
    this.updateCacheLastAndInitialWeightLogs(proxy, addWeightLog);

    const weekRange = DateUtil.weekRangeFor(addWeightLog.date);
    const fromDate = weekRange.begin.format(API_DATE_FORMAT);
    const toDate = weekRange.end.format(API_DATE_FORMAT);
    this.updateCacheWeightLogList(proxy, addWeightLog, fromDate, toDate);

    const programStartDate = this.props.userAccountStore.startDate;
    const programEndDate = this.props.userAccountStore.programEndDate;
    this.updateCacheWeightLogList(
      proxy,
      addWeightLog,
      programStartDate,
      programEndDate
    );
  };

  onDateChanged(displayDate, date) {
    const formattedDate = moment(date).format(API_DATE_FORMAT);
    this.setState({ date: formattedDate });
  }

  calculateReward({
    weightLoss,
    bmiClassLoss,
    validateReward,
    weight,
    initialWeight,
    current,
    initialClass,
    finalClass,
    initialBmi,
    finalBmi,
  }) {
    var input = [];
    var totalReward = 0;

    const {
      rewardData: { total: totalRewardFromStore },
    } = this.props.rewardStore;

    let rewardSoFar = totalRewardFromStore;

    if (!validateReward) {
      return { input: [], totalReward: 0 };
    }

    const {
      input: inputFromWeightLoss,
      total: totalFromWeightLoss,
      popUpData: popUpDataWeightLoss,
    } = this.calculateRewardForWeightLoss(
      weightLoss,
      weight,
      initialWeight,
      current,
      rewardSoFar
    );

    rewardSoFar += totalFromWeightLoss;

    const {
      input: inputFromBmiLoss,
      popUpData: popUpDataFromBmi,
    } = this.calculateRewardForBmiClassLoss(
      bmiClassLoss,
      initialClass,
      finalClass,
      initialBmi,
      finalBmi,
      rewardSoFar
    );

    input = [...inputFromWeightLoss, ...inputFromBmiLoss];

    input.forEach((item) => {
      totalReward += item.points;
    });

    return {
      input,
      totalReward,
      popupData: popUpDataFromBmi ?? popUpDataWeightLoss,
    };
  }

  calculateRewardForWeightLoss(
    weightLoss,
    weight,
    initialWeight,
    current,
    totalReward
  ) {
    const { rewardStore } = this.props;
    const date = DateUtil.formattedTodayDate();
    let total = 0;
    let popUpData = null;
    var input = [];

    let rewardSoFar = totalReward;

    if (
      weightLoss >= 5 &&
      !rewardStore.hasAvailedRewardForKey(RewardManager.RewardKeys.WeightLoss5)
    ) {
      const reward = RewardManager.getRewardPointsAfterPointsValidation(
        rewardSoFar,
        50
      );

      rewardSoFar += reward;
      total += reward;
      input.push({
        points: reward,
        date: date,
        key: RewardManager.RewardKeys.WeightLoss5,
      });
    }

    if (
      weightLoss >= 10 &&
      !rewardStore.hasAvailedRewardForKey(RewardManager.RewardKeys.WeightLoss10)
    ) {
      const reward = RewardManager.getRewardPointsAfterPointsValidation(
        rewardSoFar,
        50
      );

      rewardSoFar += reward;
      total += reward;
      input.push({
        points: reward,
        date: date,
        key: RewardManager.RewardKeys.WeightLoss10,
      });
    }

    if (
      weightLoss >= 15 &&
      !rewardStore.hasAvailedRewardForKey(RewardManager.RewardKeys.WeightLoss15)
    ) {
      const reward = RewardManager.getRewardPointsAfterPointsValidation(
        rewardSoFar,
        50
      );

      rewardSoFar += reward;
      total += reward;
      input.push({
        points: reward,
        date: date,
        key: RewardManager.RewardKeys.WeightLoss15,
      });
    }

    if (
      weightLoss >= 20 &&
      !rewardStore.hasAvailedRewardForKey(RewardManager.RewardKeys.WeightLoss20)
    ) {
      const reward = RewardManager.getRewardPointsAfterPointsValidation(
        rewardSoFar,
        50
      );

      rewardSoFar += reward;
      total += reward;
      input.push({
        points: reward,
        date: date,
        key: RewardManager.RewardKeys.WeightLoss20,
      });
    }

    if (total > 0) {
      popUpData = {
        currentPopupValue: current,
        previousPopupValue: initialWeight,
        popupMeasurementUnit: this.weightUnit,
        weightPercentageLoss: weightLoss,
        points: total,
        name: Gamification.RewardModal.WeightLossModal,
      };
    }

    return { input, popUpData, total };
  }

  calculateRewardForBmiClassLoss(
    bmiClassLoss,
    initialClass,
    finalClass,
    initialBmi,
    finalBmi,
    totalReward
  ) {
    const { rewardStore } = this.props;
    const date = DateUtil.formattedTodayDate();
    let total = 0;
    let popUpData = null;
    var input = [];

    let rewardSoFar = totalReward;

    if (
      bmiClassLoss >= 1 &&
      !rewardStore.hasAvailedRewardForKey(RewardManager.RewardKeys.BMClass1)
    ) {
      const reward = RewardManager.getRewardPointsAfterPointsValidation(
        rewardSoFar,
        50
      );

      rewardSoFar += reward;
      total += reward;
      input.push({
        points: reward,
        date: date,
        key: RewardManager.RewardKeys.BMClass1,
      });
    }

    if (
      bmiClassLoss >= 2 &&
      !rewardStore.hasAvailedRewardForKey(RewardManager.RewardKeys.BMClass2)
    ) {
      const reward = RewardManager.getRewardPointsAfterPointsValidation(
        rewardSoFar,
        50
      );

      rewardSoFar += reward;
      total += reward;
      input.push({
        points: reward,
        date: date,
        key: RewardManager.RewardKeys.BMClass2,
      });
    }

    if (total) {
      popUpData = {
        currentPopupValue: finalBmi,
        previousPopupValue: initialBmi,
        popupMeasurementUnit: initialClass,
        weightPercentageLoss: initialClass - finalClass,
        points: total,
        name: Gamification.RewardModal.BMIModal,
      };
    }

    return { input, popUpData };
  }

  render() {
    const {
      startDate: programStartDate,
      cmHeight,
      programEndDate,
    } = this.props.userAccountStore;

    const {
      rewardData: {
        total: totalReward,
        [RewardManager.RewardKeys.HasRedeemedForCurrentCycle]: hasRedeemed,
      },
    } = this.props.rewardStore;

    return (
      <TouchableWithoutFeedback
        style={styles.container}
        onPress={() => {
          Keyboard.dismiss();
        }}>
        <View style={styles.container}>
          <View style={R.AppStyles.headerContainer}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}>
              <BackButton navigation={this.props.navigation} />
              {this.shouldShowPageInfo && (
                <PageInfo info={strings("log_weight.step1outof3")} />
              )}
              {this.selectedWeight && (
                <DateTitlePicker
                  date={this.state.date}
                  preText="Update logs of"
                  onDateChanged={this.onDateChanged.bind(this)}
                  programStartDate={programStartDate}
                />
              )}
            </View>
            <PageTitle title={this.title} />
            {!this.selectedWeight && (
              <SubTitle subTitle={strings("log_weight.add_weight_help_text")} />
            )}
          </View>

          <View style={{ justifyContent: "center", height: 140 }}>
            <Ruler
              unit={this.weightUnit}
              default={this.defaultWeight}
              width={this.rulerWidth}
              onValueUpdated={this.weightUpdated.bind(this)}
            />
          </View>

          <Mutation
            mutation={WeightLogQueries.AddWeightLog}
            refetchQueries={["GetLastRecordedLog"]}
            onError={(error) => {
              this.isInputEnabled = true;
            //   Sentry.captureMessage(error.message);
              Alert.alert(
                "Alert!",
                "We were not able to log your weight. Please try again later."
              );
            }}
            onCompleted={this.weightLogSaved}
            update={this.updateLogWeightResult}>
            {(addWeight, { loading }) => {
              let buttonState = ButtonState.Idle;
              let buttonLabel = "DONE";
              if (loading) {
                buttonState = ButtonState.Progress;
                buttonLabel = "";
              }
              return (
                <KeyboardAvoidingView
                  style={[styles.container, { flex: 1, marginTop: 20 }]}
                  enabled
                  behavior={Platform.OS === "ios" ? "padding" : "margin"}>
                  <View style={styles.buttonContainer}>
                    <ProgressBarButton
                      disabled={loading}
                      label={buttonLabel}
                      buttonState={buttonState}
                      onClick={() => {
                        if (!this.isInputEnabled) {
                          return;
                        }

                        this.isInputEnabled = false;

                        if (this.state.weight.length === 0) {
                          Alert.alert("Error", "Please enter valid date");
                          return;
                        }

                        if (parseFloat(this.state.weight) < 0.5) {
                          Alert.alert("Error", "Please enter valid weight");
                          return;
                        }

                        checkInternetConnection().then((isConnected) => {
                          if (isConnected === true) {
                            const isHistoryData = !DateUtil.isAbsoluteToday(
                              this.state.date
                            );
                            const isTodayFirstEntry = DateUtil.isAbsoluteToday(
                              this.initialWeightLog
                                ? this.initialWeightLog.date
                                : null
                            );

                            const finalWeightLog = {
                              weight: parseFloat(this.state.weight),
                              weightUnit: this.weightUnit,
                              data: this.state.date,
                            };

                            const {
                              weightLoss,
                              initial,
                              current,
                            } = HeightWeightUtil.calculateWeightLoss(
                              this.initialWeightLog,
                              finalWeightLog
                            );

                            const {
                              bmiClassLoss,
                              initialClass,
                              finalClass,
                              initialBmi,
                              finalBmi,
                            } = HeightWeightUtil.calculateBMILoss(
                              this.initialWeightLog,
                              finalWeightLog,
                              cmHeight
                            );

                            const programDateCondition = RewardManager.validateUserForReward(
                              programStartDate,
                              programEndDate,
                              hasRedeemed,
                              totalReward
                            );

                            const validateReward =
                              programDateCondition &&
                              !isHistoryData &&
                              !isTodayFirstEntry;

                            this.reward = this.calculateReward({
                              weightLoss,
                              bmiClassLoss,
                              validateReward,
                              weight: this.state.weight,
                              initialWeight: initial,
                              current,
                              initialClass,
                              finalClass,
                              initialBmi,
                              finalBmi,
                            });

                            addWeight({
                              variables: {
                                weight: this.state.weight,
                                date: this.state.date,
                                weightUnit: this.weightUnit,
                                rewardPoints: this.reward.rewardPoints,
                                input: this.reward.input,
                              },
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
                </KeyboardAvoidingView>
              );
            }}
          </Mutation>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
