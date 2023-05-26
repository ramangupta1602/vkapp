import React from 'react';
import { Alert } from 'react-native';
import { ProgressDialog } from 'react-native-simple-dialogs';
import { StackActions, NavigationActions } from 'react-navigation';
import moment from 'moment';
import * as DateUtil from './DateUtil';
import { PHASE_CONSTANT } from '../../Library/Constants';
import * as AppointmentQueries from '../../AppSyncQueries/AppointmentQueries';

const PROGRAM_END_DATE_DURATION = 84;

const AppUtil = {
  getTestId: (id) => {
    return {
      testID: `${id}`,
      accessibilityLabel: `${id}`,
    };
  },

  isValidEmail: (email) => {
    if (!email) {
      return false;
    }
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(email) === true) {
      return true;
    }
    return false;
  },

  getProgramEndDateDuration: () => {
    return PROGRAM_END_DATE_DURATION;
  },

  getQuotesIndex: (diffInDate) => {
    if (diffInDate >= 0 && diffInDate < PROGRAM_END_DATE_DURATION) {
      return diffInDate;
    } else if (diffInDate >= PROGRAM_END_DATE_DURATION) {
      const diff = (diffInDate + 1) % PROGRAM_END_DATE_DURATION;
      return diff;
    }
    return 0;
  },

  // isValidPhoneNumber: number => {
  //   let valid = false;
  //   try {
  //     const phoneUtil = PhoneNumberUtil.getInstance();
  //     valid = phoneUtil.isValidNumber(phoneUtil.parse(number));
  //   } catch (e) {
  //     valid = false;
  //   }
  //   return valid;
  // },

  getCurrentDate: () => {
    const today = new Date();
    return moment(today).format('YYYY-MM-DD');
  },

  convertDateFormatYYYYMMDD: (dateValue) => {
    return moment(dateValue, 'MMMM DD, YYYY').format('YYYY-MM-DD');
  },

  convertDateFormatMMMMDDYYYY: (dateValue) => {
    return moment(dateValue, 'YYYY-MM-DD').format('MMMM DD, YYYY');
  },

  convertDayMonthYearToMMDDYYYY: (dateValue) => {
    return moment(dateValue, 'DD-MM-YYYY').format('MM-DD-YYYY');
  },

  convertMonthDayYearToYYYYMMDD: (dateValue) => {
    return moment(dateValue, 'MM-DD-YYYY').format('YYYY-MM-DD');
  },
  getCurrentDateInMMMMDDYYYY: () => {
    return moment(new Date()).format('MMMM DD, YYYY');
  },
  getCurrentDateInYYYYMMDD: () => {
    return moment(new Date()).format('YYYY-MM-DD');
  },

  regexForName: (text) => {
    const regexText = text.replace(/[^a-zA-Z ']/g, '');

    if (regexText.length > 20) {
      return regexText.substring(0, 20);
    }

    return regexText;
  },

  isValidPassword: (text) => {
    if (text.length >= 8) {
      return true;
    }
    return false;
  },

  isValidOtp: (text) => {
    if (text.length === 6) {
      return true;
    }
    return false;
  },

  extractNumberFromString: (text) => {
    return text.match(/\d+/g).map(Number);
  },

  renderProgressBar: (isLoading, message) => {
    return <ProgressDialog visible={isLoading} message={message} />;
  },

  inRange: (x, min, max) => {
    return x >= min && x <= max;
  },

  resetAction: (route, params) => {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: route,
          params,
        }),
      ],
    });
    return resetAction;
  },

  /*
    it phase value === 0, then it is existing user and don't show any loading phase related modal
    if  step    phase   day   screenToShow
        3       1        -      Let the user select program start date
        3       2       <0      waiting
        3       2       0,1     waiting -> show modal to move to loading and update phase = 3
        3       2       >1      waiting -> show modal of miss loading phase and update phase = 3 or 4
        3       3       0,1     loading screen
        3       3       >1      loading screen -> show modal to move to losing phase and update phase = 3
        3       4       -       move to dashboard
  */

  getScreenToshow: (dateDiff, phaseValue) => {
    // existing user , show dashboard
    if (phaseValue === PHASE_CONSTANT.EXISTING_USER) {
      return 'Dashboard';
    }

    if (phaseValue === PHASE_CONSTANT.DATE_SELECTION_PHASE) {
      return 'StartDateSelection';
    }

    // new user ** program not started yet
    if (dateDiff < 0 && phaseValue === PHASE_CONSTANT.PRE_LOADING_PHASE) {
      return 'PreLoadingEmptyPhase';
    }

    if (dateDiff >= 0 && phaseValue === PHASE_CONSTANT.PRE_LOADING_PHASE) {
      return 'LoadingWalkThrough';
    }

    // loading phase
    if (dateDiff < 0 && phaseValue === PHASE_CONSTANT.LOADING_PHASE) {
      return 'PreLoadingEmptyPhase';
    }

    if (dateDiff >= 0 && phaseValue === PHASE_CONSTANT.LOADING_PHASE) {
      return 'LoadingDashboard';
    }
    if (phaseValue === PHASE_CONSTANT.LOSING_PHASE) {
      return 'Dashboard';
    }

    return 'Dashboard';
  },

  getModelRelatedToPhase: (dateDiff, phaseValue) => {
    if (phaseValue === 1 && dateDiff < 0) {
      return false;
    }

    if (phaseValue === 1 && dateDiff < 2) {
      return 'MoveToLoading';
    }

    if (phaseValue === 1 && dateDiff >= 2) {
      return 'MissedLoading';
    }

    if (phaseValue === 2 && dateDiff < 2) {
      return false;
    }

    if (phaseValue === 2 && dateDiff >= 2) {
      return 'MoveToDashboard';
    }

    if (phaseValue === 3) {
      return false;
    }

    return false;
  },

  // date is passed here and it will give weekdays after calculations
  getDayOfWeek: (date) => {
    const dayOfWeek = new Date(date).getDay();
    return isNaN(dayOfWeek)
      ? null
      : [
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
        ][dayOfWeek];
  },

  filterWeekData(labels, data) {
    //Here lables and data will have same in length
    const dataArray = [0, 0, 0, 0, 0, 0, 0];
    labels.map((item, index) => {
      switch (item.toLowerCase()) {
        case 'monday':
          dataArray[0] = data[index];
          break;
        case 'tuesday':
          dataArray[1] = data[index];
          break;
        case 'wednesday':
          dataArray[2] = data[index];
          break;
        case 'thursday':
          dataArray[3] = data[index];
          break;
        case 'friday':
          dataArray[4] = data[index];
          break;
        case 'saturday':
          dataArray[5] = data[index];
          break;
        case 'sunday':
          dataArray[6] = data[index];
          break;
        default:
          break;
      }
      return dataArray;
    });

    return dataArray;
  },

  getWaistToHeightRatio: (waist, height) => {
    return (waist / height).toFixed(2) * 100;
  },

  capitalizeFirstLetter: (data) => {
    return data.charAt(0).toUpperCase() + data.slice(1);
  },
  progressReport: (programEndDate, programStartDate) => {
    const totalDays = programEndDate.diff(programStartDate, 'days');
    const daysCompleted = moment().diff(programStartDate, 'days');
    const progress = daysCompleted / totalDays;
    return progress;
  },
  currentStatus: (programEndDate, currentDate) => {
    if (programEndDate >= currentDate) {
      return 'Program Ending On';
    } else if (programEndDate < currentDate) {
      return 'Program Ended On';
    }
  },

  isValidPhoneNumber: (phoneNumber) => {
    const regEx = /^[+-]?\d+$/;
    return regEx.test(phoneNumber);
  },

  shouldNotContainWhiteSpaces: (text) => {
    //const regexp = /^\S*$/;
    const finalText = text.replace(/\s/g, '');
    return finalText;
  },

  truncateText: (text, MAX_LIMIT) => {
    return text.length > MAX_LIMIT
      ? `${text.substring(0, MAX_LIMIT - 3)}...`
      : text;
  },

  alertWithOkText: (headerText, message, listener) => {
    Alert.alert(headerText, message, [
      {
        text: 'OK',
        onPress: listener,
      },
    ]);
  },

  colorSelection: (number) => {
    const phoneNumber = number % 8;
    switch (phoneNumber) {
      case 0:
        return 'rgb(237,119,122)';
      case 1:
        return 'rgb(29, 128, 167)';
      case 2:
        return 'rgb(244,133,100)';
      case 3:
        return 'rgb(149, 141, 229)';
      case 4:
        return ' rgb(240, 139, 199)';
      case 5:
        return 'rgb(29, 128, 167)';
      case 6:
        return 'rgb(237, 218, 125)';
      case 7:
        return 'rgb(116, 180, 232)';
      default:
        return 'rgb(105, 110, 230)';
    }
  },

  getMonthText: (monthNumber) => {
    switch (monthNumber) {
      case 1:
        return 'First Month';
      case 2:
        return 'Second Month';
      case 3:
        return 'Third Month';
      case 4:
        return 'Fourth Month';
      case 5:
        return 'Fifth Month';
      case 6:
        return 'Sixth Month';
      case 7:
        return 'Seventh Month';
      case 8:
        return 'Eighth Month';
      case 9:
        return 'Ninth Month';
      case 10:
        return 'Tenth Month';
      case 11:
        return 'Eleventh Month';
      case 12:
        return 'Twelfth Month';
      case 13:
        return 'Thirteenth Month';
      case 14:
        return 'Fourteenth Month';
      case 15:
        return 'Fifteenth Month';
      case 16:
        return 'Sixteenth Month';
      case 17:
        return 'Seventeenth Month';
      case 18:
        return 'Eighteenth Month';
      case 19:
        return 'Nineteenth Month';

      default:
        return '';
    }
  },

  getDateDifferenceAccordingToCycle: (
    programStartDate,
    cycleStartDate,
    currentCycle
  ) => {
    const date = currentCycle > 1 ? cycleStartDate : programStartDate;
    const dateDiff = DateUtil.absoluteDifferenceFromToday(date);

    return dateDiff;
  },

  getAppointmentListingFetchQuery: (patientId) => {
    return [
      {
        query: AppointmentQueries.GetAppointmentListForAdmin,
        variables: {
          type: 'UPCOMING',
          limit: 10,
          token: null,
        },
      },
      {
        query: AppointmentQueries.GetAppointmentListForAdmin,
        variables: {
          type: 'PENDING',
          limit: 10,
          token: null,
        },
      },
      {
        query: AppointmentQueries.GetAppointmentListForAdmin,
        variables: {
          type: 'COMPLETED',
          limit: 10,
          token: null,
        },
      },
      {
        query: AppointmentQueries.GetAppointmentListForPatient,
        variables: {
          type: 'UPCOMING',
          patientId,
        },
      },
      {
        query: AppointmentQueries.GetAppointmentListForPatient,
        variables: {
          type: 'PENDING',
          patientId,
        },
      },
      {
        query: AppointmentQueries.GetAppointmentListForPatient,
        variables: {
          type: 'COMPLETED',
          patientId,
        },
      },

      {
        query: AppointmentQueries.GetAppointmentsCount,
        variables: {
          appointmentDetails: JSON.stringify({
            appointment: {
              statusCategory: ['UPCOMING', 'PENDING', 'COMPLETED'],
              patientId: null,
            },
          }),
        },
      },

      {
        query: AppointmentQueries.GetAppointmentsCount,
        variables: {
          appointmentDetails: JSON.stringify({
            appointment: {
              statusCategory: ['UPCOMING', 'PENDING', 'COMPLETED'],
              patientId,
            },
          }),
        },
      },
    ];
  },

  getAppointmentListingForAdmin: () => {
    return [
      {
        query: AppointmentQueries.GetAppointmentListForAdmin,
        variables: {
          type: 'UPCOMING',
          limit: 10,
          token: null,
        },
      },
      {
        query: AppointmentQueries.GetAppointmentListForAdmin,
        variables: {
          type: 'PENDING',
          limit: 10,
          token: null,
        },
      },
      {
        query: AppointmentQueries.GetAppointmentListForAdmin,
        variables: {
          type: 'COMPLETED',
          limit: 10,
          token: null,
        },
      },
      {
        query: AppointmentQueries.GetAppointmentsCount,
        variables: {
          appointmentDetails: JSON.stringify({
            appointment: {
              statusCategory: ['UPCOMING', 'PENDING', 'COMPLETED'],
              patientId: null,
            },
          }),
        },
      },
    ];
  },

  getAppointmentInitBy: (userType) => {
    return userType === 'Admin' ? 'Doctor' : 'Patient';
  },
};

export default AppUtil;
