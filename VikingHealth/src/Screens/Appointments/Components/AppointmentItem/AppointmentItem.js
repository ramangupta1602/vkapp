import React, { Component } from 'react';
import { View, Text, Platform, Alert, Animated } from 'react-native';
import Styles from './styles';
import {
  RandomColors,
  ProgressBarButton,
  GamificationModal,
  LocalNotification,
} from '../../../../Components';
import Slots, { Slot } from './Slots';
import {
  AppointmentStatus,
  AppointmentStatusCategory,
  Gamification as GamificationConstant,
  AppointmentInitiatedBy,
} from '../../../../utility/constants/Constants';
import * as AppointmentQueries from '../../../../AppSyncQueries/AppointmentQueries';
// import { Sentry } from 'react-native-sentry';
import { checkInternetConnection } from 'react-native-offline';
import { ButtonState } from '../../../../Components/CTAButton/ButtonState';
import * as DateUtils from '../../../../Library/Utils/DateUtil';
import moment from 'moment';
import { Mutation, Query } from 'react-apollo';
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import { inject, observer } from 'mobx-react';
import ScreenNameConstant from '../../../ScreenNameConstant';
import AppUtil from '../../../../Library/Utils/AppUtil';
import { TabsName } from '../AppointmentListingTab/AppointmentListingTab';
import { appsyncClient } from '../../../../../App';

export const NextAction = {
  ScrollToCompleted: 'scrollToCompleted',
  ScrollToPending: 'scrollToPending',
  ScrollToUpcoming: 'scrollToUpcoming',
  None: 'none',
};

@inject('userAccountStore', 'loginUserStore')
@observer
export class AppointmentItem extends Component {
  constructor(props) {
    super(props);

    this.nextAction = NextAction.None;

    this.state = {
      shouldShowPatientRejectAppointment: false,
      shouldShowAdminCancelAppointmentPopup: false,
      shouldShowPatientReschedulePopup: false,
      modalName: GamificationConstant.Appointment.PatientCancelRequest,
      nextAction: NextAction.None,
      highLightAnimation: new Animated.Value(0),
    };

    this.scheduleNotification();

    const shouldHighLight =
      props.highlight === props.appointmentDetails.appointmentId;

    if (shouldHighLight) {
      this.startPulseAnimationWithDelay();
    }
  }

  startPulseAnimationWithDelay = () => {
    setTimeout(() => {
      this.startPulsatingAnimation();
    }, 500);
  };

  scheduleNotification = () => {
    const { appointmentDetails, isAdmin } = this.props;
    const { appointmentId, statusCategory } = appointmentDetails;
    const localNotification = new LocalNotification();

    if (isAdmin) {
      return;
    }

    let selectedSlotStr = appointmentDetails.selectedSlot;
    if (!selectedSlotStr) {
      return;
    }

    let selectedSlot = JSON.parse(selectedSlotStr);

    const startTime = moment.utc(selectedSlot.startTime).local();
    const endTime = moment.utc(selectedSlot.endTime).local();

    if (statusCategory !== AppointmentStatusCategory.UPCOMING) {
      // cancel localNotification.
      localNotification.cancelAppointmentNotification(startTime);
    } else {
      localNotification.scheduleAppointmentRemainderNotification(
        startTime,
        endTime,
        appointmentId
      );
    }
  };

  shouldShowCancelButton = (status, statusCategory) => {
    return statusCategory !== AppointmentStatusCategory.COMPLETED;
  };

  shouldShowRescheduleButton = (status, statusCategory) => {
    // return true;

    const { isAdmin, appointmentDetails } = this.props;
    const { initiatedBy } = appointmentDetails;

    if (status === AppointmentStatus.RESCHEDULE) {
      if (isAdmin) {
        return initiatedBy !== AppointmentInitiatedBy.Doctor;
      } else {
        return initiatedBy === AppointmentInitiatedBy.Doctor;
      }
    }

    if (isAdmin) {
      return (
        statusCategory === AppointmentStatusCategory.UPCOMING ||
        statusCategory === AppointmentStatus.PENDING
      );
    } else {
      return statusCategory !== AppointmentStatusCategory.COMPLETED;
      // return true;
    }
  };

  shouldShowAcceptButton = (status, statusCategory) => {
    const { isAdmin } = this.props;

    if (!isAdmin) {
      return false;
    }

    return status === AppointmentStatus.ACCEPTED;
  };

  shouldShowPurposedSlotTag = (status, statusCategory) => {
    return true;
  };

  shouldShowSelectedSlot = (status, statusCategory) => {
    return (
      statusCategory === AppointmentStatusCategory.UPCOMING ||
      status === AppointmentStatus.ACCEPTED
    );
  };

  shouldShowAcceptAppointmentButton = (status, statusCategory) => {
    const { appointmentDetails, isAdmin } = this.props;

    if (isAdmin) {
      return false;
    }

    const { initiatedBy } = appointmentDetails;

    return (
      status === AppointmentStatus.PROPOSED ||
      (status === AppointmentStatus.RESCHEDULE &&
        initiatedBy === AppointmentInitiatedBy.Doctor)
    );
  };

  getTagMessage = (status, statusCategory, appointmentDetails) => {
    switch (statusCategory) {
      case AppointmentStatusCategory.UPCOMING:
        const shouldShowCard = this.shouldShowCard(appointmentDetails);
        return shouldShowCard ? 'Upcoming' : 'Missed';

      case AppointmentStatusCategory.COMPLETED:
        if (status === AppointmentStatus.MISSED) {
          return 'Missed';
        } else if (status === AppointmentStatus.CANCEL) {
          return 'Cancelled';
        }

        return 'Completed';
    }

    switch (status) {
      case AppointmentStatus.ACCEPTED:
        return 'Accepted time slot';

      case AppointmentStatus.RESCHEDULE:
        const { initiatedBy } = appointmentDetails;

        if (initiatedBy === AppointmentInitiatedBy.Patient) {
          return 'Reschedule Requested';
        } else {
          return 'Re-Proposed time slot(s)';
        }
    }

    return 'Proposed time slot(s)';
  };

  onError = (error) => {
    // Sentry.captureMessage(error.message);
    Alert.alert(
      'Alert!',
      'We are not able to process your request. Please try again later'
    );
  };

  utcDateToString = (momentInUTC) => {
    let s = moment.utc(momentInUTC).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    return s;
  };

  getEventConfiguration = () => {
    const { appointmentDetails } = this.props;
    const slot = JSON.parse(appointmentDetails.selectedSlot);
    const userDetails = JSON.parse(appointmentDetails.userDetails);
    const { modeOfAppointment = 'Online' } = appointmentDetails;

    const eventConfig = {
      title: `Appointment: Dr. Middelthon|${userDetails.name} [${modeOfAppointment}]`,
      startDate: this.utcDateToString(slot.startTime),
      endDate: this.utcDateToString(slot.endTime),
      notes: `Appointment with ${userDetails.name}`,
      recipient: userDetails.email,
    };

    return eventConfig;
  };

  onConfirmAppointmentClick = () => {
    const eventConfig = this.getEventConfiguration();

    AddCalendarEvent.presentEventCreatingDialog(eventConfig)
      .then((eventInfo) => {
        const { eventIdentifier, action } = eventInfo;

        switch (action) {
          case 'SAVED':
            this.performConfirmMutation(eventIdentifier);
            break;
          case 'CANCELED':
            this.performCalendarCancellation();
            break;
        }
      })
      .catch((error) => {
        // handle error such as when user rejected permissions
        console.warn(error);
      });
  };

  performCalendarCancellation = () => {
    if (Platform.OS === 'ios') {
      return;
    }

    Alert.alert(
      'Viking Health',
      'Were you able to add the appointment into your calendar?',
      [
        {
          text: 'No',
          onPress: () => {
            return;
          },
        },
        {
          text: 'Yes',
          onPress: () => {
            this.performConfirmMutation('no-identifier');
          },
        },
      ]
    );
  };

  performConfirmMutation = (eventIdentifier) => {
    const { appointmentId } = this.props.appointmentDetails;
    const data = {
      appointmentDetails: JSON.stringify({
        appointment: {
          appointmentId,
          eventId: eventIdentifier,
        },
      }),
    };

    checkInternetConnection().then((isConnected) => {
      if (isConnected) {
        if (this.confirmAppointmentRequest) {
          this.confirmAppointmentRequest({
            variables: data,
          });
        }
      } else {
        this.showInternetError();
      }
    });
  };

  showInternetError = () => {
    Alert.alert(
      'No Internet Connection',
      'It seems there is some problem with your internet connection. Please check and try again.'
    );
  };

  onCancelPressed = () => {
    const { appointmentDetails, isAdmin } = this.props;
    const { status, statusCategory } = appointmentDetails;

    switch (statusCategory) {
      // in case of upcoming, we cancel appointment
      case AppointmentStatusCategory.UPCOMING:
        if (isAdmin) {
          this.setState({
            shouldShowAdminCancelAppointmentPopup: true,
            modalName: GamificationConstant.Appointment.AdminCancelRequest,
          });
          // this.denyAcceptRequest();
        } else {
          this.setState({
            shouldShowPatientRejectAppointment: true,
            modalName: GamificationConstant.Appointment.PatientCancelRequest,
          });
        }
        break;

      // in other cases we simply reject it
      default:
        if (isAdmin) {
          this.setState({
            shouldShowAdminCancelAppointmentPopup: true,
            modalName: GamificationConstant.Appointment.AdminCancelRequest,
          });
        } else {
          this.setState({
            shouldShowPatientRejectAppointment: true,
            modalName: GamificationConstant.Appointment.PatientCancelRequest,
          });
        }
    }
  };

  getInitiatedBy = () => {
    return this.props.loginUserStore.userType === 'Admin'
      ? AppointmentInitiatedBy.Doctor
      : AppointmentInitiatedBy.Patient;
  };

  denyAcceptRequest = () => {
    const { appointmentDetails } = this.props;
    const { appointmentId, patientId } = appointmentDetails;
    const userDetails = JSON.parse(appointmentDetails.userDetails);

    const data = {
      appointment: {
        patientId,
        appointmentId,
        initiatedBy: this.getInitiatedBy(),
        message: '',
        name: userDetails.name,
      },
    };
    const mutationData = {
      appointmentDetails: JSON.stringify(data),
    };

    checkInternetConnection().then((isConnected) => {
      if (isConnected) {
        this.cancelAppointmentRequest({
          variables: mutationData,
        });
      } else {
        this.showInternetError();
      }
    });
  };

  onRescheduleButtonClick = () => {
    const { appointmentDetails, isAdmin, changeTab } = this.props;
    const { appointmentId, status, initiatedBy } = appointmentDetails;

    if (
      status === AppointmentStatus.RESCHEDULE &&
      initiatedBy === AppointmentInitiatedBy.Patient &&
      isAdmin
    ) {
      this.props.navigation.navigate(ScreenNameConstant.BookAppointment, {
        slots: this.getAppointmentSlots(),
        isReschedule: true,
        isRequestedByPatient: true,
        appointmentId,
        appointmentDetails,
        changeTab,
      });

      return;
    }

    if (isAdmin) {
      this.props.navigation.navigate(ScreenNameConstant.BookAppointment, {
        slots: this.getAppointmentSlots(),
        isReschedule: true,
        isRequestedByPatient: false,
        appointmentId,
        appointmentDetails,
        changeTab,
      });
    } else {
      this.setState({
        shouldShowPatientReschedulePopup: true,
        modalName: GamificationConstant.Appointment.PatientRequestReschedule,
      });
    }
  };

  onAcceptAppointmentButtonClick = () => {
    const { appointmentDetails, isAdmin } = this.props;
    const { appointmentId, status } = appointmentDetails;

    this.props.navigation.navigate(
      ScreenNameConstant.AcceptAppointmentRequest,
      {
        appointmentId,
        hideExtraButton: true,
        isReschedule: status === AppointmentStatus.RESCHEDULE,
      }
    );
  };

  shouldShowCard = (appointmentDetails) => {
    return true;
  };

  getAllButtonsToShow = () => {
    const { appointmentDetails, isAdmin } = this.props;
    const { status, statusCategory } = appointmentDetails;

    const shouldShowCancelButton = this.shouldShowCancelButton(
      status,
      statusCategory
    );
    const shouldShowRescheduleButton = this.shouldShowRescheduleButton(
      status,
      statusCategory
    );

    const shouldShowAcceptButton = this.shouldShowAcceptButton(
      status,
      statusCategory
    );

    const shouldShowPurposedSloTag = this.shouldShowPurposedSlotTag(
      status,
      statusCategory
    );

    const shouldShowSelectedSlot = this.shouldShowSelectedSlot(
      status,
      statusCategory
    );

    const shouldShowAcceptAppointmentButton = this.shouldShowAcceptAppointmentButton(
      status,
      statusCategory
    );

    const shouldShowCard = this.shouldShowCard(appointmentDetails);

    return {
      shouldShowCancelButton,
      shouldShowRescheduleButton,
      shouldShowAcceptButton,
      shouldShowPurposedSloTag,
      shouldShowSelectedSlot,
      shouldShowAcceptAppointmentButton,
      shouldShowCard,
    };
  };

  hideAllModal = () => {
    this.setState({
      shouldShowPatientRejectAppointment: false,
      shouldShowAdminCancelAppointmentPopup: false,
      shouldShowPatientReschedulePopup: false,
      modalName: GamificationConstant.Appointment.AcceptAppointmentRequest,
    });
    this.nextAction = NextAction.None;
  };

  isAppointmentCancelled = (status) => {
    return (
      status === AppointmentStatus.REJECTED ||
      status === AppointmentStatus.CANCEL
    );
  };

  isAppointmentCancelledByPatient = (
    status,
    statusCategory,
    appointmentDetails
  ) => {
    const { initiatedBy } = appointmentDetails;
    return initiatedBy !== AppointmentInitiatedBy.Doctor;
  };

  getCancellationMessage = (isCancelledByPatient, isAdmin, name) => {
    if (isCancelledByPatient) {
      if (isAdmin) {
        return `This appointment has been discarded due to patient unavailability.`;
      } else {
        return 'This appointment has been discarded due to your unavailability.';
      }
    } else {
      if (isAdmin) {
        return `This appointment has been discarded due to your unavailability.`;
      } else {
        return 'This appointment has been discarded due to Dr. Middlethon unavailability.';
      }
    }
  };

  getShouldShowModal = () => {
    const {
      shouldShowAdminCancelAppointmentPopup,
      shouldShowPatientRejectAppointment,
      shouldShowPatientReschedulePopup,
    } = this.state;
    return (
      shouldShowAdminCancelAppointmentPopup ||
      shouldShowPatientRejectAppointment ||
      shouldShowPatientReschedulePopup
    );
  };

  getAppointmentSlots = () => {
    const { appointmentDetails } = this.props;
    const slots = JSON.parse(appointmentDetails.proposedSlot);

    return slots;
  };

  performNextAction = () => {
    switch (this.nextAction) {
      case NextAction.ScrollToCompleted:
        this.props.changeTab(TabsName.Completed);
        break;

      case NextAction.ScrollToPending:
        this.props.changeTab(TabsName.Pending);
        break;

      case NextAction.ScrollToUpcoming:
        this.props.changeTab(TabsName.Upcoming);
        break;
    }
  };

  setNextStep = (nextStep) => {
    this.hideAllModal();
    this.nextAction = nextStep;
  };

  videoCallEventCallback = (event) => {
    const { isAdmin } = this.props;

    if (!isAdmin) {
      return;
    }

    if (event === 'created') {
      this.isConnectionCreated = true;
    }

    // when connection between doctor and patient is established, mark appointment as completed.
    if (event === 'disconnected' && this.isConnectionCreated) {
      this.isConnectionCreated = false;

      Alert.alert('Viking Health', 'Mark appointment as completed?', [
        {
          text: 'No',
          onPress: () => {
            return;
          },
        },
        {
          text: 'Yes',
          onPress: () => {
            this.markAppointmentAsDone();
          },
        },
      ]);
    }
  };

  markAppointmentAsDone = () => {
    const {
      appointmentDetails: { appointmentId, patientId },
    } = this.props;

    const mutationData = {
      appointmentId,
      status: AppointmentStatus.COMPLETED,
      statusCategory: AppointmentStatusCategory.COMPLETED,
    };

    appsyncClient
      .mutate({
        mutation: AppointmentQueries.UpdateAppointmentStatus,
        variables: mutationData,
        refetchQueries: AppUtil.getAppointmentListingFetchQuery(patientId),
      })
      .then((data) => {
        console.log('data is', data);
      })
      .catch((error) => {
        console.log('error is', error);
      });
  };

  onVideoCallClick = () => {
    const { isAdmin, appointmentDetails } = this.props;
    const { userId, fullName } = this.props.loginUserStore;
    const { patientId } = appointmentDetails;
    const userDetails = JSON.parse(appointmentDetails.userDetails);

    this.props.navigation.navigate(ScreenNameConstant.FetchVideoSessionInfo, {
      userId: patientId,
      isAdmin: isAdmin,
      name: userDetails.name,
      eventCallBack: this.videoCallEventCallback,
    });
  };

  getHighLightStyle = () => {
    const { highLightAnimation } = this.state;

    const backgroundInterpolation = highLightAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: ['#fff', '#cfcfcf'],
    });

    return {
      backgroundColor: backgroundInterpolation,
    };
  };

  componentWillUpdate(prevProps) {
    const shouldHighLight =
      this.props.highlight === this.props.appointmentDetails.appointmentId;

    const hasHighLightedPreviously =
      prevProps.highlight === this.props.appointmentDetails.appointmentId;

    if (shouldHighLight !== hasHighLightedPreviously) {
      if (shouldHighLight) {
        this.startPulseAnimationWithDelay();
      }
    }
  }

  startPulsatingAnimation = () => {
    const { highLightAnimation } = this.state;

    Animated.loop(
      Animated.timing(highLightAnimation, {
        toValue: 1,
        duration: 2000,
      }),
      {
        iterations: 2,
      }
    ).start(() => {
      Animated.timing(highLightAnimation, {
        toValue: 0,
        duration: 2000,
      }).start();
    });
  };

  render() {
    const { appointmentDetails, isAdmin, showRemainderModal } = this.props;
    const { status, statusCategory, modeOfAppointment } = appointmentDetails;
    const slots = this.getAppointmentSlots();
    const userDetails = JSON.parse(appointmentDetails.userDetails);
    let selectedSlotStr = appointmentDetails.selectedSlot;
    const { appointmentId, patientId } = appointmentDetails;

    const { modalName } = this.state;

    if (!selectedSlotStr) {
      selectedSlotStr = '{}';
    }

    let selectedSlot = JSON.parse(selectedSlotStr);

    const name = isAdmin ? userDetails.name : 'Dr. Middlethon';
    const userName = this.props.userAccountStore.fullName;
    const isAppointmentCancelled = this.isAppointmentCancelled(status);
    const isAppointmentCancelledByPatient = this.isAppointmentCancelledByPatient(
      status,
      statusCategory,
      appointmentDetails
    );

    const {
      shouldShowCancelButton,
      shouldShowRescheduleButton,
      shouldShowAcceptButton,
      shouldShowPurposedSloTag,
      shouldShowSelectedSlot,
      shouldShowAcceptAppointmentButton,
      shouldShowCard,
    } = this.getAllButtonsToShow();

    const isAnyButtonVisible =
      shouldShowCancelButton ||
      shouldShowRescheduleButton ||
      shouldShowAcceptButton ||
      shouldShowAcceptAppointmentButton ||
      isAppointmentCancelled;

    const tagMessage = this.getTagMessage(
      status,
      statusCategory,
      appointmentDetails
    );

    const hasModeOfAppointment =
      modeOfAppointment && modeOfAppointment.length >= 0;

    const pulsatingBackgroundColorAnimation = this.getHighLightStyle();

    return (
      <Animated.View
        style={[
          Styles.containerStyle,
          isAppointmentCancelled
            ? Styles.cancelledContainerStyle
            : Styles.normalContainerStyle,
          {
            opacity: shouldShowCard ? 1 : 0.5,
          },
          pulsatingBackgroundColorAnimation,
        ]}
        pointerEvents={shouldShowCard ? 'auto' : 'none'}
      >
        {hasModeOfAppointment && (
          <View style={Styles.appointmentModeWrapperStyle}>
            <Text style={[Styles.nameStyle, Styles.appointmentModeTextStyle]}>
              {modeOfAppointment}
            </Text>
          </View>
        )}
        <View style={Styles.appointmentInfoContainer}>
          <View style={Styles.profileContainer}>
            <RandomColors
              gender={userDetails.gender ?? 'male'}
              height={42}
              width={42}
              number={userDetails.phonenumber}
            />
            <Text style={Styles.nameStyle}>{name}</Text>
          </View>

          {shouldShowPurposedSloTag && (
            <View style={Styles.wrappedText}>
              <Text style={Styles.proposedTimeSlot}>{tagMessage}</Text>
            </View>
          )}

          {shouldShowSelectedSlot && <Slot slot={selectedSlot} />}

          <Slots
            slots={slots}
            appointmentDetails={appointmentDetails}
            onVideoCallClick={this.onVideoCallClick}
          />
        </View>

        <View
          style={[
            Styles.separatorStyle,
            {
              display: isAnyButtonVisible ? 'flex' : 'none',
              backgroundColor: isAppointmentCancelled ? '#EE2222' : '#BFCCD4',
            },
          ]}
        />

        {/* ..........................Buttons .......................... */}
        <View
          style={[
            Styles.buttonContainer,
            {
              display: isAnyButtonVisible ? 'flex' : 'none',
              paddingHorizontal: isAppointmentCancelled ? 0 : 24,
            },
          ]}
        >
          {shouldShowCancelButton && (
            <Button
              title={'Cancel'}
              buttonState={ButtonState.Idle}
              onClick={this.onCancelPressed}
            />
          )}

          {shouldShowRescheduleButton && (
            <Button
              title={'Reschedule'}
              onClick={this.onRescheduleButtonClick}
            />
          )}

          {/* Patient accept button when doctor send proposed slots */}
          {shouldShowAcceptAppointmentButton && (
            <Button
              title={'Accept'}
              buttonState={ButtonState.Idle}
              onClick={this.onAcceptAppointmentButtonClick}
            />
          )}

          {shouldShowAcceptButton && (
            <Mutation
              mutation={AppointmentQueries.ConfirmAppointmentRequest}
              refetchQueries={AppUtil.getAppointmentListingFetchQuery(
                patientId
              )}
              onError={this.onError}
              onCompleted={(data) => {
                this.props.refreshList();
                this.props.changeTab(0);
              }}
            >
              {(
                confirmAppointmentRequest,
                { loading: confirmLoading, error }
              ) => {
                this.confirmAppointmentRequest = confirmAppointmentRequest;
                let buttonState = ButtonState.Idle;
                if (confirmLoading) {
                  buttonState = ButtonState.Progress;
                  buttonLabel = '';
                }

                return (
                  <Button
                    title={'Confirm'}
                    buttonState={buttonState}
                    onClick={this.onConfirmAppointmentClick}
                  />
                );
              }}
            </Mutation>
          )}

          {isAppointmentCancelled && (
            <View style={Styles.cancellationMessageWrapperStyle}>
              <Text style={Styles.cancellationMessageTextStyle}>
                {this.getCancellationMessage(
                  isAppointmentCancelledByPatient,
                  isAdmin,
                  userDetails.name
                )}
              </Text>
            </View>
          )}
        </View>

        <GamificationModal
          isVisible={this.getShouldShowModal()}
          statusCategory={statusCategory}
          status={status}
          onBackdropPress={() => {}}
          modalName={modalName}
          name={name}
          onModalHide={this.performNextAction}
          patientId={patientId}
          appointmentId={appointmentId}
          appointmentStatusCategory={statusCategory}
          onDeny={this.setNextStep}
          onCancel={this.hideAllModal}
          userName={userName}
          showRemainderModal={showRemainderModal}
        />
      </Animated.View>
    );
  }
}

function Button({ title, buttonState = ButtonState.Idle, onClick }) {
  return (
    <ProgressBarButton
      style={{
        backgroundColor: 'transparent',
        borderWidth: 0,
        marginRight: 40,
      }}
      textStyle={{ color: '#D0444C' }}
      disabled={false}
      label={title}
      buttonState={buttonState}
      progressColor='#D0444C'
      onClick={onClick}
    />
  );
}
