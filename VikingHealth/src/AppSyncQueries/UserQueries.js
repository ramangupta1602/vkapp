import gql from "graphql-tag";

export const CreatePatientMutation = gql`
	mutation CreatePatientMutation(
		$firstName: String!
		$lastName: String!
		$gender: String!
		$phoneNumber: AWSPhone!
		$email: AWSEmail!
		$programStartDate: AWSDate!
	) {
		invitePatient(
			firstName: $firstName
			lastName: $lastName
			gender: $gender
			phoneNumber: $phoneNumber
			email: $email
			programStartDate: $programStartDate
		) {
			httpStatus
			errorCode
			errorMessage
			data {
				firstName
				lastName
				phoneNumber
				gender
				programStartDate
				userId
				programEndDate
				invitedDate
				status
				onboardingStep
			}
		}
	}
`;

export const UpdateUserAppVersion = gql`
	mutation updateAppVersion(
		$userId: String!
		$appVersion: String!
		$controlVersion: Int!
		$deviceType: String!
	) {
		updateAppVersion(
			userId: $userId
			appVersion: $appVersion
			deviceType: $deviceType
			controlVersion: $controlVersion
		) {
			userId
			appVersion
			controlVersion
			deviceType
		}
	}
`;

export const UpdateCycleHistory = gql`
	mutation updateCycleHistory(
		$userId: String!
		$input: [CycleHistory]
		$phase: Int!
		$cycleStartDate: AWSDate!
		$programEndDate: AWSDate!
		$lastAcceptedCycle: Int!
		$rewardPointsHistory: [RewardHistory]
	) {
		updateCycleHistory(
			userId: $userId
			input: $input
			phase: $phase
			cycleStartDate: $cycleStartDate
			programEndDate: $programEndDate
			lastAcceptedCycle: $lastAcceptedCycle
			rewardPointsHistory: $rewardPointsHistory
		) {
			userId
			firstName
			lastName
			cycleStartDate
			programEndDate
			phase
			losingPhaseStartDate
			cycleHistory
			lastAcceptedCycle
		}
	}
`;

export const ResendInvitation = gql`
	mutation ResendInvitationMutation($userId: String!) {
		resendInvitation(userId: $userId) {
			httpStatus
			errorCode
			errorMessage
			data {
				firstName
				lastName
				phoneNumber
				gender
				programStartDate
				userId
				programEndDate
				invitedDate
				status
				onboardingStep
			}
		}
	}
`;

export const DeactivatePatient = gql`
	mutation DeactivatePatient($userId: String!) {
		deactivatePatient(userId: $userId) {
			httpStatus
			errorCode
			errorMessage
			data {
				firstName
				lastName
				phoneNumber
				gender
				programStartDate
				userId
				programEndDate
				invitedDate
				status
				onboardingStep
			}
		}
	}
`;

export const ActivatePatient = gql`
	mutation ActivatePatient($userId: String!) {
		activatePatient(userId: $userId) {
			httpStatus
			errorCode
			errorMessage
			data {
				firstName
				lastName
				phoneNumber
				gender
				programStartDate
				userId
				programEndDate
				invitedDate
				status
				onboardingStep
			}
		}
	}
`;

export const UpdateProgramEndDate = gql`
	mutation UpdateProgramEndDate($userId: String!, $date: AWSDate!) {
		updateProgramEndDate(userId: $userId, date: $date) {
			firstName
		}
	}
`;

// used in loading phase start program button click to change start and end date of program
// it also set onborading step to 4
export const UpdateProgramDates = gql`
	mutation UpdateProgramDates(
		$userId: String!
		$endDate: AWSDate!
		$startDate: AWSDate!
		$phase: Int!
		$losingPhaseStartDate: AWSDate
		$cycleStartDate: AWSDate
	) {
		updateProgramDates(
			userId: $userId
			endDate: $endDate
			startDate: $startDate
			phase: $phase
			losingPhaseStartDate: $losingPhaseStartDate
			cycleStartDate: $cycleStartDate
		) {
			programEndDate
			programStartDate
			firstName
			lastName
			phase
			losingPhaseStartDate
		}
	}
`;

export const AddPatientTargetWeight = gql`
	mutation AddPatientTargetWeight(
		$userId: String!
		$targetWeight: Float!
		$weightUnit: Int!
	) {
		addTargetWeight(
			userId: $userId
			targetWeight: $targetWeight
			weightUnit: $weightUnit
		) {
			userId
			targetWeight
			weightUnit
			displayWeightUnit
		}
	}
`;

export const UpdateWeightUnit = gql`
	mutation UpdateWeightUnit($weightUnit: Int!) {
		updateWeightUnit(weightUnit: $weightUnit) {
			userId
			displayWeightUnit
		}
	}
`;

export const UpdateHeightUnit = gql`
	mutation UpdateHeightUnit($heightUnit: Int!) {
		updateHeightUnit(heightUnit: $heightUnit) {
			userId
			displayHeightUnit
		}
	}
`;

export const BasicProfile = gql`
	query GetProfile($userId: String!) {
		getProfile(userId: $userId) {
			userId
			firstName
			lastName
			phoneNumber
			gender
			onboardingStep
			displayHeightUnit
			displayWeightUnit
		}
	}
`;

export const GetProfile = gql`
	query GetProfile($userId: String!) {
		getProfile(userId: $userId) {
			userId
			firstName
			middleName
			lastName
			dob
			email
			phoneNumber
			gender
			height
			heightUnit
			targetWeight
			weightUnit
			programStartDate
			programEndDate
			displayHeightUnit
			displayWeightUnit
			onboardingStep
			targetWaterIntake
			waterIntakeUnit
			phase
			losingPhaseStartDate
			currentCycle
			cycleStartDate
			lastAcceptedCycle
			cycleHistory
			rewardPoints
			rewardPointsHistory
		}
	}
`;

export const GetProgramStartDates = gql`
	query GetProfile($userId: String!) {
		getProfile(userId: $userId) {
			userId
			programStartDate
			programEndDate
			losingPhaseStartDate
		}
	}
`;

export const UpdatePhase = gql`
	mutation UpdatePhase($userId: String!, $phase: Int!) {
		updatePhase(userId: $userId, phase: $phase) {
			phase
		}
	}
`;

export const UpdateCurrentCycle = gql`
	mutation updateCurrentCycle($userId: String!, $currentCycle: Int!) {
		updateCurrentCycle(userId: $userId, currentCycle: $currentCycle) {
			userId
			currentCycle
		}
	}
`;

export const UpdateProfile = gql`
	mutation UpdateProfile(
		$firstName: String!
		$middleName: String
		$lastName: String!
		$email: AWSEmail!
		$dob: AWSDate!
		$gender: String!
		$height: Float
		$heightUnit: Int
		$onboardingStep: Int
		$displayWeightUnit: Int
	) {
		updateProfile(
			firstName: $firstName
			middleName: $middleName
			lastName: $lastName
			dob: $dob
			email: $email
			gender: $gender
			height: $height
			heightUnit: $heightUnit
			onboardingStep: $onboardingStep
			displayWeightUnit: $displayWeightUnit
		) {
			userId
			firstName
			middleName
			lastName
			dob
			email
			phoneNumber
			gender
			height
			heightUnit
			displayHeightUnit
			onboardingStep
			phase
		}
	}
`;

export const RedeemPoints = gql`
	mutation redeemPoints($userId: String!, $rewards: Rewards!) {
		redeemPoints(userId: $userId, rewards: $rewards) {
			rewardPoints
			userId
		}
	}
`;

export const PatientList = gql`
	query patientsList($type: Int!, $limit: Int!, $nextToken: String) {
		patientsList(type: $type, limit: $limit, nextToken: $nextToken) {
			patients {
				userId
				firstName
				lastName
				status
				programStartDate
				programEndDate
				invitedDate
				gender
				height
				heightUnit
				targetWeight
				weightUnit
				phoneNumber
				dob
				email
				targetWaterIntake
				waterIntakeUnit
				currentCycle
				cycleStartDate
				lastAcceptedCycle
				cycleHistory
				rewardPoints
				rewardPointsHistory
			}
			nextToken
		}
	}
`;

export const AppVersion = gql`
	query GetAppVersion {
		getAppVersion {
			id
			major
			minor
			build
			control
		}
	}
`;

export const SearchPatient = gql`
	query SearchPatient($search: String!) {
		searchPatient(search: $search) {
			firstName
			lastName
			userId
			status
			middleName
			invitedDate
			dob
			weightUnit
			targetWeight
			programStartDate
			programEndDate
			phoneNumber
			lastName
			heightUnit
			height
			gender
			email
			onboardingStep
			targetWaterIntake
			waterIntakeUnit
			currentCycle
			cycleStartDate
			lastAcceptedCycle
			cycleHistory
			rewardPoints
			rewardPointsHistory
		}
	}
`;

export const RegisterToken = gql`
	mutation registerUserToken(
		$user_id: String!
		$device_type: String!
		$newToken: String!
		$prevToken: String!
	) {
		registerUserToken(
			user_id: $user_id
			device_type: $device_type
			newToken: $newToken
			prevToken: $prevToken
		)
	}
`;

export const PublishNotification = gql`
	mutation sendNotificationToUser($user_id: String!) {
		sendNotificationToUser(user_id: $user_id)
	}
`;

export const RemoveUserToken = gql`
	mutation removeUserToken($user_id: String!, $token: String!) {
		removeUserToken(user_id: $user_id, token: $token)
	}
`;

export const UpdateInvitedPatientDetails = gql`
	mutation updateInvitedPatientDetails(
		$firstName: String!
		$lastName: String!
		$gender: String!
		$phoneNumber: AWSPhone!
		$email: AWSEmail!
		$programStartDate: AWSDate!
		$userId: String!
	) {
		updateInvitedPatientDetails(
			firstName: $firstName
			lastName: $lastName
			gender: $gender
			phoneNumber: $phoneNumber
			email: $email
			programStartDate: $programStartDate
			userId: $userId
		) {
			userId
		}
	}
`;
