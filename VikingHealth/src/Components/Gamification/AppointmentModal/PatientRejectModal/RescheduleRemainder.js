import React from 'react';
import { View, Text, Image, Alert } from 'react-native';
import Styles from '../../styles';
import LocalStyle from './styles';
import { R } from '../../../../Resources/R';
import { ButtonState } from '../../../../Components/CTAButton/ButtonState';
import { ProgressBarButton } from '../../../../Components';
import { strings } from '../../../../utility/locales/i18n';
import { Mutation } from 'react-apollo';
import * as AppointmentQueries from '../../../../AppSyncQueries/AppointmentQueries';
// import { Sentry } from 'react-native-sentry';
import { checkInternetConnection } from 'react-native-offline';
import { NextAction } from '../../../../Screens/Appointments/Components/AppointmentItem/AppointmentItem';

export default function RescheduleRemainder({ onClick, patientId, fullName }) {
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
          source={R.Images.AppointmentImages.notAvailable}
        />
        <Text style={LocalStyle.textStyle}>
          {strings('appointment.rescheduleRemainderMessage')}
        </Text>

        <Mutation
          mutation={AppointmentQueries.PushNotificationToBookNewAppointment}
          onError={(error) => {
            console.log('error', error);
            // Sentry.captureMessage(error.message);
            Alert.alert(
              'Alert!',
              'We were not able to process your request. Please try again later.'
            );
          }}
          onCompleted={() => {
            if (onClick) {
              onClick();
            }
          }}
        >
          {(pnToBookAppointment, { loading, error, data }) => {
            let buttonState = ButtonState.Idle;
            if (loading) {
              buttonState = ButtonState.Progress;
            }

            return (
              <View style={{ flexDirection: 'row' }}>
                <ProgressBarButton
                  style={LocalStyle.confirmButtonStyle}
                  disabled={false}
                  label={'Yes, I want to request'}
                  buttonState={buttonState}
                  onClick={() => {
                    checkInternetConnection().then((isConnected) => {
                      if (isConnected === true) {
                        pnToBookAppointment({
                          variables: {
                            message: strings(
                              'appointment.rescheduleRemainderPopupMessage',
                              { name: fullName }
                            ),
                            patientId,
                          },
                        });
                      } else {
                        Alert.alert(
                          'No Internet Connection',
                          'It seems there is some problem with your internet connection. Please check and try again.'
                        );
                      }
                    });
                  }}
                />
              </View>
            );
          }}
        </Mutation>

        <View style={{ flexDirection: 'row' }}>
          <ProgressBarButton
            style={LocalStyle.denyButtonStyle}
            textStyle={{ color: '#D0444C' }}
            disabled={false}
            label={'Dismiss'}
            buttonState={ButtonState.Idle}
            progressColor='#D0444C'
            onClick={() => {
              if (onClick) {
                onClick();
              }
            }}
          />
        </View>
      </View>
    </View>
  );
}
