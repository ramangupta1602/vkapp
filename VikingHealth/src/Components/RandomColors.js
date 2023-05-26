import React, { Component } from "react";
import { View, StyleSheet, Image } from "react-native";
import { R } from "Resources";
import AppUtil from "Library/Utils/AppUtil";

export class RandomColors extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedColor: "",
    };
  }
  componentDidMount() {
    const number = this.props.number;
    const item = AppUtil.colorSelection(number);
    this.setState({ selectedColor: item });
  }

  render() {
    return (
      <View>
        <View
          gender
          height
          width
          style={[
            styles.circle,
            {
              backgroundColor: this.state.selectedColor,
              borderColor: this.state.selectedColor,
              height: this.props.height,
              width: this.props.width,
            },
          ]}>
          <Image
            source={
              this.props.gender === "male" ? R.Images.male : R.Images.female
            }
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  circle: {
    height: 42,
    width: 42,
    borderRadius: 100,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
