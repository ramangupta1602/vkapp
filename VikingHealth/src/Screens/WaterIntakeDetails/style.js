import { StyleSheet, Dimensions, Platform } from "react-native";
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
  waterLevelContainer: {
    marginTop: 24,
    backgroundColor: "transparent",
    height: 206,
    width: Dimensions.get("window").width,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center"
  },
  waterLevelInnerContainer: {
    height: 206,
    backgroundColor: "transparent",
    flexDirection: "row",
    flex: 1,
    justifyContent: "center"
  },

  waterBubbleContainer: {
    width: 63,
    height: 206,
    backgroundColor: "transparent",
    marginRight: 12
  },
  waterLevelMarkerIndicator: {
    height: 206,
    borderRadius: 6,
    backgroundColor: "transparent",
    justifyContent: "space-between",
    marginLeft: 25,
    alignItems: "center"
  },
  waterLevelMarkerIndicatorText: {
    height: 40,
    color: "#8191A2",
    fontFamily: "Lato-Regular",
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 0.13,
    lineHeight: 30
  },
  highlightedWaterLevelMarkerIndicatorText: {
    height: 40,
    color: "#7ED321",
    fontFamily: "Lato-Regular",
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 0.13,
    lineHeight: 30
  },
  bubbleImageStyle: {
    width: 62,
    height: 23,
    backgroundColor: "transparent"
  },
  imageLevelTextStyle: {
    height: 19,
    width: 34,
    color: "#FFFFFF",
    fontFamily: "Lato-Regular",
    fontSize: 16,
    lineHeight: 19,
    alignSelf: "center",
    backgroundColor: "transparent",
    position: "absolute",
    marginTop: 1
  },

  gradientContainer: {
    width: 55,
    height: 206,
    borderRadius: 6,
    backgroundColor: "white",
    position: "absolute",
    bottom: 0,
    shadowColor: "rgba(26,121,140,0.17)",
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 1.0,
    shadowRadius: 13,
    margin: 0,
    elevation: Platform.OS === "ios" ? 15 : 0,
    borderWidth: Platform.OS === "ios" ? 0 : 1,
    borderColor: Platform.OS === "ios" ? "transparent" : "#91EAE4"
  },
  waterLevelViewStyle: {
    width: 55,
    height: 206,
    borderRadius: 6,
    backgroundColor: "transparent",
    justifyContent: "space-between",
    position: "absolute"
  },
  waterLevelQuantityTextStyle: {
    height: 103,
    width: 55,
    textAlign: "center",
    color: "#1B4A6F",
    fontFamily: "Lato-Regular",
    fontSize: 12,
    lineHeight: 30,
    backgroundColor: "transparent"
  },
  linearGradient: {
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    position: "absolute",
    width: 55,
    bottom: 0
  },
  separatorStyle: {
    height: 1,
    width: Dimensions.get("window").width - 54,
    backgroundColor: "#D9E2E8",
    marginTop: 22,
    marginLeft: 27,
    marginRight: 27
  },
  summaryHistoryContainer: {
    margin: 32,
    width: Dimensions.get("window").width - 32,
    backgroundColor: "transparent",
    borderRadius: 10,
    marginLeft: 16
  },
  graphContainer: {
    height: 250,
    paddingTop: 20,
    width: Dimensions.get("window").width - 32,
    backgroundColor: "#F3F8FB",
    borderRadius: 10,
    flexDirection: "row"
  },
  verticalAxisContainer: {
    width: 32,
    height: "100%",
    backgroundColor: "transparent",
    alignItems: "center",
    marginTop: 5
  },

  lowerStyle: {
    flex: 1,
    justifyContent: "flex-end",
    alignContent: "flex-end",
    backgroundColor: "transparent"
  },

  upperStyle: {
    flex: 1,
    justifyContent: "flex-end",
    alignContent: "flex-start",
    backgroundColor: "transparent"
  },

  middleStyle: {
    flex: 1,
    justifyContent: "flex-end",
    alignContent: "center",
    backgroundColor: "transparent"
  },
  verticalAxisTextStyle: {
    height: 15,
    width: 35,
    textAlign: "right",
    color: "#A1AAB3",
    fontFamily: "Lato-Regular",
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 15,
    letterSpacing: 0
  },
  bottomBorderStyle: {
    borderBottomColor: "#D9E2E8",
    borderStyle: "solid",
    borderBottomWidth: 0.3
  },

  horizontalBoxStyle: { flex: 1 }
});
