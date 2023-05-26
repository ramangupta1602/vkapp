import React, { Component } from "react";
import {
	View,
	TouchableOpacity,
	Image,
	AppState,
	Button,
	Alert,
} from "react-native";
import Modal from "react-native-modal";
import { Analytics } from "aws-amplify";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
	PageTitle,
	PageInfo,
	UserIcon,
	CycleIndicator,
	GamificationModal,
	CancelNotification,
	LocalNotification,
} from "Components";
import { styles } from "./Styles";
import { strings } from "../../utility/locales/i18n";
import { R } from "Resources";
import AppUtil from "Library/Utils/AppUtil";
import { inject, observer } from "mobx-react";
import {
	Proverb,
	UpdateAppCardComponent,
} from "../../Screens/Dashboard/Cards/index";
import { RebootDetails } from "../../Screens/OnBoard/RebootDetails";
import { HeightWeightUtil } from "Library/Utils/HeightWeightUtil";
import { CardContainer } from "../../Components/CardContainer/CardContainer";
import store from "react-native-simple-store";
import * as ProverbsArray from "Components/LocalNotification/Proverbs";
import * as DateUtil from "../../Library/Utils/DateUtil";
// import { Sentry } from "react-native-sentry";
import { AsyncStorage } from "react-native";
import { Auth } from "aws-amplify";
import { PushNotificationController } from "Components";
import { Gamification } from "./../../utility/constants/Constants";
import AppVersoning from "./../../Components/AppVersionCheck/AppVersionCheck";
import { Mutation } from "react-apollo";
import * as UserQueries from "AppSyncQueries/UserQueries";
import moment from "moment";
import ReloadCycleCard from "./Cards/ReloadCycle/ReloadCycle";
import ReloadConfirmationModal from "../../Components/Gamification/ReloadConfirmationModal";
import { appsyncClient } from "../../../App";
import { USER_TYPE } from "Library/Constants";
import ScreenName from "../ScreenNameConstant";

@inject(
	"userAccountStore",
	"loginUserStore",
	"gamificationStore",
	"rewardStore",
)
@observer
export class Dashboard extends Component {
	static navigationOptions = {
		header: null,
	};

	constructor(props) {
		super(props);
		const { firstName, email } = this.props.userAccountStore;
		this.userId = this.props.userAccountStore.username;

		this.focusListener = null;

		// Sentry.setUserContext({
		// 	email,
		// 	id: this.userId,
		// 	username: firstName,
		// });
		this.state = {
			isOnboardVisible: false,
			isProverbVisible: false,
			appState: AppState.currentState,
			isGamificationModalVisible: false,
			modalName: Gamification.Appointment.ConfirmAppointmentRequest,
			isScrollingEnabled: true, // used to disable scroll when we are dragging the weight summary
			shouldShowConfirmationModal: false,
			hasProgramReloaded: false,
		};

		store.get("cancelDate").then((obj) => this.setProverbCardVisibility(obj));
		this.cancelNotification = new CancelNotification();
		this.localNotification = new LocalNotification();
	}

	componentDidMount() {
		AppState.addEventListener("change", this._handleAppStateChange);
		Analytics.record("Dashboard mounted");

		//this.checkForAppVersion();

		this.focusListener = this.props.navigation.addListener("didFocus", () => {
			if (this.props.loginUserStore.userType !== USER_TYPE.PATIENT) {
				return;
			}

			const appVersionCheck = new AppVersoning(
				this.props.userAccountStore,
				this.props.loginUserStore,
			);
			appVersionCheck.checkAppVersion();

			setTimeout(() => {
				this.checkForGamificationToShow();
				this.fetchUserProfile();
			}, 1000);
		});
	}

	checkForGamificationToShow = () => {
		if (!this.props.gamificationStore.isCardShownForFirstTime) {
			this.setState({
				isGamificationModalVisible: true,
				modalName: Gamification.QuoteModal,
			});
			return;
		}

		let modalName;

		// Cycle summary popup
		modalName = this.checkForViewCycleSummaryPopup();
		if (modalName) {
			this.setShowModalFlag(modalName);
			return;
		}

		// Weekly loss summary popup
		modalName = this.checkForSummaryLossModal();
		if (modalName) {
			this.setShowModalFlag(modalName);
			return;
		}

		// gamificaiton modal
		modalName = this.props.gamificationStore.shouldShowModal();
		this.setShowModalFlag(modalName);
	};

	setShowModalFlag = (modalName) => {
		if (modalName) {
			this.setState({ isGamificationModalVisible: true, modalName });
			return;
		}
	};

	// Weekly loss summary modal
	checkForSummaryLossModal = () => {
		const { losingStartDate } = this.props.userAccountStore;
		const { summaryModalLastShownOn } = this.props.gamificationStore;
		const time = moment();
		const hour = time.get("hours");

		// adding 1 so that we can see report on 7th day itself not on 8 day (when difference is 7,
		// it is basically 8th day, 0 diff = 1st day,
		// 1 diff = 2 day and so on..)
		const dayDifference =
			DateUtil.absoluteDifferenceFromToday(losingStartDate) + 1;
		const diffFromLastShown = DateUtil.absoluteDifferenceFromToday(
			summaryModalLastShownOn,
		);

		// so we don't show modal on the very first day
		if (
			dayDifference % 7 === 0 &&
			dayDifference !== 0 &&
			diffFromLastShown >= 7 &&
			hour >= 18 // to show modal after 6 in the evening.
		) {
			this.props.gamificationStore.setSummaryModalLastShownOn(
				DateUtil.formattedTodayDate(),
			);
			return Gamification.LossSummaryModal;
		}

		return false;
	};

	// View summary modal presented at the end of the cycle to redirect user to summary page
	checkForViewCycleSummaryPopup = () => {
		const {
			programEndDate,
			shouldShowSummaryPopup,
			summaryPopupShownForCycle,
			currentCycle,
		} = this.props.userAccountStore;

		if (this.props.loginUserStore.userType !== USER_TYPE.PATIENT) {
			return;
		}

		const hasPassedEndDate =
			DateUtil.absoluteDifferenceFromToday(programEndDate) > 0;
		const lastShownDiff = currentCycle != summaryPopupShownForCycle;

		if (hasPassedEndDate && shouldShowSummaryPopup && lastShownDiff) {
			return Gamification.ViewCycleSummaryPopup;
		}
	};

	componentWillUnmount() {
		// AppState.removeEventListener("change", this._handleAppStateChange);
		this.focusListener.remove();
	}

	// when app come back in foreground, will update proverb accordingly
	_handleAppStateChange = (nextAppState) => {
		if (
			this.state.appState.match(/inactive|background/) &&
			nextAppState === "active"
		) {
			this.forceUpdate();
			store.get("cancelDate").then((obj) => this.setProverbCardVisibility(obj));

			if (this.props.navigation.isFocused) {
				this.checkForGamificationToShow();
				this.fetchUserProfile();
			}
		}
		this.setState({ appState: nextAppState });
	};

	checkForAppVersion = () => {
		this.fetchAppVersion().then((appVersion) => {
			// key is not set, logout user..
			if (appVersion !== "4.2.0") {
				this.showForceLogoutPopUp();
			}
		});
	};

	fetchAppVersion = async () => {
		try {
			const appVersion = (await AsyncStorage.getItem("appVersion")) || "0";
			return appVersion;
		} catch (error) {
			return 0;
		}
	};

	showForceLogoutPopUp = () => {
		Alert.alert(
			"App updated!",
			"To access all the updated features , you need to logout and login again.",
			[{ text: "Logout", onPress: () => this.forceLogoutUser() }],
			{ cancelable: false },
		);
	};

	forceLogoutUser = () => {
		Auth.signOut()
			.then((data) => {
				//this.props.client.clearStore();
				this.cancelNotification.disableAllLocalNotification(); //all the notifications cancelled
				this.props.navigation.dispatch(AppUtil.resetAction("Login", {}));
				Analytics.record({
					name: "Logout successfull",
				});
				setTimeout(() => {
					this.clearStores();
				}, 100);
			})
			.catch((err) => Alert.alert(strings("common_message.error"), err));
	};

	clearStores() {
		this.props.loginUserStore.clear();
		this.props.userAccountStore.clearData();
		this.props.gamificationStore.clearData();
		this.props.rewardStore.clearData();
		store.delete("cancelDate");
	}

	getQuoteOfTheDay() {
		const diff = DateUtil.differenceInDaysForProverbs(
			this.props.userAccountStore.programStartDate,
		);
		const quotesIndex = AppUtil.getQuotesIndex(diff);
		return ProverbsArray.quotes[quotesIndex];
	}

	setProverbCardVisibility(obj) {
		if (obj && obj.currentDate) {
			if (obj.currentDate === AppUtil.getCurrentDate()) {
				this.setState({ isProverbVisible: false });
			} else {
				this.setState({ isProverbVisible: true });
			}
		} else {
			this.setState({ isProverbVisible: true });
		}
	}

	onProverbCrossClicked() {
		this.setState({ isProverbVisible: false });
		store.get("cancelDate").then((obj) => this.updateProverbStore(obj));
		Analytics.record({
			name: "Proverb closed",
		});
	}

	updateProverbStore(obj) {
		if (obj && obj.currentDate) {
			store.update("cancelDate", {
				currentDate: AppUtil.getCurrentDate(),
			});
		} else {
			store.save("cancelDate", {
				currentDate: AppUtil.getCurrentDate(),
			});
		}
	}

	_openModal = () => {
		this.setState({ isOnboardVisible: true });
	};

	_goToProfile = () => {
		Analytics.record({
			name: "Open Profile",
		});
		this.props.navigation.navigate("Profile");
	};

	getWaistToHeightRatio() {
		const height = this.props.userAccountStore.cmHeight;
		const waist = this.lastBodyMeasurement.displayWaist(
			HeightWeightUtil.HEIGHT_CM,
		);
		return AppUtil.getWaistToHeightRatio(waist, height);
	}

	_dismissVideoModal = () => {
		this.setState({ isVideoOptionsModalVisible: false });
	};

	changeScrolling = (isScrollingEnabled) => {
		this.setState({
			isScrollingEnabled,
		});
	};

	showReloadConfirmationModal = () => {
		this.setState({
			shouldShowConfirmationModal: true,
		});
	};

	hideReloadConfirmationModal = (shouldRedirect) => {
		this.setState(
			{
				shouldShowConfirmationModal: false,
			},
			() => {
				if (shouldRedirect) {
					this.cancelNotification.disableAllLocalNotification();
					this.props.navigation.dispatch(
						AppUtil.resetAction("StartDateSelection", {}),
					);
				}
			},
		);
	};

	updateCycleHistoryInCache = (
		proxy,
		{
			data: {
				updateCycleHistory: {
					phase,
					cycleStartDate,
					programEndDate,
					losingPhaseStartDate,
					lastAcceptedCycle,
					cycleHistory,
				},
			},
		},
	) => {
		const query = UserQueries.GetProfile;
		const userId = this.props.userAccountStore.username;
		try {
			const data = proxy.readQuery({
				query,
				variables: { userId },
			});
			if (data && data.getProfile) {
				data.getProfile.phase = phase;
				data.getProfile.cycleStartDate = cycleStartDate;
				data.getProfile.programEndDate = programEndDate;
				data.getProfile.losingPhaseStartDate = losingPhaseStartDate;
				data.getProfile.cycleHistory = cycleHistory;
				data.getProfile.lastAcceptedCycle = lastAcceptedCycle;
				proxy.writeQuery({ query, variables: { userId }, data });

				this.props.userAccountStore.setCycleStartDate(cycleStartDate);
				this.props.userAccountStore.setProgramEndDate(programEndDate);
				this.props.userAccountStore.updatePhase(phase);
				this.props.userAccountStore.setLastAcceptedCycle(lastAcceptedCycle);
				this.props.userAccountStore.setCurrentCycle(lastAcceptedCycle);

				this.props.rewardStore.updateRewardAfterCycleReload();
			}
		} catch (e) {
			console.log("EXCEPTION isGetProfileQueryAvailable: ", e.message);
		}
	};

	fetchUserProfile = () => {
		appsyncClient
			.query({
				query: UserQueries.GetProfile,
				fetchPolicy: "network-only",
				variables: { userId: this.props.loginUserStore.userId },
			})
			.then((data) => {
				if (data && data.data.getProfile) {
					const { summaryPopupScheduledDate } = this.props.userAccountStore;

					this.props.userAccountStore.setUserData(data.data.getProfile);

					const {
						currentCycle,
						lastAcceptedCycle,
						programEndDate: newProgramEndDate,
					} = this.props.userAccountStore;

					const hasProgramReloaded = currentCycle !== lastAcceptedCycle;

					if (this.state.hasProgramReloaded !== hasProgramReloaded) {
						this.setState({ hasProgramReloaded });
					}

					// Rescheduling local notification if program end is changed and it is for future date. If end date is a past date, then it will show popup automatically.
					const hasPastToday =
						DateUtil.absoluteDifferenceFromToday(newProgramEndDate) > 0;

					if (summaryPopupScheduledDate != newProgramEndDate && !hasPastToday) {
						this.cancelNotification.disableCycleSummaryNotification();
						this.localNotification.scheduleViewSummaryNotification(
							newProgramEndDate,
						);
						this.props.userAccountStore.setSummaryPopupScheduleDate(
							newProgramEndDate,
						);
					}

					this.props.rewardStore.setRewardPointFromUserProfile(
						data.data.getProfile.rewardPoints,
						data.data.getProfile.rewardPointsHistory,
					);
				}
			})
			.catch((err) => {
				console.log("error while fetching data", err);
			});
	};

	getRewardPointHistory = () => {
		const rewardData = this.props.rewardStore.rewardPointsHistory;
		const { lastAcceptedCycle } = this.props.userAccountStore;

		const {
			rewardData: { total },
		} = this.props.rewardStore;

		const currentObj = {
			point: total,
			reason: "Cycle Reload",
			cycle: lastAcceptedCycle,
			reloadDate: DateUtil.formattedTodayDate(),
		};

		return [...rewardData, currentObj];
	};

	render() {
		const {
			shouldShowUpdateAvailableCard,
			currentCycle,
			lastAcceptedCycle,
		} = this.props.userAccountStore;

		return (
			<View style={{ backgroundColor: R.Colors.COLOR_APP_BACKGROUND, flex: 1 }}>
				<KeyboardAwareScrollView
					showsVerticalScrollIndicator={false}
					scrollEnabled={this.state.isScrollingEnabled}
				>
					<View style={styles.container}>
						{/* Header with title and user profile button */}
						<HeaderView
							onInfoClick={this._openModal}
							usernameInitials={this.props.loginUserStore.initials}
							onUserIconClick={this._goToProfile}
							currentCycle={lastAcceptedCycle}
						/>

						{/* showing temporary button */}
						{/* {this.getButtonToShowModal()} */}

						<View style={styles.cardsConatiner}>
							{shouldShowUpdateAvailableCard && <UpdateAppCardComponent />}
						</View>

						{this.state.hasProgramReloaded && (
							<ReloadCycleCard onClick={this.showReloadConfirmationModal} />
						)}

						{/* Quotes */}
						{this.state.isProverbVisible && (
							<View
								style={styles.proverbContainer}
								testID={"proverb"}
								accessibilityLabel={"proverb"}
							>
								<Proverb
									quotes={this.getQuoteOfTheDay()}
									onClick={() => {
										this.onProverbCrossClicked();
									}}
								/>
							</View>
						)}

						<View style={styles.cardsConatiner}>
							<CardContainer
								appState={this.state.appState}
								navigate={this.props.navigation.navigate}
								changeScrolling={this.changeScrolling}
							/>
						</View>

						<RebootModal
							isVisible={this.state.isOnboardVisible}
							onClose={() => {
								this.setState({ isOnboardVisible: false });
							}}
						/>
					</View>
				</KeyboardAwareScrollView>

				<GamificationModal
					isVisible={this.state.isGamificationModalVisible}
					onClick={() => {
						this.handleGamificationModalClick();
					}}
					onBackdropPress={() => {
						this.handleGamificationModalBackdropClick();
					}}
					modalName={this.state.modalName}
				/>

				<PushNotificationController />
				<PushNotificationController />

				{this.state.shouldShowConfirmationModal && (
					<Mutation
						mutation={UserQueries.UpdateCycleHistory}
						update={this.updateCycleHistoryInCache}
						onCompleted={() => {
							this.hideReloadConfirmationModal(true);
						}}
						onError={(error) => {
							this.hideReloadConfirmationModal(false);
							// Sentry.captureMessage(error.message);
							Alert.alert(
								"Alert!",
								"We are unable to start your reload cycle. Please try again later.",
							);
						}}
					>
						{(updateCycleHistory) => {
							return (
								<Modal
									isVisible
									backdropOpacity={0.6}
									style={{ flex: 1 }}
									onBackdropPress={() => {
										this.hideReloadConfirmationModal(false);
									}}
								>
									<ReloadConfirmationModal
										onCancel={() => {
											this.hideReloadConfirmationModal(false);
										}}
										onClick={(data) => {
											const cycleStartDate = DateUtil.getTomorrowDate();
											const programEndDate = DateUtil.addWeekFormatted(
												cycleStartDate,
												12,
											);

											const rewardPointHistory = this.getRewardPointHistory();

											updateCycleHistory({
												variables: {
													userId: this.userId,
													input: data,
													phase: 3,
													cycleStartDate,
													programEndDate,
													lastAcceptedCycle: currentCycle,
													rewardPointsHistory: rewardPointHistory,
												},
											});
										}}
									/>
								</Modal>
							);
						}}
					</Mutation>
				)}
			</View>
		);
	}

	redirectToRewardHistory = () => {
		this.setState({
			isGamificationModalVisible: false,
		});

		this.props.gamificationStore.setShowModalFlag(false, null);
		this.cancelNotification.disableCycleSummaryNotification();

		setTimeout(() => {
			this.props.navigation.navigate(ScreenName.RewardHistory);
		}, 1000);
	};

	handleGamificationModalClick = () => {
		if (this.handleQuoteCase()) {
			return;
		}

		let { modalName } = this.state;

		switch (modalName) {
			case Gamification.LossSummaryModal:
				this.redirectToJourneyScreen();
				break;

			case Gamification.ViewCycleSummaryPopup:
				this.redirectToCycleSummaryScreen();
				break;

			case Gamification.RewardModal.BMIModal:
			case Gamification.RewardModal.WeightLossModal:
			case Gamification.RewardModal.WtHRModal:
				this.redirectToRewardHistory();

			default:
				this.props.gamificationStore.setShowModalFlag(false, null);
				this.setState({ isGamificationModalVisible: false });
		}
	};

	redirectToCycleSummaryScreen = () => {
		this.setState({
			isGamificationModalVisible: false,
		});

		this.props.gamificationStore.setShowModalFlag(false, null);
		this.cancelNotification.disableCycleSummaryNotification();

		setTimeout(() => {
			const { currentCycle } = this.props.userAccountStore;
			this.props.userAccountStore.setShowCycleSummaryFlag(false, currentCycle);
			this.props.navigation.navigate("CycleSummary", {
				isFromSummaryPopUp: true,
			});
		}, 1000);
	};

	// Loss summary screen
	redirectToJourneyScreen = () => {
		this.setState({
			isGamificationModalVisible: false,
			navigateToSummarScreen: true,
		});
		this.props.gamificationStore.setShowModalFlag(false, null);

		// delaying because we want to hide modal first,
		// should have used onModalHide props, but when wrote this code, didn't know about it.
		//TODO: move this code to onModalHide
		setTimeout(() => {
			this.props.navigation.navigate("SummaryScreen");
		}, 1000);

		return;
	};

	handleGamificationModalBackdropClick = () => {
		if (this.handleQuoteCase()) {
			return;
		}

		let { modalName } = this.state;

		switch (modalName) {
			case Gamification.ViewCycleSummaryPopup:
				return;

			default:
				this.props.gamificationStore.setShowModalFlag(false, null);
				this.setState({ isGamificationModalVisible: false });
		}
	};

	handleQuoteCase = () => {
		this.props.gamificationStore.setIsCardShownForFirstTime(true);

		if (this.state.modalName === Gamification.QuoteModal) {
			this.setState({ isGamificationModalVisible: false });

			setTimeout(() => {
				this.setState({
					modalName: Gamification.WaterIntake.Completed0Percent,
					isGamificationModalVisible: true,
				});
			}, 1000);

			return true;
		}
		return false;
	};

	getButtonToShowModal = () => {
		return (
			<View>
				<Button
					title="Show notification with Snooze"
					onPress={() => {
						this.localNotification.scheduleNotificationWithSnoozeButton();
					}}
				/>

				<Button
					title="0 % buton"
					onPress={() => {
						this.setState({
							modalName: Gamification.WaterIntake.Completed0Percent,
							isGamificationModalVisible: true,
						});
					}}
				/>

				<Button
					title="50 % buton"
					onPress={() => {
						this.setState({
							modalName: Gamification.WaterIntake.Completed50Percent,
							isGamificationModalVisible: true,
						});
					}}
				/>

				<Button
					title="100 % buton"
					onPress={() => {
						this.setState({
							modalName: Gamification.WaterIntake.Completed100Percent,
							isGamificationModalVisible: true,
						});
					}}
				/>

				<Button
					title="Unlock 7 days"
					onPress={() => {
						this.setState({
							modalName: Gamification.WaterIntake.NextAchievement7Days,
							isGamificationModalVisible: true,
						});
					}}
				/>

				<Button
					title="7 days completed"
					onPress={() => {
						this.setState({
							modalName: Gamification.WaterIntake.Completed7DaysAchievement,
							isGamificationModalVisible: true,
						});
					}}
				/>

				<Button
					title="unlock 30 days"
					onPress={() => {
						this.setState({
							modalName: Gamification.WaterIntake.NextAchievement30Days,
							isGamificationModalVisible: true,
						});
					}}
				/>

				<Button
					title="30 days completed"
					onPress={() => {
						this.setState({
							modalName: Gamification.WaterIntake.Completed30DaysAchievement,
							isGamificationModalVisible: true,
						});
					}}
				/>

				<Button
					title="Quote Card"
					onPress={() => {
						this.setState({
							modalName: Gamification.QuoteModal,
							isGamificationModalVisible: true,
						});
					}}
				/>

				<Button
					title="Calorie Intake"
					onPress={() => {
						this.setState({
							modalName: Gamification.CalorieIntakeCompleteModal,
							isGamificationModalVisible: true,
						});
					}}
				/>

				<Button
					title="Missed Loading"
					onPress={() => {
						this.setState({
							modalName: Gamification.MissedLoadingModal,
							isGamificationModalVisible: true,
						});
					}}
				/>

				<Button
					title="Loading Phase"
					onPress={() => {
						this.props.navigation.navigate("LoadingWalkThrough");
					}}
				/>

				<Button
					title="Summary Phase"
					onPress={() => {
						this.setState({
							modalName: Gamification.LossSummaryModal,
							isGamificationModalVisible: true,
						});
					}}
				/>

				<Button
					title="View Cycle Summary"
					onPress={() => {
						this.setState({
							modalName: Gamification.ViewCycleSummaryPopup,
							isGamificationModalVisible: true,
						});
					}}
				/>

				<Button
					title="Bmi Loss Card"
					onPress={() => {
						this.setState({
							modalName: Gamification.RewardModal.BMIModal,
							isGamificationModalVisible: true,
						});
					}}
				/>

				<Button
					title="WtHR Loss Card"
					onPress={() => {
						this.setState({
							modalName: Gamification.RewardModal.WtHRModal,
							isGamificationModalVisible: true,
						});
					}}
				/>

				<Button
					title="Weight Loss Card"
					onPress={() => {
						this.setState({
							modalName: Gamification.RewardModal.WeightLossModal,
							isGamificationModalVisible: true,
						});
					}}
				/>

				<Button
					title="Appointment success"
					onPress={() => {
						this.setState({
							modalName: Gamification.Appointment.BookAppointment,
							isGamificationModalVisible: true,
						});
					}}
				/>

				<Button
					title="Appointment success"
					onPress={() => {
						this.setState({
							modalName: Gamification.Appointment.ConfirmAppointmentRequest,
							isGamificationModalVisible: true,
						});
					}}
				/>
			</View>
		);
	};
}

const HeaderView = (props) => (
	<View style={[R.AppStyles.headerContainer, styles.headerContainer]}>
		<View>
			<PageInfo info={strings("dashboard.pageInfo")} />
			<View style={{ flexDirection: "row", alignItems: "center" }}>
				<PageTitle title={strings("dashboard.pageTitle")} />
				<InfoButton onInfoClick={props.onInfoClick} />
			</View>
		</View>
		<View>
			<UserIcon
				initials={props.usernameInitials}
				onClick={props.onUserIconClick}
			/>

			{props.currentCycle > 1 && (
				<CycleIndicator
					intrinsicStyle={styles.indicatorStyle}
					textStyle={{ fontSize: 10, paddingHorizontal: 0 }}
					currentCycle={props.currentCycle || 1}
				/>
			)}
		</View>
	</View>
);

const InfoButton = (props) => (
	<TouchableOpacity onPress={props.onInfoClick}>
		<Image source={R.Images.info} style={styles.info} />
	</TouchableOpacity>
);

const RebootModal = (props) => (
	<Modal
		animationType="slide"
		transparent
		visible={props.isVisible}
		style={{ margin: 0 }}
	>
		<RebootDetails onCrossClicked={props.onClose} />
	</Modal>
);
