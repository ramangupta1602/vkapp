import React, { Component } from 'react';
import { View, Alert } from 'react-native';
import { Auth } from 'aws-amplify';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  FloatingLabelInput,
  BackButton,
  PageTitle,
  CTAButton
} from 'Components';
import { styles } from './Styles';
import { strings } from '../../../utility/locales/i18n';
import AppUtil from 'Library/Utils/AppUtil';
import { R } from 'Resources';

export class ChangePassword extends Component {
  static navigationOptions = {
    title: strings('change_password.title'),
    header: null
  };

  constructor(props) {
    super(props);

    this.oldPasswordInput = React.createRef();
    this.passwordInput = React.createRef();
    this.confirmPasswordInput = React.createRef();
    this.state = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      isOldPasswordValid: true,
      isNewPasswordValid: true,
      isPasswordMismatch: false,
      isSubmitEnabled: false,
      loading: false
    };
  }

  resetPasswordClick() {
    let shouldProceed = true;
    const oldPassword = this.state.oldPassword;
    const newPassword = this.state.newPassword;

    if (oldPassword.length === 0) {
      this.setState({ isOldPasswordValid: false });
      shouldProceed = false;
    }
    if (!AppUtil.isValidPassword(newPassword)) {
      this.setState({ isNewPasswordValid: false });
      shouldProceed = false;
    }
    if (newPassword !== this.state.confirmPassword) {
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
      this.changePassword(oldPassword, newPassword);
    }, 100);
  }

  changePassword(oldPassword, newPassword) {
    Auth.currentAuthenticatedUser()
      .then(user => {
        this.setState({ loading: false });
        return Auth.changePassword(user, oldPassword, newPassword);
      })
      .then(data => {
        this.setState({ loading: false });
        setTimeout(() => {
          this.setState({ loading: false });
          Alert.alert(
            strings('common_message.success'),
            strings('change_password.password_changed_successfully')
          );
          this.props.navigation.goBack();
          // this.signout()
        }, 100);
      })
      .catch(error => {
        setTimeout(() => {
          this.setState({ loading: false });
          Alert.alert(strings('common_message.error'), error.message);
        }, 100);
      });
  }

  matchPasswords() {
    const { newPassword, confirmPassword } = this.state;
    if (newPassword === confirmPassword) {
      this.setState({ isPasswordMismatch: false });
    } else {
      this.setState({ isPasswordMismatch: true });
    }
  }

  checkSubmitButtonStatus() {
    const oldPassword = this.state.oldPassword;
    const password = this.state.newPassword;
    const confirmPassword = this.state.confirmPassword;
    if (
      password.length >= 8 &&
      password === confirmPassword &&
      oldPassword !== ''
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
          <PageTitle title="Change Password" />
        </View>

        <View style={styles.container}>
          {AppUtil.renderProgressBar(
            this.state.loading,
            strings('common_message.please_wait')
          )}
          <FloatingLabelInput
            style={styles.textField}
            secureTextEntry
            label={strings('change_password.old_password')}
            value={this.state.oldPassword}
            returnKeyType="next"
            onChangeText={text => {
              this.setState(
                { oldPassword: AppUtil.shouldNotContainWhiteSpaces(text) },
                () => {
                  this.checkSubmitButtonStatus();
                }
              );
            }}
            onSubmitEditing={() => {
              this.passwordInput.current.becomeFirstResponder();
            }}
            onFocus={() => {
              this.setState({ isOldPasswordValid: true });
            }}
            onBlur={() => {
              this.setState({
                isOldPasswordValid: this.state.oldPassword.length > 0
              });
            }}
            ref={this.oldPasswordInput}
            isError={!this.state.isOldPasswordValid}
            errorDescription={strings(
              'change_password.please_enter_your_password'
            )}
          />

          <FloatingLabelInput
            style={styles.textField}
            secureTextEntry
            label={strings('change_password.new_password')}
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
                isNewPasswordValid: AppUtil.isValidPassword(
                  this.state.newPassword
                )
              });
            }}
            ref={this.passwordInput}
            isError={!this.state.isNewPasswordValid}
            errorDescription={strings(
              'change_password.minimum_password_length'
            )}
          />

          <FloatingLabelInput
            style={styles.textField}
            secureTextEntry
            label={strings('change_password.confirm_new_password')}
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
            errorDescription={strings('change_password.password_donot_match')}
          />

          <CTAButton
            label={strings('change_password.reset_password_caps')}
            isEnabled={this.state.isSubmitEnabled}
            onClick={this.resetPasswordClick.bind(this)}
            style={{ marginTop: 30 }}
          />
        </View>
      </KeyboardAwareScrollView>
    );
  }
}
