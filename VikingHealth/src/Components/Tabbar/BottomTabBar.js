import React, { Component } from 'react';
import { Animated, View, AppState, Text } from 'react-native';
import Tabs from './Tabs';
import Styles from './Styles';
import { R } from '../../Resources/R';
import NavigationService from '../../NavigationService';
import { ModalVideo } from '../../Components/Modal/ModalVideo';
import ToolTipComponent, {
  Alignment,
} from '../ToolTipComponent/ToolTipComponent';
import { BottomBarContext } from '../../Context/BottomTabContext';

import { USER_TYPE } from 'Library/Constants';
import { inject, observer } from 'mobx-react';
import ScreenName from '../../Screens/ScreenNameConstant';
import LottieView from 'lottie-react-native';
import {
  RewardKeys,
  convertPointToAmountString,
} from '../../Screens/Reward/RewardManager';

import ScreenNameConstant from '../../Screens/ScreenNameConstant';

export const BottomBarConstant = {
  FromBottomTabBar: 'fromBottomTabBar',
  ClearSelection: -1,

  DashboardTab: 0,
  JourneyTab: 1,
  VideoTab: 2,
  SummaryTab: 3,
  RewardTab: 4,
  AppointmentTab: 5,

  ShowSummaryPopup: 'showSummaryPopup',
};

@inject('loginUserStore', 'userAccountStore', 'rewardStore')
@observer
export class BottomTabBar extends Component {
  static contextType = BottomBarContext;

  state = {
    animated: new Animated.Value(0),
    confettiAnimation: new Animated.Value(0),
    isAnimating: false,
    selectedTab: BottomBarConstant.DashboardTab,
    previouslySelectedTab: BottomBarConstant.DashboardTab, // used when a screen is accessible by bottom bar as well as from another screen like journey as of now.
    isRewardAvailable: false,
    showRewardTooltip: false,
    showVideoCallModal: false,
    tabBarFullyVisible: false,
  };

  constructor(props) {
    super(props);
    this.navigationParam = { [BottomBarConstant.FromBottomTabBar]: true };

    AppState.addEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'active') {
      this.setState({});
    }
  };

  animate = (toValue) => {
    const { animated } = this.state;

    animated.stopAnimation();

    Animated.timing(animated, {
      toValue,
      duration: 250,
    }).start(() => {
      // const isTabBarFullyVisible = toValue === 1;
      // this.setState({ tabBarFullyVisible: true });

      this.setState({});
    });
  };

  componentDidUpdate(prevProps) {
    if (this.props.selectedTab != this.state.selectedTab) {
      this.setState({
        selectedTab: this.props.selectedTab,
      });
    }

    if (this.props.shouldCheckForReward != prevProps.shouldCheckForReward) {
      if (this.props.shouldCheckForReward) {
        this.checkForReward();
      }
    }

    if (this.props.showTabBar === prevProps.showTabBar) {
      return;
    }

    if (this.props.showTabBar) {
      this.animate(1);
    } else {
      this.animate(0);
    }
  }

  checkForReward = () => {
    if (this.props.rewardStore.showConfetti) {
      this.props.rewardStore.disableShowConfetti();

      this.setState({ isRewardAvailable: true }, () => {
        this.startConfettiAnimation();
      });
    }
  };

  startConfettiAnimation = () => {
    this.state.confettiAnimation.setValue(0);
    Animated.timing(this.state.confettiAnimation, {
      toValue: 1,
      duration: 1500,
    }).start(() => {
      this.setState({ isRewardAvailable: false });
      this.context.checkForReward(false);

      this.checkForRewardToolTip();
    });
  };

  checkForRewardToolTip = () => {
    if (
      this.props.rewardStore.flagShowRewardTooltip &&
      this.props.rewardStore.rewardPointsHistory.length < 1
    ) {
      this.setState({ showRewardTooltip: true });
    }
  };

  redirectToDashboard = () => {
    this.setState({
      selectedTab: BottomBarConstant.DashboardTab,
      previouslySelectedTab: BottomBarConstant.DashboardTab,
    });
    NavigationService.navigate('Dashboard', this.navigationParam);

    if (this.props.onSetSelectedTab) {
      this.props.onSetSelectedTab(BottomBarConstant.DashboardTab);
    }
  };

  redirectToJourney = () => {
    this.setState({
      selectedTab: BottomBarConstant.JourneyTab,
      previouslySelectedTab: BottomBarConstant.JourneyTab,
    });

    // NavigationService.navigate(ScreenNameConstant.AcceptAppointmentRequest, {
    //   appointmentId: '4480e4d6-14b8-486a-91e6-e01a410e4208',
    // });

    NavigationService.navigate(
      ScreenNameConstant.SummaryScreen,
      this.navigationParam
    );

    if (this.props.onSetSelectedTab) {
      this.props.onSetSelectedTab(BottomBarConstant.JourneyTab);
    }
  };

  redirectToVideo = () => {
    this.setState({
      showVideoCallModal: true,
    });
  };

  redirectToAppointments = () => {
    this.setState({
      selectedTab: BottomBarConstant.AppointmentTab,
      previouslySelectedTab: BottomBarConstant.AppointmentTab,
    });
console.log(this.navigationParam, 'this.navigationParam');
    NavigationService.navigate(
      ScreenNameConstant.AppointmentListing,
      this.navigationParam
    );

    // NavigationService.navigate(ScreenNameConstant.AcceptAppointmentRequest, {
    //   appointmentId: '6953d42e-1fa5-4df7-8b95-2ac275d27106',
    // });

    if (this.props.onSetSelectedTab) {
      this.props.onSetSelectedTab(BottomBarConstant.AppointmentTab);
    }
  };

  redirectToSummary = () => {
    this.setState({
      selectedTab: BottomBarConstant.SummaryTab,
      previouslySelectedTab: BottomBarConstant.SummaryTab,
    });
    NavigationService.navigate('CycleSummary', this.navigationParam);

    if (this.props.onSetSelectedTab) {
      this.props.onSetSelectedTab(BottomBarConstant.SummaryTab);
    }
  };

  redirectToRewardScreen = () => {
    this.setState({
      selectedTab: BottomBarConstant.RewardTab,
      previouslySelectedTab: BottomBarConstant.RewardTab,
    });

    NavigationService.navigate(ScreenName.RewardHistory, this.navigationParam);

    if (this.props.onSetSelectedTab) {
      this.props.onSetSelectedTab(BottomBarConstant.RewardTab);
    }
  };

  getBottomHeight = () => {
    const userType = this.props.loginUserStore.userType;

    const heightInterpolation = this.state.animated.interpolate({
      inputRange: [0, 1],
      outputRange: [1, userType == USER_TYPE.PATIENT ? 70 : 1],
    });

    const translationInterpolation = this.state.animated.interpolate({
      inputRange: [0, 1],
      outputRange: [70, userType == USER_TYPE.PATIENT ? 0 : 70],
    });

    return {
      height: heightInterpolation,
      transform: [{ translateY: translationInterpolation }],
    };
  };

  onVideoModalDismiss = () => {
    this.setState({ showVideoCallModal: false });
  };

  onRewardToolTipPressed = () => {
    this.props.rewardStore.unsetToolTipFlag();
    this.setState({ showRewardTooltip: false });
    this.redirectToRewardScreen();
  };

  render() {
    const {
      selectedTab,
      isRewardAvailable,
      confettiAnimation,
      showRewardTooltip,
      showVideoCallModal,
      tabBarFullyVisible,
    } = this.state;

    const height = this.getBottomHeight();
    const {
      rewardData: {
        total: totalRewardPoints,
        [RewardKeys.HasRedeemedForCurrentCycle]: hasRedeemed,
      },
      showRewardOf: rewardPoints,
    } = this.props.rewardStore;

    const { lastAcceptedCycle } = this.props.userAccountStore;

    const hasProgramCompleted = this.props.userAccountStore.hasProgramCompletedFunction();

    return (
       
      <Animated.View style={[Styles.containerStyle, height]}>
         {/* <View>
            <Text>Helo</Text>
        </View> */}
        {/* Bottom navigation bar */}
        <View style={Styles.holderStyle}>
          <Tabs
            title={'Dashboard'}
            onPress={this.redirectToDashboard}
            activeImage={R.Images.Tab_Dashboard_Active}
            inactiveImage={R.Images.Tab_Dashboard_Inactive}
            isActive={selectedTab === BottomBarConstant.DashboardTab}
          />
          <Tabs
            title={'Journey'}
            onPress={this.redirectToJourney}
            activeImage={R.Images.Tab_Journey_Active}
            inactiveImage={R.Images.Tab_Journey_Inactive}
            isActive={selectedTab === BottomBarConstant.JourneyTab}
          />
          <Tabs
            title={'Video'}
            onPress={this.redirectToVideo}
            activeImage={R.Images.Tab_Video_Active}
            inactiveImage={R.Images.Tab_Video_Inactive}
            isActive={selectedTab === BottomBarConstant.VideoTab}
          />

          <Tabs
            title={'Appointments'}
            onPress={this.redirectToAppointments}
            activeImage={R.Images.Tab_Appointment_Active}
            inactiveImage={R.Images.Tab_Appointment_Inactive}
            isActive={selectedTab === BottomBarConstant.AppointmentTab}
            imageStyle={{ marginBottom: -4 }}
          />

          {(lastAcceptedCycle > 1 || hasProgramCompleted) && (
            <View style={Styles.tabWrapperStyle}>
              <ToolTipComponent
                horizontalAlignment={Alignment.RIGHT}
                verticalAlignment={Alignment.BOTTOM}
                shouldShowPopup={
                  this.props.popUpName === BottomBarConstant.ShowSummaryPopup &&
                  this.props.showTabBar
                }
                message='You can view your summary from here.'
                onPress={() => {
                  this.context.setTabPopup(null);
                }}
              >
                <Tabs
                  title={'Summary'}
                  onPress={this.redirectToSummary}
                  activeImage={R.Images.Tab_Summary_Active}
                  inactiveImage={R.Images.Tab_Summary_Inactive}
                  isActive={selectedTab === BottomBarConstant.SummaryTab}
                />
              </ToolTipComponent>
            </View>
          )}

          {totalRewardPoints > 0 && (
            <View style={Styles.tabWrapperStyle}>
              <ToolTipComponent
                style={{ flex: 1 }}
                horizontalAlignment={Alignment.RIGHT}
                verticalAlignment={Alignment.BOTTOM}
                shouldShowPopup={showRewardTooltip}
                message={
                  'View your reward points and redeem them for future Viking Health services.'
                }
                onPress={this.onRewardToolTipPressed}
                onHide={this.redirectToRewardScreen}
              >
                <LottieTab
                  isRewardAvailable={isRewardAvailable}
                  confettiAnimation={confettiAnimation}
                  totalRewardPoints={totalRewardPoints}
                  selectedTab={selectedTab}
                  rewardPoints={rewardPoints}
                  redirectToRewardScreen={this.redirectToRewardScreen}
                  hasRedeemed={hasRedeemed}
                />
              </ToolTipComponent>
            </View>
          )}
        </View>

        {/* Video modal */}
        <ModalVideo
          isModalVisible={showVideoCallModal}
          dismiss={this.onVideoModalDismiss}
          navigation={NavigationService}
          userId={this.props.userAccountStore.username}
          isAdmin={false}
          fullName={this.props.userAccountStore.fullName}
          firstName={this.props.userAccountStore.firstName}
        />
      </Animated.View>
    );
  }
}

function getAnimatingTextStyle(confettiAnimation) {
  const bottomInterpolation = confettiAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -80, -100],
  });

  const opacityInterpolation = confettiAnimation.interpolate({
    inputRange: [0, 0.8, 1],
    outputRange: [1, 0.5, 0],
  });

  return {
    position: 'absolute',
    transform: [{ translateY: bottomInterpolation }],
    opacity: opacityInterpolation,
    left: 0,
    right: 0,
    fontSize: 20,
    textAlign: 'center',
  };
}

const LottieTab = ({
  confettiAnimation,
  isRewardAvailable,
  totalRewardPoints,
  selectedTab,
  rewardPoints,
  redirectToRewardScreen,
  hasRedeemed,
}) => {
  const textStyle = getAnimatingTextStyle(confettiAnimation);
  const rewardText = totalRewardPoints == 1 ? 'Point' : 'Points';

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        title={
          hasRedeemed
            ? `${convertPointToAmountString(totalRewardPoints)}`
            : `${totalRewardPoints} ${rewardText}`
        }
        onPress={redirectToRewardScreen}
        activeImage={R.Images.Tab_Reward_Active}
        inactiveImage={R.Images.Tab_Reward_Active}
        isActive={selectedTab === BottomBarConstant.RewardTab}
        textColor='#FEBA6D'
      />

      {isRewardAvailable && (
        <View pointerEvents='box-none'>
          <LottieView
            style={Styles.lottieViewStyle}
            source={R.Animations.Confetti}
            progress={confettiAnimation}
          />

          <Animated.Text style={textStyle}>+{rewardPoints}</Animated.Text>
        </View>
      )}
    </View>
  );
};
