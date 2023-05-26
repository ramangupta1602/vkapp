import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    height: 88,
    backgroundColor: "transparent",
    marginLeft: -15
  },
  summaryTextStyle: {
    height: 17,
    color: "#024481",
    fontFamily: "Lato-Regular",
    fontSize: 14,
    letterSpacing: 0.58,
    lineHeight: 17,
    marginTop: 14,
    marginLeft: 20,
    marginBottom: 6
  },
  dragContainerStyle: {
    flex: 1,
    flexDirection: "row",
    height: 45.63,
    borderRadius: 5,
    backgroundColor: "transparent",
    marginLeft: 14,
    marginBottom: 5,
    marginRight: 14,
    alignItems: "center"
  },
  checkmarkImage: {
    width: 22,
    height: 43,
    position: "absolute"
  },

  dragTextStyle: {
    height: 15,
    color: "#D0444C",
    fontFamily: "Lato-Regular",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.13,
    lineHeight: 15,
    marginLeft: 59
  },
  shimmerStyle: {
    transform: [{ rotate: "270deg" }],
    height: 43,
    width: 50,
    marginLeft: 6
  }
});
