import React from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';

const { height } = Dimensions.get('window');

export const PublisherNotAvailable = (props) => {
  return (
    <View
      style={{
        top: height / 2 - 50,
        width: '100%',
      }}
    >
      <View style={{ alignItems: 'center' }}>
        <ActivityIndicator size='small' color='#fff' />
        <Text style={style.textStyle}>{props.text}</Text>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  textStyle: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Lato-Regular',
    marginTop: 15,
    textAlign: 'center',
  },
});
