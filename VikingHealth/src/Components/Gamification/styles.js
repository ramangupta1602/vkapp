import { StyleSheet, Platform } from "react-native";

export const boxShadowStyles = {
  backgroundColor: "#ffffff",
  borderRadius: 6,
  ...Platform.select({
    ios: {
      shadowColor: "rgba(161,172,180,0.11)",
      shadowOffset: { height: 7, width: 2 },
      shadowOpacity: 0.5,
      shadowRadius: 3
    },
    android: {
      elevation: 3
    }
  })
};

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    alignContent: "flex-start",
    justifyContent: "flex-start",
    marginLeft: 30,
    marginRight: 30
  },

  gamificationCardStyles: {
    ...boxShadowStyles,
    borderRadius: 10,
    overflow: "hidden",
    paddingTop: 28,
    // height: 500,
    marginTop: 57,
    paddingHorizontal: 22,
    paddingBottom: 34
  },

  titleStyle: {
    color: "#024481",
    fontFamily: "Lato-Regular",
    fontWeight: "600",
    fontSize: 16,
    letterSpacing: 0.51,
    textAlign: "center",
    lineHeight: 19
  },

  imageStyle: {
    width: 300,
    height: 300,
    marginTop: 16,
    marginBottom: 28,
    marginHorizontal: 0,
    resizeMode: "contain",
    // backgroundColor: "red",
    alignSelf: "center",
    justifyContent: "center"
  },

  textStyle: {
    color: "#024481",
    fontFamily: "Lato-Semibold",
    letterSpacing: 0.48,
    fontSize: 16,
    textAlign: "center",
    lineHeight: 19,
    marginTop: 26
  },

  subTextStyle: {
    color: "#8191A2",
    fontFamily: "Lato-Regular",
    fontSize: 14,
    letterSpacing: 0.45,
    lineHeight: 17,
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 10
  },

  actionStyle: {
    color: "#CE363E",
    fontFamily: "Lato-Bold",
    fontSize: 14,
    fontWeight: "bold",
    lineHeight: 15,
    textAlign: "center",
    textTransform: "uppercase",
    marginTop: 100
  },

  quoteOuterContainer: {
    // ...boxShadowStyles,
    // backgroundColor: 'red'
  },

  quoteInnerContainer: {
    margin: 32,
    marginLeft: 42
    // backgroundColor: 'red'
  },

  quoteSymbolStyle: {
    height: 13,
    width: 16
  },

  quoteTextStyle: {
    color: "#024481",
    fontFamily: "Lora-Regular",
    fontSize: 18,
    letterSpacing: 0.54,
    lineHeight: 22
    // backgroundColor: 'red'
  },

  pagerContainer: {
    height: 228,
    overflow: "hidden"
  },

  testamonialContainer: {
    margin: 32,
    marginBottom: 25
  },

  testamonialTitle: {
    color: "#024481",
    fontFamily: "Lato-Regular",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.48,
    lineHeight: 19,
    textAlign: "center"
  },

  pagerContentStyle: {
    marginLeft: 37,
    marginRight: 36,
    marginTop: 45,
    marginBottom: 55,
    backgroundColor: "red"
  },

  testamonialImageStyleContainer: {
    height: 42,
    width: 42,
    borderRadius: 21,
    borderWidth: StyleSheet.hairlineWidth,
    marginTop: 45
  },

  testamonialImageStyle: {
    height: 42,
    width: 42,
    borderRadius: 21
  },

  peopleName: {
    marginBottom: 55,
    color: "#8191A2",
    fontFamily: "Lora-Regular",
    fontSize: 14,
    letterSpacing: 0.42,
    lineHeight: 18,
    marginTop: 8
  },

  testamonialText: {
    color: "#024481",
    fontFamily: "Lato-Italic",
    fontSize: 14,
    letterSpacing: 0.42,
    lineHeight: 17,
    marginTop: 8
  }

  /*
.i-am-down-70-lbs-40 {
	height: 34px;
	width: 242px;
	color: #024481;
	font-family: Lato;
	font-size: 14px;
	font-style: italic;
	letter-spacing: 0.42px;
	line-height: 17px;
}
  */
});

export default styles;
