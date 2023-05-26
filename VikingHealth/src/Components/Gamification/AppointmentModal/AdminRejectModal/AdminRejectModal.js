import React from 'react';
import { View, Text, Image, Alert } from 'react-native';
import Styles from '../../styles';
import LocalStyle from './styles';
import { R } from '../../../../Resources/R';
import { ButtonState } from '../../../../Components/CTAButton/ButtonState';
import { ProgressBarButton } from '../../../../Components';
import { Mutation } from 'react-apollo';
import * as AppointmentQueries from '../../../../AppSyncQueries/AppointmentQueries';
// import { Sentry } from 'react-native-sentry';
import { checkInternetConnection } from 'react-native-offline';
import AppUtil from '../../../../Library/Utils/AppUtil';
import {
  AppointmentStatus,
  AppointmentStatusCategory,
  AppointmentInitiatedBy,
} from '../../../../utility/constants/Constants';
import { NextAction } from '../../../../Screens/Appointments/Components/AppointmentItem/AppointmentItem';

export default function AdminRejectModal({
  name,
  patientId,
  appointmentId,
  onDeny,
  onCancel,
  status,
  statusCategory,
}) {
  const mutationData = {
    appointment: {
      patientId,
      appointmentId,
      initiatedBy: AppointmentInitiatedBy.Doctor,
      name,
      message: '',
    },
  };

  const mutation =
    statusCategory === AppointmentStatusCategory.UPCOMING
      ? AppointmentQueries.CancelAppointmentRequest
      : AppointmentQueries.RejectAppointmentRequest;

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
          source={R.Images.AppointmentImages.CancelAppointment}
          resizeMode='contain'
        />

        <Text style={LocalStyle.titleStyle}>Cancel Appointment!</Text>

        <Text style={LocalStyle.textStyle}>
          Are you sure you want to cancel this appointment with{' '}
          <Text style={{ fontWeight: 'bold' }}>{name}</Text>?
        </Text>

        <Mutation
          mutation={mutation}
          refetchQueries={AppUtil.getAppointmentListingFetchQuery(patientId)}
          onError={(error) => {
            console.log('error', error);
            // Sentry.captureMessage(error.message);
            Alert.alert(
              'Alert!',
              'We were not able to process your request. Please try again later.'
            );
          }}
          onCompleted={() => {
            if (onDeny) {
              onDeny(NextAction.ScrollToCompleted);
            }
          }}
          refetchQueries={AppUtil.getAppointmentListingFetchQuery(patientId)}
        >
          {(rejectAppointmentRequest, { loading, error, data }) => {
            let buttonState = ButtonState.Idle;
            if (loading) {
              buttonState = ButtonState.Progress;
            }

            return (
              <View style={{ flexDirection: 'row' }}>
                <ProgressBarButton
                  style={LocalStyle.confirmButtonStyle}
                  disabled={false}
                  label={'YES, I WANT TO CANCEL'}
                  buttonState={buttonState}
                  onClick={() => {
                    checkInternetConnection().then((isConnected) => {
                      if (isConnected === true) {
                        console.log('muation', mutation, mutationData);

                        rejectAppointmentRequest({
                          variables: {
                            appointmentDetails: JSON.stringify(mutationData),
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
              if (onCancel) {
                onCancel();
              }
            }}
          />
        </View>
      </View>
    </View>
  );
}
