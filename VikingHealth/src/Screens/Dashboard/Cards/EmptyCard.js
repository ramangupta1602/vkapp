import React, { Component } from "react";
import {
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
  Animated,
  Text,
  LayoutAnimation,
  Platform,
} from "react-native";
import { cardStyles } from "./CardStyles";
import { R } from "Resources";
import { USER_TYPE } from "Library/Constants";

const CARD_HEIGHT = 164;
const CARD_HEIGHT_COLLAPSED = 54;
const LARGE_ICON_SIZE = 48;
const SMALL_ICON_SIZE = 38;

export class EmptyCard extends Component {
  constructor(props) {
    super(props);
    const shouldShowContent = false;
    this.title = props.title;
    this.subTitle = props.subTitle;
    this.icon = props.icon;
    this.width = 0;
    this.state = {
      isLayoutLoaded: false,
      animation: new Animated.Value(0),
      shouldShowContent,
      contentHeightObtained: false,
    };

    this.contentSize = 0;

    // data is present initially
    if (props.shouldShowContent) {
      this.startAnimationExplicitly();
    }
  }

  // used only when we have data initially and empty view not show
  // in that case there is a glitch, therefore I am first showing
  // empty state and then animating it.
  startAnimationExplicitly = () => {
    setTimeout(() => {
      this.setState({ shouldShowContent: true });
      this.startAnimation(1);
    }, 750);
  };

  _cardClick = () => {
    if (typeof this.props.onClick === "function") {
      this.props.onClick();
    }
  };

  getLogoStyle = () => {
    if (!this.width || this.width === 0) {
      return { opacity: 0 };
    }

    const initialLeft = this.width / 2 - LARGE_ICON_SIZE / 2;

    const logoSizeInterpolator = this.state.animation.interpolate({
      outputRange: [LARGE_ICON_SIZE, SMALL_ICON_SIZE],
      inputRange: [0, 1],
    });

    const leftInterpolator = this.state.animation.interpolate({
      inputRange: [0, 1],
      outputRange: [initialLeft, 16],
    });

    const topInterpolator = this.state.animation.interpolate({
      inputRange: [0, 1],
      outputRange: [26, 16],
    });

    return {
      height: logoSizeInterpolator,
      width: logoSizeInterpolator,
      padding: 16,
      left: leftInterpolator,
      top: topInterpolator,
      position: "absolute",
      resizeMode: "contain",
    };
  };

  getIconContainerStyle = () => {
    const heightInterpolator = this.state.animation.interpolate({
      outputRange: [CARD_HEIGHT, CARD_HEIGHT_COLLAPSED],
      inputRange: [0, 1],
    });

    return {
      flexDirection: "row",
      alignContent: "space-around",
      width: "100%",
      height: heightInterpolator,
    };
  };

  getTitleContainerStyle = () => {
    const opacityInterpolator = this.state.animation.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 0, 0],
    });

    return {
      marginTop: 82, // initial top margin for logo (24) + ini. logo height (48) + margin b/w logo and view
      width: "100%",
      opacity: opacityInterpolator,
    };
  };

  getContentStyle = () => {
    const translationInterpolation = this.state.animation.interpolate({
      inputRange: [0, 1],
      outputRange: [10, 0],
    });

    return {
      padding: 16,
      paddingTop: 10,
      transform: [{ translateY: translationInterpolation }],
      opacity: this.state.animation,
      overflow: "hidden",
    };
  };

  startAnimation = (finalValue) => {
    if (Platform.OS === "ios") {
      LayoutAnimation.linear();
    }

    if (this.props.startAnimation && this.props.shouldShowContent) {
      this.props.startAnimation();
    }

    Animated.timing(this.state.animation, {
      toValue: finalValue,
      duration: 750,
    }).start();
  };

  componentDidUpdate = (prevProps) => {
    if (prevProps.shouldShowContent !== this.props.shouldShowContent) {
      if (this.props.shouldShowContent) {
        this.setState({ shouldShowContent: true });
        this.startAnimation(1);
      } else {
        this.setState({ shouldShowContent: false }, () => {
          this.startAnimation(0);
        });
      }
    }

    if (prevProps.isAddedToday !== this.props.isAddedToday) {
      this.setState({});
    }
  };

  render() {
    const {
      icon,
      shouldShowAddButton,
      isAddedToday,
      title,
      subTitle,
    } = this.props;
    const { isLayoutLoaded } = this.state;
    const logoStyle = this.getLogoStyle();
    const iconContainerStyle = this.getIconContainerStyle();
    const titleContainerStyle = this.getTitleContainerStyle();
    const contentStyle = this.getContentStyle();
    const { shouldShowContent } = this.state;
    const { shouldShowContent: shouldShowContentFromProps } = this.props;

    return (
      <TouchableWithoutFeedback
        testID={title}
        accessibilityLabel={title}
        onPress={() => {
          if (!shouldShowContent) {
            this._cardClick();
          }
        }}
      >
        <View>
          {/* Empty view for getting width required for animations... */}
          {!isLayoutLoaded && (
            <View
              style={cardStyles.singleRecordContainer}
              onLayout={({
                nativeEvent: {
                  layout: { width },
                },
              }) => {
                this.width = width;
                this.setState({ isLayoutLoaded: true });
              }}
            />
          )}

          {/* This block contain all the information as well as empty state */}
          {isLayoutLoaded && (
            <View style={cardStyles.singleRecordContainer}>
              {/* icon header container */}
              <Animated.View style={iconContainerStyle}>
                <Animated.Image source={icon} style={logoStyle} />

                {shouldShowAddButton && (
                  <TouchableWithoutFeedback
                    onPress={() => {
                      if (!isAddedToday) {
                        this._cardClick();
                      }
                    }}
                    testID={"addIcon"}
                    accessibilityLabel={"addIcon"}
                  >
                    <Image
                      style={cardStyles.addIconStyle}
                      source={
                        isAddedToday ? R.Images.greenTick : R.Images.plusRed
                      }
                    />
                  </TouchableWithoutFeedback>
                )}

                {this.props.type === "weightCard" &&
                  this.props.userType === USER_TYPE.ADMIN && (
                    <TouchableOpacity
                      style={cardStyles.editPencilButtonStyle}
                      onPress={this.props.addData}
                      testID={"edit"}
                      accessibilityLabel={"edit"}
                      hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
                    >
                      <Image source={R.Images.editPencil} />
                    </TouchableOpacity>
                  )}

                {/* Title holder */}
                <Animated.View style={titleContainerStyle}>
                  <Text style={cardStyles.emptyCardTitle}>{title}</Text>
                  <Text style={cardStyles.emptyCardSubtitle}>{subTitle}</Text>
                </Animated.View>
              </Animated.View>

              {/* Detail part */}
              {shouldShowContent && shouldShowContentFromProps && (
                <Animated.View style={contentStyle}>
                  {this.props.children}
                </Animated.View>
              )}
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
