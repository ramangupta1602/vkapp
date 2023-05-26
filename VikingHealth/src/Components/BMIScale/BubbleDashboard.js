import React from "react";
import { Text, View } from "react-native";
import Triangle from "react-native-triangle";
import bmiBubbleStyles from "./Styles";

export const BubbleDashboard = ({ value, width, percentage, color }) => {
  const viewWidth = 102;
  let finalLeft = undefined; // This is again an unused declaration therefore initializing it with undefined.
  const positionLeft = (width * percentage) / 100;
  const widthHalf = viewWidth / 2;
  const position = positionLeft - widthHalf;
  const pointerArrowWidth = 8;
  const pointerHalfWidth = pointerArrowWidth / 2;
  let positionPointer = positionLeft - pointerHalfWidth;

  if (position < 0) {
    finalLeft = 0;
  } else if (position + viewWidth > width) {
    finalLeft = width - viewWidth;
  } else {
    finalLeft = position - pointerHalfWidth;
  }

  if (positionPointer - pointerHalfWidth < 0) {
    positionPointer = pointerHalfWidth;
  } else if (positionPointer + pointerArrowWidth > width) {
    positionPointer = width - pointerArrowWidth - 6; // 6 = padding
  }

  return (
    <View>
      <View
        style={{
          opacity: width ? 1 : 0,
          // marginLeft: finalLeft,
        }}>
        <View style={[bmiBubbleStyles.bubble, { backgroundColor: color }]}>
          <Text style={bmiBubbleStyles.valueText}>{value}</Text>
        </View>
      </View>
      <View style={[bmiBubbleStyles.boxStyle, 
        // { left: positionPointer }
        ]}>
        <Triangle width={8} height={4} color={color} direction={"down"} />
        <View style={{ height: 2 }} />
        <Triangle width={8} height={4} color={color} direction={"up"} />
      </View>
    </View>
  );
};
