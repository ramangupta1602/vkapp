import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import { R } from "Resources";

export class MeasurementsLeft extends Component {
  render() {
    return (
      <View style={[styles.containerStyle, this.props.style]}>
        <TouchableWithoutFeedback
          onPress={() => {
            this.props.onClick(this.props.measurementIndex);
          }}>
          <View style={styles.contentStyle}>
            <Text style={styles.textStyle}>
              {this.props.measurement + " " + this.props.unit}
            </Text>
          </View>
        </TouchableWithoutFeedback>
        <Image
          source={R.Images.line}
          style={[styles.viewLineStyle, { width: this.props.lineWidth }]}
        />
      </View>
    );
  }
}

export const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: "10%",
  },

  contentStyle: {
    padding: 4,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 25,
    width: 65,
    backgroundColor: R.Colors.COLOR_WHITE,
  },
  textStyle: {
    fontSize: 12,
    fontFamily: "Lato-Regular",
    lineHeight: 15,
    textAlign: "center",
    color: R.Colors.COLOR_TEXT_NUMBER,
  },
  viewLineStyle: {
    height: 1,
    width: 100,
    resizeMode: "repeat",
  },
});
