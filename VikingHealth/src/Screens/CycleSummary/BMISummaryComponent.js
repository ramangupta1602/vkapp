import React from "react";
import { Text, View } from "react-native";
import Styles from "./styles";
import { strings } from "../../utility/locales/i18n";
import ComparisonBox from "./ComparisonBox";

function getMessage(initialBMI, finalBMI) {
  // initialBMI is double therefore I am making a shallow comparison with == instead of ===
  if (initialBMI == 0) {
    return strings("cycleSummary.noWeightLog");
  }

  const loss = finalBMI - initialBMI;

  if (loss > 1) {
    return strings("cycleSummary.bmiLower", {
      lossOrGain: "increased"
    });
  }

  return strings("cycleSummary.bmiLower", {
    lossOrGain: "lower"
  });
}

const BMISummaryComponent = ({ initialBMI, finalBMI }) => {
  const bmiLoss = Math.abs(finalBMI - initialBMI).toFixed(2);
  const message = getMessage(initialBMI, finalBMI);

  return (
    <View style={Styles.bmiContainerStyle}>
      <Text style={Styles.componentTitleStyle}>
        {strings("cycleSummary.bmi")}
      </Text>

      <Text style={Styles.bmiTextStyle}>
        {message}
        {initialBMI != 0 && (
          <Text style={Styles.bmiPointStyle}>{bmiLoss} points</Text>
        )}
      </Text>

      <View style={{ flexDirection: "row" }}>
        <ComparisonBox start={initialBMI} end={finalBMI} />
      </View>
    </View>
  );
};

export default BMISummaryComponent;
