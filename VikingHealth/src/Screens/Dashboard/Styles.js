import { StyleSheet } from "react-native";
import { R } from "Resources";
export const styles = StyleSheet.create({
  container: {
    backgroundColor: R.Colors.COLOR_APP_BACKGROUND,
    justifyContent: "flex-start",
    flex: 1
  },

  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start"
  },

  cardsConatiner: {
    padding: 8
  },
  proverbContainer: {
    paddingLeft: 8,
    paddingRight: 8,
    marginLeft: 8,
    marginRight: 8
  },
  info: {
    height: 18,
    width: 18,
    resizeMode: "contain",
    marginLeft: 10,
    marginTop: 3
  },
  indicatorStyle: {
    backgroundColor: "white",
    width: 43,
    height: 14,
    marginTop: -24,
    marginLeft: 30
  }
});
