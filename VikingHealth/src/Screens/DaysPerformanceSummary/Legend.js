import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { MOODS } from "../DaysPerformance/Moods";

export const Legend = () => (
  <View style={style.legendContainer}>
    <LegendItem mood={MOODS["5"]} />
    <LegendItem mood={MOODS["4"]} />
    <LegendItem mood={MOODS["3"]} />
    <LegendItem mood={MOODS["2"]} />
    <LegendItem mood={MOODS["1"]} />
  </View>
);

const LegendItem = (moodValue) => {
  let mood = moodValue.mood;
  return (
    <View style={style.itemContainer}>
      <View style={[style.legendDot, { backgroundColor: mood.color }]} />
      <Text style={style.textStyle}>{mood.name}</Text>
    </View>
  );
};

const style = StyleSheet.create({
  legendContainer: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  textStyle: {
    color: "#3f3f3f",
    fontFamily: "Lato-Regular",
    fontSize: 12,
    letterSpacing: 0.44,
    lineHeight: 15,
  },
});
