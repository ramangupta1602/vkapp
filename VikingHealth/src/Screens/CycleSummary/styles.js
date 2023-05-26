import { StyleSheet } from "react-native";
import { R } from "Resources";
import { boxShadowStyles } from "../../Components/Gamification/styles";

export const GAIN_COLOR = "#ED485C";
export const LOSS_COLOR = "rgba(48,210,112,1)";

const Style = StyleSheet.create({
  containerStyle: {
    flex: 1,
    backgroundColor: R.Colors.COLOR_APP_BACKGROUND,
  },
  headerContainer: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dataContainerStyle: {
    marginHorizontal: 16,
    marginTop: 18,
  },

  componentTitleStyle: {
    color: "#024481",
    fontFamily: "Lato-Bold",
    fontSize: 18,
    fontWeight: "bold",
    lineHeight: 22,
  },

  weightComponentStyle: {
    backgroundColor: "white",
    borderRadius: 10,
  },

  weightContainerStyle: {
    padding: 20,
    ...boxShadowStyles,
  },

  weightDetailStyle: {
    marginTop: 12,
  },

  weightLossContainerStyle: {
    flexDirection: "row",
    alignItems: "flex-end",
  },

  boldLossTextStyle: {
    color: "#024481",
    fontFamily: "Lato-bold",
    fontSize: 48,
    lineHeight: 57,
    fontWeight: "bold",
    letterSpacing: 0.37,
  },

  unitTextStyle: {
    color: "#024481",
    fontFamily: "Lato-Bold",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 0.09,
    lineHeight: 15,
    textTransform: "uppercase",
    marginBottom: 9,
    marginLeft: 1,
  },

  lossTextDescriptionStyle: {
    color: "#8191A2",
    fontFamily: "Lato-Semibold",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.11,
    lineHeight: 17,
    marginLeft: 12,
    marginRight: 37,
    alignSelf: "center",
  },

  graphStyle: {
    marginTop: 15,
  },

  bmiContainerStyle: {
    padding: 20,
  },

  bmiTextStyle: {
    marginTop: 12,
    color: "#8191A2",
    fontFamily: "Lato-Bold",
    fontSize: 18,
    letterSpacing: 0.14,
    lineHeight: 22,
  },

  bmiPointStyle: {
    color: "#024481",
  },

  comparisonBoxStyle: {
    borderRadius: 10,
    marginTop: 12,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#F2F2F2",
  },

  cmpBoxLeftContainerStyle: {
    marginLeft: 34,
    marginRight: 23,
    paddingTop: 6,
    paddingBottom: 8,
  },

  cmpBoxRightContainerStyle: {
    justifyContent: "center",
    backgroundColor: "#EFF5F9",
    paddingTop: 6,
    paddingBottom: 8,
    paddingHorizontal: 28,
    borderRadius: 10,
    marginLeft: -10,
  },

  comparisonFigureStyle: {
    fontFamily: "Lato-Bold",
    fontWeight: "bold",
    fontSize: 14,
    lineHeight: 17,
  },

  comparisonLabelStyle: {
    color: "#8191A2",
    fontFamily: "Lato-Semibold",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.09,
    lineHeight: 15,
  },

  startTextStyle: {
    color: "#8191A2",
  },

  endTextColor: {
    color: "#024481",
  },

  // Target Short container style...
  targetShortContainerStyle: {
    borderRadius: 10,
    backgroundColor: "#9376DD",
    flexDirection: "row",
    marginTop: 20,
    alignContent: "center",
    alignItems: "center",
  },

  targetShortTextStyle: {
    color: "white",
    fontSize: 12,
    marginRight: 20,
    fontFamily: "Lato-Semibold",
    lineHeight: 15,
    fontWeight: "bold",
    flex: 1,
    marginLeft: 10,
  },

  targetWeightBadgeImageStyle: {
    width: 56,
    height: 58,
    marginRight: 17,
    marginTop: 5,
  },

  // BM comparison table style
  comparisonTableContainerStyle: {
    backgroundColor: "#EFF5F9",
    paddingTop: 7,
    paddingBottom: 13,
    borderRadius: 10,
    paddingLeft: 20,
    paddingRight: 40,
  },

  comparisonRowStyle: {
    flex: 1,
    flexDirection: "row",
    borderRadius: 5,
    paddingLeft: 5,
    alignContent: "center",
    backgroundColor: "#EFF5F9",
    justifyContent: "center",
  },

  nameColumnStyle: {
    flex: 2,
    paddingTop: 3,
    paddingBottom: 3,
    color: "#8191A2",
    fontSize: 12,
    fontWeight: "bold",
    lineHeight: 15,
  },

  startColumnStyle: {
    width: 60,
    flex: 1.3,
    paddingLeft: 13,
    paddingTop: 3,
    paddingBottom: 3,
    color: "#8191A2",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 0.09,
    lineHeight: 15,
  },

  wthrContainerStyle: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 17,
    paddingRight: 10,
  },

  wthrLossTextStyle: {
    color: "#024481",
    fontFamily: "Lato-Semibold",
    fontSize: 28,
    fontWeight: "600",
    letterSpacing: 0.22,
    lineHeight: 34,
    marginRight: 4,
  },

  waterCircleStyle: {
    width: 118,
    height: 118,
    marginLeft: -20,
    alignItems: "center",
    paddingTop: 16,
    paddingLeft: 10,
  },

  textContainerStyle: {
    flexDirection: "row",
    flexWrap: "wrap",
    flexShrink: 1,
    marginBottom: 10,
  },

  waterIntakeMessageStyle: {
    color: "#8191A2",
    fontFamily: "Lato-Semibold",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.11,
    lineHeight: 17,
    marginLeft: 15,
    marginRight: 10,
  },

  avgTextStyle: {
    color: "#8191A2",
    fontFamily: "Lato-Semibold",
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.08,
    lineHeight: 12,
  },

  waterAvgTextStyle: {
    color: "#024481",
    fontFamily: "Lato-Bold",
    fontSize: 14,
    fontWeight: "bold",
    letterSpacing: 0.11,
    lineHeight: 17,
  },

  waterIntakeBadgeImageStyle: {
    height: 80,
    width: 77,
  },

  allBadgeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 20,
    paddingRight: 24,
    marginTop: 27,
    marginBottom: 13,
  },

  badgeContainer: {
    alignItems: "center",
  },

  badgeCountTextStyle: {
    marginTop: 9,
    color: "#8191A2",
    fontFamily: "Lato-Semibold",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.09,
    lineHeight: 15,
  },

  currentValueContainer: {
    backgroundColor: "rgba(239,245,249,1)",
    borderRadius: 10,
    flexDirection: "row",
    paddingVertical: 7,
    paddingLeft: 12,
    paddingRight: 16,
    alignItems: "center",
  },

  currentWthrTextStyle: {
    color: "rgba(2,68,129,1)",
    fontFamily: "Lato-Semibold",
    fontSize: 28,
    fontWeight: "600",
    letterSpacing: 0.22,
    lineHeight: 34,
  },

  lossIndicatorContainer: {
    backgroundColor: "rgba(48,210,112,1)",
    marginTop: 3,
    marginLeft: 8,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 2,
    paddingHorizontal: 7,
  },

  arrowStyle: {
    height: 11,
    marginRight: 4,
  },

  lossTextStyle: {
    color: "rgba(255,255,255,1)",
    fontFamily: "Lato-Bold",
    fontWeight: "bold",
    letterSpacing: 0,
    lineHeight: 22,
  },

  pointTextStyle: {
    color: "rgba(255,255,255,1)",
    fontFamily: "Lato",
    fontSize: 10,
    letterSpacing: 0.08,
    lineHeight: 12,
  },

  startingWthrTextStyle: {
    color: "rgba(129,145,162,1)",
    fontFamily: "Lato",
    fontSize: 20,
    letterSpacing: 0.16,
    lineHeight: 24,
  },

  startingWthrContainerStyle: {
    flex: 1,
    alignSelf: "center",
    marginLeft: 17,
  },

  wthrMessageTextStyle: {
    color: "rgba(129,145,162,1)",
    fontFamily: "Lato-Semibold",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.11,
    lineHeight: 17,
    marginTop: 12,
  },

  /**
.you-have-reduced-you {
  height: 51px;
  width: 279px;
  color: rgba(129,145,162,1);
  font-family: Lato;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.11px;
  line-height: 17px;
}
   */
});

export default Style;
