import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { styles } from "./Styles";

const ViewJourneyBar = ({ yourText, clickListener }) => {
  return (
    <TouchableOpacity
      style={styles.MyJourneyButtonStyle}
      onPress={clickListener}
      testID="viewJourney"
      accessibilityLabel={"viewJourney"}
    >
      <Text style={styles.viewMyJourneyTextStyle}>View {yourText} Journey</Text>
    </TouchableOpacity>
  );
};

export default ViewJourneyBar;
