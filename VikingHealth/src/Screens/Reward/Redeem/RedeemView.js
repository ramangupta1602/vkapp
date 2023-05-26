import React, { Component } from "react";
import { Text, View, TouchableOpacity, Dimensions, Image } from "react-native";
import Styles from "./Styles";
import { R } from "../../../Resources/R";
import RewardPointView from "../RewardPointView";
import { convertPointToAmountString } from "../RewardManager";
import { strings } from "../../../utility/locales/i18n";

const { width, height } = Dimensions.get("screen");

export default class RedeemView extends Component {
  render() {
    const { totalReward } = this.props;

    const reward = convertPointToAmountString(totalReward);

    return (
      <View style={[Styles.cardContainerStyle]}>
        <Text style={Styles.congratulationsText}>
          {strings("RedeemFeature.redeemYourPoints")}
        </Text>

        <View style={Styles.redeemImageBackgroundStyle}>
          <Image
            source={R.Images.RedeemImages.RedeemCardBackground}
            style={[Styles.backgroundImageStyle]}
            resizeMode="stretch"
          />

          <View style={Styles.contentContainerStyle}>
            <RewardPointView total={totalReward} />

            <Text
              style={[Styles.commonTextStyle, { textTransform: "uppercase" }]}
            >
              {strings("RedeemFeature.totalPointEarned")}
            </Text>

            <Text style={[Styles.commonTextStyle, Styles.totalCreditTextStyle]}>
              {`≈ ${reward} Credit`}
            </Text>
          </View>
        </View>

        <Text style={Styles.redeemMessageStyle}>
          {strings("RedeemFeature.messageVHService")}
        </Text>

        <Text style={Styles.noteTextStyle}>
          {strings("RedeemFeature.expiringMessage")}
        </Text>

        {/* CTA Container */}
        <View style={Styles.ctaContainerStyle}>{this.props.button}</View>

        <TouchableOpacity onPress={this.props.onClose}>
          <Text style={Styles.doItLaterTextStyle}>
            {strings("RedeemFeature.doItLater")}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
