import React, { Component, useState } from "react";
import { View, ScrollView, Text, Alert } from "react-native";
import Styles from "./styles";
import Modal from "react-native-modal";
import WalkThroughComponent from "./WalkThroughComponent";
// import { IndicatorViewPager, PagerDotIndicator } from "rn-viewpager";
import { CTAButton, ProgressBarButton } from "../../Components";
import { Mutation } from "react-apollo";
import * as UserQueries from "AppSyncQueries/UserQueries";
// import { Sentry } from "react-native-sentry";
import { checkInternetConnection } from "react-native-offline";
import * as DateUtil from "Library/Utils/DateUtil";
import { ButtonState } from "Components/CTAButton/ButtonState";
import { observer, inject } from "mobx-react";
import MissedLoadingModal from "../../Components/Gamification/MissedLoadingModal";
import AppUtil from "../../Library/Utils/AppUtil";
import { LocalNotification } from "Components";
import { R } from "../../Resources/R";
import { PHASE_CONSTANT } from "../../Library/Constants";
import moment from "moment";

@inject("userAccountStore")
@observer
export class LoadingWalkThrough extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.localNotification = new LocalNotification();
  }

  state = {
    shouldShowMissedLoadingModal: false,
    shouldNavigateOnModalHide: false,
    navigationScreen: null,
    hasComponentMounted: false,
  };

  componentDidMount() {
    this.setState({ hasComponentMounted: true });
  }

  scheduleLocalNotification = () => {
    const dateObj = new Date();
    const newdate = DateUtil.getDate(dateObj);
    const endProgramDate = this.props.userAccountStore.programEndDate;

    const startProgramDate = this.props.userAccountStore.programStartDate;
    if (newdate <= endProgramDate) {
      this.localNotification.scheduleLocalNotification(
        endProgramDate,
        startProgramDate
      );
      this.localNotification.scheduleBodyMeasurementLocalNotification();
    }
  };

  updatePhaseInCache = (
    proxy,
    {
      data: {
        updateProgramDates: { phase, losingPhaseStartDate },
      },
    }
  ) => {
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
      }
    } catch (e) {
      console.log("EXCEPTION isGetProfileQueryAvailable: ", e.message);
    }
  };

  render() {
    const { programStartDate } = this.props.userAccountStore;
    this.userId = this.props.userAccountStore.username;
    const dateDiff = DateUtil.absoluteDifferenceFromToday(programStartDate);
    let nextScreen = "LoadingDashboard";
    let startDate = "";
    let endDate = "";

    if (dateDiff >= 0) {
      startDate = DateUtil.formattedTodayDate();
      endDate = DateUtil.addWeekFormatted(startDate, 12);
    } else {
      startDate = programStartDate;
      endDate = DateUtil.addWeekFormatted(startDate, 12);
    }

    const startDateMoment = moment(startDate);
    startDateMoment.add(2, "days");

    const losingPhase = startDateMoment.format("YYYY-MM-DD");

    return (
      <ScrollView
        style={[
          Styles.containerStyle,
          {
            paddingTop: 0,
            paddingLeft: 0,
            paddingRight: 0,
          },
        ]}>
        {this.state.hasComponentMounted && (
          <PagerComponent gender={this.props.userAccountStore.gender} />
        )}

        <Mutation
          mutation={UserQueries.UpdateProgramDates}
          onError={(error) => {
            console.log("error", error);
            // Sentry.captureMessage(error.message);
            Alert.alert(
              "Alert!",
              "Unable to process your request. Please try again later"
            );
          }}
          onCompleted={() => {
            this.props.userAccountStore.setProgramStartDate(startDate);
            this.props.userAccountStore.setProgramEndDate(endDate);
            this.props.userAccountStore.updatePhase(
              PHASE_CONSTANT.LOADING_PHASE
            );
            this.props.userAccountStore.updateLosingPhaseStartDate(losingPhase);
            // this.props.navigation.navigate(nextScreen);
            this.props.navigation.dispatch(AppUtil.resetAction(nextScreen, {}));
          }}
          update={this.updatePhaseInCache}>
          {(updateProgramDates, { loading }) => {
            let buttonState = ButtonState.Idle;
            let buttonLabel = "START PROGRAM NOW";
            if (loading) {
              buttonState = ButtonState.Progress;
              buttonLabel = "";
            }

            return (
              <View>
                <ProgressBarButton
                  disabled={loading}
                  label={buttonLabel}
                  buttonState={buttonState}
                  style={Styles.ctaButton}
                  onClick={() => {
                    checkInternetConnection().then((isConnected) => {
                      if (isConnected === true) {
                        // if user has missed loading phase, then show alert
                        if (dateDiff > 1) {
                          this.setState({
                            shouldShowMissedLoadingModal: true,
                          });
                          return;
                        }

                        updateProgramDates({
                          variables: {
                            userId: this.props.userAccountStore.username,
                            endDate,
                            startDate,
                            phase: PHASE_CONSTANT.LOADING_PHASE,
                            losingPhaseStartDate: losingPhase,
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

        <Modal
          isVisible={this.state.shouldShowMissedLoadingModal}
          style={{
            flex: 1,
            alignContent: "flex-start",
            justifyContent: "flex-start",
            marginLeft: 30,
            marginRight: 30,
          }}
          animationOutTiming={500}
          backdropTransitionOutTiming={500}
          backdropOpacity={0.6}
          onModalHide={() => {
            if (this.state.shouldNavigateOnModalHide) {
              // this.props.navigation.navigate(this.state.navigationScreen);
              this.props.navigation.dispatch(
                AppUtil.resetAction(this.state.navigationScreen, {})
              );
            }
          }}
          onBackdropPress={() => {
            this.setState({
              shouldShowMissedLoadingModal: false,
              shouldNavigateOnModalHide: false,
              navigationScreen: "",
            });
          }}>
          <MissedLoadingModal>
            <GetLoadingModalButton
              userAccountStore={this.props.userAccountStore}
              navigation={this.props.navigation}
              update={this.updatePhaseInCache}
              completionCallBack={(screen) => {
                // if we are going directly to losing phase then also set the
                // notification...

                this.setState({
                  shouldShowMissedLoadingModal: false,
                  shouldNavigateOnModalHide: true,
                  navigationScreen: screen,
                });
              }}
            />

            <GetLosingModalButton
              userAccountStore={this.props.userAccountStore}
              navigation={this.props.navigation}
              update={this.updatePhaseInCache}
              completionCallBack={(screen) => {
                this.scheduleLocalNotification();
                this.setState({
                  shouldShowMissedLoadingModal: false,
                  shouldNavigateOnModalHide: true,
                  navigationScreen: screen,
                });
              }}
            />
          </MissedLoadingModal>
        </Modal>
      </ScrollView>
    );
  }
}

const GetLoadingModalButton = ({
  userAccountStore,
  navigation,
  completionCallBack,
  update,
}) => {
  const { programStartDate } = userAccountStore;
  const dateDiff = DateUtil.absoluteDifferenceFromToday(programStartDate);
  let startDate = "";
  let endDate = "";

  if (dateDiff >= 0) {
    startDate = DateUtil.formattedTodayDate();
    endDate = DateUtil.addWeekFormatted(startDate, 12);
  } else {
    startDate = programStartDate;
    endDate = DateUtil.addWeekFormatted(startDate, 12);
  }

  const startDateMoment = moment(startDate);
  startDateMoment.add(2, "days");

  const losingPhase = startDateMoment.format("YYYY-MM-DD");

  return (
    <Mutation
      mutation={UserQueries.UpdateProgramDates}
      onError={(error) => {
        console.log("error", error);
        Sentry.captureMessage(error.message);
        Alert.alert(
          "Alert!",
          "Unable to process your request. Please try again later"
        );
      }}
      update={update}
      onCompleted={() => {
        completionCallBack("LoadingDashboard");
        userAccountStore.setProgramStartDate(startDate);
        userAccountStore.setProgramEndDate(endDate);
        userAccountStore.updatePhase(PHASE_CONSTANT.LOADING_PHASE);
        userAccountStore.updateLosingPhaseStartDate(losingPhase);
      }}>
      {(updateProgramDates, { loading }) => {
        let buttonState = ButtonState.Idle;
        let buttonLabel = "START LOADING PHASE";
        if (loading) {
          buttonState = ButtonState.Progress;
          buttonLabel = "";
        }

        return (
          <View>
            <ProgressBarButton
              disabled={loading}
              label={buttonLabel}
              buttonState={buttonState}
              style={[
                Styles.ctaButton,
                {
                  marginLeft: 0,
                  marginRight: 0,
                  marginTop: 18,
                  marginBottom: 0,
                },
              ]}
              onClick={() => {
                checkInternetConnection().then((isConnected) => {
                  if (isConnected === true) {
                    updateProgramDates({
                      variables: {
                        userId: userAccountStore.username,
                        endDate,
                        startDate,
                        phase: PHASE_CONSTANT.LOADING_PHASE,
                        losingPhaseStartDate: losingPhase,
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
  );
};

const GetLosingModalButton = ({
  userAccountStore,
  navigation,
  completionCallBack,
  update,
}) => {
  const { programStartDate } = userAccountStore;
  const dateDiff = DateUtil.absoluteDifferenceFromToday(programStartDate);
  let startDate = "";
  let endDate = "";

  if (dateDiff >= 0) {
    startDate = DateUtil.formattedTodayDate();
    endDate = DateUtil.addWeekFormatted(startDate, 12);
  } else {
    startDate = programStartDate;
    endDate = DateUtil.addWeekFormatted(startDate, 12);
  }

  return (
    <Mutation
      mutation={UserQueries.UpdateProgramDates}
      onError={(error) => {
        console.log("error", error);
        Sentry.captureMessage(error.message);
        Alert.alert(
          "Alert!",
          "Unable to process your request. Please try again later"
        );
      }}
      update={update}
      onCompleted={() => {
        completionCallBack("Dashboard");
        userAccountStore.setProgramStartDate(startDate);
        userAccountStore.setProgramEndDate(endDate);
        userAccountStore.updatePhase(PHASE_CONSTANT.LOSING_PHASE);
        userAccountStore.updateLosingPhaseStartDate(startDate);
      }}>
      {(updateProgramDates, { loading }) => {
        let buttonState = ButtonState.Idle;
        let buttonLabel = "Go to Losing Phase";
        if (loading) {
          buttonState = ButtonState.Progress;
          buttonLabel = "";
        }

        return (
          <View>
            <ProgressBarButton
              disabled={loading}
              label={buttonLabel}
              buttonState={buttonState}
              progressColor="#CE363E"
              textStyle={{ color: "#CE363E", lineHeight: 0 }}
              style={[
                Styles.ctaButton,
                {
                  marginLeft: 0,
                  marginRight: 0,
                  backgroundColor: "white",
                  marginTop: 24,
                  paddingTop: 0,
                  borderWidth: 0,
                },
              ]}
              onClick={() => {
                checkInternetConnection().then((isConnected) => {
                  if (isConnected === true) {
                    updateProgramDates({
                      variables: {
                        userId: userAccountStore.username,
                        endDate,
                        startDate,
                        phase: PHASE_CONSTANT.LOSING_PHASE,
                        losingPhaseStartDate: startDate,
                      },
                    });
                  } else {
                    Alert.alert(
                      "No Internet Connection",
                      "It seems there is some problem with your internet connection. Please check and try again."
                    );
                  }
                });
              }}>
              <Text style={[Styles.contineToLosingTextStyle]}>
                Already completed the loading phase?
              </Text>
            </ProgressBarButton>
          </View>
        );
      }}
    </Mutation>
  );
};

const renderDotIndicator = () => {
  return (
    <PagerDotIndicator
      pageCount={3}
      dotStyle={{ backgroundColor: "#D8D8D8" }}
      selectedDotStyle={{ backgroundColor: "#85898D" }}
    />
  );
};

// If if directly put WalkthroughComponent in pager, It was causigng issue, single component strecth to
// mutliple pages.
const PagerComponent = ({ gender }) => {
  const [currentPage, updateCurrentPage] = useState(0);
  const [soffset, setOffset] = useState(0);
  const [scrollEnabled, toggleScoll] = useState(false);

  let ob1 = R.Animations.OB1Male;
  let ob2 = R.Animations.OB2Male;
  let ob3 = R.Animations.OB3Male;

  if (gender === "female") {
    ob1 = R.Animations.OB1Female;
    ob2 = R.Animations.OB2Female;
    ob3 = R.Animations.OB3Female;
  }

  const loadingText =
    "In this phase, you will have high-calorie food in order to accelerate your metabolism";
  const losingText =
    "This is a very low calorie phase lasting 6-8 weeks. You will experience rapid, healthy weight loss without hunger or cravings.";
  const resetText =
    "In this phase you will increase your calorie intake keeping the food composition similar as of the last phase. The purpose of this is to restore your metabolism to its normal level and";

  return (
    <View style={{ width: "100%", overflow: "hidden" }}>
      {/* <IndicatorViewPager
        indicator={renderDotIndicator()}
        style={{ height: 570 }}
        scrollEnabled={scrollEnabled}
        onPageScroll={({ offset, position }) => {
          setOffset(offset + position);
        }}
        onPageSelected={({ position }) => {
          if (currentPage !== position) {
            updateCurrentPage(position);
          }
        }}>
        <View style={{ width: "100%" }}>
          <WalkThroughComponent
            title={"LOADING PHASE"}
            text={loadingText}
            image={ob1}
            scrollEnabled={toggleScoll}
            offset={currentPage === 0 && soffset < 1 ? soffset : 0}
            isSelected={currentPage === 0}
            currentPage={currentPage}
            finalProgress={0.75}
            animation={ob1}
          />
        </View>

        <View>
          <WalkThroughComponent
            title={"LOSING PHASE"}
            text={losingText}
            scrollEnabled={toggleScoll}
            animation={ob2}
            offset={currentPage === 1 && soffset - 1 < 1 ? soffset - 1 : 0}
            currentPage={currentPage}
            isSelected={currentPage === 1}
            finalProgress={0.75}
            image={ob2}
          />
        </View>

        <View>
          <WalkThroughComponent
            title={"RESET PHASE"}
            text={resetText}
            image={ob3}
            scrollEnabled={toggleScoll}
            isSelected={currentPage === 2}
            currentPage={currentPage}
            finalProgress={0.95}
            offset={0}
            animation={ob3}>
            <Text style={{ fontFamily: "Lato-Bold" }}>
              lock in your weight.
            </Text>
          </WalkThroughComponent>
        </View>
      </IndicatorViewPager> */}
    </View>
  );
};
