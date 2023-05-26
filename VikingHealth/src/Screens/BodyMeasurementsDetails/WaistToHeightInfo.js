import React, { Component } from "react";
import { View, StyleSheet, Text, Image, Dimensions } from "react-native";
import { R } from "Resources";
import { Bubble } from "Components";

const { height, width } = Dimensions.get("window");

export class WaistToHeightInfo extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    if (this.props.gender === "female") {
      this.state = {
        firstValue: 35,
        secondValue: 42,
        thirdValue: 46,
        fourthValue: 49,
        fifthValue: 54,
        sixthValue: 58,
      };
    } else {
      this.state = {
        firstValue: 35,
        secondValue: 43,
        thirdValue: 46,
        fourthValue: 52,
        fifthValue: 58,
        sixthValue: 63,
      };
    }
  }

  renderWtHRBubble(value) {
    let marginLeft = "-3%";
    if (value < this.state.firstValue) {
      marginLeft = "-5%";
    } else if (
      value >= this.state.firstValue &&
      value < this.state.secondValue
    ) {
      marginLeft = (value - this.state.firstValue) * 1.1 + "%";
    } else if (
      value >= this.state.secondValue &&
      value < this.state.thirdValue
    ) {
      const margin = 5;
      marginLeft = margin + (value - this.state.secondValue) * 4.5 + "%";
    } else if (
      value >= this.state.thirdValue &&
      value < this.state.fourthValue
    ) {
      const margin = 23;
      marginLeft = margin + (value - this.state.thirdValue) * 2.8 + "%";
    } else if (
      value >= this.state.fourthValue &&
      value < this.state.fifthValue
    ) {
      const margin = 48;
      marginLeft = margin + (value - this.state.fourthValue) * 5 + "%";
    } else if (
      value >= this.state.fifthValue &&
      value < this.state.sixthValue
    ) {
      let margin = 56;
      marginLeft = margin + (value - this.state.fifthValue) * 2.5 + "%";
    } else if (value >= this.state.sixthValue) {
      marginLeft = "69%";
    }
    const WtHR = "WtHR: " + value.toFixed(1) + "%";

    return (
      <View style={{ marginLeft: marginLeft, width: 100 }}>
        <Bubble value={WtHR} />
      </View>
    );
  }

  render() {
    const { ratio } = this.props;
    return (
      <View>
        {this.renderWtHRBubble(ratio)}
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <View style={{ width: "90%" }}>
            <Image style={styles.image} source={R.Images.rectangle} />
          </View>
          <View style={{ marginTop: 10, width: "90%", flexDirection: "row" }}>
            <Text style={[styles.textStyles]}>{this.state.firstValue}%</Text>
            <Text style={[styles.textStyles, { marginLeft: "10%" }]}>
              {this.state.secondValue}%
            </Text>
            <Text style={[styles.textStyles, { marginLeft: "12%" }]}>
              {this.state.thirdValue}%
            </Text>
            <Text style={[styles.textStyles, { marginLeft: "12%" }]}>
              {this.state.fourthValue}%
            </Text>
            <Text style={[styles.textStyles, { marginLeft: "12%" }]}>
              {this.state.fifthValue}%
            </Text>
            <Text style={[styles.textStyles, { marginLeft: "12%" }]}>
              {this.state.sixthValue}%
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 10,
    resizeMode: "contain",
  },
  textStyles: {
    color: R.Colors.COLOR_TEXT_GREY,
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 15,
    fontFamily: "Lato-Regular",
  },
});
