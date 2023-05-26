import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { styles } from "./style";

export const CycleIndicator = ({
  currentCycle,
  intrinsicStyle,
  textStyle,
  onPress
}) => {
  return (
    <TouchableOpacity
      style={[styles.cycleContainer, intrinsicStyle]}
      activeOpacity={onPress ? 0.2 : 1}
      onPress={() => {
        if (onPress) {
          onPress();
        }
      }}
    >
      <Text style={[styles.cycleTextStyle, textStyle]}>
        Cycle {currentCycle}
      </Text>
    </TouchableOpacity>
  );
};
