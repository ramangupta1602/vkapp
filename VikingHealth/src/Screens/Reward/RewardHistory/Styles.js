import { StyleSheet } from "react-native";

const Styles = StyleSheet.create({
  totalCardStyle: {
    paddingHorizontal: 24,
    overflow: "hidden",
    borderRadius: 10,
    justifyContent: "center",
  },

  backgroundImageStyle: {
    width: "120%",
    height: "100%",
  },

  redeemButtonContainerStyle: {
    alignSelf: "center",
    alignItems: "center",
  },

  greenTickImageStyle: {
    width: 30,
    height: 30,
    resizeMode: "contain",
    marginBottom: 8,
  },

  totalRewardTextStyle: {
    fontSize: 12,
    lineHeight: 15,
  },

  redeemButtonStyle: {
    bottom: 0,
    right: 0,
    position: "absolute",
    backgroundColor: "red",
    borderTopLeftRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  rewardPointConversionIcon: {
    alignSelf: "flex-start",
    marginTop: 2,
    marginRight: 2,
  },
});

export default Styles;
