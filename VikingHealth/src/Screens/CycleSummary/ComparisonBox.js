import React from "react";
import { View, Text } from "react-native";
import Styles from "./styles";
import { strings } from "../../utility/locales/i18n";

const ComparisonBox = ({ start, end }) => {
  return (
    <View style={Styles.comparisonBoxStyle}>
      <View style={Styles.cmpBoxLeftContainerStyle}>
        <Text style={[Styles.comparisonFigureStyle, Styles.startTextStyle]}>
          {start}
        </Text>
        <Text style={Styles.comparisonLabelStyle}>
          {strings("cycleSummary.start")}
        </Text>
      </View>
      <View style={Styles.cmpBoxRightContainerStyle}>
        <Text style={[Styles.comparisonFigureStyle, Styles.startTextStyle]}>
          {end}
        </Text>
        <Text style={Styles.comparisonLabelStyle}>
          {strings("cycleSummary.end")}
        </Text>
      </View>
    </View>
  );
};

export default ComparisonBox;
