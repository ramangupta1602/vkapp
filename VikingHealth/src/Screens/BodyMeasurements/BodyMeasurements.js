import React, { Component } from "react";
import {
  View,
  Image,
  TouchableWithoutFeedback,
  Dimensions,
  Modal,
  Platform,
  Animated,
  Easing,
  StyleSheet,
} from "react-native";
import { styles } from "./Styles";
import { strings } from "../../utility/locales/i18n";
import { BottomView } from "./BottomView";
import { MeasurementsRight } from "./MeasurementsRight";
import AppUtil from "Library/Utils/AppUtil";
import {
  BackButton,
  PageInfo,
  DateTitlePicker,
  ProgressBarButton,
} from "Components";
import { MeasurementsLeft } from "./MeasurementsLeft";
import { BodyMeasurementHelp } from "./bodymeasurementhelp/BodyMeasurementHelp";
import Video from "react-native-video";
import * as MeasurementMetaData from "./BodyMeasurementAnimationData.json";
import * as BodyMeasurementQueries from "AppSyncQueries/BodyMeasurementQueries";
import { Mutation } from "react-apollo";
import moment from "moment";
import * as DateUtil from "../../Library/Utils/DateUtil";
import { HeightWeightUtil } from "Library/Utils/HeightWeightUtil";
import { R } from "../../Resources/R";
import { LocalNotification } from "Components";
import { CancelNotification } from "Components";
import { API_DATE_FORMAT } from "Library/Constants";
import { inject, observer } from "mobx-react";
import { from } from "zen-observable";
import { ButtonState } from "Components/CTAButton/ButtonState";
// import { Sentry } from "react-native-sentry";
import { checkInternetConnection } from "react-native-offline";
import { RewardKeys, validateUserForReward } from "../Reward/RewardManager";
import { RewardPointsConstant } from "../Reward/RewardData";
import { BodyMeasurementModel } from "../../Library/Models/BodyMeasurementModel";
import * as WtHRData from "../../Screens/BodyMeasurementsDetails/WtHRData";
import * as RewardManager from "../Reward/RewardManager";
import { Gamification } from "./../../utility/constants/Constants";
import LottieView from "lottie-react-native";
import {
  LottieAnimationInterpolationRange,
  AnimationInput,
} from "../Journey/BodyMeasurementSummary/ConfigData";


const { width, height } = Dimensions.get("window");

const AnimationDataIndex = [
  0.9,
  AnimationInput.NeckUnwinding,
  AnimationInput.ShoulderUnwinding,
  AnimationInput.ChestUnwinding,
  AnimationInput.ArmsUnwinding,
  AnimationInput.WaistUnwinding,
  AnimationInput.HipsUnwinding,
  AnimationInput.ThighsUnwinding,
  AnimationInput.CalfUnwinding - 0.3, // to stop a unwinding at the end
];

@inject(
  "userAccountStore",
  "loginUserStore",
  "rewardStore",
  "gamificationStore"
)
@observer
export class BodyMeasurements extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.getParams();
    this.localNotification = new LocalNotification();
    this.CancelNotification = new CancelNotification();

    this.defaultNeck = 0;
    this.defaultShoulder = 0;
    this.defaultChest = 0;
    this.defaultArms = 0;
    this.defaultWaist = 0;
    this.defaultHips = 0;
    this.defaultThighs = 0;
    this.defaultCalf = 0;
    let measurementUnit = 0;
    let currentStep = 0;

    this.canAddRewardPoint = this.props.navigation.getParam(
      "canAddRewardPoint",
      true
    );

    this.isDataUnavailable = this.props.navigation.getParam(
      "isDataUnavailable",
      false
    );

    let bodyMeasurement;

    if (this.lastMeasurementLog) {
      bodyMeasurement = this.lastMeasurementLog;
    } else if (
      this.lastMeasurementLog == null &&
      this.isComingFromNotification === true
    ) {
      bodyMeasurement = this.props.userAccountStore.lastLoggedBodyMeasurement;
    } else if (this.selectedBodyMeasurement) {
      bodyMeasurement = this.selectedBodyMeasurement;
      currentStep = 9;
    }

    if (bodyMeasurement) {
      this.defaultNeck = bodyMeasurement.neck;
      this.defaultShoulder = bodyMeasurement.shoulder;
      this.defaultChest = bodyMeasurement.chest;
      this.defaultArms = bodyMeasurement.arms;
      this.defaultWaist = bodyMeasurement.waist;
      this.defaultHips = bodyMeasurement.hips;
      this.defaultThighs = bodyMeasurement.thighs;
      this.defaultCalf = bodyMeasurement.calf;
      measurementUnit = bodyMeasurement.unit;

      this.convertValueAccordingToUnit(measurementUnit);
    } else {
      const inchUnit = HeightWeightUtil.HEIGHT_IN;
      this.defaultNeck = this.unit === inchUnit ? 15 : 38.0;
      this.defaultShoulder = this.unit === inchUnit ? 40 : 101.5;
      this.defaultChest = this.unit === inchUnit ? 40 : 101.5;
      this.defaultArms = this.unit === inchUnit ? 12 : 30.5;
      this.defaultWaist = this.unit === inchUnit ? 33 : 84.0;
      this.defaultHips = this.unit === inchUnit ? 40 : 101.5;
      this.defaultThighs = this.unit === inchUnit ? 22 : 56.0;
      this.defaultCalf = this.unit === inchUnit ? 15 : 38.0;
      measurementUnit = this.unit;
    }

    this.state = {
      currentStep: currentStep,
      neck: this.defaultNeck,
      shoulder: this.defaultShoulder,
      chest: this.defaultChest,
      arms: this.defaultArms,
      waist: this.defaultWaist,
      hips: this.defaultHips,
      thighs: this.defaultThighs,
      calf: this.defaultCalf,
      isBodyMeasurementHelpVisible: false,
      date: this.date,
      measurementUnit,
      animationProgress: new Animated.Value(0.8), // because starting few frames of the animation contain white screen therefore initial state of the animation will have some offset
    };

    this.isInputEnabled = true;
  }

  convertValueAccordingToUnit = (measurementUnit) => {
    if (this.unit === measurementUnit) {
      return;
    }

    // if display unit is in inch, then record will be in cm, to convert from cm to inch
    if (this.unit === HeightWeightUtil.HEIGHT_IN) {
      this.defaultNeck = this.convertToInch(this.defaultNeck);
      this.defaultShoulder = this.convertToInch(this.defaultShoulder);
      this.defaultChest = this.convertToInch(this.defaultChest);
      this.defaultArms = this.convertToInch(this.defaultArms);
      this.defaultWaist = this.convertToInch(this.defaultWaist);
      this.defaultHips = this.convertToInch(this.defaultHips);
      this.defaultThighs = this.convertToInch(this.defaultThighs);
      this.defaultCalf = this.convertToInch(this.defaultCalf);
    } else {
      this.defaultNeck = this.convertToCM(this.defaultNeck);
      this.defaultShoulder = this.convertToCM(this.defaultShoulder);
      this.defaultChest = this.convertToCM(this.defaultChest);
      this.defaultArms = this.convertToCM(this.defaultArms);
      this.defaultWaist = this.convertToCM(this.defaultWaist);
      this.defaultHips = this.convertToCM(this.defaultHips);
      this.defaultThighs = this.convertToCM(this.defaultThighs);
      this.defaultCalf = this.convertToCM(this.defaultCalf);
    }
  };

  convertToInch = (value) => {
    return parseFloat(HeightWeightUtil.inchValue(value).toFixed(2));
  };

  convertToCM = (value) => {
    return parseFloat(HeightWeightUtil.cmValue(value).toFixed(2));
  };

  getParams() {
    this.shouldShowPageInfo = this.props.navigation.getParam(
      "isStepTextShown",
      false
    );
    this.weekCount = this.props.userAccountStore.weekInProgram();
    this.userId = this.props.userAccountStore.username;
    this.selectedBodyMeasurement = this.props.navigation.getParam(
      "selectedBodyMeasurement",
      null
    );
    this.unit = this.props.loginUserStore.displayHeightUnit;
    this.lastMeasurementLog = this.props.navigation.getParam(
      "lastBodyMeasurement"
    );
    this.isComingFromNotification = this.props.navigation.getParam(
      "isComingFromNotification",
      false
    );
    this.date = this.props.navigation.getParam(
      "date",
      moment().format(API_DATE_FORMAT)
    );
  }

  onDateChanged(displayDate, date) {
    const formattedDate = moment(date).format(API_DATE_FORMAT);
    this.setState({ date: formattedDate });
  }

  isUserValidForReward = () => {
    const endProgramDate = this.props.userAccountStore.programEndDate;
    const startProgramDate = this.props.userAccountStore.startDate;
    const {
      rewardData: {
        total: totalRewardPoints,
        [RewardKeys.HasRedeemedForCurrentCycle]: hasRedeemed,
      },
    } = this.props.rewardStore;

    const validRewardUser = validateUserForReward(
      startProgramDate,
      endProgramDate,
      hasRedeemed,
      totalRewardPoints
    );

    return validRewardUser;
  };

  verifyCanAddRewardPoint = () => {
    const isInternetOffAfterLogin =
      this.isDataUnavailable &&
      this.props.rewardStore.rewardData[
        RewardManager.RewardKeys.BodyMeasurement
      ].points !== 0;
    const validRewardUser = this.isUserValidForReward();
    const isCurrentDate = DateUtil.isAbsoluteToday(this.state.date);

    return (
      this.canAddRewardPoint &&
      validRewardUser &&
      isCurrentDate &&
      !isInternetOffAfterLogin
    );
  };

  dataSaved = () => {
    const tomorrow = moment(new Date()).add(7, "days");
    const newdate = DateUtil.getDate(tomorrow);
    const endProgramDate = this.props.userAccountStore.programEndDate;
    const startProgramDate = this.props.userAccountStore.startDate;

    // this is done to reset the notifications each time a body measurement is updated successfully.
    // We cancel all the previous notifications and then set the new weekly ones after the date of updation.
    this.CancelNotification.disableLocalNotificationBodyMeasurement();
    this.localNotification.scheduleBodyMeasurementLocalNotification();

    this.localNotification.checkNewDateForProverbs(
      newdate,
      startProgramDate,
      endProgramDate
    );

    if (moment(endProgramDate).diff(moment(newdate), "days") <= 0) {
      this.CancelNotification.disableLocalNotificationBodyMeasurement();
    }

    if (this.wthrReward.input.length > 0) {
      this.props.rewardStore.setRewardForKey(this.wthrReward.input);
    }

    // if user has lost any wthr class..
    if (this.wthrReward.total > 0) {
      this.props.gamificationStore.setShowModalFlag(
        true,
        Gamification.RewardModal.WtHRModal
      );

      this.props.rewardStore.setPopupData({
        currentPopupValue: this.wthrReward.currentWtHR,
        previousPopupValue: this.wthrReward.initialWthR,
        popupMeasurementUnit: "",
        weightPercentageLoss:
          this.wthrReward.initialClass.index -
          this.wthrReward.currentClass.index,
        points: this.wthrReward.total,
      });
    } else {
      this.props.rewardStore.updateConfettiForBodymeasurement(
        this.data.rewardPoints
      );
    }

    if (this.props.navigation.getParam("isStepTextShown")) {
      this.props.navigation.navigate("DaysPerformance", {
        isStepTextShown: true,
        userId: this.userId,
      });
    } else {
      this.props.navigation.goBack();
    }
  };

  startButtonPressed() {
    const value = this.state.currentStep + 1;
    this.animateToValue(value);
    this.measurementUpdated(value, true);
  }

  whenNextButtonPressed(measure) {
    const finalMeasurement = measure;
    this.setMeasurementValue(finalMeasurement, this.state.currentStep);
    const value = this.state.currentStep + 1;
    this.animateToValue(value);
    this.measurementUpdated(value, true);
  }

  whenPreviousButtonPressed(measure) {
    if (this.state.currentStep === 1) {
      return;
    }

    const finalMeasurement = measure;
    this.setMeasurementValue(finalMeasurement, this.state.currentStep);
    const value = this.state.currentStep - 1;

    this.animateToValue(value);
    this.measurementUpdated(value, false);
  }

  measurementUpdated(value, isNext, animated = true) {
    if (value > 8 || value <= 0) {
      this.setState({
        currentStep: value,
      });

      return;
    }

    if (animated) {
      this.setState({
        currentStep: value,
      });
    } else {
      this.setState({
        currentStep: value,
      });
    }
  }

  setMeasurementValue(value, index) {
    switch (index) {
      case 1:
        this.setState({ neck: value });
        break;
      case 2:
        this.setState({ shoulder: value });
        break;
      case 3:
        this.setState({ chest: value });
        break;
      case 4:
        this.setState({ arms: value });
        break;
      case 5:
        this.setState({ waist: value });
        break;
      case 6:
        this.setState({ hips: value });
        break;
      case 7:
        this.setState({ thighs: value });
        break;
      case 8:
        this.setState({ calf: value });
        break;
    }
  }

  valueForMeasurement(step) {
    switch (step) {
      case 1:
        return this.state.neck;
        break;
      case 2:
        return this.state.shoulder;
        break;
      case 3:
        return this.state.chest;
        break;
      case 4:
        return this.state.arms;
        break;
      case 5:
        return this.state.waist;
        break;
      case 6:
        return this.state.hips;
        break;
      case 7:
        return this.state.thighs;
        break;
      case 8:
        return this.state.calf;
        break;
    }
  }

  whenMeasurementClicked(index) {
    this.state.animationProgress.setValue(AnimationDataIndex[index + 1]);
    this.measurementUpdated(index + 1, false, false);
  }

  updateCacheLastBodyMeasurement(proxy, bodyMeasurement) {
    const query = BodyMeasurementQueries.LastRecordedBodyMeasurement;
    const queryVariables = { userId: this.userId };
    try {
      const data = proxy.readQuery({
        query: query,
        variables: queryVariables,
      });
      if (data.lastBodyMeasurement) {
        if (
          !moment(data.lastBodyMeasurement.date).isAfter(
            moment(bodyMeasurement.date)
          )
        ) {
          data.lastBodyMeasurement = bodyMeasurement;
        }
      } else {
        data.lastBodyMeasurement = bodyMeasurement;
      }
      proxy.writeQuery({
        query: query,
        variables: queryVariables,
        data,
      });
      this.props.userAccountStore.setLastLoggedBM(bodyMeasurement);
    } catch (e) {
      console.log("EXCEPTION isLastWeightQueryAvailable: ", e.message);
    }
  }

  updateCacheBodyMeasurementLogList(proxy, bodyMeasurement, fromDate, toDate) {
    const query = BodyMeasurementQueries.GetBodyMeasurementData;
    const queryVariables = {
      userId: this.userId,
      fromDate,
      toDate,
    };

    try {
      let data = proxy.readQuery({
        query: query,
        variables: queryVariables,
      });

      if (data.bodyMeasurements) {
        const dateToUpdate = bodyMeasurement.date;
        const index = data.bodyMeasurements.findIndex(
          (log) => log.date === dateToUpdate
        );
        if (index >= 0) {
          data.bodyMeasurements[index] = bodyMeasurement;
        } else {
          data.bodyMeasurements.push(bodyMeasurement);
          data.bodyMeasurements.sort((a, b) => moment(a.date) - moment(b.date));
        }

        proxy.writeQuery({
          query: query,
          variables: queryVariables,
          data,
        });
      }
    } catch (e) {
      console.log("EXCEPTION: ", e.message);
    }
  }

  updateBodyMeasurmentResults = (proxy, { data: { addBodyMeasurments } }) => {
    const programStartDate = this.props.userAccountStore.startDate;
    const programEndDate = this.props.userAccountStore.programEndDate;
    this.updateCacheLastBodyMeasurement(proxy, addBodyMeasurments);

    let weekRange = DateUtil.monthRangeFor(
      moment(),
      programStartDate,
      programEndDate
    );
    let fromDate = weekRange.begin.format(API_DATE_FORMAT);
    let toDate = weekRange.end.format(API_DATE_FORMAT);
    this.updateCacheBodyMeasurementLogList(
      proxy,
      addBodyMeasurments,
      fromDate,
      toDate
    );

    //const today = AppUtil.getCurrentDate();
    this.updateCacheBodyMeasurementLogList(
      proxy,
      addBodyMeasurments,
      programStartDate,
      programEndDate
    );
  };

  _bodyMeasurementObject = () => {
    const data = {
      date: this.state.date,
      userId: this.userId,
      unit: this.unit,
      neck: this.state.neck,
      shoulder: this.state.shoulder,
      chest: this.state.chest,
      arms: this.state.arms,
      waist: this.state.waist,
      hips: this.state.hips,
      thighs: this.state.thighs,
      calf: this.state.calf,
      week: this.props.userAccountStore.weekInProgramOnDate(this.state.date),
    };

    return data;
  };

  calculateWtHRClassLoss = (data, logDate, rewardSoFar) => {
    const isCurrentDate = DateUtil.isAbsoluteToday(logDate);
    let input = [];
    const gender = this.props.userAccountStore.gender;

    if (!isCurrentDate) {
      return { input: [], total: 0 };
    }

    if (!this.props.rewardStore.initialBodyMeasurementLog) {
      return { input, total: 0 };
    }

    const height = this.props.userAccountStore.cmHeight;

    const currentLog = new BodyMeasurementModel(data);
    const firstLog = new BodyMeasurementModel(
      this.props.rewardStore.initialBodyMeasurementLog
    );

    const initialWaist = firstLog.displayWaist(HeightWeightUtil.HEIGHT_CM);
    const finalWaist = currentLog.displayWaist(HeightWeightUtil.HEIGHT_CM);
    const initialWthR = AppUtil.getWaistToHeightRatio(initialWaist, height);
    const currentWtHR = AppUtil.getWaistToHeightRatio(finalWaist, height);

    const initialClass = WtHRData.getWtHRClass(initialWthR, gender);
    const currentClass = WtHRData.getWtHRClass(currentWtHR, gender);

    // classes are in reverse order.. so higher class = higher index
    const classLoss = initialClass.index - currentClass.index;

    if (classLoss <= 0) {
      return { input, total: 0 };
    }

    let rewardPoints = 0;

    if (
      classLoss >= 1 &&
      !this.props.rewardStore.hasAvailedRewardForKey(RewardKeys.WtHrClass1)
    ) {
      const reward = RewardManager.getRewardPointsAfterPointsValidation(
        rewardSoFar,
        50
      );

      rewardSoFar += reward;
      rewardPoints += reward;
      input.push({
        points: reward,
        date: logDate,
        key: RewardKeys.WtHrClass1,
      });
    }

    if (
      classLoss >= 2 &&
      !this.props.rewardStore.hasAvailedRewardForKey(RewardKeys.WtHrClass2)
    ) {
      const reward = RewardManager.getRewardPointsAfterPointsValidation(
        rewardSoFar,
        50
      );

      rewardSoFar += reward;
      rewardPoints += reward;
      input.push({
        points: reward,
        date: logDate,
        key: RewardKeys.WtHrClass2,
      });
    }

    return {
      input,
      total: rewardPoints,
      initialClass,
      currentClass,
      initialWthR,
      currentWtHR,
    };
  };

  dismissBodyMeasurementHelpModal = () => {
    this.setState({ isBodyMeasurementHelpVisible: false });
  };

  animateToValue = (toValue) => {
    const { animationProgress } = this.state;
    const animationValue = AnimationDataIndex[toValue];

    animationProgress.stopAnimation(() => {
      Animated.timing(animationProgress, {
        toValue: animationValue,
        duration: 1000,
        easing: Easing.linear,
      }).start();
    });
  };

  getAnimatedInterpolation = () => {
    const { animationProgress } = this.state;

    const animationInterpolation = animationProgress.interpolate(
      LottieAnimationInterpolationRange
    );

    return animationInterpolation;
  };

  getBottomMarginInterpolationForLottieView = () => {
    const marginInterpolation = this.state.animationProgress.interpolate({
      inputRange: [
        0,
        AnimationInput.NeckStart,
        AnimationInput.NeckRingCompleted,
      ],
      outputRange: [0, 0, 110],
      extrapolate: "clamp",
    });

    return {
      marginBottom: marginInterpolation,
    };
  };

  render() {
    const { currentStep } = this.state;

    const shouldShowAllMeasurement = currentStep > 8;
    let buttonLabel =
      currentStep > 8
        ? strings("common_message.done_caps")
        : strings("common_message.start_caps");

    const shouldShowCTAButton = currentStep == 0 || currentStep > 8;
    const shouldShowBottomView = !shouldShowCTAButton;
    const { startDate: programStartDate } = this.props.userAccountStore;
    const animationProgress = this.getAnimatedInterpolation();
    const lottieViewMargin = this.getBottomMarginInterpolationForLottieView();

    return (
      <View style={styles.container}>
        <BodyMeasurementHelpModal
          dismiss={this.dismissBodyMeasurementHelpModal}
          isBodyMeasurementHelpVisible={this.state.isBodyMeasurementHelpVisible}
        />
        <View style={[R.AppStyles.headerContainer, { marginBottom: 10 }]}>
          <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
            <BackButton navigation={this.props.navigation} />
            {this.shouldShowPageInfo ? (
              <PageInfo info={strings("body_measurement.step2outof3")} />
            ) : (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  zIndex: 10,
                  flex: 1,
                }}
              >
                <DateTitlePicker
                  style={{ marginTop: 11 }}
                  date={this.state.date}
                  preText="Update measurement of"
                  onDateChanged={this.onDateChanged.bind(this)}
                  programStartDate={programStartDate}
                />

                <View
                  style={{
                    marginTop: 10,
                    position: "absolute",
                    right: 0,
                    flexDirection: "row",
                    justifyContent: "flex-end",
                  }}
                >
                  <InfoIcon
                    onClick={() =>
                      this.setState({ isBodyMeasurementHelpVisible: true })
                    }
                  />
                </View>
              </View>
            )}
          </View>
        </View>

        <View style={[styles.measurementContainerView]}>
          {shouldShowAllMeasurement ? (
            <BodyMeasurementPlaceholders
              bodyMeasurement={this._bodyMeasurementObject()}
              whenMeasurementClicked={this.whenMeasurementClicked.bind(this)}
            />
          ) : (
            <Animated.View
              style={[
                {
                  flex: 1,
                  width: "100%",
                },
                lottieViewMargin,
              ]}
            >
              <View style={styles.concentricImageContainerStyle}>
                <Image
                  source={R.Images.ConcentricCircle}
                  style={styles.concentricImageStyle}
                  resizeMode="contain"
                />
              </View>
              <LottieView
                source={R.Animations.BODY}
                progress={animationProgress}
                style={[styles.video, { aspectRatio: 2, marginBottom: 0 }]}
                resizeMode="contain"
              />
            </Animated.View>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <Mutation
            mutation={BodyMeasurementQueries.AddBodyMeasurement}
            onError={(error) => {
              this.isInputEnabled = true;
            //   Sentry.captureMessage(error.message);
              Alert.alert(
                "Alert!",
                "We were not able to log your body measurements. Please try again later."
              );
            }}
            onCompleted={this.dataSaved}
            update={this.updateBodyMeasurmentResults}
            refetchQueries={["GetLastRecordedLog"]}
          >
            {(addBodyMeasurments, { loading, error, data }) => {
              let buttonState = ButtonState.Idle;
              currentStep > 8
                ? (buttonLabel = strings("common_message.done_caps"))
                : (buttonLabel = strings("common_message.start_caps"));
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

                    if (this.state.currentStep === 9) {
                      this.isInputEnabled = false;

                      checkInternetConnection().then((isConnected) => {
                        if (isConnected === true) {
                          this.data = this._bodyMeasurementObject();

                          const validRewardUser = this.isUserValidForReward();
                          const canAddRewardPoint = this.verifyCanAddRewardPoint();

                          const {
                            rewardData: { total: totalRewardFromStore },
                          } = this.props.rewardStore;

                          let rewardSoFar = totalRewardFromStore;

                          if (canAddRewardPoint) {
                            this.data.rewardPoints = RewardManager.getRewardPointsAfterPointsValidation(
                              rewardSoFar,
                              RewardPointsConstant.BmChartingMax
                            );

                            rewardSoFar += this.data.rewardPoints;
                          }

                          if (validRewardUser) {
                            this.wthrReward = this.calculateWtHRClassLoss(
                              this.data,
                              this.state.date,
                              rewardSoFar
                            );
                            this.data.input = this.wthrReward.input;
                          } else {
                            this.wthrReward = { input: [], total: 0 };
                          }

                          if (this.data.rewardPoints) {
                            this.data.input.push({
                              points: this.data.rewardPoints,
                              date: this.state.date,
                              key: RewardManager.RewardKeys.BodyMeasurement,
                            });
                          }

                          addBodyMeasurments({
                            variables: this.data,
                          });
                        } else {
                          this.isInputEnabled = true;

                          Alert.alert(
                            "No Internet Connection",
                            "It seems there is some problem with your internet connection. Please check and try again."
                          );
                        }
                      });
                    } else {
                      this.startButtonPressed();
                    }
                  }}
                />
              );
            }}
          </Mutation>
        </View>

        {shouldShowBottomView && (
          <BottomView
            value={this.valueForMeasurement(this.state.currentStep)}
            step={this.state.currentStep}
            onNextClick={this.whenNextButtonPressed.bind(this)}
            onPreviousClick={this.whenPreviousButtonPressed.bind(this)}
            unit={this.unit}
          />
        )}
      </View>
    );
  }
}

const InfoIcon = (props) => (
  <TouchableWithoutFeedback onPress={props.onClick}>
    <Image style={{ width: 20, height: 20 }} source={R.Images.info} />
  </TouchableWithoutFeedback>
);

const BodyMeasurementPlaceholders = (props) => {
  const bodyMeasurement = props.bodyMeasurement;
  const unit = HeightWeightUtil.heightUnit(bodyMeasurement.unit);
  let horizontalMargin = width < 380 ? 0 : 0;

  return (
    <React.Fragment>
      <Image
        style={[styles.bodyBackground, { resizeMode: "contain" }]}
        source={R.Images.bodyBackGround}
      />

      <MeasurementsLeft
        style={{ top: "8.7%", left: 50, position: "absolute" }}
        onClick={props.whenMeasurementClicked}
        measurementIndex={0}
        measurement={bodyMeasurement.neck}
        lineWidth={70}
        unit={unit}
      />
      <MeasurementsRight
        style={{
          top: "14.8%",
          right: horizontalMargin,
          position: "absolute",
        }}
        onClick={props.whenMeasurementClicked}
        measurementIndex={1}
        measurement={bodyMeasurement.shoulder}
        lineWidth={65}
        unit={unit}
      />
      <MeasurementsLeft
        style={{ top: "23%", left: horizontalMargin, position: "absolute" }}
        onClick={props.whenMeasurementClicked}
        measurementIndex={2}
        measurement={bodyMeasurement.chest}
        lineWidth={70}
        unit={unit}
      />
      <MeasurementsRight
        style={{ top: "25%", right: horizontalMargin, position: "absolute" }}
        onClick={props.whenMeasurementClicked}
        measurementIndex={3}
        measurement={bodyMeasurement.arms}
        lineWidth={62}
        unit={unit}
      />
      <MeasurementsLeft
        style={{ top: "30%", left: horizontalMargin, position: "absolute" }}
        onClick={props.whenMeasurementClicked}
        measurementIndex={4}
        measurement={bodyMeasurement.waist}
        lineWidth={90}
        unit={unit}
      />
      <MeasurementsLeft
        style={{ top: "40%", left: horizontalMargin, position: "absolute" }}
        onClick={props.whenMeasurementClicked}
        measurementIndex={5}
        measurement={bodyMeasurement.hips}
        lineWidth={70}
        unit={unit}
      />
      <MeasurementsRight
        style={{ top: "53%", right: horizontalMargin, position: "absolute" }}
        onClick={props.whenMeasurementClicked}
        measurementIndex={6}
        measurement={bodyMeasurement.thighs}
        lineWidth={70}
        unit={unit}
      />
      <MeasurementsRight
        style={{ top: "76%", right: horizontalMargin, position: "absolute" }}
        onClick={props.whenMeasurementClicked}
        measurementIndex={7}
        measurement={bodyMeasurement.calf}
        lineWidth={45}
        unit={unit}
      />
      <View style={{ width: "100%", height: "100%" }} pointerEvents="none">
        <Image
          style={[styles.bodyPosition, { resizeMode: "contain" }]}
          source={R.Images.bodyMeasurement}
        />
      </View>
    </React.Fragment>
  );
};

const BodyMeasurementHelpModal = (props) => (
  <Modal
    animationType="slide"
    transparent
    visible={props.isBodyMeasurementHelpVisible}
  >
    <BodyMeasurementHelp onCrossClicked={props.dismiss} />
  </Modal>
);
