import React, { Component } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import Styles from "./styles";
import { R } from "../../Resources/R";

export default class MissedLoadingModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={[Styles.gamificationCardStyles, { width: "100%" }]}>
        <Text style={[Styles.titleStyle, localStyle.titleStyle]}>
          Hold up...
        </Text>

        <Image
          style={[Styles.imageStyle, localStyle.imageStyle]}
          source={R.Images.ladder}
        />
        {/* <Text style={[Styles.textStyle]}>
          You missed your{" "}
          <Text style={localStyle.loadingBoldStyle}>loading phase.</Text> {"\n"}
          Don’t worry.{"\n"}
        </Text> */}

        <Text
          style={[Styles.textStyle, { paddingHorizontal: 0, marginTop: 22 }]}>
          Ready to start the loading phase? Please select an option to continue.
        </Text>

        {this.props.children}
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
  },
  imageStyle: {
    width: 164,
    height: 171,
    marginBottom: 0,
    marginTop: 30,
  },
  loadingBoldStyle: {
    color: "#024481",
    fontFamily: "Lato-Bold",
  },
  loadingActionButtonStyle: {
    backgroundColor: "#CE363E",
    marginTop: 45,
    borderRadius: 6,
  },
  actionTextStyle: {
    ...Styles.actionStyle,
    marginTop: 16,
    marginBottom: 16,
  },
});
