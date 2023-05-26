import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import { R } from "Resources";
class Header extends Component {
  render() {
    return <View />;
  }
}

export default Header;

export const styles = StyleSheet.create({
  width: Dimensions.get("window").width,
  height: Dimensions.get("window").height,

  container: {
    backgroundColor: R.Colors.COLOR_APP_BACKGROUND,
    justifyContent: "flex-start",
    flex: 1,
    paddingBottom: 10,
  },

  secondContainer: {
    backgroundColor: R.Colors.COLOR_APP_BACKGROUND,
    justifyContent: "flex-start",
    paddingTop: 12,
    paddingRight: 24,
    paddingLeft: 24,
    flex: 2,
  },
  textFieldSteps: {
    fontSize: 14,
    marginLeft: 10,
    color: R.Colors.COLOR_TEXT_LIGHT,
    fontFamily: "Lato-Regular",
    fontWeight: "500",
  },
  headerContainer: {
    height: 50,
    marginTop: 20,
    marginLeft: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  mainHeaderText: {
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: "Lato-Regular",
    letterSpacing: 0.22,
    lineHeight: 34,
    color: R.Colors.COLOR_TEXT,
  },
  title: {
    marginTop: 8,
    fontSize: 14,
    marginBottom: 20,
    fontFamily: "Lato-Regular",
    lineHeight: 18,
    color: R.Colors.COLOR_TEXT,
  },
  gridContainer: {
    flexDirection: "column",
    flex: 1,
    justifyContent: "flex-start",
  },
  moodRow: {
    flexDirection: "row",
  },
  buttonStyle: {
    width: "85%",
    height: 50,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 5,
    flexDirection: "row",
    backgroundColor: R.Colors.COLOR_BUTTON,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    position: "absolute",
    bottom: 20,
  },
  textStyle: {
    color: R.Colors.COLOR_WHITE,
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "Lato-Regular",
  },
  imageBack: {
    width: 25,
    height: 20,
    resizeMode: "contain",
  },
  backButtonStyle: {
    padding: 10,
  },
});
