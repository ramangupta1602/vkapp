import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Styles from './styles';
import { R } from '../../../../Resources/R';
import moment from 'moment';
import * as DateUtils from '../../../../Library/Utils/DateUtil';

export function SlotChips({ slot, onClose }) {
  const startTime = DateUtils.getAppointmentFormattedTime(slot.startTime);
  const endTime = DateUtils.getAppointmentFormattedTime(slot.endTime);
  const day = DateUtils.getAppointmentFormattedDate(slot.date);
  return (
    <View style={Styles.containerStyle}>
      <View>
        <Text style={Styles.dateStyle}>{day}</Text>
        <Text style={Styles.timeStyle}>
          {startTime} - {endTime}
        </Text>
      </View>
      <TouchableOpacity
        hitSlop={{ right: 20, left: 20, top: 10, bottom: 10 }}
        activeOpacity={1}
        onPress={() => {
          onClose(slot);
        }}
      >
        <Image
          source={R.Images.AppointmentImages.cross}
          style={Styles.crossIconStyle}
        />
      </TouchableOpacity>
    </View>
  );
}
