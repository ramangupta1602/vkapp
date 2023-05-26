import React, { Component } from 'react';
import { View, Alert } from 'react-native';
import { Auth } from 'aws-amplify';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { styles } from './Styles';
import { strings } from '../../../utility/locales/i18n';
import AppUtil from 'Library/Utils/AppUtil';
import { R } from 'Resources';
import {
  BackButton,
  PageTitle,
  SubTitle,
  CTAButton,
  FloatingLabelInput
} from 'Components';

export class ResetPassword extends Component {
  static navigationOptions = {
    title: strings('reset_password.title'),
    header: null
  };

  constructor(props) {
    super(props);

    this.otpInput = React.createRef();
    this.passwordInput = React.createRef();
    this.confirmPasswordInput = React.createRef();

    const { navigation } = this.props;
    const { userName } = navigation.state.params;

    this.state = {
      username: userName,
      otp: '',
      newPassword: '',
      confirmPassword: '',
      isOTPValid: true,
      isNewPasswordValid: true,
      isPasswordMismatch: false,
      isSubmitEnabled: false,
      loading: false
    };
  }

  resetPasswordClick() {
    const username = this.state.username;
    const otp = this.state.otp;
    const password = this.state.newPassword;

    let shouldProceed = true;
    if (!AppUtil.isValidOtp(otp)) {
      this.setState({ isOTPValid: false });
      shouldProceed = false;
    }

    if (!AppUtil.isValidPassword(password)) {
      this.setState({ isNewPasswordValid: false });
      shouldProceed = false;
    }

    if (password !== this.state.confirmPassword) {
      this.setState({ isPasswordMismatch: true });
      shouldProceed = false;
    }

    if (!shouldProceed) {
      Alert.alert(
        strings('common_message.error'),
        strings('common_message.please_enter_valid_details')
      );
      return;
    }

    this.setState({ loading: true });
    setTimeout(() => {
      this.resetPassword(username, otp, password);
    }, 100);
  }

  resetPassword(username, otp, password) {
    Auth.forgotPasswordSubmit(username, otp, password)
      .then(data => {
        this.setState({ loading: false });
        setTimeout(() => {
          Alert.alert(
            strings('common_message.success'),
            strings('reset_password.password_updated_successfully')
          );
          this.gotoLogin();
        }, 100);
      })
      .catch(error => {
        this.setState({ loading: false });
        setTimeout(() => {
          Alert.alert(strings('common_message.error'), error.message);
        }, 100);
      });
  }

  gotoLogin() {
    this.props.navigation.dispatch(AppUtil.resetAction('Login', {}));
  }

  matchPasswords() {
    const { newPassword, confirmPassword } = this.state;
    if (newPassword === confirmPassword) {
      this.setState({ isPasswordMismatch: false });
    } else {
      this.setState({ isPasswordMismatch: true });
    }
  }

  validatePasswordRequirement() {
    const password = this.state.newPassword;
    if (!AppUtil.isValidPassword(password)) {
      this.setState({ isNewPasswordValid: false });
      return false;
    }
    this.setState({ isNewPasswordValid: true });
    return true;
  }

  checkSubmitButtonStatus() {
    const otp = this.state.otp;
    const password = this.state.newPassword;
    const confirmPassword = this.state.confirmPassword;
    if (
      AppUtil.isValidPassword(password) &&
      password === confirmPassword &&
      otp !== ''
    ) {
      this.setState({ isSubmitEnabled: true });
    } else {
      this.setState({ isSubmitEnabled: false });
    }
  }

  render() {
    return (
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        style={{ backgroundColor: R.Colors.COLOR_APP_BACKGROUND }}
        scrollEnabled
        extraScrollHeight={50}
        enableResetScrollToCoords
        resetScrollToCoords={{ x: 0, y: 0 }}
      >
        <View style={R.AppStyles.headerContainer}>
          <BackButton navigation={this.props.navigation} />
          <PageTitle title="Reset Password" />
          <SubTitle subTitle={strings('reset_password.subTitle')} />
        </View>
        <View style={styles.container}>
          {AppUtil.renderProgressBar(
            this.state.loading,
            strings('common_message.please_wait')
          )}

          <FloatingLabelInput
            style={styles.textField}
            secureTextEntry
            label={strings('reset_password.enter_otp')}
            value={this.state.otp}
            returnKeyType="next"
            keyboardType="number-pad"
            maxLength={6}
            onChangeText={text => {
              this.setState({ otp: text }, () => {
                this.checkSubmitButtonStatus();
                if (text.length === 6) {
                  this.passwordInput.current.becomeFirstResponder();
                }
              });
            }}
            onSubmitEditing={() => {
              this.passwordInput.current.becomeFirstResponder();
            }}
            onFocus={() => {
              this.setState({ isOTPValid: true });
            }}
            onBlur={() => {
              this.setState({ isOTPValid: this.state.otp.length === 6 });
            }}
            ref={this.otpInput}
            isError={!this.state.isOTPValid}
            errorDescription={strings('reset_password.enter_valid_otp')}
          />

          <FloatingLabelInput
            style={styles.textField}
            secureTextEntry
            label={strings('reset_password.new_password')}
            value={this.state.newPassword}
            returnKeyType="next"
            onChangeText={text => {
              this.setState(
                { newPassword: AppUtil.shouldNotContainWhiteSpaces(text) },
                () => {
                  this.checkSubmitButtonStatus();
                }
              );
            }}
            onSubmitEditing={() => {
              this.confirmPasswordInput.current.becomeFirstResponder();
            }}
            onFocus={() => {
              this.setState({ isNewPasswordValid: true });
            }}
            onBlur={() => {
              this.setState({
                isNewPasswordValid: this.state.newPassword.length >= 8
              });
            }}
            ref={this.passwordInput}
            isError={!this.state.isNewPasswordValid}
            errorDescription={strings('reset_password.minimum_password_length')}
          />

          <FloatingLabelInput
            style={styles.textField}
            secureTextEntry
            label={strings('reset_password.confirm_new_password')}
            returnKeyType="done"
            value={this.state.confirmPassword}
            onChangeText={text => {
              this.setState(
                { confirmPassword: AppUtil.shouldNotContainWhiteSpaces(text) },
                () => {
                  this.checkSubmitButtonStatus();
                }
              );
            }}
            onFocus={() => {
              this.setState({ isPasswordMismatch: false });
            }}
            onBlur={this.matchPasswords.bind(this)}
            ref={this.confirmPasswordInput}
            isError={this.state.isPasswordMismatch}
            errorDescription={strings('reset_password.password_donot_match')}
          />

          <CTAButton
            label={strings('reset_password.reset_password').toUpperCase()}
            isEnabled={this.state.isSubmitEnabled}
            onClick={this.resetPasswordClick.bind(this)}
            style={{ marginTop: 30 }}
          />
        </View>
      </KeyboardAwareScrollView>
    );
  }
}
