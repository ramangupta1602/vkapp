import { StyleSheet, Platform } from "react-native";

const Styles = StyleSheet.create({
  wheelContainerStyle: {
    marginTop: 18,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    height: 150,
    justifyContent: "center"
    // backgroundColor: 'green'
  },

  wheelStyle: {
    width: 70,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        marginTop: -85,
        height: 190
      },
      android: {
        marginTop: -10,
        marginBottom: -20,
        height: 150
      }
    })
  }
});

export default Styles;
