import React from "react";
import { View, Text, Animated } from "react-native";
import Style, {
	HEIGHT_OF_TOTAL_LOSS_CONTAINER,
	MARGIN_BOTTOM_TOTAL_LOSS_CONTAINER,
} from "./styles";
import { strings } from "../../../utility/locales/i18n";
import { AnimationInput, BodyPartName } from "./ConfigData";
import { R } from "../../../Resources/R";

function getContainerStyle(animated: Animated.Value) {
	// +10 and -10 are to remove final jerky appearance of You have lost text at the end because of the container height
	const heightInterpolator = animated.interpolate({
		inputRange: [0, AnimationInput.CalfUnwinding, AnimationInput.FullBody],
		outputRange: [0, 0, HEIGHT_OF_TOTAL_LOSS_CONTAINER + 10],
		extrapolate: "clamp",
	});

	const marginInterpolator = animated.interpolate({
		inputRange: [0, AnimationInput.CalfUnwinding, AnimationInput.FullBody],
		outputRange: [0, 0, MARGIN_BOTTOM_TOTAL_LOSS_CONTAINER - 10],
		extrapolate: "clamp",
	});

	const opacityInterpolator = animated.interpolate({
		inputRange: [0, AnimationInput.CalfUnwinding, AnimationInput.FullBody],
		outputRange: [0, 0, 1],
		extrapolate: "clamp",
	});

	return {
		...Style.totalLossContainerStyle,
		height: heightInterpolator,
		opacity: opacityInterpolator,
		marginBottom: marginInterpolator,
	};
}

const TotalLossView = ({
	animated,
	data,
	isCurrentCycle,
	isAllSelected,
	heightUnitText,
	noOfCycle = 1,
}) => {
	const containerStyle = getContainerStyle(animated);
	let totalLoss = 0;

	BodyPartName.forEach((item) => {
		totalLoss += data[item.toLowerCase()];
	});

	let message;
	const gainOrLoss = totalLoss > 0 ? "Gained" : "Lost";
	const textColor =
		totalLoss > 0 ? R.Colors.COLOR_GAIN_RED : R.Colors.COLOR_LOSS_GREEN;

	if (noOfCycle === 1) {
		message = strings("inchesLossJourney.totalLossNoReload", {
			gainOrLoss,
		});
	} else if (isCurrentCycle) {
		message = strings("inchesLossJourney.totalLossCurrentCycle", {
			gainOrLoss,
		});
	} else if (isAllSelected) {
		message = strings("inchesLossJourney.totalLossProgram", {
			gainOrLoss,
		});
	} else {
		message = strings("inchesLossJourney.totalLossMessage", {
			gainOrLoss,
		});
	}

	return (
		<Animated.View
			style={containerStyle}
			testID="totalLossContainer"
			accessibilityLabel="totalLossContainer"
		>
			<Text
				testID="totalLossValue"
				accessibilityLabel="totalLossValue"
				style={[Style.totalLossTextStyle, { color: textColor }]}
			>
				{Math.abs(totalLoss.toFixed(1))} {heightUnitText}
			</Text>
			<Text
				testID="totalLossMessage"
				accessibilityLabel="totalLossMessage"
				style={Style.totalLossMessage}
			>
				{message}
			</Text>
		</Animated.View>
	);
};

export default TotalLossView;
