import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import ProgressCircle from "react-native-progress-circle";

export class ProgressBarHeightToWaistRatio extends Component {
  getColor(value) {
    const { gender } = this.props;

    switch (gender) {
      case "male":
        return this.getColorForMale(value);
      case "female":
        return this.getColorForFemale(value);
      default:
        return this.getColorForFemale(value);
    }
  }

  getColorForMale = (value) => {
    if (value < 35) {
      return "#00A9D8";
    } else if (value >= 35 && value < 43) {
      return "#64DDFF";
    } else if (value >= 43 && value < 46) {
      return "#7DCE47";
    } else if (value >= 46 && value < 53) {
      return "#00BA23";
    } else if (value >= 53 && value < 58) {
      return "#FF9D40";
    } else if (value >= 58 && value < 63) {
      return "#E06B00";
    } else {
      return "#11400";
    }
  };

  getColorForFemale = (value) => {
    if (value < 35) {
      return "#00A9D8";
    } else if (value >= 35 && value < 42) {
      return "#64DDFF";
    } else if (value >= 42 && value < 46) {
      return "#7DCE47";
    } else if (value >= 46 && value < 49) {
      return "#00BA23";
    } else if (value >= 49 && value < 54) {
      return "#FF9D40";
    } else if (value >= 54 && value < 58) {
      return "#E06B00";
    } else {
      return "#D11400";
    }
  };

  render() {
    return (
      <View
        style={[
          styles.container,
          {
            shadowColor: this.getColor(this.props.value),
          },
        ]}
      >
        <ProgressCircle
          percent={100}
          radius={23}
          color={this.getColor(this.props.value)}
          shadowColor="rgba(245,166,35,0.57)"
          bgColor={this.getColor(this.props.value)}
        >
          <Text style={styles.value}>{this.props.value.toFixed(1)}</Text>
        </ProgressCircle>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  value: {
    fontSize: 13,
    fontFamily: "Lato-Regular",
    letterSpacing: 0.11,
    padding: 5,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  container: {
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 6,
    shadowOpacity: 0.7,
    width: 30,
    height: 30,
    justifyContent: "center",
    marginRight: 8,
  },
});
