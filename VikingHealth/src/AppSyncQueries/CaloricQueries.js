import gql from "graphql-tag";

export const AddCalorieIntakeLog = gql`
  mutation AddCalorieIntakeLog(
    $calorieIntake: Int!
    $date: AWSDate!
    $dayNumber: Int!
    $rewardPoints: Int
    $input: [RewardPoints]
  ) {
    addCalorieIntakeLog(
      calorieIntake: $calorieIntake
      date: $date
      dayNumber: $dayNumber
      rewardPoints: $rewardPoints
      input: $input
    ) {
      calorieIntake
      date
      dayNumber
      rewardPoints
    }
  }
`;

export const GetLastCalorieIntake = gql`
  query GetLastCalorieIntake($userId: String!) {
    lastCalorieIntakeLog(userId: $userId) {
      calorieIntake
      date
      dayNumber
      rewardPoints
    }
  }
`;

/*

mutation addCalorieIntake {
  addCalorieIntakeLog(calorieIntake:900, date:"2019-11-15", dayNumber: 2) {
    calorieIntake
    date
    dayNumber
  }
}

query lastCalorieIntakeLog {
  lastCalorieIntakeLog(userId:"79a6c4bf-f6d2-42af-b9dc-d04757b6c851") {
    calorieIntake
    date
    dayNumber
    userId
  }
}

*/
