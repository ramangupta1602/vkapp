import _ from "lodash";
import React from "react";
import { View, Text } from "react-native";

function getMinMaxValue(data) {
  let values = [];
  data.map((value) => {
    if (!isNaN(value)) {
      values.push(value);
    } else if (typeof value === "object") {
      let y = Number(value.y);
      if (!isNaN(y)) {
        values.push(y);
      }
    }
  });

  if (values.length === 0) return 0;

  let max = Math.ceil(Math.max.apply(null, values));
  let min = Math.floor(Math.min.apply(null, values));
  return { max: max, min: min };
}

export const initData = (
  dataProp,
  height,
  xAxisHeight,
  min,
  max,
  gap,
  numberOfPoints = 5
) => {
  let guideArray, sortedData;
  if (!dataProp || !Array.isArray(dataProp) || dataProp.length === 0) {
    return {
      sortedData: [],
      max: 0,
      guideArray: [],
    };
  }
  let minMaxValues = getMinMaxValue(dataProp);
  let maxValue = max ?? minMaxValues.max;
  let minValue = min ?? minMaxValues.min;
  let interval = (height - xAxisHeight) / numberOfPoints;
  guideArray = getGuideArray(
    minValue,
    maxValue,
    height - xAxisHeight,
    numberOfPoints
  );
  sortedData = refineData(
    dataProp,
    maxValue,
    minValue,
    height - xAxisHeight - interval,
    gap
  );
  return {
    sortedData: sortedData,
    max: maxValue,
    selectedIndex: null,
    nowHeight: 200,
    nowWidth: 200,
    scrollPosition: 0,
    nowX: 0,
    nowY: 0,
    guideArray: guideArray,
    yInterval: interval,
  };
};

export const refineData = (indata, max, min, height, gap) => {
  // let result = [];

  let dataProp = indata;
  let data = [];
  let length = dataProp.length;
  let lastValue = null;
  let nextValue = null;
  let placesTillNextValue = 0;
  let placesSinceLastValue = 0;

  for (let i = 0; i < length; i++) {
    let totalHeightInterval = max - min;

    if (totalHeightInterval === 0) {
      totalHeightInterval = 1;
    }
    let dataObject = (dataObject = {
      gap: i * gap,
      ratioY: null,
      x: dataProp[i].x,
      y: null,
      isEmpty: true,
    });

    let isEmpty = false;
    if (dataProp[i].y === null || isNaN(dataProp[i].y)) {
      isEmpty = true;
      placesSinceLastValue += 1;
      for (let j = i; j < dataProp.length; j++) {
        if (dataProp[j].y) {
          nextValue = dataProp[j].y;
          break;
        } else {
          if (nextValue === null) {
            placesTillNextValue += 1;
          }
        }
      }

      if (!lastValue) {
        dataProp[i].y = nextValue;
      } else if (lastValue && nextValue) {
        dataProp[i].y =
          lastValue +
          ((nextValue - lastValue) / (placesTillNextValue + 1)) *
            placesSinceLastValue;
      }
    } else {
      placesSinceLastValue = 0;
      placesTillNextValue = 0;
      lastValue = dataProp[i].y;
      nextValue = null;
    }
    if (typeof dataProp[i].y === "number") {
      dataObject = {
        gap: i * gap,
        ratioY: ((dataProp[i].y - min) / totalHeightInterval) * height,
        x: dataProp[i].x,
        y: dataProp[i].y,
        isEmpty: isEmpty,
      };
    }
    data.push(dataObject);
  }

  return data;
};

export const getGuideArray = (min, max, height, numberOfPoints = 6) => {
  //let x = parseInt(max); unused variable, therefore commented.
  let arr = [];

  let interval = (max - min) / (numberOfPoints - 1);
  let availableHeight = height;
  for (let i = 0; i < numberOfPoints; i++) {
    let ratio = (availableHeight / numberOfPoints) * (i + 1);
    let value = min + interval * i;
    arr.push([ratio, value]);
  }

  return arr;
};

export const drawYAxis = (color = "#e0e0e0") => {
  return (
    <View
      style={{
        borderRightWidth: 1,
        borderColor: color,
        width: 1,
        height: "100%",
        marginRight: 0,
      }}
    />
  );
};

export const drawYAxisLabels = (arr, height, minValue, color = "#000000") => {
  return (
    <View
      style={{
        width: 33,
        height: "100%",
        justifyContent: "space-between",
        marginRight: 5,
        alignItems: "flex-end",
        // marginBottom: minValue && arr && arr.length > 0 ? -1 * arr[0][1] * minValue : null,
        // overflow: 'hidden',
        // backgroundColor: 'red',
      }}>
      {arr.reverse().map((v, i) => {
        let label = isNaN(v[1]) ? "" : v[1].toFixed(1);
        return (
          <View
            key={"guide" + i}
            style={{
              bottom: v[0] - 6,
              position: "absolute",
            }}>
            <Text style={{ fontSize: 12, color: color }}>{label}</Text>
          </View>
        );
      })}
      <View
        key={"guide0"}
        style={{
          bottom: 0,
          position: "absolute",
        }}>
        <Text style={{ fontSize: 11 }} />
      </View>
    </View>
  );
};
export const drawGuideLine = (arr, color = "#e0e0e0") => {
  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
      }}>
      {arr.map((v, i) => {
        return (
          <View
            key={"guide" + i}
            style={{
              width: "100%",
              borderBottomWidth: 1,
              borderBottomColor: color,
              bottom: v[0],
              position: "absolute",
            }}
          />
        );
      })}
    </View>
  );
};

export const drawXAxis = (color = "#e0e0e0") => {
  return (
    <View
      style={{
        width: "100%",
        borderTopWidth: 1,
        borderTopColor: color,
        // marginLeft: 40,
        marginBottom: 5,
      }}
    />
  );
};
export const drawXAxisLabels = (sortedData, gap, color = "blue") => {
  return (
    <View
      style={{
        width: "100%",
        paddingVertical: 10,
        // marginLeft: 15,
        height: 10,
        // backgroundColor: 'yellow'
      }}>
      {sortedData.map((data, i) => {
        if (data["x"]) {
          return (
            <View
              key={"label" + i}
              style={{
                position: "absolute",
                left: data["gap"], // - gap / 2,
                alignItems: "center",
              }}>
              <Text style={{ fontSize: 12, color: color }}>{data["x"]}</Text>
            </View>
          );
        } else {
          return null;
        }
      })}
    </View>
  );
};
