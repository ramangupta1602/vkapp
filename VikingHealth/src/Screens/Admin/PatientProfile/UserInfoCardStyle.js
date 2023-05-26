import { StyleSheet } from "react-native";
import { R } from "../../../Resources/R";

export const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginLeft: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  nameStyle: {
    color: R.Colors.COLOR_CARD_TEXT,
    fontFamily: "Lato-Regular",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.12,
    lineHeight: 19,
  },
  subInfoTextStyle: {
    color: R.Colors.COLOR_CARD_INFO,
    fontFamily: "Lato-Regular",
    fontSize: 14,
    lineHeight: 14,
  },
  programDetail: {
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "space-around",
    marginVertical: 2,
    alignItems: "center",
    marginLeft: 1,
  },
  inviteText: {
    paddingLeft: 3,
    color: "#1072E0",
    fontFamily: "Lato-Regular",
    fontSize: 14,
    lineHeight: 17,
  },
  inviteWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    marginVertical: 7,
    alignItems: "center",
  },

  cycleContainer: {
    height: 24,
    backgroundColor: "#E7F3FB",
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
  },

  cycleTextStyle: {
    fontFamily: "Lato-Semibold",
    color: "#CE363E",
    fontSize: 14,
    lineHeight: 14,
    fontWeight: "600",
    paddingHorizontal: 16,
  },

  rewardButtonsContainerStyle: {
    marginRight: 18,
    height: 23,
    justifyContent: "center",
  },

  approveTextStyle: {
    color: "#D0444C",
    fontFamily: "Lato-bold",
    letterSpacing: 0,
    lineHeight: 15,
  },

  creditUsedContainer: {
    backgroundColor: "#96DE4E",
    borderRadius: 4,
    overflow: "hidden",
    height: "100%",
    justifyContent: "center",
  },

  creditUsedTextStyle: {
    color: "white",
    fontFamily: "Lato-bold",
    fontSize: 12,
    letterSpacing: 0,
    lineHeight: 15,
    marginHorizontal: 6,
  },

  /**
.credits-expired {
  height: 15px;
  width: 84px;
  color: #8695A6;
  font-family: Lato;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 0;
  line-height: 15px;
}
  */
});
