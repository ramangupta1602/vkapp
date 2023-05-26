import React from "react";
import { View, Text, Image } from "react-native";
import Style from "./Styles";
import { R } from "../../Resources/R";
import { strings } from "../../utility/locales/i18n";
import { BmiClass } from "./BmiData";

const BmiStatus = ({ bmi, data }) => {
  return (
    <View
      style={[
        Style.bmiStatusCardContainer,
        { backgroundColor: data.borderColor },
      ]}
    >
      <View style={Style.moodIconContainerStyle}>
        <Image
          source={
            data.name === BmiClass.healthy ? R.Images.excellent : R.Images.poor
          }
          style={Style.moodImage}
        />
      </View>

      <View style={Style.moodStatusContentStyle}>
        <Text style={Style.statusCardTitleTextStyle}>
          {data.name === BmiClass.healthy
            ? strings("bmiTable.congratulations")
            : strings("bmiTable.oops")}
        </Text>

        <View style={Style.figureContainerStyle}>
          <Text style={Style.statusCardBmiTextStyle}>{bmi}</Text>
          <Text style={Style.currentBmiTextStyle}>
            {strings("bmiTable.currentBMI")}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default BmiStatus;
