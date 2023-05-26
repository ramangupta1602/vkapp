import React from "react";
import { View, Text } from "react-native";

const WrappedTextContainer = () => {
  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        flexShrink: 1,
        color,
      }}
    >
      <Text></Text>
    </View>
  );
};

export default WrappedTextContainer;
