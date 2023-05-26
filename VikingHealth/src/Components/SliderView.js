import React, { Component } from "react";
import {
  View,
  Image,
  Text,
  PanResponder,
  Animated,
  StyleSheet,
} from "react-native";
import { R } from "../Resources";

export class SliderView extends Component {
  constructor(props) {
    super(props);

    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,

      onPanResponderGrant: (evt) => {
        if (this.props.changeScrolling) {
          this.props.changeScrolling(false);
        }
      },

      onPanResponderMove: (evt, gestureState) => {
        const { dx } = gestureState;
        this.setState({
          xOffset: dx / 1.2,
        });

        this.opacityAnimation.setValue(dx / 1.2);

        if (dx > this.xDropOffset) {
          if (this.props.onCardSelect) {
            this.props.onCardSelect();
          }
        }
      },

      onPanResponderTerminationRequest: () => true,

      onPanResponderRelease: (evt) => {
        if (this.props.changeScrolling) {
          this.props.changeScrolling(true);
        }

        this.setState({
          xOffset: 0,
        });
        this.opacityAnimation.setValue(0);
      },

      onPanResponderTerminate: (evt) => {
        if (this.props.changeScrolling) {
          this.props.changeScrolling(true);
        }
        this.setState({
          xOffset: 0,
        });
        this.opacityAnimation.setValue(0);
      },

      onShouldBlockNativeResponder: (evt) => {
        return true;
      },
    });

    this.opacityAnimation = new Animated.Value(0);
  }

  state = {
    xOffset: 0,
  };

  render() {
    const { style, textStyle } = this.props;
    return (
      <View style={[localStyle.dragContainerStyle, style]}>
        <Image
          style={[localStyle.sliderMiddleStyle]}
          source={R.Images.sliderMiddle}
          resizeMode="cover"
        />

        <Text
          style={[
            localStyle.sliderMiddleStyle,
            { position: "absolute", left: 35 },
            textStyle,
          ]}>
          Slide to view your journey
        </Text>

        <Image
          source={R.Images.sliderLeft}
          style={[localStyle.checkmarkImage]}
        />
        <Image
          source={R.Images.sliderRight}
          onLayout={({ nativeEvent: { layout } }) => {
            this.xDropOffset = layout.x - 100;
          }}
          style={[localStyle.checkmarkImage, { right: 1 }]}
        />

        <Image
          {...this._panResponder.panHandlers}
          source={R.Images.sliderCircle}
          style={{
            width: 43,
            height: 43,
            position: "absolute",
            left: this.state.xOffset,
          }}
          resizeMode="cover"
        />
      </View>
    );
  }
}

const localStyle = StyleSheet.create({
  dragContainerStyle: {
    flex: 1,
    flexDirection: "row",
    height: 45.63,
    borderRadius: 5,
    backgroundColor: "transparent",
    marginLeft: 14,
    marginBottom: 5,
    marginRight: 14,
    alignItems: "center",
  },

  sliderMiddleStyle: { flex: 1, marginLeft: 18, marginRight: 19.5 },
  slideTextStyle: {
    color: "#D0444C",
    fontFamily: "Lato-Regular",
    fontSize: 12,
    letterSpacing: 0.32,
    lineHeight: 15,
  },

  emptyCard: {
    borderRadius: 10,
    backgroundColor: "white",
    shadowColor: R.Colors.COLOR_SHADOW,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    paddingHorizontal: 16,
    paddingVertical: 30,
    margin: 8,
    elevation: 1,
    flexDirection: "row",
  },

  checkmarkImage: {
    width: 22,
    height: 43,
    position: "absolute",
  },
});
