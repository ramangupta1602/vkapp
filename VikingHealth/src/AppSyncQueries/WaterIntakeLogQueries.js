import gql from "graphql-tag";

export const AddWaterIntakeLog = gql`
  mutation AddWaterIntakeLog(
    $waterIntake: Int!
    $date: AWSDate!
    $waterIntakeUnit: Int!
    $badgeType: Int
    $rewardPoints: Int
    $input: [RewardPoints]
  ) {
    addWaterIntakeLog(
      waterIntake: $waterIntake
      date: $date
      waterIntakeUnit: $waterIntakeUnit
      badgeType: $badgeType
      rewardPoints: $rewardPoints
      input: $input
    ) {
      waterIntake
      date
      waterIntakeUnit
      badgeType
      rewardPoints
    }
  }
`;

export const GetWaterIntakeLogs = gql`
  query GetWaterIntakeLogs(
    $userId: String!
    $fromDate: AWSDate!
    $toDate: AWSDate!
  ) {
    waterIntakeLogs(userId: $userId, fromDate: $fromDate, toDate: $toDate) {
      waterIntake
      date
      waterIntakeUnit
      badgeType
      rewardPoints
    }
  }
`;

export const WaterIntakeLogsForPatients = gql`
  query WaterIntakeLogsForPatients($userId: String!) {
    initialWaterIntakeLog(userId: $userId) {
      waterIntake
      waterIntakeUnit
      date
    }
    lastWaterIntakeLog(userId: $userId) {
      waterIntake
      date
      waterIntakeUnit
      rewardPoints
    }
  }
`;

export const InitialWaterIntakeLog = gql`
  query InitialWaterIntakeLog($userId: String!) {
    initialWaterIntakeLog(userId: $userId) {
      waterIntake
      waterIntakeUnit
      date
      rewardPoints
    }
  }
`;

export const LastRecordedWaterIntake = gql`
  query LastRecordedWaterIntake($userId: String!) {
    lastWaterIntakeLog(userId: $userId) {
      waterIntake
      date
      waterIntakeUnit
      rewardPoints
    }
  }
`;
