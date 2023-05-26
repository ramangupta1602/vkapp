import React, { Component } from "react";
import { Alert, View, AppState, Button } from "react-native";
import { Query, Mutation } from "react-apollo";
import * as CalorieIntakeQuery from "AppSyncQueries/CaloricQueries";
import { inject, observer } from "mobx-react";
import LoadingDashboardContainer from "./DashboardContainer";
import AppUtils from "Library/Utils/AppUtil";
import * as DateUtils from "./../../Library/Utils/DateUtil";
import * as UserQueries from "AppSyncQueries/UserQueries";
// import { Sentry } from "react-native-sentry";
import { ButtonState } from "Components/CTAButton/ButtonState";
import { PhaseModal } from "Components";
import { checkInternetConnection } from "react-native-offline";
import { LocalNotification } from "Components";
import { R } from "Resources/R";
import { PHASE_CONSTANT } from "../../Library/Constants";
import SkipLoadingModal from "../../Components/Gamification/SkipLoadingModal";
import { GamificationModal } from "../../Components/Gamification/GamificationModal";
import { Gamification as GamificationConstant } from "../../utility/constants/Constants";

@inject("userAccountStore", "loginUserStore")
@observer
export class LoadingDashboard extends Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    modalToShow: "",
    nextPhase: 1,
    title: "",
    desc: "",
    buttonLabel: "",
    shouldShowModal: false,
    screen: "",
    shouldShowSkipLoadingModal: false,
  };

  constructor(props) {
    super(props);
    this.localNotification = new LocalNotification();
  }

  componentDidMount() {
    AppState.addEventListener("change", this.handleAppFocus);

    setTimeout(() => {
      this.checkModalToShow();
    }, 500);
  }

  componentWillMount() {
    // AppState.removeEventListener("change", this.handleAppFocus);
  }

  scheduleLocalNotification = () => {
    const dateObj = new Date();
    const newdate = DateUtils.getDate(dateObj);
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

  handleAppFocus = (state) => {
    if (state !== "active") {
      return;
    }
    this.checkModalToShow();
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

  checkModalToShow = () => {
    const {
      programStartDate,
      cycleStartDate,
      currentCycle,
    } = this.props.userAccountStore;

    const todayDate = DateUtils.formattedTodayDate();
    const date = currentCycle > 1 ? cycleStartDate : programStartDate;

    const dateDiff = DateUtils.absoluteDifferenceFromToday(date);
    const checkModalToShow = AppUtils.getModelRelatedToPhase(dateDiff, 2);

    // to update the ui on date chnage we have to keep current date in state, so ui is updated when date changes
    if (this.state.date !== todayDate) {
      this.setState({ date: todayDate });
    }

    if (!checkModalToShow) {
      this.setState({ shouldShowModal: false });
    }

    if (checkModalToShow === "MoveToDashboard") {
      this.setState({
        modalToShow: "MoveToDashboard",
        nextPhase: PHASE_CONSTANT.LOSING_PHASE,
        screen: "Dashboard",
        shouldShowModal: true,
      });
    }
  };

  onSkipLoadingClicked = () => {
    this.setState({ shouldShowSkipLoadingModal: true });
  };

  onSkipLoadingCancelClick = () => {
    this.setState({
      shouldShowSkipLoadingModal: false,
    });
  };

  render() {
    const userId = this.props.userAccountStore.username;
    const { shouldShowModal, shouldShowSkipLoadingModal } = this.state;
    const { programStartDate, programEndDate } = this.props.userAccountStore;
    const todayDate = DateUtils.formattedTodayDate();

    return (
      <View style={{ flex: 1 }}>
        <Query
          query={CalorieIntakeQuery.GetLastCalorieIntake}
          variables={{ userId }}
          fetchPolicy="cache-and-network"
        >
          {({ data }) => {
            return (
              <LoadingDashboardContainer
                calorieData={data}
                onSkipLoadingClicked={this.onSkipLoadingClicked}
              />
            );
          }}
        </Query>

        <Mutation
          mutation={UserQueries.UpdateProgramDates}
          onError={(error) => {
            console.log("error", error);
            // Sentry.captureMessage(error.message);
            Alert.alert(
              "Alert!",
              "Unable to update phase. Please try again later."
            );
          }}
          onCompleted={() => {
            // also remove the app state listener
            this.scheduleLocalNotification();
            this.props.userAccountStore.updatePhase(
              PHASE_CONSTANT.LOSING_PHASE
            );
            this.props.loginUserStore.setOnboardingStep(4);
            this.props.userAccountStore.updateLosingPhaseStartDate(todayDate);
            this.props.navigation.dispatch(
              AppUtils.resetAction("Dashboard", {})
            );
          }}
          update={this.updatePhaseInCache}
        >
          {(updateProgramDates, { loading, error, data }) => {
            let buttonState = ButtonState.Idle;

            if (loading) {
              buttonState = ButtonState.Progress;
            }

            let transitionImage = "";

            if (this.props.userAccountStore.gender === "female") {
              transitionImage = R.Images.femaleOb2;
            } else {
              transitionImage = R.Images.maleOb2;
            }

            return (
              <View>
                <GamificationModal
                  modalName={GamificationConstant.SkipLoadingModal}
                  isVisible={shouldShowSkipLoadingModal}
                  buttonState={buttonState}
                  performMutation={() => {
                    checkInternetConnection().then((isConnected) => {
                      if (isConnected === true) {
                        updateProgramDates({
                          variables: {
                            userId: this.props.userAccountStore.username,
                            endDate: programEndDate,
                            startDate: programStartDate,
                            phase: PHASE_CONSTANT.LOSING_PHASE,
                            losingPhaseStartDate: todayDate,
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
                  onCancelPress={this.onSkipLoadingCancelClick}
                  onBackdropPress={() => {}}
                />

                {this.state.shouldShowModal && (
                  <PhaseModal
                    phaseName="LOADING PHASE"
                    nextPhaseName="LOSING PHASE"
                    nextPhaseDetail="This is a very low calorie phase lasting 6-8 weeks. You will
            experience rapid, healthy weight loss without hunger or cravings."
                    transitionImage={transitionImage}
                    timeLineImage={R.Images.loadingTimeline}
                    buttonLabel="Move to losing phase"
                    shouldShowModal={shouldShowModal}
                    buttonState={buttonState}
                    performMutation={() => {
                      checkInternetConnection().then((isConnected) => {
                        if (isConnected === true) {
                          updateProgramDates({
                            variables: {
                              userId: this.props.userAccountStore.username,
                              endDate: programEndDate,
                              startDate: programStartDate,
                              phase: PHASE_CONSTANT.LOSING_PHASE,
                              losingPhaseStartDate: todayDate,
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
                )}
              </View>
            );
          }}
        </Mutation>
      </View>
    );
  }
}
