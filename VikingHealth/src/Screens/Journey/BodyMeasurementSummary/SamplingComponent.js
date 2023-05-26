import React, { Component } from "react";
import { View, Animated } from "react-native";
import { R } from "../../../Resources/R";
import LottieView from "lottie-react-native";

export default class SamplingComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animated: new Animated.Value(0),
    };
  }

  componentDidMount() {
    this.state.animated.addListener((value) => {
      console.log("animation value is", value);
    });
    this.startAnimation();
  }

  startAnimation = () => {
    Animated.timing(this.state.animated, {
      toValue: 1,
      duration: 60000,
    }).start();
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "blue" }}>
        <LottieView
          resizeMode="stretch"
          style={{ flex: 1 }}
          progress={this.state.animated}
          loop={false}
          source={R.Animations.BODY}
        />
      </View>
    );
  }
}
