import React from "react";
import { Text, View, Dimensions } from "react-native";
import Styles from "./styles";
import { strings } from "../../utility/locales/i18n";
import { SummaryGraph } from "Components";
import BMISummaryComponent from "./BMISummaryComponent";
import TargetWeightShortContainer from "./TargetWeightShortContainer";
import { HeightWeightUtil } from "../../Library/Utils/HeightWeightUtil";
import { WeightLog } from "Library/Models/WeightLogModel";
import * as WeightLogQueries from "AppSyncQueries/WeightLogQueries";
import { Query } from "react-apollo";
import * as GraphUtil from "../../utility/GraphUtil";

const { width } = Dimensions.get("window");

function calculateWeightLoss(initialWeightLog, finalWeightLog, weightUnit) {
  const convertedInitialWeight = HeightWeightUtil.convertWeightToUnit(
    initialWeightLog,
    weightUnit
  );
  const convertedFinalWeight = HeightWeightUtil.convertWeightToUnit(
    finalWeightLog,
    weightUnit
  );

  return convertedFinalWeight - convertedInitialWeight;
}

function processWeightLogHistory(data, unit) {
  const weightUnit = unit;
  let weightLogObjs = [];
  const filledWeights = {};

  if (data) {
    const weightLogs = data.weightLogs;

    if (weightLogs) {
      weightLogObjs = weightLogs.map((item) => {
        const weightLog = new WeightLog(
          item.weight,
          item.date,
          item.weightUnit
        );
        return weightLog;
      });
      weightLogObjs.map((item) => {
        filledWeights[item.date] = item.displayWeight(weightUnit);
      });
    }
  }

  return {
    filledWeights,
  };
}

function getWeightMessage(initialWeightLog, weightLoss) {
  // 0 is saved in history object only when we don't log any data in that period.
  if (initialWeightLog.weight === 0) {
    return strings("cycleSummary.noWeightLog");
  }

  // final is greater than initial, i.e, weight gained
  if (weightLoss > 0) {
    return strings("cycleSummary.weightLost", {
      lossOrGain: "gained",
    });
  }
  return strings("cycleSummary.weightLost", {
    lossOrGain: "lost",
  });
}

const WeightSummaryComponent = ({
  initialWeightLog,
  finalWeightLog,
  initialBMI,
  finalBMI,
  weightUnit,
  userId,
  startDate,
  endDate,
  targetWeight,
}) => {
  const weightLoss = calculateWeightLoss(
    initialWeightLog,
    finalWeightLog,
    weightUnit
  );

  const displayWeightLoss = Math.abs(weightLoss).toFixed(1);

  const unit = HeightWeightUtil.weightUnit(weightUnit);
  const weightMessage = getWeightMessage(initialWeightLog, weightLoss);
  const convertedFinalWeight = HeightWeightUtil.convertWeightToUnit(
    finalWeightLog,
    weightUnit
  );
  const targetWeightShort = (convertedFinalWeight - targetWeight).toFixed(1);

  return (
    <View>
      <View style={Styles.weightComponentStyle}>
        <View style={Styles.weightContainerStyle}>
          <Text style={Styles.componentTitleStyle}>
            {strings("cycleSummary.weightTitle")}
          </Text>

          <View style={Styles.weightDetailStyle}>
            <View style={Styles.weightLossContainerStyle}>
              {/* Texts */}
              <Text style={Styles.boldLossTextStyle}>{displayWeightLoss}</Text>
              <Text style={Styles.unitTextStyle}>{unit}</Text>
              <View style={Styles.textContainerStyle}>
                <Text style={Styles.lossTextDescriptionStyle}>
                  {weightMessage}
                </Text>
              </View>
            </View>
            {/* Graph */}
            <Query
              query={WeightLogQueries.GetWeightLogs}
              variables={{
                userId,
                fromDate: startDate,
                toDate: endDate,
              }}
              fetchPolicy="cache-and-network">
              {({ data }) => {
                const { filledWeights } = processWeightLogHistory(
                  data,
                  weightUnit
                );

                const xAxisData = GraphUtil.getXAxisData(
                  startDate,
                  endDate,
                  false
                );

                return (
                  <View style={Styles.graphStyle}>
                    <SummaryGraph
                      filledItems={filledWeights}
                      startDate={startDate}
                      endDate={endDate}
                      dataRange={"all"}
                      graphWidth={width - 64}
                      programEndDate={endDate}
                      unit={unit}
                      xAxisData={xAxisData}
                      showStartPoint
                    />
                  </View>
                );
              }}
            </Query>
          </View>
        </View>
        <View>
          <BMISummaryComponent initialBMI={initialBMI} finalBMI={finalBMI} />
        </View>
      </View>

      <TargetWeightShortContainer weight={targetWeightShort} unit={unit} />
    </View>
  );
};

export default WeightSummaryComponent;
