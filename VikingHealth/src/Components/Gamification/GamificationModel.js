import { R } from "./../../Resources/R";

export default class GamificationModel {
  constructor(title, image, text, subText, actionText, animation) {
    this.title = title;
    this.image = image;
    this.text = text;
    this.subText = subText;
    this.actionText = actionText;
    this.animation = animation;
  }
}

export const water0percent = new GamificationModel(
  "REACH YOUR GOAL",
  null,
  "Unlock Rewards",
  "Complete your goal of drinking 2L water to unlock a badge.",
  "OkAY",
  R.Animations.WIIntroductionBadge
  // R.Animations.Combo1
);
export const water50Percent = new GamificationModel(
  "50% GOAL REACHED",
  R.Images.bravo,
  "You are almost there",
  "You have compeleted 50% of your water intake goal today. ",
  "OKAY",
  null
);

export const water100percent = new GamificationModel(
  "ACHIEVEMENT UNLOCKED",
  null,
  "Awesome!",
  "",
  "Great",
  R.Animations.WIFullDay
);

export const waterIntakeUnlock7Day = new GamificationModel(
  "NEXT ACHIEVEMENT",
  null,
  "Just keep going!",
  "",
  "Okay",

  R.Animations.WIExpertBadgeLocked
);

export const waterIntakeRemainer = new GamificationModel(
  "Have you lost track ?",
  null,
  "",
  "You have not achieved your daily water target for last few days. Let's push the pedal to achieve your goals. ",
  "Okay",
  R.Animations.WIExpertBadgeLocked
);

export const waterIntake7DaysCompleted = new GamificationModel(
  "ACHIEVEMENT UNLOCKED",
  null,
  "You did it. Again!",
  "",
  "Great",
  R.Animations.WIExpertBadge
);

export const waterIntake30DaysUnlock = new GamificationModel(
  "NEXT ACHIEVEMENT",
  null,
  "You are almost there...",
  "",
  "Okay",
  R.Animations.WIMasterBadgeLockecd
);

export const waterIntake30DaysCompleted = new GamificationModel(
  "ACHIEVEMENT UNLOCKED",
  null,
  "Congratulations!",
  "",
  "Great",
  R.Animations.WIMasterBadge
);

export const CalorieIntakeCompleted = new GamificationModel(
  "GOAL COMPLETED",
  R.Images.calorieCompleteBitmoji,
  "You did it!",
  "You have completed your calorie goal for the day. Keep up!",
  "Okay",
  null
);
