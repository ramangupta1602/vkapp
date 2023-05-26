import { observable, computed, action } from "mobx";
import { persist } from "mobx-persist";
import { HeightWeightUtil } from "Library/Utils/HeightWeightUtil";
import moment from "moment";
import * as DateUtil from "../Library/Utils/DateUtil";
import { LoginUserStore } from "./LoginUserStore";

export class UserAccountStore {
	loginStore = new LoginUserStore();

	@persist @observable username = "";
	@persist @observable firstName = "";
	@persist @observable middleName = "";
	@persist @observable lastName = "";
	@persist @observable gender = "";
	@persist @observable dob = "";
	@persist @observable email = "";
	@persist @observable phoneNumber = "";

	@persist @observable height = 0;
	@persist @observable heightUnit = 0;
	@persist @observable targetWeight = 0;
	@persist @observable weightUnit = 0;
	@persist @observable phase = 0;
	@persist @observable losingPhaseStartDate = null;

	@persist @observable programStartDate = "";
	@persist @observable programEndDate = "";
	@persist @observable cycleHistory = "[]";

	// Key related to app versioning feature.
	@persist @observable lastPromptShownForVersion = "0.0.0";
	@persist @observable lastVersionSynced = "0.0.0";
	@persist @observable lastControlVersion = 0;
	@observable shouldShowUpdateAvailableCard = false;

	// Reboot feature
	@persist @observable currentCycle = 1;
	@persist @observable lastAcceptedCycle = 1;
	@persist @observable cycleStartDate = "1990-01-01";
	@persist @observable lastLoggedWeight = null;
	@persist @observable lastLoggedWeightUnit = null;
	@persist("object") @observable lastLoggedBodyMeasurement = null;

	// View Cycle Summary Popup
	@persist @observable shouldShowSummaryPopup = true;
	@persist @observable summaryPopupShownForCycle = 0;
	@persist @observable summaryPopupScheduledDate = "1990-01-01";

	// Appointment popup
	@persist @observable hasShownAppointmentGuidelinePopup = false;

	constructor(loginStore) {
		this.loginStore = loginStore;
	}

	@computed get initials() {
		return this.fullName
			.split(" ")
			.map((n) => n[0])
			.join("");
	}

	@computed get fullName() {
		if (this.middleName) {
			return `${this.firstName} ${this.middleName} ${this.lastName}`;
		}
		return `${this.firstName} ${this.lastName}`;
	}

	@computed get displayTargetWeight() {
		return HeightWeightUtil.displayWeight(
			this.targetWeight,
			this.weightUnit,
			this.loginStore.displayWeightUnit,
		);
	}

	@computed get displayHeight() {
		return HeightWeightUtil.displayHeight(
			this.height,
			this.heightUnit,
			this.loginStore.displayHeightUnit,
		);
	}

	@computed get losingStartDate() {
		if (this.losingPhaseStartDate) {
			return this.losingPhaseStartDate;
		} else {
			return this.programStartDate;
		}
	}

	@computed get displayHeightWithUnit() {
		const convertedHeight = this.displayHeight;
		const finalHeight = convertedHeight ? convertedHeight.toFixed(1) : 0;
		return HeightWeightUtil.formattedHeightText(
			finalHeight,
			this.loginStore.displayHeightUnit,
		);
	}

	@computed get hasProgramCompleted() {
		const hasProgramCompleted =
			DateUtil.absoluteDifferenceFromToday(this.programEndDate) > 0;

		console.log(
			"date diff is",
			DateUtil.absoluteDifferenceFromToday(this.programEndDate),
		);

		return hasProgramCompleted;
	}

	hasProgramCompletedFunction() {
		const hasProgramCompleted =
			DateUtil.absoluteDifferenceFromToday(this.programEndDate) > 0;

		return hasProgramCompleted;
	}

	/**
	 * It return appropriate program start date,
	 * when phase is > 1 then cycle start date else
	 * it return program start date.
	 */
	@computed get startDate() {
		if (this.currentCycle > 1) {
			return this.cycleStartDate;
		}
		return this.programStartDate;
	}

	@computed get age() {
		const millis = Date.now() - Date.parse(this.dob);
		const age = new Date(millis).getFullYear() - 1970;
		return age;
	}

	@computed get displayAge() {
		const age = this.age;
		if (age == 1) {
			return "1 year";
		}
		return `${age} years`;
	}

	@computed get cmHeight() {
		return HeightWeightUtil.displayHeight(
			this.height,
			this.heightUnit,
			HeightWeightUtil.HEIGHT_CM,
		);
	}

	bmi(weightLog) {
		const w = weightLog.displayWeight(HeightWeightUtil.WEIGHT_KG);
		const height = this.cmHeight / 100;
		const bmi = w / (height * height);
		return bmi.toFixed(1);
	}

	weekInProgram() {
		const today = moment().startOf("day");
		const programStartDateM = moment(this.losingStartDate).startOf("day");
		const numberOfDays = today.diff(programStartDateM, "days");
		const weeks = numberOfDays / 7 + 1;
		return parseInt(weeks);
	}

	weekInProgramOnDate(date) {
		const today = moment(date).startOf("day");
		const programStartDateM = moment(this.losingStartDate).startOf("day");
		const numberOfDays = today.diff(programStartDateM, "days");
		const weeks = numberOfDays / 7 + 1;
		return parseInt(weeks);
	}

	@action setAppointmentGuidelineShown() {
		this.hasShownAppointmentGuidelinePopup = true;
	}

	@action setUserData(details) {
		if (details == null) {
			return;
		}
		this.firstName = details.firstName;
		this.middleName = details.middleName;
		this.lastName = details.lastName;
		this.username = details.userId;
		this.gender = details.gender;
		this.status = details.status;
		this.dob = details.dob;
		this.email = details.email;
		this.phoneNumber = details.phoneNumber;
		this.targetWeight = details.targetWeight;
		this.weightUnit = details.weightUnit;
		this.height = details.height;
		this.heightUnit = details.heightUnit;
		this.programStartDate = details.programStartDate;
		this.programEndDate = details.programEndDate;
		this.phase = details.phase || 0;

		if (details.losingPhaseStartDate) {
			this.losingPhaseStartDate = details.losingPhaseStartDate;
		} else {
			this.losingPhaseStartDate = details.programStartDate;
		}

		const {
			currentCycle = 1,
			lastAcceptedCycle = 1,
			cycleStartDate = this.programStartDate,
			cycleHistory = "",
		} = details;

		this.currentCycle = currentCycle || 1;
		this.lastAcceptedCycle = lastAcceptedCycle || 1;
		this.cycleStartDate = cycleStartDate || this.programStartDate;
		this.cycleHistory = cycleHistory || "";
	}

	@computed get cycleHistoryData() {
		if (!this.cycleHistory) {
			return [];
		}

		if (this.cycleHistory.length === 0) {
			return [];
		}

		return JSON.parse(this.cycleHistory);
	}

	@action setProgramDates(details) {
		if (details == null) {
			return;
		}
		this.programStartDate = details.programStartDate;
		this.programEndDate = details.programEndDate;

		if (details.losingPhaseStartDate === null) {
			this.losingPhaseStartDate = this.programStartDate;
		}
	}

	@action setLastPromptVersion(version) {
		this.lastPromptShownForVersion = version;
	}

	@action setShowUpdateAvailableCard(shouldShow) {
		this.shouldShowUpdateAvailableCard = shouldShow;
	}

	@action setProgramStartDate(date) {
		this.programStartDate = date;
	}

	@action setCycleStartDate(date) {
		this.cycleStartDate = date;
	}

	@action setLastAcceptedCycle(cycle) {
		this.lastAcceptedCycle = cycle;
	}

	@action setCurrentCycle(cycle) {
		this.currentCycle = cycle;
	}

	@action setProgramEndDate(date) {
		this.programEndDate = date;
	}

	@action updatePhase(phase) {
		this.phase = phase;
	}

	@action updateLosingPhaseStartDate(date) {
		this.losingPhaseStartDate = date;
	}

	@action setLastLoggedWeight(weightLog) {
		if (weightLog == null) {
			return;
		}
		this.lastLoggedWeight = weightLog.weight;
		this.lastLoggedWeightUnit = weightLog.weightUnit;
	}

	@action setLastLoggedBM(bodyMeasurementLog) {
		if (bodyMeasurementLog == null) {
			return;
		}
		this.lastLoggedBodyMeasurement = bodyMeasurementLog;
	}

	@action setShowCycleSummaryFlag(hasShown, cycle) {
		this.shouldShowSummaryPopup = hasShown;
		this.summaryPopupShownForCycle = cycle;
	}

	@action setSummaryPopupScheduleDate(date) {
		this.summaryPopupScheduledDate = date;
		this.shouldShowSummaryPopup = true;
	}

	@action setLastSyncedVersion(version) {
		this.lastVersionSynced = version;
	}

	@action clearData() {
		this.firstName = "";
		this.middleName = "";
		this.lastName = "";
		this.username = "";
		this.gender = "";
		this.dob = "";
		this.email = "";
		this.phoneNumber = "";
		this.targetWeight = 0;
		this.weightUnit = 0;
		this.height = 0;
		this.heightUnit = 0;

		this.lastPromptShownForVersion = "0.0.0";
		this.lastVersionSynced = "0.0.0";
		this.lastControlVersion = 0;

		this.phase = 0;
		this.losingPhaseStartDate = null;

		this.currentCycle = 1;
		this.lastAcceptedCycle = 1;
		this.cycleStartDate = "1990-01-01";
		this.cycleHistory = "";
		this.lastLoggedWeight = null;
		this.lastLoggedWeightUnit = 0;
		this.lastLoggedBodyMeasurement = null;
		this.shouldShowSummaryPopup = true;
		this.summaryPopupShownForCycle = 0;
		this.summaryPopupScheduledDate = "1990-01-01";
	}

	@action setPatientUpdatedDetails(details) {
		if (details) {
			this.firstName = details.firstName;
			this.lastName = details.lastName;
			this.email = details.email;
			this.gender = details.gender;
			this.programStartDate = details.programStartDate;
		}
	}
}
