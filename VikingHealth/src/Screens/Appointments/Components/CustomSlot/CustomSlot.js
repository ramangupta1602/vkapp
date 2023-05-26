import React, { Component } from 'react';
import {
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import Styles from './styles';
import CircularSlider from 'react-native-circular-slider';
import Svg, {
  G,
  Defs,
  RadialGradient,
  Stop,
  Circle,
  Rect,
} from 'react-native-svg';
import TimerText from './TimerText';
import moment from 'moment';
import { R } from '../../../../Resources/R';
import { dynamicSize } from '../../../../utility/ResizeUtil';

const START_ICON = (
  <G>
    <Circle fill='#1072E0' cx={0} cy={0} r={15} />
    <Circle fill='rgba(20,84,156,0.4)' cx={0} cy={0} r={7} />
    <Circle fill='white' cx={0} cy={0} r={5} />
  </G>
);

const END_ICON = (
  <G>
    <Circle fill='#1072E0' cx={0} cy={0} r={15} />
    <Rect
      fill='rgba(20,84,156,0.4)'
      width={12}
      height={12}
      translateX={-5}
      translateY={-5}
    />
    <Rect fill='white' width={10} height={10} translateX={-5} translateY={-5} />
  </G>
);

const { width, height: ScreenHeight } = Dimensions.get('screen');

function calculateMinutesFromAngle(angle) {
  return Math.round(angle / ((2 * Math.PI) / (12 * 12))) * 5;
}

function calculateTimeFromAngle(angle) {
  const minutes = calculateMinutesFromAngle(angle);
  const h = Math.floor(minutes / 60);
  const m = minutes - h * 60;

  return { h, m };
}

function roundAngleToFives(angle) {
  const fiveMinuteAngle = (2 * Math.PI) / 144;

  return Math.round(angle / fiveMinuteAngle) * fiveMinuteAngle;
}

function padMinutes(min) {
  if (`${min}`.length < 2) {
    return `0${min}`;
  }

  return min;
}

function calculateAngleFromTime(hour, min) {
  const angle = (hour + min / 60) * 30;

  if (angle === 0) {
    return 0;
  }

  const angleInRadius = angle * (Math.PI / 180);

  return angleInRadius;
}

export default class CustomSlot extends Component {
  constructor(props) {
    super(props);

    this.state = { hasFetchDimension: false, ...this.getInitialState() };
  }

  onTimeUpdate = (fromTimeInMinutes, minutesLong) => {
    this.setState({ minutesLong });
  };

  onUpdate = ({ startAngle, angleLength }) => {
    this.setState({
      startAngle: roundAngleToFives(startAngle),
      angleLength: roundAngleToFives(angleLength),
    });
  };

  getInitialState = () => {
    return {
      pageY: 0,
      startAngle: calculateAngleFromTime(10, 0),
      angleLength: calculateAngleFromTime(1, 0),
    };
  };

  getStartAndEndTime = (startTime, angleLength) => {
    const sTime = calculateTimeFromAngle(startTime);
    const duration = calculateMinutesFromAngle(angleLength);

    const time = moment().set({ hour: sTime.h, minute: sTime.m });
    const endTime = moment(time).add('m', duration);

    return { startTime: time, endTime: endTime, duration: duration };
  };

  getSlotData = (startTime, endTime) => {
    const startingHour = startTime.hours() + startTime.minutes() / 60;

    return {
      startTime,
      endTime,
      startHour: startingHour, // used for sorting
      icon:
        startingHour < 18
          ? R.Images.AppointmentImages.Sun
          : R.Images.AppointmentImages.Moon,
    };
  };

  onClockStartDragging = () => {
    if (this.props.toggleScroll) {
      this.props.toggleScroll(false);
    }
  };

  onClockStopDragging = () => {
    if (this.props.toggleScroll) {
      this.props.toggleScroll(true);
    }
  };

  getSvgContainerStyle = (radius) => {
    return {
      position: 'absolute',
      width: 2 * radius + 70,
      height: 2 * radius + 70,
      overflow: 'hidden',
      borderRadius: (2 * radius + 70) / 2,
    };
  };

  render() {
    const { selectedDate, onSlotSelected } = this.props;
    const { startAngle, angleLength } = this.state;
    const radius = (width - 100) / 2;

    const svgContainerStyle = this.getSvgContainerStyle(radius);

    const { startTime, endTime, duration } = this.getStartAndEndTime(
      startAngle,
      angleLength
    );

    const sTime = startTime.format('hh:mm');
    const eTime = endTime.format('hh:mm');
    const sTimeAm = startTime.format('A');
    const eTimeAm = endTime.format('A');

    const isIOS = Platform.OS == 'ios';
    const fillColor = 'rgba(16,114,224,0.16)';

    return (
      <View style={[Styles.containerStyle, { width }]}>
        <View style={Styles.contentContainerStyle}>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text style={Styles.selectTimeRangeStyle}>Select time range</Text>

            <View style={Styles.timeContainer}>
              {/* Start time  */}
              <View style={Styles.time}>
                <View style={Styles.timeHeader}>
                  <Text style={Styles.bedtimeText}>START TIME</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={Styles.timeValue}>{sTime}</Text>
                  <Text style={Styles.ampm}>{sTimeAm}</Text>
                </View>
              </View>

              {/* End time */}
              <View style={Styles.time}>
                <View style={Styles.timeHeader}>
                  <Text style={Styles.bedtimeText}>END TIME</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={Styles.timeValue}>{eTime}</Text>
                  <Text style={Styles.ampm}>{eTimeAm}</Text>
                </View>
              </View>
            </View>

            <View
              style={[
                { width: 2 * radius + 70, height: 2 * radius + 70 },
                Styles.clockHolderStyle,
              ]}
            >
              {/* Shadow and concentric circle */}
              <Svg style={[svgContainerStyle, { opacity: 0.4 }]}>
                <Defs>
                  <RadialGradient cx='50%' cy='50%' id='gradient'>
                    <Stop stopColor='white' offset='0.70' />
                    <Stop stopColor={fillColor} offset='0.95' />
                    <Stop stopColor='white' offset='1' />
                  </RadialGradient>

                  <RadialGradient cx='50%' cy='50%' id='gradient2'>
                    <Stop stopColor='white' offset='0.70' />
                    <Stop stopColor={fillColor} offset='1' />
                  </RadialGradient>
                </Defs>

                <Circle
                  fill='url(#gradient)'
                  cx={(2 * radius + 70) / 2}
                  cy={(2 * radius + 70) / 2}
                  r={(2 * radius + 45) / 2}
                />

                <Circle
                  fill='url(#gradient2)'
                  cx={(2 * radius + 70) / 2}
                  cy={(2 * radius + 75) / 2}
                  r={(2 * radius + 10) / 2}
                />
              </Svg>

              <Svg style={svgContainerStyle}>
                <Defs>
                  <RadialGradient cx='50%' cy='50%' id='gradient3'>
                    <Stop stopColor={fillColor} offset='0.5' />
                    <Stop stopColor={'white'} offset='1' />
                  </RadialGradient>
                </Defs>

                <Circle
                  fill='url(#gradient3)'
                  cx={(2 * radius + 70) / 2}
                  cy={(2 * radius + 75) / 2}
                  r={(2 * radius - dynamicSize(100)) / 2}
                />
              </Svg>

              <Svg style={svgContainerStyle}>
                <Circle
                  fill='white'
                  cx={(2 * radius + 70) / 2}
                  cy={(2 * radius + 75) / 2}
                  r={radius / 1.7}
                />
              </Svg>

              {/* Center timer component */}
              <TimerText
                style={Styles.sleepTimeContainer}
                minutesLong={duration}
              />

              {/* Selection clock */}
              <CircularSlider
                onDragStart={this.onClockStartDragging}
                onDragEnd={this.onClockStopDragging}
                startAngle={startAngle}
                angleLength={angleLength}
                onUpdate={this.onUpdate}
                segments={5}
                strokeWidth={dynamicSize(30)}
                radius={radius}
                gradientColorFrom='#3F90EC'
                gradientColorTo='#3F90EC'
                showClockFace
                stroke='black'
                clockFaceColor='#8695A6'
                bgCircleColor='white'
                stopIcon={<G>{END_ICON}</G>}
                startIcon={<G>{START_ICON}</G>}
              />
            </View>

            <TouchableOpacity
              style={Styles.addButtonHolder}
              onPress={() => {
                const slot = this.getSlotData(startTime, endTime);
                slot.date = selectedDate;
                onSlotSelected(slot);

                if (selectedDate) {
                  this.setState(this.getInitialState());
                }
              }}
            >
              <Image
                style={Styles.addButtonStyle}
                source={R.Images.plus}
                resizeMode='contain'
              />
              <Text style={Styles.addText}>ADD</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
