import React from "react";
import { Text, View, Animated } from "react-native";
import Style, {
  BOTTOM_PILL_MARGIN_BOTTOM,
  HEIGHT_OF_BOTTOM_PILL,
} from "./styles";
import Triangle from "react-native-triangle";
import { BodyPartName, AnimationInput } from "./ConfigData";
import { R } from "../../../Resources/R";

function getValueTranslationStyle(animated) {
  const translationInterpolation = animated.interpolate({
    inputRange: [
      0,
      AnimationInput.NeckStart,
      AnimationInput.NeckUnwinding + 0.5, // for neck
      AnimationInput.ShoulderStart,
      AnimationInput.ShoulderUnwinding, // for shoulder
      AnimationInput.ChestStart,
      AnimationInput.ChestUnwinding + 0.5, // for chest
      AnimationInput.ArmsStart,
      AnimationInput.ArmsUnwinding + 0.5, // for arms
      AnimationInput.WaistStart,
      AnimationInput.WaistUnwinding + 0.5, // for waist
      AnimationInput.HipsStart,
      AnimationInput.HipsUnwinding + 0.5, // for hips
      AnimationInput.ThighsStart,
      AnimationInput.ThighsUnwinding + 0.5, // for thigh
      AnimationInput.CalfStart,
      AnimationInput.CalfUnwinding, // for calf
    ],
    outputRange: [
      HEIGHT_OF_BOTTOM_PILL,
      0,
      0, // for neck
      -HEIGHT_OF_BOTTOM_PILL,
      -HEIGHT_OF_BOTTOM_PILL, // for shoulder
      -HEIGHT_OF_BOTTOM_PILL * 2,
      -HEIGHT_OF_BOTTOM_PILL * 2, // for chest
      -HEIGHT_OF_BOTTOM_PILL * 3,
      -HEIGHT_OF_BOTTOM_PILL * 3, // for arms
      -HEIGHT_OF_BOTTOM_PILL * 4,
      -HEIGHT_OF_BOTTOM_PILL * 4, // for waist
      -HEIGHT_OF_BOTTOM_PILL * 5,
      -HEIGHT_OF_BOTTOM_PILL * 5, // for hips
      -HEIGHT_OF_BOTTOM_PILL * 6,
      -HEIGHT_OF_BOTTOM_PILL * 6, // for thigh
      -HEIGHT_OF_BOTTOM_PILL * 7,
      -HEIGHT_OF_BOTTOM_PILL * 7, // for calf
    ],
  });

  return {
    ...Style.textContainerStyle,
    flexDirection: "row",
    transform: [{ translateY: translationInterpolation }],
  };
}

function getPillTranslationStyle(animated) {
  const translationInterpolation = animated.interpolate({
    inputRange: [
      0,
      AnimationInput.NeckStart,
      AnimationInput.CalfUnwinding,
      AnimationInput.FullBody,
    ],
    outputRange: [BOTTOM_PILL_MARGIN_BOTTOM, 0, 0, BOTTOM_PILL_MARGIN_BOTTOM],
    extrapolate: "clamp",
  });

  const opacityInterpolation = animated.interpolate({
    inputRange: [
      0,
      AnimationInput.NeckStart,
      AnimationInput.CalfUnwinding,
      AnimationInput.FullBody,
    ],
    outputRange: [0, 1, 1, 0],
    extrapolate: "clamp",
  });

  return {
    ...Style.bottomLossPillAbsoluteStyle,
    transform: [{ translateY: translationInterpolation }],
    opacity: opacityInterpolation,
  };
}

const BottomLossPill = ({ animated, data, heightUnitText }) => {
  const bottomPillValuesTranslationStyle = getValueTranslationStyle(animated);
  const pillTranslationStyle = getPillTranslationStyle(animated);

  return (
    <Animated.View style={pillTranslationStyle}>
      <View style={Style.bottomLossPillContainerStyle}>
        <View style={Style.bottomLossPillPartNameStyle}>
          {BodyPartName.map((name) => {
            return (
              <Animated.View style={bottomPillValuesTranslationStyle}>
                <Text style={Style.bottomLossPillNameTextStyle}>{name}</Text>
              </Animated.View>
            );
          })}
        </View>
        <Triangle
          width={11}
          height={14}
          direction="left"
          style={{ marginLeft: -10, alignSelf: "center" }}
          color={"white"}
        />
        <View style={Style.bottomLossNumericFigureStyle}>
          {BodyPartName.map((name) => {
            const loss = data[name.toLowerCase()];
            const roundedLoss = Math.abs(loss);
            const lossText =
              loss > 0
                ? `+${roundedLoss}`
                : loss !== 0
                ? `-${roundedLoss}`
                : "0.0";

            const textColor =
              loss > 0 ? R.Colors.COLOR_GAIN_RED : R.Colors.COLOR_LOSS_GREEN;

            return (
              <Animated.View style={bottomPillValuesTranslationStyle}>
                <Text
                  style={[
                    Style.bottomLossNumericFigureTextStyle,
                    { color: textColor },
                  ]}
                >
                  {lossText}
                </Text>
                <Text
                  style={[Style.bottomLossUnitTextStyle, { color: textColor }]}
                >
                  {heightUnitText}
                </Text>
              </Animated.View>
            );
          })}
        </View>
      </View>
    </Animated.View>
  );
};

export default BottomLossPill;
