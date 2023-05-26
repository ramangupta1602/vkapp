import React, { Component } from "react";
import { R } from "./../../Resources/R";
// import { IndicatorViewPager, PagerDotIndicator } from "rn-viewpager";
import Styles from "./styles";
import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";

export default class QuoteModalComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    const dimension = Dimensions.get("window");
    this.height = dimension.height;
    this.width = dimension.width;
  }

  getSingleTestamonialEntry = (name, image, quote) => {
    return (
      <View>
        <View style={Styles.testamonialImageStyleContainer}>
          <Image
            style={Styles.testamonialImageStyle}
            source={image}
            resizeMode="contain"
          />
        </View>

        <Text style={Styles.testamonialText}>{quote}</Text>
        <Text style={Styles.peopleName}>-{name}</Text>
      </View>
    );
  };

  renderDotIndicator = () => {
    return (
      <PagerDotIndicator
        pageCount={3}
        dotStyle={{ backgroundColor: "#D8D8D8" }}
        selectedDotStyle={{ backgroundColor: "#024481" }}
      />
    );
  };

  render() {
    return (
      <View
        style={[
          Styles.gamificationCardStyles,
          { paddingTop: 0, paddingHorizontal: 0, backgroundColor: "#EFF5F9" }
        ]}>
        <View style={Styles.quoteOuterContainer}>
          <Image
            style={{
              position: "absolute",
              width: "100%",
              height: 141,
              resizeMode: "stretch"
            }}
            source={R.Images.BackgroundImage}
          />
          <View style={Styles.quoteInnerContainer}>
            <Image style={Styles.quoteSymbolStyle} source={R.Images.quote} />
            <Text style={Styles.quoteTextStyle}>
              Successful weight loss takes programming not willpower.
            </Text>
          </View>
        </View>

        <View style={Styles.testamonialContainer}>
          <Text style={Styles.testamonialTitle}>
            Some of our satisfied clients
          </Text>

          <View style={{ height: 228, overflow: "hidden" }}>
            {/* <IndicatorViewPager
              indicator={this.renderDotIndicator()}
              style={{ height: 228 }}>
              {this.getSingleTestamonialEntry(
                "Jill Eckmann",
                R.Images.Jill_Eckmann,
                "At the age of 49, within 6 weeks I dropped an astounding 50 pounds."
              )}

              {this.getSingleTestamonialEntry(
                "David Magedman",
                R.Images.David_Magedman,
                "After 10 weeks, I lost a total of 33lbs. Viking health changed my life forever."
              )}

              {this.getSingleTestamonialEntry(
                "Randy Karman",
                R.Images.Randy_Karman,
                "I lost close to 6” in my waist and my blood pressure has made a dramatic drop."
              )}
            </IndicatorViewPager> */}
          </View>
        </View>
        {/* Action Button */}
        <TouchableOpacity activeOpacity={0.1} onPress={this.props.onClick}>
          <Text
            style={[Styles.actionStyle, { marginTop: 0, marginBottom: 10 }]}>
            View Rewards
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
