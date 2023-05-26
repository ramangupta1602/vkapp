import React, { Component } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { R } from 'Resources';

export default class TypesOfProgram extends Component {
  render() {
    return (
      <View>
        <View style={{ flexDirection: 'row', marginTop: 10, flex: 1 }}>
          <Image source={R.Images.checkMark} style={styles.imageRight} />
          <Text style={styles.programsType}>{this.props.text}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  imageRight: {
    width: 20,
    height: 20,
    resizeMode: 'contain'
  },
  programsType: {
    fontSize: 14,
    fontFamily: 'Lato-Regular',
    lineHeight: 17,
    marginLeft: 14,
    flex: 1,
    color: R.Colors.COLOR_TEXT
  }
});
