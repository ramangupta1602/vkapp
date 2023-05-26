import { observable } from 'mobx';

export class WaterIntakeLog {
  @observable waterIntake = '';
  @observable date = '';
  @observable waterIntakeUnit = 0;

  constructor(waterIntake, date, waterIntakeUnit) {
    this.waterIntake = waterIntake;
    this.date = date;
    this.waterIntakeUnit = waterIntakeUnit;
  }
}
