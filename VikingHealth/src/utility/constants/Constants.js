export const weekLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
export const allLables = ['November', 'December', 'January'];
export const dataScaleTypes = {
  increased: 1,
  decreased: 0,
  startingWeight: 'Starting weight',
  startingMeasurement: 'Starting measurement',
};

export const Gamification = {
  WaterIntake: {
    Completed0Percent: 'completed0Percent',
    Completed50Percent: 'complted50Percent',
    Completed100Percent: 'complted100Percent',
    NextAchievement7Days: 'nextAchievement7Days',
    Completed7DaysAchievement: 'completed7DaysAchievement',
    NextAchievement30Days: 'nextAchievement30Days',
    Completed30DaysAchievement: 'completed30DaysAchievement',
    RemainderModal: 'remainerModal',
  },
  QuoteModal: 'quoteModal',
  CalorieIntakeCompleteModal: 'CalorieIntakeCompleteModal',
  MissedLoadingModal: 'MissedLoadingModal',
  LossSummaryModal: 'LossSummaryModal',
  ReloadConfirmationModal: 'ReloadConfirmationModal',
  ViewCycleSummaryPopup: 'ViewCycleSummaryPopup',
  SkipLoadingModal: 'SkipLoading',
  RewardModal: {
    BMIModal: 'bmiCard',
    WtHRModal: 'wthrCard',
    WeightLossModal: 'WeightLoss',
  },
  Appointment: {
    BookAppointment: 'BookAppointment',
    AcceptAppointmentRequest: 'AcceptAppointmentRequest',
    ConfirmAppointmentRequest: 'ConfirmAppointmentRequest',
    PatientCancelRequest: 'PatientCancelRequest',
    AdminCancelRequest: 'AdminCancelRequest',
    PatientRequestReschedule: 'PatientRequestReschedule',
    RescheduleRemainder: 'RescheduleRemainder',
  },
};

export const AppointmentStatusCategory = {
  UPCOMING: 'UPCOMING',
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
};

export const AppointmentStatus = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  CANCEL: 'CANCELLED',
  PROPOSED: 'PROPOSED',
  RESCHEDULE: 'RESCHEDULE',
  CONFIRM: 'CONFIRMED',
  MISSED: 'MISSED',
  COMPLETED: 'COMPLETED',
};

export const AppointmentInitiatedBy = {
  Doctor: 'DOCTOR',
  Patient: 'PATIENT',
};
