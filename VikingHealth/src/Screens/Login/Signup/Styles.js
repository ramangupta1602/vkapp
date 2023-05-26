import { StyleSheet, Dimensions } from "react-native";
import { R } from "Resources";
var { height, width } = Dimensions.get("window");
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: R.Colors.COLOR_APP_BACKGROUND,
    justifyContent: "flex-start"
    // padding: 24,
    // paddingTop: 0,
  },
  textField: {
    color: "black",
    backgroundColor: "yellow"
  },
  placeholder: {
    fontSize: 16,
    color: R.Colors.COLOR_FLOATING_LABEL,
    fontWeight: "500"
  },
  measurementContainer: {
    // marginLeft: 24,
    // marginRight: 24,
    marginTop: 16,
    marginBottom: 16
  },
  measurementTabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
    alignItems: "center"
  },
  rulerContainer: {
    borderRadius: 10,
    backgroundColor: "white",
    shadowColor: R.Colors.COLOR_SHADOW,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    // height: 250,
    marginTop: 10,
    paddingTop: 20
  },
  loaderStyle: {
    position: "absolute",
    top: height / 2,
    right: 0,
    left: 0
  },
  buttonContainer: {
    flexDirection: "column",
    justifyContent: "flex-end",
    padding: 44,
    paddingTop: 0,
    flex: 1
  }
});
