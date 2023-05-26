import React from "react";
import Svg, { Path } from "react-native-svg";

export const CalorieStarIcon = ({ color }) => {
  return (
    <Svg width='9' height='14' viewBox='0 0 9 14'>
      <Path
        d='M4.2142,9.0737L0.9287,9.0737C0.5746,9.0737 0.3812,8.4838 0.6079,8.0952L4.7841,0.9367C5.0511,0.4791 5.571,0.8015 5.5193,1.3926L5.1604,5.4944L8.4459,5.4944C8.8,5.4944 8.9934,6.0843 8.7667,6.4728L4.5905,13.6314C4.3235,14.089 3.8036,13.7665 3.8553,13.1755L4.2142,9.0737Z'
        fill={color}
      />
    </Svg>
  );
};
