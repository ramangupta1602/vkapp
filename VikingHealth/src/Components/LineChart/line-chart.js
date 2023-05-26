import React from "react";
import { View, Animated, Easing, StyleSheet } from "react-native";
import {
  initData,
  drawGuideLine,
  drawYAxisLabels,
  drawXAxis,
  drawXAxisLabels,
} from "./common";

export class LineChart extends React.Component {
  constructor(props) {
    super(props);
    this.xAxisHeight = 20;
    let newState = initData(
      this.props.data,
      this.props.height,
      this.xAxisHeight,
      this.props.minValue,
      this.props.maxValue,
      this.props.gap,
      this.props.numberOfYAxisGuideLine
    );
    this.yInterval = newState.yInterval;

    this.state = {
      loading: false,
      sortedData: newState.sortedData,
      selectedIndex: null,
      scrollPosition: 0,
      max: this.props.max ?? newState.max,
      fadeAnim: new Animated.Value(0),
      guideArray: newState.guideArray,
    };

    this.drawCoordinates = this.drawCoordinates.bind(this);
    this.drawCoordinate = this.drawCoordinate.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextState.sortedData !== this.state.sortedData ||
      nextState.selectedIndex !== this.state.selectedIndex ||
      nextState.scrollPosition !== this.state.scrollPosition
    );
    // if (
    //   nextState.sortedData !== this.state.sortedData ||
    //   nextState.selectedIndex !== this.state.selectedIndex ||
    //   nextState.scrollPosition !== this.state.scrollPosition
    // ) {
    //   return true;
    // } else {
    //   return false;
    // }
  }

  componentDidMount() {
    Animated.timing(this.state.fadeAnim, {
      toValue: 1,
      easing: Easing.bounce,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      let newState = initData(
        nextProps.data,
        this.props.height,
        this.xAxisHeight,
        this.props.minValue,
        this.props.maxValue,
        nextProps.gap,
        this.props.numberOfYAxisGuideLine
      );
      this.setState({
        loading: false,
        sortedData: newState.sortedData,
        selectedIndex: null,
        scrollPosition: 0,
        max: this.props.max ?? newState.max,
        fadeAnim: new Animated.Value(0),
        guideArray: newState.guideArray,
      });
    }
  }

  getTransform(rad, width) {
    let x = (0 - width / 2) * Math.cos(rad) - (0 - width / 2) * Math.sin(rad);
    let y = (0 - width / 2) * Math.sin(rad) + (0 - width / 2) * Math.cos(rad);

    return [
      { translateX: -1 * x - width / 2 },
      { translateY: -1 * y + width / 2 },
      { rotate: rad + "rad" },
    ];
  }

  areCoordinatesValid(start, end) {
    if (!(start && end)) {
      return false;
    }
    let isDataValid = true;
    if (
      start.ratioY == null ||
      start.y === null ||
      end.ratioY === null ||
      end.y === null
    ) {
      isDataValid = false;
    }

    if (
      isNaN(start.ratioY) ||
      isNaN(start.y) ||
      isNaN(end.ratioY) ||
      isNaN(end.y)
    ) {
      isDataValid = false;
    }
    return isDataValid;
  }

  drawCoordinate(start, end, lineStyle) {
    let isDataValid = this.areCoordinatesValid(start, end);
    // let key = "line" + index; it was unused, therefore commented it.
    let dx = end.gap - start.gap;
    let dy = end.ratioY - start.ratioY;
    let size = Math.sqrt(dx * dx + dy * dy);
    let angleRad = -1 * Math.atan2(dy, dx);
    let height;
    let top;
    let topMargin = 20;

    if (start.ratioY > end.ratioY) {
      height = start.ratioY;
      top = -1 * size;
    } else {
      height = Math.max(end.ratioY, 1);
      top = -1 * (size - Math.abs(dy));
    }

    if (!isDataValid) {
      return <View />;
    }
    let borderColor = isDataValid ? this.props.seriesColor : "transparent";
    return (
      <View
        style={StyleSheet.flatten([
          {
            width: dx,
            height: height,
            marginTop: topMargin,
          },
          styles.coordinateWrapper,
        ])}>
        <View
          style={StyleSheet.flatten([
            lineStyle,
            {
              top: top,
              width: size,
              height: size,
              borderColor: borderColor,
              borderTopWidth: 1,
              transform: this.getTransform(angleRad, size),
            },
            styles.lineBox,
          ])}
        />
      </View>
    );
  }

  drawPoint(index, point, seriesColor) {
    let key = "point" + index;
    let size = 8;
    let color = seriesColor;

    if (point.isEmpty || this.props.hidePoints) return null;

    return (
      <View
        key={key}
        style={StyleSheet.flatten([
          styles.pointWrapper,
          {
            width: size,
            height: size,

            left: point.gap - size / 2,
            bottom: point.ratioY - size / 2,

            borderColor: color,
            backgroundColor: color,
          },
        ])}
      />
    );
  }

  drawCoordinates(data, seriesColor) {
    let result = [];
    let lineStyle = {
      borderColor: seriesColor,
    };
    let dataLength = data.length;

    for (let i = 0; i < dataLength - 1; i++) {
      result.push(
        this.drawCoordinate(
          i,
          data[i],
          data[i + 1],
          "transparent",
          lineStyle,
          false,
          false
        )
      );
    }

    for (let i = 0; i <= dataLength - 1; i++) {
      result.push(this.drawPoint(i, data[i], seriesColor));
    }

    let lastData = Object.assign({}, data[dataLength - 1]);
    let lastCoordinate = Object.assign({}, data[dataLength - 1]);
    lastCoordinate.gap = lastCoordinate.gap + this.props.gap;
    result.push(
      this.drawCoordinate(
        dataLength,
        lastData,
        lastCoordinate,
        "#FFFFFF00",
        {},
        true,
        true
      )
    );

    return result;
  }

  getDistance(p1, p2) {
    return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
  }

  render() {
    //let { fadeAnim } = this.state;

    let graphAreaHeight = this.props.height - this.xAxisHeight + 20;
    let plotAreaHeight = this.props.height - this.xAxisHeight - this.yInterval;
    return this.state.sortedData.length > 0 ? (
      <View
        style={StyleSheet.flatten([
          styles.wrapper,
          {
            backgroundColor: "white",
            paddingTop: 10 /*this.props.backgroundColor*/,
          },
        ])}>
        <View
          style={{
            height: graphAreaHeight,
            backgroundColor: "transparent",
            flexDirection: "row",
            paddingTop: 20,
          }}>
          <View
            ref="chartView"
            style={[
              styles.chartViewWrapper,
              { flex: 1, backgroundColor: "transparent", marginRight: 10 },
            ]}>
            {drawGuideLine(
              this.state.guideArray,
              this.props.yAxisGridLineColor
            )}
            <View
              key={"animated_0"}
              style={{
                flexDirection: "row",
                alignItems: "flex-end",
                height: plotAreaHeight,
                minWidth: 200,
                backgroundColor: "transparent",
              }}>
              {this.drawCoordinates(
                this.state.sortedData,
                this.props.seriesColor
              )}
            </View>
          </View>
          {/*drawYAxis(this.props.yAxisColor)*/}
          <View>
            {drawYAxisLabels(
              this.state.guideArray,
              graphAreaHeight,
              this.props.minValue,
              this.props.axisLabelColor
            )}
          </View>
        </View>

        <View style={{ paddingRight: 40 }}>
          {drawXAxis(this.props.xAxisColor)}
          {drawXAxisLabels(
            this.state.sortedData,
            this.props.gap,
            this.props.axisLabelColor
          )}
        </View>
      </View>
    ) : null;
  }
}

LineChart.defaultProps = {
  data: [],
  height: 200,
  gap: 15,
  seriesColor: "red",
  onPointClick: (point) => {},
  numberOfYAxisGuideLine: 5,
  yAxisGridLineColor: "#e5e5e5",
  yAxisColor: "#e5e5e5",
  xAxisColor: "#e5e5e5",
  seriesColor: "#337eec",
  axisLabelColor: "#a5aeb6",
};

const styles = StyleSheet.create({
  wrapper: {
    overflow: "hidden",
    borderRadius: 15,
    paddingHorizontal: 15,
  },
  chartViewWrapper: {
    margin: 0,
    paddingRight: 0,
  },
  coordinateWrapper: {
    overflow: "hidden",
    justifyContent: "flex-start",
    alignContent: "flex-start",
  },
  lineBox: {
    overflow: "hidden",
    justifyContent: "flex-start",
  },
  guideLine: {
    position: "absolute",
    height: "100%",
    borderRightColor: "#e0e0e050",
    borderRightWidth: 1,
  },
  absolute: {
    position: "absolute",
    width: "100%",
  },
  pointWrapper: {
    position: "absolute",
    borderRadius: 10,
    borderWidth: 1,
  },
});
