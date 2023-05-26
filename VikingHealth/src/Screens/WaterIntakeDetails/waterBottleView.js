import React from "react";
import { View, Text, Image, Animated } from "react-native";
import { styles } from "./style";
import { R } from "Resources";
import LinearGradients from "react-native-linear-gradient";
import AppUtil from "Library/Utils/AppUtil";
import { HeightWeightUtil } from "../../Library/Utils/HeightWeightUtil";
import { Platform } from "@aws-amplify/core";

function formatWaterIntakeLevel(value, waterIntakeUnit) {
  let convertedValue;
  let formattedValue;
  if (waterIntakeUnit === 0) {
    convertedValue = Math.ceil(value.toFixed(0) / 10) * 10;
    formattedValue = " oz";
  } else if (value >= 1000) {
    convertedValue = HeightWeightUtil.litreValue(value).toFixed(1);
    formattedValue = " L";
  } else {
    convertedValue = value;
    formattedValue = " ml";
  }

  return convertedValue + formattedValue;
}

function processLastRecordedWeight(
  lastWaterIntakeLog,
  targetWaterIntake,
  waterIntakeUnit
) {
  const waterIntakeMeterHeight = 206;
  const lastRecordedWaterIntake = lastWaterIntakeLog.waterIntake;

  let isBubbleVisible = "flex";

  if (lastRecordedWaterIntake === 0) {
    isBubbleVisible = "none";
  }

  const bubbleDisplayWaterLevel =
    waterIntakeUnit === 0
      ? lastRecordedWaterIntake
      : (lastRecordedWaterIntake / 1000).toFixed(1);

  // calculating gradient level height
  const gradientHeight = Math.min(
    (lastRecordedWaterIntake / targetWaterIntake).toFixed(2) *
      waterIntakeMeterHeight,
    waterIntakeMeterHeight
  );

  // calculating wave image percentage from top
  const waveOffsetPercent = 2.5;
  const waterIntakePercent = (
    lastRecordedWaterIntake / targetWaterIntake
  ).toFixed(2);
  const wavePercent = (1 - waterIntakePercent) * 100;
  const wavePercentFromTop = wavePercent - waveOffsetPercent;
  const waveOffsetPercentString = `${wavePercentFromTop}%`;

  //calculating bubble position from top
  const bubbleHeightOffset = 12; // bubble height divided by 2
  const bubblePosition = (wavePercent / 100) * waterIntakeMeterHeight;
  const bubblePositionFromTop = Math.max(
    bubblePosition - bubbleHeightOffset,
    -12
  );

  // calculating the water level range
  let waterLevelHealthIndicator = "Perfect!";
  if (
    AppUtil.inRange(
      lastRecordedWaterIntake,
      targetWaterIntake * 0.75,
      targetWaterIntake
    )
  ) {
    waterLevelHealthIndicator = "Perfect!";
  } else if (
    AppUtil.inRange(
      lastRecordedWaterIntake,
      targetWaterIntake * 0.5,
      targetWaterIntake * 0.75
    )
  ) {
    waterLevelHealthIndicator = "Good";
  } else if (
    AppUtil.inRange(
      lastRecordedWaterIntake,
      targetWaterIntake * 0.25,
      targetWaterIntake * 0.5
    )
  ) {
    waterLevelHealthIndicator = "Okay";
  } else if (
    AppUtil.inRange(lastRecordedWaterIntake, 0, targetWaterIntake * 0.25)
  ) {
    waterLevelHealthIndicator = "Poor";
  }

  return {
    bubbleDisplayWaterLevel,
    gradientHeight,
    waveOffsetPercentString,
    bubblePositionFromTop,
    waterLevelHealthIndicator,
    isBubbleVisible,
  };
}

const AnimatedLinearGradient = Animated.createAnimatedComponent(
  LinearGradients
);

export default class waterBottleView extends React.Component {
  constructor(props) {
    super(props);

    const { lastWaterIntakeLog, targetIntake, waterIntakeUnit } = props;
    const targetWaterIntake = targetIntake;
    const displayData = processLastRecordedWeight(
      lastWaterIntakeLog,
      targetWaterIntake,
      waterIntakeUnit
    );

    this.state = { ...displayData, animated: new Animated.Value(0) };
    this.startAnimation(displayData.gradientHeight);
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.lastWaterIntakeLog != this.props.lastWaterIntakeLog ||
      prevProps.waterIntakeUnit !== this.props.waterIntakeUnit
    ) {
      const { lastWaterIntakeLog, targetIntake, waterIntakeUnit } = this.props;
      const targetWaterIntake = targetIntake;
      const displayData = processLastRecordedWeight(
        lastWaterIntakeLog,
        targetWaterIntake,
        waterIntakeUnit
      );

      this.setState({ ...displayData }, () => {
        this.startAnimation(displayData.gradientHeight);
      });
    }
  }

  startAnimation = (gradientHeight) => {
    Animated.timing(this.state.animated, {
      toValue: gradientHeight,
      duration: 1000,
      delay: 500,
    }).start();
  };

  render() {
    const { targetIntake, waterIntakeUnit } = this.props;
    const targetWaterIntake = targetIntake;
    const { bubbleDisplayWaterLevel, waterLevelHealthIndicator } = this.state;

    const bigUnit = HeightWeightUtil.waterBigUnit(waterIntakeUnit);

    const waveOpacityInterpolation = this.state.animated.interpolate({
      inputRange: [0, 0.001, 205, 206],
      outputRange: [0, 1, 1, 0],
    });

    const bubbleInterpolation = this.state.animated.interpolate({
      inputRange: [0, 206],
      outputRange: [206, 0],
    });
    // subtracting half of height of bubble..
    const bubbleTranslation = Animated.subtract(bubbleInterpolation, 12);

    const bubbleOpacityInterpolation = this.state.animated.interpolate({
      inputRange: [0, 1, 206],
      outputRange: [0, 1, 1],
    });

    return (
      <View style={styles.waterLevelContainer}>
        <View style={styles.waterLevelInnerContainer}>
          <View style={styles.waterBubbleContainer}>
            {/* Bubble */}

            <View style={{ height: "100%" }}>
              <Animated.View
                style={{
                  position: "absolute",
                  height: "100%",
                  transform: [{ translateY: bubbleTranslation }],
                  // display: isBubbleVisible,
                  opacity: bubbleOpacityInterpolation,
                }}>
                <Image
                  source={R.Images.waterBubble}
                  style={[styles.bubbleImageStyle]}
                />
                <Text
                  style={[
                    styles.imageLevelTextStyle,
                    waterIntakeUnit === 0 ? { fontSize: 11 } : { fontSize: 13 },
                  ]}>
                  {bubbleDisplayWaterLevel}
                  {bigUnit}
                </Text>
              </Animated.View>
            </View>
          </View>

          <View
            style={{
              width: 55,
              height: 206,
            }}>
            <View style={styles.gradientContainer} />

            <View
              style={{
                flexDirection: "column-reverse",
                height: "100%",
              }}>
              <AnimatedLinearGradient
                locations={[0, 0.46, 1]}
                useAngle
                angle={137}
                colors={["#86A8E7", "#47AEE0", "#91EAE4"]}
                style={[
                  styles.linearGradient,

                  {
                    height: this.state.animated,
                    alignContent: "flex-end",
                    position: "relative",
                  },
                ]}
              />

              <Animated.Image
                source={R.Images.wave}
                style={{
                  opacity: waveOpacityInterpolation,
                  width: 55,
                  marginBottom: -2,
                  backgroundColor: "transparent",
                }}
              />
            </View>

            <View style={styles.waterLevelViewStyle}>
              <Text style={[styles.waterLevelQuantityTextStyle]}>
                {formatWaterIntakeLevel(targetWaterIntake, waterIntakeUnit)}
              </Text>
              <Text
                style={[
                  styles.waterLevelQuantityTextStyle,
                  { lineHeight: Platform.OS === "ios" ? 0 : 12 },
                ]}>
                {formatWaterIntakeLevel(targetWaterIntake / 2, waterIntakeUnit)}
              </Text>
            </View>
          </View>
          <View style={styles.waterLevelMarkerIndicator}>
            <Text
              style={
                waterLevelHealthIndicator === "Perfect!"
                  ? styles.highlightedWaterLevelMarkerIndicatorText
                  : styles.waterLevelMarkerIndicatorText
              }>
              Perfect!
            </Text>
            <Text
              style={
                waterLevelHealthIndicator === "Good"
                  ? styles.highlightedWaterLevelMarkerIndicatorText
                  : styles.waterLevelMarkerIndicatorText
              }>
              Good
            </Text>
            <Text
              style={
                waterLevelHealthIndicator === "Okay"
                  ? styles.highlightedWaterLevelMarkerIndicatorText
                  : styles.waterLevelMarkerIndicatorText
              }>
              Okay
            </Text>
            <Text
              style={
                waterLevelHealthIndicator === "Poor"
                  ? styles.highlightedWaterLevelMarkerIndicatorText
                  : styles.waterLevelMarkerIndicatorText
              }>
              Poor
            </Text>
          </View>
        </View>
      </View>
    );
  }
}
