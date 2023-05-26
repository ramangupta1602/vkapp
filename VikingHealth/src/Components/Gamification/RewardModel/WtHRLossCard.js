import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Styles from "../styles";
import { R } from "../../../Resources/R";
import { strings } from "../../../utility/locales/i18n";
import RewardCard from "./RewardCard";
import { inject, observer } from "mobx-react";
import { getWtHRClass } from "../../../Screens/BodyMeasurementsDetails/WtHRData";
import CardStyle from "./Styles";

@inject("rewardStore", "userAccountStore")
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

    const gender = this.props.userAccountStore.gender;
    const { name: currentClassName } = getWtHRClass(currentPopupValue, gender);
    const { name: previousClassName } = getWtHRClass(
      previousPopupValue,
      gender
    );

    const classText = weightPercentageLoss > 1 ? "classes" : "class";

    return (
      <View style={[Styles.gamificationCardStyles, CardStyle.topCardStyle]}>
        <RewardCard
          onClick={this.props.onClick}
          points={points}
          previousClass={previousClassName}
          image={R.Images.RewardImages.WtHRPopupBackground}
          currentValue={currentPopupValue.toFixed(1)}
          currentClass={currentClassName}
          unit={""}
          previousCardMessage={`Your starting WtHR was ${previousPopupValue.toFixed(
            1
          )}`}
          message={strings("RedeemFeature.wthrPopupMessage", {
            weightPercentageLoss,
            classText,
          })}
        />
      </View>
    );
  }
}
