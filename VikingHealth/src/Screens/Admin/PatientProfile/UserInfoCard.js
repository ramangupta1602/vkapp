import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { RandomColors, CycleIndicator } from "Components";
import { R } from "../../../Resources";
import { styles } from "./UserInfoCardStyle";
import {
	RewardKeys,
	hasRewardExpired,
	convertPointToAmountString,
} from "../../Reward/RewardManager";
import { dynamicSize } from "../../../utility/ResizeUtil";

const ExpiredTextColor = "#8191A2";
const RegularTextColor = "#1072E0";

function getRewardInfo({
	totalReward,
	hasRedeemed,
	hasCreditExpired,
	creditUsed,
}) {
	const credit = convertPointToAmountString(totalReward);

	if (creditUsed) {
		return { text: `${credit} Credit`, buttonTitle: "Credit Used" };
	}

	const pointText = totalReward == 1 ? "Point" : "Points";

	if (!hasRedeemed && !hasCreditExpired) {
		return { text: `${totalReward} ${pointText} Earned`, buttonTitle: "" };
	}

	if (!hasRedeemed && hasCreditExpired) {
		return {
			text: `${totalReward} ${pointText}`,
			buttonTitle: `${pointText} Expired`,
			shouldShowCreditExpired: true,
			icon: R.Images.RewardImages.VHIcons.inActive,
			color: ExpiredTextColor,
		};
	}

	if (hasRedeemed && !hasCreditExpired) {
		return {
			text: `${credit} Credit Redeemed`,
			buttonTitle: "Approve",
			shouldShowApproveButton: true,
		};
	}

	if (hasRedeemed && hasCreditExpired) {
		return {
			text: `${credit} Credit `,
			buttonTitle: "Credit Expired",
			shouldShowCreditExpired: true,
			icon: R.Images.RewardImages.VHIcons.inActive,
			color: ExpiredTextColor,
		};
	}
}

const RewardComponent = ({ rewardData, startDate, onCreditApprove }) => {
	const {
		total: totalReward,
		[RewardKeys.HasRedeemedForCurrentCycle]: hasRedeemed,
		[RewardKeys.HasCreditUsed]: creditUsed = true,
	} = rewardData;

	const hasCreditExpired = hasRewardExpired(startDate);

	const {
		text,
		buttonTitle,
		shouldShowApproveButton,
		shouldShowCreditExpired,
		icon = R.Images.RewardImages.VHIcons.active,
		color = RegularTextColor,
	} = getRewardInfo({
		totalReward,
		hasRedeemed,
		hasCreditExpired,
		creditUsed,
	});

	return (
		<View style={{ marginTop: 5, marginLeft: 15 }}>
			<View style={{ flexDirection: "row", alignItems: "center" }}>
				<View
					style={{
						width: 25,
						height: 25,
						borderRadius: 12.5,
						overflow: "hidden",
						justifyContent: "center",
						alignItems: "center",
						backgroundColor: shouldShowCreditExpired ? "#E2E7ED" : "#D2E7FF",
					}}
				>
					<Image
						style={{ width: 11, height: 8, resizeMode: "contain" }}
						source={icon}
					/>
				</View>

				<Text style={[styles.inviteText, { marginLeft: 5, flex: 1, color }]}>
					{text}
				</Text>

				<View style={styles.rewardButtonsContainerStyle}>
					{shouldShowApproveButton && (
						<TouchableOpacity
							onPress={onCreditApprove}
							hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
						>
							<Text style={styles.approveTextStyle}>{buttonTitle}</Text>
						</TouchableOpacity>
					)}

					{shouldShowCreditExpired && (
						<View
							style={[
								styles.creditUsedContainer,
								{ backgroundColor: "#E7F3FB" },
							]}
						>
							<Text style={[styles.creditUsedTextStyle, { color: "#8695A6" }]}>
								{buttonTitle}
							</Text>
						</View>
					)}

					{creditUsed && (
						<View style={styles.creditUsedContainer}>
							<Text style={styles.creditUsedTextStyle}>{buttonTitle}</Text>
						</View>
					)}
				</View>
			</View>
		</View>
	);
};

export const UserInfoCard = (props) => {
	const {
		rewardData: { total: totalReward },
		userDetails,
	} = props;

	return (
		<View style={{ flex: 1 }}>
			<View style={styles.container}>
				<RandomColors
					gender={props.gender}
					height={40}
					width={40}
					number={props.phoneNumber}
				/>
				<View
					style={{
						marginLeft: 10,
						justifyContent: "center",
						flexDirection: "row",
						flex: 1,
						alignItems: "center",
					}}
				>
					<View style={{ flex: 1, flexDirection: "row" }}>
						<View style={{ flex: 1 }}>
							<Text style={[styles.nameStyle]}>{props.fullName}</Text>
							{!props.isInvited && (
								<View
									style={[styles.programDetail, { alignSelf: "flex-start" }]}
								>
									<Text style={styles.subInfoTextStyle}>{props.age}</Text>
								</View>
							)}
						</View>
						{/* show edit icon to delete patient details only when patient is in invited state */}
						{props.isInvited && (
							<TouchableOpacity
								style={{ marginRight: dynamicSize(30) }}
								onPress={() =>
									props.navigation.navigate("CreateNewUser", {
										isEdit: true,
										userDetails,
										title: "Edit Patient",
									})
								}
							>
								<Image source={R.Images.editPencil} />
							</TouchableOpacity>
						)}
					</View>

					{props.currentCycle > 1 && (
						<CycleIndicator
							intrinsicStyle={{ marginRight: -7, height: 24 }}
							currentCycle={props.currentCycle}
						/>
					)}
				</View>
			</View>
			<TouchableOpacity
				style={{ marginTop: 20, marginLeft: 15 }}
				onPress={props.onCallClick}
			>
				<View style={{ flexDirection: "row", alignItems: "center" }}>
					<Image
						style={{ width: 25, height: 25, resizeMode: "contain" }}
						source={R.Images.callIcon}
					/>
					<Text style={[styles.inviteText, { marginLeft: 5 }]}>
						{props.phoneNumber}
					</Text>
				</View>
			</TouchableOpacity>

			{props.email && (
				<TouchableOpacity
					style={{ marginTop: 5, marginLeft: 15 }}
					onPress={props._sendEmail}
				>
					<View style={{ flexDirection: "row", alignItems: "center" }}>
						<Image
							style={{ width: 25, height: 25, resizeMode: "contain" }}
							source={R.Images.msgIcon}
						/>
						<Text style={[styles.inviteText, { marginLeft: 5 }]}>
							{props.email}
						</Text>
					</View>
				</TouchableOpacity>
			)}

			{(props.currentCycle > 1 || props.hasProgramCompleted) && (
				<TouchableOpacity
					style={{ marginTop: 5, marginLeft: 15 }}
					onPress={props.onCycleClicked}
				>
					<View style={{ flexDirection: "row", alignItems: "center" }}>
						<Image
							style={{ width: 25, height: 25, resizeMode: "contain" }}
							source={R.Images.SummaryIcon}
						/>
						<Text style={[styles.inviteText, { marginLeft: 5 }]}>
							{"View Summary"}
						</Text>
					</View>
				</TouchableOpacity>
			)}

			{totalReward > 0 && (
				<RewardComponent
					rewardData={props.rewardData}
					startDate={props.startDate}
					onCreditApprove={props.onCreditApprove}
				/>
			)}
		</View>
	);
};
