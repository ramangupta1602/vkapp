import { StyleSheet } from "react-native";
import { R } from "Resources";

export const styles = StyleSheet.create({
  //width: Dimensions.get('window').width,
  //height: Dimensions.get('window').height,

  container: {
    backgroundColor: R.Colors.COLOR_APP_BACKGROUND,
    justifyContent: "flex-start",
    flex: 1,
  },
  gridContainer: {
    flexDirection: "column",
    justifyContent: "flex-start",
    padding: 24,
    paddingTop: 0,
    paddingBottom: 0,
  },
  moodRow: {
    flexDirection: "row",
  },
  buttonContainer: {
    flexDirection: "column",
    justifyContent: "flex-end",
    padding: 44,
    paddingTop: 0,
  },
  dayMoodContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
