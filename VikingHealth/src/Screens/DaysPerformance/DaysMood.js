import React, { Component } from "react";
import { Text, View, Image, StyleSheet, Dimensions } from "react-native";
// import Slider from "react-native-slider";
import { R } from "Resources";
import { MOODS } from "./Moods";

export class DaysMood extends Component {
  constructor(props) {
    super(props);
    if (this.props.mood) {
      this.state = { value: this.props.mood };
    } else {
      this.state = { value: 3 };
    }
  }

  moodUpdated(value) {
    this.setState({ value: value });
    if (typeof this.props.onValueChange === "function") {
      this.props.onValueChange(Math.min(value));
    }
  }

  renderMood() {
    let value = this.state.value;
    let selectedMood = MOODS[value];
    let image = selectedMood.icon;
    // let text = selectedMood.name

    return <Image source={image} style={styles.imageMood} />;
  }

  renderMoodText() {
    let value = this.state.value;
    let selectedMood = MOODS[value];
    // let image = selectedMood.icon
    let text = selectedMood.name;

    return <Text style={styles.moodTextStyle}>{text}</Text>;
  }

  getSelectedColor(value) {
    if (this.state.value === value) {
      return R.Colors.COLOR_TEXT;
    }
    return R.Colors.COLOR_TEXT_LIGHT;
  }

  renderNumbers(widthForSlider, width1BY5) {
    return (
      <View
        style={{ flexDirection: "row", marginTop: 18, width: widthForSlider }}
      >
        <Text onPress={()=>{
          this.moodUpdated(1)
        }}
          style={[
            styles.numberStyle,
            {
              color: this.getSelectedColor(1),
              marginLeft: 10,
              marginRight: width1BY5,
            },
          ]}
        >
          1
        </Text>
        <Text onPress={()=>{
          this.moodUpdated(2)
        }}
          style={[
            styles.numberStyle,
            { color: this.getSelectedColor(2), marginRight: width1BY5 },
          ]}
        >
          2
        </Text>
        <Text onPress={()=>{
          this.moodUpdated(3)
        }}
          style={[
            styles.numberStyle,
            { color: this.getSelectedColor(3), marginRight: width1BY5 },
          ]}
        >
          3
        </Text>
        <Text onPress={()=>{
          this.moodUpdated(4)
        }}
          style={[
            styles.numberStyle,
            { color: this.getSelectedColor(4), marginRight: width1BY5 },
          ]}
        >
          4
        </Text>
        <Text onPress={()=>{
          this.moodUpdated(5)
        }} style={[styles.numberStyle, { color: this.getSelectedColor(5) }]}>
          5
        </Text>
      </View>
    );
  }

  render() {
    const widthForSlider = Dimensions.get("window").width - 100;
    const width1BY5 = (widthForSlider - 20) / 5;

    return (
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        {this.renderMood()}
        {this.renderMoodText()}
        <View style={{ marginTop: 24 }}>
          {/* <Slider
            style={{ width: widthForSlider }}
            step={1}
            trackStyle={styles.track}
            thumbStyle={styles.thumbStyle}
            minimumTrackTintColor="#387BF4"
            maximumTrackTintColor="#D2DCE5"
            thumbTintColor="#387BF4"
            minimumValue={1}
            maximumValue={5}
            value={this.state.value}
            onValueChange={this.moodUpdated.bind(this)}
          /> */}
        </View>
        {this.renderNumbers(widthForSlider, width1BY5)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  imageMood: {
    height: 114,
    width: 114,
    resizeMode: "contain",
  },
  moodTextStyle: {
    color: R.Colors.COLOR_TEXT_NUMBER,
    fontFamily: "Lato-Regular",
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 0.67,
    lineHeight: 24,
    marginTop: 12,
  },
  numberContainerStyle: {
    flex: 1,
    marginTop: 18,
    flexDirection: "row",
  },
  numberStyle: {
    fontFamily: "Lato-Regular",
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0.16,
    lineHeight: 17,
  },

  track: {
    height: 12,
    borderRadius: 6,
    backgroundColor: "#D2DCE5",
  },
  thumbStyle: {
    width: 28,
    height: 28,
    borderRadius: 28 / 2,
    backgroundColor: "#387BF4",
  },
});
