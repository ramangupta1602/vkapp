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
import {
  AppointmentInitiatedBy,
  AppointmentStatusCategory,
} from '../../../../utility/constants/Constants';
import { NextAction } from '../../../../Screens/Appointments/Components/AppointmentItem/AppointmentItem';
import AppUtils from '../../../../Library/Utils/AppUtil';

export default function PatientRejectModal({
  name,
  patientId,
  appointmentId,
  onDeny,
  onCancel,
  userName,
  appointmentStatusCategory,
  showRemainderModal,
}) {
  const isUpcoming =
    appointmentStatusCategory === AppointmentStatusCategory.UPCOMING;

  const mutation = isUpcoming
    ? AppointmentQueries.CancelAppointmentRequest
    : AppointmentQueries.RejectAppointmentRequest;

  const mutationData = {
    appointment: {
      patientId,
      appointmentId,
      initiatedBy: AppointmentInitiatedBy.Patient,
      name: userName,
      message: '',
    },
  };

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
          Are you sure you are not available on any of the proposed time slots?{' '}
          {'\n\n'}If yes, then you might lose your current week’s appointment
          and you can’t carry forward this to upcoming weeks.
        </Text>

        <Mutation
          mutation={mutation}
          onError={(error) => {
            console.log('error', error);
            // Sentry.captureMessage(error.message);
            Alert.alert(
              'Alert!',
              'We were not able to process your request. Please try again later.'
            );
          }}
          onCompleted={() => {
            if (isUpcoming && showRemainderModal) {
              showRemainderModal();
            }

            if (onDeny) {
              onDeny(NextAction.ScrollToCompleted);
            }
          }}
          refetchQueries={AppUtils.getAppointmentListingFetchQuery(patientId)}
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
                  label={'YES, I AM NOT AVAILABLE'}
                  buttonState={buttonState}
                  onClick={() => {
                    checkInternetConnection().then((isConnected) => {
                      if (isConnected === true) {
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
