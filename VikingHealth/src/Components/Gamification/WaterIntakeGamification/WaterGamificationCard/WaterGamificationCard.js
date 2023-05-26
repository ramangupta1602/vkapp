import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Styles from './../../styles';
import LottieView from 'lottie-react-native';

export default class WaterGamificationCard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      gamificationModel,
      titleStyle,
      imageStyle,
      textStyle,
      subTextStyle,
      actionStyle
    } = this.props;

    const actionButtonTopMargin =
      (gamificationModel.subText.length || this.props.children) < 1 ? 100 : 75;

    return (
      <View style={[Styles.gamificationCardStyles, { width: '100%' }]}>
        {/* Title */}
        <Text style={[Styles.titleStyle, titleStyle]}>
          {gamificationModel.title}
        </Text>

        {/* Image */}
        {gamificationModel.image && (
          <Image
            style={[Styles.imageStyle, imageStyle]}
            source={gamificationModel.image}
          />
        )}

        {gamificationModel.animation && (
          <LottieView
            style={[Styles.imageStyle, imageStyle]}
            source={gamificationModel.animation}
            autoPlay
            loop={false}
          />
        )}
        {/* Gamification text heading */}
        {gamificationModel.text.length > 0 && (
          <Text numberOfLines={1} style={[Styles.textStyle, textStyle]}>
            {gamificationModel.text}
          </Text>
        )}
        {/* Gamificaiton subtext */}
        <Text style={[Styles.subTextStyle, subTextStyle]}>
          {gamificationModel.subText}
          {this.props.children}
        </Text>
        {/* Action Button */}
        <TouchableOpacity activeOpacity={0.1} onPress={this.props.onClick}>
          <Text
            style={[
              Styles.actionStyle,
              { marginTop: actionButtonTopMargin },
              actionStyle
            ]}
          >
            {gamificationModel.actionText}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
