import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Styles from './styles';
import { R } from '../../../../Resources/R';
import * as DateUtils from '../../../../Library/Utils/DateUtil';
import {
  AppointmentStatus,
  AppointmentStatusCategory,
} from '../../../../utility/constants/Constants';
import moment from 'moment';

function shouldShowList(status, statusCategory) {
  return !(
    status === AppointmentStatus.CONFIRM ||
    status === AppointmentStatus.ACCEPTED
  );
}

function shouldShowVideoIcon(status, statusCategory, appointmentDetails) {
  if (status !== AppointmentStatus.CONFIRM) {
    return false;
  }

  const selectedSlot = JSON.parse(appointmentDetails.selectedSlot);

  if (!selectedSlot) {
    return false;
  }

  const startTime = moment.utc(selectedSlot.startTime).local();
  const endTime = moment.utc(selectedSlot.endTime).local();
  const currentTime = moment();

  const minDiff = startTime.diff(currentTime, 'm');
  const endMin = endTime.diff(currentTime, 'm');

  return minDiff < 60 && endMin >= 0;
}

export default function Slots({ slots, appointmentDetails, onVideoCallClick }) {
  const [shouldShowAllSlots, showAllSlots] = useState(false);

  const slotsCount = slots.length;
  const slotsToShow = shouldShowAllSlots ? [...slots] : [...slots].splice(0, 2);
  const shouldShowCollapseExpand = slotsCount > 2;

  const { status, statusCategory } = appointmentDetails;

  const showVideoIcon = shouldShowVideoIcon(
    status,
    statusCategory,
    appointmentDetails
  );
  const showList = shouldShowList(status, statusCategory);

  return (
    <View>
      <View style={Styles.slotsContainerStyle}>
        {showList &&
          slotsToShow.map((item, index) => {
            return <Slot key={index} slot={item} />;
          })}

        {shouldShowAllSlots && shouldShowCollapseExpand && (
          <TouchableOpacity
            onPress={() => {
              showAllSlots(false);
            }}
            hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
            activeOpacity={1}
          >
            <Text style={Styles.viewLess}>View Less</Text>
          </TouchableOpacity>
        )}

        <View style={Styles.slotCounterContainerStyle}>
          {showVideoIcon && (
            <TouchableOpacity onPress={onVideoCallClick}>
              <Image
                source={R.Images.videoCall}
                style={Styles.videoCallIconStyle}
                resizeMode='contain'
              />
            </TouchableOpacity>
          )}

          {!shouldShowAllSlots && shouldShowCollapseExpand && showList && (
            <TouchableOpacity
              onPress={() => {
                showAllSlots(true);
              }}
              style={Styles.slotCounterStyle}
            >
              <Text style={Styles.counterTextStyle}>+{slotsCount - 2}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

export function Slot({ slot }) {
  const { startTime, endTime } = slot;
  const date = DateUtils.getAppointmentFormattedDate(
    moment.utc(startTime).local()
  );
  const sTime = DateUtils.getAppointmentFormattedTime(
    moment.utc(startTime).local()
  );
  const eTime = DateUtils.getAppointmentFormattedTime(
    moment.utc(endTime).local()
  );

  return (
    <View style={Styles.slotContainerStyle}>
      <Image
        style={Styles.calendarIconStyle}
        source={R.Images.AppointmentImages.calendar}
        resizeMode='contain'
      />
      <View style={Styles.timingContainerStyle}>
        <Text style={Styles.dateTextStyle}>{date}</Text>
        <Text style={Styles.timeTextStyle}>
          {sTime}-{eTime}
        </Text>
      </View>
    </View>
  );
}
