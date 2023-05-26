import React, { Component } from "react";
import { Text, View, TouchableOpacity, Animated } from "react-native";
import CardHolder from "./CardHolder";
import { LayoutType } from "./CardHolder";
import Styles from "../Styles";
import { R } from "../../../Resources/R";
import CardStyle from "./Styles";
import { strings } from "../../../utility/locales/i18n";

const { List, Grid } = LayoutType;

export default class RewardCardContainer extends Component {
  state = {
    layoutType: Grid,
    animation: new Animated.Value(0),
  };

  constructor(props) {
    super(props);

    this.canToggleLayout = true;
  }

  toggleLayoutType = () => {
    if (!this.canToggleLayout) {
      return;
    }

    const layoutType = this.state.layoutType;
    this.canToggleLayout = false;
    const finalValue = layoutType === Grid ? 1 : 0;

    this.setState(
      {
        layoutType: layoutType === Grid ? List : Grid,
      },
      () => {
        this.startAnimation(finalValue);
      }
    );

    setTimeout(() => {
      this.canToggleLayout = true;
    }, 500);
  };

  startAnimation = (toValue) => {
    Animated.timing(this.state.animation, {
      toValue: toValue,
      duration: 500,
    }).start();
  };

  getSwitchStyle = () => {
    const translationInterpolation = this.state.animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 10],
    });

    return {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: "rgba(208,68,76,1)",
      transform: [{ translateX: translationInterpolation }],
    };
  };

  render() {
    const rewardData = this.props.rewardData;
    const { layoutType } = this.state;
    const switchStyle = this.getSwitchStyle();

    return (
      <View style={{ margin: 8, marginBottom: 30 }}>
        <View style={CardStyle.rewardCardContainerStyle}>
          <Text style={Styles.yourRewardHistory}>Your Reward History</Text>
          <TouchableOpacity
            activeOpacity={1}
            hitSlop={{ top: 20, left: 10, right: 10, bottom: 20 }}
            style={CardStyle.switchContainerStyle}
            onPressOut={this.toggleLayoutType}
          >
            <Text
              style={{
                color:
                  layoutType == Grid
                    ? R.Colors.AppActionColor
                    : R.Colors.COLOR_TEXT_LIGHT,
              }}
            >
              {strings("RedeemFeature.grid")}
            </Text>
            <View style={CardStyle.switchNobStyle}>
              <Animated.View style={switchStyle} />
            </View>
            <Text
              style={{
                color:
                  layoutType == List
                    ? R.Colors.AppActionColor
                    : R.Colors.COLOR_TEXT_LIGHT,
              }}
            >
              {strings("RedeemFeature.list")}
            </Text>
          </TouchableOpacity>
        </View>

        {rewardData.map((arrayOf2, index) => {
          return (
            <CardHolder
              key={index}
              data={arrayOf2}
              layoutType={layoutType}
              animated={this.state.animation}
            />
          );
        })}
      </View>
    );
  }
}
