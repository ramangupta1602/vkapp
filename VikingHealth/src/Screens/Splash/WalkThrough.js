import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { Component } from 'react';
// import {
//     IndicatorViewPager,
//     PagerDotIndicator
//  } from 'rn-viewpager';
import { strings } from '../../utility/locales/i18n';
import { styles } from './Styles';
import AppUtil from 'Library/Utils/AppUtil';
import { R } from 'Resources';
import AppIntroSlider from 'react-native-app-intro-slider';

const SliderData = [
  { pageNumber: 1 },
  { pageNumber: 2 },
  { pageNumber: 3 }
];

export class WalkThrough extends Component {
  static navigationOptions = {
    header: null
  };

  gotoWalkThrough() {
    this.props.navigation.dispatch(AppUtil.resetAction('Login', {}));
  }

  // renderDotIndicator() {
  //   return <PagerDotIndicator pageCount={3} />;
  // }

  _renderItem({ item }) {
    if (item.pageNumber === 1) {
      return <View style={{ flex: 1 }}>
      <Image source={R.Images.screen1} style={styles.image} />
      <Text style={styles.walkThroughContainerText}>
        <Text style={styles.walkThroughText}>Be the </Text>
        <Text style={[styles.walkThroughText, { fontWeight: 'bold' }]}>
          best version
        </Text>
        <Text style={styles.walkThroughText}>{' of you'}</Text>
      </Text></View>;
    }
    if (item.pageNumber === 2) {
      return <View style={{ flex: 1 }}>
        <Image source={R.Images.screen2} style={styles.image} />
            <Text style={styles.walkThroughContainerText}>
              <Text style={styles.walkThroughText}>Your Journey to </Text>
              <Text style={[styles.walkThroughText, { fontWeight: 'bold' }]}>
                wellness
              </Text>
              <Text style={styles.walkThroughText}> is here</Text>
            </Text>
      </View>;
    }
    if (item.pageNumber === 3) {
      return <View style={{ flex: 1 }}>
        <Image source={R.Images.screen4} style={styles.image} />
            <Text
              style={[
                styles.walkThroughContainerText,
                { marginLeft: 30, marginRight: 30 }
              ]}
            >
              <Text style={styles.walkThroughText}>Are you ready to </Text>
              <Text style={[styles.walkThroughText, { fontWeight: 'bold' }]}>
                REBOOT?
              </Text>
            </Text>
      </View>
    }
     
  }

  render() {
    return (
      <View style={styles.walkThroughcontainer}>
        {/* <IndicatorViewPager
          indicator={this.renderDotIndicator()}
          style={{ flex: 1 }}
        > */}
        {/* <View style={{ flex: 1 }}>
          <View>
            <Image source={R.Images.screen1} style={styles.image} />
            <Text style={styles.walkThroughContainerText}>
              <Text style={styles.walkThroughText}>Be the </Text>
              <Text style={[styles.walkThroughText, { fontWeight: 'bold' }]}>
                best version
              </Text>
              <Text style={styles.walkThroughText}>{' of you'}</Text>
            </Text>
          </View>
          <View>
            <Image source={R.Images.screen2} style={styles.image} />
            <Text style={styles.walkThroughContainerText}>
              <Text style={styles.walkThroughText}>Your Journey to </Text>
              <Text style={[styles.walkThroughText, { fontWeight: 'bold' }]}>
                wellness
              </Text>
              <Text style={styles.walkThroughText}> is here</Text>
            </Text>
          </View>
          <View>
            <Image source={R.Images.screen4} style={styles.image} />
            <Text
              style={[
                styles.walkThroughContainerText,
                { marginLeft: 30, marginRight: 30 }
              ]}
            >
              <Text style={styles.walkThroughText}>Are you ready to </Text>
              <Text style={[styles.walkThroughText, { fontWeight: 'bold' }]}>
                REBOOT?
              </Text>
            </Text>
          </View>
          </View> */}
        {/* </IndicatorViewPager> */}

        <AppIntroSlider
        renderItem={this._renderItem}
        data={SliderData}
        dotStyle={styles.dotStyle}
        activeDotStyle={styles.activeDotStyle}
        bottomButton={true}
        renderNextButton={() => {return null}}
        renderDoneButton={() => {return null}}
        // renderDoneButton={renderDoneButton}
      />

        <View
          style={{
            position: 'absolute',
            bottom: 0,
            marginBottom: 35,
            width: '100%'
          }}
        >
          <TouchableOpacity
            style={styles.bottomView}
            onPress={() => this.gotoWalkThrough()}
          >
            <Text style={styles.textStyle}>
              {' '}
              {strings('walk_through.join_the_program')}{' '}
            </Text>
            <Image source={R.Images.arrow} style={styles.imageArrow} />
          </TouchableOpacity>
        </View>
        
      </View>
    );
  }
}
