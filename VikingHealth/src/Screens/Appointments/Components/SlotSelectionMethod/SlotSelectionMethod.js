import React from 'react';
import {
  View,
  Text,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Styles from './styles';
import { R } from '../../../../Resources/R';

export function SlotSelectionMethod({
  selectedIndex,
  animation,
  onSelectionChange,
}) {
  const { width } = Dimensions.get('window');
  const interpolation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width / 2],
  });

  return (
    <View style={Styles.containerStyle}>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          style={Styles.touchableWrapperStyle}
          onPress={() => {
            if (onSelectionChange) {
              onSelectionChange(0);
            }
          }}
        >
          <Text
            style={[
              Styles.textStyle,
              { color: selectedIndex === 0 ? '#1072E0' : '#A1AAB3' },
            ]}
          >
            Quick Slots
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={Styles.touchableWrapperStyle}
          onPress={() => {
            if (onSelectionChange) {
              onSelectionChange(1);
            }
          }}
        >
          <Text
            style={[
              Styles.textStyle,
              {
                color: selectedIndex === 1 ? '#1072E0' : '#A1AAB3',
              },
            ]}
          >
            Custom Slots
          </Text>
        </TouchableOpacity>
      </View>
      <Animated.View
        style={{
          width: '50%',
          backgroundColor: R.Colors.COLOR_BLUE,
          height: 3,
          transform: [{ translateX: interpolation }],
        }}
      />
    </View>
  );
}
