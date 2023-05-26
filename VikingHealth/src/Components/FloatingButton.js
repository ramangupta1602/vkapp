import React from 'react';
import { TouchableOpacity, Image } from 'react-native';

export const FloatingButton = (props = {}) => (
  <TouchableOpacity
    style={[
      {
        position: 'absolute',
        right: 15,
        bottom: 30,
        zIndex: 998,
        flex: 1,
      },
      props.style,
    ]}
    onPress={props.onClick}
  >
    <Image source={props.image} />
  </TouchableOpacity>
);
