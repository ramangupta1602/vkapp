import { StyleSheet } from "react-native";

export const Styles = StyleSheet.create({
  thinLineStyle: {
    width: 1,
    height: 7,
    alignSelf: "flex-end",
    backgroundColor: "#FFB07F"
  },

  cycleIndicatorLeftTextContainerStyle: {
    height: 20,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: "#FFB07F",
    paddingHorizontal: 9
  },

  cycleIndicatorRightTextContainerStyle: {
    height: 20,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 10,
    backgroundColor: "#FFB07F",
    paddingHorizontal: 9
  },

  cycleIndicatorTextStyle: {
    fontFamily: "Lato-Regular",
    fontSize: 12,
    lineHeight: 15,
    letterSpacing: 0.43,
    paddingTop: 1,
    color: "#024481"
  }
});
