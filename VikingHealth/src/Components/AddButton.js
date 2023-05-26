import React from "react";
import {
  TouchableWithoutFeedback,
  Image,
  View,
  StyleSheet,
} from "react-native";
import { R } from "Resources";

export const AddButton = ({ onClick }) => (
  <TouchableWithoutFeedback
    style={{}}
    onPress={onClick}
    testID="addIcon"
    accessibilityLabel="addIcon"
  >
    <View style={{ padding: 10 }}>
      <Image source={R.Images.plusRed} style={styles.image} />
    </View>
  </TouchableWithoutFeedback>
);

const styles = StyleSheet.create({
  image: {
    width: 24,
    height: 24,
    resizeMode: "contain",
    // marginRight: 16,
  },
});
