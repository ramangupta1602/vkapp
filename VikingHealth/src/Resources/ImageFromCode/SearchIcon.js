import React from 'react';
import { View, StyleSheet } from 'react-native';

const SearchIcon = ({ style }) => {
  return (
    <View style={[styles.magnifyingGlass, style]}>
      <View style={styles.magnifyingGlassCircle} />
      <View style={styles.magnifyingGlassStick} />
    </View>
  );
};

const styles = StyleSheet.create({
  magnifyingGlass: {
    width: 15,
    height: 15
  },
  magnifyingGlassCircle: {
    width: 12,
    height: 12,
    borderRadius: 7.5,
    borderWidth: 2,
    borderColor: '#A1AAB3'
  },
  magnifyingGlassStick: {
    left: 8,
    top: 11,
    position: 'absolute',
    backgroundColor: '#A1AAB3',
    width: 8,
    height: 2,
    transform: [{ rotate: '45deg' }]
  }
});

export default SearchIcon;
