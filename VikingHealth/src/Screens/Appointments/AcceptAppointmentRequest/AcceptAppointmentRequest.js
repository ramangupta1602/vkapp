import React, { Component } from 'react';
import { Text, View, Image, ScrollView, Alert, TextInput } from 'react-native';
import CommonStyles from '../styles';
import Styles from './styles';
import {
  BackButton,
  ProgressBarButton,
  GamificationModal,
  Switch,
} from '../../../Components';
import { ButtonState } from '../../../Components/CTAButton/ButtonState';
import * as AppointmentQueries from '../../../AppSyncQueries/AppointmentQueries';
import { strings } from '../../../utility/locales/i18n';
import Toast, { DURATION } from 'react-native-easy-toast';
import { R } from '../../../Resources/R';
import { Query, Mutation } from 'react-apollo';
import * as AppointmentUtils from '../AppointmentUtils';
import moment from 'moment';
import { SlotItem } from '../Components/SlotItem/SlotItem';
// import { Sentry } from 'react-native-sentry';
import { checkInternetConnection } from 'react-native-offline';
import { inject, observer } from 'mobx-react';
import {
  Gamification as GamificationConstant,
  AppointmentStatus,
  AppointmentInitiatedBy,
} from '../../../utility/constants/Constants';
import * as DateUtils from '../../../Library/Utils/DateUtil';
import AppUtils from '../../../Library/Utils/AppUtil';

import ScreenNameConstant from '../../ScreenNameConstant';
import { TabsName } from '../Components/AppointmentListingTab/AppointmentListingTab';

const AppointmentMode = {
  Online: 0,
  Offline: 1,
};

@observer
@inject('userAccountStore')
export default class AcceptAppointmentRequest extends Component {
  constructor(props) {
    super(props);

    this.appointmentId = props.navigation.getParam('appointmentId', '');
    this.hideExtraButton = props.navigation.getParam('hideExtraButton', false);
    this.isReschedule = props.navigation.getParam('isReschedule', false);

    this.rescheduleReason = 'Unavailable';

    this.state = {
      selectedSlotIndex: -1,
      selectedSlot: null,
      shouldShowModal: false,
      shouldShowRejectModal: false,
      shouldShowRescheduleModal: false,
      modalName: null,
      isDataLoaded: false,
      appointmentMode: AppointmentMode.Online,
    };
  }

  processSlots = (slots) => {
    const slotArray = slots.map((item) => {
      const startTime = moment.utc(item.startTime).local();
      const endTime = moment.utc(item.endTime).local();
      const date = startTime.format('YYYY-MM-DD');
      const slotItem = AppointmentUtils.getSlotData(startTime, endTime, date);

      return slotItem;
    });

    return slotArray;
  };

  onSlotSelected = (slot, index) => {
    this.setState({ selectedSlotIndex: index, selectedSlot: slot });
  };

  getMutationData = () => {
    const { username, fullName } = this.props.userAccountStore;
    const { selectedSlot, appointmentMode } = this.state;

    const startTime = DateUtils.getAppointmentFormattedDateTime(
      selectedSlot.startTime.utc()
    );
    const endTime = DateUtils.getAppointmentFormattedDateTime(
      selectedSlot.endTime.utc()
    );

    const data = {
      appointment: {
        patientId: username,
        appointmentId: this.appointmentId,
        selectedSlot: {
          startTime: startTime,
          endTime: endTime,
        },
        name: fullName,
        modeOfAppointment:
          appointmentMode === AppointmentMode.Online ? 'Online' : 'In Office',
      },
    };

    return data;
  };

  getCancelRequestData = () => {
    const { username, fullName } = this.props.userAccountStore;
    const { selectedSlot } = this.state;

    const data = {
      appointment: {
        patientId: username,
        appointmentId: this.appointmentId,
        initiatedBy: AppointmentInitiatedBy.Patient,
        name: fullName,
        message: '',
      },
    };

    return data;
  };

  getRescheduleRequestData = () => {
    const { username, fullName } = this.props.userAccountStore;
    const { selectedSlot } = this.state;

    const data = {
      appointment: {
        patientId: username,
        appointmentId: this.appointmentId,
        initiatedBy: AppointmentInitiatedBy.Patient,
        name: fullName,
      },
    };

    return data;
  };

  showNetworkError = () => {
    Alert.alert(
      'No Internet Connection',
      'It seems there is some problem with your internet connection. Please check and try again.'
    );
  };

  redirectToPendingScreen = () => {
    this.props.navigation.pop();

    this.props.navigation.navigate({
      routeName: ScreenNameConstant.AppointmentListing,
      params: { selectedTab: TabsName.Pending },
    });
  };

  toggleModal = (show, name) => {
    this.setState({ shouldShowModal: show, modalName: name });
  };

  showErrorMessage = (error) => {
    console.log('error is', error);
    // Sentry.captureMessage(error.message);
    Alert.alert(
      'Alert!',
      'We were not able process your request. Please try again later.'
    );
  };

  hideAllModal = () => {
    this.setState({
      shouldShowModal: false,
      shouldShowRejectModal: false,
      shouldShowRescheduleModal: false,
    });
  };

  redirectToBackScreen = () => {
    this.props.navigation.goBack();
  };

  onAppointmentModeChanged = (mode) => {
    this.setState({ appointmentMode: mode });
    console.log('on appointment mode change');
  };

  render() {
    const {
      selectedSlotIndex,
      shouldShowModal,
      modalName,
      isDataLoaded,
      shouldShowRejectModal,
      shouldShowRescheduleModal,
    } = this.state;

    const { username: patientId, fullName } = this.props.userAccountStore;

    return (
      <View style={Styles.containerStyle}>
        <ScrollView
          contentContainerStyle={{ padding: 20 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={Styles.scrollViewContainerStyle}>
            <View
              style={{
                paddingTop: 20,
                padding: 0,
                marginLeft: -6,
              }}
            >
              <BackButton navigation={this.props.navigation} />
            </View>
            <Text style={[CommonStyles.pageTitleStyle]}>
              {strings('appointment.selectAppointmentSlot')}
            </Text>

            {!this.isReschedule && (
              <Text style={Styles.messageTextStyle}>
                {strings('common_message.doctorName')}
                <Text style={{ fontWeight: 'normal' }}>
                  {' ' + strings('appointment.acceptScreenMessage')}
                </Text>
              </Text>
            )}

            {this.isReschedule && (
              <View style={Styles.rescheduleReasonContainerStyle}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={Styles.rescheduleTitleTextStyle}>
                    Reschedule Reason
                  </Text>
                </View>

                <TextInput
                  ref={(ref) => {
                    this.inputRef = ref;
                  }}
                  editable={false}
                  multiline={true}
                  value={this.rescheduleReason}
                  style={Styles.rescheduleReasonTextStyle}
                />
              </View>
            )}

            <View style={Styles.warningBox}>
              <Image
                source={R.Images.AppointmentImages.Info}
                style={Styles.warningLogoStyle}
              />

              <View style={Styles.messageContainer}>
                <Text style={Styles.warningMessageStyle}>
                  {strings('appointment.warningMessage')}
                </Text>
              </View>
            </View>

            <View style={Styles.switchContainer}>
              <Text style={Styles.appointmentModeTitle}>Appointment Mode</Text>

              <Switch
                firstOption='Online'
                secondOption='In Office'
                onSwitchChange={this.onAppointmentModeChanged}
              />
            </View>

            <View style={[Styles.messageContainer]}>
              <Text style={Styles.purposedTimeSlotTextStyle}>
                Proposed time slot(s)
              </Text>
            </View>

            <Query
              query={AppointmentQueries.GetAppointmentFor}
              variables={{ appointmentId: this.appointmentId }}
              fetchPolicy='network-only'
            >
              {({ loading, error, data }) => {
                if (data && data.getAppointmentFor) {
                  const {
                    proposedSlot,
                    status,
                    reschdule_reason,
                  } = data.getAppointmentFor;

                  const slots = JSON.parse(proposedSlot);

                  // appointment is updated, show alert and move back
                  {
                    /* if (status !== AppointmentStatus.PROPOSED) {
                    Alert.alert(
                      'Viking Health',
                      'This appointment has been updated. Please check updated details.',
                      [
                        {
                          text: 'Okay',
                          onPress: () => {
                            this.redirectToBackScreen();
                          },
                        },
                      ]
                    );

                    return null;
                  } */
                  }

                  if (!isDataLoaded) {
                    this.setState({ isDataLoaded: true });
                  }

                  const slotArray = this.processSlots(slots);

                  if (this.inputRef) {
                    console.log('setting native props', reschdule_reason);
                    this.inputRef.setNativeProps({ text: reschdule_reason });
                  }

                  this.rescheduleReason = reschdule_reason;

                  return (
                    <View>
                      {slotArray.map((item, index) => {
                        return (
                          <View style={{ marginTop: 6 }}>
                            <SlotItem
                              key={`${item.date} ${item.startHour}`}
                              onSlotSelected={this.onSlotSelected}
                              slot={item}
                              index={index}
                              useAnimation={true}
                              isSelected={index === selectedSlotIndex}
                              showDate={true}
                              // animated={animated}
                            />
                          </View>
                        );
                      })}
                    </View>
                  );
                }

                return null;
              }}
            </Query>
          </View>
        </ScrollView>

        {this.state.isDataLoaded && (
          <View style={Styles.buttonContainer}>
            {/* Appointment mode switch */}

            {/* Accept one slot */}
            <Mutation
              mutation={AppointmentQueries.AcceptAppointmentRequest}
              refetchQueries={AppUtils.getAppointmentListingFetchQuery(
                patientId
              )}
              onError={this.showErrorMessage}
              onCompleted={(data) => {
                this.toggleModal(
                  true,
                  GamificationConstant.Appointment.AcceptAppointmentRequest
                );
              }}
            >
              {(acceptAppointmentRequest, { loading }) => {
                return (
                  <ProgressBarButton
                    buttonState={
                      loading
                        ? ButtonState.Progress
                        : selectedSlotIndex == -1
                        ? ButtonState.Disabled
                        : ButtonState.Idle
                    }
                    style={{ marginBottom: this.hideExtraButton ? 20 : 0 }}
                    label='Accept'
                    onClick={() => {
                      checkInternetConnection().then((isConnected) => {
                        if (isConnected === true) {
                          const appointmentDetails = this.getMutationData();
                          console.log('mutation data is', appointmentDetails);

                          acceptAppointmentRequest({
                            variables: {
                              appointmentDetails: JSON.stringify(
                                appointmentDetails
                              ),
                            },
                          });
                        } else {
                          this.showNetworkError();
                        }
                      });
                    }}
                  />
                );
              }}
            </Mutation>

            {!this.hideExtraButton && (
              <ProgressBarButton
                buttonState={ButtonState.Idle}
                textColor={'#D0444C'}
                progressColor={'#D0444C'}
                style={{
                  backgroundColor: 'transparent',
                  borderWidth: 0,
                  marginTop: 10,
                }}
                label='Unavailable'
                onClick={() => {
                  this.setState({
                    shouldShowRejectModal: true,
                    modalName:
                      GamificationConstant.Appointment.PatientCancelRequest,
                  });
                }}
              />
            )}

            {!this.hideExtraButton && (
              <ProgressBarButton
                buttonState={ButtonState.Idle}
                textColor={'#D0444C'}
                progressColor={'#D0444C'}
                style={{
                  backgroundColor: 'transparent',
                  borderWidth: 0,
                  marginTop: 10,
                }}
                label='Reschedule'
                onClick={() => {
                  this.setState({
                    shouldShowRescheduleModal: true,
                    modalName:
                      GamificationConstant.Appointment.PatientRequestReschedule,
                  });
                }}
              />
            )}
          </View>
        )}
        <GamificationModal
          isVisible={shouldShowModal}
          onClick={() => {
            this.toggleModal(false);
          }}
          onBackdropPress={() => {
            // this.handleGamificationModalBackdropClick();
          }}
          onModalHide={this.redirectToPendingScreen}
          modalName={modalName}
        />

        <GamificationModal
          isVisible={shouldShowRejectModal || shouldShowRescheduleModal}
          onClick={() => {
            this.toggleModal(false);
          }}
          onBackdropPress={() => {}}
          modalName={modalName}
          name={fullName}
          userName={fullName}
          patientId={patientId}
          appointmentId={this.appointmentId}
          onDeny={() => {
            this.hideAllModal();
            setTimeout(() => {
              this.redirectToBackScreen();
            }, 400);
          }}
          onCancel={this.hideAllModal}
        />
      </View>
    );
  }
}
