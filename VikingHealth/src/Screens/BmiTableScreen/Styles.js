import { StyleSheet, Platform } from "react-native";

export const CELL_WIDTH = 50;
export const CELL_HEIGHT = 36;

const style = StyleSheet.create({
  containerStyle: {
    flex: 1,
    backgroundColor: "rgba(239,245,249,1)",
  },

  bmiQuestionStyle: {
    marginTop: 18,
  },

  bmiAnswer: {
    color: "rgba(40,39,39,1)",
    fontFamily: "Lato-Regular",
    fontSize: 14,
    letterSpacing: 0,
    lineHeight: 20,
    textAlign: "justify",
  },

  contentContainerStyle: {
    padding: 16,
  },

  moreInfoContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 16,
  },

  moreInfoTextStyle: {
    color: "rgba(40,39,39,1)",
    fontFamily: "Lato-Bold",
    fontSize: 14,
    fontWeight: "bold",
    letterSpacing: 0,
    lineHeight: 17,
  },

  moreInfoImageStyle: {
    width: 16,
    height: 16,
    marginLeft: 6,
  },

  infoImageContainer: {
    paddingRight: 20,
  },

  bmiStatusCardContainer: {
    marginTop: 24,
    flexDirection: "row",
    borderRadius: 10,
    backgroundColor: "rgba(150,222,78,1)",
  },

  moodIconContainerStyle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "white",
    marginLeft: 16,
    marginTop: -8,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "rgba(161,172,180,0.11)",
        shadowOffset: { height: 7, width: 2 },
        shadowOpacity: 1,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },

  shadowStyle: {
    ...Platform.select({
      ios: {
        shadowColor: "rgba(0,0,0,0.3)",
        shadowOffset: { height: 7, width: 7 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: 0,
      },
    }),
  },

  heightColumnContainerStyle: {
    zIndex: 20,
    backgroundColor: "white",
  },

  moodImage: {
    height: 36,
    width: 36,
    borderRadius: 18,
  },

  moodStatusContentStyle: {
    padding: 13,
    paddingBottom: 10,
  },

  statusCardTitleTextStyle: {
    color: "white",
    fontFamily: "Lato-Bold",
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 0,
    lineHeight: 24,
  },

  subTextStyle: {
    color: "white",
    fontFamily: "Lato-Bold",
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0.16,
    lineHeight: 17,
  },

  figureContainerStyle: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 17,
    marginBottom: 3,
  },

  statusCardBmiTextStyle: {
    color: "white",
    fontFamily: "Lato-Bold",
    fontSize: 38,
    fontWeight: "900",
    lineHeight: 38,
    letterSpacing: 0.3,
  },

  currentBmiTextStyle: {
    color: "white",
    fontFamily: "Lato-Medium",
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0.16,
    lineHeight: 17,
    marginLeft: 11,
  },

  seeMore: {
    color: "rgba(2,68,129,1)",
    fontFamily: "Lato-Bold",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0,
    lineHeight: 22,
    marginTop: 28,
  },

  bmiCardContainerStyle: {
    marginTop: 14,
    backgroundColor: "white",
    borderRadius: 8,
  },

  bmiCardInnerContainer: {
    margin: 6,
    flexDirection: "row",
    borderRadius: 8,
    overflow: "hidden",
  },

  bmiCardImageContainerStyle: {
    margin: 6,
    width: 56.5,
    height: 64,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },

  bmiCardImageStyle: {
    width: 20,
    resizeMode: "contain",
  },

  bmiCardFigureContainerStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    marginLeft: 11,
    marginRight: 10,
  },

  bmiStageNameStyle: {
    color: "rgba(2,68,129,1)",
    fontFamily: "Lato-Bold",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0,
    lineHeight: 22,
  },

  rangeTextStyle: {
    color: "rgba(129,145,162,1)",
    fontFamily: "Lato-Medium",
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0.16,
    lineHeight: 17,
  },

  yourBmiTextStyle: {
    color: "rgba(129,145,162,1)",
    fontFamily: "Lato-Medium",
    fontWeight: "500",
    fontSize: 14,
    letterSpacing: 0.16,
    lineHeight: 17,
  },

  bmiStyle: {
    color: "#024481",
    fontFamily: "Lato-Bold",
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 0,
    marginTop: 5,
    lineHeight: 20,
  },

  disclosureStyle: {
    paddingHorizontal: 15,
    justifyContent: "center",
  },

  seeMoreMessageStyle: {
    color: "rgba(129,145,162,1)",
    height: 34,
    fontFamily: "Lato-Medium",
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0.16,
    lineHeight: 17,
    marginRight: 58,
    marginTop: 4,
  },

  absoluteStyle: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    padding: 16,
  },

  tableContainer: {
    backgroundColor: "white",
    flex: 1,
    borderRadius: 8,
    marginTop: 12,
  },

  // BMI Table style
  headerStyle: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
  },

  staticCellContainer: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#30303010",
    marginBottom: -1,
  },

  staticCellStyle: {
    width: 74,
    flex: 1,
    alignSelf: "flex-end",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
  },

  staticCellUnitTextStyle: {
    color: "#8191A2",
    fontSize: 10,
    alignSelf: "center",
    marginTop: 3,
    marginBottom: 5,
  },

  cellStyle: {
    height: CELL_HEIGHT,
    width: CELL_WIDTH,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  headerCellStyle: {
    color: "rgba(40,39,39,1)",
    fontFamily: "Lato-Bold",
    fontSize: 14,
    width: CELL_WIDTH,
    textAlign: "center",
    letterSpacing: 0.16,
    lineHeight: 17,
  },

  heightColumnStyle: {
    height: CELL_HEIGHT,
    width: 74,
    justifyContent: "center",
    alignItems: "center",
  },

  headerColumnStyle: {
    height: 50,
    width: 36,
    justifyContent: "center",
    alignItems: "center",
  },

  cellTextStyle: {
    color: "white",
    fontFamily: "Lato-Bold",
    fontSize: 14,
    fontWeight: "bold",
    letterSpacing: 0.16,
    lineHeight: 17,
    width: 35,
    textAlign: "center",
  },

  bmiRightArrowStyle: {
    transform: [{ rotate: "180deg" }],
    width: 8,
    marginBottom: 5,
    height: 6,
    marginLeft: 4,
  },

  bmiTextStyle: {
    color: "#8191A2",
    fontFamily: "Lato-Medium",
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0.16,
    lineHeight: 17,
  },

  arrowStyle: {
    height: 11,
    width: 6.5,
  },

  infoPopUpContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
  },

  infoPopupView: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: "white",
  },

  bulletMarkContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  bulletStyle: {
    width: 8,
    height: 8,
    backgroundColor: "#8191A2",
    borderRadius: 4,
  },

  bulletText: {
    color: "#8191A2",
    fontFamily: "Lato-Medium",
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0.16,
    lineHeight: 17,
    marginLeft: 12,
  },

  calculateText: {
    color: "#282727",
    fontFamily: "Lato-Bold",
    fontSize: 14,
    fontWeight: "bold",
    letterSpacing: 0,
    lineHeight: 17,
    marginTop: 25,
  },

  proTipContainer: {
    flex: 1,
    backgroundColor: "rgba(237,227,227,1)",
    // height: 100,
    marginTop: 20,
    borderRadius: 10,
    marginLeft: -30,
    marginRight: -30,
    marginBottom: 4,
    justifyContent: "center",
    alignContent: "center",
  },

  proTipTextStyle: {
    color: "#282727",
    fontFamily: "Lato-Regular",
    fontSize: 14,
    letterSpacing: 0,
    lineHeight: 20,
    textAlign: "justify",
    paddingHorizontal: 30,
    paddingTop: 18,
    paddingBottom: 16,
  },
});

export default style;
