import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { BMIScaleDashboard } from "Components";
import { cardStyles } from "../CardStyles";
import { inject, observer } from "mobx-react";

@inject("userAccountStore", "loginUserStore")
@observer
export class WeightCard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const targetWeight = this.props.userAccountStore.displayTargetWeight;
    const { displayWeightUnit, weightUnitText } = this.props.loginUserStore;
    const { weightLog, onCardSelect } = this.props;
    const bmi = this.props.userAccountStore.bmi(weightLog);

    return (
      <View>
        <TouchableOpacity
          style={{ marginBottom: -16 }}
          activeOpacity={1}
          onPress={onCardSelect}
          accessibilityLabel={"weightCard"}
          testID={"weightCard"}
        >
          <Text style={cardStyles.cardTitleStyle}>Weight</Text>
          <Text style={cardStyles.cardFigureStyle}>
            {weightLog.displayWeight(displayWeightUnit)}
            <Text style={cardStyles.unitStyle}>{weightUnitText}</Text>
          </Text>
          <Text style={cardStyles.subTextStyle}>Current</Text>

          <Text
            style={[cardStyles.cardFigureStyle, cardStyles.targetTopMargin]}
          >
            {targetWeight}
            <Text style={cardStyles.unitStyle}>{weightUnitText}</Text>
          </Text>
          <Text style={cardStyles.subTextStyle}>Target</Text>
          <TouchableOpacity
            accessibilityLabel={"bmiBubble"}
            testID={"bmiBubble"}
            activeOpacity={1}
            style={{
              marginTop: 0,
              marginLeft: -16,
              marginRight: -16,
            }}
            onPress={() => {
              this.props.onBmiBubbleTap(bmi);
            }}
          >
            <BMIScaleDashboard bmi={bmi} />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    );
  }
}
