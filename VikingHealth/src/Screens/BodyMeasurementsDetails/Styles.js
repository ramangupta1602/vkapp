import { StyleSheet } from "react-native";
import { R } from "Resources";
export const styles = StyleSheet.create({
  container: {
    backgroundColor: R.Colors.COLOR_APP_BACKGROUND,
    justifyContent: "flex-start",
    flex: 1
  },
  headerContainer: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center"
  },
  buttonContainer: {
    flexDirection: "column",
    justifyContent: "flex-end",
    padding: 44,
    paddingTop: 0,
    flex: 1
  },
  imagePlus: {
    height: 24,
    width: 24,
    resizeMode: "contain"
  },
  imageInfo: {
    height: 14,
    width: 14,
    resizeMode: "contain"
  },
  weightContainer: {
    marginTop: 30,
    marginLeft: 10,
    marginRight: 10,
    flexDirection: "row",
    justifyContent: "space-around"
  },
  bmiContainer: {
    marginLeft: 38,
    marginRight: 38,
    marginTop: 32,
    alignItems: "center",
    justifyContent: "center"
  },
  lineStyle: {
    marginLeft: 27,
    marginRight: 27,
    marginTop: 20,
    height: 1,
    backgroundColor: "#456789"
  },
  heightToWaistRatio: {
    fontFamily: "Lato-Regular",
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 17,
    letterSpacing: 0.13,
    color: R.Colors.COLOR_TEXT
  },
  summaryHistoryContainer: {
    margin: 16
  }
});
