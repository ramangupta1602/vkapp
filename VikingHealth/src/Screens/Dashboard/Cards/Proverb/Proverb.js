import React from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { R } from "Resources";
export const Proverb = (props) => {
  return (
    <LinearGradient
      locations={[0, 0.46, 1]}
      useAngle
      angle={137}
      colors={["#86A8E7", "#47AEE0", "#91EAE4"]}
      style={styles.linearGradient}
    >
      <View style={{ flex: 1, alignContent: "center" }}>
        <Image style={styles.quoteStyle} source={R.Images.quotesProverb} />
        <Text style={styles.textStyle}>{props.quotes}</Text>
        <TouchableOpacity
          accessibilityLabel={"closeProverb"}
          testID={"closeProverb"}
          onPress={props.onClick}
          style={styles.crossButtonStyle}
        >
          <Image style={styles.crossStyle} source={R.Images.crossProverbIcon} />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    borderRadius: 10,
  },
  textStyle: {
    fontFamily: "Lato-Regular",
    fontSize: 18,
    letterSpacing: 0.54,
    lineHeight: 22,
    paddingLeft: 20,
    paddingTop: 22,
    paddingRight: 20,
    paddingBottom: 20,
    color: R.Colors.COLOR_APP_BACKGROUND,
  },
  quoteStyle: {
    height: 27,
    width: 33,
    position: "absolute",
    top: 12,
    left: 12,
  },
  crossButtonStyle: {
    position: "absolute",
    right: 12,
    top: 8,
  },
  crossStyle: {
    height: 20,
    width: 20,
  },
});
