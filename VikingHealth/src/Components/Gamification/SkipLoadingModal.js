import React, { Component } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Styles from "./styles";
import { R } from "../../Resources/R";
import { ProgressBarButton } from "../../Components";
import { strings } from "../../utility/locales/i18n";

export default class SkipLoadingModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View
        style={[
          Styles.gamificationCardStyles,
          { width: "100%", marginTop: 70 },
        ]}
      >
        <Text style={[Styles.titleStyle, localStyle.titleStyle]}>
          {strings("skipLoadingPopup.skipTitle")}
        </Text>

        <Text style={localStyle.messageTextStyle}>
          {strings("skipLoadingPopup.skipMessage")}
        </Text>

        <ProgressBarButton
          buttonState={this.props.buttonState}
          label={"Confirm"}
          style={localStyle.ctaButtonStyle}
          onClick={this.props.performMutation}
        />

        <View style={localStyle.cancelButtonContainer}>
          <TouchableOpacity
            style={localStyle.cancelButtonStyle}
            onPress={this.props.onCancelPress}
          >
            <Text style={localStyle.cancelTextStyle}>
              {strings("common_message.cancel_text")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const localStyle = StyleSheet.create({
  titleStyle: {
    fontSize: 24,
    fontWeight: "600",
    letterSpacing: 0.77,
    lineHeight: 29,
    paddingHorizontal: 20,
  },

  messageTextStyle: {
    color: R.Colors.COLOR_TEXT_NUMBER,
    fontSize: 16,
    letterSpacing: 0.48,
    lineHeight: 21,
    // textAlign: "center",
    fontFamily: "Lato-regular",
    marginTop: 22,
    paddingHorizontal: 0,
  },

  ctaButtonStyle: {
    marginTop: 46,
  },

  cancelButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 22,
  },

  cancelButtonStyle: {
    flexWrap: "wrap",
    flexShrink: 1,
    flexDirection: "row",
  },

  cancelTextStyle: {
    fontFamily: "Lato-regular",
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0,
    lineHeight: 17,
    color: "#D0444C",
  },

  /**
.cancel {
  height: 17px;
  width: 42px;
  color: #D0444C;
  font-family: Lato;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0;
  line-height: 17px;
}
   */

  actionTextStyle: {
    ...Styles.actionStyle,
    marginTop: 16,
    marginBottom: 16,
  },
});
