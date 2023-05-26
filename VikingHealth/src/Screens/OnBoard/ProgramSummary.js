import React, { Component } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { R } from 'Resources';

export default class ProgramSummary extends Component {
  render() {
    return (
      <View style={styles.programSummary}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={this.props.icon} style={styles.image} />
          <Text style={styles.measurementTime}>
            {' '}
            {this.props.measurementTime}{' '}
          </Text>
        </View>
        <Text style={styles.programsType}>{this.props.text} </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  programSummary: {
    padding: 16, // reduced padding from 20 to 16 as text was not cutting on 5s
    flex: 1,
    borderRadius: 5,
    backgroundColor: R.Colors.COLOR_WHITE,
    marginTop: 20,
    shadowRadius: 1,
    shadowColor: R.Colors.COLOR_SHADOW,
    shadowOffset: { width: 0, height: 0.1 },
    shadowOpacity: 0.6,
    elevation: 1
  },

  image: {
    width: 24,
    height: 24,
    resizeMode: 'contain'
  },

  programsType: {
    fontSize: 16,
    fontFamily: 'Lato-Regular',
    marginTop: 28,
    lineHeight: 19,
    textAlign: 'left',
    color: R.Colors.COLOR_TEXT
  },

  measurementTime: {
    fontSize: 14,
    position: 'absolute',
    right: 0,
    letterSpacing: 0.16,
    lineHeight: 17,
    fontFamily: 'Lato-Regular',
    color: R.Colors.COLOR_TEXT_LIGHT
  }
});
