import React, { Component } from 'react';
import { View, Image } from 'react-native';
import { styles } from './Styles';
import AppUtil from 'Library/Utils/AppUtil';
import { USER_ONBOARDING_STEP, USER_TYPE } from 'Library/Constants';
import { inject, observer } from 'mobx-react';
import { R } from 'Resources';
import * as DateUtil from './../../Library/Utils/DateUtil';

@observer
@inject('loginUserStore', 'userAccountStore')
export class Splash extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount = async () => {
    this.handleOnboardingStep();
  };

  handleOnboardingStep() {
    const step = this.props.loginUserStore.onboardingStep;
    const isAdmin = this.props.loginUserStore.userType == USER_TYPE.ADMIN;
    switch (step) {
      case USER_ONBOARDING_STEP.LOGGED_OUT:
        this.gotoWalkThrough();
        break;

      case USER_ONBOARDING_STEP.ACCOUNT_SETUP:
        this.gotoSignUp();
        break;

      case USER_ONBOARDING_STEP.PROFILE_COMPLETE:
        if (isAdmin) {
          this.gotoAdminDashboard();
        } else {
          this.gotoTargetWeight();
        }
        break;

      case USER_ONBOARDING_STEP.DONE:
        if (isAdmin) {
          this.gotoAdminDashboard();
        } else {
          this.gotoHomeScreen();
        }
        break;

      case USER_ONBOARDING_STEP.START_PROGRAM:
        this.gotoHomeScreen();
        break;

      default:
        this.gotoWalkThrough();
        break;
    }
  }

  gotoSignUp() {
    this.props.navigation.dispatch(AppUtil.resetAction('Signup', {}));
  }

  gotoTargetWeight() {
    this.props.navigation.dispatch(
      AppUtil.resetAction('AboutYou', {
        userId: this.props.loginUserStore.userId,
      })
    );
  }

  gotoAdminDashboard() {
    this.props.navigation.dispatch(AppUtil.resetAction('AdminDashboard', {}));
  }

  // Due to change in flow of app, now the user has to explicitly start the program
  // in that case, onboarding step is increase by 1 i.e 4 but only for new user.
  // so when have to check step = 3 and phase > 0 , then only we will show start program now
  // screen because for existing user, phase = nil (0)..
  // we managed to work it out without increasing counter but we are keeping it.
  gotoHomeScreen() {
    // check for loading condition....

    const {
      programStartDate,
      phase,
      cycleStartDate,
      currentCycle,
    } = this.props.userAccountStore;

    const dateDiff = AppUtil.getDateDifferenceAccordingToCycle(
      programStartDate,
      cycleStartDate,
      currentCycle
    );

    const routeName = AppUtil.getScreenToshow(dateDiff, phase);

    this.props.navigation.dispatch(AppUtil.resetAction(routeName, {}));
  }

  gotoWalkThrough() {
    this.props.navigation.dispatch(AppUtil.resetAction('WalkThrough', {}));
  }

  render() {
    return (
      <View style={styles.container}>
        <Image source={R.Images.splashLogo} style={styles.welcome} />
      </View>
    );
  }
}
