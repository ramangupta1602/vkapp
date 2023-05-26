import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { GraphType } from "./AllSummaryGraphType";
import BodyMeasurementGraph from "./BodyMeasurementGraph";
import DailyPerformanceGraph from "./DailyPerformanceGraph";
import WaterIntakeGraph from "./WaterIntakeGraph";
import WeightGraph from "./WeightGraph";
import { Style } from "./styles";
import { strings } from "../../../utility/locales/i18n";
import { R } from "../../../Resources/R";
import { withNavigation } from "react-navigation";

const Graph = ({ graphType, width, height }) => {
	switch (graphType) {
		case GraphType.WEIGHT_GRAPH:
			return <WeightGraph width={width} height={height} />;

		case GraphType.BODY_MEASUREMENT_GRAPH:
			return <BodyMeasurementGraph width={width} height={height} />;

		case GraphType.DAY_PERFORMANCE_GRAPH:
			return <DailyPerformanceGraph width={width} height={height} />;

		case GraphType.WATER_INTAKE_GRAPH:
			return <WaterIntakeGraph width={width} height={height} />;

		default:
			return <View />;
	}
};

const getTitle = (graphType) => {
	switch (graphType) {
		case GraphType.WEIGHT_GRAPH:
			return strings("allSummaryGraphScreen.weightLossTitle");
		case GraphType.BODY_MEASUREMENT_GRAPH:
			return strings("allSummaryGraphScreen.bodyMeasurementTitle");
		case GraphType.DAY_PERFORMANCE_GRAPH:
			return strings("allSummaryGraphScreen.dayPerformanceTitle");
		case GraphType.WATER_INTAKE_GRAPH:
			return strings("allSummaryGraphScreen.waterIntakeTitle");
		default:
			return "";
	}
};

const AllSummaryGraphContainer = (props) => {
	const { graphType } = props;
	const title = getTitle(graphType);

	return (
		<View style={Style.graphScreenContainerStyle}>
			<Text style={Style.titleStyle}>{title}</Text>
			<Graph {...props} />

			<TouchableOpacity
				style={Style.closeIconStyle}
				onPress={() => {
					props.navigation.goBack();
				}}
			>
				<Image resizeMode="contain" source={R.Images.closeIcon} />
			</TouchableOpacity>
		</View>
	);
};

export default withNavigation(AllSummaryGraphContainer);
