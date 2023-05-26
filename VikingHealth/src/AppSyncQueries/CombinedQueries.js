import gql from "graphql-tag";

export const DashboardFetchLogQuery = gql`
  query GetLastRecordedLog(
    $userId: String!
    $fromDate: AWSDate!
    $toDate: AWSDate!
    $programStartDate: AWSDate!
  ) {
    lastWaterIntakeLog(userId: $userId) {
      waterIntake
      date
      waterIntakeUnit
      rewardPoints
    }

    lastWeightLog(userId: $userId) {
      weight
      date
      weightUnit
    }

    lastDaysPerformance(userId: $userId) {
      rating
      date
      rewardPoints
    }

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

    weightLogs(userId: $userId, fromDate: $programStartDate, toDate: $toDate) {
      weight
      date
      weightUnit
    }

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
    }

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

// Don't use this query for normal history query, because it get data only till program end date.
// And in other case we want till last entry...
export const CurrentCycleHistory = gql`
  query GetCurrentCycleHistory(
    $userId: String!
    $fromDate: AWSDate!
    $toDate: AWSDate!
  ) {
    lastBodyMeasurementFromDate(
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
    }

    initialWeightLogFromDate(
      userId: $userId
      fromDate: $fromDate
      toDate: $toDate
    ) {
      weight
      weightUnit
      date
    }

    lastWeightLogFromDate(
      userId: $userId
      fromDate: $fromDate
      toDate: $toDate
    ) {
      weight
      date
      weightUnit
    }

    waterIntakeLogs(userId: $userId, fromDate: $fromDate, toDate: $toDate) {
      waterIntake
      date
      waterIntakeUnit
      badgeType
    }
  }
`;
