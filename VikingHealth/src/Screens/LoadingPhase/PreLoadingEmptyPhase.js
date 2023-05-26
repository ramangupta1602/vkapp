import React, { Component } from "react";
import {
  Text,
  View,
  AppState,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { observer, inject } from "mobx-react";
import * as DateUtils from "../../Library/Utils/DateUtil";
import Styles from "./styles";
import { R } from "../../Resources/R";
import moment from "moment";
import AppUtils from "Library/Utils/AppUtil";
import { PHASE_CONSTANT } from "../../Library/Constants";

@observer
@inject("loginUserStore", "userAccountStore")
export class PreLoadingEmptyPhase extends Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    shouldShowExplaination: false,
  };

  constructor(props) {
    super(props);
    const { currentCycle } = props.userAccountStore;
    // this.shouldShowInfo = !currentCycle || currentCycle < 2;
  }

  componentDidMount() {
    AppState.addEventListener("change", this.handleAppFocus);
    setTimeout(() => {
      this.checkModalToShow();
    }, 500);
  }

  handleAppFocus = (state) => {
    if (state !== "active") {
      return;
    }

    this.checkModalToShow();
  };

  componentWillUnmount() {
    // AppState.removeEventListener("change", () => {});
  }

  checkModalToShow = () => {
    const {
      programStartDate,
      cycleStartDate,
      currentCycle,
    } = this.props.userAccountStore;

    const dateDiff = AppUtils.getDateDifferenceAccordingToCycle(
      programStartDate,
      cycleStartDate,
      currentCycle
    );

    if (dateDiff < 0) {
      return;
    }

    // once the user is on dashboard then nullify this condition....
    if (this.props.userAccountStore.phase === PHASE_CONSTANT.LOSING_PHASE) {
      return;
    }

    // if we have moved to loading or losing phase then this listener should not do
    // anything, I tried removing state listener, but it doesn't seem working so this condition.
    if (this.props.userAccountStore.phase > PHASE_CONSTANT.PRE_LOADING_PHASE) {
      // now we have one more condition, in case of reload, we want user to redirect (or bypass) this
      // condition as the phase will be 3 and user need to stay on this page

      // for the first time user
      if (currentCycle === 1) {
        return;
      }
    }

    const nextScreen =
      currentCycle > 1 ? "LoadingDashboard" : "LoadingWalkThrough";

    // AppState.removeEventListener("change", this.handleAppFocus);
    this.props.navigation.dispatch(AppUtils.resetAction(nextScreen, {}));
  };

  moveToDateSelection = () => {
    this.props.navigation.navigate("StartDateSelection");
  };

  showWaitingDetails = () => {
    this.setState({ shouldShowExplaination: true }, () => {
      setTimeout(() => {
        if (this.scrollRef) {
          this.scrollRef.scrollToEnd();
        }
      }, 0);
    });
  };

  render() {
    const {
      programStartDate,
      cycleStartDate,
      currentCycle,
    } = this.props.userAccountStore;

    const date = currentCycle > 1 ? cycleStartDate : programStartDate;
    const msg =
      currentCycle > 1 ? "Reload Cycle starts on" : "and come back on";

    const startDate = moment(date);
    const formattedDate = startDate.format("DD-MMMM-YYYY");

    return (
      <ScrollView
        style={{ backgroundColor: R.Colors.COLOR_APP_BACKGROUND }}
        ref={(ref) => {
          this.scrollRef = ref;
        }}
      >
        <View style={[Styles.containerStyle]}>
          <Image
            style={[Styles.emptyImageStyle]}
            source={R.Images.emptyState}
            resizeMode="contain"
          />

          <Text style={[Styles.emptyTitleStyle]}>
            You can relax for now {"\n"} {msg}
          </Text>

          <TouchableOpacity
            activeOpacity={1}
            style={Styles.startDateContainer}
            onPress={this.moveToDateSelection}
          >
            <Text style={Styles.emptyDateStyle}>{formattedDate}</Text>
          </TouchableOpacity>

          <View>
            <Text style={Styles.emptyTap}>
              Tap on the start date if you want to change it
            </Text>

            <Text
              style={Styles.learnMoreStyle}
              onPress={this.showWaitingDetails}
            >
              Why I’m seeing this?
            </Text>

            {this.state.shouldShowExplaination && (
              <Text style={Styles.explainationTextStyle}>
                We know you can’t wait to start your weight loss journey.
                {"\n"}
                Since you need to eat >5000 Kcal/day in your loading phase. You
                need to start your program after 24 hours to ensure optimum
                results.
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    );
  }
}
