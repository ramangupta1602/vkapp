import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { R } from "Resources";

export const ShowWeight = (props) => (
  <View style={styles.container}>
    <View style={styles.backGroundcontainer}>
      <Text
        style={styles.textStyle}
        testID={"text"}
        accessibilityLabel={"text"}
      >
        {props.text}
        <Text
          style={{ fontSize: 12 }}
          testID={"unit"}
          accessibilityLabel={"unit"}
        >
          {" "}
          {props.unit}
        </Text>
      </Text>
    </View>
    <Text
      style={styles.textLightStyle}
      testID={"weight"}
      accessibilityLabel={"weight"}
    >
      {props.weight}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },

  backGroundcontainer: {
    backgroundColor: R.Colors.COLOR_WHITE,
    width: 90,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    borderColor: R.Colors.COLOR_WHITE,
  },
  textStyle: {
    fontFamily: "Lato-Regular",
    fontSize: 16,
    fontWeight: "bold",
    lineHeight: 16,
    color: R.Colors.COLOR_TEXT_NUMBER,
    textAlign: "center",
  },
  textLightStyle: {
    fontFamily: "Lato-Regular",
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 16,
    marginTop: 5,
    color: R.Colors.COLOR_TEXT_GREY,
  },
});
