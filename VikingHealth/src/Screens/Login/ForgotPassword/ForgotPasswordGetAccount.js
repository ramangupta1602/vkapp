import React, { Component } from 'react';
import { Auth } from 'aws-amplify';
import { View, Alert, TextInput } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import PhoneInput from 'react-native-phone-input';
import { styles } from './Styles';
import AppUtil from 'Library/Utils/AppUtil';
import { strings } from '../../../utility/locales/i18n';
import { R } from 'Resources';
import { BackButton, PageTitle, SubTitle, CTAButton } from 'Components';

export class ForgotPasswordGetAccount extends Component {
  static navigationOptions = {
    title: strings('login.title'),
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      isContinueEnabled: true,
      loading: false
    };
  }

  continueForgotPasswordClick() {
    const phoneNumber = this.phone.getValue().trim();
    if (
      this.phone.isValidNumber() === false ||
      AppUtil.isValidPhoneNumber(phoneNumber) === false
    ) {
      Alert.alert(
        strings('common_message.error'),
        strings('common_message.enter_valid_phone_number')
      );
      return;
    }
    this.setState({ loading: true });
    setTimeout(() => {
      this.continueForgotPassword(phoneNumber);
    }, 100);
  }

  continueForgotPassword(phoneNumber) {
    Auth.forgotPassword(phoneNumber)
      .then(data => {
        this.setState({ loading: false });
        setTimeout(() => {
          this.props.navigation.navigate('ResetPassword', {
            userName: phoneNumber
          });
        }, 100);
      })
      .catch(err => {
        this.setState({ loading: false });
        setTimeout(() => {
          this.handlerError(err);
        }, 100);
      });
  }

  handlerError(err) {
    this.setState({ loading: false });
    switch (err.code) {
      case 'UserNotFoundException':
        Alert.alert(
          strings('common_message.error'),
          strings('forgot_password.phone_number_doesnot_exists')
        );
        break;
      case 'NotAuthorizedException':
        Alert.alert(
          strings('common_message.error'),
          strings('forgot_password.cannot_reset_your_password')
        );
        break;
      default:
        Alert.alert(strings('common_message.error'), err.message);
        break;
    }
  }

  render() {
    return (
      <KeyboardAwareScrollView
      keyboardShouldPersistTaps = 'handled'
        style={{ backgroundColor: R.Colors.COLOR_APP_BACKGROUND }}
        scrollEnabled
        extraScrollHeight={50}
        enableResetScrollToCoords
        resetScrollToCoords={{ x: 0, y: 0 }}
      >
        <View style={R.AppStyles.headerContainer}>
          <BackButton navigation={this.props.navigation} />
          <PageTitle title="Forgot Password" />
          <SubTitle
            subTitle={strings(
              'forgot_password.enter_phone_associate_with_account'
            )}
          />
        </View>

        <View style={styles.view}>
          {AppUtil.renderProgressBar(
            this.state.loading,
            strings('common_message.please_wait')
          )}
          <TextInput
            style={{ height: 35, color: '#929CA5', fontSize: 14 }}
            editable={false}
            selectTextOnFocus={false}
            value="Phone Number"
          />

          <View style={styles.userName}>
            <PhoneInput
              onPressFlag={this.onPressFlag}
              onChangeText={text => this.onChangeText(text)}
              ref={ref => {
                this.phone = ref;
              }}
            />
          </View>

          <CTAButton
            label={strings('forgot_password.continue')}
            isEnabled={this.state.isContinueEnabled}
            onClick={this.continueForgotPasswordClick.bind(this)}
            style={{ marginTop: 30 }}
          />
        </View>
      </KeyboardAwareScrollView>
    );
  }
}
