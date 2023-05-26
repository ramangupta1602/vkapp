import { StyleSheet, Platform } from "react-native";
import { R } from "Resources";

const Styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: R.Colors.COLOR_APP_BACKGROUND,
    justifyContent: "flex-start",
    flex: 1,
  },

  titleHolderStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
  },

  titleStyle: {
    color: "rgba(40,39,39,1)",
    fontFamily: "Lato-Bold",
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: 0.22,
    fontWeight: "bold",
  },

  infoIconStyle: {
    width: 24,
    height: 24,
  },

  contentStyle: {
    paddingHorizontal: 16,
    marginTop: 12,
  },

  maxPointTextStyle: {
    color: "rgba(129,145,162,1)",
    fontFamily: "Lato-Bold",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 0.09,
    lineHeight: 15,
  },

  cardHeaderStyle: {
    marginTop: 12,
    height: 50,
    backgroundColor: "white",
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    paddingLeft: 5,
    paddingRight: 14,
    zIndex: 10,

    ...Platform.select({
      ios: {
        shadowColor: "rgba(185,208,223,0.18)",
        shadowOffset: { width: 2, height: 2 },
        shadowRadius: 2,
        shadowOpacity: 1,
      },
      android: {
        elevation: 1,
      },
    }),
  },

  cardIconStyle: {
    width: 40,
    height: 40,
    borderRadius: 4,
  },

  cardTitleStyle: {
    color: "rgba(40,39,39,1)",
    fontFamily: "Lato-Semibold",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0,
    lineHeight: 17,
    marginLeft: 11,
    flex: 1,
  },

  cardContentStyle: {
    backgroundColor: "white",
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    overflow: "hidden",
  },

  rewardItemStyle: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
  },

  separatorStyle: {
    height: 1,
    width: "100%",
    backgroundColor: "rgba(238,243,247,1)",
  },

  rewardItemTitleStyle: {
    color: "rgba(40,39,39,1)",
    fontFamily: "Lato-Regular",
    fontSize: 12,
    letterSpacing: 0,
    lineHeight: 14,
  },

  termsContainerView: {
    marginTop: 16,
    paddingHorizontal: 18,
    marginBottom: 16,
  },

  termTitleStyle: {
    color: "rgba(40,39,39,1)",
    fontFamily: "Lato-Regular",
    fontSize: 10,
    letterSpacing: 0,
    lineHeight: 12,
    fontWeight: "bold",
  },

  termPointStyle: {
    color: "rgba(129,145,162,1)",
    fontFamily: "Lato-Regular",
    fontSize: 10,
    letterSpacing: 0,
    lineHeight: 12,
    marginTop: 10,
  },

  // history screen
  totalCardStyle: {
    // overflow: "hidden",
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },

  rewardPointConversionTextStyle: {
    color: " rgba(129,145,162,1)",
    fontFamily: "Lato-Semibold",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.09,
    // lineHeight: 15,
    marginLeft: 5,
    marginRight: 20,
  },

  rewardPointConversionContainer: {
    marginLeft: 8,
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
  },

  rewardPointConversionIcon: {
    width: 12,
    height: 12,
  },

  yourRewardHistory: {
    color: "rgba(40,39,39,1)",
    fontFamily: "Lato-bold",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.12,
    lineHeight: 19,
  },

  totalRewardPointEarnedTextStyle: {
    color: "white",
    fontFamily: "Lato-Regular",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 0.09,
    lineHeight: 15,
    textTransform: "uppercase",
  },

  redeemTextStyle: {
    color: "white",
    fontFamily: "Lato-Regular",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 0,
    lineHeight: 12,
    paddingVertical: 10,
    paddingHorizontal: 30,
    textAlign: "center",
  },

  /**
.redeem-now {
  height: 12px;
  width: 72px;
  color: rgba(255,255,255,1);
  font-family: Lato;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 0;
  line-height: 12px;
  text-align: center;
}
**/
});

export default Styles;
