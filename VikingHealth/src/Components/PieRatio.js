import React, { Component } from 'react';
import { StyleSheet, Text } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

export class PieRatio extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <AnimatedCircularProgress
        size={63}
        width={5}
        fill={100}
        tintColor='#f8a543'
        backgroundColor='#eff5f9'
        fill={this.props.value}
        rotation={0}
        lineCap='round'
      >
        {fill => <Text style={styles.value}>{this.props.value}%</Text>}
      </AnimatedCircularProgress>
    );
  }
}

const styles = StyleSheet.create({
  value: {
    fontSize: 14,
    fontWeight: '600'
  }
});
