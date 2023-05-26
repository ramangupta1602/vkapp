import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { R } from 'Resources';
import AppUtil from 'Library/Utils/AppUtil';

export class OnboardingCompleteModal extends Component {
  gotoDashboard() {
    this.props.navigation.dispatch(AppUtil.resetAction('Dashboard', {}));
  }

  render() {
    return (
      <View style={styles.background}>
        <View style={styles.boxContainer}>
          <View style={styles.headerContainer}>
            <Image
              source={R.Images.trophy}
              style={{ height: 55, width: 47, resizeMode: 'contain' }}
            />
            <Text style={styles.heading}>Great Work!</Text>
          </View>

          <View style={styles.contentContainer}>
            <Text style={styles.subHeading}>Just Remember</Text>
            <View style={styles.itemContainer}>
              <Image source={R.Images.tick} style={styles.image} />
              <Text style={{ flex: 3 }}>
                Log your body weight and day's performance
                <Text style={{ fontWeight: '600' }}> daily</Text>
              </Text>
            </View>
            <View style={styles.itemContainer}>
              <Image source={R.Images.tick} style={styles.image} />
              <Text style={{ flex: 3 }}>
                Log your body measurements
                <Text style={{ fontWeight: '600' }}> once a week</Text>
              </Text>
            </View>
          </View>

          <View style={styles.line} />

          <TouchableOpacity style={styles.button} onPress={this.props.onDone}>
            <Text style={styles.buttonText}>DONE</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    flex: 1,
    justifyContent: 'center'
  },

  boxContainer: {
    borderRadius: 5,
    shadowColor: R.Colors.COLOR_SHADOW,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1.0,
    shadowRadius: 8,
    backgroundColor: 'white',
    marginLeft: '8%',
    marginRight: '8%'
  },

  headerContainer: {
    backgroundColor: '#00467d',
    height: 140,
    flexDirection: 'row',
    padding: 30,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5
  },

  heading: {
    color: 'white',
    fontSize: 22,
    fontFamily: 'Lato-Regular'
  },

  contentContainer: {
    padding: 24,
    paddingLeft: 60,
    paddingRight: 60
  },

  subHeading: {
    fontFamily: 'Lato-Regular',
    fontSize: 16,
    fontWeight: '600',
    margin: 16,
    marginLeft: 0
  },

  itemContainer: {
    flexDirection: 'row',
    marginTop: 7,
    marginBottom: 7,
    alignItems: 'flex-start'
  },

  image: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
    marginRight: 10,
    marginTop: 5
  },

  line: {
    height: 1,
    backgroundColor: '#e7e7e7'
  },

  button: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center'
  },

  buttonText: {
    color: '#d23341',
    fontSize: 14,
    fontFamily: 'Lato-Regular',
    fontWeight: '600'
  }
});
