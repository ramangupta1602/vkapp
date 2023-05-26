import gql from "graphql-tag";

export const AddWeightLog = gql`
  mutation AddWeightLog(
    $weight: Float!
    $date: AWSDate!
    $weightUnit: Int!
    $rewardPoints: Int
    $input: [RewardPoints]
  ) {
    addWeightLog(
      weight: $weight
      date: $date
      weightUnit: $weightUnit
      rewardPoints: $rewardPoints
      input: $input
    ) {
      weight
      date
      weightUnit
    }
  }
`;

export const GetWeightLogs = gql`
  query GetWeightLogs(
    $userId: String!
    $fromDate: AWSDate!
    $toDate: AWSDate!
  ) {
    weightLogs(userId: $userId, fromDate: $fromDate, toDate: $toDate) {
      weight
      date
      weightUnit
    }
  }
`;

export const WeightLogsForPatients = gql`
  query WeightLogsForPatients($userId: String!) {
    initialWeightLog(userId: $userId) {
      weight
      weightUnit
      date
    }
    lastWeightLog(userId: $userId) {
      weight
      date
      weightUnit
    }
  }
`;

export const WeightLogsForPatientsFromDate = gql`
  query WeightLogsForPatients(
    $userId: String!
    $fromDate: AWSDate!
    $toDate: AWSDate!
  ) {
    initialWeightLogFromDate(
      userId: $userId
      fromDate: $fromDate
      toDate: $toDate
    ) {
      weight
      weightUnit
      date
    }
    lastWeightLog(userId: $userId) {
      weight
      date
      weightUnit
    }
  }
`;

export const InitialWeightLog = gql`
  query InitialWeightLog($userId: String!) {
    initialWeightLog(userId: $userId) {
      weight
      weightUnit
      date
    }
  }
`;

export const InitialWeightLogFromDate = gql`
  query InitialWeightLogFromDate(
    $userId: String!
    $fromDate: AWSDate!
    $toDate: AWSDate!
  ) {
    initialWeightLogFromDate(
      userId: $userId
      fromDate: $fromDate
      toDate: $toDate
    ) {
      weight
      weightUnit
      date
    }
  }
`;

export const LastRecordedWeight = gql`
  query LastRecordedWeight($userId: String!) {
    lastWeightLog(userId: $userId) {
      weight
      date
      weightUnit
    }
  }
`;
