import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import { BMIScaleConfig } from "./BMIScaleConfig";
import { Bubble } from "./Bubble";
import { ScaleCategory } from "./ScaleCategory";

export class BMIScale extends Component {
  constructor(props) {
    super(props);
    this.leftMargin = this.calculateLeftMargin();
  }

  componentDidUpdate(oldProps) {
    if (oldProps != this.props) {
      this.leftMargin = this.calculateLeftMargin();
    }
  }

  calculateLeftMargin() {
    const bmi = this.props.bmi;
    let startRange = 0,
      endRange = 0,
      offset = 0,
      scaleRatio = 0;
    /*if (bmi <= BMIScaleConfig.underWeight.endRange) {
      startRange = BMIScaleConfig.underWeight.startRange
      endRange = BMIScaleConfig.underWeight.endRange
      offset = 0

    } else*/
    if (bmi <= BMIScaleConfig.healthy.endRange) {
      startRange = BMIScaleConfig.healthy.startRange;
      endRange = BMIScaleConfig.healthy.endRange;
      scaleRatio = BMIScaleConfig.healthy.lines / 10;
      //offset = 0; This is redundant. offset already holds this value as defined above.
    } else if (bmi <= BMIScaleConfig.overWeight.endRange) {
      startRange = BMIScaleConfig.overWeight.startRange;
      endRange = BMIScaleConfig.overWeight.endRange;
      scaleRatio = BMIScaleConfig.overWeight.lines / 10;
      offset = 30;
    } else {
      startRange = BMIScaleConfig.obese.startRange;
      endRange = BMIScaleConfig.obese.endRange;
      scaleRatio = BMIScaleConfig.obese.lines / 10;
      offset = 60;
    }

    /*
    @rangeRatio: Ratio within the scale category
    @withinScaleRatio: Translated rangeRatio to overall scale percentage
    @adjustedScaleRatio: Adjusted to add offset of previous scale category distance. - 15 is to offset the half of bubble width
    @offset: Total part occupied by the previous scale categories
    @left: Final left margin to be applied to bubble
    */

    //let leftMargin = "0%"; // This is a wasted initialization so commenting it in
    const rangeRatio = (bmi - startRange) / (endRange - startRange);
    const withinScaleRatio = rangeRatio * scaleRatio * 100;
    const adjustedScaleRatio = withinScaleRatio + offset - 15;
    const left = Math.max(0, Math.min(adjustedScaleRatio, 70));
    let leftMargin = `${left}%`;
    return leftMargin;
  }

  returnBmiValue() {
    return ` BMI: ${this.props.bmi}`;
  }

  render() {
    return (
      <View>
        <View
          style={{
            alignItems: "flex-start",
            left: this.leftMargin,
          }}>
          <Bubble value={this.returnBmiValue()} />
        </View>
        <View style={[this.props.style, styles.scaleContainer]}>
          <ScaleCategory
            config={BMIScaleConfig.healthy}
            value={this.props.bmi}
            key="healthy"
          />

          <ScaleCategory
            config={BMIScaleConfig.overWeight}
            value={this.props.bmi}
            key="overWeight"
          />

          <ScaleCategory
            config={BMIScaleConfig.obese}
            value={this.props.bmi}
            key="obese"
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scaleContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
});
