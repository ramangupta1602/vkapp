import React from 'react';
import { View, StyleSheet, Text, ImageBackground } from 'react-native';
import { R } from 'Resources';
import { BackButtonWhite } from 'Components';

export const HeaderView = navigation => {
  return (
    <View style={styles.headerStyle}>
      <ImageBackground
        source={R.Images.topBlackOverlay}
        style={styles.imageBackgroundStyle}
      >
        <View
          style={{
            flexDirection: 'row',
            paddingLeft: 10,
            paddingRight: 10
          }}
        >
          <BackButtonWhite navigation={navigation.navigation} />
          <Text style={styles.subTitleStyle}>Weight Loss Program</Text>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  headerStyle: {
    width: '100%',
    top: 0,
    position: 'absolute'
  },
  imageBackgroundStyle: {
    justifyContent: 'center',
    width: '100%',
    height: 85
  },
  subTitleStyle: {
    fontSize: 14,
    marginLeft: 10,
    color: '#fff',
    letterSpacing: 0.16,
    fontFamily: 'Lato-Regular'
  }
});
