import React from "react";
import { View, Text, Animated } from "react-native";
import Styles from "./styles";

export default class ComparisonTableRow extends React.Component {
  constructor(props) {
    super(props);

    this.value = new Animated.Value(0);
  }

  animateView = () => {
    const { animate } = this.props;

    if (!animate) {
      return;
    }

    Animated.loop(
      Animated.timing(this.value, {
        toValue: 1,
        duration: 1000
      }),
      {
        iterations: 1
      }
    ).start();
  };

  getAnimatedStyle = () => {
    const { animate, backgroundColor } = this.props;
    const scaleInterpolation = this.value.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 1.1, 1]
    });

    const scaleXInterpolation = this.value.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 1.1, 1]
    });

    const style = {
      ...Styles.comparisonRowStyle,
      zIndex: animate ? 51 : 50,
      backgroundColor,
      // elevation: elevationInterpolation,
      transform: [
        { scaleY: scaleInterpolation },
        { scaleX: scaleXInterpolation }
        // { translateY }
      ]
    };

    return style;
  };

  componentDidUpdate(prevProps) {
    if (this.props.animate !== prevProps.animate) {
      this.animateView();
    }
  }

  render() {
    const { name, start, end, endColumnStyle, backgroundColor } = this.props;
    const animatedViewStyle = this.getAnimatedStyle();

    const colorStyle = backgroundColor
      ? { color: "white" }
      : { color: "#8191A2" };

    return (
      <Animated.View style={[animatedViewStyle]}>
        <Text style={[Styles.nameColumnStyle, colorStyle]}>{name}</Text>
        <Text style={[Styles.startColumnStyle, colorStyle]}>{start}</Text>
        <View
          style={[
            { backgroundColor: backgroundColor ? null : "white" },
            endColumnStyle
          ]}
        >
          <Text style={[Styles.startColumnStyle, colorStyle]}>{end}</Text>
        </View>
      </Animated.View>
    );
  }
}
