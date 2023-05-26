import React, { Component } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  View,
  Text,
  Alert,
  TouchableWithoutFeedback,
  Modal,
  ActivityIndicator
} from "react-native";
import { styles } from "./Styles";
import { strings } from "../../../utility/locales/i18n";
import AppUtil from "Library/Utils/AppUtil";
import { R } from "Resources";
import {
  BackButton,
  PageTitle,
  SubTitle,
  CTAButton,
  DatePicker,
  GenderPicker,
  FloatingLabelInput,
  HeightScroll
} from "Components";
import { inject, observer } from "mobx-react";
import { HeightWeightUtil } from "Library/Utils/HeightWeightUtil";
import { Query, Mutation } from "react-apollo";
import * as UserQueries from "AppSyncQueries/UserQueries";
import { USER_ONBOARDING_STEP, USER_TYPE } from "Library/Constants";
import { API_DATE_FORMAT, DISPLAY_DATE_FORMAT } from "Library/Constants";
import moment from "moment";
import { checkInternetConnection } from "react-native-offline";

const phoneUtil = require("google-libphonenumber").PhoneNumberUtil.getInstance();

@inject("userAccountStore", "loginUserStore")
@observer
export class Signup extends Component {
  static navigationOptions = {
    title: "Setup profile",
    header: null
  };

  constructor(props) {
    super(props);

    this.isProfileUpdate = this.props.navigation.getParam(
      "isBackButtonVisible",
      false
    );

    this.firstNameInput = React.createRef();
    this.middleNameInput = React.createRef();
    this.lastNameInput = React.createRef();
    this.emailInput = React.createRef();
    this.mobileNumberInput = React.createRef();
    this.dobInput = React.createRef();
    this.validationMessage = "Please fill all the details";

    this.state = {
      isFirstNameValid: true,
      isLastNameValid: true,
      isValidEmail: true,
      isDOBEmpty: true,
      loading: false,
      isHeightComponentVisible: false,
      isHeightValid: true
    };

    if (this.props.userAccountStore.firstName == "") {
      this.shouldLoadProfile = true;
    }
  }

  componentDidMount() {
    this.setStateFromUserAccountStore();
    setTimeout(() => {
      this.setDefaultMeasurement();
    }, 4000);
  }

  /**
   * set default measurement values
   */
  setDefaultMeasurement() {
    if (
      this.isProfileUpdate === false &&
      this.props.loginUserStore.userType == USER_TYPE.PATIENT
    ) {
      const phone = phoneUtil.parse(this.state.mobileNumber, "");
      const countryCode = phone.getCountryCode();
      if (countryCode === 91) {
        this.props.loginUserStore.setDisplayWeightUnit(
          HeightWeightUtil.WEIGHT_KG
        );
        this.props.loginUserStore.setDisplayHeightUnit(
          HeightWeightUtil.HEIGHT_CM
        );
      } else {
        this.props.loginUserStore.setDisplayWeightUnit(
          HeightWeightUtil.WEIGHT_LB
        );
        this.props.loginUserStore.setDisplayHeightUnit(
          HeightWeightUtil.HEIGHT_IN
        );
      }
    }
  }

  setStateFromUserAccountStore() {
    this.setState({
      firstName: this.props.userAccountStore.firstName,
      middleName: this.props.userAccountStore.middleName,
      lastName: this.props.userAccountStore.lastName,
      email: this.props.userAccountStore.email,
      mobileNumber: this.props.userAccountStore.phoneNumber,
      dob: this.props.userAccountStore.dob,
      gender: this.props.userAccountStore.gender,
      height: this.props.userAccountStore.height,
      heightUnit: this.props.userAccountStore.heightUnit,
      displayHeightUnit: this.props.loginUserStore.displayHeightUnit
    });
  }

  _onDateSelected = (displayDate, date) => {
    const formattedDate = moment(date).format(API_DATE_FORMAT);
    this.setState({
      dob: formattedDate
    });
    setTimeout(() => {
      this.emailInput.current.becomeFirstResponder();
    }, 500);
  };

  validateDateOfBirth() {
    this.setState({ isDOBEmpty: this.state.dob === "" });
  }

  checkValidation() {
    let shouldProceed = true;

    if (this.trim(this.state.firstName) === "") {
      shouldProceed = false;
      this.validationMessage = "Please enter your first name.";
      this.setState({ isFirstNameValid: false });
    } else if (this.trim(this.state.lastName) === "") {
      shouldProceed = false;
      this.validationMessage = "Please enter your last name.";
      this.setState({ isLastNameValid: false });
    } else if (!(this.state.dob && this.state.dob != "")) {
      shouldProceed = false;
      this.validationMessage = "Please enter your date of birth.";
      this.setState({ isDOBEmpty: true });
    } else if (this.state.gender === "") {
      this.validationMessage = "Please enter your gender.";
      shouldProceed = false;
    } else if (
      this.props.loginUserStore.userType == USER_TYPE.PATIENT &&
      (this.state.height === 0 ||
        this.state.height === "undefined" ||
        this.state.height === null ||
        this.state.height == "")
    ) {
      this.validationMessage = "Please enter your height.";
      shouldProceed = false;
    } else if (this.trim(this.state.email) === "") {
      shouldProceed = false;
      this.validationMessage = "Please enter your email address.";
      this.setState({ isValidEmail: false });
    } else if (AppUtil.isValidEmail(this.trim(this.state.email)) === false) {
      shouldProceed = false;
      this.validationMessage = "Please enter a valid email address.";
      this.setState({ isValidEmail: false });
    }

    return shouldProceed;
  }

  saveProfileSuccessful(data) {
    const fName = data.firstName;
    const lName = data.lastName;
    this.setState({ loading: false });
    this.props.loginUserStore.setUserName(fName, lName);
    if (this.props.navigation.getParam("isBackButtonVisible", false)) {
      this.props.navigation.goBack();
    } else if (this.props.loginUserStore.userType == USER_TYPE.ADMIN) {
      this.props.navigation.navigate("AdminDashboard", {
        userId: this.props.loginUserStore.userId
      });
    } else if (this.props.loginUserStore.userType == USER_TYPE.PATIENT) {
      this.props.navigation.navigate("AboutYou");
    }
  }

  onChangeFirstName(value) {
    this.setState({ firstName: value.replace(/[^a-zA-Z']/g, "") });
  }

  _dismissHeight = () => {
    this.setState({ isHeightComponentVisible: false });
  };

  _saveHeight = (value, unit) => {
    this.setState({
      height: value,
      isHeightComponentVisible: false,
      heightUnit: unit,
      displayHeightUnit: unit
    });
  };

  trim = string => {
    // return string ? string.trim() : null
    return string ? string.trim() : "";
  };

  updateProfileDetails = (proxy, { data: { updateProfile } }) => {
    const phone = phoneUtil.parse(this.state.mobileNumber, "");
    const countryCode = phone.getCountryCode();

    this.setState({ loading: false });
    if (!this.isProfileUpdate) {
      this.props.loginUserStore.setOnboardingStep(
        USER_ONBOARDING_STEP.PROFILE_COMPLETE
      );
    }

    let query = UserQueries.GetProfile;
    let data;
    try {
      data = proxy.readQuery({
        query: query,
        variables: {
          userId: this.props.loginUserStore.userId
        }
      });
      if (data && data.getProfile) {
        const { waterIntakeUnit, targetWaterIntake } = data.getProfile;
        if (waterIntakeUnit == null) {
          this.props.loginUserStore.setTargetWaterLevel(
            countryCode === 91 ? 3500 : 118
          );
          this.props.loginUserStore.setDisplayWaterIntakeUnit(
            countryCode === 91 ? 1 : 0
          );
        } else {
          this.props.loginUserStore.setTargetWaterLevel(
            waterIntakeUnit === HeightWeightUtil.WATER_FLOZ
              ? HeightWeightUtil.ozValue(targetWaterIntake)
              : targetWaterIntake
          );
          this.props.loginUserStore.setDisplayWaterIntakeUnit(
            data.getProfile.waterIntakeUnit
          );
        }
        let profile = updateProfile;
        profile[
          "displayWeightUnit"
        ] = this.props.loginUserStore.displayWeightUnit;
        profile["targetWeight"] = this.props.userAccountStore.targetWeight;
        profile["weightUnit"] = this.props.userAccountStore.weightUnit;
        profile[
          "programStartDate"
        ] = this.props.userAccountStore.programStartDate;
        profile["programEndDate"] = this.props.userAccountStore.programEndDate;

        profile["currentCycle"] = this.props.userAccountStore.currentCycle;
        profile[
          "lastAcceptedCycle"
        ] = this.props.userAccountStore.lastAcceptedCycle;
        profile["cycleHistory"] = this.props.userAccountStore.cycleHistory;

        data.getProfile = profile;
        this.props.userAccountStore.setUserData(profile);
        proxy.writeQuery({
          query: query,
          variables: {
            userId: this.props.loginUserStore.userId
          },
          data
        });
      }
    } catch (e) {
      console.log("EXCEPTION getProfile: ", e.message);
    }
  };

  _profileObject = () => {
    let onboardingStep = 3;
    if (this.props.loginUserStore.userType == USER_TYPE.PATIENT) {
      onboardingStep = this.isProfileUpdate ? 3 : 2;
    }

    let middleName;
    if (this.state.middleName && this.state.middleName.length > 0) {
      middleName = this.trim(this.state.middleName);
    } else {
      middleName = null;
    }
    let variables = {
      firstName: this.trim(this.state.firstName),
      middleName: middleName,
      lastName: this.trim(this.state.lastName),
      dob: this.state.dob,
      gender: this.state.gender,
      email: this.trim(this.state.email),
      phoneNumber: this.state.mobileNumber,
      onboardingStep: onboardingStep,
      displayHeightUnit: this.state.displayHeightUnit
    };

    if (this.props.loginUserStore.userType == USER_TYPE.PATIENT) {
      variables["height"] = this.state.height;
      variables["heightUnit"] = this.state.heightUnit;
    } else {
      if (this.isProfileUpdate) {
        // variables['displayWeightUnit'] = this.props.loginUserStore.displayWeightUnit;
        variables["heightUnit"] = this.props.loginUserStore.displayHeightUnit;
      } else {
        variables["displayWeightUnit"] = 1;
        variables["heightUnit"] = 1;
      }
    }

    return variables;
  };

  renderCompleteProfileSetupButton() {
    return (
      <Mutation mutation={UserQueries.UpdateProfile}>
        {updateProfile => {
          return (
            <CTAButton
              label={strings("profile.update")}
              isEnabled
              onClick={() => {
                checkInternetConnection().then(isConnected => {
                  if (isConnected === true) {
                    if (this.checkValidation()) {
                      this.setState({ loading: true });
                      const variables = this._profileObject();
                      updateProfile({
                        variables: variables,
                        optimisticResponse: {
                          __typename: "Mutation",
                          updateProfile: {
                            __typename: "Patient",
                            userId: this.props.userAccountStore.username,
                            ...variables
                          }
                        },
                        update: this.updateProfileDetails
                      });
                      this.saveProfileSuccessful(variables);
                    } else {
                      Alert.alert(
                        strings("common_message.error"),
                        this.validationMessage
                      );
                    }
                  } else {
                    Alert.alert(
                      "No Internet Connection",
                      "It seems there is some problem with your internet connection. Please check and try again."
                    );
                  }
                });
              }}
            />
          );
        }}
      </Mutation>
    );
  }

  convertedHeight() {
    let convertedHeight;
    if (this.state.displayHeightUnit === this.state.heightUnit) {
      //If unit of this height and unit in users setting is same, return height without any calculation
      convertedHeight = this.state.height;
    } else {
      if (this.state.displayHeightUnit === HeightWeightUtil.HEIGHT_IN) {
        convertedHeight = HeightWeightUtil.inchValue(this.state.height);
      } else {
        convertedHeight = HeightWeightUtil.cmValue(this.state.height);
      }
    }

    return convertedHeight;
  }

  getProfile() {
    if (this.shouldLoadProfile) {
      return (
        <Query
          query={UserQueries.GetProfile}
          variables={{ userId: this.props.loginUserStore.userId }}
          fetchPolicy="network-only"
        >
          {({ loading, error, data }) => {
            if (loading) {
            } else {
              this.shouldLoadProfile = false;
              if (data && data.getProfile) {
                this.handleProfileLoadComplete(data.getProfile);
              }
            }
            return null;
          }}
        </Query>
      );
    }
  }

  handleProfileLoadComplete(data) {
    let onboardingStep = data.onboardingStep;
    let displayWeightUnit = data.displayWeightUnit;
    let displayHeightUnit = data.displayHeightUnit;
    this.props.loginUserStore.setDisplayWeightUnit(displayWeightUnit);
    this.props.loginUserStore.setDisplayHeightUnit(displayHeightUnit);
    this.props.loginUserStore.setOnboardingStep(onboardingStep);
    this.props.userAccountStore.setUserData(data);
    this.setStateFromUserAccountStore();
  }

  whenEmailAddressBlur() {
    let email = this.trim(this.state.email);
    if (email === "") {
      this.setState({ isValidEmail: false });
    } else if (AppUtil.isValidEmail(email)) {
      this.setState({ isValidEmail: true });
    } else {
      this.setState({ isValidEmail: false });
    }
  }

  render() {
    const convertedHeight = this.convertedHeight()
      ? this.convertedHeight().toFixed(1)
      : 0;
    const height = HeightWeightUtil.formattedHeightText(
      convertedHeight,
      this.state.displayHeightUnit
    );

    return (
      <View style={{ flex: 1 }}>
        {this.getProfile()}
        <KeyboardAwareScrollView
          style={{ backgroundColor: R.Colors.COLOR_APP_BACKGROUND }}
          scrollEnabled
          extraScrollHeight={50}
          keyboardShouldPersistTaps="handled"
          enableResetScrollToCoords
          resetScrollToCoords={{ x: 0, y: 0 }}
        >
          <View style={R.AppStyles.headerContainer}>
            {this.isProfileUpdate && (
              <BackButton navigation={this.props.navigation} />
            )}
            <PageTitle title={strings("signup.title")} />
            <SubTitle subTitle={strings("signup.subTitle")} />
          </View>
          <View style={[styles.container, { padding: 24 }]}>
            <FloatingLabelInput
              style={styles.textField}
              label={strings("signup.first_name")}
              value={this.state.firstName}
              textContentType="givenName"
              returnKeyType="next"
              keyboardType="default"
              ref={this.firstNameInput}
              onChangeText={text => {
                this.setState({ firstName: AppUtil.regexForName(text) });
              }}
              onSubmitEditing={() => {
                this.middleNameInput.current.becomeFirstResponder();
              }}
              onFocus={() => {
                this.setState({ isFirstNameValid: true });
              }}
              onBlur={() => {
                this.setState({
                  isFirstNameValid: this.trim(this.state.firstName) != ""
                });
              }}
              errorDescription={strings("signup.enter_your_first_name")}
              isError={!this.state.isFirstNameValid}
            />
            <FloatingLabelInput
              style={styles.textField}
              label={strings("signup.middle_name")}
              value={this.state.middleName}
              textContentType="givenName"
              returnKeyType="next"
              keyboardType="default"
              ref={this.middleNameInput}
              onChangeText={text => {
                this.setState({ middleName: AppUtil.regexForName(text) });
              }}
              onSubmitEditing={() => {
                this.lastNameInput.current.becomeFirstResponder();
              }}
            />

            <FloatingLabelInput
              style={styles.textField}
              label={strings("signup.last_name")}
              value={this.state.lastName}
              textContentType="familyName"
              returnKeyType="next"
              keyboardType="default"
              ref={this.lastNameInput}
              onChangeText={text => {
                this.setState({ lastName: AppUtil.regexForName(text) });
              }}
              onSubmitEditing={() => {
                if (this.props.loginUserStore.userType === USER_TYPE.PATIENT) {
                  this.setState({ isHeightComponentVisible: true });
                }
              }}
              onFocus={() => {
                this.setState({ isLastNameValid: true });
              }}
              onBlur={() => {
                this.setState({
                  isLastNameValid: this.trim(this.state.lastName) != ""
                });
              }}
              errorDescription={strings("signup.enter_your_last_name")}
              isError={!this.state.isLastNameValid}
            />

            <Text style={[styles.placeholder, { marginTop: 5 }]}>Gender</Text>
            <GenderPicker
              gender={this.state.gender}
              onSelect={value => this.setState({ gender: value })}
            />
            {this.props.loginUserStore.userType == USER_TYPE.PATIENT && (
              <View style={{ marginTop: 20, marginBottom: 5 }}>
                <TouchableWithoutFeedback
                  style={{ backgroundColor: "red" }}
                  onPress={() => {
                    this.setState({ isHeightComponentVisible: true });
                  }}
                >
                  <View pointerEvents="box-only">
                    <FloatingLabelInput
                      style={styles.textField}
                      label="Height"
                      value={height}
                      editable={false}
                      errorDescription={strings("signup.enter_your_height")}
                      isError={!this.state.isHeightValid}
                    />
                  </View>
                </TouchableWithoutFeedback>
              </View>
            )}

            <DatePicker
              style={{ marginTop: 25, marginBottom: 15 }}
              date={
                this.state.dob === null
                  ? moment(Date()).format(DISPLAY_DATE_FORMAT)
                  : moment(this.state.dob).format(DISPLAY_DATE_FORMAT)
              }
              mode="date"
              maxDate={moment().format(API_DATE_FORMAT)}
              placeholder={strings("signup.date_of_birth")}
              format={DISPLAY_DATE_FORMAT}
              confirmBtnText="Next"
              cancelBtnText="Cancel"
              showIcon={false}
              ref={this.dobInput}
              customStyles={{
                placeholderText: styles.placeholder,
                dateInput: { flex: 1 }
              }}
              onDateChange={this._onDateSelected}
              onFocus={() => {
                this.setState({ isDOBEmpty: false });
              }}
              errorDescription={strings("signup.enter_your_dob")}
              isError={!this.state.isDOBEmpty}
            />

            <FloatingLabelInput
              style={styles.textField}
              label={strings("signup.email")}
              value={this.state.email}
              textContentType="emailAddress"
              returnKeyType="done"
              keyboardType="email-address"
              autoCapitalize="none"
              ref={this.emailInput}
              onChangeText={text => {
                this.setState({ email: text });
              }}
              onFocus={() => {
                this.setState({ isValidEmail: true });
              }}
              onBlur={() => {
                this.whenEmailAddressBlur();
              }}
              errorDescription={strings("signup.enter_your_email")}
              isError={!this.state.isValidEmail}
            />

            <FloatingLabelInput
              style={styles.textField}
              label={strings("signup.mobile_number")}
              value={this.state.mobileNumber}
              returnKeyType="done"
              keyboardType="phone-pad"
              ref={this.mobileNumberInput}
              editable={false}
              onChangeText={text => {
                this.setState({ mobileNumber: text });
              }}
            />
            {this.renderCompleteProfileSetupButton()}
          </View>
        </KeyboardAwareScrollView>
        <HeightModal
          isHeightComponentVisible={this.state.isHeightComponentVisible}
          height={this.convertedHeight()}
          heightUnit={this.state.displayHeightUnit}
          onSaveHeight={this._saveHeight}
          dismissHeight={this._dismissHeight}
        />

        {this.state.loading && (
          <ActivityIndicator
            style={styles.loaderStyle}
            size="large"
            color={R.Colors.COLOR_BLUE}
          />
        )}
      </View>
    );
  }
}

const HeightModal = props => (
  <Modal
    animationType="fade"
    transparent
    visible={props.isHeightComponentVisible}
    presentationStyle="overFullScreen"
  >
    <View
      style={{
        marginLeft: 10,
        marginRight: 10,
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <HeightScroll
        onSaveClicked={props.onSaveHeight}
        onCancelClicked={props.dismissHeight}
        height={props.height}
        heightUnit={props.heightUnit}
      />
    </View>
  </Modal>
);
