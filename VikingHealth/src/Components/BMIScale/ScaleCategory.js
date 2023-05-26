import React, { Component } from "react";
import { Text, View } from "react-native";
import styles from "./Styles";

export class ScaleCategory extends Component {
  constructor(props) {
    super(props);
    this.lines = props.lines ? props.lines : props.config.lines;
  }

  addMarkers() {
    this.lines = this.props.lines ? this.props.lines : this.props.config.lines;
    const style = this.props.style;
    const markerStyle = [
      styles.marker,
      { backgroundColor: this.props.config.color },
      style,
    ];
    const markers = [];
    for (let i = 0; i < this.lines; i++) {
      markers.push(<View style={markerStyle} key={i} />);
    }
    return markers;
  }

  render() {
    const { startRange, endRange, isLast } = this.props.config;
    const { hideRange } = this.props;
    return (
      <View
        style={[
          this.props.style,
          { flexDirection: "column", flex: this.lines },
        ]}>
        <View style={styles.markerContainer}>{this.addMarkers()}</View>
        {!hideRange && (
          <View style={styles.rangeContainer}>
            <Text style={styles.rangeText}>{startRange}</Text>
            {isLast && <Text style={styles.rangeText}>{endRange}</Text>}
          </View>
        )}
      </View>
    );
  }
}
