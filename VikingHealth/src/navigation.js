import { createStackNavigator } from 'react-navigation';
import {
  Login,
  DaysPerformance,
  BodyMeasurements,
  Signup,
  ForgotPasswordGetAccount,
  ResetPassword,
  ChangePassword,
  SetPassword,
  LogWeight,
  Dashboard,
  AboutYou,
  WeightDetails,
  WaterIntakeDetails,
  BodyMeasurementDetails,
  Profile,
  BodyMeasurementHelp,
  DaysPerformanceSummary,
  LogWaterIntake,
  Reboot,
  FetchVideoSessionInfo,
  VideoCallList,
  VideoPlayer,
  ApprovedFoodList,
  LoadingDashboard,
  LogCaloryIntake,
  LoadingWalkThrough,
  PreLoadingEmptyPhase,
  StartDateSelection,
  SummaryScreen,
  AllSummaryGraphComponent,
  CycleSummary,
  BmiTableScreen,
  RewardHistory,
  RewardInformation,
  SlotSelection,
  BookAppointment,
  AcceptAppointmentRequest,
  AppointmentListing,
  AppointmentGuideline,
} from './Screens/index';
import {Splash} from './Screens/Splash/Splash'
import {WalkThrough} from './Screens/Splash/WalkThrough'
import ScreenNameConstant from './Screens/ScreenNameConstant';

import {
  CreateNewUser,
  AdminDashboard,
  PatientProfile,
  UpdateEndDate,
  SearchPatient,
} from './Screens/Admin/index';

import { tabBarDisabledComponentHOC } from './Hocs/TabBarDisabledComponentHOC';
import { tabBarEnabledComponentHOC } from './Hocs/TabBarEnabledComponentHOC';
import { BottomBarConstant } from './Components/Tabbar/BottomTabBar';

const {
  DashboardTab,
  JourneyTab,
  VideoTab,
  SummaryTab,
  RewardTab,
} = BottomBarConstant;

const AppNav = createStackNavigator(
  {
    Splash: tabBarDisabledComponentHOC(Splash),
    WalkThrough: tabBarDisabledComponentHOC(WalkThrough),
    Dashboard: tabBarEnabledComponentHOC(Dashboard, DashboardTab),
    DaysPerformance: tabBarDisabledComponentHOC(DaysPerformance),
    BodyMeasurements: tabBarDisabledComponentHOC(BodyMeasurements),
    BodyMeasurementDetails: tabBarEnabledComponentHOC(
      BodyMeasurementDetails,
      DashboardTab
    ),
    Login: tabBarDisabledComponentHOC(Login),
    SetPassword: tabBarDisabledComponentHOC(SetPassword),
    Signup: tabBarDisabledComponentHOC(Signup),
    AboutYou: tabBarDisabledComponentHOC(AboutYou),
    ForgotPasswordGetAccount: tabBarDisabledComponentHOC(
      ForgotPasswordGetAccount
    ),
    ResetPassword: tabBarDisabledComponentHOC(ResetPassword),
    ChangePassword: tabBarDisabledComponentHOC(ChangePassword),
    LogWeight: tabBarDisabledComponentHOC(LogWeight),
    WeightDetails: tabBarEnabledComponentHOC(WeightDetails, DashboardTab),
    WaterIntakeDetails: tabBarEnabledComponentHOC(
      WaterIntakeDetails,
      DashboardTab
    ),
    Profile: tabBarDisabledComponentHOC(Profile),
    DaysPerformanceSummary: tabBarEnabledComponentHOC(
      DaysPerformanceSummary,
      DashboardTab
    ),
    LogWaterIntake: tabBarDisabledComponentHOC(LogWaterIntake),

    Reboot: tabBarDisabledComponentHOC(Reboot),
    AdminDashboard: tabBarDisabledComponentHOC(AdminDashboard),
    PatientProfile: tabBarDisabledComponentHOC(PatientProfile),
    UpdateEndDate: tabBarDisabledComponentHOC(UpdateEndDate),
    FetchVideoSessionInfo: tabBarDisabledComponentHOC(FetchVideoSessionInfo),
    VideoCallList: tabBarDisabledComponentHOC(VideoCallList),
    VideoPlayer: tabBarDisabledComponentHOC(VideoPlayer),
    SearchPatient: tabBarDisabledComponentHOC(SearchPatient),
    LoadingDashboard: tabBarDisabledComponentHOC(LoadingDashboard),
    LogCaloryIntake: tabBarDisabledComponentHOC(LogCaloryIntake),
    LoadingWalkThrough: tabBarDisabledComponentHOC(LoadingWalkThrough),
    PreLoadingEmptyPhase: tabBarDisabledComponentHOC(PreLoadingEmptyPhase),
    StartDateSelection: tabBarDisabledComponentHOC(StartDateSelection),
    SummaryScreen: tabBarEnabledComponentHOC(SummaryScreen, JourneyTab),
    CycleSummary: tabBarEnabledComponentHOC(CycleSummary, SummaryTab),
    RewardHistory: tabBarEnabledComponentHOC(RewardHistory, RewardTab),
    RewardInformation: tabBarDisabledComponentHOC(RewardInformation),

    BodyMeasurementHelp: tabBarEnabledComponentHOC(
      BodyMeasurementHelp,
      DashboardTab
    ),

    AllSummaryGraphComponent: tabBarDisabledComponentHOC(
      AllSummaryGraphComponent
    ),

    [ScreenNameConstant.SlotSelection]: tabBarDisabledComponentHOC(
      SlotSelection
    ),

    [ScreenNameConstant.BookAppointment]: tabBarDisabledComponentHOC(
      BookAppointment
    ),

    [ScreenNameConstant.AcceptAppointmentRequest]: tabBarDisabledComponentHOC(
      AcceptAppointmentRequest
    ),

    [ScreenNameConstant.AppointmentListing]: tabBarDisabledComponentHOC(
      AppointmentListing
    ),
  },
  {
    cardStyle: { shadowColor: 'transparent' },
  }
);
const RootNavigator = createStackNavigator(
  {
    MainApp: {
      screen: AppNav,
    },
    CreateNewUser: {
      screen: tabBarDisabledComponentHOC(CreateNewUser),
    },
    FoodList: {
      screen: tabBarDisabledComponentHOC(ApprovedFoodList),
    },

    AppointmentGuideline: tabBarDisabledComponentHOC(AppointmentGuideline),

    BmiTableScreen: tabBarDisabledComponentHOC(BmiTableScreen),
  },

  {
    headerMode: 'none',
    mode: 'modal',
  }
);

export const AppContainer = RootNavigator;
