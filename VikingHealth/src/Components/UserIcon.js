import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { R } from 'Resources';

export const UserIcon = props => (
  <TouchableOpacity onPress={props.onClick}>
    <View style={styles.userIconBkg}>
      <Text style={styles.userIconText}>
        {props.initials.substring(0, 2).toUpperCase()}
      </Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  userIconBkg: {
    height: 40,
    width: 40,
    backgroundColor: R.Colors.COLOR_DARK_BLUE,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16
  },

  userIconText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600'
  }
});
