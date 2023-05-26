import React, { Component } from 'react';
import { View, ActivityIndicator, Dimensions } from 'react-native';

class ProgressBar extends Component {
  render() {
    const { width, height } = Dimensions.get('window');
    return (
      <View
        style={{
          position: 'absolute',
          left: width / 2,
          height: height / 2,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <ActivityIndicator size={'large'} />
      </View>
    );
  }
}

export { ProgressBar };
