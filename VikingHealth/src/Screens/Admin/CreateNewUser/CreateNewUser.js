import React, { Component } from "react";
import { View, Text, Alert } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import PhoneInput from "react-native-phone-input";
import { inject, observer } from "mobx-react";
import { R } from "Resources";
import { checkInternetConnection } from "react-native-offline";
import { strings } from "../../../utility/locales/i18n";
import { styles } from "../../../Screens/Login/Signup/Styles";
import AppUtil from "Library/Utils/AppUtil";
import * as DateUtil from "Library/Utils/DateUtil";
import { Mutation } from "react-apollo";
import * as UserQueries from "AppSyncQueries/UserQueries";
import { STATUS_USER } from "Library/Constants";
import { appsyncClient } from "../../../../App";

import {
	CrossButton,
	PageTitle,
	GenderPicker,
	DatePicker,
	FloatingLabelInput,
	ProgressBarButton,
} from "Components";
import { ButtonState } from "Components/CTAButton/ButtonState";

@inject("userAccountStore")
@observer
export class CreateNewUser extends Component {
	static navigationOptions = {
		header: null,
	};

	constructor(props) {
		super(props);
		this.isEdit = props.navigation.getParam("isEdit", false);
		this.userDetails = props.navigation.getParam("userDetails", null);

		this.firstNameInput = React.createRef();
		this.lastNameInput = React.createRef();
		this.emailInput = React.createRef();
		this.dobInput = React.createRef();
		this.minDate = DateUtil.getTomorrowDate();
		this.userId = this.userDetails && this.userDetails.userId;

		this.mutation = this.isEdit
			? UserQueries.UpdateInvitedPatientDetails
			: UserQueries.CreatePatientMutation;

		this.state = {
			firstName: this.userDetails ? this.userDetails.firstName : "",
			lastName: this.userDetails ? this.userDetails.lastName : "",
			gender: this.userDetails ? this.userDetails.gender : "",
			isFirstNameValid: true,
			isLastNameValid: true,
			isDOBEmpty: true,
			isValidPhone: false,
			isEditable: true,
			selectTextOnFocus: true,
			email: this.userDetails ? this.userDetails.email : "",
			isValidEmail: true,
			programStartDate:
				this.userDetails &&
				this.userDetails.startDate &&
				this.userDetails.startDate > DateUtil.getTomorrowDate()
					? this.userDetails.startDate
					: DateUtil.getTomorrowDate(),
			buttonState: ButtonState.Idle,
			buttonLabel: this.isEdit
				? strings("invite_user.reinvite_user")
				: strings("invite_user.invite_user"),
			phoneNumber: this.userDetails ? this.userDetails.phoneNumber : "",
		};
	}

	onDateSelected(date) {
		this.setState({ programStartDate: date });
	}

	checkValidationAndProceed() {
		const { firstName, lastName, gender, email } = this.state;

		if (firstName.trim() === "") {
			this.setState({ isFirstNameValid: false });
			return false;
		}
		if (lastName.trim() === "") {
			this.setState({ isLastNameValid: false });
			return false;
		}

		if (email === "") {
			this.setState({ isValidEmail: false });
			return false;
		}
		if (!AppUtil.isValidEmail(email.trim())) {
			this.setState({ isValidEmail: false });
			return false;
		}
		if (gender === "") {
			Alert.alert("Error", "Please enter gender");
			return false;
		}
		if (
			this.phone.isValidNumber() === false ||
			AppUtil.isValidPhoneNumber(this.phone.getValue().trim()) === false
		) {
			Alert.alert("Error", "Please enter valid phone number");
			return false;
		}
		return true;
	}

	checkEmailBlur() {
		const { email } = this.state;
		if (email === "") {
			this.setState({ isValidEmail: false });
		} else if (email.trim() === "") {
			this.setState({ isValidEmail: false });
		} else if (AppUtil.isValidEmail(email.trim())) {
			this.setState({ isValidEmail: true });
		} else {
			this.setState({ isValidEmail: false });
		}
	}

	/**
	 * Returns the input params for both the apis add/edit.
	 * @returns
	 */
	getAddOrEditPatientInputParams = () => {
		const { firstName, lastName, gender, email, programStartDate } = this.state;

		const commonDetails = {
			firstName: firstName.trim(),
			lastName: lastName.trim(),
			phoneNumber: this.phone.getValue().trim(),
			gender: gender,
			email: email.trim(),
			programStartDate: programStartDate,
		};
		const inputParams = this.isEdit
			? { ...commonDetails, userId: this.userId }
			: commonDetails;
		return inputParams;
	};

	/**
	 * This function will check whether to add or edit the patient details on edit click.
	 * If we are trying to edit his phone no., then we will treat it as a new user and instaed of updating the current
	 *  phone no. we will create a new user also with the existing details.
	 * @returns
	 */
	checkAddOrEditPatient = () => {
		let isEditPatient = this.isEdit;
		if (
			this.isEdit &&
			this.userDetails &&
			this.userDetails.phoneNumber != this.phone.getValue().trim()
		) {
			isEditPatient = false;
		}
		return isEditPatient;
	};

	/**
	 * set the mutation name which to be called based on a check which will be determined by checkAddOrEditPatient().
	 */
	setMutationNameOnAddOrEditPatientClick = () => {
		this.mutation = this.checkAddOrEditPatient()
			? UserQueries.UpdateInvitedPatientDetails
			: UserQueries.CreatePatientMutation;
	};

	/**
	 * on success:
	 * 1. Change button state to success
	 * 2. Change button label
	 */
	onSuccess = () => {
		this.setState({
			buttonState: ButtonState.Success,
			buttonLabel: this.isEdit
				? strings("invite_user.user_reinvited_successfully")
				: strings("invite_user.user_invited_successfully"),
		}),
			setTimeout(() => {
				this.props.navigation.goBack();
			}, 1000);
	};

	/**
	 * on success:
	 * 1. Revert button state to Idle state
	 * 2. Revert button label to intial one
	 */
	onError = () => {
		this.setState({
			buttonState: ButtonState.Idle,
			buttonLabel: this.isEdit
				? strings("invite_user.reinvite_user")
				: strings("invite_user.invite_user"),
		});
	};

	/**
	 * Call the resend invitation api as 2nd api in case of edit patient
	 */
	callReinviteMutation = () => {
		appsyncClient
			.mutate({
				mutation: UserQueries.ResendInvitation,
				variables: { userId: this.userId },
			})
			.then((data) => {
				if (data.data && data.data.resendInvitation.httpStatus == 200) {
					// set the updated details of Patient to show them on the last screen i.e. Patient's profile.
					this.props.userAccountStore.setPatientUpdatedDetails(
						this.getAddOrEditPatientInputParams(),
					);
					this.onSuccess();
				} else {
					this.onError();
					Alert.alert("Error", "Something went wrong");
				}
			})
			.catch((error) => {
				this.onError();
				Alert.alert("Error", "Something went wrong");
			});
	};

	renderButton() {
		const { buttonLabel, buttonState } = this.state;

		return (
			<Mutation
				mutation={this.mutation}
				awaitRefetchQueries={true}
				onCompleted={(data) => {
					//In case of edit patient, call resend invitation separately after updating the details using first api
					if (
						this.isEdit &&
						this.userDetails.phoneNumber === this.phone.getValue().trim()
					) {
						checkInternetConnection().then((isConnected) => {
							if (isConnected === true) {
								this.callReinviteMutation();
							} else {
								Alert.alert(
									"No Internet Connection",
									strings("common_message.internet-error"),
								);
							}
						});
					}
					// if not edit then no 2nd api call
					else if (data && data.invitePatient) {
						if (data.invitePatient && data.invitePatient.httpStatus == 200) {
							this.onSuccess();
						} else {
							this.onError();
							Alert.alert(
								strings("common_message.error"),
								data.invitePatient.errorMessage,
							);
						}
					} else if (error) {
						this.onError();
						Alert.alert("Error", "Something went wrong");
					}
				}}
				onError={(error) => {
					this.onError();
					Alert.alert("Error", "Something went wrong");
				}}
			>
				{(addOrEditPatient, { loading }) => {
					return (
						<View style={{ marginTop: 40 }}>
							<ProgressBarButton
								disabled={loading}
								label={buttonLabel}
								buttonState={buttonState}
								onClick={() => {
									// after clicking the button, set which api to be called based on a check
									this.setMutationNameOnAddOrEditPatientClick();

									if (this.checkValidationAndProceed()) {
										checkInternetConnection().then((isConnected) => {
											if (isConnected === true) {
												this.setState({
													buttonState: ButtonState.Progress,
													buttonLabel: "",
												});

												addOrEditPatient({
													variables: this.getAddOrEditPatientInputParams(),
													refetchQueries: [
														{
															query: UserQueries.PatientList,
															variables: {
																limit: 10,
																nextToken: null,
																type: STATUS_USER.INVITED,
															},
														},
													],
												});
											} else {
												Alert.alert(
													"No Internet Connection",
													strings("common_message.internet-error"),
												);
											}
										});
									}
								}}
							/>
						</View>
					);
				}}
			</Mutation>
		);
	}

	render() {
		const {
			firstName,
			lastName,
			gender,
			email,
			programStartDate,
			selectTextOnFocus,
			isEditable,
			isFirstNameValid,
			isLastNameValid,
			isValidEmail,
			isDOBEmpty,
			phoneNumber,
		} = this.state;

		return (
			<View style={{ flex: 1 }}>
				<KeyboardAwareScrollView
					style={{ backgroundColor: R.Colors.COLOR_APP_BACKGROUND }}
					scrollEnabled
					extraScrollHeight={50}
					enableResetScrollTooords
					resetScrollToCoords={{ x: 0, y: 0 }}
				>
					<View style={R.AppStyles.headerContainer}>
						<View style={{ marginBottom: 16, marginLeft: 6 }}>
							<CrossButton
								onCrossClicked={() => this.props.navigation.goBack()}
							/>
						</View>
						<PageTitle
							title={
								this.isEdit
									? strings("invite_user.edit_patient")
									: strings("invite_user.new_patient")
							}
						/>
					</View>
					<View style={[styles.container, { padding: 24 }]}>
						<FloatingLabelInput
							editable={isEditable}
							selectTextOnFocus={selectTextOnFocus}
							style={[styles.textField]}
							label={strings("signup.first_name")}
							value={firstName}
							textContentType="givenName"
							returnKeyType="next"
							keyboardType="default"
							ref={this.firstNameInput}
							onChangeText={(text) => {
								this.setState({ firstName: AppUtil.regexForName(text) });
							}}
							onSubmitEditing={() => {
								this.lastNameInput.current.becomeFirstResponder();
							}}
							onFocus={() => {
								this.setState({ isFirstNameValid: true });
							}}
							onBlur={() => {
								this.setState({
									isFirstNameValid: firstName.trim() != "",
								});
							}}
							errorDescription={strings("signup.enter_your_first_name")}
							isError={!isFirstNameValid}
						/>

						<FloatingLabelInput
							editable={isEditable}
							selectTextOnFocus={selectTextOnFocus}
							style={styles.textField}
							label={strings("signup.last_name")}
							value={lastName}
							textContentType="familyName"
							returnKeyType="next"
							keyboardType="default"
							ref={this.lastNameInput}
							onChangeText={(text) => {
								this.setState({ lastName: AppUtil.regexForName(text) });
							}}
							onFocus={() => {
								this.setState({ isLastNameValid: true });
							}}
							onBlur={() => {
								this.setState({
									isLastNameValid: lastName.trim() != "",
								});
							}}
							errorDescription={strings("signup.enter_your_last_name")}
							isError={!isLastNameValid}
						/>

						<Text style={[styles.placeholder, { marginTop: 5 }]}>Gender</Text>
						<GenderPicker
							gender={gender}
							onSelect={(value) => this.setState({ gender: value })}
						/>

						<Text
							style={{
								marginTop: 5,
								color: "#929CA5",
								fontSize: 14,
							}}
						>
							Phone Number
						</Text>

						<View style={{ marginTop: 10 }}>
							<PhoneInput
								disabled={isEditable === false}
								value={phoneNumber}
								onChangePhoneNumber={(text) =>
									this.setState({ phoneNumber: text })
								}
								onPressFlag={this.onPressFlag}
								ref={(ref) => {
									this.phone = ref;
								}}
							/>
							<View
								style={{
									height: 1,
									backgroundColor: R.Colors.COLOR_FLOATING_LABEL,
									marginTop: 8,
								}}
							/>
						</View>

						<View style={{ marginTop: 18 }}>
							<FloatingLabelInput
								style={styles.textField}
								label={strings("signup.email")}
								value={email}
								textContentType="emailAddress"
								returnKeyType="done"
								keyboardType="email-address"
								autoCapitalize="none"
								ref={this.emailInput}
								onChangeText={(text) => {
									this.setState({ email: text });
								}}
								onFocus={() => {
									this.setState({ isValidEmail: true });
								}}
								onBlur={() => {
									this.checkEmailBlur();
								}}
								errorDescription={strings("signup.enter_your_email")}
								isError={!isValidEmail}
							/>
						</View>

						<DatePicker
							disabled={isEditable === false}
							style={{ marginTop: 22 }}
							date={programStartDate}
							mode="date"
							minDate={this.minDate}
							placeholder={"Start date"}
							format="YYYY-MM-DD"
							confirmBtnText="Next"
							cancelBtnText="Cancel"
							showIcon={false}
							ref={this.dobInput}
							customStyles={{
								placeholderText: styles.placeholder,
								dateInput: { flex: 1 },
							}}
							onDateChange={(date) => {
								this.onDateSelected(date);
							}}
							onFocus={() => {
								this.setState({ isDOBEmpty: false });
							}}
							errorDescription={"Enter program start date"}
							isError={!isDOBEmpty}
						/>
						{this.renderButton()}
					</View>
				</KeyboardAwareScrollView>
			</View>
		);
	}
}
