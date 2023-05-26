import React, { Component } from "react";
import { View } from "react-native";
import { BMIScaleConfig, BMIScaleConfigClasses } from "./BMIScaleConfig";
import { BubbleDashboard } from "./BubbleDashboard";
import { ScaleCategory } from "./ScaleCategory";
import styles from "./Styles";

export class BMIScaleDashboard extends Component {
  constructor(props) {
    super(props);
    this.leftMargin = this.calculateLeftMargin();
    this.state = { isLayoutLoaded: true };
    this.width = 0;
  }

  componentDidUpdate(oldProps) {
    if (oldProps != this.props) {
      this.leftMargin = this.calculateLeftMargin();
    }
  }

  calculateLeftMargin() {
    const bmi = this.props.bmi;
    let startRange = 0;
    let endRange = 0;
    let offset = 0;

    switch (true) {
      case bmi <= BMIScaleConfig.underWeight.endRange:
        startRange = BMIScaleConfig.underWeight.startRange;
        endRange = BMIScaleConfig.underWeight.endRange;
        break;

      case bmi <= BMIScaleConfig.healthy.endRange:
        startRange = BMIScaleConfig.healthy.startRange;
        endRange = BMIScaleConfig.healthy.endRange;
        offset = 25;
        break;

      case bmi <= BMIScaleConfig.overWeight.endRange:
        startRange = BMIScaleConfig.overWeight.startRange;
        endRange = BMIScaleConfig.overWeight.endRange;
        offset = 50;
        break;

      default:
        startRange = BMIScaleConfig.obese.startRange;
        endRange = BMIScaleConfig.obese.endRange;
        offset = 75;
        break;
    }

    let leftMargin = offset;
    const percentageWithRange =
      ((bmi - startRange) / (endRange - startRange)) * 100;
    const percentageWithRespectToWholeScale = percentageWithRange / 4; // 4 = no of section, so 100% in 1 section = 25 overall
    leftMargin += percentageWithRespectToWholeScale;
    return leftMargin;
  }

  getColor = () => {
    const bmi = this.props.bmi;

    let color;

    if (bmi <= BMIScaleConfig.underWeight.endRange) {
      color = BMIScaleConfig.underWeight.color;
    } else if (bmi <= BMIScaleConfig.healthy.endRange) {
      color = BMIScaleConfig.healthy.color;
    } else if (bmi <= BMIScaleConfig.overWeight.endRange) {
      color = BMIScaleConfig.overWeight.color;
    } else {
      color = BMIScaleConfig.obese.color;
    }

    return color;
  };

  returnBmiValue() {
    return ` BMI: ${this.props.bmi}`;
  }

  render() {
    return (
      <React.Fragment>
        <View
          onLayout={({
            nativeEvent: {
              layout: { width },
            },
          }) => {
            if (this.width === 0) {
              this.width = width;
              this.setState({ isLayoutLoaded: true });
            }
          }}>
          <View
            style={{
              width: "100%",
              alignItems: "flex-start",
            }}>
            <BubbleDashboard
              value={this.returnBmiValue()}
              width={this.width}
              color={this.getColor()}
              percentage={this.leftMargin}
            />
          </View>

          <View style={[this.props.style, styles.scaleContainer]}>
            {BMIScaleConfigClasses.map((name) => {
              return (
                <ScaleCategory
                  config={BMIScaleConfig[name]}
                  value={this.props.bmi}
                  lines={1}
                  key={name}
                  hideRange
                  style={styles.scaleCategoryStyle}
                />
              );
            })}
          </View>
        </View>
      </React.Fragment>
    );
  }
}
