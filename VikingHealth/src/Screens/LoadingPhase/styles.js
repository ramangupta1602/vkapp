import { Platform, StyleSheet } from "react-native";
import { R } from "../../Resources/R";

const boxShadowStyle = {
  ...Platform.select({
    ios: {
      shadowColor: "rgba(161, 172, 180, 0.11)",
      shadowOffset: { height: 5, width: 9 },
      shadowRadius: 3,
    },
    android: {
      elevation: 0.5,
    },
  }),
};

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: R.Colors.COLOR_APP_BACKGROUND,
    flex: 1,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 16,
  },
  centerContentStyle: {
    alignContent: "center",
    alignItems: "center",
  },
  pageTitleStyle: {
    height: 17,
    color: "#8191A2",
    fontFamily: "Lato-Medium",
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0.16,
    lineHeight: 17,
    paddingLeft: 1,
  },
  infoStyle: {
    height: 16,
    width: 16,
    marginLeft: 9,
    marginTop: 1,
  },

  nameStyle: {
    height: 28,
    color: "#024481",
    fontFamily: "Lato-Bold",
    fontSize: 28,
    letterSpacing: 0.22,
    lineHeight: 28,
    marginTop: 20,
  },

  loadingPhaseContainerStyle: {
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    // height: 463,
    marginTop: 24,
    ...boxShadowStyle,
  },

  skipLoadingContainerStyle: {
    marginTop: 33,
    borderTopWidth: 1,
    borderColor: "#E8EEF2",
    flexDirection: "row",
    justifyContent: "center",
  },

  skipLoadingButtonStyle: {
    flexDirection: "row",
    flexWrap: "wrap",
    flexShrink: 1,
    marginVertical: 26,
  },

  skipLoadingTextStyle: {
    color: R.Colors.COLOR_TEXT_NUMBER_HIGHLIGHTED,
    fontFamily: "Lato-bold",
    fontSize: 14,
    letterSpacing: 0,
    lineHeight: 14,
    textTransform: "uppercase",
  },

  loadingPhaseTitleContainer: {
    marginLeft: 13,
    marginTop: 14,
    paddingRight: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  loadingPhaseTitleStyle: {
    height: 17,
    fontFamily: "Lato-Bold",
    fontWeight: "700",
    fontSize: 14,
    letterSpacing: 0.5,
    lineHeight: 17,
    color: "#F5BC2F",
  },

  dayStyle: {
    alignSelf: "flex-end",
    width: 85,
    alignItems: "center",
    justifyContent: "center",
    height: 23,
    backgroundColor: "#EFF5F9",
    borderRadius: 11.5,
  },
  dayTextStyle: {
    color: "#024481",
    fontSize: 12,
    letterSpacing: 0.43,
    fontFamily: "Lato-Bold",
    fontWeight: "800",
    lineHeight: 15,
  },

  animationContainerStyle: {
    marginTop: 0,
    height: 313,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "red"
  },

  animationViewStyle: {
    height: 300,
    zIndex: 100,
  },
  animationStyle: {
    width: "105%",
    height: 330,
    marginTop: Platform.OS === "ios" ? 20 : 25,
    alignSelf: "center",
  },
  dragArrowImageStyle: {
    width: 12,
    height: 43,
    alignSelf: "center",
    position: "absolute",
    bottom: 80,
  },
  plateImageStyle: {
    width: 205,
    height: 70,
    alignSelf: "center",
    marginBottom: 22,
    zIndex: 0,
  },
  dragToAddCalories: {
    height: 15,
    width: 113,
    color: "#D0444C",
    fontFamily: "Lato-Regular",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.13,
    lineHeight: 15,
    marginBottom: 19,
  },

  caloriesIntakeStyle: {
    marginLeft: 46,
    marginTop: 46,
    height: Platform.OS === "ios" ? 46 : 50,
    overflow: "hidden",
    marginRight: 46,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  caloryIntakeTextStyle: {
    height: 24,
    color: "#024481",
    fontFamily: "Lato-Bold",
    fontSize: 20,
    lineHeight: 24,
    paddingTop: Platform.OS === "ios" ? 0 : 6,
  },
  caloryUnitTextStyle: {
    height: 15,
    fontSize: 12,
    lineHeight: 15,
  },
  caloryIntakeSubTextStyle: {
    height: 17,
    color: "#8191A2",
    fontFamily: "Lato-Medium",
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0.16,
    lineHeight: 17,
  },

  dateStyle: {
    color: "#8191A2",
    height: 15,
    fontFamily: "Lato-Semibold",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.43,
    lineHeight: 15,
  },

  walkThroughImageStyle: {
    height: 312,
    marginTop: 62,
    alignSelf: "center",
    width: "100%",
    marginBottom: 53,
  },

  walkThroughHeadingTextStyle: {
    color: "#024481",
    fontFamily: "Lato-Bold",
    fontSize: 18,
    fontWeight: "bold",
    lineHeight: 22,

    alignSelf: "center",
  },

  walkThroughSubTextStyle: {
    color: "#282727",
    fontFamily: "Lato-Regular",
    fontSize: 14,
    letterSpacing: 0.14,
    lineHeight: 17,
    textAlign: "center",
    marginTop: 11,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 50,
  },

  ctaButton: {
    marginLeft: 16,
    marginRight: 16,
    marginTop: 31,
    marginBottom: 20,
    backgroundColor: "#CE363E",
  },

  // Empty state style ....

  emptyImageStyle: {
    height: 330,
    width: "100%",
    paddingLeft: 26,
    paddingRight: 26,
    marginTop: 90,
    alignSelf: "center",
  },

  emptyTitleStyle: {
    color: "#282727",
    fontFamily: "Lato-Bold",
    fontSize: 28,
    fontWeight: "bold",
    letterSpacing: 0.22,
    lineHeight: 34,
    textAlign: "center",
    marginTop: 34,
  },

  startDateContainer: {
    borderStyle: "dashed",
    borderRadius: 5,
    borderColor: "rgba(159,171,184,0.46)",
    borderWidth: 1,
    marginHorizontal: 55,
    marginTop: 19.5,
    paddingVertical: 11.5,
  },

  emptyDateStyle: {
    color: "#43D35C",
    fontFamily: "Lato-Bold",
    letterSpacing: 0.64,
    fontSize: 18,

    lineHeight: 22,
    textAlign: "center",
    fontWeight: "bold",
  },

  emptyTap: {
    textAlign: "center",
    marginTop: 11,
    color: "#8191A2",
    fontFamily: "Lato-Medium",
    letterSpacing: 0,
    lineHeight: 20,
    fontWeight: "500",
  },

  learnMoreStyle: {
    height: 15,
    color: "#1072E0",
    fontFamily: "Lato",
    fontSize: 12,
    letterSpacing: 0.43,
    lineHeight: 15,
    marginTop: 25,
    alignSelf: "center",
  },

  explainationTextStyle: {
    width: 298,
    color: "#8191A2",
    fontSize: 12,
    letterSpacing: 0.13,
    fontFamily: "Lato",
    lineHeight: 15,
    marginTop: 15,
    alignSelf: "center",
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "#D9E2E8",
    paddingVertical: 9.5,
    paddingHorizontal: 13,
  },

  contineToLosingTextStyle: {
    color: "#8191A2",
    fontFamily: "Lato",
    fontSize: 14,
    letterSpacing: 0.5,
    textAlign: "center",
  },

  actionStyle: {
    color: "#CE363E",
    fontFamily: "Lato-Bold",
    fontSize: 14,
    fontWeight: "bold",
    lineHeight: 15,
    textAlign: "center",
    textTransform: "uppercase",
    marginTop: 100,
  },

  /*
.we-know-you-cant-wa {
	height: 72px;
	width: 298px;
	color: #8191A2;
	font-family: Lato;
	font-size: 12px;
	line-height: 18px;
}
  */
});

export default styles;
