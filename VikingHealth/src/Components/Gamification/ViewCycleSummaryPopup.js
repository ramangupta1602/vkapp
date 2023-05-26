import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import Styles from "./styles";
import { R } from "../../Resources/R";
import { strings } from "../../utility/locales/i18n";

const ViewCycleSummaryPopup = ({ onClick }) => {
  return (
    <View
      style={[
        Styles.gamificationCardStyles,
        { width: "100%", paddingBottom: 22 },
      ]}>
      <Text style={[Styles.titleStyle, localStyle.titleStyle]}>
        {strings("ViewCycleSummary.yourSummary")}
      </Text>

      <Image
        style={[Styles.imageStyle, localStyle.imageStyle]}
        source={R.Images.killingIt}
      />

      <Text style={localStyle.messageStyle}>
        {strings("ViewCycleSummary.programCompleted")}
      </Text>

      <Text style={localStyle.viewSummaryButtonStyle} onPress={onClick}>
        {strings("ViewCycleSummary.viewSummary")}
      </Text>
    </View>
  );
};

const localStyle = StyleSheet.create({
  titleStyle: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.77,
    lineHeight: 17,
    fontFamily: "Lato-Regular",
  },
  imageStyle: {
    width: 176,
    height: 180,
    marginBottom: 0,
    marginTop: 30,
  },
  messageStyle: {
    color: "rgba(2,68,129,1)",
    fontFamily: "Lato-Semibold",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.57,
    lineHeight: 22,
    textAlign: "center",
    marginTop: 39,
  },

  viewSummaryButtonStyle: {
    padding: 10,
    alignSelf: "center",
    color: " rgba(206,54,62,1)",
    fontFamily: "Lato-Bold",
    fontSize: 14,
    fontWeight: "bold",
    letterSpacing: 0,
    lineHeight: 12,
    marginTop: 42,
    textAlign: "center",
  },
});

export default ViewCycleSummaryPopup;
