import React, { Component } from "react";
import { View, Text, Image, ScrollView, StyleSheet } from "react-native";
import { PageTitle, CrossButton } from "Components";
import { strings } from "../../utility/locales/i18n";
import { R } from "Resources";
import {
  WtHRClassNamesConstant,
  WtHRClasses,
  MaleWtHRData,
  FemaleWtHRData,
} from "./WtHRData";

export class WaistToHeightRatio extends Component {
  static navigationOptions = {
    header: null,
  };

  _onCrossClicked = () => {
    if (this.props.onCrossClicked) {
      this.props.onCrossClicked();
    }
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: R.Colors.COLOR_APP_BACKGROUND,height:"100%" ,paddingBottom : 20}}>
        <View
          style={{
            marginLeft: 8,
            marginTop: 50,
            marginBottom: 16,
            backgroundColor: "transparent",
          }}
        >
          <CrossButton onCrossClicked={this._onCrossClicked} />
        </View>
        <View style={{ backgroundColor: "yellow", flex: 1 }}>
          <ScrollView
            style={{
              backgroundColor: R.Colors.COLOR_APP_BACKGROUND,
              paddingBottom: 0,
            }}
          >
            <PageTitle
              title={strings("waist_to_height_ratio.waist_to_height_ratio")}
            />
            <View
              style={{
                marginLeft: 16,
                marginRight: 16,
                flexDirection: "column",
              }}
            >
              <Text style={[styles.questionHeading, { marginTop: 20 }]}>
                {strings("waist_to_height_ratio.what_is_waist_to_height_ratio")}
              </Text>
              <Text style={styles.description}>
                {strings("waist_to_height_ratio.waist_to_height_ratio_desc")}
                <Text style={styles.questionHeading}>
                  {strings(
                    "waist_to_height_ratio.waist_to_height_ration_desc_bold"
                  )}
                </Text>
              </Text>
              <Text style={[styles.questionHeading, { marginTop: 20 }]}>
                {strings("waist_to_height_ratio.how_waist_to_height_measured")}
              </Text>
              {/* <View style = {{height: 20, backgroundColor: 'red'}} /> */}
              {/* <Text style={{backgroundColor:'blue'}}>
                {strings('waist_to_height_ratio.measured_waist_to_height_desc')}
              </Text> */}
              {/* <Text style={[styles.descriptionRisk]}>
                {strings('waist_to_height_ratio.waist_to_height_risk_desc')}
              </Text> */}
              <View style={styles.lineStyle} />
              <Text style={styles.waistToHeightRatioStyle}>
                {strings("waist_to_height_ratio.your_waist_to_height_ratio_is")}
                {this.props.ratio.toFixed(1)}%
              </Text>
              <View style={[styles.lineStyle, { marginTop: 18 }]} />
            </View>
            <View style={{ marginLeft: 28, marginRight: 28, marginTop: 18 }}>
              <View style={{ marginLeft: 18, flexDirection: "row" }}>
                <Text style={{ flex: 1.5 }} />
                <MaleFemaleTitle
                  text={strings("waist_to_height_ratio.males")}
                />
                <MaleFemaleTitle
                  text={strings("waist_to_height_ratio.females")}
                />
              </View>
              <View style={{ marginTop: -2, flex: 1 }}>
                <Image
                  style={{
                    marginTop: 30,
                    position: "absolute",
                    width: 10,
                    top: 10,
                    height: 374,
                    resizeMode: "contain",
                  }}
                  source={R.Images.waistToHeight}
                />
                <View style={{ marginLeft: 18 }}>
                  {WtHRClassNamesConstant.map((item, index) => {
                    return <WtHRRow name={item} />;
                  })}
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}

const WtHRRow = ({ name }) => {
  const wthrClass = WtHRClasses[name];
  const maleWtHRData = MaleWtHRData[name];
  const femaleWtHRData = FemaleWtHRData[name];

  return (
    <View style={{ flexDirection: "row", marginTop: 10 }}>
      <RatingCategory category={name} color={wthrClass.color} />
      <RatingText text={maleWtHRData.displayText} />
      <RatingText text={femaleWtHRData.displayText} />
    </View>
  );
};

const MaleFemaleTitle = (props) => (
  <Text style={{ textAlign: "left", flex: 1 }}>
    <Text style={[styles.maleFemaleTextStyle]}>{props.text}</Text>
    <Text style={[styles.percentageTextStyle]}> (%)</Text>
  </Text>
);

const RatingCategory = (props) => (
  <Text style={[styles.maleFemaleTextStyle, { flex: 1.5, color: props.color }]}>
    {props.category}
  </Text>
);

const RatingText = ({ text }) => (
  <Text style={[styles.maleFemaleTextStyle, { flex: 1 }]}>{text}</Text>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: R.Colors.COLOR_APP_BACKGROUND,
    justifyContent: "flex-start",
    flex: 1,
    paddingTop: 29,
    paddingBottom: 40,
  },
  questionHeading: {
    color: R.Colors.COLOR_TEXT,
    fontFamily: "Lato-Regular",
    fontSize: 14,
    fontWeight: "bold",
    lineHeight: 17,
    // marginTop: 24
  },
  description: {
    color: R.Colors.COLOR_TEXT,
    fontFamily: "Lato-Regular",
    fontSize: 14,
    lineHeight: 17,
    // marginTop: 8,
    textAlign: "justify",
  },
  descriptionRisk: {
    color: R.Colors.COLOR_TEXT_NUMBER,
    fontFamily: "Lato-Regular",
    fontSize: 14,
    lineHeight: 19,
    marginTop: 32,
    fontWeight: "600",
    textAlign: "center",
  },
  lineStyle: {
    height: 1,
    backgroundColor: R.Colors.COLOR_LINE,
    width: "100%",
    marginTop: 32,
  },
  waistToHeightRatioStyle: {
    color: R.Colors.COLOR_TEXT,
    fontFamily: "Lato-Regular",
    fontSize: 16,
    fontWeight: "bold",
    lineHeight: 19,
    marginTop: 18,
    textAlign: "center",
  },

  maleFemaleTextStyle: {
    color: R.Colors.COLOR_TEXT,
    fontFamily: "Lato-Regular",
    fontSize: 14,
    lineHeight: 17,
    marginTop: 32,
    fontWeight: "600",
    textAlign: "left",
  },
  percentageTextStyle: {
    color: R.Colors.COLOR_TEXT_GREY,
    fontFamily: "Lato-Regular",
    fontSize: 12,
    lineHeight: 15,
    fontWeight: "600",
    textAlign: "center",
  },
  imageCross: {
    width: 23,
    height: 23,
    resizeMode: "contain",
    marginBottom: 16,
  },
});
