import React, { Component } from "react";
import {
  View,
  Animated,
  Easing,
  PanResponder,
  Vibration,
  Image,
  Text,
} from "react-native";
import LottieView from "lottie-react-native";
import { withNavigation } from "react-navigation";
import { R } from "../../Resources/R";
import styles from "./styles";
import AppUtils from "../../Library/Utils/AppUtil";

class AnimationContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      slideProgress: 0,
      revertingToInitialState: false,
      shouldPlayReverseAnimation: true, // when animation is 100% completed don't reverse it.
      reverseProgress: new Animated.Value(0),
      looping: new Animated.Value(0),
      shouldLoop: true,
    };
    this.animation = null;

    // Initializing pan responder
    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,

      onPanResponderGrant: () => {
        this.props.onScrollChange(false);
      },

      onPanResponderMove: (evt, gestureState) => {
        const { dy } = gestureState;
        const slideProgress = Math.min(1, dy / 200);

        if (slideProgress < 0.33) {
          return;
        }

        this.setState({ slideProgress });

        if (dy > 200) {
          Vibration.vibrate(500);
          this.setState({
            shouldPlayReverseAnimation: false,
            slideProgress: 0,
            revertingToInitialState: false,
            shouldLoop: true,
          });
          this.props.navigation.navigate("LogCaloryIntake", {
            intake: this.props.calorieIntake,
            rewardPoints: this.props.rewardPoints,
          });
        }
      },

      onPanResponderRelease: () => {
        this.props.onScrollChange(true);

        if (!this.state.shouldPlayReverseAnimation) {
          return;
        }

        this.revertAnimationToInitial();
      },

      onPanResponderTerminate: () => {
        this.revertAnimationToInitial();
        this.props.onScrollChange(true);
      },

      onShouldBlockNativeResponder: () => {
        return true;
      },
    });
  }

  componentDidMount() {
    this.props.navigation.addListener("didFocus", () => {
      this.state.looping.setValue(0);
      this.startLoopingAnimation();

      this.setState({
        shouldPlayReverseAnimation: true,
        slideProgress: 0,
        revertingToInitialState: false,
        shouldLoop: true,
      });
    });
  }

  revertAnimationToInitial = () => {
    this.setState(
      (previousState) => ({
        reverseProgress: new Animated.Value(previousState.slideProgress),
        slideProgress: 0,
        revertingToInitialState: true,
      }),
      () => {
        Animated.timing(this.state.reverseProgress, {
          toValue: 0,
          duration: 500,
          easing: Easing.linear,
          useNativeDriver: true,
        }).start(() => {
          this.setState({ revertingToInitialState: false });
          this.startLoopingAnimation();
        });
      }
    );
  };

  startLoopingAnimation = () => {
    this.state.looping.stopAnimation();
    Animated.loop(
      Animated.timing(this.state.looping, {
        toValue: 0.33,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  };

  render() {
    return (
      <View
        {...AppUtils.getTestId("loadingDashboardCalorieContainer")}
        style={styles.animationContainerStyle}
        {...this._panResponder.panHandlers}
      >
        <View style={styles.animationViewStyle}>
          <LottieView
            ref={(animation) => {
              this.animation = animation;
            }}
            style={[styles.animationStyle]}
            source={R.Animations.Combo1}
            loop={false}
            progress={this.getAnimationProgress()}
          />
        </View>

        <View
          style={[
            styles.dragArrowImageStyle,
            { opacity: 1 - this.state.slideProgress },
          ]}
        >
          <LottieView source={R.Animations.Shimmer} autoPlay />
        </View>

        {/* <Image
          source={R.Images.dragArrows}
          style={[
            styles.dragArrowImageStyle,
            { opacity: 1 - this.state.slideProgress }
          ]}
        /> */}

        <Text
          style={[
            styles.dragToAddCalories,
            { opacity: 1 - this.state.slideProgress },
          ]}
        >
          Drag to add calorie
        </Text>

        <Image
          source={R.Images.Plate}
          style={[
            styles.plateImageStyle,
            {
              transform: [
                { rotateX: `${-50 * this.state.slideProgress}deg` },
                { translateY: -1 * this.state.slideProgress },
              ],
            },
          ]}
        />
      </View>
    );
  }

  getAnimationProgress = () => {
    if (this.state.revertingToInitialState) {
      return this.state.reverseProgress;
    } else if (this.state.slideProgress > 0) {
      return this.state.slideProgress;
    }

    return this.state.looping;
  };
}

export default withNavigation(AnimationContainer);
