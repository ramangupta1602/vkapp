import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    backgroundColor: "transparent",
  },

  categoryContainerStyle: {
    height: null,
    width: "100%",
    marginBottom: 24,
  },

  categoryTitleContainerStyle: {
    height: 50,
    flexDirection: "row",
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 3 },
    shadowColor: "#b9d0df",
    shadowOpacity: 0.18,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    zIndex: 1,
    elevation: 0.5,
  },

  categoryTitleContainerStyleForView: {
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
  },

  categoryImage: {
    height: 40,
    width: 40,
    margin: 5,
    marginRight: 11,
  },

  categoryTitleStyle: {
    fontSize: 14,
    color: "#282727",
    fontFamily: "Lato-Bold",
    lineHeight: 17,
    fontWeight: "500",
  },

  serachIconStyle: {
    marginLeft: 17,
    marginTop: 15,
    marginBottom: 15,
    marginRight: 8,
  },

  serachTextStyle: {
    flex: 1,
    fontFamily: "Lato-Regular",
    fontSize: 14,
    color: "black",
    height: 45,
    padding: 0,
    lineHeight: 17,
  },
  loadingIndicatorContainerStyle: {
    flex: 1,
    height: "100%",
    minHeight: 200,
    alignSelf: "center",
    justifyContent: "center",
  },

  searchBarContainer: {
    backgroundColor: "#E8F0F5",
    height: 45,
    width: "100%",
    borderRadius: 5,
    marginTop: 24,
    marginBottom: 9,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    shadowOffset: { width: 0, height: 5 },
    shadowColor: "#b9d0df",
  },

  collapsableContainerStyle: {
    overflow: "hidden",
    padding: 0,
    shadowOffset: { width: 0, height: 9 },
    shadowColor: "#b9d0df",
    shadowOpacity: 0.18,
  },

  collapsableView: {
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },

  quoteContainer: {
    margin: 20,
    backgroundColor: "#EFF5F9",
    borderRadius: 10,
    shadowOffset: { width: 0, height: 9 },
    shadowColor: "#b9d0df",
    shadowOpacity: 0.1,
  },

  quoteTextStyle: {
    margin: 15,
    color: "#8191A2",
    fontFamily: "Lato",
    fontSize: 12,
    letterSpacing: 0.13,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 15,
  },

  protipContainer: {
    marginTop: 24,
    padding: 16,
    borderRadius: 10,
    backgroundColor: "#86A8E7",
  },

  proTipTextStyle: {
    borderRadius: 10,
    backgroundColor: "#448DBF",
    overflow: "hidden",
    color: "white",
    textAlign: "center",
    height: 19,
    width: 50,
    fontFamily: "Lato",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 0.13,
    // lineHight is 17 to center text vertically....
    lineHeight: 17,
  },

  proTipStyle: {
    marginTop: 6,
    fontFamily: "Lato",
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "600",
    letterSpacing: 0.16,
    lineHeight: 16,
  },

  subCategoryTitleContainerStyle: {
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
    marginBottom: 10,
    marginTop: 20,
  },

  subCategoryTextStyle: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Lato",
    lineHeight: 17,
    color: "#282727",
    paddingLeft: 10,
    textTransform: "uppercase",
  },
  foodItemContainerStyle: {
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF3F7",
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  foodItemTextStyle: {
    fontFamily: "Lato-Regular",
    fontSize: 12,
    height: 14,
    color: "#282727",
    lineHeight: 14,
    fontWeight: "400",
  },
});
