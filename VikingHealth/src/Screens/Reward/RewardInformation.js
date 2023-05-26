import React, { Component } from "react";
import { Text, View, ScrollView } from "react-native";
import Styles from "./Styles";
import { R } from "../../Resources/R";
import { BackButton } from "../../Components";
import RewardData, { RewardTermsAndCondition } from "./RewardData";
import HeadingCard from "./HeadingCard";
import { strings } from "../../utility/locales/i18n";

export class RewardInformation extends Component {
  componentDidMount() {
    const shouldScroll = this.props.navigation.getParam(
      "shouldScrollToBottom",
      false
    );

    if (shouldScroll == true) {
      setTimeout(() => {
        this.scrollRef.scrollToEnd();
      }, 500);
    }
  }

  render() {
    return (
      <View style={Styles.containerStyle}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentInset={{ bottom: 20 }}
          ref={(ref) => {
            this.scrollRef = ref;
          }}
        >
          <View style={R.AppStyles.headerContainer}>
            <BackButton
              navigation={this.props.navigation}
              style={{ padding: 0 }}
            />

            <View style={Styles.titleHolderStyle}>
              <Text style={Styles.titleStyle}>
                {strings("RewardFeature.howToEarn")}
              </Text>
            </View>
          </View>

          {/* Content  */}
          <View style={Styles.contentStyle}>
            {/* Maximum point declaration */}
            <View style={Styles.titleHolderStyle}>
              <Text style={Styles.maxPointTextStyle}>
                {strings("RewardFeature.maxPoint")}
              </Text>
              <Text style={Styles.maxPointTextStyle}>
                {strings("RewardFeature.maxMonetary")}
              </Text>
            </View>

            {/* Reward list */}
            {RewardData.map((reward) => {
              return <HeadingCard reward={reward} />;
            })}

            {/* Terms and condtion */}

            <View style={Styles.termsContainerView}>
              <Text style={Styles.termTitleStyle}>
                {RewardTermsAndCondition.title}
              </Text>

              {RewardTermsAndCondition.points.map((point) => {
                return <Text style={Styles.termPointStyle}>{point}</Text>;
              })}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}
