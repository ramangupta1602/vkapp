/* eslint-disable no-shadow */
import React, { Component } from "react";
import {
	Text,
	View,
	Image,
	TouchableOpacity,
	Alert,
	Platform,
	AsyncStorage,
} from "react-native";
import { Analytics } from "aws-amplify";
import { Auth } from "aws-amplify";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import PhoneInput from "react-native-phone-input";
import { styles } from "./Styles";
import { FloatingLabelInput, CTAButton } from "Components";
import { strings } from "../../../utility/locales/i18n";
import AppUtil from "../../../Library/Utils/AppUtil";
import { HeightWeightUtil } from "Library/Utils/HeightWeightUtil";
import * as DateUtil from "Library/Utils/DateUtil";
import { R } from "Resources";
import { inject, observer } from "mobx-react";
import { Query } from "react-apollo";
import { USER_TYPE, USER_ONBOARDING_STEP } from "Library/Constants";
import * as UserQueries from "../../../AppSyncQueries/UserQueries";
import { LocalNotification } from "Components";
import { PushNotificationController } from "Components";
// import RNDisableBatteryOptimizations from "react-native-disable-battery-optimizations";
import { PHASE_CONSTANT } from "../../../Library/Constants";
import { appsyncClient } from "../../../../App";
import * as AsyncStoreUtil from "../../../utility/AsyncStoreUtil";

// has to be removed.
const phoneUtil = require("google-libphonenumber").PhoneNumberUtil.getInstance();

@inject(
	"loginUserStore",
	"userAccountStore",
	"measurementUnitStore",
	"gamificationStore",
	"rewardStore",
)
@observer
export class Login extends Component {
	static navigationOptions = {
		title: strings("login.title"),
		header: null,
	};

	constructor(props) {
		super(props);
		this.passwordRef = React.createRef();
		this.state = {
			userName: "", //8052095464
			password: "", //'Harsh@123',
			loading: false,
			valid: "",
			type: "",
			value: "",
			shouldLoadProfile: false,
			startProgramDate: this.props.userAccountStore.programStartDate,
		};
		this.updateInfo = this.updateInfo.bind(this);
		this.localNotification = new LocalNotification();
		this.scheduleLocalNotification = this.scheduleLocalNotification.bind(this);
	}

	componentDidMount() {
		// this.askForBatteryOptimizationCondition();
		this.phone.setValue('+1')
	}

	// askForBatteryOptimizationCondition() {
	// 	if (Platform.OS === "android") {
	// 		RNDisableBatteryOptimizations.isBatteryOptimizationEnabled().then(
	// 			(isEnabled) => {
	// 				if (isEnabled) {
	// 					RNDisableBatteryOptimizations.openBatteryModal();
	// 				}
	// 			},
	// 		);
	// 	}
	// }

	onChangeText(key, value) {
		this.setState({ password: value });
	}

	updateInfo() {
		this.setState({
			valid: this.phone.isValidNumber(),
			type: this.phone.getNumberType(),
		});
	}

	scheduleLocalNotification(data) {
		// schedule this notification only if it is existing user (pre phase user),
		// or, the new user who has moved to dashboard (phase 3)

		const { phase = 0 } = data;

		if (phase === 1 || phase === 2) {
			// they are in waiting for loading phase, don't show notification
			return;
		}

		var startProgramDate = this.props.userAccountStore.programStartDate;
		const dateObj = new Date();
		const newdate = DateUtil.getDate(dateObj);
		const endProgramDate = this.props.userAccountStore.programEndDate;

		if (newdate <= endProgramDate) {
			this.localNotification.scheduleLocalNotification(
				endProgramDate,
				startProgramDate,
			);
		}
	}

	gotoDashboard() {
		this.props.navigation.dispatch(AppUtil.resetAction("Dashboard", {}));
	}

	gotoForgotPassword() {
		this.props.navigation.navigate("ForgotPasswordGetAccount");
	}

	loginClick() {
		const username = this.phone.getValue().trim();
		const password = this.state.password;

		let valid = false;
		if (this.phone.isValidNumber() && AppUtil.isValidPhoneNumber(username)) {
			valid = true;
		}

		if (!valid) {
			Alert.alert(
				strings("common_message.error"),
				strings("login.enter_valid_phone_number"),
			);
			return;
		}

		if (password === "") {
			Alert.alert(
				strings("common_message.error"),
				strings("login.enter_your_password"),
			);
			return;
		}

		this.setState({ loading: true });
		setTimeout(() => {
			this.login(username, password);
		}, 100);
	}

	login(username, password) {
		Auth.signIn(username, password)
			.then((user) => {
				//this.setVersion();

				if (user.challengeName === "NEW_PASSWORD_REQUIRED") {
					this.setState({ loading: false });
					this.completeNewPassword(user);
					// Analytics.record({
					// 	name: "First Login successfull",
					// 	attributes: { userName: username },
					// });
				} else {
					this.props.loginUserStore.setUser(user);
					this.setState({ shouldLoadProfile: true });
					// Analytics.record({
					// 	name: "Login successfull",
					// 	attributes: { userName: username },
					// });
					console.log("login success", user);
				}
			})
			.catch((err) => {
				this.setState({ loading: false });

				setTimeout(() => {
					this.handleLoginError(err);
				}, 100);
			});
	}

	handleLoginError(err) {
		// Analytics.record({
		// 	name: "Login error",
		// 	attributes: { error: err.code },
		// });
		switch (err.code) {
			case "NotAuthorizedException":
				Alert.alert(strings("common_message.error"), err.message);
				break;
			case "UserNotFoundException":
				Alert.alert(strings("common_message.error"), err.message);
				break;
			case "PasswordResetRequiredException":
				this.passwordResetRequired();
				break;
			default:
				Alert.alert(strings("common_message.error"), err.message);
				break;
		}
	}

	// setVersion = async () => {
	//   try {
	//     await AsyncStorage.setItem("appVersion", "4.2.0");
	//   } catch (error) {
	//     console.log(error);
	//   }
	//   console.log("set new version");
	// };

	handleProfileLoadComplete = async (data) => {
		//register token
		await this.registerToken();

		let onboardingStep = data.onboardingStep;
		this.props.loginUserStore.setUserName(data.firstName, data.lastName);
		this.props.measurementUnitStore.setDisplayWeightUnit(
			data.displayWeightUnit,
		);
		this.props.measurementUnitStore.setDisplayHeightUnit(
			data.displayHeightUnit,
		);
		this.props.loginUserStore.setDisplayWeightUnit(data.displayWeightUnit);
		this.props.loginUserStore.setDisplayHeightUnit(data.displayHeightUnit);
		this.props.loginUserStore.setOnboardingStep(onboardingStep);

		const phone = phoneUtil.parse(data.phoneNumber, "");
		const countryCode = phone.getCountryCode();

		const { waterIntakeUnit, targetWaterIntake } = data;
		if (waterIntakeUnit == null) {
			this.props.loginUserStore.setTargetWaterLevel(
				countryCode === 91 ? 3500 : 118,
			);
			this.props.loginUserStore.setDisplayWaterIntakeUnit(
				countryCode === 91 ? 1 : 0,
			);
		} else {
			this.props.loginUserStore.setTargetWaterLevel(
				waterIntakeUnit === HeightWeightUtil.WATER_FLOZ
					? HeightWeightUtil.ozValue(targetWaterIntake)
					: targetWaterIntake,
			);
			this.props.loginUserStore.setDisplayWaterIntakeUnit(waterIntakeUnit);
		}
		this.setState({ shouldLoadProfile: false });
		this.setState({ loading: false });

		if (
			this.props.loginUserStore.userType === USER_TYPE.PATIENT &&
			this.props.userAccountStore.phase === PHASE_CONSTANT.LOSING_PHASE // scheduling notification only when we are on losing phase
		) {
			this.props.userAccountStore.setUserData(data);
			this.scheduleLocalNotification(data);

			const {
				hasProgramCompleted,
				currentCycle,
				programEndDate,
			} = this.props.userAccountStore;

			// If the user is logging in after program end date, then don't show
			// view summary popup, as he may has seen the popup, and after logging out
			// store is clear. So if we don't do this, user will get to see the popup
			// again and again.
			if (hasProgramCompleted) {
				this.props.userAccountStore.setShowCycleSummaryFlag(
					false,
					currentCycle,
				);
			} else {
				this.props.userAccountStore.setSummaryPopupScheduleDate(programEndDate);
			}
		}

		if (this.props.loginUserStore.userType === USER_TYPE.ADMIN) {
			this.props.loginUserStore.setOnboardingStep(USER_ONBOARDING_STEP.DONE);
			this.props.navigation.dispatch(AppUtil.resetAction("AdminDashboard", {}));
			return;
		}

		if (onboardingStep === USER_ONBOARDING_STEP.ACCOUNT_SETUP) {
			this.props.navigation.dispatch(AppUtil.resetAction("Signup", {}));
		} else if (onboardingStep === USER_ONBOARDING_STEP.PROFILE_COMPLETE) {
			this.props.navigation.dispatch(
				AppUtil.resetAction("AboutYou", {
					userId: this.props.loginUserStore.userId,
				}),
			);
		} else {
			this.gotoHomeScreen(data);
		}
	};

	registerToken = async () => {
		try {
			const token = await AsyncStoreUtil.getDataWithKey("token");
			const userId = this.props.userAccountStore.username;

			if (!token) {
				return;
			}

			const notificationInput = {
				user_id: userId,
				newToken: token,
				device_type: Platform.OS,
				prevToken: "",
			};

			const data = await appsyncClient.mutate({
				mutation: UserQueries.RegisterToken,
				variables: notificationInput,
			});
		} catch (error) {
			console.log("error is", error);
		}
	};

	gotoHomeScreen(data) {
		// check for loading condition....
		const {
			programStartDate,
			phase,
			cycleStartDate,
			currentCycle,
		} = this.props.userAccountStore;

		const dateDiff = AppUtil.getDateDifferenceAccordingToCycle(
			programStartDate,
			cycleStartDate,
			currentCycle,
		);

		// This was the way things were done previously before "Reload feature" started.
		// const { programStartDate, phase = 0 } = data;
		// const dateDiff = DateUtil.absoluteDifferenceFromToday(programStartDate);

		const routeName = AppUtil.getScreenToshow(dateDiff, phase);

		this.props.navigation.dispatch(AppUtil.resetAction(routeName, {}));
	}

	completeNewPassword(user) {
		this.props.navigation.navigate("SetPassword", { user: user });
	}

	passwordResetRequired() {
		Auth.forgotPassword(this.phone.getValue())
			.then((data) => {
				this.startPasswordReset();
			})
			.catch((err) => {
				switch (err.code) {
					case "UserNotFoundException":
						Alert.alert(
							strings("common_message.error"),
							strings("login.phone_number_doesnot_exists"),
						);
						break;
					default:
						Alert.alert(strings("common_message.error"), err.message);
						break;
				}
			});
	}

	startPasswordReset() {
		const title = strings("login.password_reset_required_title");
		const message = strings("login.password_reset_required_message");
		Alert.alert(title, message, [
			{
				text: "Ok",
				onPress: () => {
					this.props.navigation.navigate("ResetPassword", {
						userName: this.phone.getValue(),
					});
				},
			},
		]);
	}

	render() {
		return (
			<KeyboardAwareScrollView
				keyboardShouldPersistTaps="handled"
				style={{ backgroundColor: R.Colors.COLOR_APP_BACKGROUND }}
				scrollEnabled
				extraScrollHeight={50}
				enableResetScrollCoords
				resetScrollToCoords={{ x: 0, y: 0 }}
			>
				<View style={styles.container}>
					{AppUtil.renderProgressBar(
						this.state.loading,
						strings("common_message.please_wait"),
					)}

					<Image source={R.Images.splashLogo} style={styles.appLogo} />

					<View style={styles.loginContainer}>
						<Text style={{ height: 35, color: "#929CA5", fontSize: 14 }}>
							Phone Number
						</Text>

						<View
							style={styles.userName}
							testID={"phoneNumberInput"}
							accessibilityLabel={"phoneNumberInput"}
						>
							<PhoneInput
								onPressFlag={this.onPressFlag}
								ref={(ref) => {
									this.phone = ref;
								}}
							/>
						</View>

						<View
							style={{ marginTop: 15, marginLeft: 1 }}
							testID={"passwordInput"}
							accessibilityLabel={"passwordInput"}
						>
							<FloatingLabelInput
								style={styles.textField}
								secureTextEntry
								label="Password"
								returnKeyType="done"
								ref={this.passwordRef}
								value={this.state.password}
								onChangeText={(text) => this.setState({ password: text })}
							/>
						</View>

						<View style={styles.forgotPasswordBtnContainer}>
							<TouchableOpacity
								testID={"forgetPassword"}
								accessibilityLabel={"forgetPassword"}
								onPress={this.gotoForgotPassword.bind(this)}
							>
								<Text style={styles.forgotPasswordBtn}>Forgot Password?</Text>
							</TouchableOpacity>
						</View>

						<CTAButton
							label="LOGIN"
							isEnabled={true}
							onClick={this.loginClick.bind(this)}
							style={{ marginTop: 30 }}
						/>
{console.log(this.props.loginUserStore, 'this.props.loginUserStorethis.props.loginUserStore')}
						{this.state.shouldLoadProfile && (
							<Query
								query={UserQueries.GetProfile}
								variables={{ userId: this.props.loginUserStore.userId }}
								fetchPolicy="network-only"
							>
								{({ loading, error, data }) => {
									if (loading) {
										console.log(loading, loading, loading, 'loadingloadingloading');
									} else {
										if (data && data.getProfile) {
											console.log(data.getProfile, 'data.getProfiledata.getProfile');
											this.props.userAccountStore.setUserData(data.getProfile);
											this.handleProfileLoadComplete(data.getProfile);
											this.props.rewardStore.setRewardPointFromUserProfile(
												data.getProfile.rewardPoints,
												data.getProfile.rewardPointsHistory,
											);
										}
									}
									return null;
								}}
							</Query>
						)}
					</View>
					<PushNotificationController />
				</View>
			</KeyboardAwareScrollView>
		);
	}
}
