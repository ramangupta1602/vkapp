import gql from "graphql-tag";

export const GetGamificationLog = gql`
  query GetGamificationLog($userId: String!) {
    getGamificationLogs(userId: $userId) {
      waterIntakeConsDays
      lastCompletedWIGoalDate
    }
  }
`;

export const UpdateGamificationLogs = gql`
  mutation updateGamificationLog(
    $lastCompletedWIGoalDate: AWSDate!
    $waterIntakeConsDays: Int!
  ) {
    updateGamificationLog(
      lastCompletedWIGoalDate: $lastCompletedWIGoalDate
      waterIntakeConsDays: $waterIntakeConsDays
    ) {
      lastCompletedWIGoalDate
      waterIntakeConsDays
      userId
    }
  }
`;
