/* eslint-disable no-else-return */
import React, { Component } from "react";
import { Query } from "react-apollo";
import * as UserQueries from "AppSyncQueries/UserQueries";
import * as AppointmentQueries from "../../../AppSyncQueries/AppointmentQueries";
import {
	View,
	TouchableOpacity,
	Image,
	Alert,
	Platform,
	Linking,
	AsyncStorage,
} from "react-native";
import {
	PageTitle,
	PageInfo,
	TabStyling,
	FloatingButton,
	UserIcon,
} from "Components";
import { styles } from "./Styles";
import { R } from "Resources";
import { ListOfPatients } from "./ListOfPatients";
import { STATUS_USER } from "Library/Constants";
import { EmptyState } from "./EmptyState";
import { inject, observer } from "mobx-react";
import AppVersoning from "./../../../Components/AppVersionCheck/AppVersionCheck";
import AdminBottomBar from "./AdminBottomBar/AdminBottomBar";
import {
	AsyncStoreKeys,
	saveDataWithKey,
	getDataWithKey,
} from "../../../utility/AsyncStoreUtil";
import { Auth } from "aws-amplify";
import AppUtil from "../../../Library/Utils/AppUtil";
import store from "react-native-simple-store";

@inject("userAccountStore", "loginUserStore")
@observer
export class AdminDashboard extends Component {
	static navigationOptions = { header: null };

	constructor(props) {
		super(props);

		this.state = {
			query: STATUS_USER.ACTIVE,
			isDataLoading: true,
			appointmentCount: {
				UPCOMING: -1,
				PENDING: -1,
				COMPLETED: -1,
			},
		};

		this.currentAppointmentCountData = {
			UPCOMING: 0,
			PENDING: 0,
			COMPLETED: 0,
		};
	}

	async componentDidMount() {
		//this.checkForAppVersion();

		getDataWithKey(AsyncStoreKeys.APPOINTMENT_COUNT, {
			UPCOMING: -1,
			PENDING: -1,
			COMPLETED: -1,
		}).then((appointmentCount) => {
			this.setState({ appointmentCount });
		});

		this.focusListener = this.props.navigation.addListener("didFocus", () => {
			this.checkAppointmentCount();

			const appVersionCheck = new AppVersoning(
				this.props.userAccountStore,
				this.props.loginUserStore,
			);
			appVersionCheck.checkAppVersion();
		});
	}

	checkForAppVersion = () => {
		this.fetchAppVersion().then((appVersion) => {
			console.log("app version is", appVersion);
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
			console.log("error is", error);
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
				console.log("signed out");
				this.props.navigation.dispatch(AppUtil.resetAction("Login", {}));

				setTimeout(() => {
					this.clearStores();
				}, 100);
			})
			.catch((err) => Alert.alert(strings("common_message.error"), err));
	};

	clearStores() {
		this.props.loginUserStore.clear();
		this.props.userAccountStore.clearData();
		store.delete("cancelDate");
	}

	checkAppointmentCount = async () => {
		const appointmentCount = await getDataWithKey(
			AsyncStoreKeys.APPOINTMENT_COUNT,
			{
				UPCOMING: -1,
				PENDING: -1,
				COMPLETED: -1,
			},
		);

		this.setState({ appointmentCount });
	};

	onTabChange(index) {
		if (index === 0) {
			this.setState({ query: STATUS_USER.ACTIVE, isDataLoading: true });
		} else if (index === 1) {
			this.setState({ query: STATUS_USER.COMPLETED, isDataLoading: true });
		} else if (index === 2) {
			this.setState({ query: STATUS_USER.INVITED, isDataLoading: true });
		}
	}

	createPatient = () => {
		this.props.navigation.navigate("CreateNewUser");
	};

	goToProfile() {
		this.props.navigation.navigate("Profile");
	}
	onSearch() {
		this.props.navigation.navigate("SearchPatient");
	}

	goToStore() {
		if (Platform.OS === "ios") {
			Linking.openURL(
				"https://apps.apple.com/us/app/viking-health/id1456404647",
			);
		} else {
			Linking.openURL(
				"https://play.google.com/store/apps/details?id=com.vikinghealth&hl=en",
			);
		}
	}

	render() {
		const { shouldShowUpdateAvailableCard } = this.props.userAccountStore;
		const { appointmentCount } = this.state;

		if (shouldShowUpdateAvailableCard) {
			this.props.userAccountStore.setShowUpdateAvailableCard(false);

			Alert.alert(
				"Update Available",
				"An update to Viking Health is available. Would you like to update?",
				[
					{
						text: "Not now",
						onPress: () => {},
					},

					{
						text: "Go To Store",
						onPress: () => this.goToStore(),
					},
				],
			);
		}

		return (
			<View style={styles.container}>
				<HeaderView
					usernameInitials={this.props.loginUserStore.initials}
					onUserIconClick={this.goToProfile.bind(this)}
					onTabChange={this.onTabChange.bind(this)}
					onSearchIconClick={this.onSearch.bind(this)}
				/>
				<View style={{ marginTop: 20, flex: 1 }}>
					<PatientListView
						listType={this.state.query}
						navigation={this.props.navigation}
						onInviteNewPatient={this.createPatient}
						onAddPatientClick={this.createPatient}
					/>
				</View>

				<Query
					query={AppointmentQueries.GetAppointmentsCount}
					variables={{
						appointmentDetails: JSON.stringify({
							appointment: {
								statusCategory: ["UPCOMING", "PENDING", "COMPLETED"],
								patientId: null,
							},
						}),
					}}
					onCompleted={(data) => {}}
					fetchPolicy="cache-and-network"
				>
					{({ data }) => {
						if (data && data.getAppointmentCategoryCount) {
							{
								const countData = JSON.parse(data.getAppointmentCategoryCount);

								const {
									result: { UPCOMING = 0, PENDING = 0, COMPLETED = 0 },
								} = JSON.parse(countData.body);

								this.currentAppointmentCountData = {
									UPCOMING,
									PENDING,
									COMPLETED,
								};
							}
						}

						return (
							<AdminBottomBar
								previousCount={appointmentCount}
								currentCount={this.currentAppointmentCountData}
							/>
						);
					}}
				</Query>
			</View>
		);
	}
}

const HeaderView = (props) => (
	<View style={styles.background}>
		<View style={styles.headerContainer}>
			<View>
				<View style={{ marginVertical: 4 }}>
					<PageInfo info={"Weight Loss Program"} />
				</View>
				<PageTitle title={"Patients"} />
			</View>
			<View style={styles.searchIconHeader}>
				<TouchableOpacity onPress={props.onSearchIconClick}>
					<Image
						source={R.Images.searchIcon}
						style={{ resizeMode: "contain", height: 20, width: 20 }}
					/>
				</TouchableOpacity>

				<UserIcon
					initials={props.usernameInitials}
					onClick={props.onUserIconClick}
				/>
			</View>
		</View>

		<TabStyling onClick={props.onTabChange} />
	</View>
);

const PatientListView = (props) => {
	const queryVariables = {
		limit: 10,
		nextToken: null,
		type: props.listType,
	};

	return (
		<Query
			query={UserQueries.PatientList}
			variables={queryVariables}
			fetchPolicy="cache-and-network"
		>
			{({ data, fetchMore, loading }) => {
				if (
					data &&
					data.patientsList &&
					data.patientsList.patients &&
					!(data.patientsList.patients.length === 0)
				) {
					const patientsData = data;
					return (
						<React.Fragment>
							<ListOfPatients
								navigate={props.navigation.navigate}
								data={patientsData.patientsList.patients || []}
								token={data.patientsList.nextToken}
								onLoadMore={(token) =>
									fetchMore({
										variables: {
											nextToken: token,
										},
										updateQuery: (prev, { fetchMoreResult }) => {
											if (!fetchMoreResult) return prev;
											patientsData.patientsList.nextToken =
												fetchMoreResult.patientsList.nextToken;

											const obj = {
												patients: [
													...prev.patientsList.patients,
													...fetchMoreResult.patientsList.patients.filter(
														(n) =>
															!prev.patientsList.patients.some(
																(p) => p.userId === n.userId,
															),
													),
												],
											};
											patientsData.patientsList.patients = obj.patients;
											return patientsData;
										},
									})
								}
							/>
							{/* <FloatingButton
                onClick={props.onAddPatientClick}
                image={R.Images.floatingButton}
              /> */}
						</React.Fragment>
					);
				} else {
					return (
						<React.Fragment>
							<EmptyState
								query={props.listType}
								onClick={props.onInviteNewPatient}
							/>
							{props.listType !== STATUS_USER.INVITED && (
								<FloatingButton
									onClick={props.onAddPatientClick}
									image={R.Images.floatingButton}
								/>
							)}
						</React.Fragment>
					);
				}
			}}
		</Query>
	);
};
