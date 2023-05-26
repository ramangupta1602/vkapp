import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Styles from '../styles';
import { R } from '../../../Resources/R';
import { ProgressBarButton } from '../../../Components';
import { strings } from '../../../utility/locales/i18n';
import { dynamicSize } from '../../../utility/ResizeUtil';

export default function BookAppointmentSuccessful({
  buttonState,
  onClick,
  userData,
  isReschedule,
}) {
  const gender = userData.gender == 'male' ? 'his' : 'her';
  const message = isReschedule
    ? strings('appointment.rescheduleSlotSendSuccessfullyMessage', {
        fullName: userData.fullName,
        gender,
      })
    : strings('appointment.slotSendSuccessfullyMessage', {
        fullName: userData.fullName,
        gender,
      });

  return (
    <View
      style={[
        Styles.gamificationCardStyles,
        {
          width: '100%',
          marginTop: 70,
          paddingTop: 32,
          backgroundColor: '#EFF5F9',
        },
      ]}
    >
      <Image
        source={R.Images.AppointmentImages.BookingModalSuccess}
        style={localStyle.imageStyle}
      />

      <Text style={[Styles.titleStyle, localStyle.titleStyle]}>
        {strings('appointment.slotSentSuccessfully')}
      </Text>

      <Text style={localStyle.messageTextStyle}>{message}</Text>

      <ProgressBarButton
        buttonState={buttonState}
        label={'OK'}
        style={localStyle.ctaButtonStyle}
        onClick={onClick}
      />
    </View>
  );
}

const localStyle = StyleSheet.create({
  titleStyle: {
    fontSize: 24,
    marginTop: 13,
    fontWeight: '600',
    letterSpacing: 0.77,
    lineHeight: 29,
    paddingHorizontal: 0,
  },

  messageTextStyle: {
    color: R.Colors.COLOR_TEXT_NUMBER,
    fontSize: 16,
    letterSpacing: 0.48,
    lineHeight: 21,
    fontFamily: 'Lato-regular',
    marginTop: 22,
    paddingHorizontal: 0,
    textAlign: 'center',
  },

  ctaButtonStyle: {
    marginTop: 46,
  },

  imageStyle: {
    height: dynamicSize(163),
    width: dynamicSize(188),
    alignSelf: 'center',
  },
});
