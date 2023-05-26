import React, { Component } from "react";
import { Easing, View, Animated, Dimensions } from "react-native";
import Modal from "react-native-modal";
import RedeemEarnedView from "./RedeemEarnedView";
import RedeemView from "./RedeemView";
import Styles from "./Styles";

const { width, height } = Dimensions.get("window");
export default class RedeemModal extends Component {
  state = {
    animation: new Animated.Value(0),
  };

  componentDidMount() {}

  componentDidUpdate(prevProps) {
    if (this.props.hasRedeemed != prevProps.hasRedeemed) {
      if (this.props.hasRedeemed) {
        this.startAnimation();
      }
    }
  }

  startAnimation = () => {
    Animated.timing(this.state.animation, {
      toValue: 1,
      duration: 500,
      easing: Easing.linear,
    }).start();
  };

  getRedeemCardStyle = () => {
    if (!this.redeemCardHeight) {
      return;
    }

    const opacityInterpolation = this.state.animation.interpolate({
      inputRange: [0, 0.5, 0.5001, 1],
      outputRange: [1, 1, 0, 0],
    });

    return {
      opacity: opacityInterpolation,
      position: "absolute",
      zIndex: opacityInterpolation,
      width: "100%",
    };
  };

  getRedeemEarnedCardStyle = () => {
    if (!this.redeemEarnedCardHeight) {
      return { opacity: 0 };
    }

    const opacityInterpolation = this.state.animation.interpolate({
      inputRange: [0, 0.5, 0.5001, 1],
      outputRange: [0, 0, 1, 1],
    });

    return {
      opacity: opacityInterpolation,
      position: "absolute",
      zIndex: opacityInterpolation,
      width: "100%",
    };
  };

  getContainerStyle = () => {
    if (!this.redeemCardHeight && !this.redeemEarnedCardHeight) {
      return { opacity: 0 };
    }

    const heightInterpolation = this.state.animation.interpolate({
      inputRange: [0, 1],
      outputRange: [this.redeemCardHeight, this.redeemEarnedCardHeight],
    });

    const rotationInterpolation = this.state.animation.interpolate({
      inputRange: [0, 0.5, 0.5001, 1],
      outputRange: ["0deg", "90deg", "-90deg", "0deg"],
    });

    return {
      height: heightInterpolation,
      transform: [{ rotateY: rotationInterpolation }],
      flex: 1,
    };
  };

  updateAfterLayout = () => {
    if (this.redeemCardHeight && this.redeemEarnedCardHeight) {
      this.setState({});
    }
  };

  render() {
    const { isVisible, onClick } = this.props;
    const redeemCardAnimatingStyle = this.getRedeemCardStyle();
    const redeemEarnedCardAnimatingStyle = this.getRedeemEarnedCardStyle();
    const animatingContainerStyle = this.getContainerStyle();

    return (
      <Modal
        isVisible={isVisible}
        backdropColor="rgba(0,0,0,0.39)"
        style={Styles.modalStyle}>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
          }}>
          <Animated.View
            style={[Styles.containerStyle, animatingContainerStyle]}>
            <Animated.View
              style={[redeemCardAnimatingStyle, { width: "100%" }]}
              onLayout={({
                nativeEvent: {
                  layout: { height, width },
                },
              }) => {
                this.redeemCardHeight = height;
                this.cardWidth = width;
                this.updateAfterLayout();
              }}>
              <RedeemView
                button={this.props.children}
                onClose={onClick}
                totalReward={this.props.totalReward}
              />
            </Animated.View>

            <Animated.View
              style={[redeemEarnedCardAnimatingStyle]}
              onLayout={({
                nativeEvent: {
                  layout: { height },
                },
              }) => {
                this.redeemEarnedCardHeight = height;
                this.updateAfterLayout();
              }}>
              <RedeemEarnedView
                onClick={onClick}
                totalReward={this.props.totalReward}
              />
            </Animated.View>
          </Animated.View>
        </View>
      </Modal>
    );
  }
}
