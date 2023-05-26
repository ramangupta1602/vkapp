import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  TextInput,
  Alert,
  Image,
  Animated,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import CommonStyles from '../styles';
import Styles from './styles';
import * as DateUtilsTimeZone from '../../../Library/Utils/DateUtilsTimeZone';
import { ProgressBarButton } from '../../../Components';
import { inject, observer } from 'mobx-react';
import { ButtonState } from '../../../Components/CTAButton/ButtonState';
import { Mutation } from 'react-apollo';
import * as AppointmentQueries from '../../../AppSyncQueries/AppointmentQueries';
import { strings } from '../../../utility/locales/i18n';
import {
  Gamification as GamificationConstant,
  AppointmentInitiatedBy,
} from '../../../utility/constants/Constants';
import { BackButton, GamificationModal } from '../../../Components';
import * as DateUtil from '../../../Library/Utils/DateUtil';
// import { Sentry } from 'react-native-sentry';
import moment from 'moment';
import Toast, { DURATION } from 'react-native-easy-toast';
import { R } from '../../../Resources/R';
import CustomSlot from '../Components/CustomSlot/CustomSlot';
import AppUtils from '../../../Library/Utils/AppUtil';
import ScreenNameConstant from '../../ScreenNameConstant';
import { TabsName } from '../Components/AppointmentListingTab/AppointmentListingTab';

import { SlotsList, MonthSlider, SlotChips } from '../Components';
import { SlotSelectionMethod } from '../Components/SlotSelectionMethod/SlotSelectionMethod';

import { DaysSlider } from '../Components/DaysSlider/DaysSlider';
import { checkInternetConnection } from 'react-native-offline';

export const NoOfMonthForAdvanceBooking = 3;
export const Interval = 30;

export const AllowedSlotIntervals = [
  { startTime: { hour: 8, min: 0 }, endTime: { hour: 20, min: 0 } },
];

export const AppointmentStatus = {
  Pending: 'PENDING',
  Accepted: 'ACCEPTED',
  Proposed: 'PROPOSED',
  Completed: 'COMPLETED',
  Rejected: 'REJECTED',
  Reschedule: 'RESCHEDULE',
};

const { width: ScreenWidth } = Dimensions.get('screen');
const { width: WindowWidth } = Dimensions.get('window');

const ReasonType = {
  Default: 'default',
  Other: 'Other',
};

@inject('userAccountStore', 'loginUserStore')
@observer
export default class BookAppointment extends Component {
  constructor(props) {
    super(props);

    const previousSlots = props.navigation.getParam('slots', []);
    this.isReschedule = props.navigation.getParam('isReschedule', false);
    this.appointmentId = props.navigation.getParam('appointmentId', '');
    this.isRequestedByPatient = props.navigation.getParam(
      'isRequestedByPatient',
      false
    );

    this.previousAppointmentDetails = props.navigation.getParam(
      'appointmentDetails',
      {}
    );

    if (this.previousAppointmentDetails.userDetails) {
      this.patientName = JSON.parse(
        this.previousAppointmentDetails.userDetails
      ).name;
    }

    this.maxMinDates = DateUtilsTimeZone.getMaxMinAppointmentDate(
      NoOfMonthForAdvanceBooking
    );

    this.monthNameArray = DateUtilsTimeZone.getMonthNameArray(
      NoOfMonthForAdvanceBooking
    );

    const dayArray = DateUtilsTimeZone.getMonthDaysForMonth(
      this.monthNameArray.monthArray[0],
      this.maxMinDates.minDate,
      this.maxMinDates.maxDate
    );

    const slotArray = this.breakIntervalIntoSlots(
      Interval,
      AllowedSlotIntervals
    );

    const sortedSlotArray = this.sortIntervals(slotArray);

    this.state = {
      dayArray,
      slotArray: sortedSlotArray,
      selectedMonth: this.monthNameArray.monthArray[0],
      selectedDate: dayArray[0],
      selectedSlot: [],
      shouldShowModal: false,
      shouldShowReasonContainer:
        this.isReschedule && !this.isRequestedByPatient,
      previousSlots: previousSlots,

      isSingleSelection: props.isSingleSelection,
      isSuggestingSlot: props.isSuggestingSlot,

      dateMeasurementContainerOffset: 0,
      scrollAnimated: new Animated.Value(0),
      selectionMethodIndex: 0,
      selectionMethodAnimated: new Animated.Value(0),
      selectedReasonType: ReasonType.Default,
      slotChipAnimation: new Animated.Value(0),
    };
  }

  /**
   * interval should be in minutes.
   */
  breakIntervalIntoSlots = (interval, slots) => {
    const slotsArray = [];
    const selectedSlot = [];

    slots.forEach((slotInterval) => {
      let startTime = moment();
      let endTime = moment();

      // set hour and time according to interval start and end time.
      startTime.hour(slotInterval.startTime.hour);
      startTime.minute(slotInterval.startTime.min);
      endTime.hour(slotInterval.endTime.hour);
      endTime.minute(slotInterval.endTime.min);

      // if slot is disabled then we will show only one block
      if (slotInterval.isDisabled) {
        slotsArray.push(this.getSlotData(startTime, endTime));
      }
      //  divide the slot into interval
      else {
        const slotStartTime = moment(startTime);
        const slotEndTime = moment(startTime).add(interval, 'minutes');

        const range = moment.range(startTime, endTime);

        while (slotStartTime.within(range) && slotEndTime.within(range)) {
          const individualSlotTime = moment(slotStartTime);
          const individualSlotEndTime = moment(slotEndTime);
          const slotData = this.getSlotData(
            individualSlotTime,
            individualSlotEndTime
          );

          slotsArray.push(slotData);

          slotStartTime.add(interval, 'minutes');
          slotEndTime.add(interval, 'minutes');
        }
      }
    });

    return slotsArray;
  };

  getSlotData = (startTime, endTime) => {
    const date = DateUtil.addDaysFormatted(moment(), -1);
    const startingHour = startTime.hours() + startTime.minutes() / 60;

    return {
      startTime,
      endTime,
      date, // I will look this variable to deleted whether I have to show selected slots or not, because slots are not changing when I am changing dates
      startHour: startingHour, // used for sorting
      icon:
        startingHour < 18
          ? R.Images.AppointmentImages.Sun
          : R.Images.AppointmentImages.Moon,
    };
  };

  sortIntervals = (slots) => {
    const sortedSlot = slots.sort((firstSlot, secondSlot) => {
      return firstSlot.startHour - secondSlot.startHour;
    });

    return sortedSlot;
  };

  getAppointmentDetails = () => {
    const { selectedSlot } = this.state;
    const {
      username,
      fullName,
      phoneNumber,
      email,
      gender,
    } = this.props.userAccountStore;

    const slots = selectedSlot.map((item) => {
      const sTime = moment(item.startTime).format('HH:mm:ss');
      const eTime = moment(item.endTime).format('HH:mm:ss');
      const date = item.date;

      const startDateTime = `${date} ${sTime}`;
      const endDateTime = `${date} ${eTime}`;

      const startTime = DateUtil.getAppointmentFormattedDateTime(
        moment(startDateTime).utc()
      );
      const endTime = DateUtil.getAppointmentFormattedDateTime(
        moment(endDateTime).utc()
      );

      const data = {
        startTime,
        endTime,
      };
      return data;
    });

    const mutationData = {
      appointment: {
        patientId: username,
        proposedSlot: slots,
        userDetails: {
          name: fullName,
          phonenumber: phoneNumber,
          email: email,
          gender: gender,
        },
      },
    };

    return mutationData;
  };

  getDateTimeFromSlot = (slot) => {
    const date = slot.date;
    const sTime = this.getFormattedTime(slot.startTime);
    const eTime = this.getFormattedTime(slot.endTime);

    const startTime = `${date} ${sTime}`;
    const endTime = `${date} ${eTime}`;

    const utcStartTime = DateUtilsTimeZone.convertToUTCTime(startTime);
    const utcEndTime = DateUtilsTimeZone.convertToUTCTime(endTime);

    return {
      startTime: DateUtil.getFormattedDateTime(utcStartTime),
      endTime: DateUtil.getFormattedDateTime(utcEndTime),
    };
  };

  getFormattedTime = (slotTime) => {
    let time = slotTime.format('hh:mm');
    time += ':00'; //adding seconds

    return time;
  };

  removeSlot = (slot) => {
    if (this.removeFunctionCallback) {
      this.removeFunctionCallback(slot);
    }
  };

  onMonthChange = (currentMonth, index) => {
    const dayArray = DateUtilsTimeZone.getMonthDaysForMonth(
      currentMonth,
      this.maxMinDates.minDate,
      this.maxMinDates.maxDate
    );

    this.setState({ dayArray, selectedDate: null });
  };

  onDayChange = (selectedDate) => {
    console.log('selected date is', selectedDate);
    this.setState({ selectedDate });
  };

  getDateContainerScrollStyle = () => {
    const { scrollAnimated, dateMeasurementContainerOffset } = this.state;

    if (!dateMeasurementContainerOffset) {
      return null;
    }

    const finalValue = Animated.subtract(
      scrollAnimated,
      dateMeasurementContainerOffset
    );

    const interpolation = scrollAnimated.interpolate({
      inputRange: [
        0,
        dateMeasurementContainerOffset - 20,
        dateMeasurementContainerOffset - 19,
      ],
      outputRange: [0, 0, 1],
      // extrapolate: 'clamp',
    });

    return {
      transform: [
        {
          translateY: interpolation,
        },
      ],
    };
  };

  checkIfSlotAlreadyExists = (newSlot) => {
    const { selectedSlot, selectedDate } = this.state;

    let doesSlotExist = false;

    selectedSlot.forEach((slot) => {
      if (
        slot.startHour === newSlot.startHour &&
        slot.endTime.format('HH:mm') === newSlot.endTime.format('HH:mm') &&
        slot.date === selectedDate.dateString
      ) {
        doesSlotExist = true;
      }
    });

    return doesSlotExist;
  };

  removeAlreadySelectedSlot = (slot) => {
    let slots = [...this.state.selectedSlot];
    const { selectedDate } = this.state;

    slots = slots.filter((item) => {
      return !(
        item.startHour === slot.startHour &&
        item.date === selectedDate.dateString
      );
    });

    return slots;
  };

  removeSlot = (slot) => {
    let slots = [...this.state.selectedSlot];
    const { selectedDate } = this.state;

    slots = slots.filter((item) => {
      return item != slot;
    });

    this.setState({ selectedSlot: slots });
  };

  onSlotSelected = (slot, index, hasTimePassed) => {
    let slots = [...this.state.selectedSlot];
    const { selectedDate, isSingleSelection } = this.state;

    if (!selectedDate) {
      this.showToast('Please select date');
      return;
    }

    if (hasTimePassed) {
      this.showToast('You cannot select past time');
      return;
    }

    const doesSlotAlreadyAdded = this.checkIfSlotAlreadyExists(slot);

    if (doesSlotAlreadyAdded) {
      slots = this.removeAlreadySelectedSlot(slot);
    } else {
      if (isSingleSelection) {
        slots = [];
      }

      const mSlot = { ...slot };
      mSlot.date = selectedDate.dateString;
      slots.push(mSlot);
    }

    this.startSlotChipAnimation(slots.length > 0 ? 1 : 0);

    this.setState({ selectedSlot: slots });
  };

  startSlotChipAnimation = (toValue) => {
    const { slotChipAnimation } = this.state;
    Animated.timing(slotChipAnimation, {
      toValue,
      duration: 400,
    }).start();
  };

  showToast = (message) => {
    this.refs.toast.show(message, 500);
  };

  toggleModal = (shouldShowModal) => {
    this.setState({ shouldShowModal });
  };

  redirectToPendingScreen = () => {
    // right now going back
    // this.props.navigation.goBack();

    this.props.navigation.pop();

    const changeTab = this.props.navigation.getParam('changeTab', null);
    if (changeTab) {
      changeTab(TabsName.Pending);
    }

    this.props.navigation.navigate({
      routeName: ScreenNameConstant.AppointmentListing,
      params: { selectedTab: TabsName.Pending },
    });
  };

  getSlotContainerStyle = () => {
    const { selectionMethodAnimated } = this.state;

    const interpolation = selectionMethodAnimated.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -ScreenWidth],
    });

    return {
      transform: [{ translateX: interpolation }],
    };
  };

  toggleScroll = (enable) => {
    this.scrollRef.getNode().setNativeProps({ scrollEnabled: enable });
  };

  onSelectionMethodChange = (index) => {
    const { dateMeasurementContainerOffset } = this.state;

    this.scrollRef.getNode().scrollTo({
      x: 0,
      y: dateMeasurementContainerOffset,
      animate: true,
    });

    this.startSelectionMethodAnimation(index);
  };

  startSelectionMethodAnimation = (toValue) => {
    const { selectionMethodAnimated } = this.state;

    Animated.timing(selectionMethodAnimated, {
      toValue,
      duration: 400,
    }).start(() => {
      this.setState({ selectionMethodIndex: toValue });
    });
  };

  getSlot = () => {
    const { selectedSlot } = this.state;
    const slots = selectedSlot.map((item) => {
      const sTime = moment(item.startTime).format('HH:mm:ss');
      const eTime = moment(item.endTime).format('HH:mm:ss');
      const date = item.date;

      const startDateTime = `${date} ${sTime}`;
      const endDateTime = `${date} ${eTime}`;

      const startTime = DateUtil.getAppointmentFormattedDateTime(
        moment(startDateTime).utc()
      );
      const endTime = DateUtil.getAppointmentFormattedDateTime(
        moment(endDateTime).utc()
      );

      const data = {
        startTime,
        endTime,
      };
      return data;
    });

    return slots;
  };

  getButtonTitle = () => {
    if (this.isReschedule && !this.isRequestedByPatient) {
      return 'UPDATE APPOINTMENT REQUEST';
    }

    if (this.isReschedule && this.isRequestedByPatient) {
      return 'RESCHEDULE THE APPOINTMENT';
    }

    return 'SCHEDULE AN APPOINTMENT';
  };

  getMutation = () => {
    if (this.isReschedule) {
      return AppointmentQueries.RescheduleAppointmentRequest;
    }

    return AppointmentQueries.SendAppointmentRequest;
  };

  getMutationData = () => {
    const { selectedReasonType } = this.state;
    let message = '';

    const slots = this.getSlot();

    if (this.isReschedule) {
      const {
        appointmentId,
        patientId,
        userDetails,
      } = this.previousAppointmentDetails;
      const userData = JSON.parse(userDetails);
      const { name } = userData;

      if (selectedReasonType === ReasonType.Default) {
        message = 'Unavailable';
      } else {
        message = this.inputRef ? this.inputRef._lastNativeText : '';

        if (!message) {
          Alert.alert('Viking Health', 'Please provide reason for reschedule');
          return false;
        }
      }

      if (this.isRequestedByPatient) {
        message = 'Requested by you.';
      }

      return {
        appointment: {
          patientId: patientId,
          appointmentId: appointmentId,
          initiatedBy: AppointmentInitiatedBy.Doctor,
          proposedSlot: slots,
          name: name,
          reschdule_reason: message ?? '',
        },
      };
    }

    const {
      username,
      fullName,
      phoneNumber,
      email,
      gender,
    } = this.props.userAccountStore;

    return {
      appointment: {
        patientId: username,
        proposedSlot: slots,
        userDetails: {
          name: fullName,
          phonenumber: phoneNumber,
          email: email,
          gender: gender,
        },
      },
    };
  };

  showError = () => {
    Alert.alert(
      'Alert!',
      'We were not able to process your request right now. Please try again later.'
    );
  };

  getSlotChipStyle = () => {
    const { slotChipAnimation } = this.state;
    const heightInterpolation = slotChipAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 65],
    });

    return {
      height: heightInterpolation,
      overflow: 'hidden',
    };
  };

  render() {
    const {
      selectedSlot,
      shouldShowModal,
      dayArray,
      selectedDate,
      slotArray,
      scrollAnimated,
      selectionMethodAnimated,
      selectionMethodIndex,
      dateMeasurementContainerOffset,
      shouldShowReasonContainer,
      selectedReasonType,
      previousSlots,
    } = this.state;

    const { fullName, gender } = this.props.userAccountStore;
    const dateContainerScrollYOffset = this.getDateContainerScrollStyle();
    const selectionTransformStyle = this.getSlotContainerStyle();

    const buttonLabel = this.getButtonTitle();
    const buttonMutation = this.getMutation();
    const slotChipStyle = this.getSlotChipStyle();

    return (
      <View style={CommonStyles.containerStyle}>
        <Animated.ScrollView
          bounces={false}
          ref={(ref) => {
            this.scrollRef = ref;
          }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ backgroundColor: '#EFF5F9' }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollAnimated } } }],
            { useNativeDriver: true }
          )}
        >
          <View>
            <Animated.View
              style={[
                { backgroundColor: 'white', zIndex: 100 },

                dateContainerScrollYOffset,
              ]}
            >
              <View style={CommonStyles.paddingHorizontal}>
                <View
                  style={[CommonStyles.backArrowPadding, { marginLeft: -6 }]}
                >
                  <BackButton navigation={this.props.navigation} />
                </View>

                <Text style={CommonStyles.pageTitleStyle}>
                  {strings('appointment.selectAppointmentSlot')}{' '}
                </Text>
                <Text style={Styles.nameTextStyle}>
                  {this.isReschedule ? this.patientName : fullName}
                </Text>

                <Text style={Styles.messageTextStyle}>
                  {strings('appointment.slotSelectionMessagePatient')}{' '}
                </Text>
              </View>

              {shouldShowReasonContainer && (
                <View style={Styles.reasonContainer}>
                  <TouchableOpacity
                    style={Styles.reasonBox}
                    onPress={() => {
                      this.setState({ selectedReasonType: ReasonType.Default });
                    }}
                  >
                    <Image
                      style={[
                        Styles.tickCircleStyle,
                        {
                          display:
                            selectedReasonType === ReasonType.Default
                              ? 'flex'
                              : 'none',
                        },
                      ]}
                      resizeMode='contain'
                      source={R.Images.AppointmentImages.blueTick}
                    />
                    <Text
                      style={[Styles.unavailableTextStyle, { marginLeft: 0 }]}
                    >
                      Unavailable
                    </Text>
                  </TouchableOpacity>

                  <View
                    style={[
                      Styles.reasonBox,
                      { flexDirection: 'column', marginTop: 11 },
                    ]}
                  >
                    <TouchableOpacity
                      style={{ flexDirection: 'row' }}
                      onPress={() => {
                        this.setState({ selectedReasonType: ReasonType.Other });
                      }}
                    >
                      <Image
                        style={[
                          Styles.tickCircleStyle,
                          {
                            display:
                              selectedReasonType === ReasonType.Other
                                ? 'flex'
                                : 'none',
                          },
                        ]}
                        resizeMode='contain'
                        source={R.Images.AppointmentImages.blueTick}
                      />
                      <Text style={Styles.unavailableTextStyle}>
                        Other Reason
                      </Text>
                    </TouchableOpacity>

                    <View
                      style={{
                        marginTop: 10,
                        display:
                          selectedReasonType === ReasonType.Other
                            ? 'flex'
                            : 'none',
                      }}
                    >
                      <Text style={Styles.writeYourReason}>
                        Write your reason
                      </Text>
                      <TextInput
                        ref={(ref) => {
                          this.inputRef = ref;
                        }}
                        multiline={true}
                        style={Styles.reasonInput}
                      />
                    </View>
                  </View>
                </View>
              )}
              {/* Month and date slider */}
              <View>
                <View
                  ref={(ref) => (this.dateSelectionRef = ref)}
                  onLayout={() => {
                    if (this.dateSelectionRef) {
                      this.dateSelectionRef.measure(
                        (x, y, width, height, pageX, pageY) => {
                          if (this.state.dateMeasurementContainerOffset) {
                            return;
                          }

                          this.setState({
                            dateMeasurementContainerOffset: pageY,
                          });
                        }
                      );
                    }
                  }}
                >
                  <View style={CommonStyles.paddingHorizontal}>
                    <MonthSlider
                      style={Styles.monthListContainerStyle}
                      months={this.monthNameArray.monthArray}
                      onMonthChange={this.onMonthChange}
                    />

                    <DaysSlider
                      style={Styles.daysListContainerStyle}
                      dayArray={dayArray}
                      selectedDate={selectedDate}
                      onDayChange={this.onDayChange}
                      selectedSlot={selectedSlot}
                      previousSlots={previousSlots}
                    />
                  </View>

                  <SlotSelectionMethod
                    selectedIndex={selectionMethodIndex}
                    animation={selectionMethodAnimated}
                    onSelectionChange={this.onSelectionMethodChange}
                  />
                </View>
              </View>
              <View style={{ height: 10, backgroundColor: '#EFF5F9' }} />
            </Animated.View>

            <Animated.View
              style={[
                Styles.slotsWrapperStyle,
                selectionTransformStyle,
                { width: 2 * ScreenWidth },
              ]}
            >
              <SlotsList
                style={[CommonStyles.paddingHorizontal, { width: ScreenWidth }]}
                slotArray={slotArray}
                isFocused={selectionMethodIndex === 0}
                selectedSlot={selectedSlot}
                selectedDate={selectedDate}
                onSlotSelected={this.onSlotSelected}
                previouslySelectedSlot={previousSlots}
              />

              <CustomSlot
                dateContainerOffset={dateMeasurementContainerOffset}
                isFocused={selectionMethodIndex === 1}
                selectedDate={selectedDate}
                onSlotSelected={this.onSlotSelected}
                toggleScroll={this.toggleScroll}
              />
            </Animated.View>
          </View>
        </Animated.ScrollView>

        {/* Slot chips */}
        <Animated.View
          style={[
            Styles.chipScrollViewContainer,
            slotChipStyle,
            { paddingHorizontal: 16, backgroundColor: '#EFF5F9' },
          ]}
        >
          <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={selectedSlot.reverse()}
            ItemSeparatorComponent={(item, index) => {
              return <View style={{ width: 10 }} />;
            }}
            renderItem={({ item, index }) => {
              return (
                <SlotChips
                  key={`${item.date + item.startHour}`}
                  slot={item}
                  onClose={this.removeSlot}
                />
              );
            }}
            keyExtractor={(item, index) => {
              return `${item.date + item.startHour}`;
            }}
          />
        </Animated.View>

        <View
          style={[
            {
              backgroundColor: '#EFF5F9',
              paddingTop: 22,
              paddingBottom: 36,
            },
            CommonStyles.paddingHorizontal,
          ]}
        >
          <Mutation
            mutation={buttonMutation}
            refetchQueries={AppUtils.getAppointmentListingForAdmin()}
            onError={(error) => {
              console.log('error is', error);
            //   Sentry.captureMessage(error.message);
              this.showError();
            }}
            onCompleted={(data) => {
              const mutationData =
                data.rescheduleAppointmentRequest ||
                data.sendAppointmentRequest;

              if (mutationData.includes('statusCode=200')) {
                this.toggleModal(true);

                return;
              }
              this.showError();
            }}
          >
            {(sendAppointmentRequest, { loading }) => {
              return (
                <ProgressBarButton
                  buttonState={
                    loading
                      ? ButtonState.Progress
                      : selectedSlot.length === 0
                      ? ButtonState.Disabled
                      : ButtonState.Idle
                  }
                  label={buttonLabel}
                  onClick={() => {
                    checkInternetConnection().then((isConnected) => {
                      if (isConnected === true) {
                        const appointmentDetails = this.getMutationData();

                        if (!appointmentDetails) {
                          return;
                        }

                        sendAppointmentRequest({
                          variables: {
                            appointmentDetails: JSON.stringify(
                              appointmentDetails
                            ),
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
              );
            }}
          </Mutation>
        </View>

        <Toast
          ref='toast'
          position='bottom'
          fadeInDuration={800}
          fadeOutDuration={1000}
        />

        <GamificationModal
          isVisible={shouldShowModal}
          onClick={() => {
            this.toggleModal(false);
          }}
          onBackdropPress={() => {
            // this.handleGamificationModalBackdropClick();
          }}
          userData={{
            fullName: this.isReschedule ? this.patientName : fullName,
            gender,
          }}
          onModalHide={this.redirectToPendingScreen}
          modalName={GamificationConstant.Appointment.BookAppointment}
          isReschedule={this.isReschedule}
        />
      </View>
    );
  }
}
