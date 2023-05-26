import React, { Component, PureComponent } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import { HeightWeightUtil } from "../../Library/Utils/HeightWeightUtil";

var leftShift = 0;

class RulerMarker extends PureComponent {
  render() {
    const marker = this.props.marker;
    return (
      <View
        style={styles.listItem}
        testID={`${marker}`}
        accessibilityLabel={`${marker}`}
      >
        <TouchableWithoutFeedback onPress={() => this.props.onClick(marker)}>
          <View>
            <View style={styles.markersContainer}>
              <View
                style={[styles.mediumMarker, { marginRight: 3, marginLeft: 0 }]}
              />
              {this.shortMarkers(marker, 0)}
              <View style={styles.longMarker} />
              {this.shortMarkers(marker, 5)}
              <View
                style={[styles.mediumMarker, { marginLeft: 3, marginRight: 0 }]}
              />
            </View>
            <Text style={styles.markerNumber}>{marker}</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  shortMarkers(marker, offset) {
    var markers = new Array(4);
    for (var i = 0; i < 4; i++) {
      let key = marker * 10 + offset + i;
      markers.push(<View style={styles.shortMarker} key={key} />);
    }
    return markers;
  }
}

export class Ruler extends Component {
  constructor(props) {
    super(props);
    this.state = { value: props.default, isInEditMode: false };

    this.configure();
  }

  configure = () => {
    let defaultMinRange, defaultMaxRange;
    if (this.props.unit == HeightWeightUtil.WEIGHT_KG) {
      defaultMinRange = 0;
      defaultMaxRange = 175.5;
    } else {
      defaultMinRange = 0;
      defaultMaxRange = 386;
    }
    this.minRange = this.props.minRange ?? defaultMinRange;
    this.maxRange = this.props.maxRange ?? defaultMaxRange;

    this.viewabilityConfig = {
      itemVisiblePercentThreshold: 51,
      minimumViewTime: 1,
    };

    if (this.props.width) {
      this.width = this.props.width;
    } else {
      this.width = Dimensions.get("window").width;
    }
    const range = this.maxRange - this.minRange;
    this.data = new Array(Math.ceil(range));
    for (i = 0; i < range; i++) {
      this.data[i] = i + this.minRange;
    }

    this.calculateMarkerArrowShift();
  };

  componentDidMount() {
    setTimeout(() => {
      this.setValue(this.state.value, false);
    }, 1);
  }

  componentDidUpdate(oldProps, oldState) {
    if (this.props.unit !== oldProps.unit) {
      this.configure();

      let weight = 0;

      if (this.props.unit === HeightWeightUtil.WEIGHT_KG) {
        weight = HeightWeightUtil.kgWeight(this.state.value);

        setTimeout(() => {
          this.validateInput(weight.toFixed(1));
        }, 1);
      } else {
        weight = HeightWeightUtil.lbsWeight(this.state.value);

        setTimeout(() => {
          this.validateInput(weight.toFixed(1));
        }, 1);
      }

      setTimeout(() => {
        this.setValue(weight, true);
      }, 500);
    }
  }

  calculateMarkerArrowShift() {
    const screenSizeHalf = Math.round(this.width / 2);
    if (screenSizeHalf % 8 == 0) {
      leftShift = 0;
    } else {
      var x = screenSizeHalf - Math.round(screenSizeHalf / 8) * 8;
      if (x > 4) {
        leftShift = x - 8;
      } else {
        leftShift = x;
      }
    }

    leftShift = 0;
  }

  calculateValue(offset) {
    var value =
      (offset - 40) / 80 + (Math.round(this.width / 2) - leftShift) / 80 + 1;
    value = (value + this.minRange).toFixed(1);
    this.setState({ value: value });
    this.valueUpdated(value);
  }

  valueUpdated(value) {
    if (typeof this.props.onValueUpdated === "function") {
      this.props.onValueUpdated(value);
    }
  }

  setValue(value, animated) {
    var contentOffset = (value - 1 - this.minRange) * 80 + 40;
    this.list.scrollToOffset({ offset: contentOffset, animated: animated });
  }

  getItemLayout = (data, index) => ({ length: 80, offset: 120 * index, index });

  onScrollEnd(event) {
    if (this.state.isInEditMode) {
      return;
    }

    var xOffset =
      event.nativeEvent.contentOffset.x - Math.round(this.width / 2);
    this.calculateValue(xOffset);
  }

  validateInput = (input) => {
    let inputCopy = input;

    // if user has cleared all the input that means he wants to add some value, so just set the state to
    // 0, and don't move the scale, because moving the scale will flicker between 0 and 2.9 (lowest minimum)
    // that can be displayed on the screen ..........
    if (input.length === 0) {
      input = "0"; // This is unclear, why this has been used. It makes no sense at all.
      this.setState({ value: "" });
      this.setValue(0.5, true);
      this.valueUpdated("");
      return;
    }

    if (input.endsWith(".")) {
      input = input + "0";
    }

    let number = parseFloat(input);

    if (isNaN(number) || !number) {
      number = 0;
    }

    number = parseFloat(number.toFixed(1).toString());

    if (number > this.maxRange) {
      number = this.maxRange;
    }

    // parse float will remove . so add it so that user can enter decimal places
    if (inputCopy.endsWith(".")) {
      number = number + ".";
    }

    this.setState({ value: number }, () => {
      this.setValue(this.state.value, true);
      this.valueUpdated(number);
    });
  };

  render() {
    var style = {};
    if (leftShift == 0) {
      style = {};
    } else if (leftShift < 0) {
      style = { marginLeft: Math.abs(leftShift) };
    } else {
      style = { paddingRight: leftShift };
    }

    let unit = HeightWeightUtil.weightUnit(this.props.unit);
    return (
      <View style={styles.rulerContainer}>
        <View style={styles.listContainer}>
          <FlatList
            ListHeaderComponent={() => {
              return (
                <View style={{ width: Math.round(this.width / 2) }}></View>
              );
            }}
            ListFooterComponent={() => {
              return (
                <View style={{ width: Math.round(this.width / 2) }}></View>
              );
            }}
            testID={"scale"}
            accessibilityLabel={"scale"}
            horizontal={true}
            bounces={false}
            alwaysBounceHorizontal={false}
            showsHorizontalScrollIndicator={false}
            data={this.data}
            renderItem={({ item, index }) => (
              <RulerMarker
                marker={item + 1}
                onClick={this.setValue.bind(this)}
              />
            )}
            style={styles.list}
            ref={(ref) => {
              this.list = ref;
            }}
            keyExtractor={(index) => "key" + index}
            initialNumToRender={this.maxRange - this.minRange}
            // getItemLayout={this.getItemLayout}
            viewabilityConfig={this.viewabilityConfig}
            onScrollBeginDrag={() => {
              this.setState({ isInEditMode: false });
            }}
            onMomentumScrollEnd={this.onScrollEnd.bind(this)}
            snapToInterval={8}
          />
        </View>

        <View style={[styles.markerContainer, style]}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TextInput
              testID={"weightInput"}
              accessibilityLabel={"weightInput"}
              style={[styles.marker]}
              keyboardType="decimal-pad"
              maxLength={5}
              onChangeText={(text) => {
                this.validateInput(text);
                this.setState({ isInEditMode: true });
              }}
              onBlur={() => {
                this.setState({ isInEditMode: false });
              }}
              value={"" + this.state.value}
            />

            <Text style={[styles.marker, { fontSize: 16 }]}> {unit}</Text>
          </View>

          <View style={{ alignItems: "center", marginTop: 5 }}>
            <View style={styles.triangle} />
            <View style={styles.arrow} pointerEvents="none" />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  rulerContainer: {
    height: 120,
    width: "100%",
  },

  markerContainer: {
    position: "absolute",
    height: 65,
    width: "100%",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },

  marker: {
    fontSize: 40,
    color: "#00467d",
    // width: '100%',
    textAlign: "center",
    fontWeight: "600",
  },

  arrow: {
    top: 0,
    width: 3,
    flex: 1,
    backgroundColor: "#d23341",
  },

  listItem: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    height: 30,
    width: 80,
  },

  listContainer: {
    height: 60,
    marginTop: 70,
  },

  list: {},

  longMarker: {
    backgroundColor: "#a7bbcb",
    width: 2,
    height: 32,
    marginLeft: 3,
    marginRight: 3,
  },

  shortMarker: {
    backgroundColor: "#a7bbcb",
    width: 2,
    height: 17,
    marginLeft: 3,
    marginRight: 3,
  },

  mediumMarker: {
    backgroundColor: "#a7bbcb",
    width: 1,
    height: 25,
  },

  markerNumber: {
    fontSize: 14,
    textAlign: "center",
    marginLeft: 3,
    marginRight: 3,
    marginTop: 5,
    color: "#a6b0b7",
  },

  markersContainer: {
    flexDirection: "row",
    marginBottom: 5,
  },

  triangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderBottomWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#d23341",
  },
});
