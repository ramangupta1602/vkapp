import React from "react";
import { View, Text } from "react-native";
import { HeightWeightUtil } from "Library/Utils/HeightWeightUtil";
import { styles } from "./style";

export default function VerticalAxis({
  targetWaterIntake,
  waterIntakeUnit,
  height,
  isForDailyPerformance
}) {
  const targetWaterIntakeBig =
    waterIntakeUnit === HeightWeightUtil.WATER_FLOZ
      ? targetWaterIntake
      : HeightWeightUtil.litreValue(targetWaterIntake);
  const bigUnit = HeightWeightUtil.waterBigUnit(waterIntakeUnit);
  const yAxisFontSize =
    waterIntakeUnit === HeightWeightUtil.WATER_FLOZ ? 10 : 12;
  const decimalPrecision = waterIntakeUnit === 0 ? 0 : 1;

  let dailyPerformanceStyle = { textAlign: "right" };

  if (isForDailyPerformance) {
    dailyPerformanceStyle = { textAlign: "center" };
  }

  return (
    <View
      style={{
        marginTop: 0,
        height,
        marginRight: 10,
        marginBottom: 58,
        width: 35,
        alignSelf: "flex-end"
      }}
    >
      <Text
        style={[
          styles.verticalAxisTextStyle,
          { fontSize: yAxisFontSize },
          dailyPerformanceStyle
        ]}
      >
        {isForDailyPerformance
          ? 5
          : (targetWaterIntakeBig * 1).toFixed(decimalPrecision) + bigUnit}
      </Text>

      <View style={[styles.verticalAxisContainer, yAxisFontSize]}>
        {/* <View style={[styles.upperStyle, { backgroundColor: 'red' }]}>
          <Text style={styles.verticalAxisTextStyle}>
            {targetWaterIntakeL.toFixed(1)}
          </Text>
        </View> */}
        <View style={[styles.middleStyle, { backgroundColor: "transparent" }]}>
          <Text
            style={[
              styles.verticalAxisTextStyle,
              { fontSize: yAxisFontSize },
              dailyPerformanceStyle
            ]}
          >
            {isForDailyPerformance
              ? 4
              : (targetWaterIntakeBig * 0.75).toFixed(decimalPrecision) +
                bigUnit}
          </Text>
        </View>
        <View style={[styles.middleStyle, { backgroundColor: "transparent" }]}>
          <Text
            style={[
              styles.verticalAxisTextStyle,
              { fontSize: yAxisFontSize },
              dailyPerformanceStyle
            ]}
          >
            {isForDailyPerformance
              ? 3
              : (targetWaterIntakeBig * 0.5).toFixed(decimalPrecision) +
                bigUnit}
          </Text>
        </View>

        {/* show only when it is daily performance graph */}
        {isForDailyPerformance && (
          <View
            style={[styles.middleStyle, { backgroundColor: "transparent" }]}
          >
            <Text
              style={[
                styles.verticalAxisTextStyle,
                { fontSize: yAxisFontSize },
                dailyPerformanceStyle
              ]}
            >
              {isForDailyPerformance
                ? 2
                : (targetWaterIntakeBig * 0.5).toFixed(decimalPrecision) +
                  bigUnit}
              {/* {(targetWaterIntakeBig * 0.5).toFixed(decimalPrecision)} {bigUnit} */}
            </Text>
          </View>
        )}

        <View style={[styles.middleStyle, { backgroundColor: "transparent" }]}>
          <Text
            style={[
              styles.verticalAxisTextStyle,
              { fontSize: yAxisFontSize },
              dailyPerformanceStyle
            ]}
          >
            {isForDailyPerformance
              ? 1
              : (targetWaterIntakeBig * 0.25).toFixed(decimalPrecision) +
                bigUnit}
          </Text>
        </View>
        <View style={[styles.lowerStyle, { backgroundColor: "transparent" }]}>
          <Text
            style={[
              styles.verticalAxisTextStyle,
              { fontSize: yAxisFontSize },
              dailyPerformanceStyle
            ]}
          >
            {isForDailyPerformance
              ? 0
              : (targetWaterIntakeBig * 0).toFixed(decimalPrecision) + bigUnit}
          </Text>
        </View>
      </View>
    </View>
  );
}
