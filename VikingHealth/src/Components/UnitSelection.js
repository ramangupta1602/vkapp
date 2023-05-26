import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { R } from "Resources";
export class UnitSelection extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    if (props.isFirstTabSelected) {
      this.state = { isFirstTabSelected: props.isFirstTabSelected };
    } else {
      this.state = { isFirstTabSelected: false };
    }
  }

  tabSelected(index) {
    if (this.props.tabSelectionChanged) {
      this.props.tabSelectionChanged(index);
    }
  }

  renderFirstTab() {
    if (this.state.isFirstTabSelected) {
      return (
        <Text style={styles.textStyleHighlighted}>{this.props.firstTab}</Text>
      );
    }
    return <Text style={[styles.textStyleNormal]}>{this.props.firstTab}</Text>;
  }

  renderSecondTab() {
    if (this.state.isFirstTabSelected) {
      return <Text style={styles.textStyleNormal}>{this.props.secondTab}</Text>;
    }
    return (
      <Text style={styles.textStyleHighlighted}>{this.props.secondTab}</Text>
    );
  }

  render() {
    return (
      <View>
        <View
          style={{
            borderRadius: 6,
            overflow: "hidden",
            flexDirection: "row",
            borderWidth: 1,
            borderColor: "#d3d3d3",
          }}
        >
          <TouchableOpacity
            testID={"firstTab"}
            accessibilityLabel={"firstTab"}
            style={styles.firstTabStyle}
            onPress={() => {
              this.tabSelected(0);
              this.setState({ isFirstTabSelected: true });
            }}
          >
            {this.renderFirstTab()}
          </TouchableOpacity>

          <TouchableOpacity
            testID={"secondTab"}
            accessibilityLabel={"secondTab"}
            style={styles.secondTabStyle}
            onPress={() => {
              this.tabSelected(1);
              this.setState({ isFirstTabSelected: false });
            }}
          >
            {this.renderSecondTab()}
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  firstTabStyle: {
    borderBottomLeftRadius: 6,
    borderTopLeftRadius: 6,
    overflow: "hidden",
  },

  secondTabStyle: {
    borderBottomRightRadius: 6,
    borderTopRightRadius: 6,
    overflow: "hidden",
  },

  textStyleNormal: {
    backgroundColor: R.Colors.COLOR_WHITE,
    color: R.Colors.COLOR_TEXT_GREY,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    fontFamily: "Lato-Regular",
    fontSize: 12,
    fontWeight: "bold",
  },
  textStyleHighlighted: {
    backgroundColor: R.Colors.COLOR_TEXT_NUMBER,
    color: R.Colors.COLOR_WHITE,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    fontFamily: "Lato-Regular",
    fontSize: 12,
    fontWeight: "bold",
  },
});
