import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Styles from "../styles";
import { R } from "../../../Resources/R";
import { strings } from "../../../utility/locales/i18n";
import RewardCard from "./RewardCard";
import { inject, observer } from "mobx-react";
import { HeightWeightUtil } from "../../../Library/Utils/HeightWeightUtil";
import CardStyle from "./Styles";

@inject("rewardStore")
@observer
export default class BmiLossCard extends Component {
  render() {
    const {
      currentPopupValue,
      previousPopupValue,
      popupMeasurementUnit,
      weightPercentageLoss,
      points,
    } = this.props.rewardStore;

    const unit = HeightWeightUtil.weightUnit(popupMeasurementUnit);

    return (
      <View style={[Styles.gamificationCardStyles, CardStyle.topCardStyle]}>
        <RewardCard
          onClick={this.props.onClick}
          points={points}
          image={R.Images.RewardImages.WeightLossPopupBackground}
          currentValue={currentPopupValue}
          unit={unit}
          previousCardMessage={`Your starting weight was ${previousPopupValue.toFixed(
            1
          )} ${unit}`}
          message={strings("RedeemFeature.weightPopupMessage", {
            value: weightPercentageLoss.toFixed(1),
          })}
          currentClass={`Down ${(
            previousPopupValue - currentPopupValue
          ).toFixed(1)} ${unit}`}
        />
      </View>
    );
  }
}
