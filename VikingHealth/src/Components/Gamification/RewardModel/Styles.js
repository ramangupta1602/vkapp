import { StyleSheet } from "react-native";

export const PrimaryTextColor = "rgba(2,68,129,1)";
export const SecondaryTextColor = "rgba(129,145,162,1)";
export const LightGrayHighlightColor = "rgba(228,233,237,1)";
export const AppActionColor = "rgba(206,54,62,1)";
export const AppGreen = "rgba(48,210,112,1)";

const Styles = StyleSheet.create({
  topCardStyle: {
    paddingBottom: 22,
    paddingTop: 32,
    paddingHorizontal: 0,
  },

  titleStyle: {
    color: PrimaryTextColor,
    fontFamily: "Lato-Semibold",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0,
    lineHeight: 17,
    textAlign: "center",
    textTransform: "uppercase",
  },

  subHeadingStyle: {
    color: SecondaryTextColor,
    fontFamily: "Lato-Semibold",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0,
    lineHeight: 17,
    marginTop: 6,
    textAlign: "center",
  },

  imageContainerStyle: {
    alignSelf: "center",
    marginTop: 32,
    height: 170,
    width: "100%",
  },

  imageStyle: {
    position: "absolute",
    height: 200,
    width: "100%",

    // alignSelf: "center",
  },

  rewardPointConversionStyle: {
    color: SecondaryTextColor,
    fontFamily: "Lato-Semibold",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.09,
    lineHeight: 15,
    textAlign: "center",
  },

  rewardPointContainer: {
    marginBottom: 17,
    marginLeft: 38,
    justifyContent: "center",
    height: "100%",
  },

  pointContainer: {
    flexDirection: "row",
  },

  pointTextStyle: {
    color: "white",
    fontFamily: "Lato-Bold",
    fontSize: 30,
    letterSpacing: 0.23,
    lineHeight: 36,
  },

  vhImageStyle: {
    width: 22,
    height: 16,
    alignSelf: "flex-end",
    marginBottom: 6,
    marginLeft: 2,
  },

  dateStyle: {
    marginTop: 27,
    color: "white",
    fontFamily: "Lato-Bold",
    fontSize: 12,
    letterSpacing: 0.1,
    lineHeight: 15,
  },

  rewardPointTextStyle: {
    color: "white",
    fontFamily: "Lato-Bold",
    fontSize: 12,
    letterSpacing: 0.09,
    lineHeight: 15,
    textTransform: "uppercase",
  },

  messageStyle: {
    color: PrimaryTextColor,
    fontSize: 18,
    fontFamily: "Lato-Bold",
    letterSpacing: 0.14,
    lineHeight: 22,
    textAlign: "center",
    marginTop: 23,
    marginHorizontal: 45,
  },

  learnMoreTextStyle: {
    color: AppActionColor,
    fontFamily: "Lato-Bold",
    fontSize: 14,
    letterSpacing: 0,
    // lineHeight: 12,
    textAlign: "center",
    textTransform: "uppercase",
  },

  wrapperStyle: {
    flexWrap: "wrap",
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 32,
  },

  rewardDetailWrapper: {
    marginTop: 22,
    marginHorizontal: 35,
    borderRadius: 10,
    // height: 66,
    overflow: "hidden",
    flexDirection: "row",
    borderWidth: 1,
    borderColor: LightGrayHighlightColor,
  },

  rewardItemWrapper: {
    borderRadius: 10,
    overflow: "hidden",
    flex: 1,
    padding: 4,
    paddingTop: 10,
    paddingBottom: 30,
    minHeight: 66,
    // height: "100%",
    alignItems: "center",
  },

  currentClassTextStyle: {
    color: PrimaryTextColor,
    fontFamily: "Lato-Bold",
    fontSize: 24,
    textAlign: "center",
    letterSpacing: 0.19,
    lineHeight: 28,
  },

  lossContainer: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
    marginTop: 7,
    width: "100%",
    position: "absolute",
    bottom: 4,
    height: 18,
    left: 4,
    right: 4,
    borderRadius: 10,
    backgroundColor: AppGreen,
  },

  previousTextSize: {
    color: PrimaryTextColor,
    fontFamily: "Lato-Regular",
    fontSize: 12,
    letterSpacing: 0.11,
    alignSelf: "center",
    lineHeight: 17,
    paddingHorizontal: 5,
  },

  currentClassDescTextStyle: {
    color: "white",
    fontFamily: "Lato-Regular",
    fontSize: 10,
    letterSpacing: 0.08,
    lineHeight: 12,
  },

  /**
.down-15 {
  height: 12px;
  width: 51px;
  color: rgba(255,255,255,1);
  font-family: Lato;
  font-size: 10px;
  letter-spacing: 0.08px;
  line-height: 12px;
}
*/
});

export default Styles;
