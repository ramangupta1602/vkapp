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
  summaryHistoryContainer: {
    margin: 16
  },

  MyJourneyButtonStyle: {
    height: 27,
    borderRadius: 13,
    backgroundColor: "#E1EBF2",
    margin: 27,
    marginTop: 0,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  viewMyJourneyTextStyle: {
    height: 15,
    width: 200,
    color: "#1072E0",
    fontFamily: "Lato-Regular",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.51,
    lineHeight: 15,
    backgroundColor: "transparent",
    textAlign: "center"
  }
});
