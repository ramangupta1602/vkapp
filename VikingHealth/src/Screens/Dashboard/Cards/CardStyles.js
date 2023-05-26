import { StyleSheet, Dimensions } from "react-native";
import { R } from "../../../Resources/R";

export const cardStyles = StyleSheet.create({
  card: {
    borderRadius: 10,
    backgroundColor: "white",
    shadowColor: R.Colors.COLOR_SHADOW,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    padding: 16,
    margin: 8,
    elevation: 1,
  },

  cardTitle: {
    fontFamily: "Lato-Regular",
    fontWeight: "600",
    color: R.Colors.COLOR_DARK_BLUE,
    fontSize: 20,
    marginBottom: 5,
  },

  cardDarkContent: {
    fontFamily: "Lato-Regular",
    fontWeight: "600",
    color: R.Colors.COLOR_DARK_BLUE,
    fontSize: 18,
  },

  grayText: {
    fontFamily: "Lato-Semibold",
    fontSize: 14,
    fontWeight: "400",
    color: R.Colors.COLOR_GRAY,
  },

  image: {
    height: 20,
    width: 20,
    resizeMode: "contain",
  },

  footer: {
    marginTop: 16,
    fontFamily: "Lato-Regular",
    fontSize: 14,
    color: R.Colors.COLOR_GRAY,
  },

  singleRecordContainer: {
    borderRadius: 10,
    backgroundColor: "white",
    shadowColor: R.Colors.COLOR_SHADOW,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    margin: 7.5,
    overflow: "hidden",
    elevation: 1,
  },

  emptyCard: {
    borderRadius: 10,
    backgroundColor: "white",
    shadowColor: R.Colors.COLOR_SHADOW,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    paddingHorizontal: 16,
    paddingVertical: 30,
    margin: 8,
    elevation: 1,
    flexDirection: "row",
  },

  emptyCardTitle: {
    fontFamily: "Lato-Bold",
    fontSize: 16,
    // fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 0,
    lineHeight: 19,
    color: "#024481",
  },

  emptyCardSubtitle: {
    fontFamily: "Lato-Semibold",
    fontSize: 14,
    // fontWeight: "600",
    letterSpacing: 0,
    lineHeight: 17,
    color: "#A1AAB3",
    paddingHorizontal: 30,
    textAlign: "center",
    marginTop: 6,
  },

  addIconStyle: {
    height: 18,
    width: 18,
    resizeMode: "contain",
    right: 16,
    top: 16,
    position: "absolute",
  },

  iconStyle: {
    height: 50,
    width: 50,
    resizeMode: "contain",
    backgroundColor: "green",
  },

  waterIntakeCardBottomImage: {
    marginLeft: -26,
    marginTop: 9,
    height: 61,
    marginBottom: -35,
    width: Dimensions.get("window").width - 11,
  },

  approvedFoodCardTitle: {
    color: "#D0444C",
    fontFamily: "Lato-Regular",
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 19,
  },
  editPencilButtonStyle: {
    height: 40,
    width: 40,
    resizeMode: "contain",
    right: 0,
    top: 16,
    position: "absolute",
  },

  cardTitleStyle: {
    color: "rgba(40,39,39,1)",
    fontFamily: "Lato-Bold",
    fontSize: 14,
    fontWeight: "bold",
    letterSpacing: 0,
    lineHeight: 17,
  },

  cardFigureStyle: {
    color: "rgba(2,68,129,1)",
    fontFamily: "Lato-Bold",
    fontSize: 22,
    marginTop: 6,
  },

  unitStyle: {
    fontSize: 12,
  },

  targetTopMargin: {
    marginTop: 12,
  },

  subTextStyle: {
    color: "rgba(161,170,179,1)",
    fontFamily: "Lato-Semibold",
    fontSize: 14,
    // fontWeight: "500",
    letterSpacing: 0,
    lineHeight: 17,
  },

  moodIconStyle: {
    marginTop: 9,
    width: 24,
    height: 24,
    resizeMode: "contain",
  },

  contentStyle: {
    padding: 16,
    paddingTop: 10,
    opacity: 0,
  },

  measurementTextStyle: {
    color: "#8191A2",
    fontFamily: "Lato-Regular",
    fontSize: 12,
    letterSpacing: 0.13,
    lineHeight: 15,
    flex: 4,
  },

  measurementValueStyle: {
    color: "#8191A2",
    fontFamily: "Lato-Regular",
    fontSize: 12,
    letterSpacing: 0,
    lineHeight: 15,
    flex: 3,
    textAlign: "right",
  },

  // Weekly loss style
  lossContainerStyle: {
    flex: 1,
  },

  lossTitleStyle: {
    color: "rgba(129,145,162,1)",
    fontFamily: "Lato-Regular",
    fontWeight: "400",
    letterSpacing: 0,
    flex: 1,
    fontSize: 9,
    lineHeight: 12,
  },

  lossFigureContainer: {
    marginTop: 7,
    alignSelf: "flex-end",
    width: "100%",
    borderRadius: 16.5,
    backgroundColor: "red",
    flexDirection: "row",
    paddingHorizontal: 6,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },

  lossIndicatorIconStyle: {
    width: 6,
    height: 8,
    marginTop: 1,
    marginRight: 2,
  },

  lossTextStyle: {
    color: "white",
    fontFamily: "Lato",
    fontSize: 12,
    letterSpacing: 0,
    lineHeight: 15,
    textAlign: "center",
  },

  totalTextStyle: {
    color: "rgba(129,145,162,1)",
    fontFamily: "Lato-Semibold",
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0,
    lineHeight: 12,
    marginTop: 5.5,
    textAlign: "center",
  },

  horizontalSeparatorLine: {
    width: "100%",
    height: 1,
    backgroundColor: "rgba(239,245,249,1)",
    marginTop: 2,
  },

  verticalSeparatorLine: {
    width: 1,
    height: "100%",
    backgroundColor: "rgba(239,245,249,1)",
    marginTop: 2,
    marginLeft: 5,
    marginRight: 8,
  },

  lossBoxStyle: {
    marginTop: 3,
    flexDirection: "row",
  },

  /*
.total {
  height: 12px;
  width: 23px;
  color: rgba(129,145,162,1);
  font-family: Lato;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0;
  line-height: 12px;
}
*/
});
