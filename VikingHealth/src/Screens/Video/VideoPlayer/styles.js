import { StyleSheet } from "react-native";
import { R } from "Resources";

export const styles = StyleSheet.create({
  video: {
    flex: 1,
  },
  container: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  headerWrapper: {
    backgroundColor: R.Colors.COLOR_WHITE,
    paddingTop: 50,
    paddingBottom: 10,
    paddingHorizontal: 15,
  },
  activityIndicator: {
    position: "absolute",
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
