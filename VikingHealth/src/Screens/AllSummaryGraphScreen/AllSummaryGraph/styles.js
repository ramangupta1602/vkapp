import { StyleSheet, Dimensions, Platform, StatusBar } from "react-native";

const { width, height } = Dimensions.get("screen");
const statusBarHeight =
  Platform.OS === "ios" ? 45 : StatusBar.currentHeight ?? 45;

export const Style = StyleSheet.create({
  containerStyle: {
    backgroundColor: "#F3F8FB",
    flex: 1,
    paddingRight: 25,
    paddingLeft: 25,
    paddingTop: statusBarHeight,
    paddingBottom: 16
  },

  invisiblePlaceHolderStyle: {
    opacity: 0,
    width: "100%",
    height: "100%",
    position: "absolute"
  },

  graphScreenContainerStyle: {
    flex: 1
  },

  titleStyle: {
    color: "#282727",
    fontFamily: "Lato-Bold",
    fontSize: 18,
    fontWeight: "bold",
    lineHeight: 22
  },
  graphContainer: {
    marginTop: 20
  },

  closeIconStyle: {
    position: "absolute",
    right: 0,
    width: 32,
    height: 32,
    zIndex: 1000
  }
});
