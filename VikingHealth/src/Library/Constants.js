export const USER_ONBOARDING_STEP = {
  LOGGED_OUT: 0,
  ACCOUNT_SETUP: 1, //Password reset complete
  PROFILE_COMPLETE: 2, //Profile setup complete
  DONE: 3, //Target weight set
  START_PROGRAM: 4, // for new user ... after loading phase, user has to click on start program, without it
  // user can't go to dashboard.
};

export const USER_TYPE = {
  PATIENT: 'Patient',
  ADMIN: 'Admin',
};
export const STATUS_USER = {
  INVITED: 0,
  ACTIVE: 1,
  COMPLETED: 2,
};
export const STATUS_VIDEO = {
  SHOW: 1,
  HIDE: 0,
};

export const PHASE_CONSTANT = {
  EXISTING_USER: 0,
  DATE_SELECTION_PHASE: 1,
  PRE_LOADING_PHASE: 2,
  LOADING_PHASE: 3,
  LOSING_PHASE: 4,
};

export const API_DATE_FORMAT = 'YYYY-MM-DD';
export const DISPLAY_DATE_FORMAT = 'MMMM DD, YYYY';
