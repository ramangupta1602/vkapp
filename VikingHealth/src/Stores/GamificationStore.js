import { observable, action } from "mobx";
import { persist } from "mobx-persist";
import * as DateUtil from "../Library/Utils/DateUtil";
import { Gamification } from "../utility/constants/Constants";

export class GamificationStore {
  @persist @observable lastCompletedWIGoalDate = "1990-01-01";
  @persist @observable lastRemainderShowOn = "1990-01-01";
  @persist @observable lastCalorieIntakeShownOn = "1990-01-01";
  @persist @observable waterIntakeConsDays = 0;
  @persist @observable isCardShownForFirstTime = false;
  @persist @observable modalName = "";
  @persist @observable shouldShowLoadingInstruction = true;

  // setting it past day, because empty string return in current date and time
  // so card will not show on the first day, when date is empty
  @persist @observable completed50PercentLastShownOn = "1990-01-01";
  @persist @observable completed100PercentLastShownOn = "1990-01-01";
  @persist @observable completed7DayLastShownOn = "1990-01-01";
  @persist @observable summaryModalLastShownOn = "1990-01-01";

  @observable showModalFlag = false;

  constructor() {}

  @action setShowModalFlag(flag, modalName) {
    this.showModalFlag = flag;
    this.modalName = modalName;
  }

  // this function will either return false (if we don't have to show it) or retutn the
  // modal name (which is previous set)
  shouldShowModal() {
    // if show modal flag is not set, the simply return false
    if (!this.showModalFlag) {
      return false;
    }

    // setting it false, because after return it will re-render it again,
    // and will throw error..
    this.showModalFlag = false;

    // here we check for modalName,
    switch (this.modalName) {
      case Gamification.WaterIntake.Completed50Percent:
        return this.shouldShow50Percent();

      case Gamification.WaterIntake.Completed100Percent:
        return this.shouldShow100Percent();

      case Gamification.CalorieIntakeCompleteModal:
        return this.shouldShowCalorieModal();

      // by default retur all the true....
      default:
        return this.modalName;
    }
  }

  // if has to show then return modalName or else return
  // false
  shouldShow50Percent() {
    // if 50% reward is shown, then don't show it again
    if (DateUtil.isTodayDate(this.completed50PercentLastShownOn)) {
      return false;
    }

    // set the last shown date as today, because returning it here means, it will
    // be shown. this will reduce the effor to handle it on dashboard and on detail
    //page

    this.completed50PercentLastShownOn = DateUtil.formattedTodayDate();
    return this.modalName;
  }

  // if has to show then return modalName or else return
  // false
  shouldShow100Percent() {
    if (DateUtil.isTodayDate(this.completed100PercentLastShownOn)) {
      return false;
    }

    this.completed50PercentLastShownOn = DateUtil.formattedTodayDate();
    this.completed100PercentLastShownOn = DateUtil.formattedTodayDate();
    return this.modalName;
  }

  shouldShowCalorieModal() {
    if (DateUtil.isTodayDate(this.lastCalorieIntakeShownOn)) {
      return false;
    }

    this.lastCalorieIntakeShownOn = DateUtil.formattedTodayDate();
    return this.modalName;
  }

  @action setIsCardShownForFirstTime(isShown) {
    this.isCardShownForFirstTime = isShown;
  }

  @action setLastCompletedWIGoalDate(date) {
    this.lastCompletedWIGoalDate = date;
  }

  @action setWaterIntakeConsDays(days) {
    this.waterIntakeConsDays = days;
  }
  @action setRemainderLastShownOn(date) {
    this.lastRemainderShowOn = date;
  }

  @action setLastCalorieIntakeShownOn(date) {
    this.lastCalorieIntakeShownOn = date;
  }

  @action setShowLoadingInstruction(show) {
    this.shouldShowLoadingInstruction = show;
  }

  @action setSummaryModalLastShownOn(date) {
    this.summaryModalLastShownOn = date;
  }

  clearData() {
    this.shouldShowLoadingInstruction = true;
    this.summaryModalLastShownOn = "1990-01-01";
  }
}
