import React from "react";
import { Text, Animated } from "react-native";
import { LayoutMatrix } from "./ConfigData";
import Style from "./styles";
import { R } from "../../../Resources/R";
import AppUtil from "../../../Library/Utils/AppUtil";

function getPillForPart({
  layoutParam,
  animation,
  loss,
  width,
  heightUnitText,
  name,
}) {
  const { onLeft, x, y, animationOffset } = layoutParam;

  const xTranslationInterpolation = animation.interpolate({
    inputRange: [animationOffset, animationOffset + 0.5, animationOffset + 1],
    outputRange: [width, width - 80, onLeft ? width - x + 25 : x + 20],
    extrapolate: "clamp",
  });

  const position = { top: y };

  if (onLeft) {
    position["right"] = xTranslationInterpolation;
  } else {
    position["left"] = xTranslationInterpolation;
  }

  const opacityInterpolation = animation.interpolate({
    inputRange: [animationOffset, animationOffset + 0.5, animationOffset + 1],
    outputRange: [0, 0.8, 1],
    extrapolate: "clamp",
  });

  const absLoss = Math.abs(loss);
  const lossText =
    loss > 0 ? `+${absLoss}` : loss != 0 ? `-${absLoss}` : absLoss;
  const textColor =
    loss > 0 ? R.Colors.COLOR_GAIN_RED : R.Colors.COLOR_LOSS_GREEN;

  return (
    <Animated.View
      style={[
        Style.finalPillStyle,
        position,
        {
          opacity: opacityInterpolation,
        },
      ]}
    >
      <Text
        style={[Style.finalPillTextStyle, { color: textColor }]}
        {...AppUtil.getTestId(name)}
      >
        {lossText} {heightUnitText}
      </Text>
    </Animated.View>
  );
}

const FinalMeasurementPills = ({
  animation,
  layoutParam,
  data,
  width,
  heightUnitText,
}) => {
  const allPills = [];

  for (const part in LayoutMatrix) {
    const { x, y, onLeft, animationOffset, name } = LayoutMatrix[part];
    const loss = data[part.toLowerCase()];

    const pill = getPillForPart({
      layoutParam: {
        x: x * layoutParam.width,
        y: y * layoutParam.height,
        onLeft,
        animationOffset,
      },
      animation,
      loss,
      width,
      heightUnitText,
      name,
    });

    allPills.push(pill);
  }

  return allPills;
};

export default FinalMeasurementPills;
