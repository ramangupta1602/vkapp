import { StyleSheet } from "react-native";

const style = StyleSheet.create({
  containerStyle: {
    flex: 1,
    margin: 16,
    marginTop: 0,
    marginLeft: 8,
    paddingLeft: 18,
    paddingTop: 18,
    borderRadius: 10,
    overflow: "hidden"
  },

  continueText: {
    color: "#74D2E2",
    fontFamily: "Lato-Regular",
    fontSize: 12,
    lineHeight: 15
  },

  now_active_style: {
    fontFamily: "Lato-Regular",
    fontSize: 14,
    lineHeight: 17,
    color: "white",
    marginTop: 6
  },
  reloadTextStyle: {
    fontFamily: "Lato-Bold",
    fontSize: 22,
    lineHeight: 27,
    color: "white",
    marginBottom: 21
  },

  startButtonStyle: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 100,
    height: 32,
    backgroundColor: "#D0444C",
    borderTopLeftRadius: 10,
    justifyContent: "center",
    alignItems: "center"
  },

  startTextStyle: {
    fontFamily: "Lato-Bold",
    fontSize: 12,
    fontWeight: "bold",
    lineHeight: 12,
    letterSpacing: 0.43,
    color: "white"
  }

  /**.start {
	height: 12px;
	width: 39px;
	color: #FFFFFF;
	font-family: Lato;
	font-size: 12px;
	font-weight: bold;
	letter-spacing: 0.43px;
	line-height: 12px;
	text-align: center;
}
   */
});

export default style;
