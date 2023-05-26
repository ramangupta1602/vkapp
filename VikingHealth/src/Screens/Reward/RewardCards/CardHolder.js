import React, { Component } from "react";
import { View, Animated, Dimensions } from "react-native";
import RewardCard from "./RewardCard";

const width = Dimensions.get("window").width - 16;
const Initial_Card_Height = 175; // 175 initial card height + 20 padding..

export const LayoutType = { Grid: "horizontal", List: "vertical" };

export default class CardHolder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      animation: props.animated,
      showGridLayout: true,
      firstCardHeight: 0,
      secondCardHeight: 0,
    };
  }

  getAnimatedStyle = () => {
    const { animation } = this.state;
    const heightInterpolation = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [
        Initial_Card_Height,
        this.state.firstCardHeight + this.state.secondCardHeight,
      ],
    });

    return {
      height: heightInterpolation,
      overflow: "hidden",
      marginTop: 0,
    };
  };

  getFirstCardStyle = () => {
    if (this.state.firstCardHeight <= 0) {
      return {
        width: "100%",
      };
    }

    const { animation } = this.state;
    const heightInterpolation = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [Initial_Card_Height, this.state.firstCardHeight],
    });

    const widthInterpolation = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [width / 2, width],
    });

    return {
      height: heightInterpolation,
      overflow: "hidden",
      position: "absolute",
      width: widthInterpolation,
    };
  };

  getSecondCardStyle = () => {
    if (this.state.secondCardHeight <= 0) {
      return {
        width: "100%",
      };
    }

    const { animation } = this.state;

    const heightInterpolation = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [Initial_Card_Height, this.state.secondCardHeight],
    });

    const widthInterpolation = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [width / 2, width],
    });

    const left = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [width / 2, 0],
    });

    const top = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, this.state.firstCardHeight],
    });

    return {
      height: heightInterpolation,
      overflow: "hidden",
      position: "absolute",
      width: widthInterpolation,
      left,
      top,
    };
  };

  render() {
    const { animation } = this.state;
    const animatedStyle = this.getAnimatedStyle();
    const firstCardStyle = this.getFirstCardStyle();
    const secondCardStyle = this.getSecondCardStyle();

    return (
      <View>
        {/* Content */}
        <Animated.View style={animatedStyle}>
          <Animated.View style={firstCardStyle}>
            <RewardCard
              data={this.props.data[0]}
              animated={animation}
              setHeight={(height) => {
                this.setState({ firstCardHeight: height });
              }}
            />
          </Animated.View>

          <Animated.View style={secondCardStyle}>
            <RewardCard
              data={this.props.data[1]}
              animated={animation}
              isSecondItem
              setHeight={(height) => {
                this.setState({ secondCardHeight: height });
              }}
            />
          </Animated.View>
        </Animated.View>
      </View>
    );
  }
}
