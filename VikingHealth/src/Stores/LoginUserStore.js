import { observable, computed, action } from "mobx";
import { persist } from "mobx-persist";
import { USER_ONBOARDING_STEP, USER_TYPE } from "Library/Constants";
import { HeightWeightUtil } from "Library/Utils/HeightWeightUtil";

export class LoginUserStore {
  @persist("object") @observable user = null;
  @persist @observable userId = null;
  @persist @observable onboardingStep = USER_ONBOARDING_STEP.LOGGED_OUT;
  @persist @observable userType = USER_TYPE.PATIENT;
  @persist @observable firstName = "";
  @persist @observable lastName = "";
  @persist @observable displayWeightUnit = 0;
  @persist @observable displayHeightUnit = 0;
  @persist @observable displayWaterIntakeUnit = 0;
  @persist @observable targetWaterIntakeLevel = 0;

  constructor() {}

  @computed get initials() {
    return this.fullName
      .split(" ")
      .map(n => n[0])
      .join("");
  }

  @computed get fullName() {
    // return `${this.firstName} ${this.lastName}`;

    if (this.middleName) {
      return `${this.firstName} ${this.middleName} ${this.lastName}`;
    }
    return `${this.firstName}  ${this.lastName}`;
  }

  @action setOnboardingStep(step) {
    this.onboardingStep = step;
  }

  @action setUser(user) {
    this.user = user;
    this.userId = user.username;
    const userType =
      user.signInUserSession.idToken.payload["cognito:groups"][0];
    if (userType && userType === "Patients") {
      this.userType = USER_TYPE.PATIENT;
    } else {
      this.userType = USER_TYPE.ADMIN;
    }
  }

  @action setUserName(fName, Lname) {
    this.firstName = fName;
    this.lastName = Lname;
  }

  @action setDisplayWeightUnit(unit) {
    this.displayWeightUnit = unit;
  }

  @action setDisplayHeightUnit(unit) {
    this.displayHeightUnit = unit;
  }

  @action setDisplayWaterIntakeUnit(unit) {
    this.displayWaterIntakeUnit = unit;
  }

  @action setTargetWaterLevel(level) {
    this.targetWaterIntakeLevel = level;
  }

  @computed get getTargetWaterIntake() {
    return Math.ceil(this.targetWaterIntakeLevel.toFixed(0) / 10) * 10;
  }

  @computed get heightUnitText() {
    return HeightWeightUtil.heightUnit(this.displayHeightUnit);
  }

  @computed get humanisedWaterIntake() {
    const targetWaterIntake = this.getTargetWaterIntake;

    const waterIntake =
      this.displayWaterIntakeUnit === HeightWeightUtil.WATER_FLOZ
        ? targetWaterIntake
        : HeightWeightUtil.litreValue(targetWaterIntake).toFixed(2);

    const unit = HeightWeightUtil.waterBigUnit(this.displayWaterIntakeUnit);

    return `${waterIntake}${unit}`;
  }

  @computed get weightUnitText() {
    return HeightWeightUtil.weightUnit(this.displayWeightUnit);
  }

  @computed get waterIntakeUnitText() {
    return HeightWeightUtil.waterIntakeUnit(this.displayWaterIntakeUnit);
  }

  @action clear() {
    this.user = null;
    this.userId = null;
    this.firstName = null;
    this.lastName = null;
    this.onboardingStep = USER_ONBOARDING_STEP.LOGGED_OUT;
    this.userType = USER_TYPE.PATIENT;
  }
}
