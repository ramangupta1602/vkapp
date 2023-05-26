// Observation derived from reference video
// Video : https://drive.google.com/open?id=1p4YlrCUyVP2tg6Wm-xYX51hHSH5kwbXZ
// Sheet : https://drive.google.com/open?id=1p4YlrCUyVP2tg6Wm-xYX51hHSH5kwbXZ
//
// 1	neck                    00:02	0.01642
// 2	neck                  	00:04	0.0334
// 3	neck                   	00:45	0.0619
//--------------------------------------------------
// 4	Shoulder	            01:03	0.1108
// 5	Shoulder	            01:09	0.135
// 6	Shoulder            	01:18	0.1643
//--------------------------------------------------
// 7	Chest	                1:32	0.216
// 8	Chest               	1:37	0.2402
// 9	Chest               	1.41	0.2591
//--------------------------------------------------
// 10	Arms                	1.52	0.3037
// 11	Arms                	1.57	0.3277
// 12	Arms	                2.02	0.3507
//--------------------------------------------------
// 13	waist               	2.12	0.399
// 14	waist	                2.14	0.412
// 15	waist	                2.20	0.4399
//--------------------------------------------------
// 16	Hips                	2:30	0.4985
// 17	Hips	                2:35	0.5225
// 18	Hips                	2:28	0.5400
//--------------------------------------------------
// 19	Thighs              	2:45	0.5771
// 20	Thighs              	2:49	0.5991
// 21	Thighs              	2.53	0.6197
//--------------------------------------------------
// 22	Calves              	3.02	0.6583
// 23	Claves              	3.08	0.6880
// 24	Claves              	3.14	0.7127
//--------------------------------------------------
// 25	full body showing   	3.27	0.7730
// 26	1st dot	                3.33	0.7952
// 27	2nd dot	                3.42	0.8288
// 28	3rd dot	                3.49	0.8524
// 29	4th dot	                3.54	0.8721
// 30	5th dot	                4.07	0.9123
// 31	6th dot	                4.15	0.9346
// 32	7th dot             	4.26	0.96021
// 33	8th dot	                4:40	0.9853

import { strings } from "../../../utility/locales/i18n";

export const BodyAnimationData = {
  neck: {
    name: strings("inchesLossJourney.neck"),
    firstFrame: 0.02292,
    ringCompleted: 0.0334,
    startUnwinding: 0.0619,
  },
  shoulder: {
    name: strings("inchesLossJourney.shoulder"),
    firstFrame: 0.1108,
    ringCompleted: 0.1104,
    startUnwinding: 0.1643,
  },
  chest: {
    name: strings("inchesLossJourney.chest"),
    firstFrame: 0.216,
    ringCompleted: 0.2309,
    startUnwinding: 0.2591,
  },
  arms: {
    name: strings("inchesLossJourney.arm"),
    firstFrame: 0.3037,
    ringCompleted: 0.3164,
    startUnwinding: 0.3507,
  },
  waist: {
    name: strings("inchesLossJourney.waist"),
    firstFrame: 0.399,
    ringCompleted: 0.3983,
    startUnwinding: 0.4399,
  },
  hips: {
    name: strings("inchesLossJourney.hips"),
    firstFrame: 0.4985,
    ringCompleted: 0.4848,
    startUnwinding: 0.54,
  },
  thighs: {
    name: strings("inchesLossJourney.thighs"),
    firstFrame: 0.5771,
    ringCompleted: 0.6023,
    startUnwinding: 0.6197,
  },
  calf: {
    name: strings("inchesLossJourney.calf"),
    firstFrame: 0.6583,
    ringCompleted: 0.6965,
    startUnwinding: 0.7127,
  },
};

export const DottedLineAnimationValues = {
  FullBody: 0.773,
  "1": 0.7928,
  "2": 0.8188,
  "3": 0.834,
  "4": 0.8527,
  "5": 0.904,
  "6": 0.9497,
  "7": 0.9706,
  "8": 0.9975,
};

export const AnimationInput = {
  Initial: 0,

  NeckStart: 1,
  NeckRingCompleted: 2,
  NeckUnwinding: 3,

  ShoulderStart: 4,
  ShoulderRingCompleted: 5,
  ShoulderUnwinding: 6,

  ChestStart: 7,
  ChestRingCompleted: 8,
  ChestUnwinding: 9,

  ArmsStart: 10,
  ArmsRingCompleted: 11,
  ArmsUnwinding: 12,

  WaistStart: 13,
  WaistRingCompleted: 14,
  WaistUnwinding: 15,

  HipsStart: 16,
  HipsRingCompleted: 17,
  HipsUnwinding: 18,

  ThighsStart: 19,
  ThighsRingCompleted: 20,
  ThighsUnwinding: 21,

  CalfStart: 22,
  CalfRingCompleted: 23,
  CalfUnwinding: 24,

  FullBody: 25,
  DotLine1: 26,
  DotLine2: 27,
  DotLine3: 28,
  DotLine4: 29,
  DotLine5: 30,
  DotLine6: 31,
  DotLine7: 32,
  DotLine8: 33,
  Completed: 34,
};

export const LottieAnimationInterpolationRange = {
  inputRange: [
    AnimationInput.NeckRingCompleted, //       ring around neck completed
    AnimationInput.ShoulderRingCompleted, //   start unwinding for shoulder
    AnimationInput.ChestRingCompleted, //      ring around chest completed
    AnimationInput.ArmsRingCompleted, //       ring around arms completed
    AnimationInput.WaistRingCompleted, //      ring around waist completed
    AnimationInput.HipsRingCompleted, //       ring around hips completed
    AnimationInput.ThighsRingCompleted, //     ring around thighs completed
    AnimationInput.CalfRingCompleted, //       ring around calf completed
    AnimationInput.FullBody, //                full body completed,
    AnimationInput.DotLine1, //                1st dotted line
    AnimationInput.DotLine2, //                2nd dotted line
    AnimationInput.DotLine3, //                3rd dotted line
    AnimationInput.DotLine4, //                4th dotted line
    AnimationInput.DotLine5, //                5th dotted line
    AnimationInput.DotLine6, //                6th dotted line
    AnimationInput.DotLine7, //                7th dotted line
    AnimationInput.DotLine8, //                8th dotted line
    AnimationInput.Completed,
  ],

  outputRange: [
    BodyAnimationData.neck.ringCompleted,
    BodyAnimationData.shoulder.ringCompleted,
    BodyAnimationData.chest.ringCompleted,
    BodyAnimationData.arms.ringCompleted,
    BodyAnimationData.waist.ringCompleted,
    BodyAnimationData.hips.ringCompleted,
    BodyAnimationData.thighs.ringCompleted,
    BodyAnimationData.calf.ringCompleted,
    DottedLineAnimationValues.FullBody,
    DottedLineAnimationValues[1],
    DottedLineAnimationValues[2],
    DottedLineAnimationValues[3],
    DottedLineAnimationValues[4],
    DottedLineAnimationValues[5],
    DottedLineAnimationValues[6],
    DottedLineAnimationValues[7],
    DottedLineAnimationValues[8],
    1,
  ],
};

export const BodyPartName = [
  strings("inchesLossJourney.neck"),
  strings("inchesLossJourney.shoulder"),
  strings("inchesLossJourney.chest"),
  strings("inchesLossJourney.arm"),
  strings("inchesLossJourney.waist"),
  strings("inchesLossJourney.hips"),
  strings("inchesLossJourney.thighs"),
  strings("inchesLossJourney.calf"),
];

/*
Total Height of frame : (1372, 2055)

Neck      : ( 535.6, 249.4)   = (0.3903, 0.1213)
Shoulder  : (987.8, 353.1)    = (0.7096, 0.1718)
Chest     : (422.2, 532.5)    = (0.3075, 0.2591)
Arms      : (1008.4, 559.4)   = (0.7349, 0.2722)
Waist     : (439.1, 674.4)    = (0.3200, 0.3281)
Hips      : (410.7, 867.0)    = (0.2993, 0.42189)
Thighs    : (980.3, 1135.1)   = (0.7145, 0.5523)
Calf      : (0982.7, 1625)    = (0.7162, 0.7907)

** after finishing animaition, line are swifted 0.03 points up to subtracting it from..
*/
export const LayoutMatrix = {
  [strings("inchesLossJourney.neck")]: {
    x: 0.3903,
    y: 0.0913,
    onLeft: true,
    animationOffset: AnimationInput.DotLine1,
    name: "neck",
  },
  [strings("inchesLossJourney.shoulder")]: {
    x: 0.7096,
    y: 0.1418,
    onLeft: false,
    animationOffset: AnimationInput.DotLine2,
    name: "shoulder",
  },
  [strings("inchesLossJourney.chest")]: {
    x: 0.3075,
    y: 0.2291,
    onLeft: true,
    animationOffset: AnimationInput.DotLine3,
    name: "chest",
  },
  [strings("inchesLossJourney.arm")]: {
    x: 0.7349,
    y: 0.2422,
    onLeft: false,
    animationOffset: AnimationInput.DotLine4,
    name: "arm",
  },
  [strings("inchesLossJourney.waist")]: {
    x: 0.32,
    y: 0.2981,
    onLeft: true,
    animationOffset: AnimationInput.DotLine5,
    name: "waist",
  },
  [strings("inchesLossJourney.hips")]: {
    x: 0.2993,
    y: 0.39189,
    onLeft: true,
    animationOffset: AnimationInput.DotLine6,
    name: "hips",
  },
  [strings("inchesLossJourney.thighs")]: {
    x: 0.7145,
    y: 0.5223,
    onLeft: false,
    animationOffset: AnimationInput.DotLine7,
    name: "thighs",
  },
  [strings("inchesLossJourney.calf")]: {
    x: 0.7162,
    y: 0.7607,
    onLeft: false,
    animationOffset: AnimationInput.DotLine8,
    name: "calf",
  },
};
