import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { dynamicSize, getFontSize } from '../../../../utility/ResizeUtil';

export default class TimerText extends Component {
  render() {
    const { minutesLong, ...rest } = this.props;

    const hours = Math.floor(minutesLong / 60);
    const minutes = minutesLong - hours * 60;

    return (
      <View {...rest}>
        <View style={styles.timerContainer}>
          <Text style={styles.time}>{hours}</Text>
          <Text style={styles.text}>Hr</Text>
          <Text style={[styles.time, styles.span]}>{minutes}</Text>
          <Text style={styles.text}>Min</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  timerContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
  time: {
    color: '#024481',
    fontSize: getFontSize(35),
    fontWeight: '300',
  },
  span: {
    marginLeft: 10,
  },
  text: {
    color: '#024481',
    fontSize: 12,
    fontWeight: '300',
    marginBottom: 5,
  },
});
