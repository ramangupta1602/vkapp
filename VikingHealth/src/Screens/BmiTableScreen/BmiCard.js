import React from "react";
import { View, Text, Image, TouchableOpacity, Animated } from "react-native";
import Styles from "./Styles";
import { R } from "../../Resources/R";
import { strings } from "../../utility/locales/i18n";

const BmiCard = ({
  data,
  onCardClicked,
  index,
  style,
  isOpen,
  animating,
  bmi,
}) => {
  let cardRef = null;
  let rotation = undefined; // this is a useless initialization as in the els condition its is already defined to 90deg, therefor changing it to undefined.

  if (isOpen) {
    rotation = "-90deg";
  } else if (animating) {
    rotation = animating.interpolate({
      inputRange: [0, 1],
      outputRange: ["90deg", "-90deg"],
    });
  } else {
    rotation = "90deg";
  }

  // when we are on detail screen hide bottom radius, a very small curve is visible when looked
  // carefully, so removing it
  const borderRadius = isOpen ? 0 : 8;

  return (
    <TouchableOpacity
      style={[
        Styles.bmiCardContainerStyle,
        style,
        {
          borderBottomLeftRadius: borderRadius,
          borderBottomRightRadius: borderRadius,
        },
      ]}
      activeOpacity={0.9}
      onPress={() => {
        if (cardRef) {
          cardRef.measure((x, y, width, height, pageX, pageY) => {
            const layout = { x: pageX, y: pageY, width, height };
            if (onCardClicked) {
              onCardClicked({ data, index, layout });
            }
          });
        }
      }}
      ref={(ref) => {
        cardRef = ref;
      }}>
      <View
        style={[
          Styles.bmiCardInnerContainer,
          {
            backgroundColor: data.cardColor,
            borderWidth: data.isUserInRange ? 1 : 0,
            borderColor: data.borderColor,
          },
        ]}>
        <View
          style={[
            Styles.bmiCardImageContainerStyle,
            {
              backgroundColor: data.isUserInRange ? data.borderColor : "white",
            },
          ]}>
          <Image
            source={data.isUserInRange ? data.inRangeIcon : data.outRangeIcon}
            style={Styles.bmiCardImageStyle}
          />
        </View>

        {/* Figure Container... */}
        <View style={Styles.bmiCardFigureContainerStyle}>
          <View>
            <Text style={Styles.bmiStageNameStyle}>{data.name}</Text>
            <Text style={Styles.rangeTextStyle}>{data.displayString}</Text>
          </View>

          {data.isUserInRange && (
            <View>
              <Text style={Styles.yourBmiTextStyle}>
                {strings("bmiTable.yourBmi")}
              </Text>
              <Text style={Styles.bmiStyle}>{bmi}</Text>
            </View>
          )}
        </View>

        {/* Disclosure icon */}
        <View style={Styles.disclosureStyle}>
          <Animated.Image
            style={[
              Styles.arrowStyle,
              {
                transform: [{ rotate: rotation }],
              },
            ]}
            source={R.Images.arrowRight}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default BmiCard;
