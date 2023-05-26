import { StyleSheet } from "react-native";
import { R } from "Resources";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: R.Colors.COLOR_WHITE,
    borderRadius: 10,
    paddingLeft: 16,
    marginBottom: 10,
    padding: 10,
    paddingTop: 8
  },
  cardHeader: {
    alignItems: "center",
    flexDirection: "row",
    // justifyContent: 'space-between',
    marginBottom: 10
  },

  nameStyle: {
    color: R.Colors.COLOR_CARD_TEXT,
    fontFamily: "Lato-Bold",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.12,
    lineHeight: 19,
    paddingLeft: 14
  },
  subInfoTextStyle: {
    color: R.Colors.COLOR_CARD_INFO,
    fontFamily: "Lato-Regular",
    fontSize: 14,
    lineHeight: 14,
    paddingVertical: 4
  },

  programEndContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginRight: -10 // to overcome parent view padding of 8 px.
  },

  programEndStyle: {
    color: R.Colors.COLOR_CARD_INFO,
    fontFamily: "Lato-Regular",
    fontSize: 12,
    letterSpacing: 0.19,
    lineHeight: 15
    // marginTop: 5
  },

  boxWithShadow: {
    shadowColor: R.Colors.COLOR_SHADOW,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 1
  },
  circle: {
    height: 42,
    width: 42,
    borderRadius: 100,
    borderWidth: 1
  },
  resendContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    height: "100%"
    // marginTop: 10
  },
  resend: {
    // flexDirection: 'row',
    // alignItems: 'flex-end',
    // justifyContent: 'flex-end',
    // backgroundColor: 'red'
    // left: '80%',
    // position: 'absolute',
  },
  resendText: {
    color: R.Colors.COLOR_BLUE_CARDS,
    fontWeight: "bold",
    fontFamily: "Lato",
    fontSize: 14
  },
  subInfo: {
    marginLeft: 2,
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: 10,
    paddingTop: 6
  }
});
