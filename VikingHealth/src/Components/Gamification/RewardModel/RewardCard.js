import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { R } from "../../../Resources/R";
import { strings } from "../../../utility/locales/i18n";
import Styles from "./Styles";
import * as AppColor from "./Styles";
import * as DateUtil from "../../../Library/Utils/DateUtil";

const RewardCard = ({
  onClick,
  points,
  date,
  message,
  currentValue,
  currentClass,
  unit,
  previousCardMessage,
  previousClass,
  image,
}) => {
  return (
    <View>
      <Text style={Styles.titleStyle}>
        {strings("RedeemFeature.congratulations")}!
      </Text>

      <Text style={Styles.subHeadingStyle}>
        {strings("RedeemFeature.earnReward")}
      </Text>

      <View style={Styles.imageContainerStyle}>
        <Image style={Styles.imageStyle} source={image} resizeMode="stretch" />
        <View style={Styles.rewardPointContainer}>
          <View style={Styles.pointContainer}>
            <Text style={Styles.pointTextStyle}>{points}</Text>
            <Image
              style={Styles.vhImageStyle}
              source={R.Images.Tab_Reward_Active}
            />
          </View>

          <Text style={Styles.rewardPointTextStyle}>
            {strings("RedeemFeature.rewardPoints")}
          </Text>

          <Text style={Styles.dateStyle}>
            {DateUtil.convertYYYYMMDDtoDDMMMYYYY(DateUtil.formattedTodayDate())}
          </Text>
        </View>
      </View>

      <Text style={Styles.rewardPointConversionStyle}>
        {strings("RedeemFeature.pointConversion")}
      </Text>

      <Text style={Styles.messageStyle}>{message}</Text>

      {/* Reward detail box */}
      <View style={Styles.rewardDetailWrapper}>
        {/* Current details */}
        <View
          style={[
            Styles.rewardItemWrapper,
            {
              backgroundColor: AppColor.LightGrayHighlightColor,
              justifyContent: "center",
            },
          ]}
        >
          <Text style={Styles.currentClassTextStyle}>
            {currentValue}
            <Text style={{ fontSize: 14 }}>{unit}</Text>
          </Text>
          <View style={Styles.lossContainer}>
            <Text style={Styles.currentClassDescTextStyle}>{currentClass}</Text>
          </View>
        </View>

        <View style={Styles.rewardItemWrapper}>
          <Text style={Styles.previousTextSize}>{previousCardMessage}</Text>
          {!!previousClass && (
            <View
              style={[
                Styles.lossContainer,
                { backgroundColor: AppColor.LightGrayHighlightColor },
              ]}
            >
              <Text
                style={[
                  Styles.currentClassDescTextStyle,
                  { color: "rgba(129,145,162,1)" },
                ]}
              >
                {previousClass}
              </Text>
            </View>
          )}
        </View>
      </View>

      <TouchableOpacity style={Styles.wrapperStyle} onPress={onClick}>
        <Text style={Styles.learnMoreTextStyle}>
          {strings("RedeemFeature.viewReward")}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default RewardCard;
