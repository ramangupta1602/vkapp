import React from "react";
import { View } from "react-native";
import Styles, { GAIN_COLOR, LOSS_COLOR } from "./styles";
import { strings } from "../../utility/locales/i18n";
import ComparisonTableRow from "./ComparisonTableRow";

const BMComparisonTable = ({ initialBM, finalBM, animate }) => {
  const parts = [
    { part: "neck", displayName: "Neck" },
    { part: "shoulder", displayName: "Shoulder" },
    { part: "chest", displayName: "Chest" },
    { part: "arms", displayName: "Upper Arms" },
    { part: "waist", displayName: "Waist" },
    { part: "hips", displayName: "Hips" },
    { part: "thighs", displayName: "Thighs" },
  ];

  return (
    <View style={Styles.comparisonTableContainerStyle}>
      <ComparisonTableRow
        name=""
        start={strings("cycleSummary.start")}
        end={strings("cycleSummary.end")}
        endColumnStyle={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
      />

      {parts.map(({ part, displayName }) => {
        return (
          <ComparisonTableRow
            name={displayName}
            start={initialBM[part]}
            end={finalBM[part]}
            animate={part === "waist" ? animate : null}
            backgroundColor={
              part === "waist"
                ? finalBM.waist <= initialBM.waist
                  ? LOSS_COLOR
                  : GAIN_COLOR
                : null
            }
          />
        );
      })}

      <ComparisonTableRow
        name="Calves"
        start={initialBM.calf}
        end={finalBM.calf}
        endColumnStyle={{
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
          paddingBottom: 7,
        }}
      />
    </View>
  );
};

export default BMComparisonTable;
