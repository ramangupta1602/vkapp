import { StyleSheet, Platform } from "react-native";
import { R } from "Resources";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: R.Colors.COLOR_WHITE,
    paddingTop: 50,
    paddingBottom: 20,
    // paddingHorizontal: 5
  },
  headerContainer: {
    width: "100%",
    paddingHorizontal: 10,
  },

  detailsContainer: {
    alignSelf: "center",
    width: "90%",
  },
  wrapper: {
    backgroundColor: R.Colors.COLOR_APP_BACKGROUND,
    flex: 1,
  },
  deactivate: {
    color: R.Colors.COLOR_BLUE,
    fontFamily: "Lato-Regular",
    fontSize: 12,
    fontWeight: "bold",
    lineHeight: 15,
  },
  deactivateText: {
    marginTop: 0,
  },
  nameStyle: {
    color: R.Colors.COLOR_CARD_TEXT,
    fontFamily: "Lato-Regular",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.12,
    lineHeight: 19,
    paddingLeft: 5,
    textAlign: "center",
  },
  subInfoTextStyle: {
    color: R.Colors.COLOR_CARD_INFO,
    fontFamily: "Lato-Regular",
    fontSize: 14,
    lineHeight: 14,
  },
  programEndStyle: {
    color: R.Colors.COLOR_CARD_INFO,
    fontFamily: "Lato-Regular",
    fontSize: 12,
    letterSpacing: 0.19,
    lineHeight: 17,
    //  marginBottom: 5
  },
  progressBarStyles: {
    paddingHorizontal: 20,
  },
  contentAlign: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 2,
  },
  profilePatient: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
    marginBottom: 20,
  },
  seperator: {
    color: R.Colors.COLOR_CARD_INFO,
    fontFamily: "Lato-Regular",
    fontSize: 14,
    lineHeight: 17,
    opacity: 0.5,
    marginLeft: 0,
  },
  imageAlign: {
    marginHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-start",
    marginVertical: 18,
    // alignContent: "center"
  },
  programDetail: {
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "space-around",
    marginVertical: 2,
    alignItems: "center",
    marginLeft: 1,
  },
  inviteText: {
    paddingLeft: 3,
    color: "#1072E0",
    fontFamily: "Lato-Regular",
    fontSize: 14,
    lineHeight: 17,
  },
  inviteWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    marginVertical: 7,
    alignItems: "center",
  },

  reloadButtonContainer: {
    flex: 1,
    flexDirection: "row",
    marginTop: 27,
    marginBottom: 0,
  },

  reloadInitiatedTextStyle: {
    color: "#8191A2",
    fontFamily: "Lato-Regular",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.34,
    lineHeight: 17,
  },

  awaitingText: {
    color: "#F5A623",
    fontFamily: "Lato-Regular",
    fontSize: 12,
    letterSpacing: 0.29,
    lineHeight: 15,
  },

  acceptedTextStyle: {
    color: "#96DE4E",
    fontFamily: "Lato-Semibold",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.29,
    lineHeight: 15,
    marginLeft: 2,
  },

  // Confirmation modal style:
  modalStyle: {
    margin: 0,
    justifyContent: "flex-end",
  },

  containerStyle: {
    padding: 24,
    backgroundColor: "white",
  },

  confirmTextStyle: {
    fontFamily: "Lato-Bold",
    lineHeight: 22,
    fontWeight: "bold",
    fontSize: 18,
    color: "#024481",
  },

  confirmationMessage: {
    fontFamily: "Lato-Regular",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 15,
    marginTop: 8,
    color: "#8191A2",
  },

  messageBold: {
    color: "#8191A2",
    fontFamily: "Lato-Bold",
  },

  progressStyle: {
    marginTop: 24,
  },

  cancelTextStyle: {
    color: "#CE363E",
    fontFamily: "Lato-Bold",
    fontSize: 14,
    lineHeight: 17,
    alignSelf: "center",
    padding: 5,
    paddingHorizontal: 20,
    marginTop: 13,
    marginBottom: Platform.OS == "ios" ? 20 : 0,
  },
});
