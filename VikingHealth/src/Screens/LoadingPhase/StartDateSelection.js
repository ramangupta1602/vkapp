import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Platform,
  Alert,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import Styles from "./styles";
import { ProgressBarButton } from "../../Components";
import { CalendarList } from "react-native-calendars";
import * as DateUtils from "../../Library/Utils/DateUtil";
import AppUtil from "../../Library/Utils/AppUtil";
import { Mutation } from "react-apollo";
import { checkInternetConnection } from "react-native-offline";
// import { Sentry } from "react-native-sentry";
import * as UserQueries from "AppSyncQueries/UserQueries";
import { R } from "../../Resources/R";
import { ButtonState } from "Components/CTAButton/ButtonState";
import { observer, inject } from "mobx-react";
import { PHASE_CONSTANT } from "../../Library/Constants";
import moment from "moment";

@observer
@inject("userAccountStore")
export class StartDateSelection extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);

    const date =
      props.userAccountStore.startDate ?? DateUtils.formattedTodayDate();

    const isFutureDate = DateUtils.isFutureDate(date);

    const nextDay = isFutureDate ? date : DateUtils.formattedTodayDate();
    const data = this.getMutationObjectForDate(nextDay);

    this.state = {
      selectedDate: nextDay,
      data,
    };
  }

  updatePhaseInCache = (
    proxy,
    {
      data: {
        updateProgramDates: { phase, losingPhaseStartDate },
      },
    }
  ) => {
    console.log("reboot program trying to update")
    const query = UserQueries.GetProfile;
    const userId = this.props.userAccountStore.username;

    try {
      const data = proxy.readQuery({
        query,
        variables: { userId },
      });
      if (data && data.getProfile) {
        data.getProfile.phase = phase;
        data.getProfile.losingPhaseStartDate = losingPhaseStartDate;

        proxy.writeQuery({ query, variables: { userId }, data });
        console.log("reboot program updaed")
      }
    } catch (e) {
      console.log("EXCEPTION isGetProfileQueryAvailable: ", e.message);
    }
  };

  renderArrow = (direction) => {
    // const source =
    //   direction === "left"
    //     ? R.Images.calendarArrowLeft
    //     : R.Images.calendarArrowRight;

    return <Image source={null} style={{ width: 8, height: 14 }} />;
  };

  onCalendarDateChanged = (day) => {
    this.setState({
      data: this.getMutationObjectForDate(day.dateString),
      selectedDate: day.dateString,
    });
  };

  getMutationObjectForDate = (date) => {
    const todayDate = DateUtils.formattedTodayDate();

    const {
      username: userId,
      currentCycle,
      programStartDate,
    } = this.props.userAccountStore;

    const hasReloaded = currentCycle > 1;

    const data = { userId };

    data.endDate = DateUtils.addWeekFormatted(date, 12);
    data.losingPhaseStartDate = DateUtils.addDaysFormatted(date, 2);
    data.screen = "PreLoadingEmptyPhase";
    data.cycleStartDate = date;

    data.startDate = hasReloaded ? programStartDate : date;
    data.phase = hasReloaded
      ? PHASE_CONSTANT.LOADING_PHASE
      : PHASE_CONSTANT.PRE_LOADING_PHASE;

    if (date === todayDate) {
      data.phase = hasReloaded
        ? PHASE_CONSTANT.LOADING_PHASE
        : PHASE_CONSTANT.PRE_LOADING_PHASE;
      data.screen = hasReloaded ? "LoadingDashboard" : "LoadingWalkThrough";
    }

    return data;
  };

  render() {
    const { data, selectedDate } = this.state;

    const todayDate = DateUtils.formattedTodayDate();

    const selectedDay = {};
    selectedDay[selectedDate] = { selected: true };
    const { width, height } = Dimensions.get("window");

    return (
      <ScrollView
        style={{
          backgroundColor: R.Colors.COLOR_APP_BACKGROUND,
          minHeight: height,
        }}
      >
        <View style={[Styles.containerStyle, styles.containerStyle]}>
          <Text style={styles.welcomeStyle}> Welcome to </Text>
          <Text style={[styles.programTitle]}>The Reboot Program</Text>
          <Text style={[styles.descriptionText]}>
            Please choose the date you plan to start your{"\n"}weight loss
            program.
          </Text>

          <View style={[styles.calendarStyle]}>
            {/* Calendar holder */}

            <CalendarList
              calendarWidth={width - 32}
              pastScrollRange={1}
              futureScrollRange={12}
              pagingEnabled
              horizontal
              minDate={todayDate}
              current={selectedDate}
              hideExtraDays
              hideArrows={false}
              renderArrow={(direction) => this.renderArrow(direction)}
              theme={{
                selectedDayBackgroundColor: "#D0444C",
              }}
              onDayPress={this.onCalendarDateChanged}
              markedDates={selectedDay}
              monthFormat={"MMMM yyyy"}
            />
          </View>
        </View>

        <View style={{ flex: 1 }} />

        <View
          style={{
            marginTop: 16,
            marginHorizontal: 16,
          }}
        >
          <Mutation
            mutation={UserQueries.UpdateProgramDates}
            onError={(error) => {
              console.log("error", error);
            //   Sentry.captureMessage(error.message);
              Alert.alert(
                "Alert!",
                "Unable to process your request. Please try again later"
              );
            }}
            onCompleted={() => {
                console.log("reboot program completed")
              const { data } = this.state;

              this.props.userAccountStore.setProgramStartDate(data.startDate);
              this.props.userAccountStore.setCycleStartDate(
                data.cycleStartDate
              );
              this.props.userAccountStore.setProgramEndDate(data.endDate);
              this.props.userAccountStore.updatePhase(data.phase);
              this.props.userAccountStore.updateLosingPhaseStartDate(
                data.losingPhaseStartDate
              );
              this.props.navigation.dispatch(
                AppUtil.resetAction(data.screen, {})
              );
            }}
            update={this.updatePhaseInCache}
          >
            {(updateProgramDates, { loading }) => {
              let buttonState = ButtonState.Idle;
              let buttonLabel = "NEXT";
              if (loading) {
                buttonState = ButtonState.Progress;
                buttonLabel = "";
              }

              return (
                <ProgressBarButton
                  disabled={loading}
                  label={buttonLabel}
                  buttonState={buttonState}
                  style={[Styles.ctaButton, styles.buttonStyle]}
                  onClick={() => {
                    checkInternetConnection().then((isConnected) => {
                    console.log("reboot program button clicked", isConnected)
                      if (isConnected === true) {
                        updateProgramDates({
                          variables: data,
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
              );
            }}
          </Mutation>

          <View style={styles.bottomInstruction}>
            <Image source={R.Images.info} style={styles.infoIconStyle} />
            <Text style={[styles.bottomTextStyle]} numberOfLines={2}>
              Please make sure you have confirmed your consultation date with
              Dr. M
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const boxShadowStyle = {
  ...Platform.select({
    ios: {
      shadowColor: "rgba(161, 172, 180, 0.11)",
      shadowOffset: { height: 5, width: 9 },
      shadowRadius: 3,
    },
    android: {
      elevation: 0.5,
    },
  }),
};

const styles = StyleSheet.create({
  containerStyle: {
    paddingTop: 40,
  },

  welcomeStyle: {
    color: "#8191A2",
    fontFamily: "Lato-Regular",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.14,
    lineHeight: 22,
    marginLeft: -5,
    backgroundColor: "transparent",
  },

  programTitle: {
    color: "#282727",
    fontFamily: "Lato-Bold",
    fontSize: 28,
    fontWeight: "bold",
    letterSpacing: 0.22,
    lineHeight: 34,
    marginTop: 2,
  },

  descriptionText: {
    color: "#282727",
    fontFamily: "Lato-Regular",
    fontSize: 14,
    lineHeight: 18,
    marginTop: 8,
  },

  calendarStyle: {
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "white",
    ...boxShadowStyle,
    marginTop: 24,
  },

  buttonStyle: {
    marginLeft: 0,
    marginRight: 0,
    width: "100%",
  },

  bottomTextStyle: {
    fontFamily: "Lato-Regular",
    fontSize: 12,
    letterSpacing: 0.13,
    lineHeight: 15,
    flex: 1,
    marginBottom: 10,
  },

  bottomInstruction: {
    flexDirection: "row",
    marginTop: 14,
    flex: 1,
    marginBottom: 20,
    alignContent: "center",
    alignItems: "flex-start",
  },

  infoIconStyle: {
    height: 16,
    width: 16,
    marginRight: 4,
    marginTop: 3,
  },

  /*
.please-make-sure-you {
	height: 30px;
	width: 308px;
	color: #8191A2;
	font-family: Lato;
	font-size: 12px;
	letter-spacing: 0.13px;
	line-height: 15px;
}
  */
});
