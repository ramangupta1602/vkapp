import React, { Component } from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { R } from "Resources";

export class MeasurementList extends Component {
  static navigationOptions = {
    header: null,
  };

  renderText() {
    if (this.props.isSelected) {
      return (
        <Text style={[styles.text, { color: "#D0444C" }]}>
          {" "}
          {this.props.text}{" "}
        </Text>
      );
    }
    return <Text style={[styles.text]}> {this.props.text} </Text>;
  }
  renderLine() {
    if (this.props.isSelected) {
      return <View style={[styles.view, { backgroundColor: "#D0444C" }]} />;
    }
    return <View style={[styles.view]} />;
  }

  render() {
    return (
      <View>
        <TouchableOpacity
          hitSlop={{ top: 10, bottom: 10 }}
          onPress={() => {
            this.props.onClick(this.props.indexValue);
          }}
        >
          {this.renderText()}
        </TouchableOpacity>
        {this.renderLine()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    fontFamily: "Lato-Regular",
    fontSize: 14,
    marginLeft: 12,
    marginRight: 12,
    lineHeight: 17,
    color: R.Colors.COLOR_TEXT_GREY,
  },
  view: {
    marginTop: 8,
    backgroundColor: R.Colors.COLOR_LINE,
    height: 1,
  },
});
