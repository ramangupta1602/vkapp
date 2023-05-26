import React, { Component } from "react";
import {
  View,
  Dimensions,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Keyboard,
  Animated,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { R } from "Resources";
import {
  BackButton,
  PageTitle,
  DateTitlePicker,
  ProgressBarButton,
} from "Components";
import moment from "moment";
import { styles } from "./../WaterIntakeLog/style";
import * as CalorieIntakeQuery from "AppSyncQueries/CaloricQueries";
import { Mutation } from "react-apollo";
import { Gamification } from "../../utility/constants/Constants";
import { inject, observer } from "mobx-react";
import { ButtonState } from "Components/CTAButton/ButtonState";
// import { Sentry } from "react-native-sentry";
import { checkInternetConnection } from "react-native-offline";
import * as DateUtil from "../../Library/Utils/DateUtil";
import * as RewardManager from "../../Screens/Reward/RewardManager";
import LottieView from "lottie-react-native";

@observer
@inject(
  "userAccountStore",
  "loginUserStore",
  "gamificationStore",
  "rewardStore"
)
export class LogCaloryIntake extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);

    const previousIntake = this.props.navigation.getParam("intake", 0);
    this.previousReward = this.props.navigation.getParam("rewardPoints", 0);

    this.rewardPoints = {
      [RewardManager.RewardKeys.Reward]: 0,
      [RewardManager.RewardKeys.AddPoint]: 0,
    };

    this.finalIntakeValue = 0;
    this.state = {
      currentLog: "0",
      previousIntake,
      animation: new Animated.Value(0),
    };
  }

  onButtonPress = (number) => {
    let currentValue = parseInt(this.state.currentLog, 10);

    if (isNaN(currentValue)) {
      currentValue = 0;
    }

    const updatedValue = currentValue + number;
    this.setState({ currentLog: updatedValue.toString() });
  };

  onCompleted = () => {
    this.updateStoreForGamification();

    if (
      this.rewardPoints[RewardManager.RewardKeys.Reward] > this.previousReward
    ) {
      /// point have been added show animation
      this.startAnimation();
    } else {
      this.props.navigation.goBack();
    }
  };

  startAnimation = () => {
    Animated.timing(this.state.animation, {
      toValue: 1,
      duration: 1000,
    }).start(() => {
      this.props.navigation.goBack();
    });
  };

  updateStoreForGamification = () => {
    this.props.rewardStore.setCalorieIntakeReward(this.rewardPoints.addPoint);

    if (this.finalIntakeValue < 5000) {
      return;
    }

    this.props.gamificationStore.setShowModalFlag(
      true,
      Gamification.CalorieIntakeCompleteModal
    );
  };

  updateCacheLastRecordedCalorieIntakeLog = (
    proxy,
    { data: { addCalorieIntakeLog } }
  ) => {
    const userId = this.props.userAccountStore.username;
    const query = CalorieIntakeQuery.GetLastCalorieIntake;
    const calorieIntakeLog = addCalorieIntakeLog;
    const queryVariables = { userId };
    let data;
    try {
      data = proxy.readQuery({
        query,
        variables: queryVariables,
      });
      if (data.lastCalorieIntakeLog) {
        if (
          !moment(data.lastCalorieIntakeLog.date).isAfter(
            moment(calorieIntakeLog.date)
          )
        ) {
          data.lastCalorieIntakeLog = calorieIntakeLog;
        }
      } else {
        data.lastCalorieIntakeLog = calorieIntakeLog;
      }
      proxy.writeQuery({
        query,
        variables: queryVariables,
        data,
      });
    } catch (e) {
      console.log("EXCEPTION isLastCalorieQueryAvailable: ", e.message);
    }
  };

  getAnimatingRewardTextStyle = () => {
    const bottomInterpolation = this.state.animation.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, -20, -50],
    });

    const opacityInterpolation = this.state.animation.interpolate({
      inputRange: [0, 0.8, 1],
      outputRange: [0, 0.5, 1],
    });

    return {
      position: "absolute",
      transform: [{ translateY: bottomInterpolation }],
      opacity: opacityInterpolation,
      left: 0,
      right: 0,
      fontSize: 20,
      textAlign: "center",
    };
  };

  render() {
    const programStartDate = this.props.userAccountStore.programStartDate;
    var currentCaloryIntake = this.state.currentLog;
    const animatingRewardTextStyle = this.getAnimatingRewardTextStyle();

    return (
      <KeyboardAwareScrollView
        style={styles.container}
        scrollEnabled
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <View
            style={[
              R.AppStyles.headerContainer,
              { paddingLeft: 0, paddingTop: 40 },
            ]}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <BackButton
                navigation={this.props.navigation}
                style={{ paddingLeft: 15 }}
              />
            </View>
            <PageTitle title="Caloric Intake" style={{ marginLeft: 15 }} />
          </View>

          <CalorieIntakeDetailsCard intake={this.state.previousIntake} />

          <Text style={styles.logText}>Log</Text>

          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInputStyle}
              value={currentCaloryIntake}
              keyboardType="number-pad"
              maxLength={6}
              onChangeText={(text) => {
                if (text.length > 0) {
                  const value = parseInt(text, 10);
                  if (value) {
                    this.setState({ currentLog: `${value}` });
                  } else {
                    this.setState({ currentLog: "0" });
                  }
                } else {
                  this.setState({ currentLog: "" });
                }
              }}
            />
            <Text style={styles.unitTextStyle}>Cal</Text>
          </View>
          <View style={styles.seperatorStyle} />
          <Text style={[styles.quickAdd, { marginBottom: 15, marginTop: 47 }]}>
            Quick Add
          </Text>
          <View
            style={[
              styles.quickAddOptionsContainer,
              { height: 51, marginTop: 15 },
            ]}
          >
            <CalogyQuickAdd
              values={[100, 200, 500, 1000]}
              onButtonPress={this.onButtonPress}
              unit={"Cal"}
            />
          </View>

          <Mutation
            mutation={CalorieIntakeQuery.AddCalorieIntakeLog}
            onError={(error) => {
            //   Sentry.captureMessage(error.message);
              Alert.alert(
                "Alert!",
                "We were not able to log your calory intake. Please try again later."
              );
            }}
            onCompleted={this.onCompleted}
            update={this.updateCacheLastRecordedCalorieIntakeLog}
          >
            {(addCalorieIntake, { loading, error, data }) => {
              let buttonState = ButtonState.Idle;
              let buttonLabel = "SAVE";
              if (loading) {
                buttonState = ButtonState.Progress;
                buttonLabel = "";
              }

              return (
                <View>
                  <LottieView
                    pointerEvents="box-none"
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 20,
                      bottom: 20,
                      top: 0,
                    }}
                    progress={this.state.animation}
                    source={R.Animations.Confetti}
                  />

                  <Animated.Text style={animatingRewardTextStyle}>
                    +
                    {this.rewardPoints[RewardManager.RewardKeys.Reward] -
                      this.previousReward}
                  </Animated.Text>

                  <View
                    style={{
                      position: "absolute",
                      left: 20,
                      right: 20,
                      bottom: 0,
                      top: 80,
                      borderRadius: 5,
                      overflow: "hidden",
                      backgroundColor: "#CE363E",
                    }}
                  />

                  <ProgressBarButton
                    disabled={loading}
                    label={buttonLabel}
                    buttonState={buttonState}
                    style={{
                      marginTop: 80,
                      marginLeft: 20,
                      marginRight: 20,
                      backgroundColor: null,
                      width: Dimensions.get("window").width - 40,
                    }}
                    onClick={() => {
                      const currentValue = parseInt(this.state.currentLog, 10);
                      if (isNaN(currentValue) || !currentValue) {
                        Alert.alert("Please enter a valid intake value");
                        return;
                      }

                      // on android device, user was able to enter negative value.
                      if (currentValue < 1) {
                        Alert.alert("Please enter a valid intake value");
                        return;
                      }

                      const finalValue =
                        currentValue + this.state.previousIntake;
                      this.finalIntakeValue = finalValue;
                      const todayDate = DateUtil.formattedTodayDate();
                      const diffDate =
                        DateUtil.absoluteDifferenceFromToday(programStartDate) +
                        1;

                      this.rewardPoints = RewardManager.getRewardForCalorieIntake(
                        this.finalIntakeValue,
                        this.previousReward
                      );

                      Keyboard.dismiss();
                      checkInternetConnection().then((isConnected) => {
                        if (isConnected === true) {
                          addCalorieIntake({
                            variables: {
                              calorieIntake: finalValue,
                              date: todayDate,
                              dayNumber: diffDate,
                              rewardPoints: this.rewardPoints[
                                RewardManager.RewardKeys.Reward
                              ],
                              input: [
                                {
                                  points: this.rewardPoints[
                                    RewardManager.RewardKeys.AddPoint
                                  ],
                                  date: todayDate,
                                  key: RewardManager.RewardKeys.CalorieIntake,
                                },
                              ],
                            },
                          });
                        } else {
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

function CalogyQuickAdd({ values, unit, onButtonPress }) {
  return values.map((value) => (
    <TouchableOpacity
      style={[styles.quickAddOptionStyle, { height: 51, alignItems: "center" }]}
      onPress={() => {
        // onSelectingWaterLevel(waterLevel.value, index);
        onButtonPress(value);
      }}
      key={value}
    >
      <Text style={[styles.waterLevelValue, { marginBottom: 12 }]}>
        {value} {unit}
      </Text>
    </TouchableOpacity>
  ));
}

const CalorieIntakeDetailsCard = (props) => {
  const todayIntakeTitle = "Today's Intake : ";
  const targetTitle = "Today's Target : ";

  return (
    <View
      style={[
        styles.waterIntakeDetailsCardStyle,
        { marginLeft: 15, marginRight: 15 },
      ]}
    >
      <View style={styles.waterIntakeCardSingleDetailStyle}>
        <Text style={styles.waterIntakeCardTitleStyle}>{todayIntakeTitle}</Text>
        <Text style={[styles.waterIntakeCardTitleStyle, { fontWeight: "500" }]}>
          {props.intake} Cal
        </Text>
      </View>

      <View style={styles.waterIntakeCardDivider} />

      <View style={styles.waterIntakeCardSingleDetailStyle}>
        <Text style={styles.waterIntakeCardTitleStyle}>{targetTitle} </Text>
        <Text style={[styles.waterIntakeCardTitleStyle, { fontWeight: "500" }]}>
          >5000 Cal
        </Text>
      </View>
    </View>
  );
};
