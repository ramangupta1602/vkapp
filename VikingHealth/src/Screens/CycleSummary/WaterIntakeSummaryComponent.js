import React from "react";
import { View, Text, Image, ImageBackground } from "react-native";
import Styles from "./styles";
import { strings } from "../../utility/locales/i18n";
import { R } from "../../Resources/R";
import { HeightWeightUtil } from "../../Library/Utils/HeightWeightUtil";

function getNullSafeData(data) {
  if (data) {
    return data;
  }

  return {
    averageWaterIntake: 0,
    monthlyBadgeCount: 0,
    dailyBadgeCount: 0,
    weeklyBadgeCount: 0
  };
}

function getMessageForOz(amount) {
  const waterLevelUnit = "oz";

  if (amount > 120) {
    return strings("cycleSummary.waterIntakeMessage", {
      pretext: "Awesome!",
      amount,
      unit: waterLevelUnit
    });
  }

  if (amount >= 80) {
    return strings("cycleSummary.waterIntakeMessage", {
      pretext: "Good!",
      amount,
      unit: waterLevelUnit
    });
  }
  return strings("cycleSummary.waterIntakeMessage", {
    pretext: strings("cycleSummary.water-recommended"),
    amount,
    unit: waterLevelUnit
  });
}

function getMessageForML(amount) {
  const waterLevelUnit = "ml";

  if (amount > 3500) {
    return strings("cycleSummary.waterIntakeMessage", {
      pretext: "Awesome!",
      amount,
      unit: waterLevelUnit,
      period: "3 months"
    });
  }

  if (amount >= 2360) {
    return strings("cycleSummary.waterIntakeMessage", {
      pretext: "Good!",
      amount,
      unit: waterLevelUnit,
      period: "3 months"
    });
  }
  return strings("cycleSummary.waterIntakeMessage", {
    pretext: strings("cycleSummary.water-recommended"),
    amount,
    unit: waterLevelUnit,
    period: "this cy"
  });
}

function getIntakeMessageString(amount, unit) {
  if (unit === HeightWeightUtil.WATER_FLOZ) {
    return getMessageForOz(amount);
  }

  return getMessageForML(amount);
}

const WaterIntakeSummaryComponent = ({
  waterIntakeSummary,
  waterDefaultUnit
}) => {
  const nullSafeData = getNullSafeData(waterIntakeSummary);

  const {
    waterIntakeUnit = waterDefaultUnit,
    averageWaterIntake = 0,
    monthlyBadgeCount = 0,
    dailyBadgeCount = 0,
    weeklyBadgeCount = 0
  } = nullSafeData;

  const waterLevelUnit = HeightWeightUtil.waterUnit(waterIntakeUnit);
  const message = getIntakeMessageString(averageWaterIntake, waterIntakeUnit);

  return (
    <View
      style={[Styles.weightComponentStyle, { marginTop: 23, marginBottom: 46 }]}
    >
      <View style={Styles.weightContainerStyle}>
        <Text style={Styles.componentTitleStyle}>
          {strings("cycleSummary.waterIntake")}
        </Text>

        <View style={Styles.weightDetailStyle}>
          <View
            style={[Styles.weightLossContainerStyle, { alignItems: "center" }]}
          >
            <ImageBackground
              style={Styles.waterCircleStyle}
              resizeMode="cover"
              source={R.Images.WaterCircle}
            >
              <Text style={Styles.avgTextStyle}>Avg.</Text>
              <Text style={Styles.waterAvgTextStyle}>
                {averageWaterIntake} {waterLevelUnit}
              </Text>
            </ImageBackground>

            <View style={Styles.textContainerStyle}>
              <Text style={Styles.waterIntakeMessageStyle}>{message}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={Styles.allBadgeContainer}>
        <View style={Styles.badgeContainer}>
          <Image
            source={
              dailyBadgeCount > 0
                ? R.Images.ActiveDailyBadge
                : R.Images.InactiveDailyBadge
            }
            style={Styles.waterIntakeBadgeImageStyle}
            resizeMode="contain"
          />
          <Text style={Styles.badgeCountTextStyle}>x{dailyBadgeCount}</Text>
        </View>

        <View style={Styles.badgeContainer}>
          <Image
            source={
              weeklyBadgeCount > 0
                ? R.Images.ActiveWeeklyBadge
                : R.Images.InactiveWeeklyBadge
            }
            style={Styles.waterIntakeBadgeImageStyle}
            resizeMode="contain"
          />
          <Text style={Styles.badgeCountTextStyle}>x{weeklyBadgeCount}</Text>
        </View>

        <View style={Styles.badgeContainer}>
          <Image
            source={
              monthlyBadgeCount > 0
                ? R.Images.ActiveMonthlyBadge
                : R.Images.InactiveMonthlyBadge
            }
            style={Styles.waterIntakeBadgeImageStyle}
            resizeMode="contain"
          />
          <Text style={Styles.badgeCountTextStyle}>x{monthlyBadgeCount}</Text>
        </View>
      </View>
    </View>
  );
};

export default WaterIntakeSummaryComponent;
