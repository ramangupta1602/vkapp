import { StyleSheet } from "react-native";

const style = StyleSheet.create({
  containerStyle: {
    flex: 1,
    marginTop: 16,
    marginHorizontal: 16
  },

  textStyle: {
    color: "#8191A2",
    fontFamily: "Lato-Regular",
    fontSize: 12,
    fontWeight: "bold",
    lineHeight: 15,
    paddingLeft: 3
  },

  listStyle: {
    marginTop: 8,
    flexDirection: "row"
  },

  chipStyle: {
    height: 27,
    borderRadius: 13,
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    flexShrink: 1,
    marginRight: 7.5
  },

  chipTextStyle: {
    color: "#024481",
    fontFamily: "Lato-Medium",
    fontSize: 12,
    lineHeight: 15,
    textAlign: "center",
    paddingVertical: 6,
    paddingHorizontal: 12
  },

  selectedChipStyle: {
    backgroundColor: "#E1EBF2"
  },

  unSelectedChipStyle: {
    borderWidth: 1,
    borderColor: "#EFF5F9"
    // borderColor: "white"
  },

  selectedTextColor: {
    color: "#024481"
  },

  unSelectedTextColor: {
    color: "#8191A2"
  },

  separatorStyle: {
    height: 1,
    flex: 1,
    backgroundColor: "#EFF5F9",
    marginTop: 20
  }
});

export default style;
