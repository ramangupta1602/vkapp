import { MeasurementList } from "./MeasurementList";
import React from "react";
import { View, ScrollView } from "react-native";

const MeasurementTabs = props => {
  const tabs = [
    "Neck",
    "Shoulder",
    "Chest",
    "Arms",
    "Waist",
    "Hips",
    "Thigh",
    "Calf"
  ];
  const style = {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    width: "100%"
  };
  return (
    <View style={style}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate={0}
        snapToInterval={200}
        snapToAlignment={"center"}
      >
        {tabs.map((value, index) => (
          <MeasurementList
            onClick={props.measurementClicked}
            text={value}
            indexValue={index}
            isSelected={props.selectedIndex === index}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default MeasurementTabs;
