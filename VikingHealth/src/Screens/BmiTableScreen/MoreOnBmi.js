import React, { Component } from "react";
import { Text, View, TouchableOpacity, Image } from "react-native";
import Style from "./Styles";

import { strings } from "../../utility/locales/i18n";
import { R } from "../../Resources/R";

export default class MoreOnBmi extends Component {
  render() {
    return (
      <TouchableOpacity onPress={() => {}} activeOpacity={1}>
        <View style={Style.infoPopupView}>
          <View style={{ marginTop: 34, marginLeft: 34, marginRight: 32 }}>
            <BulletMarkText
              color="#8191A2"
              text={strings("bmiTable.calculationWeightText")}
            />
            <View style={{ marginTop: 11 }} />
            <BulletMarkText
              color="#8191A2"
              text={strings("bmiTable.calculationHeightText")}
            />

            <Text style={Style.calculateText}>
              {strings("common_message.calculate")}
            </Text>

            <Image
              source={R.Images.Bmi_formula}
              resizeMode="stretch"
              style={{
                width: "100%",
                marginRight: 0,
                marginTop: 9,
              }}
            />

            <View style={{ alignItems: "flex-end", flex: 1, marginTop: 6 }}>
              <BulletMarkText
                color="#F8BA34"
                text="You are pre - Obese"
                textColor="black"
              />
            </View>

            <View style={Style.proTipContainer}>
              <Text style={Style.proTipTextStyle}>
                {strings("bmiTable.bmiProTip")}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const BulletMarkText = ({ color, text, textColor }) => {
  return (
    <View style={Style.bulletMarkContainer}>
      <View style={[Style.bulletStyle, { backgroundColor: color }]} />
      <Text style={[Style.bulletText, { color: textColor || color }]}>
        {text}
      </Text>
    </View>
  );
};
