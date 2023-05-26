import React, { Component } from "react";
import { View, Text, Alert, StyleSheet } from "react-native";
import { strings } from "../../utility/locales/i18n";
import { withNavigation } from "react-navigation";
import { inject, observer } from "mobx-react";
import { checkInternetConnection } from "react-native-offline";
import { appsyncClient } from "../../../App";
import * as BodyMeasurementQueries from "AppSyncQueries/BodyMeasurementQueries";
import * as WeightLogQueries from "AppSyncQueries/WeightLogQueries";
import * as WaterIntakeQueries from "AppSyncQueries/WaterIntakeLogQueries";
import { ProgressBarButton } from "../../Components";
import { ButtonState } from "../CTAButton/ButtonState";
import * as DateUtil from "./../../Library/Utils/DateUtil";
import moment from "moment";

export function calculateWaterLogSummary(
	data,
	loginUserStore,
	userAccountStore,
) {
	{
		const unit = loginUserStore.displayWaterIntakeUnit
			? loginUserStore.displayWaterIntakeUnit
			: 0;

		const { startDate: programStartDate, programEndDate } = userAccountStore;

		const sDate = moment(programStartDate);
		const eDate = moment(programEndDate);
		const today = moment();

		const diffBetweenTodayAndEnd = today.diff(eDate, "d");

		const lastDayOfCycle = diffBetweenTodayAndEnd > 0 ? eDate : today;

		let noOfDaysInProgram = lastDayOfCycle.diff(sDate, "d") + 1;

		// Not possible in real case but in testing it will case crash when noOfDays = 0 i.e, startDate
		// is 1 less than program end date also it is negative it will not make sense.
		if (noOfDaysInProgram < 1) {
			noOfDaysInProgram = 1;
		}

		if (!(data && data.waterIntakeLogs)) {
			return {
				averageWaterIntake: 0,
				dailyBadgeCount: 0,
				weeklyBadgeCount: 0,
				monthlyBadgeCount: 0,
				waterIntakeUnit: unit,
			};
		}

		const { waterIntakeLogs } = data;

		let totalIntake = 0;
		let dailyBadgeCount = 0;
		let weeklyBadgeCount = 0;
		let monthlyBadgeCount = 0;

		waterIntakeLogs.forEach((log) => {
			const { waterIntake, badgeType = 0 } = log;

			totalIntake += waterIntake;

			switch (badgeType) {
				case 1:
					++dailyBadgeCount;
					break;
				case 7:
					++weeklyBadgeCount;
					break;
				case 30:
					++monthlyBadgeCount;
					break;
				default: // no op
			}
		});

		const avgIntake = totalIntake / noOfDaysInProgram;
		const averageWaterIntake = Math.round(avgIntake);

		return {
			averageWaterIntake,
			dailyBadgeCount,
			weeklyBadgeCount,
			monthlyBadgeCount,
			waterIntakeUnit: unit,
		};
	}
}

export function getBMRecord(data) {
	if (!data) {
		return {
			unit: 0,
			neck: 0,
			shoulder: 0,
			chest: 0,
			arms: 0,
			waist: 0,
			hips: 0,
			thighs: 0,
			calf: 0,
		};
	}

	const {
		unit = 0,
		neck = 0,
		shoulder = 0,
		chest = 0,
		arms = 0,
		waist = 0,
		hips = 0,
		thighs = 0,
		calf = 0,
	} = data;

	return { unit, neck, shoulder, chest, arms, waist, hips, thighs, calf };
}

export function getWeightRecord(data) {
	if (!data) {
		return { weight: 0, weightUnit: 0 };
	}

	const { weight = 0, weightUnit = 0 } = data;
	return { weight, weightUnit };
}

export function getHistoryDataObject(
	data,
	userAccountStore,
	shouldIncludeCurrentCycle = true,
) {
	const currentCycleHistory = userAccountStore.cycleHistoryData;
	const {
		cycleStartDate,
		losingPhaseStartDate,
		programEndDate,
	} = userAccountStore;

	const initialBM = getBMRecord(data.initialBodyMeasurementLog);
	const lastBM = getBMRecord(data.lastBodyMeasurement);

	// if reload cycle is initiated before end date, in that case, we will put end date = today,
	// if reload cycle is initiated after end date, in that case, we will use original end date.
	const dateDiff = DateUtil.absoluteDifferenceFromToday(programEndDate);
	const todayDate = DateUtil.formattedTodayDate();
	const endDate = dateDiff > 0 ? programEndDate : todayDate;

	const newRecord = {};
	newRecord.startDate = cycleStartDate;
	newRecord.losingPhaseStartDate = losingPhaseStartDate;
	newRecord.endDate = endDate;
	newRecord.initialBM = initialBM;
	newRecord.lastRecordedBM = lastBM;
	newRecord.initialWeight = getWeightRecord(data.initialWeightLog);
	newRecord.lastRecordedWeight = getWeightRecord(data.lastWeightLog);
	newRecord.waterIntakeSummary = data.waterIntakeSummary;

	if (shouldIncludeCurrentCycle) {
		return [...currentCycleHistory, newRecord];
	}

	return [...currentCycleHistory];
}

@observer
@inject("userAccountStore", "loginUserStore", "gamificationStore")
class ReloadConfirmationModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
		};
	}

	onStartProgramClicked = async () => {
		const isConnected = await checkInternetConnection();

		if (isConnected) {
			const data = await this.loadHistoryData();
			return data;
		} else {
			this.setState({ loading: false });
			Alert.alert(
				"No Internet Connection",
				"It seems there is some problem with your internet connection. Please check and try again.",
			);
		}
	};

	loadHistoryData = async () => {
		const {
			username: userId,
			startDate: programStartDate,
			programEndDate,
		} = this.props.userAccountStore;

		try {
			// Fetching body measurement logs........................................
			const bodyMeasurementLog = await appsyncClient.query({
				query: BodyMeasurementQueries.BodyMeasurementHistoryData,
				fetchPolicy: "network-only",
				variables: {
					userId,
					fromDate: programStartDate,
					toDate: programEndDate,
				},
			});

			// Fetching weight logs ................................................
			const weightLogs = await appsyncClient.query({
				query: WeightLogQueries.WeightLogsForPatientsFromDate,
				fetchPolicy: "network-only",
				variables: {
					userId,
					fromDate: programStartDate,
					toDate: programEndDate,
				},
			});

			// Fetching water logs ..................................................
			const waterLogs = await appsyncClient.query({
				query: WaterIntakeQueries.GetWaterIntakeLogs,
				fetchPolicy: "network-only",
				variables: {
					userId,
					fromDate: programStartDate,
					toDate: programEndDate,
				},
			});

			const {
				data: { initialWeightLogFromDate = {}, lastWeightLog = {} },
			} = weightLogs;

			const {
				data: {
					lastBodyMeasurement = {},
					initialBodyMeasurementLogFromDate = {},
				},
			} = bodyMeasurementLog;

			// Calculating water intake summary data
			const waterIntakeSummary = calculateWaterLogSummary(
				waterLogs.data,
				this.props.loginUserStore,
				this.props.userAccountStore,
			);

			return {
				initialBodyMeasurementLog: initialBodyMeasurementLogFromDate,
				lastBodyMeasurement,
				initialWeightLog: initialWeightLogFromDate,
				lastWeightLog,
				waterIntakeSummary,
			};
		} catch (e) {
			return false;
		}
	};

	render() {
		const buttonState = this.state.loading
			? ButtonState.Progress
			: ButtonState.Idle;

		return (
			<View style={[localStyle.containerStyle]}>
				<Text style={[localStyle.titleStyle]}>
					{strings("reloadConfirmationModal.title")}
				</Text>

				<Text style={[localStyle.messageStyle]}>
					{strings("reloadConfirmationModal.message")}
				</Text>

				<ProgressBarButton
					buttonState={buttonState}
					label={strings("reloadConfirmationModal.start")}
					style={[localStyle.progressBarStyle]}
					textColor="red"
					textStyle={[localStyle.startTextStyle]}
					progressColor="red"
					onClick={() => {
						this.setState({ loading: true });
						this.onStartProgramClicked()
							.then((data) => {
								const newRecordData = getHistoryDataObject(
									data,
									this.props.userAccountStore,
								);
								this.props.onClick(newRecordData);
							})
							.catch((error) => console.log("error is", error));
					}}
				/>

				<Text
					style={[localStyle.cancelTextStyle]}
					onPress={this.props.onCancel}
				>
					{strings("reloadConfirmationModal.cancel")}
				</Text>
			</View>
		);
	}
}

const localStyle = StyleSheet.create({
	containerStyle: {
		paddingHorizontal: 22,
		paddingVertical: 32,
		backgroundColor: "white",
		borderRadius: 10,
	},

	titleStyle: {
		color: "#024481",
		fontFamily: "Lato-Semibold",
		fontSize: 24,
		fontWeight: "600",
		letterSpacing: 0.77,
		lineHeight: 29,
		textAlign: "center",
	},

	messageStyle: {
		color: "#024481",
		fontFamily: "Lato-Regular",
		fontSize: 16,
		letterSpacing: 0.48,
		lineHeight: 20,
		textAlign: "center",
		marginTop: 8,
	},

	progressBarStyle: {
		backgroundColor: "white",
		borderWidth: 0,
		marginTop: 10,
	},

	startTextStyle: {
		color: "#CE363E",
		fontFamily: "Lato-Bold",
		fontSize: 14,
		fontWeight: "bold",
		lineHeight: 50,
		textTransform: "uppercase",
		textAlign: "center",
	},

	cancelTextStyle: {
		color: "#D0444C",
		fontFamily: "Lato-Medium",
		fontSize: 14,
		paddingVertical: 10,
		marginTop: 0,
		fontWeight: "500",
		lineHeight: 17,
		textAlign: "center",
	},

	/**
.cancel {
	height: 17px;
	width: 42px;
	color: #D0444C;
	font-family: Lato;
	font-size: 14px;
	font-weight: 500;
	line-height: 17px;
}
  */
});

export default withNavigation(ReloadConfirmationModal);
