import React, { Component } from "react";
import { Text, View, Animated, Easing, Image, StyleSheet } from "react-native";
import {
  DraggableHexagon,
  DraggableBase,
  DraggableStick
} from "../../../Resources/Images";

export default class InformationView extends Component {
  constructor(props) {
    super(props);

    this.animateHeight = new Animated.Value(22);
  }

  state = {
    height: 22
  };

  componentDidUpdate(previousProps, state) {
    if (this.props.height === state.height) {
      return;
    }

    this.setState(
      {
        height: this.props.height
      },
      () => {
        this.startAnimation(previousProps.height, this.props.height);
      }
    );
  }

  startAnimation = (from, to) => {
    if (from === to) {
      return;
    }

    this.animateHeight.setValue(from);
    Animated.timing(this.animateHeight, {
      toValue: to,
      duration: 200,
      easing: Easing.ease
    }).start();
  };

  render() {
    return (
      <View style={[style.containerStyle, this.props.style]}>
        <View
          style={{
            height: 40,
            width: 40,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Image
            resizeMode='cover'
            source={DraggableHexagon}
            style={[style.hexagonalStyle]}
          />

          <Text style={[style.textStyle]}>{this.props.loss}</Text>
        </View>

        <Animated.Image
          style={{
            height: this.animateHeight,
            width: 2
          }}
          resizeMode='cover'
          source={DraggableStick}
        />

        <Image resizeMode='cover' source={DraggableBase} />
      </View>
    );
  }
}

const style = StyleSheet.create({
  containerStyle: {
    width: 50,
    height: 50,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  hexagonalStyle: {
    ...StyleSheet.absoluteFill,
    top: 10,
    height: 40,
    width: 40
  },

  textStyle: {
    color: "white",
    fontFamily: "Lato-Semibold",
    fontSize: 10,
    fontWeight: "600",
    marginTop: 10
  }
});
