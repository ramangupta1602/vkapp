import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  scaleContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },

  scaleCategoryStyle: {
    borderRadius: 0,
    marginLeft: 0,
    marginRight: 0.5,
  },

  bubble: {
    width: 102,
    height: 30,
    marginBottom: 10,
    marginTop: 16,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  valueText: {
    fontFamily: "Lato-Regular",
    fontWeight: "600",
    color: "white",
    fontSize: 14,
    textAlign: "center",
  },
  boxStyle: {
    position: "absolute",
    bottom: 0,
    height: 10,
    width: 20,
  },

  marker: {
    backgroundColor: "#a7bbcb",
    flex: 1,
    borderRadius: 3,
    height: 6,
    marginLeft: 3,
    marginRight: 3,
  },

  markerContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
  },

  rangeContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 2,
    paddingTop: 0,
  },

  rangeText: {
    color: "#a1aab2",
    fontSize: 13,
  },

  arrowContainer: {
    height: 10,
    flex: 1,
  },

  arrow: {
    flex: 1,
    width: 10,
    backgroundColor: "red",
  },
});

export default styles;
