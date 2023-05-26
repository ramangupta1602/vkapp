import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  CTAButton: {
    height: 50,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#CE363E",
  },

  CTAButtonDisabled: {
    backgroundColor: "#CE363E",
    opacity: 0.75,
  },

  CTAEnabled: {
    backgroundColor: "#d13341",
  },
  CTASuccess: {
    backgroundColor: "#008000",
    borderWidth: 0,
  },
  CTADisabled: {
    backgroundColor: "gray",
    borderWidth: 0,
  },
  CTAText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "Lato-Regular",
    textAlign: "center",
    textAlignVertical: "center",
    lineHeight: 50,
    color: "white",
  },
  CTATextSuccess: {
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "Lato-Regular",
    lineHeight: 50,
    color: "white",
  },
});
