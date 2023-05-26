import React from 'react';
import { View, Image, Text } from 'react-native';
import Styles from './styles';
import { R } from '../../../../Resources/R';

export function EmptyState({ type }) {
  return (
    <View style={Styles.containerStyle}>
      <Image
        style={Styles.imageStyle}
        source={R.Images.AppointmentImages.emptyState}
      />
      <Text style={Styles.textStyle}>
        {`There are no ${type.toLowerCase()} appointments.`}
      </Text>
    </View>
  );
}
