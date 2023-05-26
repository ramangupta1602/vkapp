import React from "react";
import { View, Text, Image } from "react-native";
import Styles from "./styles";
import { strings } from "../../utility/locales/i18n";
import { R } from "../../Resources/R";

const TargetWeightShortContainer = ({ weight, unit }) => {
  if (weight < 1) {
    return null;
  }

  return (
    <View style={Styles.targetShortContainerStyle}>
      <Text style={Styles.targetShortTextStyle}>
        {strings("cycleSummary.targetShort", {
          amount: Math.abs(weight),
          unit
        })}
      </Text>

      <Image
        source={R.Images.SummaryTargetBadge}
        style={Styles.targetWeightBadgeImageStyle}
        resizeMode="contain"
      />
    </View>
  );
};

export default TargetWeightShortContainer;
