import React, { Component } from "react";
import AllSummaryGraphContainer from "./AllSummaryGraph/AllSummaryGraphContainer";
import { View } from "react-native";
import { Style } from "./AllSummaryGraph/styles";

export class AllSummaryGraphComponent extends Component {
  static navigationOptions = {
    header: null,
    gesturesEnabled: false
  };

  constructor(props) {
    super(props);

    this.graphType = this.props.navigation.getParam("graphType");
    this.state = {
      width: 0,
      height: 0,
      haveDimension: false
    };
  }

  onLayout = ({
    nativeEvent: {
      layout: { width, height }
    }
  }) => {
    this.setState({ width, height, haveDimension: true });
  };

  render() {
    const { width, height, haveDimension } = this.state;
    const translateX = -(height - width) / 2;
    const translateY = (height - width) / 2;

    const rotationStyle = {
      transform: [{ translateX }, { translateY }, { rotate: "90deg" }],
      width: height,
      height: width
    };

    return (
      <View style={Style.containerStyle}>
        {/* Fake view to get the dimension */}
        <View
          onLayout={this.onLayout}
          style={Style.invisiblePlaceHolderStyle}
        />

        {haveDimension && (
          <View style={[rotationStyle]}>
            <AllSummaryGraphContainer
              graphType={this.graphType}
              width={height}
              height={width}
            />
          </View>
        )}
      </View>
    );
  }
}
