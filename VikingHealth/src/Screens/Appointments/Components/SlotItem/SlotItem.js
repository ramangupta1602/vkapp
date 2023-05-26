import React from 'react';
import {
  TouchableOpacity,
  Animated,
  Image,
  Text,
  Platform,
  View,
} from 'react-native';
import Styles from '../SlotsList/styles';
import { R } from '../../../../Resources/R';

export class SlotItem extends React.Component {
  constructor(props) {
    super(props);

    const { isSelected } = props;

    this.state = {
      selectionAnimation: new Animated.Value(isSelected ? 1 : 0),
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.isSelected !== prevProps.isSelected) {
      this.startAnimation(this.props.isSelected ? 1 : 0);
    }
  }

  startAnimation = (toValue) => {
    const { selectionAnimation } = this.state;

    Animated.timing(selectionAnimation, {
      duration: 200,
      toValue,
    }).start();
  };

  getSelectionAnimatingStyle = () => {
    const { selectionAnimation } = this.state;

    const widthInterpolation = selectionAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 64],
    });

    const heightInterpolation = selectionAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 50],
    });

    return {
      width: widthInterpolation,
      height: heightInterpolation,
    };
  };

  getAnimatedStyle = (animated, index) => {
    if (!animated) {
      return null;
    }

    const translationInterpolation = animated.interpolate({
      inputRange: [0, index],
      outputRange: [0, 0],
      extrapolate: 'clamp',
    });

    const opacityInterpolation = animated.interpolate({
      inputRange: [0, index],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

    const scaleTransformation = animated.interpolate({
      inputRange: [0, index],
      outputRange: [0.75, 1],
      extrapolate: 'clamp',
    });

    return {
      opacity: opacityInterpolation,
      transform: [
        { translateY: translationInterpolation },
        {
          scaleX: scaleTransformation,
        },
      ],
    };
  };

  render() {
    const {
      onSlotSelected,
      slot,
      index,
      isSelected,
      animated,
      showDate,
      hasTimePassed,
      isDisabled,
    } = this.props;

    const { startTime, endTime, icon } = slot;
    const startTimeString = startTime.format('hh:mm A');
    const endTimeString = endTime.format('hh:mm A');
    const date = startTime.format('ddd, MMM DD, YYYY');
    const borderWidth = Platform.OS === 'ios' ? 2 : 1;

    const listItemSlotStyle = this.getAnimatedStyle(animated, index);
    const imageAnimatingStyle = this.getSelectionAnimatingStyle();

    let opacity = isDisabled || hasTimePassed ? 0.5 : 1;

    return (
      <View>
        <View style={{ opacity }}>
          <TouchableOpacity
            disabled={isDisabled}
            key={`${startTimeString} - ${endTimeString}`}
            activeOpacity={1}
            onPress={() => {
              if (onSlotSelected) {
                onSlotSelected(slot, index, hasTimePassed);
              }
            }}
          >
            <Animated.View
              style={[
                Styles.slotContainerStyle,
                listItemSlotStyle,
                {
                  borderColor: '#45EBA6',
                  borderWidth: isSelected ? borderWidth : 0,
                },
              ]}
            >
              <Animated.Image
                style={[
                  Styles.selectedSlotConfettiImageStyle,
                  imageAnimatingStyle,
                ]}
                source={R.Images.AppointmentImages.GreenTick}
              />

              {showDate && (
                <Text style={[Styles.textStyle, Styles.unselectedTextStyle]}>
                  {date}
                  <Text style={Styles.slotTimeStyle}>
                    {'\n'}
                    {startTimeString} - {endTimeString}
                  </Text>
                </Text>
              )}

              {!showDate && (
                <Text style={[Styles.textStyle, Styles.unselectedTextStyle]}>
                  {startTimeString} - {endTimeString}
                </Text>
              )}

              <Image
                style={Styles.imageStyle}
                source={icon}
                resizeMode='contain'
              />
            </Animated.View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
