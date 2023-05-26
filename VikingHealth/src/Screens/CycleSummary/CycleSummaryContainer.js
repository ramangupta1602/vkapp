import React, { Component } from "react";
import { Text, View, ScrollView } from "react-native";
import Style from "./styles";
import { BackButton, PageTitle, CycleHistoryList } from "Components";
import { R } from "Resources";
import { inject, observer } from "mobx-react";
import { strings } from "../../utility/locales/i18n";
import WeightSummaryComponent from "./WeightSummaryComponent";
import BMSummaryComponent from "./BMSummaryComponent";
import { WeightLog } from "Library/Models/WeightLogModel";
import WaterIntakeSummaryComponent from "./WaterIntakeSummaryComponent";
import { BottomBarConstant } from "../../Components/Tabbar/BottomTabBar";
import { BottomBarContext } from "../../Context/BottomTabContext";

@observer
@inject("userAccountStore", "loginUserStore")
export class CycleSummaryContainer extends Component {
	static contextType = BottomBarContext;

	constructor(props) {
		super(props);

		this.cycleHistory = this.props.historyData;
		const selectedIndex = this.cycleHistory.length - 1;
		const selectedHistory = this.cycleHistory[selectedIndex];
		this.hasAlreadyShownAnimation = false;

		this.state = {
			selectedIndex,
			startDate: selectedHistory ? selectedHistory.startDate : "",
			endDate: selectedHistory ? selectedHistory.endDate : "",
			animate: false,
			shouldShowCurrentCycle: props.shouldShowCurrentCycle,
		};
	}

	onCycleClipSelected = ({ index, startDate, endDate }) => {
		this.setState({ selectedIndex: index, startDate, endDate });
	};

	getWeightLogObj = (data) => {
		return new WeightLog(data.weight, "", data.weightUnit);
	};

	componentDidUpdate(prevProps, prevState) {
		const previousProps = JSON.stringify(prevProps.historyData);
		const newProps = JSON.stringify(this.props.historyData);

		if (previousProps !== newProps) {
			this.cycleHistory = this.props.historyData;
			const selectedIndex = this.cycleHistory.length - 1;

			this.setState({
				selectedIndex: selectedIndex,
				shouldShowCurrentCycle: this.props.shouldShowCurrentCycle,
			});
		}
	}

	render() {
		const { selectedIndex } = this.state;
		const selectedHistoryObject = this.cycleHistory[selectedIndex];

		if (!selectedHistoryObject) {
			return null;
		}

		const {
			initialWeight,
			lastRecordedWeight,
			initialBM,
			lastRecordedBM,
			waterIntakeSummary,
		} = selectedHistoryObject;

		const initialWeightObj = this.getWeightLogObj(initialWeight);
		const finalWeightObj = this.getWeightLogObj(lastRecordedWeight);
		const initialBMI = this.props.userAccountStore.bmi(initialWeightObj);
		const finalBMI = this.props.userAccountStore.bmi(finalWeightObj);

		const { startDate, endDate, animate } = this.state;
		const {
			username,
			displayTargetWeight: targetWeight,
		} = this.props.userAccountStore;

		return (
			<View style={Style.containerStyle}>
				<ScrollView
					ref={(ref) => (this.scrollViewRef = ref)}
					scrollEventThrottle={16}
					onScroll={(event) => {
						const yOffset = event.nativeEvent.contentOffset.y;

						if (yOffset > 200) {
							this.context.setTabPopup(null);
						}

						if (
							this.containerOffset < yOffset &&
							!this.hasAlreadyShownAnimation
						) {
							this.setState({ animate: true }, () => {
								this.hasAlreadyShownAnimation = true;
							});
						}
					}}
				>
					{/* Header */}
					<View style={R.AppStyles.headerContainer}>
						<BackButton navigation={this.props.navigation} />

						<View style={Style.headerContainer}>
							<PageTitle title={strings("cycleSummary.title")} />
						</View>
					</View>

					<CycleHistoryList
						hideTitle
						hideCurrent={!this.state.shouldShowCurrentCycle}
						hideAll
						hideDivider
						borderColor="#DEE6EB"
						selectedColor="#024481"
						selectedTextColor="white"
						onChipSelected={this.onCycleClipSelected}
					/>

					<View style={Style.dataContainerStyle}>
						<WeightSummaryComponent
							initialWeightLog={initialWeight}
							finalWeightLog={lastRecordedWeight}
							initialBMI={initialBMI}
							finalBMI={finalBMI}
							weightUnit={this.props.loginUserStore.displayWeightUnit}
							userId={username}
							startDate={startDate}
							endDate={endDate}
							targetWeight={targetWeight}
						/>

						<View
							onLayout={(event) => {
								const { y } = event.nativeEvent.layout;
								this.containerOffset = y - 200;
							}}
						>
							<BMSummaryComponent
								initialBM={initialBM}
								lastRecordedBM={lastRecordedBM}
								cmHeight={this.props.userAccountStore.cmHeight}
								heightUnit={this.props.loginUserStore.displayHeightUnit}
								animate={animate && !this.hasAlreadyShownAnimation}
							/>
						</View>

						<WaterIntakeSummaryComponent
							waterIntakeSummary={waterIntakeSummary}
							waterDefaultUnit={
								this.props.loginUserStore.displayWaterIntakeUnit
							}
						/>
					</View>
				</ScrollView>
			</View>
		);
	}
}
