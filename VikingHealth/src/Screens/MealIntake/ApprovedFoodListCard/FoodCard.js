import React, { Component } from "react";
import { View } from "react-native";
import { styles } from "../styles";
import SpannableText from "../../../Components/SpannableText";

export default class FoodCard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getItemNameList = (items) => {
    if (!items) {
      return null;
    }

    const fullNameList = [];

    for (let i = 0; i < items.length; ++i) {
      if (items[i].length < 1) {
        continue;
      }

      const view = (
        <View key={items[i] + i} style={styles.foodItemContainerStyle}>
          {/* <Text style={styles.foodItemTextStyle}>{items[i]}</Text> */}
          <SpannableText
            style={styles.foodItemTextStyle}
            text={items[i]}
            searchString={this.props.searchString}
          />
        </View>
      );

      fullNameList.push(view);
    }

    return fullNameList;
  };

  render() {
    const { items } = this.props;

    return this.getItemNameList(items);
  }
}
