import React, { Component } from "react";
import {
  Text,
  Modal,
  View,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import { ProgressBarButton } from "Components";

export class PhaseModal extends Component {
  render() {
    return (
      <Modal>
        <ScrollView
          style={{
            backgroundColor: "rgb(235,242,248)",
          }}>
          <View style={style.containerStyle}>
            <View style={{ flexDirection: "row" }}>
              <Image
                style={style.dotImageStyle}
                source={this.props.timeLineImage}
                resizeMode="contain"
              />
              <View>
                <Text style={style.previousTitle}>{this.props.phaseName}</Text>
                <Text style={style.completedTextStyle}>Completed</Text>
              </View>
            </View>

            <Image
              style={style.imageStyle}
              resizeMode="contain"
              source={this.props.transitionImage}
            />

            <Text style={style.phaseName}>{this.props.nextPhaseName}</Text>

            <Text style={style.detailStyle}>{this.props.nextPhaseDetail}</Text>

            <ProgressBarButton
              disabled={false}
              label={this.props.buttonLabel}
              buttonState={this.props.buttonState}
              onClick={() => {
                this.props.performMutation();
              }}
              style={{
                marginTop: 80,
                marginLeft: 4,
                marginRight: 4,
                width: Dimensions.get("window").width - 40,
              }}
            />
          </View>
        </ScrollView>
      </Modal>
    );
  }
}

const style = StyleSheet.create({
  previousTitle: {
    fontFamily: "Lato-Bold",
    letterSpacing: 0.43,
    lineHeight: 15,
    fontSize: 12,
    fontWeight: "bold",
    color: "#8191A2",
  },
  dotImageStyle: {
    width: 12,
    height: 47,
    marginRight: 6,
  },

  completedTextStyle: {
    color: "#42D35C",
    fontFamily: "Lato-Semibold",
    fontWeight: "600",
    letterSpacing: 0.45,
    lineHeight: 15,
  },

  /**
   * 
   * .complete-copy {
	height: 15px;
	width: 55px;
	color: #43D35C;
	font-family: Lato;
	font-size: 12px;
	font-weight: 600;
	letter-spacing: 0.45px;
	line-height: 15px;
}
   */

  containerStyle: {
    flex: 1,
    paddingTop: 49,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 20,
    backgroundColor: "rgb(235,242,248)",
  },
  completedBoxStyle: {
    flexDirection: "column",
  },
  imageStyle: {
    height: 288,
    width: 315,
    marginTop: 38,
    alignSelf: "center",
  },
  phaseName: {
    color: "#4893E7",
    fontFamily: "Lato-Bold",
    fontSize: 14,
    letterSpacing: 0.5,
    lineHeight: 17,
    marginTop: 32,
    marginLeft: 14,
    marginRight: 8,
    alignSelf: "center",
  },
  detailStyle: {
    color: "#8191A2",
    fontFamily: "Lato-Regular",
    fontSize: 14,
    lineHeight: 16,
    textAlign: "center",
    marginTop: 8,
  },
  actionStyle: {},
});

/*
.in-this-phase-you-wi {
	height: 80px;
	width: 321px;
	color: #8191A2;
	font-family: Lato;
	font-size: 14px;
	line-height: 16px;
	text-align: center;
}
*/
