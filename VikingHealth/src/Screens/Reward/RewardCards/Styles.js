import { StyleSheet, Platform } from "react-native";
import { R } from "../../../Resources/R";
import { dynamicSize } from "../../../utility/ResizeUtil";

const Styles = StyleSheet.create({
  dummyCardStyle: {
    flex: 1,
    height: 0,
    opacity: 0,
  },

  dummyCardContainerStyle: {
    opacity: 0,
    position: "absolute",
    width: "100%",
  },

  dummyWidthCardStyle: {
    flex: 1,
    position: "absolute",
    opacity: 0,
  },

  translationContainerStyle: {
    ...StyleSheet.absoluteFill,
    flexDirection: "row",
  },

  rewardCardContainerStyle: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
    marginTop: 16,
    marginHorizontal: 16,
    marginBottom: 12,
  },

  dummyTextStyle: {
    flexDirection: "row",
    flexWrap: "wrap",
    flexShrink: 1,
  },

  switchContainerStyle: {
    alignSelf: "flex-end",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  switchNobStyle: {
    height: 14,
    width: 25,
    marginHorizontal: 4,
    borderRadius: 7,
    backgroundColor: "rgba(220,226,230,1)",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 2,
  },

  singleCardContainerStyle: {
    backgroundColor: "white",
    flex: 1,
    marginVertical: dynamicSize(7.5),
    marginHorizontal: 8,
    borderRadius: 10,

    ...Platform.select({
      ios: {
        shadowColor: "rgba(161,172,180,0.11)",
        shadowOffset: { width: 0.5, height: 0.5 },
        shadowOpacity: 1,
        shadowRadius: 10,
      },
      android: {
        elevation: 0.5,
      },
    }),
  },

  singleCardStyle: {
    flex: 1,

    justifyContent: "center",
    alignContent: "center",
    height: "100%",
    margin: 10,
    borderRadius: 10,
    overflow: "hidden",
  },

  gridCardStyle: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },

  listImageContainerStyle: {
    ...StyleSheet.absoluteFill,
  },

  listCardStyle: {
    position: "absolute",
    right: 0,
    bottom: 0,
  },

  quoteCardStyle: {
    paddingLeft: 22,
    paddingRight: 11,
    backgroundColor: "#DCE5EB",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: 10,
  },

  cardContainerStyle: {
    position: "absolute",
    opacity: 0,
    overflow: "hidden",
  },

  cardTitleStyle: {
    color: "#282727",
    fontFamily: "Lato-Bold",
    // fontWeight: "bold",
    letterSpacing: 0.11,
    lineHeight: 17,
    textAlign: "center",
    paddingHorizontal: 22,
  },

  cardDetailTextStyle: {
    color: "#282727",
    fontFamily: "Lato-Regular",
    fontSize: 12,
    letterSpacing: 0.09,
    lineHeight: 15,
    marginTop: 8,
  },

  rewardIconStyle: {
    height: 16,
    width: 22,
    alignSelf: "flex-end",
    marginBottom: 6,
    marginLeft: 2,
  },

  totalRewardTextStyle: {
    color: "white",
    fontFamily: "Lato-Regular",
    fontWeight: "bold",
    fontSize: 30,
    letterSpacing: 0.23,
    alignItems: "baseline",
    lineHeight: 30,
  },

  pointsEarnedTextStyle: {
    color: "white",
    fontFamily: "Lato",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.09,
    lineHeight: 15,
  },

  quoteImageStyle: {
    height: 22,
    width: 26,
    opacity: 0.33,
  },

  quoteTextStyle: {
    color: R.Colors.COLOR_TEXT_LIGHT,
    fontFamily: "Lato-Bold",
    // fontWeight: "700",
    fontSize: 14,
    lineHeight: 17,
    letterSpacing: 0.11,
    marginTop: 3,
  },
});

export default Styles;
