import React, { Component } from "react";
import {
  View,
  Animated,
  Dimensions,
  Easing,
  ImageBackground,
} from "react-native";
import LottieView from "lottie-react-native";
import { R } from "../../../Resources/R";
import {
  AnimationInput,
  LottieAnimationInterpolationRange,
  BodyPartName,
} from "./ConfigData";
import { CycleHistoryList } from "../../../Components";
import BottomLossPill from "./BottomLossPill";
import TotalLossView from "./TotalLossView";
import FinalMeasurementPills from "./FinalMeasurementPills";

const { width } = Dimensions.get("screen");
export const INITIAL_WIDTH = width - 32;
export const FINAL_WIDTH = width - 70;
export const INITIAL_HEIGHT = (INITIAL_WIDTH * 2055) / 1372;
export const FINAL_HEIGHT = (FINAL_WIDTH * 2055) / 1372;

export default class BodyMeasurementSummaryComponent extends Component {
  constructor(props) {
    super(props);

    const { allCycleData } = props;
    const length = allCycleData.length - 1;
    const currentCycleData = allCycleData[length];

    this.state = {
      stopAnimation: false,
      selectedTab: length,
      selectedTabData: currentCycleData,
      isCurrentCycle: true,
      isAllSelected: false,
      animated: new Animated.Value(0),
      lottieViewLayoutParam: {
        width: FINAL_WIDTH,
        height: FINAL_HEIGHT,
      }, // this is for final settling pill animation

      isAnimationStopped: false,
    };

    this.lossValueArray = {
      [BodyPartName[0]]: 10,
      [BodyPartName[1]]: 40,
      [BodyPartName[2]]: 100,
      [BodyPartName[3]]: 30,
      [BodyPartName[4]]: 60,
      [BodyPartName[5]]: 90,
      [BodyPartName[6]]: 10,
      [BodyPartName[7]]: 30,
    };

    this.stopAnimation = false;
  }

  componentDidMount() {
    setTimeout(() => {
      this.startAnimation();
    }, 500);
  }

  componentWillUnmount() {
    this.stopAnimation = true;
    this.state.animated.stopAnimation();
  }

  onCycleChange = ({ index, isCurrentCycle, isAllSelected }) => {
    const { allCycleData } = this.props;
    const data = isAllSelected
      ? this.props.allTabLossData
      : allCycleData[index];

    this.setState(
      {
        isAnimationStopped: true,
        selectedTab: index,
        selectedTabData: data,
        isAllSelected,
        isCurrentCycle,
      },
      () => {
        this.state.animated.stopAnimation(() => {
          this.state.animated.setValue(0);
          this.startAnimation();
        });
      }
    );
  };

  startAnimation = () => {
    const { animated, isAnimationStopped } = this.state;

    if (isAnimationStopped) {
      this.setState({ isAnimationStopped: false });
    }

    if (this.props.scrollToEnd && !this.stopAnimation) {
      this.props.scrollToEnd();
      this.props.toggleScrolling(false);
    }

    Animated.sequence([
      // Neck complete
      Animated.timing(animated, {
        toValue: AnimationInput.NeckRingCompleted,
        duration: 1000, // 1 sec
        easing: Easing.linear,
      }),

      // Neck complete
      Animated.timing(animated, {
        toValue: AnimationInput.ShoulderRingCompleted,
        duration: 2500, /// 3:30  *
        easing: Easing.linear,
      }),

      // chest complete
      Animated.timing(animated, {
        toValue: AnimationInput.ChestRingCompleted,
        duration: 2500, // 6:00 *
        easing: Easing.linear,
      }),

      // arms complete
      Animated.timing(animated, {
        toValue: AnimationInput.ArmsRingCompleted,
        duration: 2150, //8:15 *
        easing: Easing.linear,
      }),

      // waist complete
      Animated.timing(animated, {
        toValue: AnimationInput.WaistRingCompleted,
        duration: 2150, //10:30 *
        easing: Easing.linear,
      }),

      // hips complete
      Animated.timing(animated, {
        toValue: AnimationInput.HipsRingCompleted,
        duration: 2500, //13:00 *
        easing: Easing.linear,
      }),

      // Thighs complete
      Animated.timing(animated, {
        toValue: AnimationInput.ThighsRingCompleted,
        duration: 2000, //15:00 *
        easing: Easing.linear,
      }),

      // Calf complete
      Animated.timing(animated, {
        toValue: AnimationInput.CalfRingCompleted,
        duration: 2100, //17:10 *
        easing: Easing.linear,
      }),

      // full body
      Animated.timing(animated, {
        toValue: AnimationInput.FullBody,
        duration: 2050, //19:15
        easing: Easing.linear,
      }),
    ]).start(() => {
      const { isAnimationStopped: animationStopped } = this.state;
      if (animationStopped) {
        return;
      }

      if (this.props.scrollToEnd && !this.stopAnimation) {
        this.props.scrollToEnd();
      }
      // continue to end of animation
      Animated.timing(animated, {
        toValue: AnimationInput.Completed,
        duration: 5150, //24:30
        easing: Easing.linear,
      }).start(() => {
        if (this.props.scrollToEnd && !this.stopAnimation) {
          this.props.scrollToEnd();
          this.props.toggleScrolling(true);
        }
      });
    });
  };

  getLottieContainerStyle = () => {
    const { animated } = this.state;
    const widthInterpolator = animated.interpolate({
      inputRange: [AnimationInput.CalfUnwinding, AnimationInput.FullBody],
      outputRange: [INITIAL_WIDTH, FINAL_WIDTH],
      extrapolate: "clamp",
    });

    const heightInterpolation = animated.interpolate({
      inputRange: [AnimationInput.CalfUnwinding, AnimationInput.FullBody],
      outputRange: [INITIAL_HEIGHT, FINAL_HEIGHT],
      extrapolate: "clamp",
    });

    const initialMargin = this.props.allCycleData.length < 2 ? 30 : 0;

    const marginTopInterpolation = animated.interpolate({
      inputRange: [AnimationInput.CalfUnwinding, AnimationInput.FullBody],
      outputRange: [initialMargin, 0],
      extrapolate: "clamp",
    });

    return {
      height: heightInterpolation,
      width: widthInterpolator,
      marginTop: marginTopInterpolation,
      alignSelf: "center",
      marginBottom: 50,
    };
  };

  render() {
    const {
      animated,
      lottieViewLayoutParam,
      isCurrentCycle,
      selectedTab,
      isAllSelected,
      selectedTabData,
    } = this.state;

    const { heightUnitText, firstName, isPatient } = this.props;

    const interpolatedProgress = animated.interpolate(
      LottieAnimationInterpolationRange
    );
    const lottieContainerStyle = this.getLottieContainerStyle();

    // return (
    //   <View style={{ flex: 1, width: 400, height: 700 }}>
    //     <SamplingComponent />
    //   </View>
    // );

    return (
      <View style={{ flex: 1, marginHorizontal: -16 }}>
        <View style={{ flexDirection: "row" }}>
          <CycleHistoryList
            onChipSelected={this.onCycleChange}
            shouldShowAllSelected
            borderColor="#DEE6EB"
            selectedColor="rgba(16,114,224,1)"
            selectedTextColor="white"
            unselectedColor="white"
            unSelectedTextColor="rgba(2,68,129,1)"
            dataContainerStyle={{ backgroundColor: "white" }}
          />
        </View>
        <TotalLossView
          heightUnitText={heightUnitText}
          animated={animated}
          isCurrentCycle={isCurrentCycle}
          isAllSelected={isAllSelected}
          cycle={selectedTab + 1}
          data={selectedTabData}
          noOfCycle={this.props.allCycleData.length}
          firstName={firstName}
          isPatient={isPatient}
        />

        <ImageBackground
          style={{ flex: 1, margin: -20 }}
          source={R.Images.ConcentricCircle}
          // resizeMode="contain"
        >
          <Animated.View style={lottieContainerStyle}>
            <LottieView
              resizeMode="stretch"
              style={{ flex: 1 }}
              progress={interpolatedProgress}
              loop={false}
              source={R.Animations.BODY}
            />

            <FinalMeasurementPills
              data={selectedTabData}
              heightUnitText={heightUnitText}
              animation={animated}
              layoutParam={lottieViewLayoutParam}
              width={lottieViewLayoutParam.width}
            />
          </Animated.View>
        </ImageBackground>
        {/* Bottom Pill */}
        <BottomLossPill
          heightUnitText={heightUnitText}
          animated={animated}
          data={selectedTabData}
          inchesLossArray={this.lossValueArray}
        />
      </View>
    );
  }
}
