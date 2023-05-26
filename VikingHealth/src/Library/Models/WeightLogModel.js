import { observable } from "mobx";
import { HeightWeightUtil } from "Library/Utils/HeightWeightUtil";

export class WeightLog {
  @observable weight = "";
  @observable date = "";
  @observable weightUnit = 1;

  constructor(weight, date, weightUnit) {
    this.weight = weight;
    this.date = date;
    this.weightUnit = weightUnit;
  }

  displayWeight(unit) {
    return HeightWeightUtil.displayWeight(this.weight, this.weightUnit, unit);
  }
}
