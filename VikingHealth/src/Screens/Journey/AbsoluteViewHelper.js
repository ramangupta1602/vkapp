import React from "react";
import { View, Animated, Image, Text } from "react-native";
import style from "./styles";
import AppUtil from "../../Library/Utils/AppUtil";
import {
  Active1Month,
  Active2Month,
  Active3Month,
  Inactive1Month,
  Inactive2Month,
  Inactive3Month,
  ActiveTarget,
  InactiveTarget,
  Active6Month,
  Inactive6Month,
  Active5Month,
  Active4Month,
  Inactive4Month,
  Inactive5Month,
} from "../../Resources/Images";
import moment from "moment";
import { USER_TYPE } from "Library/Constants";
import CycleIndicator from "./Badges/CycleIndicator";

const AnimatedText = Animated.createAnimatedComponent(Text);

export const getStartProgramView = ({
  x,
  y,
  markerImage,
  programStartDate,
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        position: "absolute",
        top: y - 30,
        left: x - 10,
        height: 40,
      }}
    >
      <Image style={{ marginTop: 10 }} source={markerImage} />

      <View>
        <Text
          style={[
            style.deactivatedMonthNameTextStyle,
            {
              color: "#024481",
              paddingLeft: 10,
            },
          ]}
        >
          Start of program
          {"\n"}
          <Text style={{ color: "#8191A2" }}>
            {moment(programStartDate).format("DD/MM/YYYY")}
          </Text>
        </Text>
      </View>
    </View>
  );
};

export const getBadgeView = ({
  index,
  x,
  y,
  firstName,
  monthOutputRange,
  loss,
  userType,
  weightUnitText,
  displayTargetWeight,
  isTargetView,
  displayMonth,
  width,
}) => {
  let activeImageSource = Active1Month;
  let inactiveImageSource = Inactive1Month;
  let inActiveText = AppUtil.getMonthText(displayMonth);
  let activeInputRange = [index, index + 1.1, index + 1.2];
  let inactiveInputRange = [index, index + 0.8, index + 0.91];
  let activeMonthText = "";
  let monthName = inActiveText;
  let weightTextColor = "#8191A2";

  // when image is not present we have to move when image is not present.
  let textOffsetAccordingToImage = 0;

  const days = 30 * (index + 1);

  const currentMonth = displayMonth + 1;
  if (currentMonth % 6 === 0) {
    activeImageSource = Active6Month;
    inactiveImageSource = Inactive6Month;
  } else if (currentMonth % 5 === 0) {
    activeImageSource = Active5Month;
    inactiveImageSource = Inactive5Month;
  } else if (currentMonth % 4 === 0) {
    activeImageSource = Active4Month;
    inactiveImageSource = Inactive4Month;
  } else if (currentMonth % 3 === 0) {
    activeImageSource = Active3Month;
    inactiveImageSource = Inactive3Month;
  } else if (currentMonth % 2 === 0) {
    activeImageSource = Active2Month;
    inactiveImageSource = Inactive2Month;
  }

  if (loss === 0) {
    activeMonthText =
      userType == USER_TYPE.PATIENT
        ? `You haven't lost any weight`
        : `${firstName} hasn't lost any weight`;
    textOffsetAccordingToImage = 61; //width of image.
    activeImageSource = null;
  } else if (loss > 0) {
    activeMonthText = `Lost ${loss.toFixed(
      1
    )} ${weightUnitText} in ${days} days`;
  } else {
    weightTextColor = "#ED485C";

    textOffsetAccordingToImage = 61; //width of image.
    activeImageSource = null;

    activeMonthText = `Gained ${-loss.toFixed(
      1
    )} ${weightUnitText} in ${days} days`;
  }

  if (isTargetView) {
    const targetWeightAsperUnit = displayTargetWeight;

    // target achieved. show target achieved badge
    if (this.weightAtTheEndOfProgram <= targetWeightAsperUnit) {
      // activeImageSource = null;
      activeImageSource = ActiveTarget;
    } else {
      activeImageSource = null;
    }
    inactiveImageSource = InactiveTarget;
    inActiveText = "Target Weight";
    activeMonthText = "";
    monthName = "";

    activeInputRange = [index, index + 0.91, index + 1];
    inactiveInputRange = [index, index + 0.9, index + 0.91];
  }

  const activeBadgeOpacityInterpolator = monthOutputRange.interpolate({
    inputRange: activeInputRange,
    outputRange: [0, 0, 1],
  });

  const inactiveBadgeOpacityInterpolator = monthOutputRange.interpolate({
    inputRange: inactiveInputRange,
    outputRange: [1, 1, 0],
  });

  const deactivatedText = (
    <AnimatedText
      style={[
        style.svgBoxStyle,
        style.deactivatedMonthNameTextStyle,
        {
          top: y + 20,
          left: index % 2 === 0 ? 0 : x + 80,
          right: index % 2 === 0 ? width - x - 20 : 0,
          textAlign: index % 2 === 0 ? "right" : "left",
          opacity: inactiveBadgeOpacityInterpolator,
        },
      ]}
    >
      {inActiveText}
    </AnimatedText>
  );

  const activatedText = (
    <AnimatedText
      style={[
        style.svgBoxStyle,
        style.deactivatedMonthNameTextStyle,
        {
          color: "#024481",
          top: y + 10,
          left: index % 2 === 0 ? 0 : x + 80 - textOffsetAccordingToImage,
          right:
            index % 2 === 0 ? width - x - 20 - textOffsetAccordingToImage : 0,
          textAlign: index % 2 === 0 ? "right" : "left",
          opacity: activeBadgeOpacityInterpolator,
        },
      ]}
    >
      {monthName}
      {"\n"}
      <Text style={{ color: weightTextColor, textTransform: "none" }}>
        {activeMonthText}
      </Text>
    </AnimatedText>
  );

  const badge = (
    <Animated.View
      style={[
        style.svgBoxStyle,
        {
          top: y,
          left: x,
          opacity: inactiveBadgeOpacityInterpolator,
        },
      ]}
    >
      <Image
        resizeMode="contain"
        source={inactiveImageSource}
        style={{ width: 61, height: 80 }}
      />
    </Animated.View>
  );

  const activeBadge = (
    <Animated.View
      style={[
        style.svgBoxStyle,
        {
          top: y,
          left: x,
          opacity: activeBadgeOpacityInterpolator,
        },
      ]}
    >
      <Image
        resizeMode="contain"
        source={activeImageSource}
        style={{ width: 61, height: 80 }}
      />
    </Animated.View>
  );

  return {
    badges: [badge, activeBadge],
    labels: [activatedText, deactivatedText],
  };
};

export const CycleDemarcationIndicator = (allStartingPoint) => {
  if (!allStartingPoint) {
    return <View />;
  }

  return allStartingPoint.map(({ x, y, month }, index) => {
    return (
      <CycleIndicator
        testID={`cycle ${index + 1}`}
        accessibilityLabel={`cycle ${index + 1}`}
        style={[{ position: "absolute", left: x, top: y }]}
        cycleNo={index + 1}
        month={month}
      />
    );
  });
};
