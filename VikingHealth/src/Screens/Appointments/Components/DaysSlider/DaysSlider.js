import React from 'react';
import { TouchableOpacity, View, Text, FlatList } from 'react-native';
import Styles from './styles';
import { R } from '../../../../Resources';
import moment from 'moment';

const Day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function checkIfDayHasASelectedSlot(item, selectedSlots) {
  let hasSelectedSlots = false;

  selectedSlots.forEach((slot) => {
    if (slot.date === item.dateString) {
      hasSelectedSlots = true;
    }
  });

  return hasSelectedSlots;
}

function checkIfDayHasAPreviouslySelectedSlot(item, selectedSlots) {
  let hasSelectedSlots = false;

  selectedSlots.forEach((slot) => {
    const { startTime } = slot;
    const slotDate = moment.utc(startTime).local().format('YYYY-MM-DD');

    if (slotDate === item.dateString) {
      hasSelectedSlots = true;
    }
  });

  return hasSelectedSlots;
}

function checkIfDayIsFocused(selectedDate, item) {
  return selectedDate && selectedDate.dateString === item.dateString;
}

function renderDayItem({
  item,
  index,
  onDayChange,
  selectedDate,
  selectedSlot,
  previousSlots,
}) {
  const hasSelectedSlots = checkIfDayHasASelectedSlot(item, selectedSlot);
  const hasSlotsPreviouslySelected = checkIfDayHasAPreviouslySelectedSlot(
    item,
    previousSlots
  );
  const isFocused = checkIfDayIsFocused(selectedDate, item);
  const textColor = isFocused ? 'white' : R.Colors.PrimaryTextColor;
  const dateTextColor = isFocused ? 'white' : '#8695A6';

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          if (onDayChange) {
            onDayChange(item);
          }
        }}
        style={[
          Styles.dayContainer,
          // for shadow
          isFocused ? null : Styles.shadow,
          // background color
          {
            backgroundColor: isFocused ? '#1072E0' : 'white',
          },
        ]}
      >
        <Text style={[Styles.dayTextStyle, { color: textColor }]}>
          {Day[item.dayOfWeek]}
        </Text>
        <Text style={[Styles.dateTextStyle, { color: dateTextColor }]}>
          {item.date}
        </Text>
      </TouchableOpacity>

      <View style={Styles.dotIndicatorStyle}>
        {hasSlotsPreviouslySelected && (
          <View style={Styles.previouslySelectedDotStyle} />
        )}

        {hasSelectedSlots && <View style={Styles.currentlySelectedDotStyle} />}
      </View>
    </View>
  );
}

export function DaysSlider({
  dayArray,
  onDayChange,
  selectedDate,
  selectedSlot,
  style,
  previousSlots,
}) {
  return (
    <View style={style}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={dayArray}
        renderItem={({ item, index }) => {
          return renderDayItem({
            item,
            index,
            onDayChange,
            selectedDate,
            selectedSlot,
            previousSlots,
          });
        }}
        extraData={{ selectedDate, selectedSlot }}
      />
    </View>
  );
}
