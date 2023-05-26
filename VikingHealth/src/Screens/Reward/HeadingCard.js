import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  NativeModules,
  LayoutAnimation,
} from "react-native";
import Styles from "./Styles";
import Triangle from "../../Resources/ImageFromCode/Triangle";

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

const RewardItem = ({ reward }) => {
  const rewardPoints = reward.points;
  const pointText = rewardPoints === 1 ? "Point" : "Points";

  return (
    <View>
      <View style={Styles.rewardItemStyle}>
        <Text style={[Styles.rewardItemTitleStyle, { flex: 2 }]}>
          {reward.title}
        </Text>
        <Text style={[Styles.rewardItemTitleStyle, { flex: 1 }]}>
          {reward.points} {pointText}
        </Text>
      </View>
      <View style={Styles.separatorStyle} />
    </View>
  );
};

export default class HeadingCard extends Component {
  constructor(props) {
    super(props);

    this.state = { isContentExpanded: false };
  }

  onCardClick = () => {
    const { isContentExpanded } = this.state;
    LayoutAnimation.easeInEaseOut();
    this.setState({ isContentExpanded: !isContentExpanded });
  };

  render() {
    const { reward } = this.props;
    const { isContentExpanded } = this.state;
    const triangleRotation = isContentExpanded ? "0deg" : "180deg";

    return (
      <View>
        <TouchableOpacity
          style={Styles.cardHeaderStyle}
          activeOpacity={1}
          onPress={this.onCardClick}
        >
          <Image style={Styles.cardIconStyle} source={reward.icon} />
          <Text style={Styles.cardTitleStyle}>{reward.name}</Text>

          <Triangle
            style={{
              weight: 8,
              height: 6,
              transform: [{ rotate: triangleRotation }],
            }}
          />
        </TouchableOpacity>

        {isContentExpanded && (
          <View style={Styles.cardContentStyle}>
            {reward.rewards.map((rewardItem) => {
              return <RewardItem reward={rewardItem} />;
            })}
          </View>
        )}
      </View>
    );
  }
}
