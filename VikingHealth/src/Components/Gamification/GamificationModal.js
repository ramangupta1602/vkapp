import React, { Component } from 'react';
import { StyleSheet, Alert, View } from 'react-native';
import Modal from 'react-native-modal';
import Styles from './styles';
import * as GamificationObject from './GamificationModel';
import WaterGamificationCard from './WaterIntakeGamification/WaterGamificationCard/WaterGamificationCard';
import { Gamification } from './../../utility/constants/Constants';
import {
  NextAchievement,
  Achievement,
  WaterIntakeDailyCompletionSubtext,
  NextAchievement7Days,
  WaterIntake7DaysAchievementCompletedSubText,
  NextAchievement30Days,
  WaterIntake30DaysAchievementCompletedSubText,
} from './WaterIntakeGamification/WaterGamificationCard';

import QuoteModalComponent from './QuoteModalComponent';
import MissedLoadingModal from './MissedLoadingModal';
import SummaryPopup from './SummaryPopup';
import { inject, observer } from 'mobx-react';
import CalorieIntakeCompleteModal from './CalorieIntakeCompleteModal';
import ReloadConfirmationModal from './ReloadConfirmationModal';
import ViewCycleSummaryPopup from './ViewCycleSummaryPopup';
import BmiLossCard from './RewardModel/BmiLossCard';
import WeightLossCard from './RewardModel/WeightLossCard';
import WtHRLossCard from './RewardModel/WtHRLossCard';
import SkipLoadingModal from './SkipLoadingModal';
import BookAppointmentSuccessful from './AppointmentModal/BookAppointmentSuccessful';
import AcceptAppointmentRequest from './AppointmentModal/AcceptAppointmentRequest';
import ConfirmAppointmentRequest from './AppointmentModal/ConfirmAppointment/ConfirmAppointment';
import PatientCancelRequest from './AppointmentModal/PatientRejectModal/PatientRejectModal';
import AdminCancelRequest from './AppointmentModal/AdminRejectModal/AdminRejectModal';
import PatientRequestRescheduleModal from './AppointmentModal/PatientRequestRescheduleModal/PatientRequestRescheduleModal';
import RescheduleRemainder from './AppointmentModal/PatientRejectModal/RescheduleRemainder';
@inject('loginUserStore')
@observer
export class GamificationModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // humanisedWaterIntake
  render() {
    return (
      <Modal
        {...this.props}
        style={[Styles.containerStyle]}
        animationOutTiming={500}
        backdropTransitionOutTiming={500}
        backdropOpacity={0.6}
        onBackdropPress={() => {
          if (this.props.onBackdropPress) {
            this.props.onBackdropPress();
          }
        }}
        onModalHide={() => {
          if (this.props.onModalHide) {
            this.props.onModalHide();
          }
        }}
      >
        {this.getAppropriateCard(this.props.modalName)}
      </Modal>
    );
  }

  getAppropriateCard = (cardName) => {
    switch (cardName) {
      case Gamification.WaterIntake.Completed0Percent:
        return this.get0PercentWaterIntakeCard();

      case Gamification.WaterIntake.Completed50Percent:
        return this.get50PercentWaterIntakeCard();

      case Gamification.WaterIntake.Completed100Percent:
        return this.get100PercentWaterIntakeCard();

      case Gamification.WaterIntake.NextAchievement7Days:
        return this.getNextAchievement7Day();

      case Gamification.WaterIntake.Completed7DaysAchievement:
        return this.get7DayCompleteAchievement();

      case Gamification.WaterIntake.NextAchievement30Days:
        return this.getNextAchievement30Day();

      case Gamification.WaterIntake.Completed30DaysAchievement:
        return this.get30DayCompleteAchievement();

      case Gamification.WaterIntake.RemainderModal:
        return this.getRemainderModal();

      case Gamification.QuoteModal:
        return <QuoteModalComponent onClick={this.props.onClick} />;

      case Gamification.CalorieIntakeCompleteModal:
        return <CalorieIntakeCompleteModal onClick={this.props.onClick} />;

      case Gamification.MissedLoadingModal:
        return <MissedLoadingModal />;

      case Gamification.ViewCycleSummaryPopup:
        return <ViewCycleSummaryPopup onClick={this.props.onClick} />;

      case Gamification.LossSummaryModal:
        return (
          <SummaryPopup
            onDragCompleted={this.props.onClick}
            onClose={this.props.onBackdropPress}
          />
        );

      case Gamification.RewardModal.BMIModal:
        return (
          <BmiLossCard
            onClick={this.props.onClick}
            onClose={this.props.onBackdropPress}
          />
        );

      case Gamification.RewardModal.WeightLossModal:
        return <WeightLossCard onClick={this.props.onClick} />;

      case Gamification.RewardModal.WtHRModal:
        return <WtHRLossCard onClick={this.props.onClick} />;

      case Gamification.SkipLoadingModal:
        return (
          <SkipLoadingModal
            onCancelPress={this.props.onCancelPress}
            performMutation={this.props.performMutation}
            buttonState={this.props.buttonState}
          />
        );

      case Gamification.Appointment.BookAppointment:
        return (
          <BookAppointmentSuccessful
            onClick={this.props.onClick}
            userData={this.props.userData}
            isReschedule={this.props.isReschedule}
          />
        );

      case Gamification.Appointment.AcceptAppointmentRequest:
        return <AcceptAppointmentRequest onClick={this.props.onClick} />;

      case Gamification.Appointment.ConfirmAppointmentRequest:
        return <ConfirmAppointmentRequest {...this.props} />;

      case Gamification.Appointment.PatientCancelRequest:
        return <PatientCancelRequest {...this.props} />;

      case Gamification.Appointment.AdminCancelRequest:
        return <AdminCancelRequest {...this.props} />;

      case Gamification.Appointment.PatientRequestReschedule:
        return <PatientRequestRescheduleModal {...this.props} />;

      case Gamification.Appointment.RescheduleRemainder:
        return <RescheduleRemainder {...this.props} />;

      default:
        return <View />;
    }
  };

  get0PercentWaterIntakeCard = () => {
    const targetWaterIntake = this.props.loginUserStore.humanisedWaterIntake;
    GamificationObject.water0percent.subText = `Complete your goal of drinking ${targetWaterIntake} water to unlock a badge.`;

    return (
      <NextAchievement
        onClick={this.props.onClick}
        gamificationModel={GamificationObject.water0percent}
        subTextStyle={localStyle.subTextStyle}
        imageStyle={{
          width: 313,
          height: 250,
          marginHorizontal: 10,
          marginTop: 29,
          marginBottom: 22,
        }}
        actionStyle={{
          marginTop: 60,
        }}
      />
    );
  };

  get50PercentWaterIntakeCard = () => {
    return (
      <WaterGamificationCard
        onClick={this.props.onClick}
        gamificationModel={GamificationObject.water50Percent}
        imageStyle={{ width: 218, height: 206, marginTop: 21 }}
        subTextStyle={[
          localStyle.subTextStyle,
          { fontFamily: 'Lato-Regular', paddingHorizontal: 0 },
        ]}
        textStyle={localStyle.Completed50PercentStyle}
      />
    );
  };

  get100PercentWaterIntakeCard = () => {
    return (
      <NextAchievement
        gamificationModel={GamificationObject.water100percent}
        onClick={this.props.onClick}
        imageStyle={{
          width: 313,
          height: 276,
          marginTop: 0,
          marginBottom: 0,
        }}
        actionStyle={{
          marginTop: 50,
        }}
      >
        <WaterIntakeDailyCompletionSubtext />
      </NextAchievement>
    );
  };

  getNextAchievement7Day = () => {
    const targetWaterIntake = this.props.loginUserStore.humanisedWaterIntake;

    return (
      <NextAchievement
        onClick={this.props.onClick}
        gamificationModel={GamificationObject.waterIntakeUnlock7Day}
        imageStyle={{
          height: 277,
          width: 336,
          marginTop: 0,
          marginBottom: 0,
        }}
        subTextStyle={{
          color: '#282727',
          fontFamily: 'Lato-Semibold',
          lineHeight: 19,
        }}
        actionStyle={{
          marginTop: 43,
        }}
      >
        <NextAchievement7Days targetWaterIntake={targetWaterIntake} />
      </NextAchievement>
    );
  };

  get7DayCompleteAchievement = () => {
    return (
      <Achievement
        onClick={this.props.onClick}
        gamificationModel={GamificationObject.waterIntake7DaysCompleted}
        textStyle={localStyle.AchievmentTextStyle}
        subTextStyle={[localStyle.AchievementSubText]}
        imageStyle={{
          height: 275,
          width: 317,
          marginTop: -5,
          marginBottom: 0,
        }}
        actionStyle={{
          marginTop: 61,
        }}
      >
        <WaterIntake7DaysAchievementCompletedSubText />
      </Achievement>
    );
  };

  getNextAchievement30Day = () => {
    return (
      <NextAchievement
        onClick={this.props.onClick}
        gamificationModel={GamificationObject.waterIntake30DaysUnlock}
        // textStyle={localStyle.AchievmentTextStyle}
        subTextStyle={localStyle.NextAchievement30Days}
        imageStyle={{
          width: 320,
          height: 276,
          marginTop: -5,
          // backgroundColor: 'red',
          marginBottom: 0,
        }}
        actionStyle={{
          marginTop: 30,
        }}
        textStyle={{
          ...localStyle.AchievmentTextStyle,
          marginTop: 18,
          // backgroundColor: 'blue'
        }}
      >
        <NextAchievement30Days />
      </NextAchievement>
    );
  };

  get30DayCompleteAchievement = () => {
    return (
      <Achievement
        onClick={this.props.onClick}
        gamificationModel={GamificationObject.waterIntake30DaysCompleted}
        imageStyle={{
          height: 255,
          width: 317,
          // backgroundColor: 'blue',
          marginBottom: 0,
          marginTop: -5,
        }}
        actionStyle={{
          marginTop: 41,
        }}
        textStyle={{
          marginTop: 21,
          // backgroundColor: 'blue'
        }}
      >
        <WaterIntake30DaysAchievementCompletedSubText />
      </Achievement>
    );
  };

  getRemainderModal = () => {
    const targetWaterIntake = this.props.loginUserStore.humanisedWaterIntake;
    return (
      <NextAchievement
        onClick={this.props.onClick}
        gamificationModel={GamificationObject.waterIntakeRemainer}
        imageStyle={{
          height: 277,
          width: 336,
          marginTop: 0,
          marginBottom: 0,
        }}
        subTextStyle={{
          color: '#282727',
          fontFamily: 'Lato-Semibold',
          lineHeight: 19,
        }}
        actionStyle={{
          marginTop: 43,
        }}
      />
    );
  };
}

const localStyle = StyleSheet.create({
  subTextStyle: {
    color: '#024481',
    fontFamily: 'Lato-Semibold',
    letterSpacing: 0.48,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 19,
  },

  Completed50PercentStyle: {
    fontFamily: 'Lato-Semibold',
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 0.77,
    lineHeight: 29,
    paddingHorizontal: 0,
  },

  AchievmentTextStyle: {
    color: '#024481',
    fontFamily: 'Lato-Semibold',
    fontSize: 24,
    textAlign: 'center',
    lineHeight: 29,
    fontWeight: '600',
    letterSpacing: 0.77,
  },

  AchievementSubText: {
    letterSpacing: 0.51,
  },

  NextAchievement30Days: {
    color: '#024481',
    letterSpacing: 0.45,
    lineHeight: 19,
    fontSize: 14,
  },
});
