import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import WaterGamificationCard from './WaterGamificationCard';

export class Achievement extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <WaterGamificationCard
        onClick={this.props.onClick}
        actionStyle={this.props.actionStyle}
        gamificationModel={this.props.gamificationModel}
        subTextStyle={[localStyle.subTextStyle, this.props.subTextStyle]}
        textStyle={[localStyle.textStyle, this.props.textStyle]}
        imageStyle={this.props.imageStyle}
      >
        {this.props.children}
      </WaterGamificationCard>
    );
  }
}

const localStyle = StyleSheet.create({
  subTextStyle: {
    color: '#8191A2'
  },
  textStyle: {
    fontSize: 24,
    fontFamily: 'Lato-Semibold',
    letterSpacing: 0.77,
    lineHeight: 29
  }
});
