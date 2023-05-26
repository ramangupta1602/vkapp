import React from "react";
import { Text, View } from "react-native";
import Styles from "./styles";
import { strings } from "../../utility/locales/i18n";
import BMComparisonTable from "./BMComparisonTable";
import WHtRSummaryComponent from "./WtHRSummaryComponent";
import { HeightWeightUtil } from "Library/Utils/HeightWeightUtil";

function convertToUserSelectedUnit(data, unit) {
  if (data.unit === unit) {
    return data;
  }

  const changedData = { unit };

  for (const property in data) {
    const initialValue = data[property];

    const convertedValue =
      unit === HeightWeightUtil.HEIGHT_IN
        ? HeightWeightUtil.inchValue(initialValue)
        : HeightWeightUtil.cmValue(initialValue);

    changedData[property] = parseFloat(convertedValue.toFixed(1));
  }

  return changedData;
}

function computeLoss(initialBM, finalBM) {
  let diff = 0;

  for (const property in initialBM) {
    diff += finalBM[property] - initialBM[property];
  }

  return diff;
}

function getMessage(initialBM, loss, heightUnit) {
  // only possible when no data is logged
  if (initialBM.neck === 0) {
    return strings("cycleSummary.noBMLog");
  }

  const unit = heightUnit === HeightWeightUtil.HEIGHT_IN ? "inches" : "cms";

  if (parseFloat(loss) > 0) {
    return strings("cycleSummary.bmLoss", {
      period: "last 3 months",
      lossOrGain: "gained",
      unit,
    });
  }

  return strings("cycleSummary.bmLoss", {
    period: "last 3 months",
    lossOrGain: "lost",
    unit,
  });
}

const BMSummaryComponent = ({
  initialBM,
  lastRecordedBM,
  heightUnit,
  cmHeight,
  animate,
}) => {
  const convertedInitialBM = convertToUserSelectedUnit(initialBM, heightUnit);
  const convertedFinalBM = convertToUserSelectedUnit(
    lastRecordedBM,
    heightUnit
  );

  const diff = computeLoss(convertedInitialBM, convertedFinalBM);
  const message = getMessage(initialBM, diff, heightUnit);
  const unit = HeightWeightUtil.heightUnit(heightUnit);
  const loss = Math.abs(diff).toFixed(2);

  return (
    <View style={[Styles.weightComponentStyle, { marginTop: 20 }]}>
      <View style={Styles.weightContainerStyle}>
        <Text style={Styles.componentTitleStyle}>
          {strings("cycleSummary.bmTitle")}
        </Text>

        <View style={Styles.weightDetailStyle}>
          <View style={Styles.weightLossContainerStyle}>
            {/* Texts */}
            <Text style={Styles.boldLossTextStyle}>{loss}</Text>
            <Text style={Styles.unitTextStyle}>{unit}.</Text>
            <View style={Styles.textContainerStyle}>
              <Text style={Styles.lossTextDescriptionStyle}>{message}</Text>
            </View>
          </View>

          <View>
            <BMComparisonTable
              initialBM={convertedInitialBM}
              finalBM={convertedFinalBM}
              animate={animate}
            />
          </View>
        </View>
      </View>

      <WHtRSummaryComponent
        height={cmHeight}
        initialWaist={HeightWeightUtil.convertToCM(
          initialBM.waist,
          initialBM.unit
        )}
        finalWaist={HeightWeightUtil.convertToCM(
          lastRecordedBM.waist,
          lastRecordedBM.unit
        )}
      />
    </View>
  );
};

export default BMSummaryComponent;
