import React from 'react';
import { View } from 'react-native';

import { DatePicker2 } from 'Components';

import AppUtil from 'Library/Utils/AppUtil';
import moment from 'moment';
import { API_DATE_FORMAT, DISPLAY_DATE_FORMAT } from 'Library/Constants';

export const DateTitlePicker = (props = {}) => {
  getDateStr = (date) => {
    return moment(date, API_DATE_FORMAT).format('MMM DD, YYYY');
  };
  return (
    <View
      style={{
        flexDirection: 'row',
        marginLeft: 10,
      }}
    >
      <DatePicker2
        style={{
          alignItems: 'flex-start',
          ...props.style,
        }}
        preText={props?.preText}
        androidMode='spinner'
        maxDate={AppUtil?.getCurrentDate()}
        minDate={moment(props?.programStartDate).format('YYYY-MM-DD')}
        date={props?.date}
        mode='date'
        format={API_DATE_FORMAT}
        confirmBtnText='Done'
        cancelBtnText='Cancel'
        showIcon={false}
        onDateChange={props?.onDateChanged}
        getDateStr={getDateStr}
      />
    </View>
  );
};
