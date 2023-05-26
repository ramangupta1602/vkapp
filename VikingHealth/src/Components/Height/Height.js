import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { strings } from '../../utility/locales/i18n';
import { R } from 'Resources';
import { UnitSelection } from 'Components';
import { HeightWeightUtil } from 'Library/Utils/HeightWeightUtil';

const CENTIMETRE = 2.54; // 1 inches = 2.54 CENTIMETRE
export class Height extends Component {
  constructor(props) {
    super(props);
    if (this.props.height && this.props.height !== '') {
      const result = this.props.height.toString().split('.');
      if (result.length > 1) {
        this.state = {
          heightUnit: props.heightUnit,
          valueBeforeDecimal: parseInt(result[0]),
          valueAfterDecimal: this.getTwoDigitAfterDecimal(parseInt(result[1]))
        };
      } else {
        this.state = {
          heightUnit: props.heightUnit,
          valueBeforeDecimal: parseInt(result[0]),
          valueAfterDecimal: 0
        };
      }
    } else {
      this.state = {
        heightUnit: HeightWeightUtil.HEIGHT_CM,
        valueBeforeDecimal: this.props.valueBeforeDecimal,
        valueAfterDecimal: this.props.valueAfterDecimal
      };
    }
  }

  getTwoDigitAfterDecimal(value) {
    if (value / 10 < 1) {
      return value * 10;
    }
    return value;
  }

  onCancelClicked() {
    if (this.props.onCancelClicked) {
      this.props.onCancelClicked();
    }
  }

  onSaveClicked() {
    if (this.props.onSaveClicked) {
      let value =
        this.state.valueBeforeDecimal + this.state.valueAfterDecimal / 100;
      this.props.onSaveClicked(value, this.state.heightUnit);
    }
  }

  onPlusClicked() {
    if (this.state.heightUnit === HeightWeightUtil.HEIGHT_CM) {
      let value =
        this.state.valueBeforeDecimal + this.state.valueAfterDecimal / 100;
      value += CENTIMETRE;
      value = value.toFixed(2);
      value = value.toString();
      const result = value.split('.');
      this.setState({
        valueBeforeDecimal: parseInt(result[0]),
        valueAfterDecimal: parseInt(result[1])
      });
    } else {
      this.setState({ valueBeforeDecimal: this.state.valueBeforeDecimal + 1 });
      this.setState({ valueAfterDecimal: 0 });
      return;
    }
  }

  onMinusClicked() {
    if (this.state.heightUnit === HeightWeightUtil.HEIGHT_CM) {
      let value =
        this.state.valueBeforeDecimal + this.state.valueAfterDecimal / 100;
      value -= CENTIMETRE;
      value = value.toFixed(2);
      value = value.toString();
      const result = value.split('.');
      this.setState({
        valueBeforeDecimal: parseInt(result[0]),
        valueAfterDecimal: parseInt(result[1])
      });
    } else {
      this.setState({ valueBeforeDecimal: this.state.valueBeforeDecimal - 1 });
      this.setState({ valueAfterDecimal: 0 });
    }
  }

  whenInchesPressed() {
    let value =
      this.state.valueBeforeDecimal + this.state.valueAfterDecimal / 100;
    value /= CENTIMETRE;
    value = value.toFixed(2);
    value = value.toString();
    const result = value.split('.');
    this.setState({
      heightUnit: HeightWeightUtil.HEIGHT_IN,
      valueBeforeDecimal: parseInt(result[0]),
      valueAfterDecimal: parseInt(result[1])
    });
  }

  whenCentimeterPressed() {
    let value =
      this.state.valueBeforeDecimal + this.state.valueAfterDecimal / 100;
    value *= CENTIMETRE;
    value = value.toFixed(2);
    value = value.toString();
    const result = value.split('.');
    this.setState({
      heightUnit: HeightWeightUtil.HEIGHT_CM,
      valueBeforeDecimal: parseInt(result[0]),
      valueAfterDecimal: parseInt(result[1])
    });
  }

  setValueBeforeDecimal() {
    this.setState({ valueBeforeDecimal: this.props.valueBeforeDecimal });
  }

  setValueAfterDecimal() {
    this.setState({ valueAfterDecimal: this.props.valueAfterDecimal });
  }

  renderTextAfterDecimal() {
    let value = this.state.valueAfterDecimal;
    if (value < 10) {
      value = `0${value}`;
    }
    return <Text style={styles.highLightedTextStyle}>{value}</Text>;
  }

  renderTextBeforeDecimal() {
    return (
      <Text style={styles.highLightedTextStyle}>
        {this.state.valueBeforeDecimal}
      </Text>
    );
  }

  renderUnit() {
    const heightUnitValue = HeightWeightUtil.heightUnit(this.state.heightUnit);
    return <Text style={styles.textUnitStyle}>{heightUnitValue}</Text>;
  }

  renderPlusButton() {
    return (
      <TouchableOpacity
        onPress={() => {
          this.onPlusClicked();
        }}
      >
        <Image source={{ uri: 'plus' }} style={styles.imagePlus} />
      </TouchableOpacity>
    );
  }

  renderMinusButton() {
    return (
      <TouchableOpacity
        onPress={() => {
          this.onMinusClicked();
        }}
      >
        <Image source={{ uri: 'minus' }} style={styles.imageMinus} />
      </TouchableOpacity>
    );
  }

  renderUnitSelection() {
    return (
      <UnitSelection
        isFirstTabSelected={
          this.state.heightUnit === HeightWeightUtil.HEIGHT_IN
        }
        onFirstTabClicked={() => {
          this.whenInchesPressed();
        }}
        onSecondTabClicked={() => {
          this.whenCentimeterPressed();
        }}
        firstTab={strings('common_message.in').toUpperCase()}
        secondTab={strings('common_message.cm').toUpperCase()}
      />
    );
  }

  render() {
    return (
      <View style={styles.bottomView}>
        <Text style={styles.bottomViewTitle}> {strings('signup.height')}</Text>
        <View style={styles.bottomValuesStyles}>
          <View>{this.renderMinusButton()}</View>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-around' }}
          >
            {this.renderTextBeforeDecimal()}
            <Text style={styles.textStyleNormal}>.</Text>
            {this.renderTextAfterDecimal()}
            {this.renderUnit()}
          </View>
          <View>{this.renderPlusButton()}</View>
        </View>

        <View style={{ marginTop: 20, marginBottom: 24, alignSelf: 'center' }}>
          {this.renderUnitSelection()}
        </View>

        <View style={styles.buttonContainerStyle}>
          <TouchableOpacity
            style={styles.buttonCancelStyle}
            onPress={() => {
              this.onCancelClicked();
            }}
          >
            <Text style={styles.buttonTextPreviousStyle}>
              {' '}
              {strings('common_message.cancel_text').toUpperCase()}{' '}
            </Text>
          </TouchableOpacity>

          <View style={{ flex: 0.2 }} />

          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={() => {
              this.onSaveClicked();
            }}
          >
            <Text style={styles.buttonTextStyle}>
              {' '}
              {strings('common_message.save_text').toUpperCase()}{' '}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export const styles = StyleSheet.create({
  bottomView: {
    width: '100%',
    position: 'absolute',
    height: 250,
    backgroundColor: R.Colors.COLOR_WHITE,
    bottom: 0
  },
  bottomViewTitle: {
    color: R.Colors.COLOR_TITLE,
    fontSize: 16,
    fontWeight: '600',
    alignSelf: 'center',
    paddingTop: 24
  },
  bottomValuesStyles: {
    width: '80%',
    alignSelf: 'center',
    marginTop: 24,
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  imageMinus: {
    height: 30,
    width: 30,
    resizeMode: 'contain'
  },
  imagePlus: {
    height: 30,
    width: 30,
    resizeMode: 'contain'
  },
  textStyleNormal: {
    letterSpacing: 1,
    color: R.Colors.COLOR_TEXT_NUMBER,
    fontFamily: 'Lato-Regular',
    fontSize: 30,
    marginRight: 5,
    lineHeight: 36
  },
  highLightedTextStyle: {
    letterSpacing: 1.33,
    color: R.Colors.COLOR_TEXT_NUMBER,
    fontFamily: 'Lato-Regular',
    fontSize: 40,
    marginRight: 5,
    lineHeight: 40
  },

  textUnitStyle: {
    letterSpacing: 1.33,
    color: R.Colors.COLOR_TEXT_NUMBER,
    fontFamily: 'Lato-Regular',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 44
  },
  buttonStyle: {
    height: 50,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: R.Colors.COLOR_BUTTON
  },
  buttonCancelStyle: {
    height: 50,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: R.Colors.COLOR_BUTTON,
    backgroundColor: R.Colors.COLOR_WHITE
  },
  buttonContainerStyle: {
    flex: 1,
    width: '85%',
    height: 50,
    borderRadius: 5,
    flexDirection: 'row',
    backgroundColor: R.Colors.COLOR_WHITE,
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center'
  },
  buttonTextStyle: {
    color: R.Colors.COLOR_WHITE,
    fontSize: 14,
    fontWeight: 'bold'
  },
  buttonTextPreviousStyle: {
    color: R.Colors.COLOR_BUTTON,
    fontSize: 14,
    fontWeight: 'bold'
  }
});
