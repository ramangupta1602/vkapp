import React, { Component } from "react";
import { Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import * as DateUtil from "../../../../Library/Utils/DateUtil";
import moment from "moment";
import { DISPLAY_DATE_FORMAT } from "Library/Constants";
import { cardStyles } from "../CardStyles";
import { USER_TYPE } from "Library/Constants";

export class DayPerformanceCard extends Component {
  sentenceComponents(date) {
    const updatedDate = moment(date);
    const { userType } = this.props;
    const start = userType == USER_TYPE.PATIENT ? "You did " : "Performed ";

    if (DateUtil.isAbsoluteToday(updatedDate)) {
      return { start, end: " today!" };
    } else if (DateUtil.isAbsoluteYesterday(updatedDate)) {
      return { start, end: " yesterday!" };
    } else if (DateUtil.isAbsoluteWithinAWeek(updatedDate)) {
      return { start, end: " last week!" };
    } else {
      return {
        start,
        end: " on " + updatedDate.format(DISPLAY_DATE_FORMAT),
      };
    }
  }

  render() {
    const sentenceComponents = this.sentenceComponents(this.props.updatedDate);

    return (
      <TouchableOpacity
        testID={"dayPerformanceCard"}
        accessibilityLabel={"dayPerformanceCard"}
        activeOpacity={1}
        onPress={() => {
          this.props.onCardSelect(
            this.props.rewardPoints,
            this.props.isDataUnavailable
          );
        }}
      >
        <Text style={cardStyles.cardTitleStyle}>Day’s Performance</Text>

        <Image source={this.props.mood.icon} style={cardStyles.moodIconStyle} />
        <Text
          style={[
            cardStyles.subTextStyle,
            styles.text,
            { marginBottom: -5, height: 34 },
          ]}
        >
          {sentenceComponents.start}
          <Text style={{ fontFamily: "Lato-Bold" }}>
            {this.props.mood.name}
          </Text>
          {sentenceComponents.end}
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: "Lato-Regular",
    letterSpacing: 0.3,
  },
});
