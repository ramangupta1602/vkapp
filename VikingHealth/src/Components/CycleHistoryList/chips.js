import React from "react";
import { Text, TouchableOpacity } from "react-native";
import Style from "./styles";

const Chips = ({
  isSelected = false,
  label,
  style,
  index,
  onChipSelected,
  borderColor = "#EFF5F9",
  selectedColor = "#EFF5F9",
  selectedTextColor = "#024481",
  unselectedColor = "#EFF5F9",
  unSelectedTextColor = "#8191A2",
}) => {
  const selectedStyle = isSelected
    ? { backgroundColor: selectedColor }
    : { ...Style.unSelectedChipStyle, backgroundColor: unselectedColor };

  const textStyle = isSelected
    ? { color: selectedTextColor }
    : { color: unSelectedTextColor };

  const border = isSelected ? "transparent" : borderColor;

  return (
    <TouchableOpacity
      testID={label}
      accessibilityLabel={label}
      style={[selectedStyle, Style.chipStyle, { borderColor: border }]}
      onPress={() => {
        if (onChipSelected) {
          onChipSelected(index);
        }
      }}
    >
      <Text style={[Style.chipTextStyle, textStyle, style]}>{label}</Text>
    </TouchableOpacity>
  );
};

export default Chips;
