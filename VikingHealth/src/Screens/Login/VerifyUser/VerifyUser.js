import { Auth } from "aws-amplify";
import React, { Component } from "react";
import { View, TextInput, Alert } from "react-native";
import { CTAButton } from "Components";
import { styles } from "./Styles";

export class VerifyUser extends Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
  }

  state = {
    code: "",
    isSubmitEnabled: true,
  };

  onTextChange(text) {
    this.setState({ code: text });
    if (text.length === 6) {
      this.textInput.current.blur();
    }
    const value = this.filterOTPText(text);
    this.setState({ code: value });
  }

  filterOTPText(value) {
    value = value.replace(/\D/g, "");
    value = value.slice(0, 6);
    return value;
  }

  verifyUserAccount() {
    const authCode = this.state.code;
    Auth.currentAuthenticatedUser()
      .then((user) => {
        Auth.verifyUserAttributeSubmit(user, "phone_number", authCode)
          .then((data) => {
            this.gotoDashboard();
          })
          .catch((error) => {
            switch (error.code) {
              case "CodeMismatchException":
                Alert.alert(error.message);
                break;
            }
          });
      })
      .catch((error) => {});
  }

  gotoDashboard() {
    this.props.navigation.dispatch(AppUtil.resetAction("Dashboard", {}));
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.textfieldContainer}>
          <TextInput
            style={styles.textInput}
            textAlign={"center"}
            keyboardType="number-pad"
            ref={this.textInput}
            onChangeText={(value) => this.onTextChange(value)}
            onKeyPress={() => this.setState({ input: "%" })}
            value={this.state.code}
            maxLength={6}
          />
        </View>

        <CTAButton
          label="SUBMIT"
          isEnabled={this.state.isSubmitEnabled}
          onClick={this.verifyUserAccount.bind(this)}
        />
      </View>
    );
  }
}
