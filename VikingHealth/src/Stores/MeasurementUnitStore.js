import { observable } from "mobx";
import { AsyncStorage } from "react-native";

export class MeasurementUnitStore {
  @observable displayWeightUnit = 0;
  @observable displayHeightUnit = 0;

  constructor() {
    // this.loadValues();
  }

  setDisplayWeightUnit(unit) {
    if (unit != null && !isNaN(unit)) {
      this.displayWeightUnit = unit;
      AsyncStorage.setItem("displayWeightUnit", unit.toString());
    }
  }

  setDisplayHeightUnit(unit) {
    if (unit != null && !isNaN(unit)) {
      this.displayHeightUnit = unit;
      AsyncStorage.setItem("displayHeightUnit", unit.toString());
    }
  }

  loadValues() {
    let self = this;

    return new Promise(function (resolve, reject) {
      let keys = ["displayWeightUnit", "displayHeightUnit"];
      AsyncStorage.multiGet(keys, (error, stores) => {
        stores.map((result, i, store) => {
          // get at each store's key/value so you can work with it
          let key = store[i][0];
          let value = store[i][1];

          switch (key) {
            case "displayWeightUnit":
              self.displayWeightUnit = parseInt(value);
              break;
            case "displayHeightUnit":
              self.displayHeightUnit = parseInt(value);
              break;
          }
        });
        resolve();
      });
    });
  }
  g;
  clearData() {
    const keys = ["displayWeightUnit", "displayHeightUnit"];

    AsyncStorage.multiRemove(keys);
    this.displayWeightUnit = null;
    this.displayHeightUnit = null;
  }
}
