import React from 'react';
import { View, StyleSheet } from 'react-native';

const Triangle = ({ style }) => {
  return <View style={[styles.triangle, style]} />;
};

const styles = StyleSheet.create({
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderBottomWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#A6C2D3'
  }
});

export default Triangle;
