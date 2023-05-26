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

export default function PatientRequestRescheduleModal({
  name,
  patientId,
  appointmentId,
  onDeny,
  onCancel,
  userName,
  status,
  statusCategory,
}) {
  //     rescheduleAppointmentRequest(appointmentDetails:
  //         "{\"appointment\" :
  //         {\"patientId\":\"79a6c4bf-f6d2-42af-b9dc-d04757b6c851\",
  //         \"appointmentId\":\"cb5b8ef2-5649-4301-8247-e92da799691c\",
  //         \"initiatedBy\": \"Doctor\",
  //         \"proposedSlot\" : [{\"startTime\":\"2020-07-15 08:00:00\",\"endTime\":\"2020-07-15 09:00:00\"}],
  //         \"name\":\"testing user\"}}")
  // }

  const mutationData = {
    appointment: {
      patientId,
      appointmentId,
      initiatedBy: AppointmentInitiatedBy.Patient,
      proposedSlot: [],
      name: userName,
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
          source={R.Images.AppointmentImages.requestReschedule}
          resizeMode='contain'
        />

        <Text style={LocalStyle.titleStyle}>Request to reschedule!</Text>

        <Text style={LocalStyle.textStyle}>
          Are you sure you are not available on any of these slots and want to
          reschedule this appointment?
        </Text>

        <Mutation
          mutation={AppointmentQueries.RescheduleAppointmentRequest}
          refetchQueries={AppUtil.getAppointmentListingFetchQuery(patientId)}
          onError={(error) => {
            console.log('error', error);
            // Sentry.captureMessage(error.message);
            Alert.alert(
              'Alert!',
              'We were not able to process your request. Please try again later.'
            );
          }}
          onCompleted={(data) => {
            if (onDeny) {
              onDeny(NextAction.ScrollToPending);
            }
          }}
          refetchQueries={AppUtil.getAppointmentListingFetchQuery(patientId)}
        >
          {(rescheduleAppointmentRequest, { loading, error, data }) => {
            let buttonState = ButtonState.Idle;
            if (loading) {
              buttonState = ButtonState.Progress;
            }

            return (
              <View style={{ flexDirection: 'row' }}>
                <ProgressBarButton
                  style={LocalStyle.confirmButtonStyle}
                  disabled={false}
                  label={'YES, I WANT TO RESCHEDULE'}
                  buttonState={buttonState}
                  onClick={() => {
                    checkInternetConnection().then((isConnected) => {
                      if (isConnected === true) {
                        rescheduleAppointmentRequest({
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
            label={'Cancel'}
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
