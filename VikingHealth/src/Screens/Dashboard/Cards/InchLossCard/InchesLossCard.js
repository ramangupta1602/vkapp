import React, { Component } from "react";
import { Text, View, TouchableOpacity, Image } from "react-native";
import { cardStyles } from "../CardStyles";
import { inject, observer } from "mobx-react";
import { R } from "../../../../Resources/R";
import { HeightWeightUtil } from "../../../../Library/Utils/HeightWeightUtil";
@observer
@inject("userAccountStore", "loginUserStore")
export default class InchesLossCard extends Component {
  render() {
    const {
      weightLoss,
      inchesLoss,
      weightUnit,
      heightUnit,
      onCardSelect,
    } = this.props;

    const weightText = HeightWeightUtil.weightUnit(weightUnit);
    const heightText = HeightWeightUtil.heightUnit(heightUnit);

    return (
      <View>
        <TouchableOpacity
          activeOpacity={1}
          onPress={onCardSelect}
          testID={"inchesLossCard"}
          accessibilityLabel={"inchesLossCard"}
        >
          <Text style={cardStyles.cardTitleStyle}>Weekly Progress</Text>
          <Text style={cardStyles.totalTextStyle}>Total</Text>
          <View style={cardStyles.horizontalSeparatorLine} />

          <View style={cardStyles.lossBoxStyle}>
            <SingleLoss
              title={`Body Measurements`}
              loss={inchesLoss}
              unitText={heightText}
              flex={1.3}
            />

            <View style={cardStyles.verticalSeparatorLine} />

            <SingleLoss
              title="Weight"
              loss={weightLoss}
              unitText={weightText}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const SingleLoss = ({ title, loss, unitText, flex = 1 }) => {
  // loss = previous - current
  const backgroundColor = loss < 0 ? "#e36978" : "#91dd66";
  const arrowIcon = loss < 0 ? R.Images.ArrowUp : R.Images.ArrowDown;
  const arrowId = loss < 0 ? "ArrowUp" : "ArrayDown";

  return (
    <View
      style={[cardStyles.lossContainerStyle]}
      testID={title}
      accessibilityLabel={title}
    >
      <Text
        style={cardStyles.lossTitleStyle}
        numberOfLines={2}
        ellipsizeMode="middle"
        textBreakStrategy="highQuality"
      >
        {title}
      </Text>

      <View
        style={[
          cardStyles.lossFigureContainer,
          { backgroundColor: backgroundColor, paddingBottom: 2 },
        ]}
      >
        <Image
          testID={arrowId}
          accessibilityLabel={arrowId}
          source={arrowIcon}
          style={cardStyles.lossIndicatorIconStyle}
        />
        <Text
          style={cardStyles.lossTextStyle}
          testID="loss"
          accessibilityLabel="loss"
        >
          {Math.abs(loss)} {unitText}
        </Text>
      </View>
    </View>
  );
};
