import { StyleSheet } from "react-native";
import { R } from "../../Resources/R";

const style = StyleSheet.create({
  scrollViewStyle: {
    backgroundColor: R.Colors.COLOR_APP_BACKGROUND,
    flex: 1,
  },
  containerStyle: {
    backgroundColor: R.Colors.COLOR_APP_BACKGROUND,
    flex: 1,
    paddingLeft: 16,
    paddingRight: 16,
  },
  headerContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  svgBoxStyle: {
    ...StyleSheet.absoluteFillObject,
  },

  movableViewStyle: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 50,
    height: 100,
  },

  achievementBoxContainerStyle: {
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 20,
    justifyContent: "center",
  },

  achievementBoxStyle: {
    backgroundColor: "white",
    height: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 15,
    borderRadius: 5,
  },

  achievementTextStyle: {
    color: "#43D35C",
    fontFamily: "Lato-Semibold",
    fontWeight: "600",
    letterSpacing: 0.49,
    lineHeight: 15,
    marginHorizontal: 10,
    paddingVertical: 12,
    fontSize: 12,
  },

  deactivatedMonthNameTextStyle: {
    color: "#8191A2",
    fontFamily: "Lato-Bold",
    fontSize: 12,
    fontWeight: "bold",
    lineHeight: 15,
    textTransform: "uppercase",
  },

  targetTextStyle: {
    fontFamily: "Lato-Bold",
    color: "#282727",
    fontSize: 12,
    fontWeight: "bold",
    lineHeight: 15,
    paddingLeft: 20,
    textAlign: "center",
  },

  /**
.achieved-target-weig {
	height: 15px;
	width: 167px;
	color: #282727;
	font-family: Lato;
	font-size: 12px;
	font-weight: bold;
	line-height: 15px;
}
   */
});

export default style;
