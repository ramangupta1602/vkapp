import React, { Component } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  PanResponder,
  Animated,
  StyleSheet,
} from "react-native";

import { cardStyles } from "../CardStyles";
import { styles } from "./Styles";
import { USER_TYPE } from "Library/Constants";

import { SliderView } from "../../../../Components";

const AnimatedText = Animated.createAnimatedComponent(Text);

export class WeightLossSummaryCardContainer extends Component {
  constructor(props) {
    super(props);

    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,

      onPanResponderGrant: (evt, gestureState) => {
        this.props.changeScrolling(false);
      },

      onPanResponderMove: (evt, gestureState) => {
        const { dx } = gestureState;
        this.setState({
          xOffset: dx / 1.2,
        });

        this.opacityAnimation.setValue(dx / 1.2);

        if (dx > this.xDropOffset) {
          this.props.onCardSelect();
        }
      },

      onPanResponderTerminationRequest: () => true,

      onPanResponderRelease: (evt, gestureState) => {
        this.props.changeScrolling(true);
        this.setState({
          xOffset: 0,
        });
        this.opacityAnimation.setValue(0);
      },

      onPanResponderTerminate: (evt, gestureState) => {
        this.props.changeScrolling(true);
        this.setState({
          xOffset: 0,
        });
        this.opacityAnimation.setValue(0);
      },

      onShouldBlockNativeResponder: (evt, gestureState) => {
        return true;
      },
    });

    this.opacityAnimation = new Animated.Value(0);
  }

  state = {
    xOffset: 0,
  };

  render() {
    const {
      lastWeekLostData,
      userType,
      firstName,
      weightUnitText,
    } = this.props;

    const name = firstName.substring(0, 15);
    const roundedLostData = lastWeekLostData.toFixed(1);

    const appendingTextNegative =
      userType == USER_TYPE.PATIENT ? "You haven't" : `${name} hasn't`;

    const appendingTextPositive =
      userType == USER_TYPE.PATIENT ? "You have" : `${name} has`;

    //const yourText = userType == USER_TYPE.PATIENT ? " your" : "";

    let text = "";

    if (lastWeekLostData === 0) {
      text = `${appendingTextNegative} lost any weight this week`;
    } else if (lastWeekLostData > 0) {
      text = `${appendingTextPositive} lost ${roundedLostData} ${weightUnitText} this week`;
    } else {
      text = `${appendingTextPositive} gained ${-roundedLostData} ${weightUnitText} this week`;
    }

    return (
      <TouchableOpacity
        activeOpacity={1}
        style={[cardStyles.emptyCard, { paddingVertical: 0, paddingRight: 0 }]}>
        <View style={[localStyle.containerStyle]}>
          <View style={styles.containerStyle}>
            <Text style={[styles.summaryTextStyle]}>{text}</Text>

            <SliderView
              onCardSelect={this.props.onCardSelect}
              changeScrolling={this.props.changeScrolling}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const localStyle = StyleSheet.create({
  containerStyle: { flexDirection: "row", flex: 1 },
  sliderMiddleStyle: { flex: 1, marginLeft: 18, marginRight: 19.5 },
  slideTextStyle: {
    color: "#D0444C",
    fontFamily: "Lato-Regular",
    fontSize: 12,
    letterSpacing: 0.32,
    lineHeight: 15,
  },

  /**
  
  .slide-to-view-your-j {
	height: 15px;
	width: 144px;
	color: #D0444C;
	font-family: Lato;
	font-size: 12px;
	letter-spacing: 0.32px;
	line-height: 15px;
}
  */
});
