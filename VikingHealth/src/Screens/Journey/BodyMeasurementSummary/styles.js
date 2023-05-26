import { StyleSheet } from "react-native";
import { R } from "../../../Resources/R";

export const HEIGHT_OF_BOTTOM_PILL = 54;
export const HEIGHT_OF_TOTAL_LOSS_CONTAINER = 54;
export const MARGIN_BOTTOM_TOTAL_LOSS_CONTAINER = 46;
export const BOTTOM_PILL_MARGIN_BOTTOM = 104;

const style = StyleSheet.create({
  containerStyle: {
    backgroundColor: R.Colors.COLOR_APP_BACKGROUND,
    flex: 1,
  },

  bottomLossPillAbsoluteStyle: {
    position: "absolute",
    left: 0,
    right: 0,
    height: HEIGHT_OF_BOTTOM_PILL,
    bottom: BOTTOM_PILL_MARGIN_BOTTOM,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },

  bottomLossPillContainerStyle: {
    height: "100%",
    borderRadius: 30,
    overflow: "hidden",
    flexDirection: "row",
    backgroundColor: "white",
  },

  bottomLossPillPartNameStyle: {
    backgroundColor: "rgba(239,245,249,1)",
    paddingLeft: 31,
    paddingRight: 29,
  },

  bottomLossNumericFigureStyle: {
    paddingLeft: 16,
    paddingRight: 37,
  },

  textContainerStyle: {
    height: "100%",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },

  bottomLossPillNameTextStyle: {
    color: "rgba(42,50,62,1)",
    fontFamily: "Lato-Regular",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0,
    lineHeight: 19,
  },

  bottomLossNumericFigureTextStyle: {
    color: "rgba(2,68,129,1)",
    fontFamily: "Lato",
    fontSize: 30,
    letterSpacing: 1,
  },

  bottomLossUnitTextStyle: {
    fontWeight: "bold",
    letterSpacing: 1.33,
    lineHeight: 19,
    fontSize: 16,
    marginTop: 10,
    // alignSelf: "flex-end",
    marginLeft: 2,
  },

  totalLossContainerStyle: {
    marginTop: 16,
    height: HEIGHT_OF_TOTAL_LOSS_CONTAINER,
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
  },

  totalLossTextStyle: {
    color: "rgba(2,68,129,1)",
    fontFamily: "Lato-Bold",
    fontSize: 28,
    fontWeight: "bold",
    letterSpacing: 0,
    lineHeight: 34,
    textAlign: "center",
  },

  totalLossMessage: {
    color: "rgba(2,68,129,1)",
    fontFamily: "Lato-Bold",
    fontSize: 16,
    letterSpacing: 0,
    lineHeight: 19,
  },

  finalPillStyle: {
    borderRadius: 14,
    backgroundColor: "white",
    position: "absolute",
    paddingVertical: 5,
    paddingHorizontal: 13,
  },

  finalPillTextStyle: {
    color: "rgba(2,68,129,1)",
    fontFamily: "Lato-Regular",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0,
    lineHeight: 19,
    textAlign: "center",
  },

  /**
.you-have-lost-during {
  height: 19px;
  width: 232px;
  color: rgba(2,68,129,1);
  font-family: Lato;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0;
  line-height: 19px;
  text-align: center;
}
   */
});

export default style;
