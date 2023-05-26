import React from "react";
import { TouchableWithoutFeedback, Image, StyleSheet } from "react-native";
import { R } from "Resources";

export const BackButtonWhite = ({ navigation }) => (
  <TouchableWithoutFeedback
    onPress={() => {
      navigation.goBack();
    }}>
    <Image source={R.Images.arrowLeft} style={backButtonStyles.imageBack} />
  </TouchableWithoutFeedback>
);

const backButtonStyles = StyleSheet.create({
  imageBack: {
    width: 25,
    height: 20,
    resizeMode: "contain",
    tintColor: "#fff",
  },
});
