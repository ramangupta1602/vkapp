import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image
} from "react-native";
import { cardStyles } from "./CardStyles";
import * as DateUtil from "Library/Utils/DateUtil";
import { R } from "Resources";
import { USER_TYPE } from "Library/Constants";

import { inject, observer } from "mobx-react";

@inject("loginUserStore")
@observer
export class Card extends Component {
  constructor(props) {
    super(props);
  }

  renderRightView() {
    const isDataAdded = DateUtil.isToday(this.props.updatedDate);
    if (this.props.userType == USER_TYPE.ADMIN) {
      return (
        this.props.type === "weightCard" && (
          <TouchableOpacity
            style={cardStyles.editPencilButtonStyle}
            onPress={this.props.addData}>
            <Image source={R.Images.editPencil} />
          </TouchableOpacity>
        )
      );
    } else if (this.props.userType == USER_TYPE.PATIENT) {
    
      if (this.props.type === "waterIntakeCard") {
        return !this.props.isWaterTargetAchieved ? (
          <TouchableOpacity onPress={this.props.addData}>
            <View style={{ padding: 5, paddingLeft: 10, paddingRight: 10 }}>
              <Image source={R.Images.plus} style={cardStyles.image} />
            </View>
          </TouchableOpacity>
        ) : (
          <Image source={R.Images.greenTick} style={cardStyles.image} />
        );
      }

      if (!isDataAdded) {
        return (
          <TouchableOpacity onPress={this.props.addData}>
            <View style={{ padding: 5, paddingLeft: 10, paddingRight: 10 }}>
              <Image source={R.Images.plus} style={cardStyles.image} />
            </View>
          </TouchableOpacity>
        );
      }

      return this.props.type !== "weightCard" ? (
        <TouchableOpacity onPress={this.props.addData}>
          <View style={{ padding: 5, paddingLeft: 10, paddingRight: 10 }}>
            <Image source={R.Images.plus} style={cardStyles.image} />
          </View>
        </TouchableOpacity>
      ) : (
        <Image source={R.Images.greenTick} style={cardStyles.image} />
      );
    }
  }

  render() {
    const formattedDate = DateUtil.lastUpdatedDateFormatted(
      this.props.updatedDate
    );
    return (
      <TouchableWithoutFeedback onPress={this.props.onCardSelect}>
        <View style={cardStyles.card}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 10
            }}>
            <View>
              <Text style={cardStyles.cardTitle}>{this.props.title}</Text>
            </View>
            {this.renderRightView()}
          </View>

          {this.props.children}
          {this.props.type === "waterIntakeCard" ? (
            <Image
              source={R.Images.waterIntakeCardImage}
              style={cardStyles.waterIntakeCardBottomImage}
            />
          ) : (
            <Text style={cardStyles.footer}>Updated {formattedDate}</Text>
          )}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
