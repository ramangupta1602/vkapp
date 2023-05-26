import React from 'react';
import { View, Platform } from 'react-native';

const boxShadowStyle = {
  ...Platform.select({
    ios: {
      shadowColor: 'rgba(161, 172, 180, 0.11)',
      shadowOffset: { height: 5, width: 9 },
      shadowRadius: 3
    },
    android: {
      elevation: 0.5
    }
  })
};

const CircularRing = props => (
  // <View
  //   style={{
  //     backgroundColor: props.color,
  //     width: 12,
  //     height: 12,
  //     marginRight: 5,
  //     marginTop: 1,
  //     borderRadius: 6,
  //     justifyContent: 'center',
  //     ...boxShadowStyle
  //   }}
  // >
  //   <View
  //     style={{
  //       backgroundColor: '#fff',
  //       width: 7,
  //       height: 7,
  //       borderRadius: 3.5,
  //       alignSelf: 'center'
  //     }}
  //   />

  <View
    style={{
      height: 12,
      width: 12,
      borderRadius: 6,
      borderWidth: 2.5,
      borderColor: props.color,
      marginRight: 5,
      marginTop: 2,
      marginBottom: 1,
      ...boxShadowStyle
    }}
  />
  // </View>
);

export default CircularRing;
