import gql from "graphql-tag";

export const AddDayPerformance = gql`
  mutation AddDayPerformance(
    $rating: Int!
    $date: AWSDate!
    $rewardPoints: Int
    $input: [RewardPoints]
  ) {
    addDayPerformance(
      rating: $rating
      date: $date
      rewardPoints: $rewardPoints
      input: $input
    ) {
      rating
      date
      rewardPoints
    }
  }
`;

export const GetDaysPerformanceData = gql`
  query GetDaysPerformanceData(
    $userId: String!
    $fromDate: AWSDate!
    $toDate: AWSDate!
  ) {
    daysPerformance(userId: $userId, fromDate: $fromDate, toDate: $toDate) {
      rating
      date
      rewardPoints
    }
  }
`;

export const DaysPerformanceSummaryData = gql`
  query DaysPerformanceSummaryData($userId: String!) {
    daysPerformanceTotalData(userId: $userId) {
      excellentDaysCount
      goodDaysCount
      okayDaysCount
      poorDaysCount
      badDaysCount
    }
  }
`;

export const LastRecordedDayPerformance = gql`
  query LastRecordedDaysPerformance($userId: String!) {
    lastDaysPerformance(userId: $userId) {
      rating
      date
      rewardPoints
    }
  }
`;
