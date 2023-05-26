import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { R } from "Resources";
import CircularRing from "../../Resources/ImageFromCode/CircularRing";

export class PhaseComponent extends Component {
  render() {
    return (
      <View style={[styles.container, { ...this.props.containerStyle }]}>
        <View
          style={[
            styles.phaseBackGround,
            { backgroundColor: "white", ...this.props.style },
          ]}>
          <CircularRing
            style={{ marginBottom: 5, backgroundColor: "red" }}
            color={this.props.textColor}
          />

          <View style={{ flexDirection: "column" }}>
            <View style={{ flexDirection: "row" }}>
              <Text style={[styles.phaseText, { color: this.props.textColor }]}>
                {this.props.phaseText}
              </Text>
              <View style={{ marginLeft: 11, position: "absolute", left: 101 }}>
                {this.props.children}
              </View>
            </View>

            <Text style={[styles.text]}>{this.props.descText}</Text>
          </View>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: R.Colors.COLOR_WHITE,
    paddingLeft: 16,
    borderRadius: 10,
    paddingBottom: 16,
    paddingRight: 32,
    marginTop: 17,
    textAlign: "justify",
  },
  text: {
    fontSize: 12,
    fontFamily: "Lato-Regular",
    lineHeight: 16,
    marginTop: 4,
    color: "#8191A2",
  },
  phaseBackGround: {
    marginTop: 17,

    borderRadius: 15,
    backgroundColor: "#9ED0F4",
    flexDirection: "row",
  },
  phaseText: {
    color: "#3AA5F6",
    fontFamily: "Lato-Regular",
    fontSize: 12,
    lineHeight: 15,
    fontWeight: "bold",
    letterSpacing: 0.43,
  },
});
