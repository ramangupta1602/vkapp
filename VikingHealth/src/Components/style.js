import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  talkBubble: {
    backgroundColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10,
    elevation: 10
  },
  talkBubbleSquare: {
    width: 60,
    height: 25,
    backgroundColor: "white",
    borderRadius: 12.5,
    elevation: 10
  },
  talkBubbleTriangle: {
    position: "absolute",
    left: 25,
    top: 25,
    width: 0,
    height: 0,
    borderTopColor: "white",
    borderTopWidth: 3,
    elevation: 10,

    borderLeftWidth: 5,
    borderLeftColor: "transparent",

    borderRightColor: "transparent",
    borderRightWidth: 5
  },

  cycleContainer: {
    height: 18,
    backgroundColor: "#E7F3FB",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    marginLeft: 10,
    marginTop: -2
  },

  cycleTextStyle: {
    fontFamily: "Lato-Semibold",
    color: "#CE363E",
    fontSize: 14,
    lineHeight: 14,
    fontWeight: "600",
    paddingHorizontal: 16
  },

  singlePallateContainerStyle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 20
  },

  pallateIndicatorTextStyle: {
    color: "#A1AAB3",
    fontFamily: "Lato-Regular",
    fontSize: 12,
    lineHeight: 15,
    marginLeft: 5,
    marginRight: 24
  },

  pallateBoxStyle: {
    height: 12,
    width: 12,
    borderRadius: 6
  }

  /**
.oval {
	height: 12px;
	width: 12px;
	background-color: #FFB07F;
}
   */
});
