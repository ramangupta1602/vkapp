import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  overlay: {
    width: "100%",
    backgroundColor: "rgba(102,102,102,0.3)",
    position: "absolute",
    bottom: 0,
    zIndex: 999,
    height: "100%",
  },
  modalContent: {
    height: 244,
    width: "100%",
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    zIndex: 1000,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  modalText: {
    color: "#1072E0",
    fontFamily: "Lato",
    fontSize: 14,
    fontWeight: "bold",
    lineHeight: 17,
    paddingTop: 10,
  },
});
