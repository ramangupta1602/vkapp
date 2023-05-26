import React, { Component } from "react";
import { TouchableOpacity, View, Image, Text, StyleSheet } from "react-native";
import { R } from "../../../../Resources";
import { cardStyles } from "../CardStyles";

export class ApprovedFoodListCard extends Component {
  render() {
    const style = this.props.style;
    return (
      <TouchableOpacity
        testID={"approvedFoodList"}
        accessibilityLabel={"approvedFoodList"}
        style={[
          cardStyles.emptyCard,
          { paddingVertical: 0, paddingRight: 0 },
          style,
        ]}
        onPress={() => {
          this.props.onCardSelect();
        }}
      >
        <View
          style={[
            StyleSheet.absoluteFill,
            { alignItems: "flex-end", overflow: "hidden" },
          ]}
        >
          <Image
            style={{ width: 100, height: 100 }}
            source={R.Images.approvedFoodListBanner}
            resizeMode="contain"
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            flex: 1,
            marginRight: 70,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              flex: 1,
              // alignContent: "center",
              alignItems: "center",
              // justifyContent: "center",
              // height: 84,
            }}
          >
            <Text style={cardStyles.approvedFoodCardTitle}>
              View approved food list
            </Text>
            <Image
              style={{
                width: 15,
                height: 11,
                marginLeft: 10,
              }}
              source={R.Images.redArrow}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
