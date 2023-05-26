import { StyleSheet } from "react-native";
import { R } from "Resources";
export const styles = StyleSheet.create({
  container: {
    backgroundColor: R.Colors.COLOR_APP_BACKGROUND,
    justifyContent: "flex-start",
    flex: 1,
    paddingBottom: 20
  },
  buttonContainer: {
    flexDirection: "column",
    justifyContent: "flex-end",
    padding: 44,
    paddingTop: 0,
    flex: 1
  },
  containerWeightPassword: {
    marginTop: 22,
    marginLeft: 26,
    marginRight: 26,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },

  image: {
    height: 14,
    width: 14,
    resizeMode: "contain"
  },
  weightContainer: {
    marginTop: 30,
    marginLeft: 10,
    marginRight: 10,
    flexDirection: "row",
    justifyContent: "space-around"
  },
  bmiContainer: {
    marginLeft: 38,
    marginRight: 38,
    marginTop: 32,
    alignItems: "center",
    justifyContent: "center"
  },
  lineStyle: {
    marginLeft: 27,
    marginRight: 27,
    marginTop: 20,
    height: 1,
    backgroundColor: "#456789"
  },
  heightToWaistRatio: {
    fontFamily: "Lato-Regular",
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 15,
    letterSpacing: 0.11,
    color: R.Colors.COLOR_TEXT
  },
  weightChangePasswordStyle: {
    color: R.Colors.COLOR_TEXT_NUMBER,
    fontFamily: "Lato-Regular",
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 17
  },

  versionTextStyle: {
    color: R.Colors.COLOR_TEXT_GREY,
    fontFamily: "Lato-Regular",
    fontSize: 14,
    lineHeight: 14,
    paddingVertical: 4,
    alignSelf: "center",
    padding: 5
  },

  logoutButtonStyle: {
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#CE363E",
    backgroundColor: R.Colors.COLOR_APP_BACKGROUND,
    marginTop: 100,
    marginLeft: 30,
    marginRight: 30,
    alignItems: "center",
    justifyContent: "center"
  },
  logoutTextStyle: {
    color: "#CE363E",
    fontFamily: "Lato-Regular",
    fontSize: 14,
    padding: 18,
    fontWeight: "bold",
    lineHeight: 12
  }
});
