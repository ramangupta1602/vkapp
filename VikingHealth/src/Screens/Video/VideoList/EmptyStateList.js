import React from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import { R } from 'Resources';

export const EmptyStateList = () => {
  const style = StyleSheet.create({
    emptyStateContainer: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }
  });

  return (
    <View style={style.emptyStateContainer}>
      <Image source={R.Images.emptyVideo} style={{ marginTop: -100 }} />
      <Text
        style={{
          fontSize: 16,
          fontWeight: '600',
          textAlign: 'center',
          marginTop: 10
        }}
      >
        No call history
      </Text>
    </View>
  );
};
