import React, { Component } from "react";
import { Text, View, Dimensions, Image, TouchableOpacity } from "react-native";
import Styles from "./Styles";
import { R } from "../../../Resources/R";
import * as DynamicSizeUtil from "../../../utility/ResizeUtil";
import { convertPointToAmountString } from "../RewardManager";
import { strings } from "../../../utility/locales/i18n";

const { width, height } = Dimensions.get("screen");

export default class RedeemEarnedView extends Component {
  render() {
    const { totalReward } = this.props;
    const reward = convertPointToAmountString(totalReward);

    return (
      <View style={Styles.cardContainerStyle}>
        <Text style={Styles.congratulationsText}>
          {strings("RedeemFeature.congratulations")}!
        </Text>

        <View
          style={[
            Styles.redeemImageBackgroundStyle,
            Styles.redeemEarnedImageBackgroundStyle,
          ]}
        >
          <Image
            source={R.Images.RedeemImages.RedeemedCardBackground}
            style={[
              Styles.backgroundImageStyle,
              {
                height: DynamicSizeUtil.dynamicSize(155),
              },
            ]}
            resizeMode="stretch"
          />

          <View
            style={[
              Styles.contentContainerStyle,
              {
                alignSelf: "center",
                alignItems: "center",
              },
            ]}
          >
            <Text
              style={[
                Styles.commonTextStyle,
                Styles.redeemEarnedRewardTextStyle,
              ]}
            >
              {`${reward}`}
            </Text>

            <Text
              style={[Styles.commonTextStyle, { textTransform: "uppercase" }]}
            >
              {strings("RedeemFeature.creditEarned")}
            </Text>
          </View>
        </View>

        <Text style={Styles.redeemMessageStyle}>
          {strings("RedeemFeature.redeemEarnedMessage")}
        </Text>

        <TouchableOpacity
          hitSlop={{ top: 10, bottom: 10 }}
          onPress={this.props.onClick}
          style={Styles.okayButtonStyle}
        >
          <Text style={Styles.okayTextStyle}>
            {strings("common_message.okay")}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
