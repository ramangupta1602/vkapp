import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { R } from 'Resources';

export const SplashImage = () => (
  <View style={styles.container}>
    {/* <Text>Splash</Text> */}
    <Image source={R.Images.splashLogo} style={styles.welcome} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  welcome: {
    width: 200,
    height: 100,
    resizeMode: 'contain',
  },
});
