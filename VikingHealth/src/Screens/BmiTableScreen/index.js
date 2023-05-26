import React, { Component } from "react";
import { Text, View, Image, Animated, TouchableOpacity } from "react-native";
import { BmiData } from "./BmiData";
import { strings } from "../../utility/locales/i18n";
import { R } from "../../Resources/R";
import { PageTitle, CrossButton } from "Components";
import Style from "./Styles";
import BmiStatus from "./BmiStatus";
import BmiList from "./BmiList";
import BmiCard from "./BmiCard";
import BmiTable from "./BmiTable";
import { inject, observer } from "mobx-react";
import MoreOnBmi from "./MoreOnBmi";
import Triangle from "react-native-triangle";

const ANIMATION_DURATION = 500;
const TRANSITION_TO_SCREEN_CUTOFF_VALUE = 0.001;

@observer
@inject("userAccountStore", "loginUserStore")
export class BmiTableScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);

    this.userBmi = this.props.navigation.getParam("bmi", 25);
    this.bmiClassName = "Normal";
    this.BmiData = BmiData;
    this.currentBmiClass = BmiData[0];

    this.flagUserBmiClass(this.userBmi);

    this.state = {
      shouldShowInfo: false,
      startTransition: false,
      transitionCompleted: false,
      animatedValue: new Animated.Value(0),
      selectedIndex: 0,
      selectedViewLayoutParam: { x: 0, y: 0, width: 0, height: 0 },
      isAnimating: false,
    };

    this.seeMoreLayoutParam = { x: 0, y: 0 };
  }

  componentDidMount() {}

  getSeeMoreTextLayoutParam = () =>
    new Promise((resolve) => {
      if (this.seeMoreRef) {
        this.seeMoreRef.measure((x, y, width, height, pageX, pageY) => {
          this.seeMoreLayoutParam = { x: pageX, y: pageY };
          resolve();
        });
      } else {
        this.seeMoreLayoutParam = { x: 0, y: 0 };
        resolve();
      }
    });

  flagUserBmiClass = (userBmi) => {
    this.BmiData = this.BmiData.map((data) => {
      const { maxValue, minValue } = data;
      const duplicateData = data;
      if (minValue <= userBmi && userBmi <= maxValue) {
        duplicateData.isUserInRange = true;
        this.bmiClassName = data.name;
        this.currentBmiClass = data;
      } else {
        duplicateData.isUserInRange = false;
      }
      return duplicateData;
    });
  };

  onCardClicked = async ({ index, layout }) => {
    if (this.state.isAnimating === true) {
      return;
    }

    await this.getSeeMoreTextLayoutParam();
    this.setState(
      {
        startTransition: true,
        selectedIndex: index,
        selectedViewLayoutParam: layout,
        transitionCompleted: false,
        isAnimating: true,
      },
      () => {
        this.startAnimation();
      }
    );
  };

  toggleInfoCard = () => {
    const currentVisibility = this.state.shouldShowInfo;
    this.setState({ shouldShowInfo: !currentVisibility });
  };

  startAnimation = () => {
    Animated.timing(this.state.animatedValue, {
      toValue: 1,
      duration: ANIMATION_DURATION,
    }).start(() => {
      this.setState({
        transitionCompleted: true,
        isAnimating: false,
      });
    });
  };

  collapseAnimation = () => {
    if (this.state.isAnimating === true) {
      return;
    }

    this.setState(
      {
        transitionCompleted: false,
        isAnimating: true,
      },
      () => {
        this.startReverseAnimation();
      }
    );
  };

  startReverseAnimation = () => {
    Animated.timing(this.state.animatedValue, {
      toValue: 0,
      duration: ANIMATION_DURATION,
    }).start(() => {
      this.setState({
        startTransition: false,
        isAnimating: false,
        selectedIndex: 0,
        selectedViewLayoutParam: { x: 0, y: 0 },
        transitionCompleted: true,
      });
    });
  };

  getSeeMoreStyle = () => {
    const initialPosition = this.seeMoreLayoutParam.y - 29;
    const finalPosition = 16; // table screen margin top (in total 28 )

    const top = this.state.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [initialPosition, finalPosition],
    });

    const opacityInterpolation = this.state.animatedValue.interpolate({
      inputRange: [0, 0.001, 0.9, 0.95, 0.999, 1],
      outputRange: [0, 1, 1, 1, 1, 0],
    });

    return {
      position: "absolute",
      top,
      left: this.seeMoreLayoutParam.x,
      right: 16, // container padding
      opacity: opacityInterpolation,
    };
  };

  getTransitionCardStyle = () => {
    const { selectedViewLayoutParam } = this.state;
    const initialPosition = selectedViewLayoutParam.y - 15;
    const finalPosition = 101; //  34(top margin) + 22 (want to see height) + 4 (margin ) + 34 (scroll text)

    const top = this.state.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [initialPosition, finalPosition],
    });

    const opacityInterpolation = this.state.animatedValue.interpolate({
      inputRange: [
        0,
        TRANSITION_TO_SCREEN_CUTOFF_VALUE,

        1 - TRANSITION_TO_SCREEN_CUTOFF_VALUE,
        1,
      ],
      outputRange: [0, 1, 1, 0],
    });

    return {
      position: "absolute",
      top,
      left: selectedViewLayoutParam.x,
      opacity: opacityInterpolation,
      width: selectedViewLayoutParam.width,
    };
  };

  getListTransitionStyle = () => {
    const opacityInterpolation = this.state.animatedValue.interpolate({
      inputRange: [0, 0.02, 1],
      outputRange: [1, 0, 0],
    });

    return {
      opacity: opacityInterpolation,
    };
  };

  render() {
    const {
      startTransition,
      selectedIndex,
      shouldShowInfo,
      animatedValue,
      transitionCompleted,
    } = this.state;

    const transitionLayerSeeMoreViewStyle = this.getSeeMoreStyle();
    const transitionLayerCardStyle = this.getTransitionCardStyle();
    const listTransitionStyle = this.getListTransitionStyle();

    const { displayWeightUnit, displayHeightUnit } = this.props.loginUserStore;

    return (
      <View style={Style.containerStyle}>
        <Animated.ScrollView
          style={[Style.containerStyle, listTransitionStyle]}
        >
          {/* Real Screen */}
          <View style={{ opacity: 1 }}>
            {/* Navigation Bar */}
            <View style={[R.AppStyles.headerContainer, { paddingLeft: 8 }]}>
              <CrossButton
                onCrossClicked={() => this.props.navigation.goBack()}
              />
              <View style={Style.bmiQuestionStyle}>
                <PageTitle title={strings("bmiTable.bmi?")} />
              </View>
            </View>

            {/* Content */}
            <View style={Style.contentContainerStyle}>
              <Text style={Style.bmiAnswer}>
                {strings("bmiTable.bmiAnswer")}
              </Text>

              {/* More info */}
              <View style={Style.moreInfoContainer}>
                <Text style={Style.moreInfoTextStyle}>
                  {strings("bmiTable.moreOnBMI")}
                </Text>
                <View>
                  <TouchableOpacity
                    style={Style.infoImageContainer}
                    hitSlop={{ bottom: 10, left: 10, right: 10, top: 10 }}
                    ref={(ref) => {
                      this.infoRef = ref;
                    }}
                    activeOpacity={1}
                    onPress={this.toggleInfoCard}
                  >
                    <Image
                      source={R.Images.info}
                      style={Style.moreInfoImageStyle}
                    />

                    {shouldShowInfo && (
                      <View style={{ marginLeft: 5, marginTop: 4 }}>
                        <Triangle
                          width={15}
                          height={7}
                          color={"white"}
                          direction={"up"}
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
              {shouldShowInfo && <MoreOnBmi />}

              {/* User Bmi Status card */}
              <BmiStatus bmi={this.userBmi} data={this.currentBmiClass} />

              <Text
                style={Style.seeMore}
                ref={(ref) => {
                  this.seeMoreRef = ref;
                }}
              >
                {strings("bmiTable.seeMore")}
              </Text>

              {/* Bmi list */}
              <BmiList
                BmiData={this.BmiData}
                onCardClicked={this.onCardClicked}
                bmi={this.userBmi}
              />

              <View />
            </View>
          </View>
        </Animated.ScrollView>

        {/* Table Screen */}
        {startTransition && (
          <View style={Style.absoluteStyle}>
            <BmiTable
              animatedValue={animatedValue}
              index={selectedIndex}
              data={this.BmiData[selectedIndex]}
              onCardClicked={this.collapseAnimation}
              bmi={this.userBmi}
              heightUnit={displayHeightUnit}
              weightUnit={displayWeightUnit}
            />
          </View>
        )}

        {/* Transition layer */}
        {startTransition && !transitionCompleted && (
          <React.Fragment>
            {/* Want to see BMI Chat text transition animation container */}
            <Animated.View style={transitionLayerSeeMoreViewStyle}>
              <Text style={Style.seeMore}>{strings("bmiTable.seeMore")}</Text>
              <Animated.Text
                style={[
                  Style.seeMoreMessageStyle,
                  {
                    opacity: this.state.animatedValue,
                  },
                ]}
                numberOfLines={2}
              >
                {strings("bmiTable.seeMoreMessage")}
              </Animated.Text>
            </Animated.View>

            <Animated.View style={transitionLayerCardStyle}>
              <BmiCard
                animating={animatedValue}
                index={selectedIndex}
                data={this.BmiData[selectedIndex]}
              />
            </Animated.View>
          </React.Fragment>
        )}

        {/* More info layer */}
      </View>
    );
  }
}
