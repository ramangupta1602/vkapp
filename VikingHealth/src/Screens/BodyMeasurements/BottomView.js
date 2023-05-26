import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { strings } from "../../utility/locales/i18n";
import { styles } from "./BottomViewStyle";
import { HeightWeightUtil } from "Library/Utils/HeightWeightUtil";
import { R } from "Resources";
import { WheelPicker } from "react-native-wheel-picker-android";
import { inject, observer } from "mobx-react";

@inject("loginUserStore")
@observer
export class BottomView extends Component {
  constructor(props) {
    super(props);
    this.currentStep = props.step;
    this.selectedUnit = props.unit;
    this.value = props.value;

    const maxRange =
      this.selectedUnit === HeightWeightUtil.HEIGHT_IN ? 200 : 508;

    const valueArray = Array.from({ length: maxRange }, (_, index) =>
      index.toString()
    );
    this.decimalArray = this.getDecimalArray(this.selectedUnit);

    // will set the selectedvalue and selectedecimal
    this.getInitialSelectedPosition(this.value);
    this.value = this.getFinalValue(this.selectedValue, this.selectedDecimal); // because after unit conversion
    // we are showing 0th index on decimal place if item not found, so we have to set
    // value accordingly..

    this.header = this.headerText(props.step);
    this.state = {
      value: this.value,
      valueArray,
      decimalArray: this.decimalArray,
      selectedValue: this.selectedValue,
      selectedDecimal: this.selectedDecimal,
    };
  }

  componentDidUpdate(oldProps) {
    if (this.props !== oldProps) {
      this.header = this.headerText(this.props.step);

      let value = this.props.value;

      // will set the selectedvalue and selectedecimal
      this.getInitialSelectedPosition(value);
      value = this.getFinalValue(this.selectedValue, this.selectedDecimal);

      this.setState({
        value,
        selectedValue: this.selectedValue,
        selectedDecimal: this.selectedDecimal,
      });
    }
  }

  getDecimalArray = (selectedUnit) => {
    if (selectedUnit === HeightWeightUtil.HEIGHT_IN) {
      return ["00", "25", "50", "75"];
    } else {
      return ["00", "50"];
    }
  };

  getInitialSelectedPosition = (value) => {
    const valueArray = value.toString().split(".");
    this.selectedValue = valueArray[0] || 0;
    this.selectedDecimal = (valueArray[1] || 0).toString().padEnd(2, 0);

    const indexOfDecimal = this.decimalArray.indexOf(this.selectedDecimal);

    if (indexOfDecimal === -1) {
      this.selectedDecimal = this.decimalArray[0];
    }
  };

  nextButtonPresed() {
    if (typeof this.props.onNextClick === "function") {
      this.props.onNextClick(this.state.value);
    }
  }

  previousButtonPressed() {
    if (typeof this.props.onPreviousClick === "function") {
      this.props.onPreviousClick(this.state.value);
    }
  }

  getFinalValue = (selectedValue, selectedDecimal) => {
    const value = `${selectedValue}.${selectedDecimal}`;
    return value;
  };

  headerText(index) {
    switch (index) {
      case 1:
        return strings("body_measurement.neck_measurement");
      case 2:
        return strings("body_measurement.shoulder_measurement");
      case 3:
        return strings("body_measurement.chest_measurement");
      case 4:
        return strings("body_measurement.arms_measurement");
      case 5:
        return strings("body_measurement.waist_measurement");
      case 6:
        return strings("body_measurement.hips_measurement");
      case 7:
        return strings("body_measurement.thigh_measurement");
      case 8:
        return strings("body_measurement.calf_measurement");
      default:
        return strings("body_measurement.neck_measurement");
    }
  }

  render() {
    let decimalIndex = this.state.decimalArray.indexOf(
      this.state.selectedDecimal
    );

    if (decimalIndex < 0) {
      // incase we don't found the value, the just select 0th element
      decimalIndex = 0;
    }

    return (
      <View style={styles.bottomView}>
        <Text style={styles.bottomViewTitle}>{this.header}</Text>

        <View style={styles.wheelContainerStyle}>
          <View
            style={styles.wheelStyle}
            testID="valeList"
            accessibilityLabel="valeList"
          >
            <WheelPicker
              key={`${this.state.selectedValue}`}
              data={this.state.valueArray}
              selectedItem={parseInt(this.state.selectedValue, 10) || 0}
              itemTextColor="#292929"
              initPosition={parseInt(this.state.selectedValue, 10) || 0}
              // itemTextSize={24}
              onItemSelected={(index) => {
                const value = this.state.valueArray[index];
                const decimalValue = this.state.selectedDecimal;
                const finalValue = this.getFinalValue(value, decimalValue);

                this.setState({
                  selectedValue: value,
                  value: finalValue,
                });
              }}
            />
          </View>

          <Text style={styles.dotSeparatorStyle}>.</Text>

          <View
            style={styles.wheelStyle}
            testID="decimalList"
            accessibilityLabel="decimalList"
          >
            <WheelPicker
              key={`${this.state.selectedValue}`}
              data={this.state.decimalArray}
              selectedItem={decimalIndex}
              itemTextColor="#292929"
              initPosition={decimalIndex}
              onItemSelected={(index) => {
                const value = this.state.selectedValue;
                const decimalValue = this.state.decimalArray[index];
                const finalValue = this.getFinalValue(value, decimalValue);

                this.setState({
                  selectedDecimal: decimalValue,
                  value: finalValue,
                });
              }}
            />
          </View>

          <Text style={styles.textUnitStyle}>
            {HeightWeightUtil.heightUnit(this.selectedUnit)}
          </Text>
        </View>

        <View style={styles.buttonContainerStyle}>
          <TouchableOpacity
            style={[styles.buttonStyle, styles.previousButton]}
            onPress={this.previousButtonPressed.bind(this)}
          >
            <Text style={styles.buttonTextPreviousStyle}>
              {" "}
              {strings("common_message.previous_text").toUpperCase()}{" "}
            </Text>
          </TouchableOpacity>

          <View style={{ flex: 0.1 }} />

          <TouchableOpacity
            style={[styles.buttonStyle, styles.nextButton]}
            onPress={this.nextButtonPresed.bind(this)}
          >
            <Text style={styles.buttonTextStyle}>
              {" "}
              {strings("common_message.next_text").toUpperCase()}{" "}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
