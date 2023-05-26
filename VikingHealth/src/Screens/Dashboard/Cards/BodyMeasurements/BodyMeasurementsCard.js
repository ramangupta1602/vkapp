import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Modal,
} from "react-native";
import { ProgressBarHeightToWaistRatio } from "../../ProgressBarHeightToWaistRatio";
import { cardStyles } from "../CardStyles";
import { Card } from "../Card";
import { strings } from "../../../../utility/locales/i18n";
import { R } from "Resources";
import * as DateUtil from "Library/Utils/DateUtil";
import { HeightWeightUtil } from "Library/Utils/HeightWeightUtil";
import { WaistToHeightRatio } from "../../../BodyMeasurementsDetails/WaistToHeightRatio";
import AppUtil from "Library/Utils/AppUtil";
import { inject, observer } from "mobx-react";

const MeasurementRow = ({ measurement, value, unit }) => (
  <View
    style={{
      flexDirection: "row",
      marginTop: 6,
      lineHeight: 12,
      backgroundColor: "white",
    }}
  >
    <Text style={cardStyles.measurementTextStyle}>{measurement}</Text>
    <Text style={cardStyles.measurementValueStyle}>
      {value} {unit}
    </Text>
  </View>
);

@inject("userAccountStore", "loginUserStore")
@observer
export class BodyMeasurementsCard extends Component {
  state = { isWaistToHeighRatioScreenVisible: false };

  measurements() {
    let bodyMeasurement = this.props.bodyMeasurement;
    let unit = this.props.loginUserStore.displayHeightUnit;
    let unitText = HeightWeightUtil.heightUnit(unit);
    return (
      <View>
        {/*  */}
        <MeasurementRow
          measurement="Neck"
          value={bodyMeasurement.displayNeck(unit)}
          unit={unitText}
        />
        <MeasurementRow
          measurement="Shoulder"
          value={bodyMeasurement.displayShoulder(unit)}
          unit={unitText}
        />
        <MeasurementRow
          measurement="Chest"
          value={bodyMeasurement.displayChest(unit)}
          unit={unitText}
        />
        <MeasurementRow
          measurement="Arms"
          value={bodyMeasurement.displayArms(unit)}
          unit={unitText}
        />
        <MeasurementRow
          measurement="Waist"
          value={bodyMeasurement.displayWaist(unit)}
          unit={unitText}
        />
        <MeasurementRow
          measurement="Hips"
          value={bodyMeasurement.displayHips(unit)}
          unit={unitText}
        />
        <MeasurementRow
          measurement="Thighs"
          value={bodyMeasurement.displayThighs(unit)}
          unit={unitText}
        />
        <MeasurementRow
          measurement="Calves"
          value={bodyMeasurement.displayCalf(unit)}
          unit={unitText}
        />
      </View>
    );
  }

  openWaistToHeightRatioModal() {
    return (
      <Modal
        animationType="slide"
        transparent
        visible={this.state.isWaistToHeighRatioScreenVisible}
      >
        <WaistToHeightRatio
          ratio={this.getWaistToHeightRatio()}
          onCrossClicked={() => {
            this.setState({ isWaistToHeighRatioScreenVisible: false });
          }}
        />
      </Modal>
    );
  }

  getWaistToHeightRatio() {
    let height = this.props.userAccountStore.cmHeight;
    let waist = this.props.bodyMeasurement.displayWaist(
      HeightWeightUtil.HEIGHT_CM
    );
    return AppUtil.getWaistToHeightRatio(waist, height);
  }

  render() {
    let date = this.props.bodyMeasurement.date;
    let isDataAdded = DateUtil.isWithinAWeek(date);

    return (
      <TouchableOpacity
        testID={"bmCard"}
        accessibilityLabel={"bmCard"}
        activeOpacity={1}
        onPress={this.props.onCardSelect}
        style={{ flex: 1, backgroundColor: "transparent" }}
      >
        {this.openWaistToHeightRatioModal()}
        <Text style={cardStyles.cardTitleStyle}>Body Measurements</Text>
        <View style={{ marginTop: 3 }} />
        <View style={styles.measurmentContainer}>{this.measurements()}</View>

        {/* WthrContainer */}

        <TouchableOpacity
          testID={"openWtHRPopup"}
          accessibilityLabel={"openWtHRPopup"}
          style={{ flex: 1, marginTop: -8 }}
          onPress={() => {
            this.setState({ isWaistToHeighRatioScreenVisible: true });
          }}
        >
          <View style={[styles.ratioContainer]}>
            <View
              style={{
                flex: 1,
              }}
            >
              <View style={{}}>
                <Text style={[styles.ratioText]}>
                  {"Waist to Height Ratio"}
                </Text>
              </View>
              <View>
                <Text style={[cardStyles.subTextStyle, { fontSize: 12 }]}>
                  {strings("dashboard.wthr")}
                </Text>
              </View>
            </View>

            <ProgressBarHeightToWaistRatio
              gender={this.props.gender}
              value={this.getWaistToHeightRatio()}
            />
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  measurmentContainer: {
    flex: 1,
    flexDirection: "column",
    // backgroundColor: 'yellow',
  },

  ratioContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(240,242,244,1)",
    margin: -14,
    marginTop: 16,
    paddingVertical: 10,
    paddingLeft: 14,
    paddingRight: 19,
    borderRadius: 8,
  },

  ratioText: {
    fontSize: 12,
    fontFamily: "Lato-Regular",
    marginTop: 10,
    color: R.Colors.COLOR_TEXT,
  },
  wthrText: {
    fontSize: 12,
    fontFamily: "Lato-Regular",
    marginTop: 3,
    lineHeight: 15,
    fontWeight: "600",
    color: R.Colors.COLOR_TEXT_LIGHT,
  },
});
