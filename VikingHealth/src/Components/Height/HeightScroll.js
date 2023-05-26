import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { strings } from "../../utility/locales/i18n";
import { R } from "Resources";
import { UnitSelection } from "Components";
import { HeightWeightUtil } from "Library/Utils/HeightWeightUtil";
import { HeightPicker } from "./HeightPicker";
import { CTAButton } from "../index";

export class HeightScroll extends Component {
  constructor(props) {
    super(props);

    if (props.height && props.height !== "") {
      this.state = this.parseHeightAccordingToUnit(
        props.height,
        props.heightUnit
      );
    } else {
      this.state = {
        valueOfFirstFlatList: 5,
        valueOfSecondFlatList: 5,
        heightUnit: HeightWeightUtil.HEIGHT_IN,
        separator: "_"
      };
    }
  }

  parseHeightAccordingToUnit = (height, heightUnit) => {
    if (heightUnit === HeightWeightUtil.HEIGHT_IN) {
      const feet = Math.floor(height / 12);
      const inch = height % 12;

      return {
        valueOfFirstFlatList: feet,
        valueOfSecondFlatList: inch,
        indexOfFirstFlatList: 0,
        indexOfSecondFlatList: 0,
        heightUnit,
        separator: "_"
      };
    }

    const result = height
      .toFixed(1)
      .toString()
      .split(".");

    if (result.length > 1) {
      return {
        valueOfFirstFlatList: result[0],
        valueOfSecondFlatList: result[1],
        heightUnit,
        separator: "."
      };
    }

    return {
      valueOfFirstFlatList: result[0],
      valueOfSecondFlatList: 1,
      heightUnit,
      separator: "."
    };
  };

  onCancelClicked() {
    if (this.props.onCancelClicked) {
      this.props.onCancelClicked();
    }
  }

  parseHeightToUnit = unit => {
    const valueBeforeDecimal = parseFloat(this.state.valueOfFirstFlatList);
    const valueAfterDecimal = parseFloat(this.state.valueOfSecondFlatList);

    let height;
    if (unit === HeightWeightUtil.HEIGHT_IN) {
      height = valueBeforeDecimal * 12 + valueAfterDecimal;
    } else {
      height = parseFloat(`${valueBeforeDecimal}.${valueAfterDecimal}`);
    }

    return height;
  };

  onSaveClicked() {
    const height = this.parseHeightToUnit(this.state.heightUnit);
    if (typeof this.props.onSaveClicked === "function") {
      this.props.onSaveClicked(height, this.state.heightUnit);
    }
  }

  whenInchesPressed() {
    if (this.state.heightUnit === HeightWeightUtil.HEIGHT_IN) {
      return;
    }

    const height = this.parseHeightToUnit(HeightWeightUtil.HEIGHT_CM);
    const convertedHeight = HeightWeightUtil.inchValue(height);
    const {
      valueOfFirstFlatList,
      valueOfSecondFlatList
    } = this.parseHeightAccordingToUnit(
      convertedHeight,
      HeightWeightUtil.HEIGHT_IN
    );

    this.setState({
      separator: "_",
      heightUnit: HeightWeightUtil.HEIGHT_IN,
      valueOfFirstFlatList,
      valueOfSecondFlatList
    });
  }

  whenCentimeterPressed() {
    if (this.state.heightUnit === HeightWeightUtil.HEIGHT_CM) {
      return;
    }

    const height = this.parseHeightToUnit(HeightWeightUtil.HEIGHT_IN);
    const convertedHeight = HeightWeightUtil.cmValue(height);
    const {
      valueOfFirstFlatList,
      valueOfSecondFlatList
    } = this.parseHeightAccordingToUnit(
      convertedHeight,
      HeightWeightUtil.HEIGHT_CM
    );

    this.setState({
      separator: ".",
      heightUnit: HeightWeightUtil.HEIGHT_CM,
      valueOfFirstFlatList,
      valueOfSecondFlatList
    });
  }

  renderUnit() {
    const heightUnitValue = HeightWeightUtil.heightUnit(this.state.heightUnit);
    return <Text style={styles.textUnitStyle}>{heightUnitValue}</Text>;
  }

  renderUnitSelection() {
    return (
      <UnitSelection
        isFirstTabSelected={
          this.state.heightUnit === HeightWeightUtil.HEIGHT_IN
        }
        tabSelectionChanged={index => {
          if (index == 0) {
            this.whenInchesPressed();
          } else {
            this.whenCentimeterPressed();
          }
        }}
        firstTab={strings("common_message.ft").toUpperCase()}
        secondTab={strings("common_message.cm").toUpperCase()}
      />
    );
  }

  getDataForFirstFlatList() {
    let unit = "";
    let maxValue = 334; // equivalent to 11 feet.

    if (this.state.heightUnit === HeightWeightUtil.HEIGHT_IN) {
      unit = " " + strings("common_message.ft");
      maxValue = 10;
    }

    const data = [];
    const dataWithoutUnit = [];

    for (let i = 0; i <= maxValue; i++) {
      data.push(i + unit);
      dataWithoutUnit.push(i);
    }

    return { data, dataWithoutUnit };
  }

  getDataForSecondFlatList() {
    let count = 10;
    let unit = "";
    let interval = 1;

    const data = [];
    const dataWithoutUnit = [];

    if (this.state.heightUnit === HeightWeightUtil.HEIGHT_IN) {
      interval = 0.5;
      count = 24;
      unit = "in";
    }

    for (let i = 0; i < count; ++i) {
      const value = i * interval;
      data.push(`${value} ${unit}`);
      dataWithoutUnit.push(value);
    }

    return { data, dataWithoutUnit };
  }

  renderFirstFlatList() {
    const { data, dataWithoutUnit } = this.getDataForFirstFlatList();
    const { valueOfFirstFlatList } = this.state;
    const selectedIndex = dataWithoutUnit.indexOf(
      parseInt(valueOfFirstFlatList, 10)
    );

    return (
      <HeightPicker
        defaultValue={selectedIndex}
        onValueUpdated={value => this.setState({ valueOfFirstFlatList: value })}
        data={data}
      />
    );
  }

  /**
   * Rounding algorithm..
   *
   * value = 9.6 and inch scale
   * decimalValue = 9.6*10 = 96
   * divide by 5 (scale is in multiple of 5) = 19.2
   * convert divided value in int = 19
   * Now multiply back with 5 = 19 * 5 = 95
   * Divide with 10 = 9.5
   *
   * variable name don't make sense, please refer to steps.. (run out of logical names)
   */
  roundAccordingToInchScale = value => {
    const parsedValue = parseFloat(value);
    const decimalValue = parsedValue * 10;
    const nearestInt = parseInt(decimalValue / 5, 10);
    const nearestDecimal = nearestInt * 5;
    const roundedValue = nearestDecimal / 10;
    return roundedValue;
  };

  renderSecondFlatList() {
    const { data, dataWithoutUnit } = this.getDataForSecondFlatList();
    const { valueOfSecondFlatList } = this.state;
    let selectedIndex = -1;

    // In case of inches, we have float values in second scale,therefore we have to use
    // parseFloat,
    if (this.state.heightUnit === HeightWeightUtil.HEIGHT_IN) {
      const roundedSelectedValue = this.roundAccordingToInchScale(
        valueOfSecondFlatList
      );

      selectedIndex = dataWithoutUnit.indexOf(parseFloat(roundedSelectedValue));

      if (valueOfSecondFlatList !== roundedSelectedValue) {
        this.setState({ valueOfSecondFlatList: roundedSelectedValue });
      }
    } else {
      // in case of cm , values are simple integer (1,2,3), so we have to parse it accordingly
      selectedIndex = dataWithoutUnit.indexOf(
        parseInt(valueOfSecondFlatList, 10)
      );
    }

    return (
      <HeightPicker
        defaultValue={selectedIndex}
        onValueUpdated={value => {
          this.setState({ valueOfSecondFlatList: value });
        }}
        data={data}
      />
    );
  }

  render() {
    return (
      <View style={styles.bottomView}>
        <Text style={styles.bottomViewTitle}> {strings("signup.height")}</Text>

        <View style={{ marginVertical: 24, alignSelf: "center" }}>
          {this.renderUnitSelection()}
        </View>

        <View style={[styles.bottomValuesStyles]}>
          {this.renderFirstFlatList()}

          <Text
            style={{
              marginLeft: 20,
              marginRight: 20,
              borderRadius: 2,
              height: 2,
              width: this.state.separator === "." ? 3 : 10,
              backgroundColor: "black"
            }}
          />
          {this.renderSecondFlatList()}
        </View>

        <View style={styles.buttonContainerStyle}>
          <CTAButton
            style={{
              flex: 1,
              backgroundColor: "white",
              borderColor: "#CE363E"
            }}
            label={strings("common_message.cancel_text").toUpperCase()}
            isEnabled
            onClick={this.onCancelClicked.bind(this)}
            textColor="#CE363E"
          />
          <View style={{ width: 20 }} />
          <CTAButton
            style={{ flex: 1 }}
            label={strings("common_message.save_text").toUpperCase()}
            isEnabled
            onClick={this.onSaveClicked.bind(this)}
          />
        </View>
      </View>
    );
  }
}

export const styles = StyleSheet.create({
  bottomView: {
    width: "100%",
    backgroundColor: R.Colors.COLOR_WHITE,
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 20
  },
  bottomViewTitle: {
    color: R.Colors.COLOR_TITLE,
    fontSize: 16,
    fontWeight: "600",
    alignSelf: "center"
  },
  bottomValuesStyles: {
    // width: '100%',
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: 20
  },
  textUnitStyle: {
    letterSpacing: 1.33,
    color: R.Colors.COLOR_TEXT_NUMBER,
    fontFamily: "Lato-Regular",
    fontSize: 16,
    fontWeight: "bold",
    lineHeight: 44
  },
  buttonContainerStyle: {
    height: 50,
    marginLeft: "15%",
    marginRight: "15%",
    flexDirection: "row"
  }
});
