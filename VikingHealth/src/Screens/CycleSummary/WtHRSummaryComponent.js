import React from "react";
import { Text, View, Image } from "react-native";
import Styles, { GAIN_COLOR, LOSS_COLOR } from "./styles";
import { strings } from "../../utility/locales/i18n";
import AppUtil from "../../Library/Utils/AppUtil";
import { R } from "../../Resources/R";

function getMessage(initialWtHR, finalWtHR) {
  if (initialWtHR === finalWtHR) {
    return strings("cycleSummary.wthr-noChange");
  }

  if (initialWtHR > finalWtHR) {
    return strings("cycleSummary.wthr-decrease");
  }

  return strings("cycleSummary.wthr-increase");
}

const WtHRSummaryComponent = ({ height, initialWaist, finalWaist }) => {
  const initialWtHR = AppUtil.getWaistToHeightRatio(initialWaist, height);
  const finalWtHR = AppUtil.getWaistToHeightRatio(finalWaist, height);
  const message = getMessage(initialWtHR, finalWtHR);
  const pointLoss = finalWtHR - initialWtHR;
  const lossIndicatorColor = pointLoss > 0 ? GAIN_COLOR : LOSS_COLOR;
  const arrowIcon = pointLoss > 0 ? R.Images.ArrowUp : R.Images.ArrowDown;

  const roundedInitialWtHR = initialWtHR.toFixed(1);
  const roundedFinalWtHR = finalWtHR.toFixed(1);

  return (
    <View style={Styles.bmiContainerStyle}>
      <Text style={Styles.componentTitleStyle}>
        {strings("cycleSummary.currentWtHR")}
      </Text>

      <View style={Styles.wthrContainerStyle}>
        <View style={Styles.currentValueContainer}>
          <Text style={Styles.currentWthrTextStyle}>{roundedFinalWtHR}</Text>
          <View
            style={[
              Styles.lossIndicatorContainer,
              { backgroundColor: lossIndicatorColor },
            ]}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}>
              <Image style={Styles.arrowStyle} source={arrowIcon} />
              <Text style={Styles.lossTextStyle}>
                {Math.abs(pointLoss).toFixed(1)}
              </Text>
            </View>
            <Text style={Styles.pointTextStyle}>points</Text>
          </View>
        </View>

        <View style={Styles.startingWthrContainerStyle}>
          <Text style={Styles.startingWthrTextStyle}>
            {strings("cycleSummary.startingWtHR", {
              startWtHR: roundedInitialWtHR,
            })}
          </Text>
        </View>
      </View>

      <Text style={Styles.wthrMessageTextStyle}>{message}</Text>
    </View>
  );
};

export default WtHRSummaryComponent;
