import { StyleSheet } from "react-native";
import { R } from "Resources";

const styles = StyleSheet.create({
  container: {
    backgroundColor: R.Colors.COLOR_WHITE,
    borderRadius: 10
    // padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    alignItems: "flex-start"
  },
  horizontalSeparator: {
    height: 1,
    backgroundColor: R.Colors.COLOR_SHADOW
  },
  blockContainer: {
    padding: 16
  },
  nameStyle: {
    color: R.Colors.COLOR_TEXT,
    fontFamily: "Lato-Regular",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.12,
    lineHeight: 17
  },
  weightLossPrgramHeaderStyle: {
    color: R.Colors.COLOR_TEXT,
    fontFamily: "Lato-Regular",
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 17
  },
  editTextStyle: {
    color: "#CE363E",
    fontFamily: "Lato-Regular",
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0.4,
    lineHeight: 17,
    padding: 5,
    paddingTop: 0
  },
  subInfoTextStyle: {
    color: R.Colors.COLOR_TEXT_GREY,
    fontFamily: "Lato-Regular",
    fontSize: 14,
    lineHeight: 14,
    paddingVertical: 4,
    marginRight: 20
  },
  weightProgramEndStyle: {
    color: R.Colors.COLOR_TEXT_GREY,
    fontFamily: "Lato-Regular",
    fontSize: 12,
    letterSpacing: 0.19,
    lineHeight: 15,
    marginTop: 5
    // marginLeft: 3
  },
  boxWithShadow: {
    shadowColor: R.Colors.COLOR_SHADOW,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 1
  },

  subViewContainerStyle: {
    marginLeft: 2,
    alignItems: "center",
    flexDirection: "row"
  }
});

export default styles;
