import * as DateUtil from "./DateUtil";
import moment from "moment";
import { extendMoment } from "moment-range";
import { BodyPartName } from "../../Screens/Journey/BodyMeasurementSummary/ConfigData";
import * as BmiData from "../../Screens/BmiTableScreen/BmiData";

const momentRange = extendMoment(moment);

export class HeightWeightUtil {
  static WEIGHT_KG = 0;
  static WEIGHT_LBS = 1;

  static HEIGHT_IN = 0;
  static HEIGHT_CM = 1;

  static WATER_FLOZ = 0;
  static WATER_ML = 1;

  static kgWeight(lbsWeight) {
    return 0.454 * lbsWeight;
  }

  static lbsWeight(kgWeight) {
    return 2.205 * kgWeight;
  }

  static inchValue(cmValue) {
    return 0.3937 * cmValue;
  }

  static cmValue(inchValue) {
    return 2.54 * inchValue;
  }

  static litreValue(mlValue) {
    return mlValue / 1000;
  }

  static litreToMlValue(litreValue) {
    return litreValue * 1000;
  }

  static gallonValue(ozValue) {
    return ozValue / 128;
  }

  static gallonToOzValue(galValue) {
    return (galValue * 128).toFixed(0);
  }

  static ozValue(mlValue) {
    return mlValue / 29.574;
  }

  static mlValue(ozValue) {
    return ozValue * 29.574;
  }

  static heightUnit(value) {
    if (value == 0) {
      return "in";
    }
    return "cm";
  }

  static heightUnitPlural(value) {
    if (value === 0) {
      return "inches";
    }

    return "cms";
  }

  static weightUnit(value) {
    if (value == 0) {
      return "kg";
    }
    return "lb";
  }

  static waterUnit(value) {
    if (value === 0) {
      return "oz";
    }
    return "ml";
  }

  static waterBigUnit(value) {
    if (value === 0) {
      return "oz";
    }
    return "L";
  }

  static convertToCM(value, unit) {
    if (unit === HeightWeightUtil.HEIGHT_CM) {
      return value;
    }

    return HeightWeightUtil.cmValue(value);
  }

  static convertWeightToUnit(weightLog, unit) {
    if (weightLog.weightUnit === unit) {
      return weightLog.weight;
    }

    if (unit === HeightWeightUtil.WEIGHT_KG) {
      return HeightWeightUtil.kgWeight(weightLog.weight);
    }
    return HeightWeightUtil.lbsWeight(weightLog.weight);
  }

  static bmi(weightLog, cmHeight) {
    let w;
    if (weightLog.weightUnit == HeightWeightUtil.WEIGHT_KG) {
      w = weightLog.weight;
    } else {
      w = HeightWeightUtil.kgWeight(weightLog.weight);
    }
    const height = cmHeight / 100;
    const bmi = w / (height * height);
    return bmi.toFixed(1);
  }

  static displayWeight(weight, weightUnit, displayWeightUnit) {
    let convertedWeight;
    if (displayWeightUnit === weightUnit) {
      //If unit of this weight log and unit in users setting is same, return weight without any calculation
      convertedWeight = weight;
    } else if (displayWeightUnit === HeightWeightUtil.WEIGHT_KG) {
      convertedWeight = parseFloat(
        HeightWeightUtil.kgWeight(weight).toFixed(1)
      );
    } else {
      convertedWeight = parseFloat(
        HeightWeightUtil.lbsWeight(weight).toFixed(1)
      );
    }
    return convertedWeight;
  }

  static displayWaterIntake(
    waterIntake,
    waterIntakeUnit,
    displayWaterIntakeUnit
  ) {
    let convertedWaterIntake;
    if (displayWaterIntakeUnit === waterIntakeUnit) {
      //If unit of this weight log and unit in users setting is same, return weight without any calculation
      convertedWaterIntake = waterIntake;
    } else if (displayWaterIntakeUnit === HeightWeightUtil.WATER_ML) {
      convertedWaterIntake = parseFloat(
        HeightWeightUtil.mlValue(waterIntake).toFixed(1)
      );
    } else {
      convertedWaterIntake = parseFloat(
        HeightWeightUtil.ozValue(waterIntake).toFixed(1)
      );
    }
    return convertedWaterIntake;
  }

  static displayHeight(height, heightUnit, displayHeightUnit) {
    let convertedHeight;
    if (displayHeightUnit === heightUnit) {
      //If unit of this height and unit in users setting is same, return height without any calculation
      convertedHeight = height;
    } else if (displayHeightUnit == HeightWeightUtil.HEIGHT_IN) {
      convertedHeight = HeightWeightUtil.inchValue(height);
    } else {
      convertedHeight = HeightWeightUtil.cmValue(height);
    }
    return convertedHeight;
  }

  static formattedHeightText(value, unit) {
    if (unit == HeightWeightUtil.HEIGHT_IN) {
      const feet = Math.floor(value / 12);
      const inch = value % 12;
      return `${feet}ft ${inch.toFixed(1)}in`;
    }
    return `${value} cm`;
  }

  static getFeetHeightString(heightInInch) {
    const feet = Math.floor(heightInInch / 12);
    const inch = heightInInch % 12;
    return `${feet}' ${inch}''`;
  }

  static calculateWeightLoss(initialWeightLog, finalWeightLog) {
    if (!initialWeightLog) {
      return 0;
    }

    const {
      weight: initialWeight,
      weightUnit: initialWeightUnit,
    } = initialWeightLog;
    const { weight: finalWeight, weightUnit: finalWeightUnit } = finalWeightLog;

    var convertedInitialWeight = 0;
    var convertedFinalWeight = 0;

    if (initialWeightUnit === finalWeightUnit) {
      convertedInitialWeight = initialWeight;
      convertedFinalWeight = finalWeight;
    } else {
      convertedInitialWeight = HeightWeightUtil.convertWeightToUnit(
        initialWeightLog,
        finalWeightUnit
      );
      convertedFinalWeight = HeightWeightUtil.convertWeightToUnit(
        finalWeightLog,
        finalWeightUnit
      );
    }

    const percentage =
      (convertedInitialWeight - convertedFinalWeight) / convertedInitialWeight;
    return {
      weightLoss: percentage * 100,
      initial: convertedInitialWeight,
      current: convertedFinalWeight,
    };
  }

  static calculateBMILoss(initialWeightLog, finalWeightLog, cmHeight) {
    if (!initialWeightLog) {
      return 0;
    }

    const initialBmi = HeightWeightUtil.bmi(initialWeightLog, cmHeight);
    const finalBmi = HeightWeightUtil.bmi(finalWeightLog, cmHeight);

    const initialClass = BmiData.getBmiClassIndex(parseFloat(initialBmi));
    const finalClass = BmiData.getBmiClassIndex(parseFloat(finalBmi));

    return {
      bmiClassLoss: initialClass - finalClass,
      initialClass,
      finalClass,
      initialBmi,
      finalBmi,
    };
  }

  // Below function are related to summary phase data manipulation
  // As they are common in two component therefore defining it here.
  static parseLogData = ({ weightLogs }) => {
    if (!weightLogs) {
      return [];
    }

    const data = weightLogs.map((element) => {
      const { weight, date, weightUnit } = element;
      const formattedDate = DateUtil.getFormattedDate(date);
      return { weight, date: formattedDate, weightUnit, loss: 0 };
    });

    if (data.length === 0) {
      return [];
    }

    return data;
  };

  // compute weight loss data
  /**
   * UPDATE:
   * isAllSelected & cycleStartDate parameters are added afterwards.
   * Because we have updated the functionality to break summary animation progress into cycles.
   * If isAllSelected is true that means no need to change anything.
   * Otherwise, it means summary animation should be cycle-wise. And therefore need to calculate -
   * month according to the cycle start month difference not entire program start date difference.
   */
  static computeLoss = (
    data,
    programStartDate,
    isAllSelected = true,
    cycleStartDate = null
  ) => {
    const startDate = moment(programStartDate);
    const formattedCycleStartDate = moment(cycleStartDate);

    if (data.length === 0) {
      return [];
    }

    let lastWeight = data[0].weight;

    const lossData = data.map((element) => {
      const d = element.date;
      const dataDate = moment(d);

      const monthDifference = dataDate.diff(
        isAllSelected ? startDate : formattedCycleStartDate,
        "months"
      );

      const loss = lastWeight - element.weight;
      lastWeight = element.weight;
      return {
        ...element,
        loss: loss,
        weight: element.weight,
        month: monthDifference + 1,
      };
    });

    return lossData;
  };

  // it will accept data returned from computeLoss function above.
  // Data format :
  // {weight: 70, date: "Sep 04, 2019", weightUnit: 0, loss: 0, month: 0}

  static getMonthWiseLossData = (data) => {
    if (data.length === 0) {
      return [];
    }

    let firstMonthDateRecord = null;
    let lastMonthDateRecord = null;
    let currentMonth = data[0].month;

    const monthlyData = [];

    for (let i = 0; i < data.length; ++i) {
      const element = data[i];

      const { weight, month } = element;

      if (month !== currentMonth) {
        monthlyData.push({
          month: currentMonth,
          loss: firstMonthDateRecord - lastMonthDateRecord,
        });

        currentMonth = month;
        // firstMonthDateRecord = null;
      }

      if (!firstMonthDateRecord) {
        firstMonthDateRecord = weight;
      }

      lastMonthDateRecord = weight;
    }

    // after the loop we will have computed loss for every month except for last month
    // which is not store in array because data is inserted when month changes and there
    // is no month change after last month :)
    monthlyData.push({
      month: currentMonth,
      loss: firstMonthDateRecord - lastMonthDateRecord,
    });

    return monthlyData;
  };

  static getLogForDate = (date, data) => {
    for (let i = 0; i < data.length; ++i) {
      const log = data[i];
      if (log.date === date) {
        return log.weight;
      }
    }
  };

  static fillMissingData = (startingDate, data) => {
    if (data.length === 0) {
      return [];
    }

    const logData = [];
    let previousLoss = data[0].weight;
    const startDateM = moment(startingDate);

    const diff = DateUtil.absoluteDifferenceFromToday(startingDate);

    for (let i = 0; i < diff; ++i) {
      const d = startDateM.add(1, "d");
      const date = DateUtil.getFormattedDate(d);

      const logLoss = this.getLogForDate(date, data);
      if (logLoss) {
        previousLoss = logLoss;
      }

      // this is basically weight, as return value is changed.
      const loss = previousLoss.toFixed(0);

      const ob = { date, loss, day: i + 1 };
      logData.push(ob);
    }

    return logData;
  };

  static convertWeightUnit = (data, toUnit) => {
    if (data.length === 0) {
      return [];
    }

    const lossData = data.map((element) => {
      const weightUnit = element.weightUnit;

      // if display and measurement unit are same don't do anything
      if (weightUnit === toUnit) {
        return element;
      }

      if (weightUnit === HeightWeightUtil.WEIGHT_KG) {
        const weightInlbs = HeightWeightUtil.lbsWeight(element.weight);
        return {
          ...element,
          weight: weightInlbs,
          weightUnit: HeightWeightUtil.WEIGHT_LBS,
        };
      }

      const weightInKg = HeightWeightUtil.kgWeight(element.weight);
      return {
        ...element,
        weight: weightInKg,
        weightUnit: HeightWeightUtil.WEIGHT_KG,
      };
    });

    return lossData;
  };

  static convertHeightUnit = (data, toUnit) => {
    if (data.length === 0) {
      return [];
    }

    const lossData = data.map((element) => {
      const unit = element.unit;

      // if display and measurement unit are same don't do anything
      if (unit === toUnit) {
        return element;
      }

      if (unit === HeightWeightUtil.HEIGHT_IN) {
        const value = HeightWeightUtil.cmValue(element.value);
        return {
          ...element,
          value,
          unit: HeightWeightUtil.HEIGHT_CM,
        };
      }

      const value = HeightWeightUtil.inchValue(element.value);
      return {
        ...element,
        value,
        unit: HeightWeightUtil.HEIGHT_IN,
      };
    });

    return lossData;
  };

  static convertHeightUnitFromBMLog = (log, toUnit) => {
    const unit = log.unit;

    if (unit === toUnit) {
      return log;
    }

    const convertedLog = {};

    BodyPartName.forEach((name) => {
      const value = log[name.toLowerCase()];
      let convertedValue;

      if (toUnit === HeightWeightUtil.HEIGHT_CM) {
        convertedValue = HeightWeightUtil.cmValue(value);
      } else {
        convertedValue = HeightWeightUtil.inchValue(value);
      }

      convertedLog[name.toLowerCase()] = convertedValue;
    });

    return convertedLog;
  };

  static convertBMUnitFromHistoryObject = (data, toUnit) => {
    const convertedData = [];

    data.forEach((element) => {
      const { initialBM, lastRecordedBM } = element;
      const convertedInitial = HeightWeightUtil.convertHeightUnitFromBMLog(
        initialBM,
        toUnit
      );
      const convertedLast = HeightWeightUtil.convertHeightUnitFromBMLog(
        lastRecordedBM,
        toUnit
      );

      convertedData.push({
        initialBM: convertedInitial,
        lastRecordedBM: convertedLast,
      });
    });

    return convertedData;
  };

  // {date: "Sep 05, 2019", loss: "70", day: 1, weight: Array(37)}
  static getCurrentWeekLossData = (data) => {
    const todayDate = moment();
    todayDate.startOf("days");
    const weekStartDate = moment();
    weekStartDate.subtract(7, "days");
    weekStartDate.startOf("days");

    let latestRecord = null; // will store last record from week
    let firstRecord = null; // will store first record from week

    const weekRange = moment.range(weekStartDate, todayDate);

    for (let i = data.length - 1; i >= 0; --i) {
      const element = data[i];
      const { weight, date } = element;

      const elementDate = moment(date);
      elementDate.startOf("days");

      if (elementDate.within(weekRange)) {
        if (!latestRecord) {
          latestRecord = weight;
        }

        firstRecord = weight;
      }
    }

    if (!latestRecord) {
      return 0;
    }

    return firstRecord - latestRecord;
  };

  // Body measurement weekly loss calculation...
  static computeBMLoss = (data, programStartDate, allowTwoWeekBack = false) => {
    //-1 means there is not data entered so show differnt message
    if (data.length === 0) {
      return -1;
    }

    const startDate = moment(programStartDate);
    startDate.startOf("weeks");

    const currentDate = moment();
    currentDate.startOf("weeks");

    const currentWeek = currentDate.diff(startDate, "weeks") + 1; //because in db entry start from 1
    const currentLog = this.getBMDataForWeek(data, currentWeek);
    const previousWeekLog = this.getBMDataForWeek(data, currentWeek - 1);
    const last2Week = this.getBMDataForWeek(data, currentWeek - 2);

    if (currentLog === -1 || previousWeekLog === -1) {
      if (!allowTwoWeekBack) {
        return 0;
      }

      if (previousWeekLog == -1 || last2Week == -1) {
        return 0;
      }

      return last2Week - previousWeekLog;
    }

    return previousWeekLog - currentLog;
  };

  static getBMDataForWeek = (data, weekNo) => {
    for (let i = data.length - 1; i >= 0; --i) {
      const { value, week } = data[i];
      if (weekNo === week) {
        return value;
      }
    }

    return -1; // no value found.
  };

  static parseBMLogData = ({ bodyMeasurements }) => {
    if (!bodyMeasurements) {
      return [];
    }

    const data = bodyMeasurements.map((element) => {
      const {
        arms,
        calf,
        chest,
        hips,
        neck,
        shoulder,
        thighs,
        waist,
        week,
        date,
        unit,
      } = element;

      const sumInches =
        arms + calf + chest + hips + neck + shoulder + thighs + waist;

      const formattedDate = DateUtil.getFormattedDate(date);
      return { value: sumInches, week, date: formattedDate, unit, loss: 0 };
    });

    if (data.length === 0) {
      return [];
    }

    return data;
  };
}
