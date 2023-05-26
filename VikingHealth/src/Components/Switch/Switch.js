import React, { Component } from 'react';
import { Text, View, Animated, TouchableOpacity } from 'react-native';
import Styles from './styles';

export class Switch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedIndex: 0,
      animated: new Animated.Value(0),
    };
  }

  getPointerTransitionStyle = () => {
    const { animated } = this.state;

    const interpolation = animated.interpolate({
      inputRange: [0, 1],
      outputRange: [3, 12],
    });

    return {
      transform: [{ translateX: interpolation }],
    };
  };

  onSwitchChange = (selectedIndex) => {
    this.setState({ selectedIndex });
    this.animateToValue(selectedIndex);

    if (this.props.onSwitchChange) {
      this.props.onSwitchChange(selectedIndex);
    }
  };

  toggleSwitch = () => {
    const { selectedIndex } = this.state;
    const finalValue = selectedIndex === 0 ? 1 : 0;

    this.setState({ selectedIndex: finalValue });

    this.animateToValue(finalValue);
    if (this.props.onSwitchChange) {
      this.props.onSwitchChange(finalValue);
    }
  };

  animateToValue = (toValue) => {
    const { animated } = this.state;

    Animated.timing(animated, {
      toValue,
      duration: 400,
    }).start();
  };

  render() {
    const { selectedIndex } = this.state;
    const { firstOption, secondOption } = this.props;
    const transition = this.getPointerTransitionStyle();

    return (
      <View style={Styles.containerStyle}>
        <TouchableOpacity
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 5 }}
          onPress={() => {
            this.onSwitchChange(0);
          }}
        >
          <Text
            style={[
              Styles.textStyle,
              { color: selectedIndex === 0 ? '#D0444C' : '#8191A2' },
            ]}
          >
            {firstOption}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={Styles.trackStyle}
          hitSlop={{ top: 10, bottom: 10 }}
          onPress={() => {
            this.toggleSwitch();
          }}
        >
          <Animated.View style={[Styles.pointerStyle, transition]} />
        </TouchableOpacity>

        <TouchableOpacity
          hitSlop={{ top: 10, bottom: 10, left: 5, right: 10 }}
          onPress={() => {
            this.onSwitchChange(1);
          }}
        >
          <Text
            style={[
              Styles.textStyle,
              { color: selectedIndex === 1 ? '#D0444C' : '#8191A2' },
            ]}
          >
            {secondOption}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
