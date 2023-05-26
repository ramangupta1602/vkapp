import gql from 'graphql-tag';

export const SendAppointmentRequest = gql`
  mutation sendAppointmentRequest($appointmentDetails: String!) {
    sendAppointmentRequest(appointmentDetails: $appointmentDetails)
  }
`;

export const GetAppointmentFor = gql`
  query GetAppointmentFor($appointmentId: String!) {
    getAppointmentFor(appointmentId: $appointmentId) {
      appointmentId
      status
      proposedSlot
      userDetails
      createdAt
      selectedSlot
      initiatedBy
      patientId
      modeOfAppointment
      reschdule_reason
    }
  }
`;

// query getCount {
//   getAppointmentCategoryCount(statusCategory:"[\"UPCOMING\",\"COMPLETED\",\"PENDING\"]")
// }
export const GetAppointmentsCount = gql`
  query getAppointmentCategoryCount($appointmentDetails: String!) {
    getAppointmentCategoryCount(appointmentDetails: $appointmentDetails)
  }
`;

export const AcceptAppointmentRequest = gql`
  mutation acceptAppointmentRequest($appointmentDetails: String!) {
    acceptAppointmentRequest(appointmentDetails: $appointmentDetails)
  }
`;

export const CancelAppointmentRequest = gql`
  mutation cancelAppointmentRequest($appointmentDetails: String!) {
    cancelAppointmentRequest(appointmentDetails: $appointmentDetails)
  }
`;

export const RejectAppointmentRequest = gql`
  mutation RejectAppointmentRequest($appointmentDetails: String!) {
    rejectAppointmentRequest(appointmentDetails: $appointmentDetails)
  }
`;

export const RescheduleAppointmentRequest = gql`
  mutation rescheduleAppointmentRequest($appointmentDetails: String!) {
    rescheduleAppointmentRequest(appointmentDetails: $appointmentDetails)
  }
`;

// mutation confirmApptRequest {
//   confirmAppointment(appointmentDetails:"{\"appointment\" :{\"appointmentId\":\"693acacc-82b4-4521-97ed-c461c021303b\",\"eventId\": \"123\"}}")
// }

export const ConfirmAppointmentRequest = gql`
  mutation confirmAppointment($appointmentDetails: String!) {
    confirmAppointment(appointmentDetails: $appointmentDetails)
  }
`;

export const GetAppointmentListForAdmin = gql`
  query getAppointmentListForAdmin(
    $type: String!
    $limit: Int!
    $nextToken: String
  ) {
    getAppointmentListForAdmin(
      type: $type
      limit: $limit
      nextToken: $nextToken
    ) {
      appointments {
        appointmentId
        status
        createdAt
        patientId
        proposedSlot
        statusCategory
        userDetails
        selectedSlot
        initiatedBy
        modeOfAppointment
      }
      nextToken
    }
  }
`;

export const GetAppointmentListForPatient = gql`
  query getAppointmentListForPatient($patientId: String!, $type: String!) {
    getAppointmentListForPatient(patientId: $patientId, type: $type) {
      appointments {
        appointmentId
        status
        createdAt
        patientId
        proposedSlot
        statusCategory
        userDetails
        selectedSlot
        initiatedBy
        modeOfAppointment
      }
    }
  }
`;

export const UpdateAppointmentStatus = gql`
  mutation updateAppointmentStatus(
    $appointmentId: String!
    $status: String!
    $statusCategory: String!
  ) {
    updateAppointmentStatus(
      appointmentId: $appointmentId
      status: $status
      statusCategory: $statusCategory
    ) {
      appointmentId
      status
      statusCategory
    }
  }
`;

export const PushNotificationToBookNewAppointment = gql`
  mutation PushNotificationToBookNewAppointment(
    $message: String!
    $patientId: String!
  ) {
    PushNotificationToBookNewAppointment(
      message: $message
      patientId: $patientId
    )
  }
`;

// export const GetLastCalorieIntake = gql`
//   query GetLastCalorieIntake($userId: String!) {
//     lastCalorieIntakeLog(userId: $userId) {
//       calorieIntake
//       date
//       dayNumber
//       rewardPoints
//     }
//   }
// `;

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
