import gql from "graphql-tag";

export const AddBodyMeasurement = gql`
  mutation AddBodyMeasurement(
    $unit: Int!
    $date: AWSDate!
    $neck: Float!
    $shoulder: Float!
    $chest: Float!
    $arms: Float!
    $waist: Float!
    $hips: Float!
    $thighs: Float!
    $calf: Float!
    $week: Int!
    $rewardPoints: Int
    $input: [RewardPoints]
  ) {
    addBodyMeasurments(
      unit: $unit
      date: $date
      neck: $neck
      shoulder: $shoulder
      chest: $chest
      arms: $arms
      waist: $waist
      hips: $hips
      thighs: $thighs
      calf: $calf
      week: $week
      rewardPoints: $rewardPoints
      input: $input
    ) {
      userId
      unit
      date
      neck
      shoulder
      chest
      arms
      waist
      hips
      thighs
      calf
      week
      rewardPoints
    }
  }
`;

export const GetBodyMeasurementData = gql`
  query GetBodyMeasurementData(
    $userId: String!
    $fromDate: AWSDate!
    $toDate: AWSDate!
  ) {
    bodyMeasurements(userId: $userId, fromDate: $fromDate, toDate: $toDate) {
      userId
      unit
      date
      neck
      shoulder
      chest
      arms
      waist
      hips
      thighs
      calf
      week
      rewardPoints
    }
  }
`;

export const LastRecordedBodyMeasurement = gql`
  query LastRecordedBodyMeasurement($userId: String!) {
    lastBodyMeasurement(userId: $userId) {
      userId
      unit
      date
      neck
      shoulder
      chest
      arms
      waist
      hips
      thighs
      calf
      week
      rewardPoints
    }
  }
`;

export const InitialRecordedBodyMeasurementFromDate = gql`
  query InitialRecordedBodyMeasurementFromDate(
    $userId: String!
    $fromDate: AWSDate!
    $toDate: AWSDate!
  ) {
    initialBodyMeasurementLogFromDate(
      userId: $userId
      fromDate: $fromDate
      toDate: $toDate
    ) {
      userId
      unit
      date
      neck
      shoulder
      chest
      arms
      waist
      hips
      thighs
      calf
      week
      rewardPoints
    }
  }
`;

export const BodyMeasurementHistoryData = gql`
  query BodyMeasurementHistoryData(
    $userId: String!
    $fromDate: AWSDate!
    $toDate: AWSDate!
  ) {
    lastBodyMeasurement(userId: $userId) {
      userId
      unit
      date
      neck
      shoulder
      chest
      arms
      waist
      hips
      thighs
      calf
      week
      rewardPoints
    }

    initialBodyMeasurementLogFromDate(
      userId: $userId
      fromDate: $fromDate
      toDate: $toDate
    ) {
      userId
      unit
      date
      neck
      shoulder
      chest
      arms
      waist
      hips
      thighs
      calf
      week
      rewardPoints
    }
  }
`;
