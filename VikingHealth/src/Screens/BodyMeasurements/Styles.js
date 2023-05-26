import { StyleSheet, Dimensions } from "react-native";
import { R } from "Resources";
const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    backgroundColor: R.Colors.COLOR_APP_BACKGROUND,
    // paddingBottom: 20,
    flex: 1,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: "100%",
  },

  bottomView: {
    flex: 1,
    width: "100%",
    height: 250,
    backgroundColor: R.Colors.COLOR_WHITE,
    position: "absolute",
    bottom: 0,
  },
  bottomViewTitle: {
    color: R.Colors.COLOR_TITLE,
    fontSize: 16,
    fontWeight: "600",
    alignSelf: "center",
    paddingTop: 30,
    bottom: 0,
  },
  video: {
    aspectRatio: 1,
    flex: 1,
    borderWidth: 1,
    marginBottom: 100,
    borderColor: R.Colors.COLOR_APP_BACKGROUND,
    alignItems: "center",
  },
  bodyPosition: {
    position: "absolute",
    top: 10,
    left: 10,
    bottom: 10,
    right: 10,
    width: "100%",
    height: "100%",
  },
  bodyBackground: {
    position: "absolute",
    width: "76%",
    left: "12%",
    right: "12%",
    aspectRatio: 1,
  },
  measurementContainerView: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 0,
    alignItems: "center",
    justifyContent: "center",
  },

  concentricImageContainerStyle: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    // backgroundColor: "red",
    marginTop: -40,
  },

  concentricImageStyle: {
    width: "100%",
    maxHeight: 350,
  },
});
