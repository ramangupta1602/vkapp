import React from "react";
import { View, Text, StyleSheet } from "react-native";

export const LoadingInstruction = ({ onClick }) => {
  return (
    <View style={[style.containerStyle]}>
      <Text style={[style.textStyle]}>
        These food items are recommended food items, however, you can eat any
        high calorie food to reach your goal faster.
      </Text>

      <Text style={[style.ctaTextStyle]} onPress={onClick}>
        Ok got it
      </Text>
    </View>
  );
};

const style = StyleSheet.create({
  containerStyle: {
    marginTop: 8,
    padding: 12,
    backgroundColor: "#E1EBF2",
    borderRadius: 10
  },

  textStyle: {
    color: "#282727",
    fontFamily: "Lato-Regular",
    fontSize: 12,
    letterSpacing: 0.49,
    lineHeight: 15
  },

  ctaTextStyle: {
    color: "#D0444C",
    fontFamily: "Lato-Regular",
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 0.49,
    lineHeight: 15,
    paddingTop: 6,
    width: 80
    // paddingRight: 10,
  }

  /*
.ok-got-it {
	height: 15px;
	width: 51px;
	color: #D0444C;
	font-family: Lato;
	font-size: 12px;
	font-weight: 500;
	letter-spacing: 0.49px;
	line-height: 15px;
}
  */
});
