import React, { Component } from "react";
import { StyleSheet } from "react-native";
import * as GamificationObject from "./GamificationModel";
import { NextAchievement } from "./WaterIntakeGamification/WaterGamificationCard";

export default class CalorieIntakeCompleteModal extends Component {
  render() {
    return (
      <NextAchievement
        onClick={this.props.onClick}
        gamificationModel={GamificationObject.CalorieIntakeCompleted}
        subTextStyle={localStyle.subTextStyle}
        imageStyle={localStyle.imageStyle}
        actionStyle={localStyle.actionStyle}
      />
    );
  }
}

const localStyle = StyleSheet.create({
  imageStyle: {
    width: 313,
    height: 250,
    marginHorizontal: 10,
    marginTop: 29,
    marginBottom: 22,
  },
  subTextStyle: {
    color: "#024481",
    fontFamily: "Lato-Regular",
    letterSpacing: 0.48,
    fontSize: 16,
    textAlign: "center",
    lineHeight: 19,
    marginTop: 9,
  },
  actionStyle: {
    marginTop: 60,
  },
});
