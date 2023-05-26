import React from "react";
import { StyleSheet, Text } from "react-native";

export function WaterIntake50PercentCompleted() {
  return (
    <Text style={localStyle.textStyle}>
      <Text style={localStyle.completed50PercentHeading}>
        You are almost there{"\n"}
      </Text>
      You have compeleted 50% of your water intake goal today
    </Text>
  );
}

export function WaterIntakeDailyCompletionSubtext() {
  return (
    <Text style={localStyle.titleStyle}>
      You've
      <Text style={localStyle.waterIntakeStyleDailyCompleted}> Completed </Text>
      your water intake goal for the day
    </Text>
  );
}

export function NextAchievement7Days({ targetWaterIntake }) {
  return (
    <Text>
      Be consistent with your
      <Text style={localStyle.nextAchievementStyle}> {targetWaterIntake} </Text>
      goal {"\n"} for
      <Text style={localStyle.nextAchievementStyle}> 7 Days </Text> to unlock a
      new achievement.
    </Text>
  );
}

export function NextAchievement30Days() {
  // Wow! you are dedicated
  // Achieve the Master Badge by being consistent for next 30 Days.
  return (
    <Text>
      Wow! you are dedicated. {"\n"}Achieve the Master Badge by being consistent
      for <Text style={localStyle.nextAchievementStyle}>30 Days</Text>.
    </Text>
  );
}
//

export function WaterIntake7DaysAchievementCompletedSubText() {
  return (
    <Text style={localStyle.textStyle}>
      You have completed your water intake goal for
      <Text style={localStyle.waterIntakeStyleDailyCompleted}> 7 Days </Text>
    </Text>
  );
}

export function WaterIntake30DaysAchievementCompletedSubText() {
  return (
    <Text style={localStyle.textStyle}>
      You have completed the water intake goal for
      <Text style={localStyle.waterIntakeStyleDailyCompleted}> 30 Days </Text>
    </Text>
  );
}

const localStyle = StyleSheet.create({
  waterIntakeStyleDailyCompleted: {
    color: "#43D35C",
  },

  nextAchievementStyle: {
    fontWeight: "bold",
  },
  completed50PercentHeading: {
    fontFamily: "Lato-Semibold",
    fontSize: 24,
    fontWeight: "600",
    letterSpacing: 0.77,
    lineHeight: 29,
    paddingBottom: 10,
  },

  textStyle: {
    color: "#024481",
    fontFamily: "Lato-Semibold",
    letterSpacing: 0.48,
    fontSize: 16,
    textAlign: "center",
    lineHeight: 19,
  },

  titleStyle: {
    color: "#024481",
    fontFamily: "Lato-Semibold",
    fontWeight: "600",
    fontSize: 16,
    letterSpacing: 0.51,
    textAlign: "center",
    lineHeight: 19,
  },
});
