import { StyleSheet } from "react-native";

const Styles = StyleSheet.create({
  containerStyle: {
    position: "absolute",
    width: 200,
    right: -10,
    bottom: 50,
    borderRadius: 8,
  },

  popupContainerStyle: {
    paddingTop: 20,
    paddingHorizontal: 12,
    paddingBottom: 10,
    borderRadius: 8,
  },

  newFeatureText: {
    color: "rgba(2,68,129,1)",
    fontFamily: "Lato-Semibold",
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0,
    lineHeight: 10,
    paddingLeft: 7,
    paddingTop: 6,
    paddingRight: 7,
    paddingBottom: 4,
    backgroundColor: "rgba(213,227,239,1)",
    borderRadius: 2,
    overflow: "hidden",
  },

  messageTextStyle: {
    color: "rgba(129,145,162,1)",
    fontFamily: "Lato-Semibold",
    fontSize: 12,
    // fontWeight: "600",
    letterSpacing: 0,
    lineHeight: 15,
    marginTop: 8,
  },

  okayTextStyle: {
    color: "rgba(16,114,224,1)",
    fontFamily: "Lato-Bold",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 0,
    lineHeight: 15,
    marginTop: 10,
  },

  wrappedTextStyle: {
    flexDirection: "row",
    flexWrap: "wrap",
    flexShrink: 1,
  },

  /**
.okay {
  height: 15px;
  width: 29px;
  color: rgba(16,114,224,1);
  font-family: Lato;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 0;
  line-height: 15px;
}
   * 
   */
});

export default Styles;
