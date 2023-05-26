import React, { Component } from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import CommonStyles from '../styles';
import Styles from './styles';
import * as DateUtilsTimeZone from '../../../Library/Utils/DateUtilsTimeZone';
import { ProgressBarButton } from '../../../Components';
import { inject, observer } from 'mobx-react';
import Toast, { DURATION } from 'react-native-easy-toast';

import SlotsList from '../Components/SlotsList/SlotsList';

import moment from 'moment';
import * as DateUtil from '../../../Library/Utils/DateUtil';

export const NoOfMonthForAdvanceBooking = 3;
export const Interval = 30;
export const AllowedSlotIntervals = [
  { startTime: { hour: 8, min: 0 }, endTime: { hour: 14, min: 0 } },
  {
    startTime: { hour: 14, min: 0 },
    endTime: { hour: 15, min: 0 },
    isDisabled: true,
    reason: 'Lunch break',
  },
  { startTime: { hour: 15, min: 0 }, endTime: { hour: 20, min: 0 } },
];

export const AppointmentStatus = {
  Pending: 'PENDING',
  Accepted: 'ACCEPTED',
  Proposed: 'PROPOSED',
  Completed: 'COMPLETED',
  Rejected: 'REJECTED',
  Reschedule: 'RESCHEDULE',
};

@inject('userAccountStore', 'loginUserStore')
@observer
export default class SlotSelection extends Component {
  constructor(props) {
    super(props);

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
      selectedDate: null,
      selectedSlot: [],

      isSingleSelection: props.isSingleSelection,
      isSuggestingSlot: props.isSuggestingSlot,
    };
  }

  componentDidMount() {
    if (this.props.removeFunctionCallback) {
      this.props.removeFunctionCallback(this.removeSlot);
    }
  }

  /**
   * interval should be in minutes.
   */
  breakIntervalIntoSlots = (interval, slots) => {
    const slotsArray = [];

    slots.forEach((slotInterval) => {
      let startTime = moment();
      let endTime = moment();

      // set hour and time according to interval start and end time.
      startTime.hour(slotInterval.startTime.hour);
      startTime.minute(slotInterval.startTime.min);
      endTime.hour(slotInterval.endTime.hour);
      endTime.minute(slotInterval.endTime.min);

      // startTime = DateUtilsTimeZone.convertTimeToPST(startTime);
      // endTime = DateUtilsTimeZone.convertTimeToPST(endTime);

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

          slotsArray.push(
            this.getSlotData(individualSlotTime, individualSlotEndTime)
          );

          slotStartTime.add(interval, 'minutes');
          slotEndTime.add(interval, 'minutes');
        }
      }
    });

    return slotsArray;
  };

  getSlotData = (startTime, endTime) => {
    const date = DateUtil.addDaysFormatted(moment(), -1);
    const startHour = startTime.hours() + startTime.minutes() / 60;

    return {
      startTime,
      endTime,
      date, // I will look this variable to deleted whether I have to show selected slots or not, because slots are not changing when I am changing dates
      startHour: startHour,
    };
  };

  sortIntervals = (slots) => {
    const sortedSlot = slots.sort((firstSlot, secondSlot) => {
      return firstSlot.startHour - secondSlot.startHour;
    });

    return sortedSlot;
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
    this.setState({ selectedDate });
  };

  checkIfSlotAlreadyExists = (newSlot) => {
    const { selectedSlot, selectedDate } = this.state;

    let doesSlotExist = false;

    selectedSlot.forEach((slot) => {
      if (
        slot.startHour === newSlot.startHour &&
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

    if (this.props.onSlotChange) {
      this.props.onSlotChange(slots);
    }
  };

  onSlotSelected = (slot) => {
    let slots = [...this.state.selectedSlot];
    const { selectedDate, isSingleSelection } = this.state;

    if (!selectedDate) {
      this.showToast('Please select date');
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

    this.setState({ selectedSlot: slots });

    if (this.props.onSlotChange) {
      this.props.onSlotChange(slots);
    }
  };

  showToast = (message) => {
    console.log('show toast', message);

    this.refs.toast.show(message, 500);
  };

  getDateTimeFromSlot = (slot) => {
    const date = slot.date;
    const sTime = this.getFormattedTime(slot.startTime);
    const eTime = this.getFormattedTime(slot.endTime);

    const startTime = `${date} ${sTime}`;
    const endTime = `${date} ${eTime}`;

    return { startTime, endTime };
  };

  getFormattedTime = (slotTime) => {
    let time = slotTime.format('hh:mm');
    time += ':00'; //adding seconds

    return time;
  };

  render() {
    const { slotArray, selectedDate, selectedSlot } = this.state;

    return (
      <View>
        <View
          style={[
            Styles.slotsContainerStyle,
            { backgroundColor: '#EFF5F9' },
            CommonStyles.paddingHorizontal,
          ]}
        >
          <SlotsList
            slotArray={slotArray}
            selectedSlot={selectedSlot}
            selectedDate={selectedDate}
            onSlotSelected={this.onSlotSelected}
          />
        </View>

        <Toast
          ref='toast'
          position='bottom'
          fadeInDuration={800}
          fadeOutDuration={1000}
        />
      </View>
    );
  }
}
