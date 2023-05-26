import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Styles } from "./styles";
import * as CycleIndicatorColorPallate from "../../../Components/Graphs/CycleIndicatorColorPallate";

const CycleIndicator = ({ cycleNo, style, month }) => {
  const cycle = Math.floor(month);
  const shouldShowOnLeft = cycle % 2 === 0;

  const textContainerStyle = shouldShowOnLeft
    ? Styles.cycleIndicatorLeftTextContainerStyle
    : Styles.cycleIndicatorRightTextContainerStyle;

  const lineAlignment = shouldShowOnLeft ? "flex-start" : "flex-end";
  const {
    backgroundColor,
    textColor
  } = CycleIndicatorColorPallate.getColorForIndex(cycleNo);

  return (
    <TouchableOpacity style={style}>
      <View
        style={[
          Styles.thinLineStyle,
          { alignSelf: lineAlignment, backgroundColor }
        ]}
      />
      <View style={[textContainerStyle, { backgroundColor }]}>
        <Text
          style={[Styles.cycleIndicatorTextStyle, { color: textColor }]}
        >{`Cycle ${cycleNo + 1}`}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default CycleIndicator;
