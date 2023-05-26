import React, { Component } from 'react';
import { Alert, Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';
import { inject, observer } from 'mobx-react';
import NavigationService from '../../NavigationService';
import * as ASyncStoreUtil from '../../utility/AsyncStoreUtil';
import ScreenNameConstant from '../../Screens/ScreenNameConstant';
import { GamificationModal } from '../Gamification/GamificationModal';
import { Gamification } from '../../utility/constants/Constants';
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import { Mutation, Query } from 'react-apollo';
import * as AppointmentQueries from '../../AppSyncQueries/AppointmentQueries';
// import { Sentry } from 'react-native-sentry';
import { checkInternetConnection } from 'react-native-offline';
import { ButtonState } from '../../Components/CTAButton/ButtonState';
import * as DateUtils from '../../Library/Utils/DateUtil';
import moment from 'moment';
import * as UserQueries from '../../AppSyncQueries/UserQueries';
import AppUtil from '../../Library/Utils/AppUtil';
import {
  TabsName,
  AppointmentListingTab,
} from '../../Screens/Appointments/Components/AppointmentListingTab/AppointmentListingTab';
import { appsyncClient } from '../../../App';

@inject('userAccountStore', 'measurementUnitStore', 'loginUserStore')
@observer
export class PushNotificationController extends Component {
  constructor(props) {
    super(props);

    this.AppointmentStatusCode = {
      init: 'INIT',
      accepted: 'ACCEPTED',
      confirmed: 'CONFIRMED',
      reschedule: 'RESCHEDULE',
      cancelled: 'CANCELLED',
      rejected: 'REJECTED',
      BANW: 'BANW',
    };

    const params = {
      userId: this.props.userAccountStore.username,
      weightUnit: this.props.measurementUnitStore.displayWeightUnit,
      unit: this.props.measurementUnitStore.displayHeightUnit,
      weekInProgram: this.props.userAccountStore.weekInProgram,
      programStartDate: this.props.userAccountStore.programStartDate,
      programEndDate: this.props.userAccountStore.programEndDate,
      userType: this.props.loginUserStore.userType,
      isComingFromNotification: true,
      rewardPoints: 0, // as notification is only one time, we can effort to give point even when user has future entry. and also if user has already logged value, notification is disabled for that day.
    };

    this.state = {
      shouldShowConfirmPopup: false,
      notificationData: {
        appointmentId: '',
      },
    };

    PushNotification.popInitialNotification((notification) => {
      console.log(notification);
    });

    PushNotification.configure({
        requestPermissions: Platform.OS === 'ios',
      onRegister: (token) => {
        console.log('TOKEN:', token);
        ASyncStoreUtil.saveDataWithKey(token.token, 'token');
      },

      onNotification: (notification) => {
        console.log('notification data', notification);

        if (this.isLocalRemainderNotification(notification)) {
          this.handleLocalRemainderNotification(notification);
          return;
        }

        if (this.isRemoteNotification(notification)) {
          this.handleRemoteNotification(notification);
          return;
        }

        if (Platform.OS === 'ios' && !notification.foreground) {
          switch (notification.data.id) {
            case '-1':
              const {
                summaryPopupShownForCycle,
                currentCycle,
              } = this.props.userAccountStore;

              if (summaryPopupShownForCycle == currentCycle) {
                NavigationService.navigate('CycleSummary');
              }

              break;

            case '-2':
            case '-3':
              NavigationService.navigate('RewardHistory');
              break;

            default:
              NavigationService.navigate(notification.data.screenType, params);
          }
        } else if (Platform.OS === 'android') {
          switch (notification.id) {
            case '1':
              NavigationService.navigate('LogWeight', params);
              break;
            case '2':
              NavigationService.navigate('DaysPerformance', params);
              break;
            case '3':
              NavigationService.navigate('BodyMeasurements', params);
              break;

            // -1 is for Cycle Summary Popup
            case '-1':
              const {
                summaryPopupShownForCycle,
                currentCycle,
              } = this.props.userAccountStore;

              if (summaryPopupShownForCycle == currentCycle) {
                NavigationService.navigate('CycleSummary');
              }
              break;

            case '-2':
            case '-3':
              NavigationService.navigate('RewardHistory');
              break;

            default:
              NavigationService.navigate('Dashboard', params);

              break;
          }
        } else if (
          notification.data.id == 1 ||
          notification.data.id == 2 ||
          notification.data.id == 3
        ) {
          this.showAlert(
            'Time to record',
            `Please Add details of your ${notification.data.screenType}`,
            notification.data.screenType,
            params
          );
        } else if (notification.data.id == -1) {
          const {
            summaryPopupShownForCycle,
            currentCycle,
          } = this.props.userAccountStore;

          if (summaryPopupShownForCycle == currentCycle) {
            NavigationService.navigate('CycleSummary');
          }
        } else if (notification.data.id == -2) {
          this.showAlert(
            'Viking Health',
            `${notification.message}`,
            notification.data.screenType,
            params
          );
        } else if (notification.data.id == -3) {
          this.showAlert(
            'Viking Health',
            `${notification.message}`,
            notification.data.screenType,
            params
          );
        } else {
          this.showAlert(
            'Quote for the day!',
            `${notification.message}`,
            notification.data.screenType,
            params
          );
        }
      },

      senderID: '76867931081',
      popInitialNotification: true,
    });
  }

  isLocalRemainderNotification(notification) {
    if (Platform.OS === 'ios') {
      if (!(notification && notification.data && notification.data.type)) {
        return false;
      }
    }

    if (Platform.OS === 'android') {
      if (
        !(notification && notification.userInfo && notification.userInfo.type)
      ) {
        return false;
      }
    }

    const type =
      Platform.OS === 'ios'
        ? notification.data.type
        : notification.userInfo.type;

    if (type === 'APP_NOTIFICATION') {
      return true;
    }

    return false;
  }

  handleLocalRemainderNotification(notification) {
    if (
      (Platform.OS === 'ios' && !notification.foreground) ||
      Platform.OS === 'android'
    ) {
      NavigationService.navigate(ScreenNameConstant.AppointmentListing);
    } else {
      this.showAlert(
        'Appointment Remainder',
        `${notification.message}`,
        ScreenNameConstant.AppointmentListing,
        {}
      );
    }
  }

  isRemoteNotification(notification) {
    if (Platform.OS == 'ios') {
      if (notification.data.remote) {
        return true;
      }

      if (notification.data.payload) {
        return notification.data.payload.notificationId;
      }

      return false;
    }

    // in case of remote notification we have long ids.
    return `${notification.id.length}` > 4;
  }

  handleRemoteNotification(notification) {
    if (Platform.OS == 'ios') {
      this.handleRemoteNotificationForIos(notification);
    } else {
      this.handleRemoteNotificationForAndroid(notification);
    }
  }

  handleRemoteNotificationForIos(notification) {
    const { userInteraction, foreground, message, data } = notification;
    let { payload } = data;

    if (!payload.data) {
      payload = { data: {} };
    }

    const payloadData = payload;

    if (notification.foreground) {
      this.handleForegroundAppointmentNotificationForIOS(payloadData, message);
    } else {
      this.handleAppointmentNotification(payloadData);
    }
  }

  // "{"data":{"appointmentId":"269e03ef-f1d7-42e4-aab4-2b92f7a908d6"},"notificationId":"INIT"}"
  handleRemoteNotificationForAndroid(notification) {
    const { userInteraction, foreground, message } = notification;
    let { payload } = notification;

    if (!payload) {
      payload = JSON.stringify({ data: {} });
    }

    if (userInteraction) {
      const notificationData = JSON.parse(payload);
      this.handleAppointmentNotification(notificationData);
    }
  }

  handleForegroundAppointmentNotificationForIOS = async (payload, message) => {
    const {
      data: { appointmentId, userDetails, patientId },
      notificationId,
    } = payload;

    switch (notificationId) {
      case this.AppointmentStatusCode.init:
        this.showAlert(
          'Viking Health',
          message,
          ScreenNameConstant.AcceptAppointmentRequest,
          { appointmentId }
        );
        break;

      case this.AppointmentStatusCode.accepted:
        Alert.alert('Viking Health', message, [
          { text: 'Later', onPress: () => {} },

          {
            text: 'View',
            onPress: () => {
              this.redirectToUpcomingAppointment(
                TabsName.Pending,
                appointmentId
              );
            },
          },
        ]);

        break;

      case this.AppointmentStatusCode.confirmed:
        this.showAlert(
          'Viking Health',
          message,
          ScreenNameConstant.AppointmentListing,
          {
            selectedTab: TabsName.Upcoming,
          }
        );
        break;

      case this.AppointmentStatusCode.reschedule:
        if (this.props.loginUserStore.userType === 'Admin') {
          const { name } = userDetails;

          this.fetchAppointmentDetails(appointmentId).then((slots) => {
            this.showAlert(
              'Viking Health',
              message,
              ScreenNameConstant.BookAppointment,
              {
                slots,
                isReschedule: true,
                isRequestedByPatient: true,
                appointmentId,
                appointmentDetails: {
                  appointmentId,
                  patientId,
                  userDetails: JSON.stringify({ name }),
                },
              }
            );
          });
        } else {
          this.showAlert(
            'Viking Health',
            message,
            ScreenNameConstant.AcceptAppointmentRequest,
            {
              appointmentId,
              isReschedule: true,
            }
          );
        }
        break;

      case this.AppointmentStatusCode.cancelled:
        this.showAlert(
          'Viking Health',
          message,
          ScreenNameConstant.AppointmentListing,
          {
            selectedTab: TabsName.Completed,
          }
        );
        break;

      case this.AppointmentStatusCode.rejected:
        this.showAlert(
          'Viking Health',
          message,
          ScreenNameConstant.AppointmentListing,
          {
            selectedTab: TabsName.Completed,
          }
        );
        break;

      case this.AppointmentStatusCode.BANW:
        this.fetchUserDetails(patientId).then((data) => {
          Alert.alert('Viking Health', message, [
            { text: 'Later', onPress: () => {} },
            {
              text: 'Book Now',
              onPress: () => {
                NavigationService.navigate(ScreenNameConstant.AdminDashboard);
                this.props.userAccountStore.setUserData(data);
                NavigationService.navigate(ScreenNameConstant.BookAppointment);
              },
            },
          ]);
        });

        break;

      default:
        this.showAlert('Viking Health', message);
    }
  };

  handleAppointmentNotification = (payload) => {
    console.log('handleAppointmentNotification');

    const {
      data: { appointmentId, userDetails, patientId },
      notificationId,
    } = payload;

    switch (notificationId) {
      case this.AppointmentStatusCode.init:
        NavigationService.navigate(
          ScreenNameConstant.AcceptAppointmentRequest,
          {
            appointmentId,
          }
        );
        break;

      case this.AppointmentStatusCode.accepted:
        this.redirectToUpcomingAppointment(TabsName.Pending, appointmentId);
        break;

      case this.AppointmentStatusCode.confirmed:
        this.redirectToUpcomingAppointment();
        break;

      case this.AppointmentStatusCode.reschedule:
        if (this.props.loginUserStore.userType === 'Admin') {
          const { name } = userDetails;

          this.fetchAppointmentDetails(appointmentId).then((slots) => {
            NavigationService.navigate(ScreenNameConstant.BookAppointment, {
              slots,
              isReschedule: true,
              isRequestedByPatient: true,
              appointmentId,
              appointmentDetails: {
                appointmentId,
                patientId,
                userDetails: JSON.stringify({ name }),
              },
            });
          });
        } else {
          NavigationService.navigate(
            ScreenNameConstant.AcceptAppointmentRequest,
            {
              appointmentId,
              isReschedule: true,
            }
          );
        }

        break;

      case this.AppointmentStatusCode.cancelled:
        this.redirectToUpcomingAppointment(TabsName.Completed);
        break;

      case this.AppointmentStatusCode.rejected:
        this.redirectToUpcomingAppointment(TabsName.Completed);
        break;

      case this.AppointmentStatusCode.BANW:
        this.fetchUserDetails(patientId).then((data) => {
          NavigationService.navigate(ScreenNameConstant.AdminDashboard);
          this.props.userAccountStore.setUserData(data);
          NavigationService.navigate(ScreenNameConstant.BookAppointment);
        });

        break;
    }
  };

  redirectToUpcomingAppointment = (
    selectedTab = TabsName.Upcoming,
    appointmentId = ''
  ) => {
    NavigationService.navigate(ScreenNameConstant.AppointmentListing, {
      selectedTab,
      appointmentId,
    });
  };

  showAlert(headerMessageAlert, SubHeadermessage, screenType, params) {
    Alert.alert(
      headerMessageAlert,
      SubHeadermessage,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => NavigationService.navigate(screenType, params),
        },
      ],
      {
        cancelable: false,
      }
    );
  }

  onError = (error) => {
    console.log('Error is', error);
    // Sentry.captureMessage(error.message);
    Alert.alert(
      'Alert!',
      'We were not able to process your request. Please try again later.'
    );
  };

  onConfirmAppointmentClick = () => {
    const eventConfig = {
      title: `Appointment with ${this.userData.name}`,
      title: `Appointment: Dr. Middelthon|${this.userData.name} [${this.mode}]`,
      startDate: this.utcDateToString(this.StartTime),
      endDate: this.utcDateToString(this.EndTime),
      notes: `Appointment with ${this.userData.name}`,
      recipient: this.userEmailId,
    };

    AddCalendarEvent.presentEventCreatingDialog(eventConfig)
      .then((eventInfo) => {
        // handle success - receives an object with `calendarItemIdentifier` and `eventIdentifier` keys, both of type string.
        // These are two different identifiers on iOS.
        // On Android, where they are both equal and represent the event id, also strings.
        // when { action: 'CANCELED' } is returned, the dialog was dismissed
        // {"eventIdentifier":"AF292882-E055-4836-8DF2-B1D30EBA037E:E8FAF8DF-35B9-43DF-ACA5-EA29B846FBD0","action":"SAVED","calendarItemIdentifier":"B270336E-463F-413F-8375-208141E18560"}

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
    const { appointmentId } = this.state.notificationData;
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

  utcDateToString = (momentInUTC) => {
    let s = moment.utc(momentInUTC).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    return s;
  };

  onDenyAppointmentClick = () => {
    const { appointmentId, patientId } = this.state.notificationData;
    const data = {
      appointment: {
        patientId,
        appointmentId,
        initiatedBy:
          this.props.loginUserStore.userType === 'Admin' ? 'Doctor' : 'Patient',
        message: '',
        name: this.userData.name,
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

  fetchAppointmentDetails = async (appointmentId) => {
    try {
      const { data } = await appsyncClient.query({
        query: AppointmentQueries.GetAppointmentFor,
        variables: { appointmentId },
        fetchPolicy: 'network-only',
      });

      if (data && data.getAppointmentFor) {
        const { proposedSlot } = data.getAppointmentFor;

        const slots = JSON.parse(proposedSlot);

        return slots;
      }

      return [];
    } catch (error) {
      console.log('error is', error);
    }
  };

  fetchUserDetails = async (userId) => {
    try {
      const { data } = await appsyncClient.query({
        query: UserQueries.GetProfile,
        variables: { userId },
        fetchPolicy: 'network-only',
      });

      if (data && data.getProfile) {
        return data.getProfile;
      }
    } catch (error) {
      console.log('error is', error);
    }
  };

  render() {
    const { shouldShowConfirmPopup, notificationData } = this.state;

    if (!shouldShowConfirmPopup) {
      return null;
    }

    const { appointmentId } = this.state.notificationData;

    return (
      <Query
        query={AppointmentQueries.GetAppointmentFor}
        variables={{ appointmentId }}
        fetchPolicy='network-only'
      >
        {({ loading: dataLoading, error, data }) => {
          if (data) {
            const { getAppointmentFor = {} } = data;

            const {
              selectedSlot = '{}',
              status,
              userDetails = '{}',
              modeOfAppointment = 'Online',
            } = getAppointmentFor;

            const slot = JSON.parse(selectedSlot);

            if (!slot) {
              return null;
            }

            this.userData = JSON.parse(userDetails);
            const { name, gender } = this.userData;
            this.userEmailId = this.userData.email;

            const { startTime, endTime } = slot;
            const sDate = DateUtils.getAppointmentFormattedDate(
              moment.utc(startTime).local()
            );
            const sTime = DateUtils.getAppointmentFormattedTime(
              moment.utc(startTime).local()
            );
            const eTime = DateUtils.getAppointmentFormattedTime(
              moment.utc(endTime).local()
            );

            const time = `${sDate} at ${sTime}-${eTime}`;
            this.StartTime = startTime;
            this.EndTime = endTime;
            this.mode = modeOfAppointment;

            return (
              <Mutation
                mutation={AppointmentQueries.RejectAppointmentRequest}
                onError={this.onError}
                onCompleted={(data) => {
                  this.setState({ shouldShowConfirmPopup: false });
                  setTimeout(() => {
                    NavigationService.navigate(
                      ScreenNameConstant.AppointmentListing,
                      {
                        selectedTab: TabsName.Completed,
                      }
                    );
                  }, 400);
                }}
              >
                {(cancelAppointmentRequest, { loading: cancelLoading }) => {
                  this.cancelAppointmentRequest = cancelAppointmentRequest;

                  return (
                    <Mutation
                      mutation={AppointmentQueries.ConfirmAppointmentRequest}
                      // refetchQueries={["GetLastRecordedLog"]}
                      onError={this.onError}
                      onCompleted={(data) => {
                        this.setState({ shouldShowConfirmPopup: false });

                        setTimeout(() => {
                          NavigationService.navigate(
                            ScreenNameConstant.AppointmentListing,
                            {
                              selectedTab: TabsName.Upcoming,
                            }
                          );
                        }, 400);
                      }}
                    >
                      {(
                        confirmAppointmentRequest,
                        { loading: confirmLoading }
                      ) => {
                        this.confirmAppointmentRequest = confirmAppointmentRequest;

                        console.log('loading', confirmLoading);
                        let buttonState = ButtonState.Idle;
                        let buttonLabel = 'Confirm Appointment';

                        if (confirmLoading) {
                          buttonState = ButtonState.Progress;
                          buttonLabel = '';
                        }

                        let denyButtonState = ButtonState.Idle;
                        if (cancelLoading) {
                          denyButtonState = ButtonState.Progress;
                        }

                        return (
                          <GamificationModal
                            isVisible={true}
                            onClick={() => {
                              // this.handleGamificationModalClick();
                            }}
                            onBackdropPress={() => {
                              // this.handleGamificationModalBackdropClick();
                            }}
                            confirmLoading={buttonState}
                            denyLoading={denyButtonState}
                            modalName={
                              Gamification.Appointment.ConfirmAppointmentRequest
                            }
                            onConfirmAppointmentClick={
                              this.onConfirmAppointmentClick
                            }
                            onDenyAppointmentClick={this.onDenyAppointmentClick}
                            time={time}
                            name={name}
                            dataLoading={dataLoading}
                            gender={gender}
                            onLaterClick={() => {
                              this.setState({ shouldShowConfirmPopup: false });
                            }}
                          />
                        );
                      }}
                    </Mutation>
                  );
                }}
              </Mutation>
            );
          }

          return null;
        }}
      </Query>
    );
  }
}
