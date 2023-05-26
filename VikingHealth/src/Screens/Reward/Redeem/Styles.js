import { StyleSheet } from "react-native";
import { R } from "../../../Resources/R";
import * as ResizeUtil from "../../../utility/ResizeUtil";

const Styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: R.Colors.COLOR_APP_BACKGROUND,
    borderRadius: 10,
    marginTop: ResizeUtil.dynamicSize(110),
    marginHorizontal: ResizeUtil.dynamicSize(30),
    overflow: "hidden",
  },

  cardContainerStyle: {
    width: "100%",
  },

  congratulationsText: {
    textTransform: "uppercase",
    color: R.Colors.PrimaryTextColor,
    textAlign: "center",
    marginTop: ResizeUtil.dynamicSize(32),
    fontFamily: "Lato",
    fontWeight: "600",
  },

  redeemImageBackgroundStyle: {
    width: "100%",
    marginTop: ResizeUtil.dynamicSize(24),
    paddingHorizontal: ResizeUtil.dynamicSize(17),
    height: ResizeUtil.dynamicSize(124),
    overflow: "hidden",
    borderRadius: 10,
  },

  backgroundImageStyle: {
    width: "100%",
    height: "100%",
  },

  contentContainerStyle: {
    position: "absolute",
    padding: 22,
    paddingHorizontal: 42,
  },

  commonTextStyle: {
    color: "white",
    fontFamily: "Lato-Regular",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 0.09,
    lineHeight: 15,
    marginTop: 2,
  },

  totalCreditTextStyle: {
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.14,
    lineHeight: 22,
    marginTop: 4,
  },

  /**
   * .300-credit {
  height: 22px;
  width: 98px;
  color: #FFFFFF;
  font-family: Lato;
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 0.14px;
  line-height: 22px;
}
   */

  redeemMessageStyle: {
    color: R.Colors.PrimaryTextColor,
    fontFamily: "Lato",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.14,
    lineHeight: 22,
    textAlign: "center",
    marginHorizontal: ResizeUtil.dynamicSize(36),
    marginTop: ResizeUtil.dynamicSize(32),
  },

  noteTextStyle: {
    color: R.Colors.SecondaryTextColor,
    fontFamily: "Lato-Regular",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0,
    lineHeight: 15,
    textAlign: "center",
    marginTop: ResizeUtil.dynamicSize(12),
    marginHorizontal: ResizeUtil.dynamicSize(37),
  },

  ctaContainerStyle: {
    marginTop: ResizeUtil.dynamicSize(32),
    marginHorizontal: ResizeUtil.dynamicSize(17),
  },

  doItLaterTextStyle: {
    fontFamily: "Lato-Regular",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0,
    lineHeight: 17,
    color: R.Colors.COLOR_BLUE,
    textAlign: "center",
    marginTop: ResizeUtil.dynamicSize(22),
    marginBottom: ResizeUtil.dynamicSize(28),
  },

  okayButtonStyle: {
    flexDirection: "row",
    flexWrap: "wrap",
    flexShrink: 1,
    justifyContent: "center",
    marginTop: ResizeUtil.dynamicSize(59),
    marginBottom: ResizeUtil.dynamicSize(40),
    marginHorizontal: ResizeUtil.dynamicSize(80),
  },

  okayTextStyle: {
    color: R.Colors.COLOR_TEXT_NUMBER_HIGHLIGHTED,
    fontFamily: "Lato-Regular",
    fontWeight: "bold",
    letterSpacing: 0,
    fontSize: 14,
    textAlign: "center",
    textTransform: "uppercase",
  },

  redeemEarnedImageBackgroundStyle: {
    justifyContent: "center",
    height: ResizeUtil.dynamicSize(155),
  },

  redeemEarnedRewardTextStyle: {
    fontSize: 30,
    lineHeight: 30,
    marginTop: 2,
  },

  modalStyle: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    alignContent: "flex-start",
    padding: 0,
    margin: 0,
  },

  /**
.okay {
  height: 12px;
  width: 41px;
  color: #CE363E;
  font-family: Lato;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 0;
  line-height: 12px;
  text-align: center;
}
   */
});

export default Styles;
