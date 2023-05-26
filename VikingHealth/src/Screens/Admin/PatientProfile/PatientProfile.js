import React, { Component } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	ActivityIndicator,
	Dimensions,
	Image,
	Linking,
	Alert,
	Animated,
	ActionSheetIOS,
	TouchableWithoutFeedback,
	Platform,
} from "react-native";
import BottomSheet from "react-native-js-bottom-sheet";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
	BackButton,
	PageInfo,
	ProgressBarButton,
	PageTitle,
	CTAButton,
	FloatingButton,
} from "Components";
import { styles } from "../PatientProfile/styles";
import * as DateUtil from "../../../Library/Utils/DateUtil";
import { R } from "../../../Resources";
import * as Progress from "react-native-progress";
import moment from "moment";
import AppUtil from "Library/Utils/AppUtil";
import { HeightWeightUtil } from "Library/Utils/HeightWeightUtil";
import { inject, observer } from "mobx-react";
import { RandomColors } from "Components";
import { strings } from "../../../utility/locales/i18n";
import { Mutation } from "react-apollo";
import { STATUS_USER } from "Library/Constants";
import Toast from "react-native-easy-toast";
import * as UserQueries from "AppSyncQueries/UserQueries";
import { ButtonState } from "Components/CTAButton/ButtonState";
import { CardContainer } from "Components/CardContainer/CardContainer";
import { ModalVideo } from "Components/Modal/ModalVideo";
import { UserInfoCard } from "./UserInfoCard";
import { checkInternetConnection } from "react-native-offline";
import ConfirmationModal from "./ConfirmationModal";
import RewardApprovalModal from "./RewardApprovalModal";
import {
	convertPointToAmountString,
	RewardKeys,
} from "../../Reward/RewardManager";
import ScreenNameConstant from "../../ScreenNameConstant";

const { width } = Dimensions.get("screen");

@inject("userAccountStore", "loginUserStore", "rewardStore")
@observer
export class PatientProfile extends Component {
	static navigationOptions = {
		header: null,
	};

	constructor(props) {
		super(props);
		this.isReinviteProgress = false;
		this.state = {
			isVisible: false,
			isScrollingEnabled: true, // used to disable scroll when we are dragging the weight summary
			showConfirmationModal: false,
			showRewardApproval: false,
			progressState: ButtonState.Idle,
			hasCycleUpdated: false,
		};

		this.animated = new Animated.Value(0);
	}

	_sendEmail = () => {
		Linking.openURL(`mailto:${this.props.userAccountStore.email}`);
	};

	_startPhoneCall = () => {
		const url = `tel:${this.props.userAccountStore.phoneNumber}`;
		Linking.openURL(url);
	};

	_sendSMS = () => {
		const sms = `sms:${this.props.userAccountStore.phoneNumber}?body=Hii`;
		Linking.openURL(sms);
	};

	_phoneOptionSelected = () => {
		if (Platform.OS === "ios") {
			this._showPhoneOptionsIOS();
		} else {
			this._showPhoneOptionsAndroid();
		}
	};

	_showPhoneOptionsIOS = () => {
		ActionSheetIOS.showActionSheetWithOptions(
			{
				options: ["Call", "Sms", "Cancel"],
				cancelButtonIndex: 2,
			},
			(buttonIndex) => {
				if (buttonIndex === 0) {
					this._startPhoneCall();
				} else if (buttonIndex === 1) {
					this._sendSMS();
				}
			},
		);
	};

	_showPhoneOptionsAndroid = () => {
		this.androidActionSheet.open();
	};

	_showActivateDeactivateSuccessMessage = (message) => {
		this.toast.show(message, 2000);
		setTimeout(() => {
			this.props.navigation.goBack();
		}, 2000);
	};

	_dismissVideoModal = () => {
		this.setState({ isVisibleModal: false });
	};

	changeScrolling = (isScrollingEnabled) => {
		this.setState({
			isScrollingEnabled,
		});
	};

	_editProgramEndDate = () => {
		const detail = this.props.userAccountStore;
		const age = detail.displayAge;
		const height = HeightWeightUtil.displayHeight(
			detail.height,
			detail.heightUnit,
			this.props.loginUserStore.displayHeightUnit,
		);
		this.props.navigation.navigate("UpdateEndDate", {
			isBackButtonVisible: true,
			isAdmin: true,
			programStartDate: detail.programStartDate,
			programEndDate: detail.programEndDate,
			userId: detail.username,
			status: detail.status,
			age,
			height,
		});
	};

	renderButton() {
		return (
			<Mutation mutation={UserQueries.ResendInvitation}>
				{(resendInvitation, { loading, error, data }) => {
					let buttonState = ButtonState.Idle;
					let buttonLabel = strings("invite_user.reinvite");

					if (loading) {
						buttonState = ButtonState.Progress;
						buttonLabel = "";
					} else if (data && data.resendInvitation) {
						this.isReinviteProgress = false;
						if (data.resendInvitation.httpStatus == 200) {
							buttonState = ButtonState.Success;
							buttonLabel = strings("invite_user.user_invited_successfully");
						} else {
							if (data.resendInvitation.errorMessage) {
								Alert.alert(
									strings("common_message.error"),
									data.resendInvitation.errorMessage,
								);
							} else {
								Alert.alert("Error", "Something went wrong");
							}
						}
					} else if (error) {
						this.isReinviteProgress = false;
						Alert.alert("Error", "Something went wrong");
					}

					return (
						<View style={{ marginTop: 50 }}>
							<ProgressBarButton
								label={buttonLabel}
								isEnabled={true}
								buttonState={buttonState}
								onClick={() => {
									(this.isReinviteProgress = true),
										resendInvitation({
											variables: {
												userId: this.props.userAccountStore.username,
											},
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
								}}
							/>
						</View>
					);
				}}
			</Mutation>
		);
	}

	getButtonColor = (programEndDate) => {
		const daysLeftInProgram = DateUtil.absoluteDifferenceFromToday(
			programEndDate,
		);

		const lessThan10DaysLeft = daysLeftInProgram < -10;

		const extendBGColor = lessThan10DaysLeft ? "#d13341" : "white";
		const reloadBGColor = lessThan10DaysLeft ? "white" : "#d13341";

		return { extendBGColor, reloadBGColor };
	};

	animatedAndRemovedReloadContainer = () => {
		Animated.timing(this.animated, {
			toValue: 1,
			duration: 1000,
		}).start();
	};

	updateCache = (proxy, { data }) => {
		const query = UserQueries.PatientList;
		const variables = {
			// limit: 10,
			nextToken: null,
			type: STATUS_USER.ACTIVE,
		};

		let queryData = null;

		try {
			queryData = proxy.readQuery({
				query,
				variables,
			});
		} catch (e) {
			console.log("EXCEPTION: ", e.message);
		}
	};

	showReloadModal = () => {
		this.setState({ showConfirmationModal: true });
	};

	hideReloadModal = (hasCycleUpdated = false) => {
		this.setState({
			showConfirmationModal: false,
			hasCycleUpdated: hasCycleUpdated,
		});
	};

	onCreditUsedCompleted = () => {
		this.props.rewardStore.setRewardCreditUsed();
		this.hideRedeemModal();
	};

	hideRedeemModal = () => {
		this.setState({ showRewardApproval: false });
	};

	updateModalProgressBarState = (state) => {
		this.setState({ progressState: state });
	};

	renderReloadButton = () => {
		const detail = this.props.userAccountStore;
		const { currentCycle, lastAcceptedCycle, cycleStartDate } = detail;

		const hasUserAcceptedReboot = currentCycle === lastAcceptedCycle;
		const shouldShowAcceptedText = DateUtil.absoluteDifferenceFromToday(
			cycleStartDate,
		);

		if (
			hasUserAcceptedReboot &&
			shouldShowAcceptedText === -1 &&
			currentCycle > 1
		) {
			return this.renderCycleAcceptedText(currentCycle);
		}

		const programEndDateM = moment(this.props.userAccountStore.programEndDate);
		const { extendBGColor, reloadBGColor } = this.getButtonColor(
			programEndDateM,
		);
		const xOffset = this.animated.interpolate({
			inputRange: [0, 1],
			outputRange: [0, -width],
		});

		return (
			<Animated.View
				style={[
					styles.reloadButtonContainer,
					{
						transform: [{ translateX: xOffset }],
						width: width * (hasUserAcceptedReboot ? 2 : 1),
					},
				]}
			>
				{hasUserAcceptedReboot && (
					<View
						style={{
							flex: 1,
							flexDirection: "row",
							overflow: "hidden",
							marginHorizontal: 16,
						}}
					>
						<CTAButton
							style={{
								flex: 1,
								backgroundColor: reloadBGColor,
							}}
							onClick={this.showReloadModal}
							textColor={extendBGColor}
							label="RELOAD"
							isEnabled
						/>

						<CTAButton
							style={{
								flex: 1,
								marginLeft: 8,
								marginRight: 16,
								backgroundColor: extendBGColor,
							}}
							onClick={this._editProgramEndDate}
							textColor={reloadBGColor}
							label="EXTEND"
							isEnabled
						/>
					</View>
				)}

				<View
					style={{
						justifyContent: "center",
						alignItems: "center",
						flex: 1,
					}}
				>
					<Text style={[styles.reloadInitiatedTextStyle]}>
						Reload Cycle started by you
					</Text>
					<Text style={[styles.awaitingText]}>Awaiting patient acceptance</Text>
				</View>
			</Animated.View>
		);
	};

	renderCycleAcceptedText = (currentCycle) => {
		return (
			<View
				style={[
					{
						marginHorizontal: 16,
						marginTop: 6,
						flexDirection: "row",
						alignContent: "center",
						alignItems: "center",
					},
				]}
			>
				<Image
					source={R.Images.checkMark}
					style={{ height: 12, width: 12 }}
					resizeMode="contain"
				/>
				<Text
					style={[styles.acceptedTextStyle]}
				>{`Cycle ${currentCycle} started`}</Text>
			</View>
		);
	};

	goToSummaryScreen = (_) => {
		this.props.navigation.navigate("CycleSummary");
	};

	onCreditApproveButtonPressed = () => {
		this.setState({ showRewardApproval: true });
	};

	onBookAppointmentClick = () => {
		this.props.navigation.navigate(ScreenNameConstant.BookAppointment, {
			isSingleSelection: false,
			isSuggestingSlot: false,
		});
	};

	render() {
		const {
			rewardData: { total: totalReward },
		} = this.props.rewardStore;
		const { hasProgramCompleted } = this.props.userAccountStore;
		const programEndDateM = moment(this.props.userAccountStore.programEndDate);
		const programStartDateM = moment(
			this.props.userAccountStore.programStartDate,
		);
		const progress = AppUtil.progressReport(programEndDateM, programStartDateM);
		const detail = this.props.userAccountStore;
		const { currentCycle } = detail;
		const isAndroid = Platform.OS !== "ios";
		const isUserInvited = detail.status === STATUS_USER.INVITED;
		const programStartDate = DateUtil.getFormattedDate(detail.programStartDate);
		const programEndDate = DateUtil.getFormattedDate(detail.programEndDate);

		const age = detail.displayAge;
		const height = HeightWeightUtil.displayHeight(
			detail.height,
			detail.heightUnit,
			this.props.loginUserStore.displayHeightUnit,
		);

		const screenName = this.props.navigation.getParam(
			"screenName",
			"ListScreen",
		);

		return (
			<View style={styles.wrapper}>
				<KeyboardAwareScrollView scrollEnabled={this.state.isScrollingEnabled}>
					<View>
						<View style={styles.container}>
							<View style={styles.headerContainer}>
								<View style={styles.contentAlign}>
									<View
										style={{
											flexDirection: "row",
											justifyContent: "space-between",
										}}
									>
										{/* <BackButton navigation={this.props.navigation} /> */}
										<TouchableWithoutFeedback
											onPress={() => {
												if (screenName === "search") {
													this.props.navigation.navigate("SearchPatient", {
														reloadScreen: true,
													});
												} else {
													this.props.navigation.goBack();
												}
											}}
										>
											<View style={{ padding: 10 }}>
												<Image source={R.Images.arrowLeft} />
											</View>
										</TouchableWithoutFeedback>
										<PageInfo
											style={{ marginTop: 10 }}
											info={"Weight Loss Program"}
										/>
									</View>
									<ActivateDeactivateButtonView
										currentStatus={detail.status}
										userId={this.props.userAccountStore.username}
										mutationSuccessful={
											this._showActivateDeactivateSuccessMessage
										}
									/>
								</View>
								<PageTitle title={"Patient profile"} />
							</View>

							<UserInfoCard
								email={this.props.userAccountStore.email}
								currentCycle={this.props.userAccountStore.lastAcceptedCycle}
								gender={detail.gender}
								phoneNumber={detail.phoneNumber}
								fullName={detail.fullName}
								isInvited={isUserInvited}
								age={age}
								height={height}
								_sendEmail={() => {
									this._sendEmail();
								}}
								onCallClick={() => {
									this._phoneOptionSelected();
								}}
								onCycleClicked={this.goToSummaryScreen}
								hasProgramCompleted={hasProgramCompleted}
								startDate={this.props.userAccountStore.startDate}
								rewardData={this.props.rewardStore.rewardData}
								onCreditApprove={this.onCreditApproveButtonPressed}
								navigation={this.props.navigation}
								userDetails={{
									firstName: detail.firstName,
									lastName: detail.lastName,
									gender: detail.gender,
									email: detail.email,
									phoneNumber: detail.phoneNumber,
									startDate: detail.programStartDate,
									userId: detail.username,
								}}
							/>
							<ProgramProgress
								programStartDate={programStartDate}
								programEndDate={programEndDate}
								onUpdateEndDateClick={this._editProgramEndDate}
								progress={progress}
							/>

							{!(detail.status === STATUS_USER.INVITED) &&
								this.renderReloadButton()}
						</View>

						{/* This will contain all the weight, body and water intake flow */}
						{!detail.status == STATUS_USER.INVITED && (
							<View style={{ flex: 1, padding: 8 }}>
								<CardContainer
									navigate={this.props.navigation.navigate}
									changeScrolling={this.changeScrolling}
								/>
							</View>
						)}

						{detail.status == STATUS_USER.INVITED && (
							<View style={styles.detailsContainer}>
								<View>{this.renderButton()}</View>
							</View>
						)}

						<ToastMessage
							onRef={(ref) => {
								this.toast = ref;
							}}
						/>
					</View>
				</KeyboardAwareScrollView>

				{this.state.isVisibleModal && (
					<ModalVideo
						isModalVisible
						navigation={this.props.navigation}
						userId={this.props.userAccountStore.username}
						isAdmin
						fullName={this.props.userAccountStore.fullName}
						firstName={this.props.userAccountStore.firstName}
						dismiss={this._dismissVideoModal}
					/>
				)}
				{isAndroid && (
					<AndroidActionSheet
						onCallClick={this._startPhoneCall}
						onSMSClick={this._sendSMS}
						onRef={(ref) => {
							this.androidActionSheet = ref;
						}}
					/>
				)}

				{detail.status === STATUS_USER.ACTIVE && (
					<FloatingButton
						onClick={this.onBookAppointmentClick}
						image={R.Images.AppointmentImages.AppointmentFloatingIcon}
						style={{ bottom: 100 }}
					/>
				)}

				{!isUserInvited && (
					<FloatingButton
						onClick={() => this.setState({ isVisibleModal: true })}
						image={R.Images.videoCall}
					/>
				)}

				<View>
					<Mutation
						mutation={UserQueries.UpdateCurrentCycle}
						onCompleted={() => {
							this.hideReloadModal(true);
						}}
						update={this.updateCache}
					>
						{(updateCurrentCycle, { loading, error }) => {
							let buttonState = ButtonState.Idle;

							if (loading) {
								buttonState = ButtonState.Progress;
							} else {
								buttonState = ButtonState.Idle;
							}

							return (
								<ConfirmationModal
									isVisible={this.state.showConfirmationModal}
									onCancelCallback={() => {
										this.hideReloadModal(false);
									}}
									buttonState={buttonState}
									onModalHide={() => {
										if (this.state.hasCycleUpdated) {
											this.animatedAndRemovedReloadContainer();
										}
									}}
									username={detail.fullName}
									onConfirmCallback={() => {
										checkInternetConnection().then((isConnected) => {
											if (isConnected) {
												updateCurrentCycle({
													variables: {
														userId: this.props.userAccountStore.username,
														currentCycle: currentCycle + 1,
													},
													refetchQueries: [
														{
															query: UserQueries.PatientList,
															variables: {
																limit: 10,
																nextToken: null,
																type: STATUS_USER.ACTIVE,
															},
														},
														{
															query: UserQueries.PatientList,
															variables: {
																limit: 10,
																nextToken: null,
																type: STATUS_USER.COMPLETED,
															},
														},
													],
												});
											} else {
												Alert.alert(
													"No Internet Connection",
													"It seems there is some problem with your internet connection. Please check and try again.",
												);
											}
										});
									}}
								/>
							);
						}}
					</Mutation>
				</View>

				<View>
					<Mutation
						mutation={UserQueries.RedeemPoints}
						onCompleted={this.onCreditUsedCompleted}
					>
						{(redeemPoints, { loading, error }) => {
							let buttonState = ButtonState.Idle;

							if (loading) {
								buttonState = ButtonState.Progress;
							} else {
								buttonState = ButtonState.Idle;
							}

							return (
								<RewardApprovalModal
									isVisible={this.state.showRewardApproval}
									onCancelCallback={this.hideRedeemModal}
									credit={convertPointToAmountString(totalReward)}
									buttonState={buttonState}
									onConfirmCallback={() => {
										checkInternetConnection().then((isConnected) => {
											if (isConnected) {
												redeemPoints({
													variables: {
														userId: this.props.userAccountStore.username,
														rewards: {
															...this.props.rewardStore.rewardData,
															[RewardKeys.HasCreditUsed]: true,
														},
													},
													refetchQueries: [
														{
															query: UserQueries.PatientList,
															variables: {
																limit: 10,
																nextToken: null,
																type: STATUS_USER.ACTIVE,
															},
														},
														{
															query: UserQueries.PatientList,
															variables: {
																limit: 10,
																nextToken: null,
																type: STATUS_USER.COMPLETED,
															},
														},
													],
												});
											} else {
												Alert.alert(
													"No Internet Connection",
													"It seems there is some problem with your internet connection. Please check and try again.",
												);
											}
										});
									}}
								/>
							);
						}}
					</Mutation>
				</View>
			</View>
		);
	}
}

const AndroidActionSheet = (props) => (
	<BottomSheet
		ref={(ref) => {
			props.onRef(ref);
		}}
		height={120}
		backButtonEnabled
		coverScreen={false}
		title="Create"
		options={[
			{
				title: "Call",
				onPress: props.onCallClick,
			},
			{
				title: "Sms",
				onPress: props.onSMSClick,
			},
		]}
		isOpen={false}
	/>
);

const ToastMessage = (props) => (
	<Toast
		ref={(ref) => {
			props.onRef(ref);
		}}
		style={[R.ToastStyle.toastSuccessBackGround]}
		position="center"
		fadeInDuration={800}
		fadeOutDuration={1000}
		textStyle={styles.toastText}
	/>
);

const ActivateDeactivateButtonView = (props) => {
	const currentUserStatus = props.currentStatus;
	let mutation;
	let successMessage;
	let buttonText;

	if (currentUserStatus === STATUS_USER.COMPLETED) {
		mutation = UserQueries.ActivatePatient;
		successMessage = "User has been activated successfully!";
		buttonText = "Activate";
	} else {
		mutation = UserQueries.DeactivatePatient;
		successMessage = "User has been deactivated successfully!";
		buttonText = "Deactivate";
	}

	const mutationParams = {
		variables: {
			userId: props.userId,
		},
		refetchQueries: [
			{
				query: UserQueries.PatientList,
				variables: {
					limit: 10,
					nextToken: null,
					type: STATUS_USER.ACTIVE,
				},
			},
			{
				query: UserQueries.PatientList,
				variables: {
					limit: 10,
					nextToken: null,
					type: STATUS_USER.COMPLETED,
				},
			},
		],
	};

	return (
		<Mutation mutation={mutation}>
			{(activatePatient, { loading, error, data }) => {
				/* This condition is also first checking data, but it is not working for undefined data
        therefore i have added above condition */

				if (data) {
					let response;

					if (currentUserStatus === STATUS_USER.COMPLETED) {
						response = data.activatePatient;
					} else {
						response = data.deactivatePatient;
					}

					if (typeof response === "undefined" || response === null) {
						Alert.alert(
							"Error",
							"We cannot process your request right now. Please try again later.",
						);
					} else if (response.httpStatus === 200) {
						props.mutationSuccessful(successMessage);
					} else {
						Alert.alert("Error", response.errorMessage);
					}
				} else if (error) {
					Alert.alert("Error", "Something went wrong");
				}
				return (
					<ActivateDeactivateButton
						onClick={() => activatePatient(mutationParams)}
						title={buttonText}
						loading={loading}
					/>
				);
			}}
		</Mutation>
	);
};

const ActivateDeactivateButton = (props) => {
	if (props.loading) {
		return (
			<View style={{ marginRight: 20 }}>
				<ActivityIndicator size="small" color={R.Colors.COLOR_BLUE} />
			</View>
		);
	} else {
		return (
			<TouchableOpacity style={styles.deactivateText} onPress={props.onClick}>
				<Text style={styles.deactivate}>{props.title}</Text>
			</TouchableOpacity>
		);
	}
};

const ProgramProgress = (props) => (
	<React.Fragment>
		<View
			style={{
				flexDirection: "row",
				justifyContent: "space-between",
				marginTop: 10,
				paddingHorizontal: 20,
				alignItems: "center",
			}}
		>
			<View style={{ marginBottom: 10 }}>
				<Text style={styles.programEndStyle}>
					Program: Start on {props.programStartDate}
				</Text>
				<Text style={styles.programEndStyle}>
					Ending on {props.programEndDate}
				</Text>
			</View>

			{/* <TouchableOpacity
        onPress={props.onUpdateEndDateClick}
        style={{ paddingRight: 10 }}
      >
        <Image source={R.Images.editPencil} />
      </TouchableOpacity> */}
		</View>

		<View style={styles.progressBarStyles}>
			<Progress.Bar
				borderWidth={0}
				color={"rgb(145,222,102)"}
				unfilledColor={"#E7F3FB"}
				progress={props.progress}
				height={5}
				borderRadius={4.5}
				width={Dimensions.get("window").width - 50}
			/>
		</View>
	</React.Fragment>
);

const UserInfoView = (props) => (
	<View style={{ alignItems: "center" }}>
		<RandomColors
			gender={props.gender}
			height={62}
			width={62}
			number={props.phoneNumber}
		/>
		<Text style={[styles.nameStyle, { marginTop: 16 }]}>{props.fullName}</Text>
		{!props.isInvited && (
			<View style={[styles.programDetail]}>
				<Text style={styles.subInfoTextStyle}>
					{props.age} | {props.height}
				</Text>
			</View>
		)}
		{props.isInvited && (
			<TouchableOpacity
				style={[styles.inviteWrapper]}
				onPress={props.onCallClick}
			>
				<Image source={R.Images.callProfile} />
				<Text style={styles.inviteText}>{props.phoneNumber}</Text>
			</TouchableOpacity>
		)}
	</View>
);
