import React, { Component } from "react";
import { View, Image, Text, StyleSheet, Dimensions } from "react-native";
import {
  CircularProgress,
  AnimatedCircularProgress,
} from "react-native-circular-progress";
import { strings } from "../../utility/locales/i18n";
import { ShowWeight } from "./ShowWeight";
import { R } from "Resources";
import { BMIScale } from "Components";

export class WeightComponent extends Component {
  render() {
    const {
      initialWeight,
      currentWeight,
      targetWeight,
      weightLost,
      weightLossProgress,
      isWeightLoss,
      bmi,
      weightUnitText,
    } = this.props;
    return (
      <React.Fragment>
        <View style={[styles.weightContainer]}>
          <View style={styles.weightItemContainer}>
            <ShowWeight
              text={initialWeight}
              unit={weightUnitText}
              weight={strings("weight_details.starting_weight")}
            />
          </View>

          <View style={{ flex: 1, alignItems: "center", height: 95 }}>
            <WeightLossProgress
              weightLossProgress={weightLossProgress}
              isWeightLoss={isWeightLoss}
              currentWeight={currentWeight}
              weightLost={weightLost}
              weightUnitText={weightUnitText}
            />
          </View>

          <View style={styles.weightItemContainer}>
            <ShowWeight
              text={targetWeight}
              unit={weightUnitText}
              weight={strings("weight_details.target_weight")}
            />
          </View>
        </View>

        <View style={{ margin: 30 }}>
          <BMIScale style={{ marginTop: 5 }} bmi={bmi} />
        </View>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  weightContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  currentWeightStyle: {
    fontFamily: "Lato-Regular",
    fontSize: 20,
    fontWeight: "bold",
    lineHeight: 20,
    color: R.Colors.COLOR_TEXT_NUMBER,
  },
  textGainLossUnitStyle: {
    fontFamily: "Lato-Regular",
    fontSize: 12,
    marginLeft: 4,
    fontWeight: "400",
    lineHeight: 16,
    color: "black",
  },
  progressContainerView: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  weightItemContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

const WeightLossProgress = (props) => {
  const {
    weightLossProgress,
    isWeightLoss,
    currentWeight,
    weightLost,
    weightUnitText,
  } = props;

  const arrowStyle = isWeightLoss ? {} : { transform: [{ rotate: "180deg" }] };
  const weightLossTextStyle = isWeightLoss
    ? { color: "green" }
    : { color: "red" };
  return (
    <AnimatedCircularProgress
      size={Dimensions.get("window").width / 3 - 10}
      width={8}
      fill={weightLossProgress}
      backgroundWidth={1}
      tintColor={isWeightLoss ? "#7ED321" : "red"}
      arcSweepAngle={180}
      rotation={270}
      lineCap="round"
      backgroundColor={R.Colors.COLOR_TEXT_GREY}
      duration={500}
    >
      {() => (
        <View style={styles.progressContainerView}>
          <View>
            <Text style={styles.currentWeightStyle}>
              {currentWeight}
              <Text style={{ fontSize: 12 }}>{weightUnitText}</Text>
            </Text>
          </View>
          <View
            style={{
              marginTop: 10,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Image
              source={R.Images.weightLoss}
              style={[{ width: 8, height: 11 }, arrowStyle]}
            />
            <Text style={[styles.textGainLossUnitStyle, weightLossTextStyle]}>
              {Math.abs(weightLost)} {weightUnitText}
            </Text>
          </View>
        </View>
      )}
    </AnimatedCircularProgress>
  );
};
