import React, { Component } from "react";
import { StyleSheet } from "react-native";
import WaterGamificationCard from "./WaterGamificationCard";

export class NextAchievement extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <WaterGamificationCard
        onClick={this.props.onClick}
        gamificationModel={this.props.gamificationModel}
        subTextStyle={[localStyle.subTextStyle, this.props.subTextStyle]}
        textStyle={[localStyle.titleStyle, this.props.textStyle]}
        imageStyle={[this.props.imageStyle, this.props.imageStyle]}
        actionStyle={[this.props.actionStyle, this.props.actionStyle]}
      >
        {this.props.children}
      </WaterGamificationCard>
    );
  }
}

const localStyle = StyleSheet.create({
  subTextStyle: {
    color: "#8191A2"
  },

  titleStyle: {
    fontFamily: "Lato-Semibold",
    fontSize: 24,
    fontWeight: "600",
    letterSpacing: 0.77,
    lineHeight: 29,
    paddingHorizontal: 0
  }
});
