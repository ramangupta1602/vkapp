import React from "react";
import { View } from "react-native";
import { styles } from "./style";

export default function DividerLines({ isForDailyPerformance, height }) {
  return (
    <View
      style={{
        alignContent: "flex-end",
        position: "absolute",
        height,
        bottom: 38,
        backgroundColor: "transparent",
        left: 16,
        right: 16
      }}
    >
      <View
        style={[
          { height: 1 },
          styles.bottomBorderStyle,
          { backgroundColor: "transparent" }
        ]}
      />

      <View
        style={[
          styles.horizontalBoxStyle,
          styles.bottomBorderStyle,
          { backgroundColor: "transparent" }
        ]}
      />
      <View
        style={[
          styles.horizontalBoxStyle,
          styles.bottomBorderStyle,
          { backgroundColor: "transparent" }
        ]}
      />

      {isForDailyPerformance && (
        <View
          style={[
            styles.horizontalBoxStyle,
            styles.bottomBorderStyle,
            { backgroundColor: "transparent" }
          ]}
        />
      )}

      <View
        style={[
          styles.horizontalBoxStyle,
          styles.bottomBorderStyle,
          { backgroundColor: "transparent" }
        ]}
      />
      <View
        style={[styles.horizontalBoxStyle, { backgroundColor: "transparent" }]}
      />
      {/* <View style={[styles.horizontalBoxStyle, { backgroundColor: 'blue' }]} /> */}
    </View>
  );
}
