import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Styles from "../styles";
import { R } from "../../../Resources/R";
import { strings } from "../../../utility/locales/i18n";
import RewardCard from "./RewardCard";
import { inject, observer } from "mobx-react";
import * as BmiData from "../../../Screens/BmiTableScreen/BmiData";
import CardStyle from "./Styles";

@inject("rewardStore")
@observer
export default class BmiLossCard extends Component {
  render() {
    const {
      currentPopupValue,
      previousPopupValue,
      weightPercentageLoss,
      points,
    } = this.props.rewardStore;

    const { name: initialClassName } = BmiData.getBmiClass(previousPopupValue);
    const { name: finalClassName } = BmiData.getBmiClass(currentPopupValue);

    const classText = weightPercentageLoss > 1 ? "classes" : "class";

    return (
      <View style={[Styles.gamificationCardStyles, CardStyle.topCardStyle]}>
        <RewardCard
          onClick={this.props.onClick}
          points={points}
          previousClass={initialClassName}
          image={R.Images.RewardImages.BmiPopupBackground}
          currentValue={currentPopupValue}
          currentClass={finalClassName}
          unit={""}
          previousCardMessage={strings("RedeemFeature.bmiPreviousMessage", {
            previousPopupValue,
          })}
          message={strings("RedeemFeature.bmiPopupMessage", {
            weightPercentageLoss,
            classText,
          })}
        />
      </View>
    );
  }
}
