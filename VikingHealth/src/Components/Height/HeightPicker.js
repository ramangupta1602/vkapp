import React, { Component } from "react";
import { View } from "react-native";
import { WheelPicker } from "react-native-wheel-picker-android";
import Styles from "./styles";

export class HeightPicker extends Component {
  onItemSelected = (selectedItem) => {
    this.setState({ selectedItem: selectedItem });
    if (typeof this.props.onValueUpdated === "function") {
      this.props.onValueUpdated(this.props.data[selectedItem]);
    }
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedItem: this.props.defaultValue,
    };
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.defaultValue !== prevProps.defaultValue) {
      this.setState({ selectedItem: this.props.defaultValue });
    }
  };

  renderPicker() {
    return (
      <WheelPicker
        isCurve={false}
        itemTextSize={16}
        selectedItemTextSize={16}
        style={{ width: 70, flex: 1 }}
        selectedItem={this.state.selectedItem}
        data={this.props.data}
        onItemSelected={this.onItemSelected}
      />
    );
  }

  render() {
    return (
      <View style={Styles.wheelContainerStyle}>
        <View style={Styles.wheelStyle}>{this.renderPicker()}</View>
      </View>
    );
  }
}
