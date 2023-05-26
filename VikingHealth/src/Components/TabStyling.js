import React, { Component } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "../Screens/Admin/Dashboard/Styles";

export class TabStyling extends Component {
  constructor(props) {
    super(props);
    this.items = ["Active", "Completed", "Invited"];
    this.state = { activeItem: 0 };
  }
  render() {
    return (
      <View style={{ flexDirection: "row" }}>
        {this.items.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              this.state.activeItem === index ? styles.active : "",
              styles.tabWrapper,
            ]}
            onPress={() => {
              this.state.activeItem = index;
              this.props.onClick(index);
            }}>
            <Text
              style={[
                styles.tabText,
                this.state.activeItem === index ? styles.activate : "",
              ]}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }
}
