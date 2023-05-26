import { observable } from "mobx";
import { HeightWeightUtil } from "Library/Utils/HeightWeightUtil";

export class BodyMeasurementModel {
  @observable date = "";
  @observable unit = 1;
  @observable neck = 0;
  @observable chest = 0;
  @observable shoulder = 0;
  @observable arms = 0;
  @observable waist = 0;
  @observable hips = 0;
  @observable thighs = 0;
  @observable calf = 0;
  @observable week = "";

  constructor(measurements) {
    this.date = measurements.date;
    this.unit = measurements.unit;
    this.neck = measurements.neck;
    this.chest = measurements.chest;
    this.shoulder = measurements.shoulder;
    this.arms = measurements.arms;
    this.waist = measurements.waist;
    this.hips = measurements.hips;
    this.thighs = measurements.thighs;
    this.calf = measurements.calf;
    this.week = measurements.week;
  }

  displayNeck(unit, decimalPlaces = 1) {
    return this.displayValue(this.neck, unit, decimalPlaces);
  }

  displayChest(unit, decimalPlaces = 1) {
    return this.displayValue(this.chest, unit, decimalPlaces);
  }

  displayShoulder(unit, decimalPlaces = 1) {
    return this.displayValue(this.shoulder, unit, decimalPlaces);
  }

  displayArms(unit, decimalPlaces = 1) {
    return this.displayValue(this.arms, unit, decimalPlaces);
  }

  displayWaist(unit, decimalPlaces = 1) {
    return this.displayValue(this.waist, unit, decimalPlaces);
  }

  displayHips(unit, decimalPlaces = 1) {
    return this.displayValue(this.hips, unit, decimalPlaces);
  }

  displayThighs(unit, decimalPlaces = 1) {
    return this.displayValue(this.thighs, unit, decimalPlaces);
  }

  displayCalf(unit, decimalPlaces = 1) {
    return this.displayValue(this.calf, unit, decimalPlaces);
  }

  displayValueForIndex(index, unit, decimalPlaces = 1) {
    let value = undefined;
    switch (index) {
      case 0:
        value = this.displayNeck(unit, decimalPlaces);
        break;
      case 1:
        value = this.displayShoulder(unit, decimalPlaces);
        break;
      case 2:
        value = this.displayChest(unit, decimalPlaces);
        break;
      case 3:
        value = this.displayArms(unit, decimalPlaces);
        break;
      case 4:
        value = this.displayWaist(unit, decimalPlaces);
        break;
      case 5:
        value = this.displayHips(unit, decimalPlaces);
        break;
      case 6:
        value = this.displayThighs(unit, decimalPlaces);
        break;
      case 7:
        value = this.displayCalf(unit, decimalPlaces);
        break;
      default:
        value = 0;
        break;
    }
    return value;
  }

  displayValue(value, unit, decimalPlaces = 1) {
    if (unit === this.unit) {
      //If unit of this body measurement log and unit in users setting is same, return measurment without any calculation
      return value;
    }
    if (unit === HeightWeightUtil.HEIGHT_IN) {
      return parseFloat(
        HeightWeightUtil.inchValue(value).toFixed(decimalPlaces)
      );
    }
    return parseFloat(HeightWeightUtil.cmValue(value).toFixed(decimalPlaces));
  }
}
