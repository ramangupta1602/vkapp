import React, { Component } from "react";
import { Text, View, Animated, Image } from "react-native";
import Styles from "./Styles";
import CardStyle from "./Styles";
import { R } from "../../../Resources/R";
import * as DateUtil from "../../../Library/Utils/DateUtil";
import { strings } from "../../../utility/locales/i18n";
import { dynamicSize } from "../../../utility/ResizeUtil";
import LinearGradient from "react-native-linear-gradient";

export default class RewardCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasLayout: false,
      hasDetailSize: false,
      textSize: 0,
      width: 0,
      animation: props.animated,
    };
  }

  getTitleTextAnimatingStyle = () => {
    const topInterpolation = this.state.animation.interpolate({
      inputRange: [0, 1],
      outputRange: [dynamicSize(100), dynamicSize(22)],
    });

    const fontSizeInterpolation = this.state.animation.interpolate({
      inputRange: [0, 1],
      outputRange: [14, 16],
    });

    return {
      top: topInterpolation,
      fontSize: fontSizeInterpolation,
    };
  };

  getAnimatingPointBoxStyle = () => {
    const topInterpolation = this.state.animation.interpolate({
      inputRange: [0, 1],
      outputRange: [dynamicSize(23), dynamicSize(10)],
    });

    return {
      padding: 12,
      justifyContent: "center",
      // alignItems: "center",
      borderRadius: 10,
      height: dynamicSize(63),
      top: topInterpolation,
    };
  };

  getAnimatingDetailStyle = () => {
    const topInterpolation = this.state.animation.interpolate({
      inputRange: [0, 1],
      outputRange: [dynamicSize(100), dynamicSize(34)],
    });

    const opacityInterpolation = this.state.animation.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 0, 1],
    });

    return {
      marginTop: 8,
      top: 0,
      left: 22,
      right: 100,
      position: "absolute",
      opacity: opacityInterpolation,
      transform: [{ translateY: topInterpolation }],
    };
  };

  getAnimatedListImageBackgroundStyle = () => {
    return {
      ...Styles.listCardStyle,
      resizeMode: "contain",
    };
  };

  getAnimatedGridImageBackgroundStyle = () => {
    const { animated } = this.props;

    const opacityInterpolation = animated.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    });

    return {
      ...Styles.gridCardStyle,
      opacity: opacityInterpolation,
    };
  };

  reducingFluxStyle = () => {
    const { animated } = this.props;

    const flexInterpolation = animated.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });

    return {
      flex: flexInterpolation,
    };
  };

  render() {
    const { hasLayout, hasDetailSize } = this.state;
    const { data } = this.props;

    const titleTextStyle = this.getTitleTextAnimatingStyle();
    const rewardPointBoxStyle = this.getAnimatingPointBoxStyle();
    const detailStyle = this.getAnimatingDetailStyle();

    const listImageBackgroundStyle = this.getAnimatedListImageBackgroundStyle();
    const gridImageBackgroundStyle = this.getAnimatedGridImageBackgroundStyle();
    const reducingFlexStyle = this.reducingFluxStyle();

    if (!data) {
      return null;
    }

    const { isQuoteCard } = data;

    return (
      <View style={{ flex: 1 }}>
        {/* Dummy components..................................... */}
        {!(hasLayout && hasDetailSize) && (
          <View style={[Styles.dummyCardContainerStyle]}>
            {!hasDetailSize && (
              <View
                style={[
                  Styles.dummyWidthCardStyle,
                  {
                    paddingLeft: 22,
                    paddingRight: 130,
                  },
                ]}
                onLayout={({
                  nativeEvent: {
                    layout: { height },
                  },
                }) => {
                  if (isQuoteCard) {
                    this.props.setHeight(0.01);
                  } else if (this.props.setHeight) {
                    //47 is the distance between card top and detail top (detail  = text detail in expanded view)
                    //50 is for top and bottom margin + padding
                    this.props.setHeight(height + 47 + 50); //
                  }

                  this.setState({ hasDetailSize: true });
                }}
              >
                <RewardCardDetails data={data.data} />
              </View>
            )}

            {!hasLayout && (
              <View
                style={{ flex: 1, margin: 8 }}
                onLayout={({
                  nativeEvent: {
                    layout: { width },
                  },
                }) => {
                  this.setState({ width: width / 2 - 10, hasLayout: true });
                }}
              />
            )}
          </View>
        )}

        {/* Actual content............................................ */}
        {hasLayout && hasDetailSize && !isQuoteCard && (
          <View style={Styles.singleCardContainerStyle}>
            <View style={Styles.singleCardStyle}>
              <LinearGradient
                colors={[data.startColor, data.endColor]}
                style={Styles.listImageContainerStyle}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Animated.Image
                  source={data.listImage}
                  style={listImageBackgroundStyle}
                />
              </LinearGradient>

              <Animated.Image
                resizeMode="stretch"
                source={data.gridImage}
                style={gridImageBackgroundStyle}
              />

              {/* Title Text Container */}
              <View style={Styles.translationContainerStyle}>
                <Animated.View style={reducingFlexStyle} />
                <Animated.Text
                  style={[titleTextStyle, CardStyle.cardTitleStyle]}
                >
                  {data ? data.title : ""}
                </Animated.Text>
                <View style={{ flex: 1 }} />
              </View>

              {/* Total text Container */}
              <View style={Styles.translationContainerStyle}>
                <View style={{ flex: 1 }} />
                <Animated.View style={rewardPointBoxStyle}>
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={[
                        CardStyle.totalRewardTextStyle,
                        { color: "#282727" },
                      ]}
                    >
                      {data.total}
                    </Text>
                    <Image
                      style={CardStyle.rewardIconStyle}
                      source={R.Images.RewardImages.DarkVHIcon}
                    />
                  </View>
                  <Text
                    style={[
                      CardStyle.pointsEarnedTextStyle,
                      { color: "#282727" },
                    ]}
                  >
                    {data.total > 1
                      ? strings("RedeemFeature.pointEarned")
                      : "Point Earned"}
                  </Text>
                </Animated.View>
                <Animated.View style={reducingFlexStyle} />
              </View>

              {/* Detail Text Container */}
              <Animated.View style={[detailStyle]}>
                <RewardCardDetails data={data.data} />
              </Animated.View>
            </View>
          </View>
        )}

        {isQuoteCard && (
          <View style={Styles.singleCardContainerStyle}>
            <QuoteCard />
          </View>
        )}
      </View>
    );
  }
}

const RewardCardDetails = ({ data }) => {
  return (
    <View>
      {data.map((item) => {
        return (
          <Text style={CardStyle.cardDetailTextStyle}>
            {item.desc}
            {"\n"}
            <Text style={{ fontFamily: "Lato-Bold" }}>
              {DateUtil.convertYYYYMMDDtoDDMMMYYYY(item.date)}
            </Text>
          </Text>
        );
      })}
    </View>
  );
};

const QuoteCard = () => {
  return (
    <View style={[Styles.singleCardStyle, Styles.quoteCardStyle]}>
      <Image
        source={R.Images.quotesProverb}
        style={Styles.quoteImageStyle}
        resizeMode="stretch"
      />
      <Text style={Styles.quoteTextStyle}>
        {strings("RedeemFeature.quoteMessage")}
      </Text>
    </View>
  );
};
