import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Styles from '../Styles';
import { R } from '../../../Resources/R';
import { BackButton, ProgressBarButton } from '../../../Components';
import ScreenNameConstant from '../../../Screens/ScreenNameConstant';
import { PrepareRewardData, RewardKeys } from '../RewardManager';
import { inject, observer } from 'mobx-react';
import RewardCardContainer from '../RewardCards/RewardCardContainer';
import CardStyle from '../RewardCards/Styles';
import { Mutation } from 'react-apollo';
import RedeemModal from '../Redeem/RedeemModal';
import * as UserQueries from '../../../AppSyncQueries/UserQueries';
import { ButtonState } from 'Components/CTAButton/ButtonState';
// import { Sentry } from 'react-native-sentry';
import { checkInternetConnection } from 'react-native-offline';
import RewardHistoryStyle from './Styles';
import RewardPointView from '../RewardPointView';
import { strings } from '../../../utility/locales/i18n';
import * as DateUtil from '../../../Library/Utils/DateUtil';

import {
  shouldShowRedeem,
  convertPointToAmountString,
  hasRewardExpired,
} from '../RewardManager';
import ToolTipComponent, {
  Alignment,
} from '../../../Components/ToolTipComponent/ToolTipComponent';

@inject('rewardStore', 'userAccountStore')
@observer
export class RewardHistory extends Component {
  constructor(props) {
    super(props);

    const startDate = props.userAccountStore.startDate;
    const hasExpired = hasRewardExpired(startDate);

    const hasRedeemed = this.props.rewardStore.rewardData[
      RewardKeys.HasRedeemedForCurrentCycle
    ];
    const hasCreditUsed = this.props.rewardStore.rewardData[
      RewardKeys.HasCreditUsed
    ];

    this.state = {
      showRedeemCard: false,
      hasRedeemed,
      hasExpired,
      hasCreditUsed,
      shouldShowRedeemButton:
        shouldShowRedeem(startDate) && !hasRedeemed && !hasExpired,
    };
  }

  onInfoIconClick = (shouldScroll = false) => {
    this.props.navigation.navigate(ScreenNameConstant.RewardInformation, {
      shouldScrollToBottom: shouldScroll,
    });
  };

  onTermConditionClick = () => {
    this.onInfoIconClick(true);
  };

  onInfoIconTooltipPressed = () => {
    this.props.rewardStore.unsetRewardHistoryTooltip();
    this.props.navigation.navigate(ScreenNameConstant.RewardInformation);
  };

  onRedeemClick = () => {
    this.setState({ showRedeemCard: true, hasRedeemed: false });
  };

  onPointRedeem = () => {
    this.props.rewardStore.setPointRedeemed(true);
    this.setState({ hasRedeemed: true, shouldShowRedeemButton: false });
  };

  getRewardInfo = () => {
    const { hasCreditUsed, hasRedeemed, hasExpired } = this.state;
    const { total } = this.props.rewardStore.rewardData;

    if (hasCreditUsed) {
      return {
        backgroundImage: R.Images.RewardImages.CreditUsedBackground,
        text: strings('RedeemFeature.creditUsed'),
        preTC: strings('RedeemFeature.descCreditUsed'),
        termAndCondition: '',
        postTC: '',
      };
    }

    if (!hasRedeemed && !hasExpired) {
      return {
        backgroundImage: R.Images.RewardImages.TotalBackground,
        text: strings('RedeemFeature.totalPointEarned'),
        preTC: strings('RedeemFeature.pointConversion'),
        termAndCondition: '',
        postTC: '',
      };
    }

    if (!hasRedeemed && hasExpired) {
      return {
        backgroundImage: R.Images.RewardImages.ExpiredImage.PointExpired,
        text:
          total < 2 ? 'Point Expired' : strings('RedeemFeature.pointExpired'),
        preTC: strings('RedeemFeature.descExpire', { type: 'points have' }),
        termAndCondition: strings('RedeemFeature.termAndCondition'),
        postTC: '.',
      };
    }

    if (hasRedeemed && !hasExpired) {
      return {
        backgroundImage: R.Images.RewardImages.RedeemedCard,
        text: strings('RedeemFeature.creditEarned'),
        preTC: strings('RedeemFeature.afterRedeemMessage'),
        termAndCondition: strings('RedeemFeature.termAndCondition'),
        postTC: ' before availing credit.',
      };
    }

    if (hasRedeemed && hasExpired) {
      return {
        backgroundImage: R.Images.RewardImages.ExpiredImage.CreditExpired,
        text: strings('RedeemFeature.creditExpired'),
        preTC: strings('RedeemFeature.descExpire', { type: 'credit has' }),
        termAndCondition: strings('RedeemFeature.termAndCondition'),
        postTC: '.',
      };
    }
  };

  render() {
    const rewardData = this.props.rewardStore.rewardData;
    const arrangedData = PrepareRewardData(rewardData);
    const {
      showRedeemCard,
      hasRedeemed,
      shouldShowRedeemButton,
      hasCreditUsed,
    } = this.state;
    const userId = this.props.userAccountStore.username;

    const {
      backgroundImage,
      text,
      descriptionText,
      preTC,
      termAndCondition,
      postTC,
    } = this.getRewardInfo();

    const totalCredit = convertPointToAmountString(rewardData.total);

    return (
      <View style={Styles.containerStyle}>
        <ScrollView contentInset={{ bottom: 20 }}>
          <View style={R.AppStyles.headerContainer}>
            <BackButton
              navigation={this.props.navigation}
              style={{ padding: 0 }}
            />

            <View style={Styles.titleHolderStyle}>
              <Text style={Styles.titleStyle}>
                {strings('RedeemFeature.yourReward')}
              </Text>

              <TouchableOpacity
                hitSlop={{ top: 10, bottom: 10, right: 10, left: 10 }}
                onPress={this.onInfoIconClick}
                style={[Styles.infoIconStyle, { marginRight: 4 }]}
              >
                <ToolTipComponent
                  horizontalAlignment={Alignment.RIGHT}
                  verticalAlignment={Alignment.TOP}
                  shouldShowPopup={
                    this.props.rewardStore.flagShowRewardInfoTooltip
                  }
                  message={strings('RedeemFeature.toolTipMessage')}
                  onPress={this.onInfoIconTooltipPressed}
                  onHide={this.onInfoIconClick}
                >
                  <Image
                    style={Styles.infoIconStyle}
                    source={R.Images.RewardImages.RedeemInfo}
                  />
                </ToolTipComponent>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[Styles.contentStyle, { marginTop: 18 }]}>
            <View
              style={[
                RewardHistoryStyle.totalCardStyle,
                {
                  height: hasRedeemed ? 156 : 100,
                },
              ]}
            >
              <Image
                style={[
                  Styles.totalCardStyle,
                  RewardHistoryStyle.backgroundImageStyle,
                ]}
                source={backgroundImage}
                resizeMode='cover'
              />

              {!hasRedeemed && (
                <View>
                  <RewardPointView total={rewardData.total} animate />

                  <Text style={Styles.totalRewardPointEarnedTextStyle}>
                    {text}
                  </Text>
                </View>
              )}

              {hasRedeemed && (
                <View style={RewardHistoryStyle.redeemButtonContainerStyle}>
                  {hasCreditUsed && (
                    <Image
                      source={R.Images.RewardImages.GreenTick}
                      style={RewardHistoryStyle.greenTickImageStyle}
                    />
                  )}

                  <Text style={[CardStyle.totalRewardTextStyle]}>
                    {totalCredit}
                  </Text>
                  <Text
                    style={[
                      CardStyle.totalRewardTextStyle,
                      RewardHistoryStyle.totalRewardTextStyle,
                      { textTransform: 'uppercase' },
                    ]}
                  >
                    {text}
                  </Text>
                </View>
              )}

              {shouldShowRedeemButton && (
                <TouchableOpacity
                  onPress={this.onRedeemClick}
                  activeOpacity={1}
                  style={RewardHistoryStyle.redeemButtonStyle}
                >
                  <Text style={Styles.redeemTextStyle}>
                    {strings('RedeemFeature.redeem')}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={Styles.rewardPointConversionContainer}>
              <Image
                style={[
                  Styles.rewardPointConversionIcon,
                  RewardHistoryStyle.rewardPointConversionIcon,
                ]}
                source={R.Images.RewardImages.RedeemInfo}
              />

              <Text style={Styles.rewardPointConversionTextStyle}>
                {preTC}
                <Text
                  style={{ color: R.Colors.COLOR_BLUE }}
                  onPress={this.onTermConditionClick}
                >
                  {termAndCondition}
                </Text>
                {postTC}
              </Text>
            </View>
          </View>

          <RewardCardContainer
            rewardData={arrangedData}
            onRedeemClick={this.onRedeemClick}
          />
        </ScrollView>

        {showRedeemCard && (
          <RedeemModal
            hasRedeemed={hasRedeemed}
            isVisible={this.state.showRedeemCard}
            onClick={() => {
              this.setState({ showRedeemCard: false });
            }}
            totalReward={rewardData.total}
          >
            <Mutation
              mutation={UserQueries.RedeemPoints}
              onCompleted={() => {
                this.onPointRedeem();
              }}
              onError={(error) => {
                // Sentry.captureMessage(error.message);
                Alert.alert(
                  'Alert!',
                  'We are unable to redeem your points right now. Please try again later.'
                );
              }}
            >
              {(redeemPoints, { loading }) => {
                let buttonState = ButtonState.Idle;
                let buttonLabel = 'REDEEM NOW';
                if (loading) {
                  buttonState = ButtonState.Progress;
                  buttonLabel = '';
                }
                return (
                  <ProgressBarButton
                    disabled={loading}
                    label={buttonLabel}
                    buttonState={buttonState}
                    onClick={() => {
                      checkInternetConnection().then((isConnected) => {
                        if (isConnected === true) {
                          redeemPoints({
                            variables: {
                              rewards: {
                                ...rewardData,
                                [RewardKeys.HasRedeemedForCurrentCycle]: true,
                              },
                              userId,
                            },
                          });
                        } else {
                          Alert.alert(
                            'No Internet Connection',
                            strings('common_message.internet-error')
                          );
                        }
                      });
                    }}
                  />
                );
              }}
            </Mutation>
          </RedeemModal>
        )}
      </View>
    );
  }
}
