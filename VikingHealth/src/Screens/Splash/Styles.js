import { StyleSheet } from "react-native";
import { R } from "Resources";
export const styles = StyleSheet.create({
  welcome: {
    width: 200,
    height: 100,
    resizeMode: "contain"
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white"
  },
  walkThroughButton: {
    color: "#000",
    fontSize: 18
  },
  footer: {
    position: "absolute",
    height: 40,
    left: 0
  },
  walkThroughcontainer: {
    flex: 1,
    justifyContent: "center"
  },
  bottomView: {
    width: "85%",
    height: 50,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 5,
    flexDirection: "row",
    backgroundColor: R.Colors.COLOR_BUTTON,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center"
  },
  textStyle: {
    color: R.Colors.COLOR_WHITE,
    fontSize: 20
  },
  image: {
    flex: 1,
    width: "100%",
    height: "100%"
  },
  imageArrow: {
    width: 28,
    height: 25,
    marginLeft: 8,
    marginTop: 1,
    resizeMode: "contain"
  },
  walkThroughText: {
    color: "#FFFFFF",
    fontFamily: "Lato-Regular",
    fontSize: 53,
    letterSpacing: 0.48,
    lineHeight: 63,
    
  },
  walkThroughContainerText: {
    marginLeft: 22,
    marginRight: 22,
    position: "absolute",
    bottom: 0,
    marginBottom: "40%",
    flex: 1
  },
  dotStyle: {
    backgroundColor: '#BDD0FB',
    width: 0
  },
  activeDotStyle: {
    backgroundColor: '#5F61F3',
    width: 0,
  },
});
