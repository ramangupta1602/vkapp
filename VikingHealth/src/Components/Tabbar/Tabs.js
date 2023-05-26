import React, { Component } from 'react';
import { Text, TouchableOpacity, Image, Animated, View } from 'react-native';
import Styles from './Styles';

export default class Tabs extends Component {
  constructor(props) {
    super(props);

    const initialAnimatingValue = props.isActive ? 1 : 0;

    this.state = {
      animated: new Animated.Value(initialAnimatingValue),
    };
  }

  animate = (toValue) => {
    Animated.timing(this.state.animated, {
      toValue,
      duration: 300,
    }).start();
  };

  componentDidUpdate(prevProps) {
    if (this.props.isActive !== prevProps.isActive) {
      if (this.props.isActive) {
        this.animate(1);
      } else {
        this.animate(0);
      }
    }
  }

  getContainerAnimatingStyle = () => {
    return {
      // flex: 1,
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
    };
  };

  render() {
    const {
      title,
      onPress,
      activeImage,
      inactiveImage,
      isActive,
      imageStyle,
    } = this.props;
    const textColor =
      this.props.textColor ??
      (isActive ? 'rgba(208,68,76,1)' : 'rgba(129,145,162,1)');

    const containerAnimatingStyle = this.getContainerAnimatingStyle();

    return (
      <Animated.View style={containerAnimatingStyle}>
        <TouchableOpacity
          activeOpacity={1}
          style={Styles.tabStyle}
          onPress={onPress}
        >
          <Animated.Image
            source={isActive ? activeImage : inactiveImage}
            resizeMode='contain'
            style={imageStyle}
          />
          <Text
            numberOfLines={1}
            style={[Styles.tabTextStyle, { color: textColor }]}
          >
            {title}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }
}
