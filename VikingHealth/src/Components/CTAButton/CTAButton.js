import React, { Component } from "react";
import { TouchableOpacity, Text, View } from "react-native";

import { styles } from "./Styles";

export class CTAButton extends Component {
  render() {
    const style = this.props.isEnabled ? styles.CTAEnabled : styles.CTADisabled;
    return (
      <TouchableOpacity
        testID={"submit"}
        accessibilityLabel={"submit"}
        style={[styles.CTAButton, style, this.props.style]}
        onPress={this.props.onClick}
        disabled={!this.props.isEnabled}
      >
        <View>
          <Text
            style={[styles.CTAText, { color: this.props.textColor || "white" }]}
          >
            {this.props.label}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}
