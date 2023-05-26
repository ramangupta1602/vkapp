import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { cardStyles } from "../CardStyles";
import { HeightWeightUtil } from "Library/Utils/HeightWeightUtil";
import { R } from "Resources";
import { inject, observer } from "mobx-react";

const WaterIntakeBlock = ({ measurement, label, waterIntakeUnit }) => (
  <View style={{ flexDirection: "column" }}>
    <Text style={cardStyles.cardFigureStyle}>
      {measurement}
      <Text style={cardStyles.unitStyle}> {waterIntakeUnit}</Text>
    </Text>
    <Text style={cardStyles.subTextStyle}>{label}</Text>
  </View>
);

@inject("userAccountStore", "loginUserStore")
@observer
export class WaterIntakeCard extends Component {
  render() {
    const { targetWaterIntake } = this.props;
    const {
      waterIntakeLog: { waterIntake, waterIntakeUnit },
      onCardSelect,
    } = this.props;
    const unit = HeightWeightUtil.waterUnit(waterIntakeUnit);

    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={onCardSelect}
        accessibilityLabel={"waterIntakeCard"}
        testID={"waterIntakeCard"}
      >
        <Text style={cardStyles.cardTitleStyle}>Water Intake</Text>

        <WaterIntakeBlock
          measurement={waterIntake}
          label="Today's Intake"
          waterIntakeUnit={unit}
        />
        <View style={cardStyles.targetTopMargin} />
        <WaterIntakeBlock
          measurement={targetWaterIntake}
          label="Target"
          waterIntakeUnit={unit}
        />

        <Image
          source={R.Images.waterIntakeCardImage}
          style={cardStyles.waterIntakeCardBottomImage}
        />
      </TouchableOpacity>
    );
  }
}
