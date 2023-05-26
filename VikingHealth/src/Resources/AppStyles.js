import { StyleSheet } from "react-native";
import * as Colors from "./ColorConstants";
export const AppStyles = StyleSheet.create({
  headerContainer: {
    paddingTop: 40,
    paddingLeft: 16,
    paddingRight: 16,
    flexDirection: "column",
    alignItems: "flex-start"
  },
  mainHeaderText: {
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: "Lato-Regular",
    letterSpacing: 0.22,
    lineHeight: 34,
    color: Colors.COLOR_TEXT,
    backgroundColor: "red"
  },
  title: {
    marginTop: 8,
    fontSize: 14,
    marginBottom: 20,
    fontFamily: "Lato-Regular",
    lineHeight: 18,
    color: Colors.COLOR_TEXT,
    backgroundColor: "red"
  },

  graphContainerStyle: {
    backgroundColor: "white",
    marginHorizontal: 8,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 20
  }
});
