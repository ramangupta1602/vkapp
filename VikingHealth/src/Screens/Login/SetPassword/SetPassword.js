import React, { Component } from 'react';
import { View, Alert } from 'react-native';
import { Auth } from 'aws-amplify';
import { styles } from './Styles';
import { strings } from '../../../utility/locales/i18n';
import AppUtil from 'Library/Utils/AppUtil';
import { FloatingLabelInput, PageTitle, SubTitle, CTAButton } from 'Components';
import { inject, observer } from 'mobx-react';
import { USER_TYPE } from 'Library/Constants';
import { R } from 'Resources';

@inject('loginUserStore')
@observer
export class SetPassword extends Component {
  static navigationOptions = {
    title: strings('change_password.title'),
    header: null
  };

  constructor(props) {
    super(props);
    this.user = this.props.navigation.state.params.user;

    this.passwordInput = React.createRef();
    this.confirmPasswordInput = React.createRef();
    this.state = {
      newPassword: '',
      confirmPassword: '',
      isNewPasswordValid: true,
      isPasswordMismatch: false,
      isSubmitEnabled: false,
      loading: false
    };
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
    const password = this.state.newPassword;
    const confirmPassword = this.state.confirmPassword;
    if (password.length >= 8 && password === confirmPassword) {
      this.setState({ isSubmitEnabled: true });
    } else {
      this.setState({ isSubmitEnabled: false });
    }
  }

  resetPasswordClick() {
    const newPassword = this.state.newPassword;
    this.setState({ loading: true });
    setTimeout(() => {
      this.changePassword(newPassword);
    }, 100);
  }

  changePassword(password) {
    Auth.completeNewPassword(this.user, password)
      .then(data => {
        this.props.loginUserStore.setUser(data);
        this.setState({ loading: false });
        setTimeout(() => {
          this.gotoProfileSetupScreen();
        }, 100);
      })
      .catch(err => {
        console.log('changePassword ERROR: ', err);
        this.setState({ loading: false });
        setTimeout(() => {
          Alert.alert(strings('common_message.error'), err.message);
        }, 100);
      });
  }

  gotoProfileSetupScreen() {
    // if (this.props.loginUserStore.userType == USER_TYPE.PATIENT) {
    this.props.navigation.dispatch(AppUtil.resetAction('Signup', {}));
    // } else {
    //   this.props.navigation.dispatch(AppUtil.resetAction('Signup', {}));
    // }
  }

  render() {
    return (
      <View style={{ backgroundColor: '#EFF5F9', flex: 1 }}>
        <View style={R.AppStyles.headerContainer}>
          {/* <BackButton navigation = {this.props.navigation}/> */}
          <PageTitle title='Update Password' />
          <SubTitle subTitle='You must set a new password before you continue' />
        </View>
        <View style={styles.container}>
          {AppUtil.renderProgressBar(
            this.state.loading,
            strings('common_message.please_wait')
          )}

          <FloatingLabelInput
            style={styles.textField}
            secureTextEntry
            label={strings('change_password.new_password')}
            value={this.state.newPassword}
            returnKeyType='next'
            onChangeText={text => {
              this.setState({ newPassword: text }, () => {
                this.checkSubmitButtonStatus();
              });
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
            returnKeyType='done'
            value={this.state.confirmPassword}
            onChangeText={text => {
              this.setState({ confirmPassword: text }, () => {
                this.checkSubmitButtonStatus();
              });
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
      </View>
    );
  }
}
