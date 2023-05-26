import React, { Component } from "react";
import { TouchableOpacity, Image, StyleSheet, View } from "react-native";
import { R } from "Resources";

export class CrossButton extends Component {
  crossButtonClicked() {
    if (this.props.onCrossClicked) {
      this.props.onCrossClicked();
    }
  }

  render() {
    return (
      <TouchableOpacity
        hitSlop={{ top: 10, bottom: 10, right: 10, left: 10 }}
        onPress={() => {
          this.crossButtonClicked();
        }}
      >
        <View style={{ padding: 5 }}>
          <Image
            source={R.Images.croseBlack}
            style={backButtonStyles.imageBack}
          />
        </View>
      </TouchableOpacity>
    );
  }
}

const backButtonStyles = StyleSheet.create({
  imageBack: {
    width: 25,
    height: 20,
    resizeMode: "contain"
  }
});
