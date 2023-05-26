import React from "react";
import { View, Image } from "react-native";
import { R } from "../../Resources/R";
import CardStyle from "./RewardCards/Styles";
import TextAnimation from "../../Components/TextAnimation";

const RewardPointView = ({ total, animate }) => {
  return (
    <View style={{ flexDirection: "row" }}>
      {/* <Text style={CardStyle.totalRewardTextStyle}>{total}</Text> */}
      <TextAnimation
        style={CardStyle.totalRewardTextStyle}
        number={total}
        animate={animate}
      />
      <Image
        style={CardStyle.rewardIconStyle}
        source={R.Images.Tab_Reward_Active}
      />
    </View>
  );
};

export default RewardPointView;
