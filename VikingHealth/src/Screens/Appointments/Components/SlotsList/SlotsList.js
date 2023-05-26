import React, { Component } from 'react';
import { View, Animated, Easing } from 'react-native';
import * as DateUtil from '../../../../Library/Utils/DateUtil';
import moment from 'moment';
import { SlotItem } from '../SlotItem/SlotItem';

export class SlotsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      animated: new Animated.Value(0),
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.startAnimation();
    }, 500);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedDate !== this.props.selectedDate) {
      this.setState({});
    }
  }

  startAnimation = () => {
    const { animated } = this.state;
    const { slotArray } = this.props;

    Animated.timing(animated, {
      toValue: slotArray.length,
      duration: slotArray.length * 100 + 300,
      easing: Easing.linear,
    }).start();
  };

  hasSlotTimePassed = (slot) => {
    const currentTime = moment();

    const currentHour = currentTime.hours() + currentTime.minutes() / 60;
    const slotHour = slot.startHour;

    if (currentHour > slotHour) {
      return true;
    }

    return false;
  };

  renderSlotItem = ({
    item,
    index,
    isSelected,
    isSameDateSelected,
    isDisabled,
  }) => {
    const { onSlotSelected } = this.props;
    const hasTimePassed = this.hasSlotTimePassed(item);
    const { animated } = this.state;

    const passedTimeSlot = hasTimePassed && isSameDateSelected;

    return (
      <SlotItem
        key={index}
        onSlotSelected={onSlotSelected}
        slot={item}
        index={index}
        useAnimation={true}
        isSelected={isSelected}
        isDisabled={isDisabled}
        hasTimePassed={passedTimeSlot}
        animated={animated}
      />
    );
  };

  filterSlotsOfSelectedDate = () => {
    const { selectedDate, selectedSlot } = this.props;

    if (!selectedDate || selectedSlot.length === 0) {
      return [];
    }

    return selectedSlot.filter((slot) => slot.date === selectedDate.dateString);
  };

  checkIfSlotIsSelected = (slot) => {
    const currentDateSlot = this.filterSlotsOfSelectedDate();
    let isSelected = false;

    currentDateSlot.forEach((item) => {
      if (item.startHour === slot.startHour) {
        isSelected = true;
      }
    });

    return isSelected;
  };

  checkIfSlotWasPreviouslySelected = (slotData) => {
    const { previouslySelectedSlot, selectedDate } = this.props;
    let exists = false;

    previouslySelectedSlot.forEach((item, index) => {
      const itemStartTime = moment.utc(item.startTime).local();
      const itemEndTime = moment.utc(item.endTime).local();

      const itemStartHour = itemStartTime.hour() + itemStartTime.minute() / 60;
      const itemEndHour = itemEndTime.hour() + itemEndTime.minute() / 60;

      const slotStartHour =
        slotData.startTime.hour() + slotData.startTime.minute() / 60;
      const slotEndHour =
        slotData.endTime.hour() + slotData.endTime.minute() / 60;

      const isSameDay = selectedDate
        ? itemStartTime.format('YYYY-MM-DD') === selectedDate.dateString
        : false;

      if (
        itemStartHour === slotStartHour &&
        itemEndHour === slotEndHour &&
        isSameDay
      ) {
        exists = true;
      }
    });

    return exists;
  };

  render() {
    const {
      slotArray,
      selectedSlot,
      style,
      selectedDate,
      isFocused,
    } = this.props;
    const isSameDateSelected = DateUtil.isAbsoluteToday(selectedDate);

    if (!isFocused) {
      return <View style={style} />;
    }

    return (
      <View style={[{ backgroundColor: '#EFF5F9' }, style]}>
        {slotArray.map((item, index) => {
          const isSelected = this.checkIfSlotIsSelected(item);
          const wasPreviouslySelected = this.checkIfSlotWasPreviouslySelected(
            item
          );
          return this.renderSlotItem({
            item,
            index,
            selectedSlot,
            isSelected: isSelected || wasPreviouslySelected,
            isDisabled: wasPreviouslySelected,
            isSameDateSelected,
          });
        })}
      </View>
    );
  }
}
