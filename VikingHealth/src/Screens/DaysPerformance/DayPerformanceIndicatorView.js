import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { R } from 'Resources';

export default class DayPerformanceIndicatorView extends Component {
  constructor(props) {
    super(props);
    this.state = { mood: props.mood };
  }

  componentWillReceiveProps(props) {
    this.setState({ mood: props.mood });
  }

  returnView() {
    switch (this.state.mood) {
      case 1:
        return <BadView />;
      case 2:
        return <PoorView />;
      case 3:
        return <OkView />;
      case 4:
        return <GoodView />;
      case 5:
        return <ExcellentView />;
      default:
        return <OkView />;
    }
  }

  render() {
    return <View style={styles.viewTopStyle}>{this.returnView()}</View>;
  }
}

const ImageText = props => {
  return (
    <View style={{ marginTop: 12, flexDirection: 'row' }}>
      <Image source={props.icon} style={styles.imageStyle} />
      <Text style={styles.textDescriptionStyle}>{props.text}</Text>
    </View>
  );
};

const HeaderText = () => {
  return (
    <Text style={styles.headerTextStyle}>Your performance indicate that,</Text>
  );
};

const PoorView = () => {
  return (
    <View>
      <HeaderText />
      <ImageText
        icon={R.Images.greenCircleIcon}
        text={'You have taken the drops on time'}
      />
      <ImageText
        icon={R.Images.minusCircle}
        text={
          'Had food outside recommended food group. Such as processed carbohydrates and sugar.'
        }
      />
    </View>
  );
};

const BadView = () => {
  return (
    <View>
      <HeaderText />
      <ImageText
        icon={R.Images.minusCircle}
        text={'You have gone longer than 8 hours without taking the drops'}
      />
    </View>
  );
};
const OkView = () => {
  return (
    <View>
      <HeaderText />
      <ImageText
        icon={R.Images.greenCircleIcon}
        text={'You have taken the drops on time'}
      />
      <ImageText
        icon={R.Images.minusCircle}
        text={'Had a little more of the recommended food groups and, '}
      />
      <ImageText
        icon={R.Images.minusCircle}
        text={'Had less than 80 ounces of water.'}
      />
    </View>
  );
};

const GoodView = () => {
  return (
    <View>
      <HeaderText />
      <ImageText
        icon={R.Images.greenCircleIcon}
        text={'You have taken the drops on time'}
      />
      <ImageText
        icon={R.Images.minusCircle}
        text={
          'Have had a little more of the recommended food groups OR,\nHad less than 80 ounces of water. '
        }
      />
    </View>
  );
};
const ExcellentView = () => {
  return (
    <View>
      <HeaderText />
      <ImageText
        icon={R.Images.greenCircleIcon}
        text={'You have taken the drops on time'}
      />
      <ImageText
        icon={R.Images.greenCircleIcon}
        text={'Have not eaten any food outside the requirements of the diet'}
      />
      <ImageText
        icon={R.Images.greenCircleIcon}
        text={'Had 80 ounces of water.'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  viewTopStyle: {
    borderColor: R.Colors.COLOR_LINE,
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 28,
    paddingRight: 28,
    paddingTop: 22,
    paddingBottom: 22,
    justifyContent: 'center',
    alignItems: 'center',
    width: 295
  },
  textStyle: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.13,
    lineHeight: 19,
    textAlign: 'center',
    fontFamily: 'Lato-Regular',
    color: R.Colors.COLOR_TEXT_LIGHT
  },
  headerTextStyle: {
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 0.13,
    lineHeight: 19,
    fontFamily: 'Lato-Regular',
    color: R.Colors.COLOR_TEXT_LIGHT
  },
  textDescriptionStyle: {
    fontSize: 12,
    letterSpacing: 0.13,
    lineHeight: 15,
    marginLeft: 6,
    fontFamily: 'Lato-Regular',
    color: R.Colors.COLOR_TEXT_LIGHT
  },
  imageStyle: {
    height: 12,
    width: 12,
    marginTop: 2,
    resizeMode: 'contain'
  }
});
