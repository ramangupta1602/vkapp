import React from 'react';
import { View, Text, Image } from 'react-native';
import Styles from '../../styles';
import LocalStyle from './styles';
import { R } from '../../../../Resources/R';
import { ButtonState } from '../../../../Components/CTAButton/ButtonState';
import { ProgressBarButton } from '../../../../Components';

export default function ConfirmAppointment({
  children,
  buttonState = ButtonState.Idle,
  onConfirmAppointmentClick,
  onDenyAppointmentClick,
  confirmLoading,
  denyLoading,
  name,
  time,
  gender,
  onLaterClick,
  dataLoading,
}) {
  const pronoun = gender === 'male' ? 'his' : 'her';

  return (
    <View
      style={[
        Styles.gamificationCardStyles,
        { paddingBottom: 0, paddingHorizontal: 0, paddingTop: 0 },
      ]}
    >
      <View style={LocalStyle.containerStyle}>
        <Image
          style={LocalStyle.imageStyle}
          source={R.Images.AppointmentImages.confirmAppointment}
        />
        <Text style={LocalStyle.titleStyle}>Confirm appointment!</Text>

        <View>
          <View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              justifyContent: 'center',
              alignContent: 'center',
              alignItems: 'center',
              opacity: dataLoading ? 1 : 0,
            }}
          >
            <Text>Fetching details...</Text>
          </View>

          <View style={{ opacity: dataLoading ? 0 : 1 }}>
            <Text style={LocalStyle.textStyle}>
              <Text style={{ fontWeight: 'bold' }}>{name}</Text>
              {` has selected the time slot of `}
              <Text style={{ fontWeight: 'bold' }}>{time}</Text>

              <Text>{` for ${pronoun} appointment with you.`}</Text>
            </Text>
            <Text style={[LocalStyle.textStyle, { marginTop: 24 }]}>
              Please take action for the appointment.
            </Text>

            <View style={{ flexDirection: 'row' }}>
              <ProgressBarButton
                style={LocalStyle.confirmButtonStyle}
                disabled={false}
                label={'Confirm Appointment'}
                buttonState={confirmLoading}
                onClick={() => {
                  if (onConfirmAppointmentClick) {
                    onConfirmAppointmentClick();
                  }
                }}
              />
            </View>

            <View style={{ flexDirection: 'row' }}>
              <ProgressBarButton
                style={LocalStyle.denyButtonStyle}
                textStyle={{ color: '#D0444C' }}
                disabled={false}
                label={'Deny Appointment'}
                buttonState={denyLoading}
                progressColor='#D0444C'
                onClick={() => {
                  if (onDenyAppointmentClick) {
                    onDenyAppointmentClick();
                  }
                }}
              />
            </View>

            <Text
              style={{
                paddingVertical: 10,
                paddingHorizontal: 20,
                marginBottom: 16,
                textAlign: 'center',
              }}
              onPress={onLaterClick}
            >
              Maybe Later
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
