import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import Styles from "./styles";
import { R } from "../../Resources/R";
import { SliderView } from "../../Components";
import * as WeightLogQueries from "AppSyncQueries/WeightLogQueries";
import { Query } from "react-apollo";
import { HeightWeightUtil } from "../../Library/Utils/HeightWeightUtil";
import { inject, observer } from "mobx-react";
import WeightLossLogQueryComponent from "../LogQueryComponent/WeightLossLogQueryComponent";
import InchesLossLogQueryComponent from "../LogQueryComponent/InchesLossLogQueryComponent";
import { CTAButton } from "../../Components";

@observer
@inject("userAccountStore", "loginUserStore", "gamificationStore")
export default class SummaryPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      weightLoss: 0,
      inchesLoss: 0,
      isLoading: true,
    };
  }

  updateWeightLog = (weightLoss) => {
    if (this.state.weightLoss != weightLoss) {
      this.setState({
        weightLoss,
      });
    }
  };

  updateInchesLoss = (inchesLoss) => {
    if (this.state.inchesLoss != inchesLoss) {
      this.setState({
        inchesLoss,
      });
    }
  };

  getMessage = () => {
    const { weightLoss, inchesLoss } = this.state;
    const weightUnit = this.props.loginUserStore.displayWeightUnit;
    const heightUnit = this.props.loginUserStore.displayHeightUnit;

    let message = "";
    let image = R.Images.killingIt;
    const displayHeightUnit = heightUnit === 0 ? "inch(es)" : "cm(s)";
    const displayWeightUnit = weightUnit === 0 ? "kg(s)" : "lbs";

    if (weightLoss > 0) {
      message = `You have lost ${weightLoss} ${displayWeightUnit} and `;

      if (inchesLoss > 0) {
        message += `${inchesLoss} ${displayHeightUnit} this week.`;
      } else if (inchesLoss < 0) {
        message += ` gained ${-inchesLoss} ${displayHeightUnit} this week.`;
      } else {
        message += `haven't lost any ${displayHeightUnit} this week.`;
      }
    } else if (weightLoss < 0) {
      image = R.Images.weightGainBitmoji;
      message = `You have gained ${-weightLoss} ${displayWeightUnit} and `;

      if (inchesLoss > 0) {
        message += `lost ${inchesLoss} ${displayHeightUnit} this week.`;
      } else if (inchesLoss < 0) {
        message += `${-inchesLoss} ${displayHeightUnit} this week.`;
      } else {
        message += `haven't lost any ${displayHeightUnit} this week.`;
      }
    } else {
      image = R.Images.noWeightLossBitmoji;

      if (inchesLoss > 0) {
        message = `You have lost ${inchesLoss} ${displayHeightUnit} and haven't lost any weight this week.`;
      } else if (inchesLoss < 0) {
        message = `You have gained ${-inchesLoss} ${displayHeightUnit} and haven't lost any weight this week.`;
      } else {
        message = `You haven't lost any weight or ${displayHeightUnit} this week.`;
      }
    }

    return { message, image };
  };

  render() {
    const userId = this.props.userAccountStore.username;
    const weightUnit = this.props.loginUserStore.displayWeightUnit;
    const heightUnit = this.props.loginUserStore.displayHeightUnit;

    const { message, image } = this.getMessage();

    const {
      losingPhaseStartDate,
      programEndDate,
    } = this.props.userAccountStore;

    return (
      <View
        style={[
          Styles.gamificationCardStyles,
          {
            width: "100%",
            paddingTop: 12,
            paddingHorizontal: 12,
          },
        ]}
      >
        <TouchableWithoutFeedback onPress={this.props.onClose}>
          <Image
            style={[localStyle.closeIconStyle]}
            source={R.Images.closeIcon}
          />
        </TouchableWithoutFeedback>

        <Text style={[Styles.titleStyle, localStyle.titleStyle]}>
          your journey
        </Text>

        <Image
          style={[Styles.imageStyle, localStyle.imageStyle]}
          source={image}
        />

        <Text style={[localStyle.lossMessageStyle]}>{message}</Text>

        {Platform.OS === "ios" ? (
          <SliderView
            style={[localStyle.sliderStyle]}
            textStyle={[localStyle.sliderTextStyle]}
            onCardSelect={this.props.onDragCompleted}
          />
        ) : (
          <CTAButton
            label="VIEW YOUR JOURNEY"
            onClick={this.props.onDragCompleted}
            isEnabled
            style={[localStyle.ctaButton]}
          />
        )}

        <WeightLossLogQueryComponent
          userId={userId}
          updateData={this.updateWeightLog}
          programStartDate={losingPhaseStartDate}
          programEndDate={programEndDate}
          weightUnit={weightUnit}
        />

        <InchesLossLogQueryComponent
          userId={userId}
          updateData={this.updateInchesLoss}
          programStartDate={losingPhaseStartDate}
          programEndDate={programEndDate}
          heightUnit={heightUnit}
        />
      </View>
    );
  }
}

const localStyle = StyleSheet.create({
  ctaButton: {
    marginLeft: 16,
    marginRight: 16,
    marginTop: 31,
    borderRadius: 5,
    backgroundColor: "#CE363E",
  },
  titleStyle: {
    color: "#024481",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Lato-Semibold",
    textTransform: "uppercase",
  },

  closeIconStyle: {
    height: 24,
    width: 24,
    alignSelf: "flex-end",
  },

  imageStyle: {
    width: 212,
    height: 216,
    marginBottom: 0,
    marginTop: 30,
  },

  lossMessageStyle: {
    color: "#024481",
    fontFamily: "Lato-Semibold",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.57,
    lineHeight: 22,
    textAlign: "center",
    marginTop: 21,
    marginBottom: 20,
  },

  sliderStyle: {
    marginLeft: 0,
    marginRight: 0,
    marginTop: 20,
    marginBottom: 33,
  },

  sliderTextStyle: {
    color: "#D0444C",
  },

  /**
   * .you-have-lost-3-kg-a {
	height: 44px;
	width: 249px;
	color: #024481;
	font-family: Lato;
	font-size: 18px;
	font-weight: 600;
	letter-spacing: 0.57px;
	line-height: 22px;
	text-align: center;
}
   */
});
