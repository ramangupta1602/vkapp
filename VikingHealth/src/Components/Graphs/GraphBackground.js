import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

export class GraphBackground extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      width,
      height,
      paddingTop,
      xAxisHeight,
      yAxisWidth,
      padding,
      xAxisData,
      yMin,
      yMax,
      yUnit,
      yAxisUnitPrecision,
      yAxisFontSize
    } = this.props;

    return (
      <View style={{ padding }}>
        <View
          style={{
            width,
            height,
            padding,
            paddingTop,
            flexDirection: "row"
          }}
        >
          <DividerLines
            top={paddingTop}
            bottom={xAxisHeight + padding}
            right={yAxisWidth + padding + 10}
            left={padding}
          />

          {/* this will contain and graph and x axis */}
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              paddingRight: 10
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "transparent"
              }}
            >
              {this.props.children}
            </View>

            <View
              style={{
                justifyContent: "flex-start",
                backgroundColor: "transparent",
                height: xAxisHeight + 0.5
              }}
            >
              <GetXAxis xAxisData={xAxisData} />
            </View>
          </View>

          {/* This will contain y axis and little bottom right space */}
          <View
            style={{
              width: yAxisWidth,
              flexDirection: "column",
              height: "100%",
              backgroundColor: "transparent",
              zIndex: -100
            }}
          >
            {/* This will contain y axis */}
            <View
              style={{
                flex: 1,
                marginBottom: xAxisHeight,
                backgroundColor: "transparent"
              }}
            >
              <GetYAxis
                yMaxValue={yMax}
                yMinValue={yMin}
                yAxisUnit={yUnit}
                yAxisFontSize={yAxisFontSize}
                yAxisUnitPrecision={yAxisUnitPrecision}
              />
            </View>

            {/* This is little space at the bottom right corner */}
            <View style={{ backgroundColor: "transparent" }} />
          </View>
        </View>
      </View>
    );
  }
}

function GetXAxis({ xAxisData }) {
  return (
    <View
      style={{
        flex: 1,
        height: "100%",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: "transparent"
      }}
    >
      {xAxisData.map(d => {
        return getXAxisSingleComponent(d);
      })}
    </View>
  );
}

function getXAxisSingleComponent(label) {
  return (
    <View
      style={{
        // flex: 1,
        // alignContent: 'center',
        alignItems: "center",
        justifyContent: "space-evenly"
      }}
    >
      <Text
        style={{
          height: 15,
          color: "#A1AAB3",
          fontFamily: "Lato",
          fontSize: 12,
          lineHeight: 15
        }}
      >
        {" "}
        {label}{" "}
      </Text>
    </View>
  );
}

function GetYAxis({
  yMaxValue,
  yMinValue,
  yAxisUnit,
  yAxisFontSize,
  yAxisUnitPrecision
}) {
  const difference = yMaxValue - yMinValue;

  return (
    <View
      style={{
        flex: 1,
        marginBottom: -6,
        marginTop: -6,
        height: "100%",
        backgroundColor: "transparent"
      }}
    >
      <Text
        style={[
          styles.verticalAxisTextStyle,
          { fontSize: yAxisFontSize, backgroundColor: "transparent" }
        ]}
      >
        {(yMinValue + difference * 1.0).toFixed(yAxisUnitPrecision)} {yAxisUnit}
      </Text>

      <View style={[styles.verticalAxisContainer, yAxisFontSize]}>
        <View style={[styles.middleStyle, { backgroundColor: "transaparent" }]}>
          <Text
            style={[styles.verticalAxisTextStyle, { fontSize: yAxisFontSize }]}
          >
            {(yMinValue + difference * 0.75).toFixed(yAxisUnitPrecision)}{" "}
            {yAxisUnit}
          </Text>
        </View>
        <View style={[styles.middleStyle, { backgroundColor: "transparent" }]}>
          <Text
            style={[styles.verticalAxisTextStyle, { fontSize: yAxisFontSize }]}
          >
            {(yMinValue + difference * 0.5).toFixed(yAxisUnitPrecision)}{" "}
            {yAxisUnit}
          </Text>
        </View>
        <View style={[styles.middleStyle, { backgroundColor: "transparent" }]}>
          <Text
            style={[styles.verticalAxisTextStyle, { fontSize: yAxisFontSize }]}
          >
            {(yMinValue + difference * 0.25).toFixed(yAxisUnitPrecision)}{" "}
            {yAxisUnit}
          </Text>
        </View>
        <View style={[styles.lowerStyle, { backgroundColor: "transparent" }]}>
          <Text
            style={[styles.verticalAxisTextStyle, { fontSize: yAxisFontSize }]}
          >
            {yMinValue.toFixed(yAxisUnitPrecision)} {yAxisUnit}
          </Text>
        </View>
      </View>
    </View>
  );
}

function DividerLines({ bottom, top, right, left }) {
  return (
    <View
      style={{
        alignContent: "flex-end",
        position: "absolute",
        flex: 1,
        backgroundColor: "transparent",
        left,
        right,
        bottom,
        top
      }}
    >
      <View
        style={[
          { height: 1 },
          styles.bottomBorderStyle,
          { backgroundColor: "transparent" }
        ]}
      />

      <View
        style={[
          styles.horizontalBoxStyle,
          styles.bottomBorderStyle,
          { backgroundColor: "transparent" }
        ]}
      />
      <View
        style={[
          styles.horizontalBoxStyle,
          styles.bottomBorderStyle,
          { backgroundColor: "transparent" }
        ]}
      />
      <View
        style={[
          styles.horizontalBoxStyle,
          styles.bottomBorderStyle,
          { backgroundColor: "transparent" }
        ]}
      />

      <View
        style={[
          styles.horizontalBoxStyle,
          styles.bottomBorderStyle,
          { backgroundColor: "transparent" }
        ]}
      />
      <View
        style={[styles.bottomBorderStyle, { backgroundColor: "transparent" }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  verticalAxisTextStyle: {
    height: 15,
    width: "100%",
    textAlign: "right",
    color: "#A1AAB3",
    fontFamily: "Lato-Regular",
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 15,
    letterSpacing: 0
  },
  verticalAxisContainer: {
    width: "100%",
    flex: 1,
    backgroundColor: "transparent",
    alignItems: "center",
    marginTop: 5
  },

  lowerStyle: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-end",
    alignContent: "flex-end",
    backgroundColor: "transparent"
  },

  upperStyle: {
    flex: 1,
    justifyContent: "flex-end",
    alignContent: "flex-start",
    backgroundColor: "transparent"
  },

  middleStyle: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-end",
    alignContent: "center",
    backgroundColor: "transparent"
  },

  bottomBorderStyle: {
    borderBottomColor: "#D9E2E8",
    borderStyle: "solid",
    borderBottomWidth: 0.3
  },

  horizontalBoxStyle: { flex: 1 }
});
