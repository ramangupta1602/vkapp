import React, { Component } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { R } from "Resources";
export class BodyPartMeasurement extends Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <View style={{ marginTop: 17, flexDirection: "row" }}>
        <Image
          style={{ width: 90, height: 88, resizeMode: "contain" }}
          source={this.props.image}
        />
        <View style={{ marginLeft: 10, flex: 1 }}>
          <Text style={styles.textHeaderStyle}>{this.props.header}</Text>
          <Text style={styles.textDescStyle}>{this.props.description}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textHeaderStyle: {
    color: R.Colors.COLOR_TITLE,
    fontFamily: "Lato-Regular",
    fontSize: 16,
    lineHeight: 19,
    fontWeight: "600",
  },
  textDescStyle: {
    color: R.Colors.COLOR_TITLE,
    fontFamily: "Lato-Regular",
    fontSize: 14,
    lineHeight: 17,
  },
});
