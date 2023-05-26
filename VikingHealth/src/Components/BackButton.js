import React from 'react';
import {
  TouchableWithoutFeedback,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { R } from 'Resources';

export const BackButton = ({
  navigation,
  style = {},
  backButtonStyle,
  imageStyle,
}) => (
  <TouchableWithoutFeedback
    activeOpacity={1}
    testID={'backButton'}
    accessibilityLabel={'backButton'}
    style={[backButtonStyles.backButtonStyle, backButtonStyle]}
    onPress={() => {
      navigation.goBack();
    }}
  >
    <View style={{ padding: 10, ...style }}>
      <Image
        source={R.Images.arrowLeft}
        style={[backButtonStyles.imageBack, { ...imageStyle }]}
      />
    </View>
  </TouchableWithoutFeedback>
);

const backButtonStyles = StyleSheet.create({
  backButtonStyle: {
    // marginBottom: 20,
    padding: 10,
    width: 100,
  },
  imageBack: {
    width: 25,
    padding: 10,
    height: 20,
    resizeMode: 'contain',
    marginBottom: 16,
  },
});
