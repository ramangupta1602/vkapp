import React, { Component } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { R } from "Resources";
import { API_DATE_FORMAT, DISPLAY_DATE_FORMAT } from "Library/Constants";
import AppUtil from "Library/Utils/AppUtil";
import { USER_TYPE } from "Library/Constants";
import moment from "moment";
import { inject, observer } from "mobx-react";

@inject("userAccountStore", "loginUserStore")
@observer
export class GraphHistory extends Component {
  onViewClicked() {
    if (this.props.onClick) {
      this.props.onClick(this.props.date, this.props.value);
    }
  }

  render() {
    const {
      displayValue,
      unit,
      change,
      date,
      color,
      isFromWaterIntake,
      isCurrentCycle,
    } = this.props;

    this.userType = this.props.loginUserStore.userType;

    let changeText = "";
    let dotColor = isFromWaterIntake === true ? "#64C5E2" : "#387BF4";
    let isChangeAvailable = false;
    if (change) {
      isChangeAvailable = true;
      if (change == 0) {
        changeText = "- 0 " + unit;
        dotColor = "#7ED321";
      } else if (change > 0) {
        changeText = "+ " + change.toFixed(1) + " " + unit;
        dotColor = "#D9433F";
      } else {
        changeText = "- " + Math.abs(change).toFixed(1) + " " + unit;
        dotColor = "#7ED321";
      }
    }
    const displayDate = moment(date, API_DATE_FORMAT).format(
      DISPLAY_DATE_FORMAT
    );

    return (
      <TouchableOpacity
        testID={displayDate}
        accessibilityLabel={displayDate}
        activeOpacity={
          isCurrentCycle && this.userType === USER_TYPE.PATIENT ? 0.2 : 1
        }
        onPress={() => this.onViewClicked()}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
          }}
        >
          <View style={{ alignItems: "center" }}>
            <View
              style={[
                styles.circleWeight,
                { backgroundColor: color ?? dotColor },
              ]}
            />

            <View
              style={{ width: 1, height: 50, backgroundColor: "#DEEAF2" }}
            />
          </View>

          <View
            style={{ marginLeft: 10, marginTop: -3, alignItems: "flex-start" }}
          >
            <Text style={styles.textDateStyle}> {displayDate} </Text>
            <View
              style={{
                marginTop: 5,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={styles.textTotalWeightStyle}>{displayValue}</Text>
              {isChangeAvailable && (
                <React.Fragment>
                  <View style={styles.circleGrey} />
                  <Text style={styles.textGainLoseStyle}>{changeText}</Text>
                </React.Fragment>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  circleWeight: {
    width: 8,
    height: 8,
    borderRadius: 8 / 2,
  },
  circleGrey: {
    width: 4,
    height: 4,
    borderRadius: 4 / 2,
    marginLeft: 20,
    backgroundColor: R.Colors.COLOR_TEXT_LIGHT,
  },
  textDateStyle: {
    color: R.Colors.COLOR_TEXT_LIGHT,
    fontFamily: "Lato-Regular",
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 0.13,
    lineHeight: 15,
  },
  textTotalWeightStyle: {
    color: R.Colors.COLOR_TEXT,
    fontFamily: "Lato-Regular",
    fontSize: 15,
    width: 85,
    fontWeight: "600",
  },
  textGainLoseStyle: {
    color: R.Colors.COLOR_TEXT_LIGHT,
    fontFamily: "Lato-Regular",
    fontSize: 14,
    marginLeft: 15,
    fontWeight: "bold",
    letterSpacing: 0.13,
    lineHeight: 17,
  },
});
