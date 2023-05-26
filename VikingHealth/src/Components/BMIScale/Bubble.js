import React from 'react';
import { StyleSheet, Text, View, ImageBackground } from 'react-native';
import { R } from 'Resources';

export const Bubble = ({ value }) => (
  <View>
    <ImageBackground
      source={R.Images.bubbleShape}
      style={bmiBubbleStyles.bubble}
    >
      <Text style={bmiBubbleStyles.valueText}>{value}</Text>
    </ImageBackground>
  </View>
);

const bmiBubbleStyles = StyleSheet.create({
  bubble: {
    width: 133,
    height: 58,
    display: 'flex',
    alignItems: 'center'
  },
  valueText: {
    fontFamily: 'Lato-Regular',
    fontWeight: '600',
    color: R.Colors.COLOR_DARK_BLUE,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 15
  }
});
